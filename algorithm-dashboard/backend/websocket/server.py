#!/usr/bin/env python3
"""
🚀 Real Algorithm Execution WebSocket Server
Handles real-time algorithm execution with performance monitoring
"""

import asyncio
import websockets
import json
import time
import tracemalloc
import psutil
import docker
import tempfile
import os
from typing import Dict, List, Any
from dataclasses import dataclass, asdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ExecutionResult:
    algorithm_name: str
    execution_time: float
    memory_usage: float
    cpu_usage: float
    result: Any
    input_size: int
    timestamp: float
    complexity_analysis: Dict[str, Any]

class AlgorithmExecutor:
    """Real-time algorithm execution with performance monitoring"""
    
    def __init__(self):
        self.active_executions = {}
        
    async def execute_algorithm(self, algorithm_code: str, test_data: List, algorithm_name: str) -> ExecutionResult:
        """Execute algorithm with real performance measurement"""
        
        # Start performance monitoring
        process = psutil.Process()
        cpu_before = process.cpu_percent()
        
        tracemalloc.start()
        start_time = time.perf_counter()
        
        try:
            # Create safe but functional execution environment
            safe_builtins = {
                'range': range,
                'len': len,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'sorted': sorted,
                'reversed': reversed,
                'min': min,
                'max': max,
                'sum': sum,
                'abs': abs,
                'int': int,
                'float': float,
                'str': str,
                'list': list,
                'dict': dict,
                'set': set,
                'tuple': tuple,
                'bool': bool,
                'any': any,
                'all': all,
                'print': print,  # For debugging
            }
            
            exec_globals = {'__builtins__': safe_builtins}
            exec_locals = {}
            
            # Execute the algorithm code
            exec(algorithm_code, exec_globals, exec_locals)
            
            # Get the algorithm function (assume it's the main function)
            algorithm_func = None
            for name, obj in exec_locals.items():
                if callable(obj) and not name.startswith('_'):
                    algorithm_func = obj
                    break
            
            if not algorithm_func:
                raise ValueError("No algorithm function found in code")
            
            # Execute with test data
            if algorithm_name == 'two_sum':
                result = algorithm_func(test_data['nums'], test_data['target'])
            else:
                result = algorithm_func(test_data)
            
            # Measure performance
            end_time = time.perf_counter()
            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            
            cpu_after = process.cpu_percent()
            execution_time = end_time - start_time
            memory_usage = peak / 1024 / 1024  # Convert to MB
            cpu_usage = max(cpu_after - cpu_before, 0)
            
            # Analyze complexity
            complexity_analysis = self._analyze_complexity(algorithm_code, len(str(test_data)))
            
            return ExecutionResult(
                algorithm_name=algorithm_name,
                execution_time=execution_time,
                memory_usage=memory_usage,
                cpu_usage=cpu_usage,
                result=result,
                input_size=len(str(test_data)),
                timestamp=time.time(),
                complexity_analysis=complexity_analysis
            )
            
        except Exception as e:
            tracemalloc.stop()
            raise Exception(f"Algorithm execution failed: {str(e)}")
    
    def _analyze_complexity(self, code: str, input_size: int) -> Dict[str, Any]:
        """Simple complexity analysis based on code patterns"""
        
        # Count nested loops
        loop_count = code.count('for ') + code.count('while ')
        nested_loops = 0
        
        lines = code.split('\n')
        indent_stack = []
        for line in lines:
            stripped = line.strip()
            if 'for ' in stripped or 'while ' in stripped:
                indent = len(line) - len(line.lstrip())
                if indent_stack and indent > indent_stack[-1]:
                    nested_loops += 1
                indent_stack.append(indent)
        
        # Estimate time complexity
        if nested_loops >= 2:
            time_complexity = "O(n²)" if nested_loops == 2 else f"O(n^{nested_loops + 1})"
        elif loop_count > 0:
            time_complexity = "O(n)"
        else:
            time_complexity = "O(1)"
        
        # Check for additional data structures
        uses_dict = 'dict' in code or '{' in code
        uses_set = 'set' in code
        
        space_complexity = "O(n)" if uses_dict or uses_set else "O(1)"
        
        return {
            'timeComplexity': time_complexity,
            'spaceComplexity': space_complexity,
            'loopCount': loop_count,
            'nestedLoops': nested_loops,
            'usesHashMap': uses_dict,
            'confidence': 0.8  # Confidence in analysis
        }

class WebSocketServer:
    """WebSocket server for real-time algorithm execution"""
    
    def __init__(self):
        self.executor = AlgorithmExecutor()
        self.connected_clients = set()
        
    async def register_client(self, websocket):
        """Register a new client connection"""
        self.connected_clients.add(websocket)
        logger.info(f"Client connected. Total clients: {len(self.connected_clients)}")
        
    async def unregister_client(self, websocket):
        """Unregister a client connection"""
        self.connected_clients.discard(websocket)
        logger.info(f"Client disconnected. Total clients: {len(self.connected_clients)}")
    
    async def broadcast_to_clients(self, message: dict):
        """Broadcast message to all connected clients"""
        if self.connected_clients:
            await asyncio.gather(
                *[client.send(json.dumps(message)) for client in self.connected_clients],
                return_exceptions=True
            )
    
    async def handle_client(self, websocket):
        """Handle WebSocket client connection"""
        await self.register_client(websocket)
        
        try:
            async for message in websocket:
                data = json.loads(message)
                await self.process_message(websocket, data)
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            logger.error(f"Error handling client: {e}")
        finally:
            await self.unregister_client(websocket)
    
    async def process_message(self, websocket, data):
        """Process incoming WebSocket message"""
        
        # 🚀 NEW: Log what data we received from frontend
        print(f"\n📥 RECEIVED FROM FRONTEND:")
        print(f"   Type: {data.get('type', 'UNKNOWN')}")
        print(f"   Session ID: {data.get('sessionId', 'N/A')}")
        print(f"   Algorithm Name: {data.get('algorithmName', 'N/A')}")
        
        if 'testData' in data:
            print(f"   Test Data: {data['testData']}")
        
        if 'algorithmCode' in data:
            code_preview = data['algorithmCode'][:100].replace('\n', '\\n') + '...'
            print(f"   Algorithm Code Preview: {code_preview}")
        
        print(f"   All Data Keys: {list(data.keys())}")
        print("-" * 60)
        
        message_type = data.get('type')

        print(message_type)
        
        if message_type == 'EXECUTE_ALGORITHM':
            await self.handle_algorithm_execution(websocket, data)
        elif message_type == 'PERFORMANCE_BENCHMARK':
            await self.handle_performance_benchmark(websocket, data)
        elif message_type == 'RUN_TESTS':
            await self.handle_test_execution(websocket, data)
        else:
            error_msg = f'Unknown message type: {message_type}'
            print(f"❌ ERROR: {error_msg}")
            await websocket.send(json.dumps({
                'type': 'ERROR',
                'message': error_msg
            }))
    
    async def handle_algorithm_execution(self, websocket, data):
        """Handle real-time algorithm execution"""
        
        try:
            algorithm_code = data.get('algorithmCode')
            test_data = data.get('testData')
            algorithm_name = data.get('algorithmName')
            session_id = data.get('sessionId')
            
            # Send execution started message
            await websocket.send(json.dumps({
                'type': 'EXECUTION_STARTED',
                'sessionId': session_id,
                'algorithmName': algorithm_name,
                'timestamp': time.time()
            }))
            
            # Execute algorithm
            result = await self.executor.execute_algorithm(
                algorithm_code, test_data, algorithm_name
            )
            
            # Send real-time performance data
            await websocket.send(json.dumps({
                'type': 'EXECUTION_STEP',
                'sessionId': session_id,
                'performanceMetrics': {
                    'executionTime': result.execution_time,
                    'memoryUsage': result.memory_usage,
                    'cpuUsage': result.cpu_usage
                },
                'result': result.result,
                'complexityAnalysis': result.complexity_analysis,
                'timestamp': result.timestamp
            }))
            
            # Send completion message
            await websocket.send(json.dumps({
                'type': 'EXECUTION_COMPLETED',
                'sessionId': session_id,
                'finalResult': asdict(result),
                'timestamp': time.time()
            }))
            
        except Exception as e:
            await websocket.send(json.dumps({
                'type': 'EXECUTION_ERROR',
                'sessionId': data.get('sessionId'),
                'error': str(e),
                'timestamp': time.time()
            }))
    
    async def handle_performance_benchmark(self, websocket, data):
        """Handle performance benchmarking across different input sizes"""
        
        try:
            algorithm_code = data.get('algorithmCode')
            algorithm_name = data.get('algorithmName')
            session_id = data.get('sessionId')
            
            # Test different input sizes
            test_sizes = [100, 500, 1000, 5000, 10000]
            benchmark_results = []
            
            for size in test_sizes:
                # Generate test data for this size
                if algorithm_name == 'two_sum':
                    test_data = {
                        'nums': list(range(size)),
                        'target': size * 2 - 3  # Ensure solution exists
                    }
                else:
                    test_data = list(range(size))
                
                # Execute algorithm
                result = await self.executor.execute_algorithm(
                    algorithm_code, test_data, algorithm_name
                )
                
                benchmark_results.append({
                    'inputSize': size,
                    'executionTime': result.execution_time,
                    'memoryUsage': result.memory_usage,
                    'complexityFit': result.complexity_analysis
                })
                
                # Send progress update
                await websocket.send(json.dumps({
                    'type': 'BENCHMARK_PROGRESS',
                    'sessionId': session_id,
                    'currentSize': size,
                    'totalSizes': len(test_sizes),
                    'result': benchmark_results[-1],
                    'timestamp': time.time()
                }))

            print(benchmark_results)
            
            # Send final benchmark results
            await websocket.send(json.dumps({
                'type': 'BENCHMARK_COMPLETED',
                'sessionId': session_id,
                'results': benchmark_results,
                'timestamp': time.time()
            }))
            
        except Exception as e:
            await websocket.send(json.dumps({
                'type': 'BENCHMARK_ERROR',
                'sessionId': session_id,
                'error': str(e),
                'timestamp': time.time()
            }))

# Server startup
async def start_server():
    """Start the WebSocket server"""
    server = WebSocketServer()
    
    logger.info("🚀 Starting Real Algorithm Execution Server...")
    logger.info("🔗 WebSocket endpoint: ws://localhost:8080")
    
    async with websockets.serve(server.handle_client, "localhost", 8080):
        logger.info("✅ Server is running and ready for connections!")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")
