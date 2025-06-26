#!/usr/bin/env python3
"""
🐳 Docker-Based Algorithm Execution Engine
Secure, isolated algorithm execution with resource monitoring
"""

import docker
import tempfile
import os
import json
import time
import tracemalloc
import psutil
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import logging
import threading
import signal
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ExecutionConfig:
    """Configuration for algorithm execution"""
    memory_limit: str = "128m"  # Memory limit
    cpu_quota: int = 50000      # CPU quota (50% of one core)
    cpu_period: int = 100000    # CPU period
    timeout: int = 30           # Execution timeout in seconds
    network_disabled: bool = True  # Disable network access
    read_only: bool = True      # Read-only file system
    user: str = "nobody"        # Run as non-root user

@dataclass
class ResourceMetrics:
    """Resource usage metrics"""
    cpu_percent: float
    memory_usage_mb: float
    memory_limit_mb: float
    execution_time: float
    peak_memory_mb: float
    network_io: Dict[str, int]
    disk_io: Dict[str, int]

@dataclass
class ExecutionResult:
    """Result of algorithm execution"""
    success: bool
    result: Any
    error: Optional[str]
    execution_time: float
    resource_metrics: ResourceMetrics
    complexity_analysis: Dict[str, Any]
    stdout: str
    stderr: str
    exit_code: int

class DockerExecutor:
    """Docker-based algorithm executor with resource monitoring"""
    
    def __init__(self, config: ExecutionConfig = None):
        self.config = config or ExecutionConfig()
        self.docker_client = docker.from_env()
        self.active_containers = {}
        self._setup_execution_image()
    
    def _setup_execution_image(self):
        """Setup Docker image for algorithm execution"""
        dockerfile_content = """
FROM python:3.11-slim

# Install required packages
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir \\
    pytest \\
    pytest-benchmark \\
    pytest-timeout \\
    pytest-cov \\
    numpy \\
    psutil \\
    memory-profiler

# Create non-root user
RUN useradd -m -s /bin/bash runner

# Create execution directory
RUN mkdir -p /app/execution && chown runner:runner /app/execution

WORKDIR /app/execution
USER runner

# Default command
CMD ["python"]
"""
        
        # Build Docker image if it doesn't exist
        try:
            self.docker_client.images.get("algorithm-executor:latest")
            logger.info("📦 Using existing Docker image: algorithm-executor:latest")
        except docker.errors.ImageNotFound:
            logger.info("🔨 Building Docker image for algorithm execution...")
            
            # Create temporary Dockerfile
            with tempfile.NamedTemporaryFile(mode='w', suffix='.dockerfile', delete=False) as f:
                f.write(dockerfile_content)
                dockerfile_path = f.name
            
            try:
                image, logs = self.docker_client.images.build(
                    path=os.path.dirname(dockerfile_path),
                    dockerfile=os.path.basename(dockerfile_path),
                    tag="algorithm-executor:latest",
                    rm=True
                )
                logger.info("✅ Docker image built successfully")
            finally:
                os.unlink(dockerfile_path)
    
    def execute_algorithm(
        self, 
        algorithm_code: str, 
        test_data: Any, 
        algorithm_name: str,
        session_id: str
    ) -> ExecutionResult:
        """Execute algorithm in Docker container with monitoring"""
        
        container = None
        temp_dir = None
        
        try:
            # Create temporary directory for code
            temp_dir = tempfile.mkdtemp()
            
            # Write algorithm code to file
            algorithm_file = os.path.join(temp_dir, "algorithm.py")
            with open(algorithm_file, 'w') as f:
                f.write(self._wrap_algorithm_code(algorithm_code, test_data, algorithm_name))
            
            # Create execution script
            exec_script = os.path.join(temp_dir, "execute.py")
            with open(exec_script, 'w') as f:
                f.write(self._create_execution_script())
            
            # Start resource monitoring
            start_time = time.perf_counter()
            
            # Create and start container
            container = self._create_container(temp_dir, session_id)
            self.active_containers[session_id] = container
            
            # Monitor execution
            result = self._monitor_execution(container, start_time, session_id)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Execution failed: {e}")
            return ExecutionResult(
                success=False,
                result=None,
                error=str(e),
                execution_time=0,
                resource_metrics=self._get_empty_metrics(),
                complexity_analysis={},
                stdout="",
                stderr=str(e),
                exit_code=-1
            )
        finally:
            # Cleanup
            if container:
                try:
                    container.stop(timeout=5)
                    container.remove()
                except:
                    pass
                if session_id in self.active_containers:
                    del self.active_containers[session_id]
            
            if temp_dir:
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    def _wrap_algorithm_code(self, code: str, test_data: Any, algorithm_name: str) -> str:
        """Wrap algorithm code with execution framework"""
        wrapper = f"""
import json
import time
import tracemalloc
import sys
import gc
from typing import Any

# Algorithm code
{code}

def measure_performance():
    \"\"\"Measure algorithm performance\"\"\"
    # Start memory tracking
    tracemalloc.start()
    gc.collect()  # Clean garbage before measurement
    
    # Test data
    test_data = {json.dumps(test_data)}
    
    # Start timing
    start_time = time.perf_counter()
    
    try:
        # Execute algorithm
        if "{algorithm_name}" == "two_sum":
            result = {self._get_function_name(code)}(test_data["nums"], test_data["target"])
        else:
            # Auto-detect function and call it
            func_name = "{self._get_function_name(code)}"
            func = globals()[func_name]
            result = func(test_data)
        
        # End timing
        end_time = time.perf_counter()
        execution_time = end_time - start_time
        
        # Get memory stats
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        
        # Return results
        return {{
            "success": True,
            "result": result,
            "execution_time": execution_time,
            "memory_current": current,
            "memory_peak": peak,
            "error": None
        }}
        
    except Exception as e:
        tracemalloc.stop()
        return {{
            "success": False,
            "result": None,
            "execution_time": 0,
            "memory_current": 0,
            "memory_peak": 0,
            "error": str(e)
        }}

if __name__ == "__main__":
    result = measure_performance()
    print(json.dumps(result))
"""
        return wrapper
    
    def _get_function_name(self, code: str) -> str:
        """Extract function name from code"""
        lines = code.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('def ') and '(' in line:
                func_name = line.split('def ')[1].split('(')[0].strip()
                return func_name
        return "main"
    
    def _create_execution_script(self) -> str:
        """Create execution monitoring script"""
        return """
import subprocess
import json
import sys

try:
    result = subprocess.run(
        [sys.executable, "algorithm.py"],
        capture_output=True,
        text=True,
        timeout=25  # Slightly less than container timeout
    )
    
    if result.returncode == 0:
        print(result.stdout)
    else:
        error_result = {
            "success": False,
            "result": None,
            "execution_time": 0,
            "memory_current": 0,
            "memory_peak": 0,
            "error": result.stderr or "Unknown error"
        }
        print(json.dumps(error_result))
        
except subprocess.TimeoutExpired:
    timeout_result = {
        "success": False,
        "result": None,
        "execution_time": 0,
        "memory_current": 0,
        "memory_peak": 0,
        "error": "Execution timeout"
    }
    print(json.dumps(timeout_result))
except Exception as e:
    error_result = {
        "success": False,
        "result": None,
        "execution_time": 0,
        "memory_current": 0,
        "memory_peak": 0,
        "error": str(e)
    }
    print(json.dumps(error_result))
"""
    
    def _create_container(self, temp_dir: str, session_id: str) -> docker.models.containers.Container:
        """Create Docker container for execution"""
        
        # Container configuration
        container_config = {
            "image": "algorithm-executor:latest",
            "command": ["python", "execute.py"],
            "working_dir": "/app/execution",
            "volumes": {
                temp_dir: {"bind": "/app/execution", "mode": "ro"}
            },
            "mem_limit": self.config.memory_limit,
            "cpu_quota": self.config.cpu_quota,
            "cpu_period": self.config.cpu_period,
            "network_disabled": self.config.network_disabled,
            "read_only": self.config.read_only,
            "user": self.config.user,
            "detach": True,
            "remove": False,  # We'll remove manually
            "name": f"algo-exec-{session_id}",
            "labels": {
                "session_id": session_id,
                "type": "algorithm-execution"
            }
        }
        
        container = self.docker_client.containers.run(**container_config)
        return container
    
    def _monitor_execution(
        self, 
        container: docker.models.containers.Container, 
        start_time: float,
        session_id: str
    ) -> ExecutionResult:
        """Monitor container execution and collect metrics"""
        
        try:
            # Wait for container to finish with timeout
            exit_code = container.wait(timeout=self.config.timeout)
            
            # Get container logs
            stdout = container.logs(stdout=True, stderr=False).decode('utf-8')
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8')
            
            # Parse execution result
            try:
                exec_result = json.loads(stdout.strip().split('\n')[-1])
            except (json.JSONDecodeError, IndexError):
                exec_result = {
                    "success": False,
                    "result": None,
                    "execution_time": 0,
                    "memory_current": 0,
                    "memory_peak": 0,
                    "error": "Failed to parse execution result"
                }
            
            # Get resource metrics
            resource_metrics = self._collect_resource_metrics(container, start_time)
            
            # Analyze complexity
            complexity_analysis = self._analyze_complexity(
                exec_result.get("execution_time", 0),
                exec_result.get("memory_peak", 0)
            )
            
            return ExecutionResult(
                success=exec_result["success"],
                result=exec_result["result"],
                error=exec_result.get("error"),
                execution_time=exec_result["execution_time"],
                resource_metrics=resource_metrics,
                complexity_analysis=complexity_analysis,
                stdout=stdout,
                stderr=stderr,
                exit_code=exit_code["StatusCode"]
            )
            
        except docker.errors.ContainerError as e:
            return ExecutionResult(
                success=False,
                result=None,
                error=f"Container error: {e}",
                execution_time=time.perf_counter() - start_time,
                resource_metrics=self._get_empty_metrics(),
                complexity_analysis={},
                stdout="",
                stderr=str(e),
                exit_code=e.exit_status
            )
    
    def _collect_resource_metrics(
        self, 
        container: docker.models.containers.Container, 
        start_time: float
    ) -> ResourceMetrics:
        """Collect resource usage metrics from container"""
        
        try:
            # Get container stats
            stats = container.stats(stream=False)
            
            # Calculate CPU usage
            cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - \
                       stats["precpu_stats"]["cpu_usage"]["total_usage"]
            system_delta = stats["cpu_stats"]["system_cpu_usage"] - \
                          stats["precpu_stats"]["system_cpu_usage"]
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            
            # Memory usage
            memory_usage = stats["memory_stats"]["usage"]
            memory_limit = stats["memory_stats"]["limit"]
            
            # Network and disk I/O
            network_io = stats.get("networks", {})
            blkio_stats = stats.get("blkio_stats", {})
            
            return ResourceMetrics(
                cpu_percent=cpu_percent,
                memory_usage_mb=memory_usage / (1024 * 1024),
                memory_limit_mb=memory_limit / (1024 * 1024),
                execution_time=time.perf_counter() - start_time,
                peak_memory_mb=memory_usage / (1024 * 1024),  # Container peak
                network_io=network_io,
                disk_io=blkio_stats
            )
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to collect resource metrics: {e}")
            return self._get_empty_metrics()
    
    def _get_empty_metrics(self) -> ResourceMetrics:
        """Get empty resource metrics"""
        return ResourceMetrics(
            cpu_percent=0.0,
            memory_usage_mb=0.0,
            memory_limit_mb=128.0,
            execution_time=0.0,
            peak_memory_mb=0.0,
            network_io={},
            disk_io={}
        )
    
    def _analyze_complexity(self, execution_time: float, memory_usage: int) -> Dict[str, Any]:
        """Analyze algorithm complexity"""
        
        # Simple heuristic-based complexity analysis
        time_complexity = "O(1)"
        space_complexity = "O(1)"
        
        if execution_time > 0.1:
            time_complexity = "O(n²)"
        elif execution_time > 0.01:
            time_complexity = "O(n log n)"
        elif execution_time > 0.001:
            time_complexity = "O(n)"
        
        if memory_usage > 50 * 1024 * 1024:  # 50MB
            space_complexity = "O(n²)"
        elif memory_usage > 10 * 1024 * 1024:  # 10MB
            space_complexity = "O(n)"
        
        return {
            "estimated_time_complexity": time_complexity,
            "estimated_space_complexity": space_complexity,
            "confidence": 0.7,
            "analysis_method": "heuristic",
            "execution_time": execution_time,
            "memory_usage_bytes": memory_usage
        }
    
    def stop_execution(self, session_id: str) -> bool:
        """Stop running execution"""
        if session_id in self.active_containers:
            try:
                container = self.active_containers[session_id]
                container.stop(timeout=5)
                container.remove()
                del self.active_containers[session_id]
                return True
            except Exception as e:
                logger.error(f"Failed to stop execution {session_id}: {e}")
                return False
        return False
    
    def get_active_executions(self) -> List[str]:
        """Get list of active execution session IDs"""
        return list(self.active_containers.keys())
    
    def cleanup_all(self):
        """Cleanup all active containers"""
        for session_id in list(self.active_containers.keys()):
            self.stop_execution(session_id)
