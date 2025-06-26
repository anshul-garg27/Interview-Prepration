#!/usr/bin/env python3
"""
🚀 Enhanced WebSocket Server
Integrates Docker execution, live analytics, and real testing framework
"""

import asyncio
import websockets
import json
import logging
import time
from typing import Dict, List, Any, Optional
from dataclasses import asdict
import threading
import signal
import sys
from pathlib import Path

# Import our custom components
from execution.docker_executor import DockerExecutor, ExecutionConfig
from analytics.performance_analytics import PerformanceAnalytics, PerformancePoint
from testing.test_framework import TestFramework, TestCase

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EnhancedWebSocketServer:
    """Enhanced WebSocket server with full algorithm execution platform"""
    
    def __init__(self, host: str = "localhost", port: int = 8765):
        self.host = host
        self.port = port
        self.clients: set = set()
        self.active_sessions: Dict[str, Dict] = {}
        
        # Initialize core components
        self.docker_executor = DockerExecutor()
        self.performance_analytics = PerformanceAnalytics()
        self.test_framework = TestFramework()
        
        # Start analytics engine
        self.performance_analytics.start_analytics()
        self.performance_analytics.subscribe(self._handle_analytics_update)
        
        # Supported algorithms
        self.algorithms = {
            "two_sum": {
                "name": "Two Sum",
                "description": "Find two numbers that add up to target",
                "template": self._get_two_sum_template(),
                "complexity": {"time": "O(n)", "space": "O(n)"}
            },
            "binary_search": {
                "name": "Binary Search", 
                "description": "Search in sorted array",
                "template": self._get_binary_search_template(),
                "complexity": {"time": "O(log n)", "space": "O(1)"}
            },
            "container_water": {
                "name": "Container With Most Water",
                "description": "Find container that holds most water",
                "template": self._get_container_water_template(),
                "complexity": {"time": "O(n)", "space": "O(1)"}
            }
        }
    
    async def start_server(self):
        """Start the WebSocket server"""
        logger.info(f"🚀 Starting Enhanced Algorithm Execution Server on {self.host}:{self.port}")
        
        # Setup graceful shutdown
        loop = asyncio.get_event_loop()
        for sig in [signal.SIGTERM, signal.SIGINT]:
            loop.add_signal_handler(sig, self._shutdown)
        
        try:
            async with websockets.serve(self.handle_client, self.host, self.port):
                logger.info("✅ Server started successfully!")
                logger.info("📊 Performance analytics engine running")
                logger.info("🐳 Docker execution engine ready")
                logger.info("🧪 Testing framework initialized")
                
                # Keep server running
                await asyncio.Future()  # Run forever
                
        except Exception as e:
            logger.error(f"❌ Server failed to start: {e}")
            self._shutdown()
    
    async def handle_client(self, websocket, path=None):
        """Handle new WebSocket client connection"""
        client_id = f"client_{id(websocket)}"
        await self.register_client(websocket, client_id)
        
        try:
            async for message in websocket:
                data = json.loads(message)
                await self.process_message(websocket, data, client_id)
                
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"🔌 Client {client_id} disconnected")
        except Exception as e:
            logger.error(f"❌ Error handling client {client_id}: {e}")
        finally:
            await self.unregister_client(websocket, client_id)
    
    async def register_client(self, websocket, client_id: str):
        """Register new client"""
        self.clients.add(websocket)
        logger.info(f"✅ Client {client_id} connected. Total clients: {len(self.clients)}")
        
        # Send welcome message with server capabilities
        welcome_message = {
            "type": "SERVER_WELCOME",
            "server_version": "2.0.0",
            "capabilities": [
                "DOCKER_EXECUTION",
                "LIVE_ANALYTICS", 
                "REAL_TESTING",
                "MULTI_ALGORITHM",
                "SECURITY_SANDBOX"
            ],
            "supported_algorithms": list(self.algorithms.keys()),
            "timestamp": time.time()
        }
        
        await websocket.send(json.dumps(welcome_message))
    
    async def unregister_client(self, websocket, client_id: str):
        """Unregister client and cleanup"""
        self.clients.discard(websocket)
        
        # Cancel any active sessions for this client
        sessions_to_cancel = [
            session_id for session_id, session in self.active_sessions.items()
            if session.get('client_id') == client_id
        ]
        
        for session_id in sessions_to_cancel:
            self.docker_executor.stop_execution(session_id)
            del self.active_sessions[session_id]
        
        logger.info(f"👋 Client {client_id} disconnected. Total clients: {len(self.clients)}")
    
    async def process_message(self, websocket, data: dict, client_id: str):
        """Process incoming WebSocket message"""
        
        # 📥 Log received data (as we added before)
        print(f"\n📥 RECEIVED FROM FRONTEND:")
        print(f"   Type: {data.get('type', 'UNKNOWN')}")
        print(f"   Session ID: {data.get('sessionId', 'N/A')}")
        print(f"   Algorithm Name: {data.get('algorithmName', 'N/A')}")
        print(f"   Client ID: {client_id}")
        
        if 'testData' in data:
            print(f"   Test Data: {data['testData']}")
        
        if 'algorithmCode' in data:
            code_preview = data['algorithmCode'][:100].replace('\n', '\\n') + '...'
            print(f"   Algorithm Code Preview: {code_preview}")
        
        print(f"   All Data Keys: {list(data.keys())}")
        print("-" * 60)
        
        message_type = data.get('type')
        
        try:
            if message_type == 'EXECUTE_ALGORITHM':
                await self.handle_algorithm_execution(websocket, data, client_id)
            elif message_type == 'PERFORMANCE_BENCHMARK':
                await self.handle_performance_benchmark(websocket, data, client_id)
            elif message_type == 'RUN_TESTS':
                await self.handle_test_execution(websocket, data, client_id)
            elif message_type == 'GET_ALGORITHMS':
                await self.handle_get_algorithms(websocket, data, client_id)
            elif message_type == 'GET_ANALYTICS':
                await self.handle_get_analytics(websocket, data, client_id)
            elif message_type == 'STOP_EXECUTION':
                await self.handle_stop_execution(websocket, data, client_id)
            else:
                error_msg = f'Unknown message type: {message_type}'
                await self.send_error(websocket, error_msg, data.get('sessionId'))
                
        except Exception as e:
            logger.error(f"❌ Error processing message: {e}")
            await self.send_error(websocket, str(e), data.get('sessionId'))
    
    async def handle_algorithm_execution(self, websocket, data: dict, client_id: str):
        """Handle single algorithm execution request"""
        session_id = data.get('sessionId')
        algorithm_code = data.get('algorithmCode')
        test_data = data.get('testData')
        algorithm_name = data.get('algorithmName', 'unknown')
        
        # Validate required fields
        if not all([session_id, algorithm_code, test_data]):
            await self.send_error(websocket, "Missing required fields", session_id)
            return
        
        # Store session info
        self.active_sessions[session_id] = {
            'client_id': client_id,
            'type': 'execution',
            'algorithm_name': algorithm_name,
            'start_time': time.time()
        }
        
        # Send execution started
        await websocket.send(json.dumps({
            'type': 'EXECUTION_STARTED',
            'sessionId': session_id,
            'algorithmName': algorithm_name,
            'timestamp': time.time()
        }))
        
        try:
            # Execute in Docker
            result = self.docker_executor.execute_algorithm(
                algorithm_code, test_data, algorithm_name, session_id
            )
            
            # Create performance point
            if result.success:
                perf_point = PerformancePoint(
                    timestamp=time.time(),
                    input_size=len(test_data.get('nums', [1])) if isinstance(test_data, dict) else 1,
                    execution_time=result.execution_time,
                    memory_usage=result.resource_metrics.memory_usage_mb,
                    cpu_usage=result.resource_metrics.cpu_percent,
                    algorithm_name=algorithm_name,
                    session_id=session_id
                )
                
                # Add to analytics
                self.performance_analytics.add_performance_point(perf_point)
            
            # Send execution step result
            await websocket.send(json.dumps({
                'type': 'EXECUTION_STEP',
                'sessionId': session_id,
                'algorithmName': algorithm_name,
                'result': result.result,
                'performanceMetrics': {
                    'executionTime': result.execution_time,
                    'memoryUsage': result.resource_metrics.memory_usage_mb,
                    'cpuUsage': result.resource_metrics.cpu_percent
                },
                'complexityAnalysis': result.complexity_analysis,
                'inputSize': len(test_data.get('nums', [1])) if isinstance(test_data, dict) else 1,
                'timestamp': time.time()
            }))
            
            # Send completion
            await websocket.send(json.dumps({
                'type': 'EXECUTION_COMPLETED',
                'sessionId': session_id,
                'success': result.success,
                'error': result.error,
                'timestamp': time.time()
            }))
            
        except Exception as e:
            await self.send_error(websocket, f"Execution failed: {e}", session_id)
        finally:
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
    
    async def handle_performance_benchmark(self, websocket, data: dict, client_id: str):
        """Handle performance benchmark request"""
        session_id = data.get('sessionId')
        algorithm_code = data.get('algorithmCode')
        algorithm_name = data.get('algorithmName', 'unknown')
        
        if not all([session_id, algorithm_code]):
            await self.send_error(websocket, "Missing required fields", session_id)
            return
        
        # Store session info
        self.active_sessions[session_id] = {
            'client_id': client_id,
            'type': 'benchmark',
            'algorithm_name': algorithm_name,
            'start_time': time.time()
        }
        
        # Send benchmark started
        await websocket.send(json.dumps({
            'type': 'BENCHMARK_STARTED',
            'sessionId': session_id,
            'algorithmName': algorithm_name,
            'timestamp': time.time()
        }))
        
        try:
            # Define benchmark input sizes
            input_sizes = [100, 500, 1000, 2500, 5000]
            total_sizes = len(input_sizes)
            
            benchmark_results = []
            
            for i, size in enumerate(input_sizes):
                # Generate test data based on algorithm
                test_data = self._generate_test_data(algorithm_name, size)
                
                # Execute algorithm
                result = self.docker_executor.execute_algorithm(
                    algorithm_code, test_data, algorithm_name, f"{session_id}_{i}"
                )
                
                if result.success:
                    # Create performance point
                    perf_point = PerformancePoint(
                        timestamp=time.time(),
                        input_size=size,
                        execution_time=result.execution_time,
                        memory_usage=result.resource_metrics.memory_usage_mb,
                        cpu_usage=result.resource_metrics.cpu_percent,
                        algorithm_name=algorithm_name,
                        session_id=session_id
                    )
                    
                    # Add to analytics
                    self.performance_analytics.add_performance_point(perf_point)
                    
                    # Store result
                    benchmark_result = {
                        'inputSize': size,
                        'executionTime': result.execution_time,
                        'memoryUsage': result.resource_metrics.memory_usage_mb,
                        'complexityFit': {
                            'bestFit': result.complexity_analysis.get('estimated_time_complexity', 'O(n)'),
                            'confidence': result.complexity_analysis.get('confidence', 0.7)
                        }
                    }
                    benchmark_results.append(benchmark_result)
                    
                    # Send progress update
                    await websocket.send(json.dumps({
                        'type': 'BENCHMARK_PROGRESS',
                        'sessionId': session_id,
                        'currentSize': i + 1,
                        'totalSizes': total_sizes,
                        'result': benchmark_result,
                        'timestamp': time.time()
                    }))
                else:
                    logger.warning(f"Benchmark failed for size {size}: {result.error}")
            
            # Send final results with complexity analysis
            if benchmark_results:
                trend = self.performance_analytics.get_algorithm_trend(algorithm_name)
                
                await websocket.send(json.dumps({
                    'type': 'BENCHMARK_COMPLETED',
                    'sessionId': session_id,
                    'results': benchmark_results,
                    'complexityAnalysis': asdict(trend.time_complexity) if trend else None,
                    'performanceTrend': asdict(trend) if trend else None,
                    'timestamp': time.time()
                }))
            else:
                await self.send_error(websocket, "All benchmark tests failed", session_id)
                
        except Exception as e:
            await self.send_error(websocket, f"Benchmark failed: {e}", session_id)
        finally:
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
    
    async def handle_test_execution(self, websocket, data: dict, client_id: str):
        """Handle comprehensive test execution request"""
        session_id = data.get('sessionId')
        algorithm_code = data.get('algorithmCode')
        algorithm_name = data.get('algorithmName', 'unknown')
        custom_tests = data.get('customTests', [])
        
        if not all([session_id, algorithm_code]):
            await self.send_error(websocket, "Missing required fields", session_id)
            return
        
        # Store session info
        self.active_sessions[session_id] = {
            'client_id': client_id,
            'type': 'testing',
            'algorithm_name': algorithm_name,
            'start_time': time.time()
        }
        
        # Send testing started
        await websocket.send(json.dumps({
            'type': 'TESTING_STARTED',
            'sessionId': session_id,
            'algorithmName': algorithm_name,
            'timestamp': time.time()
        }))
        
        try:
            # Convert custom tests if provided
            test_cases = None
            if custom_tests:
                test_cases = [
                    TestCase(
                        name=test.get('name', f'test_{i}'),
                        input_data=test.get('input'),
                        expected_output=test.get('expected'),
                        description=test.get('description', '')
                    )
                    for i, test in enumerate(custom_tests)
                ]
            
            # Run test suite
            result = self.test_framework.run_test_suite(
                algorithm_name, algorithm_code, test_cases
            )
            
            # Send test results
            await websocket.send(json.dumps({
                'type': 'TESTING_COMPLETED',
                'sessionId': session_id,
                'testResults': asdict(result),
                'timestamp': time.time()
            }))
            
        except Exception as e:
            await self.send_error(websocket, f"Testing failed: {e}", session_id)
        finally:
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
    
    async def handle_get_algorithms(self, websocket, data: dict, client_id: str):
        """Handle request for available algorithms"""
        await websocket.send(json.dumps({
            'type': 'ALGORITHMS_LIST',
            'algorithms': self.algorithms,
            'timestamp': time.time()
        }))
    
    async def handle_get_analytics(self, websocket, data: dict, client_id: str):
        """Handle request for analytics data"""
        algorithm_name = data.get('algorithmName')
        
        if algorithm_name:
            # Get specific algorithm analytics
            trend = self.performance_analytics.get_algorithm_trend(algorithm_name)
            response = {
                'type': 'ANALYTICS_DATA',
                'algorithmName': algorithm_name,
                'trend': asdict(trend) if trend else None,
                'timestamp': time.time()
            }
        else:
            # Get general analytics
            metrics = self.performance_analytics.get_real_time_metrics()
            response = {
                'type': 'ANALYTICS_DATA',
                'metrics': metrics,
                'timestamp': time.time()
            }
        
        await websocket.send(json.dumps(response))
    
    async def handle_stop_execution(self, websocket, data: dict, client_id: str):
        """Handle stop execution request"""
        session_id = data.get('sessionId')
        
        if session_id and session_id in self.active_sessions:
            success = self.docker_executor.stop_execution(session_id)
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
            
            await websocket.send(json.dumps({
                'type': 'EXECUTION_STOPPED',
                'sessionId': session_id,
                'success': success,
                'timestamp': time.time()
            }))
        else:
            await self.send_error(websocket, "Session not found", session_id)
    
    async def send_error(self, websocket, error_message: str, session_id: str = None):
        """Send error message to client"""
        await websocket.send(json.dumps({
            'type': 'ERROR',
            'error': error_message,
            'sessionId': session_id,
            'timestamp': time.time()
        }))
    
    def _handle_analytics_update(self, event_type: str, data: Any):
        """Handle analytics updates and broadcast to clients"""
        message = {
            'type': 'ANALYTICS_UPDATE',
            'eventType': event_type,
            'data': data,
            'timestamp': time.time()
        }
        
        # Broadcast to all clients
        asyncio.create_task(self._broadcast_to_clients(json.dumps(message)))
    
    async def _broadcast_to_clients(self, message: str):
        """Broadcast message to all connected clients"""
        if self.clients:
            await asyncio.gather(
                *[client.send(message) for client in self.clients],
                return_exceptions=True
            )
    
    def _generate_test_data(self, algorithm_name: str, size: int) -> dict:
        """Generate test data for benchmarking"""
        if algorithm_name == "two_sum":
            nums = list(range(size))
            target = size + size // 2
            return {"nums": nums, "target": target}
        elif algorithm_name == "binary_search":
            arr = list(range(size))
            target = size // 2
            return {"arr": arr, "target": target}
        elif algorithm_name == "container_water":
            height = [i % 100 + 1 for i in range(size)]
            return {"height": height}
        else:
            return list(range(size))
    
    def _get_two_sum_template(self) -> str:
        return """def two_sum(nums, target):
    \"\"\"
    Hash Map approach for Two Sum problem
    Time Complexity: O(n)
    Space Complexity: O(n)
    \"\"\"
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []"""
    
    def _get_binary_search_template(self) -> str:
        return """def binary_search(arr, target):
    \"\"\"
    Binary search in sorted array
    Time Complexity: O(log n)
    Space Complexity: O(1)
    \"\"\"
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1"""
    
    def _get_container_water_template(self) -> str:
        return """def max_area(height):
    \"\"\"
    Container With Most Water - Two Pointer approach
    Time Complexity: O(n)
    Space Complexity: O(1)
    \"\"\"
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate area
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area"""
    
    def _shutdown(self):
        """Graceful shutdown"""
        logger.info("🔄 Shutting down server...")
        
        # Stop analytics
        self.performance_analytics.stop_analytics()
        
        # Stop all active executions
        for session_id in list(self.active_sessions.keys()):
            self.docker_executor.stop_execution(session_id)
        
        # Cleanup Docker
        self.docker_executor.cleanup_all()
        
        logger.info("✅ Server shutdown complete")
        sys.exit(0)

async def main():
    """Main server entry point"""
    server = EnhancedWebSocketServer()
    await server.start_server()

if __name__ == "__main__":
    asyncio.run(main())
