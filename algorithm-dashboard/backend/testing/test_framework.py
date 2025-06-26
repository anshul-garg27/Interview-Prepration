#!/usr/bin/env python3
"""
🧪 Real Testing Framework
Docker-based pytest execution with comprehensive test suites and benchmarking
"""

import docker
import tempfile
import os
import json
import yaml
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import logging
from pathlib import Path
import subprocess

logger = logging.getLogger(__name__)

@dataclass
class TestCase:
    """Individual test case definition"""
    name: str
    input_data: Any
    expected_output: Any
    timeout: float = 5.0
    memory_limit: int = 128  # MB
    description: str = ""
    tags: List[str] = None

@dataclass
class TestSuite:
    """Test suite definition"""
    name: str
    algorithm_name: str
    test_cases: List[TestCase]
    setup_code: str = ""
    teardown_code: str = ""
    benchmarks: List[Dict[str, Any]] = None

@dataclass
class TestResult:
    """Individual test result"""
    test_name: str
    passed: bool
    execution_time: float
    memory_usage: float
    error_message: Optional[str]
    output: str
    expected: Any
    actual: Any

@dataclass
class BenchmarkResult:
    """Benchmark test result"""
    name: str
    input_size: int
    execution_time: float
    memory_usage: float
    throughput: float
    percentiles: Dict[str, float]

@dataclass
class TestSuiteResult:
    """Complete test suite result"""
    suite_name: str
    algorithm_name: str
    total_tests: int
    passed_tests: int
    failed_tests: int
    execution_time: float
    coverage_percentage: float
    test_results: List[TestResult]
    benchmark_results: List[BenchmarkResult]
    security_score: float

class TestFramework:
    """Docker-based testing framework"""
    
    def __init__(self):
        self.docker_client = docker.from_env()
        self.test_suites: Dict[str, TestSuite] = {}
        self._setup_test_image()
        self._load_algorithm_test_suites()
    
    def _setup_test_image(self):
        """Setup Docker image for testing"""
        dockerfile_content = """
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# Install Python testing packages
RUN pip install --no-cache-dir \\
    pytest==7.4.3 \\
    pytest-benchmark==4.0.0 \\
    pytest-timeout==2.2.0 \\
    pytest-cov==4.1.0 \\
    pytest-xdist==3.5.0 \\
    pytest-mock==3.12.0 \\
    hypothesis==6.92.1 \\
    memory-profiler==0.61.0 \\
    psutil==5.9.6 \\
    numpy==1.25.2 \\
    coverage==7.3.2

# Create test user
RUN useradd -m -s /bin/bash tester
RUN mkdir -p /app/tests && chown tester:tester /app/tests

WORKDIR /app/tests
USER tester

# Default command
CMD ["pytest", "--tb=short", "-v"]
"""
        
        try:
            self.docker_client.images.get("algorithm-tester:latest")
            logger.info("📦 Using existing Docker test image")
        except docker.errors.ImageNotFound:
            logger.info("🔨 Building Docker test image...")
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.dockerfile', delete=False) as f:
                f.write(dockerfile_content)
                dockerfile_path = f.name
            
            try:
                image, logs = self.docker_client.images.build(
                    path=os.path.dirname(dockerfile_path),
                    dockerfile=os.path.basename(dockerfile_path),
                    tag="algorithm-tester:latest",
                    rm=True
                )
                logger.info("✅ Docker test image built successfully")
            finally:
                os.unlink(dockerfile_path)
    
    def _load_algorithm_test_suites(self):
        """Load predefined test suites for algorithms"""
        
        # Two Sum test suite
        two_sum_suite = TestSuite(
            name="Two Sum Complete Test Suite",
            algorithm_name="two_sum",
            test_cases=[
                TestCase("basic_case", {"nums": [2, 7, 11, 15], "target": 9}, [0, 1]),
                TestCase("duplicate_numbers", {"nums": [3, 3], "target": 6}, [0, 1]),
                TestCase("negative_numbers", {"nums": [-1, -2, -3, -4, -5], "target": -8}, [2, 4]),
                TestCase("large_array", {"nums": list(range(1000)), "target": 1999}, [999, 1000]),
                TestCase("no_solution", {"nums": [1, 2, 3], "target": 7}, []),
                TestCase("zero_target", {"nums": [-1, 0, 1], "target": 0}, [0, 2]),
                TestCase("single_element", {"nums": [1], "target": 1}, []),
                TestCase("two_elements_match", {"nums": [1, 2], "target": 3}, [0, 1]),
            ],
            benchmarks=[
                {"input_size": 100, "iterations": 1000},
                {"input_size": 500, "iterations": 500},
                {"input_size": 1000, "iterations": 100},
                {"input_size": 5000, "iterations": 20},
                {"input_size": 10000, "iterations": 10},
            ]
        )
        
        # Binary Search test suite
        binary_search_suite = TestSuite(
            name="Binary Search Test Suite",
            algorithm_name="binary_search",
            test_cases=[
                TestCase("found_middle", {"arr": [1, 2, 3, 4, 5], "target": 3}, 2),
                TestCase("found_first", {"arr": [1, 2, 3, 4, 5], "target": 1}, 0),
                TestCase("found_last", {"arr": [1, 2, 3, 4, 5], "target": 5}, 4),
                TestCase("not_found", {"arr": [1, 2, 3, 4, 5], "target": 6}, -1),
                TestCase("empty_array", {"arr": [], "target": 1}, -1),
                TestCase("single_element_found", {"arr": [1], "target": 1}, 0),
                TestCase("single_element_not_found", {"arr": [1], "target": 2}, -1),
                TestCase("large_array", {"arr": list(range(10000)), "target": 5555}, 5555),
            ]
        )
        
        # Container With Most Water test suite
        container_water_suite = TestSuite(
            name="Container With Most Water Test Suite",
            algorithm_name="max_area",
            test_cases=[
                TestCase("basic_case", {"height": [1, 8, 6, 2, 5, 4, 8, 3, 7]}, 49),
                TestCase("two_elements", {"height": [1, 1]}, 1),
                TestCase("increasing_height", {"height": [1, 2, 3, 4, 5]}, 6),
                TestCase("decreasing_height", {"height": [5, 4, 3, 2, 1]}, 6),
                TestCase("same_height", {"height": [5, 5, 5, 5, 5]}, 20),
                TestCase("large_array", {"height": [i % 100 for i in range(1000)]}, None),  # Will calculate
            ]
        )
        
        self.test_suites = {
            "two_sum": two_sum_suite,
            "binary_search": binary_search_suite,
            "container_water": container_water_suite
        }
    
    def run_test_suite(
        self, 
        algorithm_name: str, 
        algorithm_code: str,
        custom_test_cases: List[TestCase] = None
    ) -> TestSuiteResult:
        """Run complete test suite for an algorithm"""
        
        if algorithm_name not in self.test_suites and not custom_test_cases:
            raise ValueError(f"No test suite found for algorithm: {algorithm_name}")
        
        suite = self.test_suites.get(algorithm_name) if not custom_test_cases else TestSuite(
            name=f"Custom {algorithm_name} Tests",
            algorithm_name=algorithm_name,
            test_cases=custom_test_cases
        )
        
        temp_dir = None
        container = None
        
        try:
            # Create temporary directory for test files
            temp_dir = tempfile.mkdtemp()
            
            # Generate test files
            self._generate_test_files(temp_dir, suite, algorithm_code)
            
            # Run tests in Docker container
            container = self._create_test_container(temp_dir)
            
            # Execute tests and collect results
            result = self._execute_tests(container, suite)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Test execution failed: {e}")
            return TestSuiteResult(
                suite_name=suite.name,
                algorithm_name=algorithm_name,
                total_tests=len(suite.test_cases),
                passed_tests=0,
                failed_tests=len(suite.test_cases),
                execution_time=0,
                coverage_percentage=0,
                test_results=[],
                benchmark_results=[],
                security_score=0
            )
        finally:
            # Cleanup
            if container:
                try:
                    container.stop(timeout=5)
                    container.remove()
                except:
                    pass
            
            if temp_dir:
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    def _generate_test_files(self, temp_dir: str, suite: TestSuite, algorithm_code: str):
        """Generate pytest test files"""
        
        # Create algorithm file
        algorithm_file = os.path.join(temp_dir, f"{suite.algorithm_name}.py")
        with open(algorithm_file, 'w') as f:
            f.write(algorithm_code)
        
        # Create test file
        test_file = os.path.join(temp_dir, f"test_{suite.algorithm_name}.py")
        test_content = self._generate_test_content(suite)
        
        with open(test_file, 'w') as f:
            f.write(test_content)
        
        # Create pytest configuration
        pytest_ini = os.path.join(temp_dir, "pytest.ini")
        with open(pytest_ini, 'w') as f:
            f.write("""
[tool:pytest]
testpaths = .
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --tb=short
    --strict-markers
    --strict-config
    --cov={algorithm_name}
    --cov-report=json
    --benchmark-json=benchmark_results.json
    --timeout=30
markers =
    slow: marks tests as slow
    benchmark: marks tests as benchmarks
    security: marks tests as security tests
""".format(algorithm_name=suite.algorithm_name))
        
        # Create conftest.py for fixtures
        conftest_file = os.path.join(temp_dir, "conftest.py")
        with open(conftest_file, 'w') as f:
            f.write("""
import pytest
import time
import tracemalloc
import gc

@pytest.fixture(autouse=True)
def memory_tracker():
    \"\"\"Track memory usage for each test\"\"\"
    tracemalloc.start()
    gc.collect()
    
    yield
    
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    # Store memory stats (pytest will capture this)
    print(f"MEMORY_STATS: current={current}, peak={peak}")

@pytest.fixture
def performance_timer():
    \"\"\"Time test execution\"\"\"
    start_time = time.perf_counter()
    
    yield
    
    end_time = time.perf_counter()
    execution_time = end_time - start_time
    print(f"EXECUTION_TIME: {execution_time}")
""")
    
    def _generate_test_content(self, suite: TestSuite) -> str:
        """Generate pytest test content"""
        
        imports = f"""
import pytest
import json
import time
import tracemalloc
from {suite.algorithm_name} import *

class Test{suite.algorithm_name.title()}:
    \"\"\"Comprehensive test suite for {suite.algorithm_name}\"\"\"
"""
        
        # Generate individual test methods
        test_methods = []
        for i, test_case in enumerate(suite.test_cases):
            method_name = f"test_{test_case.name}"
            
            test_method = f"""
    def {method_name}(self, performance_timer):
        \"\"\"Test: {test_case.description or test_case.name}\"\"\"
        # Input data
        input_data = {json.dumps(test_case.input_data)}
        expected = {json.dumps(test_case.expected_output)}
        
        # Execute algorithm
        if "{suite.algorithm_name}" == "two_sum":
            result = {self._get_function_name(suite.algorithm_name)}(input_data["nums"], input_data["target"])
        elif "{suite.algorithm_name}" == "binary_search":
            result = {self._get_function_name(suite.algorithm_name)}(input_data["arr"], input_data["target"])
        elif "{suite.algorithm_name}" == "max_area":
            result = {self._get_function_name(suite.algorithm_name)}(input_data["height"])
        else:
            # Generic call
            result = {self._get_function_name(suite.algorithm_name)}(input_data)
        
        # Validate result
        if expected is not None:
            assert result == expected, f"Expected {{expected}}, got {{result}}"
        else:
            # For tests where we just want to ensure no errors
            assert result is not None
"""
            test_methods.append(test_method)
        
        # Generate benchmark tests
        benchmark_methods = []
        if suite.benchmarks:
            for i, benchmark in enumerate(suite.benchmarks):
                benchmark_method = f"""
    @pytest.mark.benchmark
    def test_benchmark_{i}(self, benchmark):
        \"\"\"Benchmark test with input size {benchmark['input_size']}\"\"\"
        input_size = {benchmark['input_size']}
        
        # Generate test data based on algorithm
        if "{suite.algorithm_name}" == "two_sum":
            nums = list(range(input_size))
            target = input_size * 2 - 3
            test_data = {{"nums": nums, "target": target}}
        elif "{suite.algorithm_name}" == "binary_search":
            arr = list(range(input_size))
            target = input_size // 2
            test_data = {{"arr": arr, "target": target}}
        elif "{suite.algorithm_name}" == "max_area":
            height = [i % 100 for i in range(input_size)]
            test_data = {{"height": height}}
        else:
            test_data = list(range(input_size))
        
        # Benchmark the algorithm
        if "{suite.algorithm_name}" == "two_sum":
            result = benchmark({self._get_function_name(suite.algorithm_name)}, test_data["nums"], test_data["target"])
        elif "{suite.algorithm_name}" == "binary_search":
            result = benchmark({self._get_function_name(suite.algorithm_name)}, test_data["arr"], test_data["target"])
        elif "{suite.algorithm_name}" == "max_area":
            result = benchmark({self._get_function_name(suite.algorithm_name)}, test_data["height"])
        else:
            result = benchmark({self._get_function_name(suite.algorithm_name)}, test_data)
"""
                benchmark_methods.append(benchmark_method)
        
        # Security tests
        security_tests = f"""
    @pytest.mark.security
    def test_security_large_input(self):
        \"\"\"Test algorithm with very large input\"\"\"
        try:
            if "{suite.algorithm_name}" == "two_sum":
                large_nums = list(range(100000))
                result = {self._get_function_name(suite.algorithm_name)}(large_nums, 199999)
            elif "{suite.algorithm_name}" == "binary_search":
                large_arr = list(range(100000))
                result = {self._get_function_name(suite.algorithm_name)}(large_arr, 50000)
            # Should complete without crashing
            assert True
        except MemoryError:
            pytest.skip("Memory limit exceeded - this is expected behavior")
        except Exception as e:
            pytest.fail(f"Unexpected error with large input: {{e}}")
    
    @pytest.mark.security
    def test_security_edge_cases(self):
        \"\"\"Test algorithm with edge cases that might cause issues\"\"\"
        try:
            if "{suite.algorithm_name}" == "two_sum":
                # Test with empty array
                result = {self._get_function_name(suite.algorithm_name)}([], 0)
                assert result == []
                
                # Test with single element
                result = {self._get_function_name(suite.algorithm_name)}([1], 1)
                assert result == []
            elif "{suite.algorithm_name}" == "binary_search":
                # Test with empty array
                result = {self._get_function_name(suite.algorithm_name)}([], 1)
                assert result == -1
        except Exception as e:
            pytest.fail(f"Edge case handling failed: {{e}}")
"""
        
        return imports + "\n".join(test_methods) + "\n".join(benchmark_methods) + security_tests
    
    def _get_function_name(self, algorithm_name: str) -> str:
        """Get the expected function name for an algorithm"""
        function_names = {
            "two_sum": "two_sum",
            "binary_search": "binary_search",
            "max_area": "max_area"
        }
        return function_names.get(algorithm_name, algorithm_name)
    
    def _create_test_container(self, temp_dir: str) -> docker.models.containers.Container:
        """Create Docker container for test execution"""
        
        container_config = {
            "image": "algorithm-tester:latest",
            "command": [
                "pytest", 
                "--tb=short", 
                "-v", 
                "--json-report",
                "--json-report-file=test_results.json",
                "--cov-report=json:coverage.json",
                "--benchmark-json=benchmark_results.json"
            ],
            "working_dir": "/app/tests",
            "volumes": {
                temp_dir: {"bind": "/app/tests", "mode": "rw"}
            },
            "mem_limit": "256m",
            "cpu_quota": 100000,  # 100% of one core
            "cpu_period": 100000,
            "network_disabled": True,
            "user": "tester",
            "detach": True,
            "remove": False
        }
        
        container = self.docker_client.containers.run(**container_config)
        return container
    
    def _execute_tests(
        self, 
        container: docker.models.containers.Container, 
        suite: TestSuite
    ) -> TestSuiteResult:
        """Execute tests and parse results"""
        
        try:
            # Wait for tests to complete
            exit_code = container.wait(timeout=120)  # 2 minute timeout
            
            # Get test output
            logs = container.logs().decode('utf-8')
            
            # Try to get structured results
            test_results, benchmark_results, coverage_percentage = self._parse_test_results(
                container, logs
            )
            
            # Calculate metrics
            total_tests = len(suite.test_cases) + len(suite.benchmarks or []) + 2  # +2 for security tests
            passed_tests = sum(1 for r in test_results if r.passed)
            failed_tests = total_tests - passed_tests
            
            # Calculate security score
            security_score = self._calculate_security_score(test_results)
            
            return TestSuiteResult(
                suite_name=suite.name,
                algorithm_name=suite.algorithm_name,
                total_tests=total_tests,
                passed_tests=passed_tests,
                failed_tests=failed_tests,
                execution_time=sum(r.execution_time for r in test_results),
                coverage_percentage=coverage_percentage,
                test_results=test_results,
                benchmark_results=benchmark_results,
                security_score=security_score
            )
            
        except Exception as e:
            logger.error(f"Failed to execute tests: {e}")
            raise
    
    def _parse_test_results(
        self, 
        container: docker.models.containers.Container, 
        logs: str
    ) -> tuple:
        """Parse test results from container"""
        
        test_results = []
        benchmark_results = []
        coverage_percentage = 0.0
        
        try:
            # Try to get JSON results
            exec_result = container.exec_run("cat test_results.json")
            if exec_result.exit_code == 0:
                json_data = json.loads(exec_result.output.decode('utf-8'))
                
                # Parse individual test results
                for test in json_data.get('tests', []):
                    result = TestResult(
                        test_name=test['nodeid'],
                        passed=test['outcome'] == 'passed',
                        execution_time=test.get('duration', 0),
                        memory_usage=0,  # Will extract from logs
                        error_message=test.get('call', {}).get('longrepr') if test['outcome'] != 'passed' else None,
                        output=test.get('call', {}).get('stdout', ''),
                        expected=None,  # Will extract if available
                        actual=None
                    )
                    test_results.append(result)
            
            # Try to get benchmark results
            benchmark_exec = container.exec_run("cat benchmark_results.json")
            if benchmark_exec.exit_code == 0:
                benchmark_data = json.loads(benchmark_exec.output.decode('utf-8'))
                
                for benchmark in benchmark_data.get('benchmarks', []):
                    result = BenchmarkResult(
                        name=benchmark['name'],
                        input_size=0,  # Will extract from name
                        execution_time=benchmark['stats']['mean'],
                        memory_usage=0,
                        throughput=1.0 / benchmark['stats']['mean'] if benchmark['stats']['mean'] > 0 else 0,
                        percentiles={
                            'p50': benchmark['stats']['median'],
                            'p95': benchmark['stats'].get('q95', 0),
                            'p99': benchmark['stats'].get('q99', 0)
                        }
                    )
                    benchmark_results.append(result)
            
            # Try to get coverage
            coverage_exec = container.exec_run("cat coverage.json")
            if coverage_exec.exit_code == 0:
                coverage_data = json.loads(coverage_exec.output.decode('utf-8'))
                coverage_percentage = coverage_data.get('totals', {}).get('percent_covered', 0)
            
        except Exception as e:
            logger.warning(f"Failed to parse structured results: {e}")
            # Fall back to log parsing
            test_results = self._parse_logs_fallback(logs, len(test_results))
        
        return test_results, benchmark_results, coverage_percentage
    
    def _parse_logs_fallback(self, logs: str, expected_count: int) -> List[TestResult]:
        """Parse test results from logs as fallback"""
        results = []
        
        lines = logs.split('\n')
        for line in lines:
            if '::' in line and ('PASSED' in line or 'FAILED' in line):
                parts = line.split('::')
                test_name = parts[-1].split(' ')[0]
                passed = 'PASSED' in line
                
                result = TestResult(
                    test_name=test_name,
                    passed=passed,
                    execution_time=0,
                    memory_usage=0,
                    error_message=None if passed else "Test failed",
                    output="",
                    expected=None,
                    actual=None
                )
                results.append(result)
        
        return results
    
    def _calculate_security_score(self, test_results: List[TestResult]) -> float:
        """Calculate security score based on test results"""
        security_tests = [r for r in test_results if 'security' in r.test_name.lower()]
        
        if not security_tests:
            return 0.5  # Neutral score if no security tests
        
        passed_security = sum(1 for r in security_tests if r.passed)
        return (passed_security / len(security_tests)) * 100
    
    def get_available_test_suites(self) -> List[str]:
        """Get list of available test suites"""
        return list(self.test_suites.keys())
    
    def add_custom_test_suite(self, suite: TestSuite):
        """Add a custom test suite"""
        self.test_suites[suite.algorithm_name] = suite
