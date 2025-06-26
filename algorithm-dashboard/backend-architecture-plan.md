# Real Algorithm Execution Backend Architecture

## 🎯 Core Components

### 1. Algorithm Execution Engine
```python
# /backend/execution/algorithm_runner.py
class AlgorithmExecutor:
    def __init__(self):
        self.performance_tracker = PerformanceTracker()
        self.security_sandbox = SecuritySandbox()
    
    async def execute_algorithm(self, algorithm_code: str, test_data: List) -> ExecutionResult:
        """Execute algorithm with real performance measurement"""
        with self.security_sandbox:
            start_time = time.perf_counter()
            tracemalloc.start()
            
            # Execute algorithm
            result = await self._safe_execute(algorithm_code, test_data)
            
            end_time = time.perf_counter()
            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            
            return ExecutionResult(
                result=result,
                execution_time=end_time - start_time,
                memory_usage=peak / 1024 / 1024,  # MB
                cpu_usage=self._get_cpu_usage(),
                complexity_analysis=self._analyze_complexity(algorithm_code)
            )
```

### 2. Performance Measurement System
```python
# /backend/analytics/performance_tracker.py
class PerformanceTracker:
    def __init__(self):
        self.metrics = []
    
    def benchmark_algorithm(self, algorithm: Callable, test_sizes: List[int]) -> BenchmarkResult:
        """Generate real performance data across input sizes"""
        results = []
        for size in test_sizes:
            test_data = self._generate_test_data(size)
            
            # Multiple runs for statistical accuracy
            execution_times = []
            memory_usages = []
            
            for _ in range(5):  # 5 runs for averaging
                result = self._measure_single_run(algorithm, test_data)
                execution_times.append(result.time)
                memory_usages.append(result.memory)
            
            results.append(PerformancePoint(
                input_size=size,
                avg_time=statistics.mean(execution_times),
                avg_memory=statistics.mean(memory_usages),
                std_time=statistics.stdev(execution_times),
                complexity_fit=self._fit_complexity_curve(size, execution_times)
            ))
        
        return BenchmarkResult(results)
```

### 3. Real-Time Test Execution
```python
# /backend/testing/test_runner.py
class TestRunner:
    def __init__(self):
        self.test_suites = {
            'two_sum': TwoSumTestSuite(),
            'binary_search': BinarySearchTestSuite(),
            # ... more algorithms
        }
    
    async def run_tests(self, algorithm_name: str, code: str) -> TestResult:
        """Execute actual unit tests against user's algorithm"""
        test_suite = self.test_suites[algorithm_name]
        
        results = []
        for test_case in test_suite.get_test_cases():
            try:
                actual_result = await self._execute_with_timeout(code, test_case.input)
                passed = actual_result == test_case.expected
                
                results.append(TestCaseResult(
                    name=test_case.name,
                    input=test_case.input,
                    expected=test_case.expected,
                    actual=actual_result,
                    passed=passed,
                    execution_time=self._get_execution_time(),
                    memory_usage=self._get_memory_usage()
                ))
            except Exception as e:
                results.append(TestCaseResult(
                    name=test_case.name,
                    passed=False,
                    error=str(e)
                ))
        
        return TestResult(results)
```

## 🔒 Security & Sandboxing

### Docker-based Isolation
```dockerfile
# /backend/docker/algorithm-executor/Dockerfile
FROM python:3.11-slim

# Create non-root user
RUN useradd -m -s /bin/bash algorunner

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy execution environment
COPY execution/ /app/execution/
RUN chown -R algorunner:algorunner /app

USER algorunner
WORKDIR /app

# Resource limits
ENV MAX_MEMORY=512MB
ENV MAX_CPU_TIME=5s
ENV MAX_EXECUTION_TIME=10s

CMD ["python", "execution/runner.py"]
```

### Resource Limits & Monitoring
```python
# /backend/security/resource_monitor.py
class ResourceMonitor:
    def __init__(self):
        self.limits = {
            'max_memory': 512 * 1024 * 1024,  # 512MB
            'max_execution_time': 10.0,       # 10 seconds
            'max_cpu_usage': 80.0,            # 80% CPU
        }
    
    def monitor_execution(self, process):
        """Monitor resource usage during algorithm execution"""
        start_time = time.time()
        
        while process.is_alive():
            memory_usage = process.memory_info().rss
            cpu_usage = process.cpu_percent()
            execution_time = time.time() - start_time
            
            if memory_usage > self.limits['max_memory']:
                process.terminate()
                raise ResourceLimitException("Memory limit exceeded")
            
            if execution_time > self.limits['max_execution_time']:
                process.terminate()
                raise ResourceLimitException("Time limit exceeded")
            
            if cpu_usage > self.limits['max_cpu_usage']:
                process.terminate()
                raise ResourceLimitException("CPU limit exceeded")
            
            time.sleep(0.1)  # Check every 100ms
```

## 📊 Real-Time Data Pipeline

### WebSocket Implementation
```typescript
// /backend/websocket/performance_stream.ts
class PerformanceStreamer {
    private clients: Set<WebSocket> = new Set();
    
    async streamAlgorithmExecution(algorithmId: string, testData: any[]) {
        const executor = new AlgorithmExecutor();
        
        // Stream real-time progress
        for (let i = 0; i < testData.length; i++) {
            const result = await executor.executeStep(testData[i]);
            
            // Broadcast real-time data to frontend
            this.broadcast({
                type: 'EXECUTION_STEP',
                step: i,
                totalSteps: testData.length,
                result: result,
                performanceMetrics: {
                    executionTime: result.executionTime,
                    memoryUsage: result.memoryUsage,
                    cpuUsage: result.cpuUsage
                },
                timestamp: Date.now()
            });
            
            // Small delay for visualization
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    private broadcast(data: any) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}
```

## 🧪 Algorithm Test Suites

### Two Sum Test Implementation
```python
# /backend/test_suites/two_sum_tests.py
class TwoSumTestSuite:
    def __init__(self):
        self.test_cases = [
            TestCase("Basic case", [2,7,11,15], 9, [0,1]),
            TestCase("No solution", [1,2,3], 10, []),
            TestCase("Duplicate numbers", [3,3], 6, [0,1]),
            TestCase("Negative numbers", [-1,-2,-3,-4,-5], -8, [2,4]),
            TestCase("Large array", list(range(10000)), 19999, [9999,10000]),
            TestCase("Edge case - two elements", [1,2], 3, [0,1]),
            TestCase("Performance test", list(range(100000)), 199999, [99999,100000])
        ]
    
    def generate_performance_tests(self, sizes: List[int]) -> List[TestCase]:
        """Generate performance test cases for different input sizes"""
        performance_tests = []
        
        for size in sizes:
            # Generate random array
            arr = [random.randint(1, 1000) for _ in range(size)]
            
            # Ensure at least one valid solution exists
            target_idx1, target_idx2 = random.sample(range(size), 2)
            target = arr[target_idx1] + arr[target_idx2]
            
            performance_tests.append(TestCase(
                name=f"Performance test - size {size}",
                input_array=arr,
                target=target,
                expected=[target_idx1, target_idx2],
                is_performance_test=True
            ))
        
        return performance_tests
```
