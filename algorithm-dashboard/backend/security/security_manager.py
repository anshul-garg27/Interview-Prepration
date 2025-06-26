#!/usr/bin/env python3
"""
🔒 Security and Resource Management System
Comprehensive security measures for algorithm execution
"""

import os
import pwd
import grp
import resource
import signal
import time
import psutil
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from contextlib import contextmanager

logger = logging.getLogger(__name__)

@dataclass
class SecurityConfig:
    """Security configuration settings"""
    max_execution_time: int = 30      # Maximum execution time in seconds
    max_memory_mb: int = 128          # Maximum memory usage in MB
    max_cpu_percent: float = 50.0     # Maximum CPU usage percentage
    max_file_size_mb: int = 10        # Maximum file size in MB
    max_open_files: int = 64          # Maximum open file descriptors
    allowed_imports: List[str] = None # Allowed Python imports
    blocked_functions: List[str] = None # Blocked function calls
    network_access: bool = False      # Allow network access
    file_system_access: bool = False  # Allow file system access

@dataclass
class ResourceUsage:
    """Current resource usage metrics"""
    cpu_percent: float
    memory_mb: float
    execution_time: float
    open_files: int
    network_connections: int
    disk_io_read: int
    disk_io_write: int

class SecurityManager:
    """Manages security and resource limits for algorithm execution"""
    
    def __init__(self, config: SecurityConfig = None):
        self.config = config or SecurityConfig()
        self.active_processes: Dict[str, psutil.Process] = {}
        self.resource_monitors: Dict[str, Dict] = {}
        
        # Set default allowed imports if not specified
        if self.config.allowed_imports is None:
            self.config.allowed_imports = [
                'math', 'json', 'time', 'random', 'itertools', 'functools',
                'collections', 'heapq', 'bisect', 'typing', 'dataclasses'
            ]
        
        # Set default blocked functions if not specified
        if self.config.blocked_functions is None:
            self.config.blocked_functions = [
                'eval', 'exec', 'compile', '__import__', 'open', 'file',
                'input', 'raw_input', 'exit', 'quit', 'reload'
            ]
    
    def create_secure_environment(self, session_id: str) -> Dict[str, Any]:
        """Create secure execution environment"""
        try:
            # Set resource limits
            self._set_resource_limits()
            
            # Create restricted environment variables
            secure_env = self._create_restricted_env()
            
            # Setup signal handlers for timeout
            signal.signal(signal.SIGALRM, self._timeout_handler)
            signal.alarm(self.config.max_execution_time)
            
            logger.info(f"🔒 Secure environment created for session {session_id}")
            
            return {
                'env': secure_env,
                'limits': {
                    'memory_mb': self.config.max_memory_mb,
                    'cpu_percent': self.config.max_cpu_percent,
                    'execution_time': self.config.max_execution_time
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to create secure environment: {e}")
            raise SecurityError(f"Security setup failed: {e}")
    
    def validate_code_security(self, code: str) -> Dict[str, Any]:
        """Validate code for security issues"""
        security_report = {
            'safe': True,
            'warnings': [],
            'blocked_items': [],
            'risk_level': 'LOW'
        }
        
        # Check for blocked functions
        for func in self.config.blocked_functions:
            if func in code:
                security_report['safe'] = False
                security_report['blocked_items'].append(f"Blocked function: {func}")
                security_report['risk_level'] = 'HIGH'
        
        # Check for suspicious patterns
        suspicious_patterns = [
            'subprocess', 'os.system', 'os.popen', 'os.exec',
            'import os', 'import sys', 'import subprocess',
            '__builtins__', '__globals__', '__locals__',
            'globals()', 'locals()', 'vars()',
            'setattr', 'getattr', 'hasattr', 'delattr'
        ]
        
        for pattern in suspicious_patterns:
            if pattern in code:
                security_report['warnings'].append(f"Suspicious pattern: {pattern}")
                if security_report['risk_level'] == 'LOW':
                    security_report['risk_level'] = 'MEDIUM'
        
        # Check import statements
        import_lines = [line.strip() for line in code.split('\n') if line.strip().startswith('import') or line.strip().startswith('from')]
        for line in import_lines:
            module_name = self._extract_module_name(line)
            if module_name and module_name not in self.config.allowed_imports:
                security_report['warnings'].append(f"Unauthorized import: {module_name}")
                if security_report['risk_level'] == 'LOW':
                    security_report['risk_level'] = 'MEDIUM'
        
        # Check for file operations
        file_operations = ['open(', 'file(', 'with open', 'read(', 'write(']
        for op in file_operations:
            if op in code:
                if not self.config.file_system_access:
                    security_report['safe'] = False
                    security_report['blocked_items'].append(f"File operation: {op}")
                    security_report['risk_level'] = 'HIGH'
        
        return security_report
    
    def monitor_execution(self, session_id: str, process: psutil.Process) -> ResourceUsage:
        """Monitor resource usage during execution"""
        self.active_processes[session_id] = process
        
        try:
            # Get process info
            cpu_percent = process.cpu_percent()
            memory_info = process.memory_info()
            memory_mb = memory_info.rss / (1024 * 1024)  # Convert to MB
            
            # Get open files count
            try:
                open_files = len(process.open_files())
            except (psutil.AccessDenied, psutil.NoSuchProcess):
                open_files = 0
            
            # Get network connections count
            try:
                network_connections = len(process.connections())
            except (psutil.AccessDenied, psutil.NoSuchProcess):
                network_connections = 0
            
            # Get disk I/O
            try:
                io_counters = process.io_counters()
                disk_io_read = io_counters.read_bytes
                disk_io_write = io_counters.write_bytes
            except (psutil.AccessDenied, psutil.NoSuchProcess):
                disk_io_read = disk_io_write = 0
            
            # Calculate execution time
            create_time = process.create_time()
            execution_time = time.time() - create_time
            
            usage = ResourceUsage(
                cpu_percent=cpu_percent,
                memory_mb=memory_mb,
                execution_time=execution_time,
                open_files=open_files,
                network_connections=network_connections,
                disk_io_read=disk_io_read,
                disk_io_write=disk_io_write
            )
            
            # Check for violations
            self._check_resource_violations(session_id, usage)
            
            return usage
            
        except psutil.NoSuchProcess:
            logger.warning(f"⚠️ Process for session {session_id} no longer exists")
            return ResourceUsage(0, 0, 0, 0, 0, 0, 0)
        except Exception as e:
            logger.error(f"❌ Error monitoring session {session_id}: {e}")
            return ResourceUsage(0, 0, 0, 0, 0, 0, 0)
    
    def terminate_execution(self, session_id: str, reason: str = "Manual termination"):
        """Terminate execution for security violation"""
        if session_id in self.active_processes:
            try:
                process = self.active_processes[session_id]
                process.terminate()
                
                # Give process time to terminate gracefully
                try:
                    process.wait(timeout=5)
                except psutil.TimeoutExpired:
                    # Force kill if it doesn't terminate
                    process.kill()
                
                logger.warning(f"🛑 Terminated session {session_id}: {reason}")
                del self.active_processes[session_id]
                
            except Exception as e:
                logger.error(f"❌ Error terminating session {session_id}: {e}")
    
    def cleanup_session(self, session_id: str):
        """Clean up session resources"""
        if session_id in self.active_processes:
            del self.active_processes[session_id]
        
        if session_id in self.resource_monitors:
            del self.resource_monitors[session_id]
        
        # Clear any remaining signal alarms
        signal.alarm(0)
    
    def get_security_report(self) -> Dict[str, Any]:
        """Get comprehensive security report"""
        return {
            'active_sessions': len(self.active_processes),
            'total_memory_usage': sum(
                self.monitor_execution(sid, proc).memory_mb 
                for sid, proc in self.active_processes.items()
            ),
            'security_config': {
                'max_memory_mb': self.config.max_memory_mb,
                'max_execution_time': self.config.max_execution_time,
                'max_cpu_percent': self.config.max_cpu_percent,
                'network_access': self.config.network_access,
                'file_system_access': self.config.file_system_access
            },
            'violations_detected': sum(
                len(monitor.get('violations', [])) 
                for monitor in self.resource_monitors.values()
            )
        }
    
    def _set_resource_limits(self):
        """Set system resource limits"""
        try:
            # Memory limit
            memory_limit = self.config.max_memory_mb * 1024 * 1024  # Convert to bytes
            resource.setrlimit(resource.RLIMIT_AS, (memory_limit, memory_limit))
            
            # CPU time limit
            cpu_limit = self.config.max_execution_time
            resource.setrlimit(resource.RLIMIT_CPU, (cpu_limit, cpu_limit))
            
            # File descriptor limit
            resource.setrlimit(resource.RLIMIT_NOFILE, (self.config.max_open_files, self.config.max_open_files))
            
            # File size limit
            file_size_limit = self.config.max_file_size_mb * 1024 * 1024
            resource.setrlimit(resource.RLIMIT_FSIZE, (file_size_limit, file_size_limit))
            
        except Exception as e:
            logger.warning(f"⚠️ Could not set all resource limits: {e}")
    
    def _create_restricted_env(self) -> Dict[str, str]:
        """Create restricted environment variables"""
        # Start with minimal environment
        restricted_env = {
            'PATH': '/usr/local/bin:/usr/bin:/bin',
            'PYTHONPATH': '',
            'HOME': '/tmp',
            'USER': 'nobody',
            'LANG': 'C.UTF-8',
            'LC_ALL': 'C.UTF-8'
        }
        
        # Remove potentially dangerous environment variables
        dangerous_vars = [
            'LD_PRELOAD', 'LD_LIBRARY_PATH', 'PYTHONSTARTUP',
            'PYTHONHOME', 'PYTHONEXECUTABLE'
        ]
        
        for var in dangerous_vars:
            restricted_env.pop(var, None)
        
        return restricted_env
    
    def _extract_module_name(self, import_line: str) -> Optional[str]:
        """Extract module name from import statement"""
        try:
            if import_line.startswith('import '):
                module = import_line[7:].split()[0].split('.')[0]
                return module
            elif import_line.startswith('from '):
                module = import_line[5:].split()[0].split('.')[0]
                return module
        except Exception:
            pass
        return None
    
    def _check_resource_violations(self, session_id: str, usage: ResourceUsage):
        """Check for resource limit violations"""
        violations = []
        
        # Memory check
        if usage.memory_mb > self.config.max_memory_mb:
            violations.append(f"Memory usage ({usage.memory_mb:.1f}MB) exceeds limit ({self.config.max_memory_mb}MB)")
        
        # CPU check
        if usage.cpu_percent > self.config.max_cpu_percent:
            violations.append(f"CPU usage ({usage.cpu_percent:.1f}%) exceeds limit ({self.config.max_cpu_percent}%)")
        
        # Execution time check
        if usage.execution_time > self.config.max_execution_time:
            violations.append(f"Execution time ({usage.execution_time:.1f}s) exceeds limit ({self.config.max_execution_time}s)")
        
        # File descriptor check
        if usage.open_files > self.config.max_open_files:
            violations.append(f"Open files ({usage.open_files}) exceeds limit ({self.config.max_open_files})")
        
        # Network check
        if not self.config.network_access and usage.network_connections > 0:
            violations.append(f"Unauthorized network connections detected ({usage.network_connections})")
        
        if violations:
            # Store violations for reporting
            if session_id not in self.resource_monitors:
                self.resource_monitors[session_id] = {'violations': []}
            
            self.resource_monitors[session_id]['violations'].extend(violations)
            
            # Terminate for critical violations
            critical_violations = ['Memory usage', 'Execution time', 'Unauthorized network']
            for violation in violations:
                if any(critical in violation for critical in critical_violations):
                    self.terminate_execution(session_id, f"Security violation: {violation}")
                    break
    
    def _timeout_handler(self, signum, frame):
        """Handle execution timeout"""
        raise TimeoutError("Algorithm execution timed out")

class SecurityError(Exception):
    """Custom exception for security-related errors"""
    pass

@contextmanager
def secure_execution_context(security_manager: SecurityManager, session_id: str):
    """Context manager for secure algorithm execution"""
    try:
        # Setup secure environment
        env_info = security_manager.create_secure_environment(session_id)
        yield env_info
        
    except TimeoutError:
        logger.warning(f"⏰ Execution timeout for session {session_id}")
        raise
    except SecurityError:
        logger.error(f"🔒 Security violation for session {session_id}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in session {session_id}: {e}")
        raise
    finally:
        # Cleanup
        security_manager.cleanup_session(session_id)

# Utility functions for Docker integration
def create_docker_security_config() -> Dict[str, Any]:
    """Create Docker security configuration"""
    return {
        'security_opt': ['no-new-privileges:true'],
        'cap_drop': ['ALL'],
        'cap_add': [],  # No additional capabilities
        'read_only': True,
        'tmpfs': {'/tmp': 'rw,noexec,nosuid,size=100m'},
        'ulimits': [
            {'name': 'nofile', 'soft': 64, 'hard': 64},
            {'name': 'nproc', 'soft': 16, 'hard': 16},
            {'name': 'cpu', 'soft': 30, 'hard': 30},
            {'name': 'as', 'soft': 134217728, 'hard': 134217728}  # 128MB
        ],
        'network_disabled': True,
        'pids_limit': 32,
        'memory': '128m',
        'memory_swap': '128m',
        'oom_kill_disable': False,
        'cpu_quota': 50000,  # 50% of one core
        'cpu_period': 100000
    }

def validate_docker_image_security(image_name: str) -> bool:
    """Validate Docker image security"""
    # Add image security validation logic here
    # Check for known vulnerabilities, malicious content, etc.
    
    allowed_images = [
        'python:3.11-slim',
        'python:3.11-alpine',
        'algorithm-executor:latest',
        'algorithm-tester:latest'
    ]
    
    return image_name in allowed_images
