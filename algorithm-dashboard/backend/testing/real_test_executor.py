# Real Testing Framework Implementation
# /backend/testing/real_test_executor.py

import pytest
import unittest
import subprocess
import tempfile
import json
from typing import Dict, List, Any
from dataclasses import dataclass
import time
import psutil
import docker

@dataclass
class TestResult:
    test_name: str
    passed: bool
    execution_time: float
    memory_usage: float
    error_message: str = ""
    actual_output: Any = None
    expected_output: Any = None

class RealTestExecutor:
    """
    Execute actual unit tests against user's algorithm code
    This runs REAL tests, not simulated ones
    """
    
    def __init__(self):
        self.docker_client = docker.from_env()
        self.test_templates = {
            'two_sum': self._load_two_sum_tests(),
            'binary_search': self._load_binary_search_tests(),
            'container_water': self._load_container_water_tests()
        }
    
    async def run_real_tests(self, algorithm_name: str, user_code: str) -> List[TestResult]:
        """Execute real unit tests in isolated Docker container"""
        
        # Create test file with user's code
        test_file_content = self._generate_test_file(algorithm_name, user_code)
        
        # Run tests in Docker container
        container_result = await self._run_tests_in_container(test_file_content)
        
        # Parse results
        return self._parse_test_results(container_result)
    
    def _generate_test_file(self, algorithm_name: str, user_code: str) -> str:
        """Generate actual pytest file with user's code"""
        
        test_template = self.test_templates[algorithm_name]
        
        # Create complete test file
        test_file = f"""
import pytest
import time
import tracemalloc
from typing import List

# User's algorithm implementation
{user_code}

class TestAlgorithm:
    
    def setup_method(self):
        \"\"\"Setup before each test\"\"\"
        tracemalloc.start()
        self.start_time = time.perf_counter()
    
    def teardown_method(self):
        \"\"\"Cleanup after each test\"\"\"
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        self.execution_time = time.perf_counter() - self.start_time
        self.memory_usage = peak / 1024 / 1024  # MB
        
        # Log performance data
        print(f"PERF_DATA: {{\\\"time\\\": {self.execution_time}, \\\"memory\\\": {self.memory_usage}}}")

{test_template}
"""
        return test_file
    
    def _load_two_sum_tests(self) -> str:
        """Load Two Sum test cases"""
        return '''
    def test_two_sum_basic(self):
        """Test basic two sum case"""
        nums = [2, 7, 11, 15]
        target = 9
        result = two_sum(nums, target)
        assert result == [0, 1] or result == [1, 0], f"Expected [0,1] or [1,0], got {result}"
    
    def test_two_sum_no_solution(self):
        """Test case with no solution"""
        nums = [1, 2, 3]
        target = 10
        result = two_sum(nums, target)
        assert result == [] or result is None, f"Expected empty result, got {result}"
    
    def test_two_sum_duplicates(self):
        """Test with duplicate numbers"""
        nums = [3, 3]
        target = 6
        result = two_sum(nums, target)
        assert result == [0, 1] or result == [1, 0], f"Expected [0,1] or [1,0], got {result}"
    
    def test_two_sum_negative_numbers(self):
        """Test with negative numbers"""
        nums = [-1, -2, -3, -4, -5]
        target = -8
        result = two_sum(nums, target)
        expected_pairs = [[2, 4], [4, 2]]  # -3 + -5 = -8
        assert result in expected_pairs, f"Expected one of {expected_pairs}, got {result}"
    
    def test_two_sum_performance_large_array(self):
        """Performance test with large array"""
        nums = list(range(10000))
        target = 19999  # Last two elements
        result = two_sum(nums, target)
        assert result == [9999, 10000] or result == [10000, 9999], f"Performance test failed: {result}"
        
        # Assert performance requirements
        assert self.execution_time < 1.0, f"Algorithm too slow: {self.execution_time}s"
        assert self.memory_usage < 100, f"Memory usage too high: {self.memory_usage}MB"
    
    @pytest.mark.parametrize("nums,target,expected", [
        ([2, 7, 11, 15], 9, [0, 1]),
        ([3, 2, 4], 6, [1, 2]),
        ([3, 3], 6, [0, 1]),
        ([1, 5, 3, 7, 9, 2], 8, [1, 4]),  # 5 + 3 = 8
    ])
    def test_two_sum_parametrized(self, nums, target, expected):
        """Parametrized tests for comprehensive coverage"""
        result = two_sum(nums, target)
        assert sorted(result) == sorted(expected), f"Input: {nums}, Target: {target}, Expected: {expected}, Got: {result}"
'''
    
    async def _run_tests_in_container(self, test_file_content: str) -> dict:
        """Run tests in isolated Docker container"""
        
        # Create temporary directory with test file
        with tempfile.TemporaryDirectory() as temp_dir:
            test_file_path = f"{temp_dir}/test_algorithm.py"
            with open(test_file_path, 'w') as f:
                f.write(test_file_content)
            
            # Run pytest in Docker container
            container = self.docker_client.containers.run(
                "python:3.11-slim",
                command=[
                    "sh", "-c", 
                    "pip install pytest && cd /tests && python -m pytest test_algorithm.py -v --tb=short --json-report --json-report-file=results.json"
                ],
                volumes={temp_dir: {'bind': '/tests', 'mode': 'rw'}},
                working_dir="/tests",
                detach=True,
                mem_limit="512m",  # Memory limit
                cpu_quota=50000,   # CPU limit
                remove=True
            )
            
            # Wait for completion with timeout
            try:
                result = container.wait(timeout=30)
                logs = container.logs().decode('utf-8')
                
                # Read JSON results if available
                results_file = f"{temp_dir}/results.json"
                if os.path.exists(results_file):
                    with open(results_file, 'r') as f:
                        json_results = json.load(f)
                else:
                    json_results = {}
                
                return {
                    'exit_code': result['StatusCode'],
                    'logs': logs,
                    'json_results': json_results
                }
                
            except Exception as e:
                container.kill()
                return {
                    'exit_code': -1,
                    'logs': f"Test execution failed: {str(e)}",
                    'json_results': {}
                }
    
    def _parse_test_results(self, container_result: dict) -> List[TestResult]:
        """Parse test results from container output"""
        
        results = []
        logs = container_result['logs']
        json_results = container_result.get('json_results', {})
        
        # Parse performance data from logs
        perf_data = {}
        for line in logs.split('\n'):
            if 'PERF_DATA:' in line:
                try:
                    perf_json = line.split('PERF_DATA:')[1].strip()
                    perf_data = json.loads(perf_json)
                except:
                    pass
        
        # Parse pytest JSON results
        if 'tests' in json_results:
            for test in json_results['tests']:
                results.append(TestResult(
                    test_name=test['nodeid'],
                    passed=test['outcome'] == 'passed',
                    execution_time=perf_data.get('time', 0),
                    memory_usage=perf_data.get('memory', 0),
                    error_message=test.get('call', {}).get('longrepr', ''),
                    actual_output=test.get('call', {}).get('result'),
                    expected_output=test.get('expected')
                ))
        else:
            # Fallback: parse from logs
            results.append(TestResult(
                test_name="Test Execution",
                passed=container_result['exit_code'] == 0,
                execution_time=perf_data.get('time', 0),
                memory_usage=perf_data.get('memory', 0),
                error_message=logs if container_result['exit_code'] != 0 else "",
            ))
        
        return results

# WebSocket handler for real-time test execution
class RealTimeTestHandler:
    """Handle real-time test execution and streaming"""
    
    def __init__(self):
        self.test_executor = RealTestExecutor()
        self.active_sessions = {}
    
    async def handle_test_request(self, websocket, message):
        """Handle incoming test execution request"""
        
        session_id = message.get('session_id')
        algorithm_name = message.get('algorithm_name')
        user_code = message.get('user_code')
        
        # Start test execution
        await websocket.send(json.dumps({
            'type': 'TEST_STARTED',
            'session_id': session_id,
            'message': f'Starting tests for {algorithm_name}...'
        }))
        
        try:
            # Execute real tests
            test_results = await self.test_executor.run_real_tests(algorithm_name, user_code)
            
            # Stream results back
            for result in test_results:
                await websocket.send(json.dumps({
                    'type': 'TEST_RESULT',
                    'session_id': session_id,
                    'test_name': result.test_name,
                    'passed': result.passed,
                    'execution_time': result.execution_time,
                    'memory_usage': result.memory_usage,
                    'error_message': result.error_message
                }))
            
            # Send completion
            await websocket.send(json.dumps({
                'type': 'TEST_COMPLETED',
                'session_id': session_id,
                'total_tests': len(test_results),
                'passed_tests': sum(1 for r in test_results if r.passed),
                'failed_tests': sum(1 for r in test_results if not r.passed)
            }))
            
        except Exception as e:
            await websocket.send(json.dumps({
                'type': 'TEST_ERROR',
                'session_id': session_id,
                'error': str(e)
            }))
