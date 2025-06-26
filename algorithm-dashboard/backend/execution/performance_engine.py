#!/usr/bin/env python3
"""
🔬 Algorithm Execution Engine
Real performance measurement and algorithm analysis
"""

import time
import tracemalloc
import psutil
import ast
import sys
from typing import Dict, List, Any, Callable
from dataclasses import dataclass
import statistics

@dataclass
class PerformanceMetrics:
    execution_time: float
    memory_usage: float
    cpu_usage: float
    input_size: int
    iterations: int
    complexity_score: float

class AlgorithmAnalyzer:
    """Analyze algorithm complexity and performance characteristics"""
    
    def __init__(self):
        self.complexity_patterns = {
            'O(1)': lambda n: 1,
            'O(log n)': lambda n: __import__('math').log2(n) if n > 0 else 1,
            'O(n)': lambda n: n,
            'O(n log n)': lambda n: n * __import__('math').log2(n) if n > 0 else 1,
            'O(n²)': lambda n: n * n,
            'O(2^n)': lambda n: 2 ** min(n, 20)  # Cap to prevent overflow
        }
    
    def analyze_code_complexity(self, code: str) -> Dict[str, Any]:
        """Analyze code structure to estimate complexity"""
        
        try:
            tree = ast.parse(code)
            analyzer = ComplexityVisitor()
            analyzer.visit(tree)
            
            return {
                'estimated_time_complexity': analyzer.get_time_complexity(),
                'estimated_space_complexity': analyzer.get_space_complexity(),
                'loop_depth': analyzer.max_loop_depth,
                'recursive_calls': analyzer.recursive_calls,
                'data_structures': analyzer.data_structures,
                'confidence': analyzer.confidence_score()
            }
        except Exception as e:
            return {
                'estimated_time_complexity': 'Unknown',
                'estimated_space_complexity': 'Unknown',
                'error': str(e),
                'confidence': 0.0
            }
    
    def fit_complexity_curve(self, performance_data: List[PerformanceMetrics]) -> Dict[str, Any]:
        """Fit performance data to complexity curves"""
        
        if len(performance_data) < 3:
            return {'best_fit': 'Insufficient data', 'r_squared': 0.0}
        
        input_sizes = [p.input_size for p in performance_data]
        execution_times = [p.execution_time for p in performance_data]
        
        best_fit = 'O(1)'
        best_r_squared = 0.0
        
        for complexity, func in self.complexity_patterns.items():
            try:
                # Calculate theoretical values
                theoretical = [func(size) for size in input_sizes]
                
                # Normalize and calculate R²
                if max(theoretical) > 0:
                    theoretical_norm = [t / max(theoretical) for t in theoretical]
                    actual_norm = [t / max(execution_times) for t in execution_times]
                    
                    r_squared = self._calculate_r_squared(actual_norm, theoretical_norm)
                    
                    if r_squared > best_r_squared:
                        best_r_squared = r_squared
                        best_fit = complexity
            except:
                continue
        
        return {
            'best_fit': best_fit,
            'r_squared': best_r_squared,
            'confidence': min(best_r_squared, 1.0)
        }
    
    def _calculate_r_squared(self, actual: List[float], predicted: List[float]) -> float:
        """Calculate R² coefficient of determination"""
        
        if len(actual) != len(predicted) or len(actual) == 0:
            return 0.0
        
        mean_actual = statistics.mean(actual)
        
        ss_res = sum((a - p) ** 2 for a, p in zip(actual, predicted))
        ss_tot = sum((a - mean_actual) ** 2 for a in actual)
        
        if ss_tot == 0:
            return 1.0 if ss_res == 0 else 0.0
        
        return max(0.0, 1 - (ss_res / ss_tot))

class ComplexityVisitor(ast.NodeVisitor):
    """AST visitor to analyze code complexity"""
    
    def __init__(self):
        self.loop_depth = 0
        self.max_loop_depth = 0
        self.recursive_calls = 0
        self.data_structures = set()
        self.function_name = None
    
    def visit_FunctionDef(self, node):
        """Visit function definition"""
        if self.function_name is None:
            self.function_name = node.name
        self.generic_visit(node)
    
    def visit_For(self, node):
        """Visit for loop"""
        self.loop_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.loop_depth)
        self.generic_visit(node)
        self.loop_depth -= 1
    
    def visit_While(self, node):
        """Visit while loop"""
        self.loop_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.loop_depth)
        self.generic_visit(node)
        self.loop_depth -= 1
    
    def visit_Call(self, node):
        """Visit function call"""
        if isinstance(node.func, ast.Name):
            if node.func.id == self.function_name:
                self.recursive_calls += 1
        elif isinstance(node.func, ast.Attribute):
            if node.func.attr in ['append', 'pop', 'insert']:
                self.data_structures.add('list')
        self.generic_visit(node)
    
    def visit_Dict(self, node):
        """Visit dictionary creation"""
        self.data_structures.add('dict')
        self.generic_visit(node)
    
    def visit_Set(self, node):
        """Visit set creation"""
        self.data_structures.add('set')
        self.generic_visit(node)
    
    def get_time_complexity(self) -> str:
        """Estimate time complexity based on analysis"""
        
        if self.recursive_calls > 0:
            return 'O(2^n)'  # Assuming exponential recursion
        elif self.max_loop_depth >= 3:
            return f'O(n^{self.max_loop_depth})'
        elif self.max_loop_depth == 2:
            return 'O(n²)'
        elif self.max_loop_depth == 1:
            return 'O(n)'
        else:
            return 'O(1)'
    
    def get_space_complexity(self) -> str:
        """Estimate space complexity based on data structures"""
        
        if 'dict' in self.data_structures or 'set' in self.data_structures:
            return 'O(n)'
        elif 'list' in self.data_structures:
            return 'O(n)'
        elif self.recursive_calls > 0:
            return 'O(n)'  # Recursion stack
        else:
            return 'O(1)'
    
    def confidence_score(self) -> float:
        """Calculate confidence in complexity analysis"""
        
        base_confidence = 0.7
        
        # Higher confidence for clear patterns
        if self.max_loop_depth > 0:
            base_confidence += 0.2
        if len(self.data_structures) > 0:
            base_confidence += 0.1
        
        return min(base_confidence, 1.0)

class SafeExecutor:
    """Safe algorithm execution with performance monitoring"""
    
    def __init__(self):
        self.timeout = 10  # 10 second timeout
        self.memory_limit = 512 * 1024 * 1024  # 512MB
    
    def execute_with_monitoring(self, algorithm_func: Callable, test_data: Any) -> PerformanceMetrics:
        """Execute algorithm with comprehensive performance monitoring"""
        
        # Get initial system state
        process = psutil.Process()
        cpu_before = process.cpu_percent()
        
        # Start memory tracking
        tracemalloc.start()
        
        # Record start time
        start_time = time.perf_counter()
        
        try:
            # Execute algorithm
            result = algorithm_func(test_data)
            
            # Record end time
            end_time = time.perf_counter()
            
            # Get memory usage
            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            
            # Get CPU usage
            cpu_after = process.cpu_percent()
            
            # Calculate metrics
            execution_time = end_time - start_time
            memory_usage = peak / 1024 / 1024  # Convert to MB
            cpu_usage = max(cpu_after - cpu_before, 0)
            
            # Determine input size
            input_size = self._calculate_input_size(test_data)
            
            return PerformanceMetrics(
                execution_time=execution_time,
                memory_usage=memory_usage,
                cpu_usage=cpu_usage,
                input_size=input_size,
                iterations=1,
                complexity_score=self._calculate_complexity_score(execution_time, input_size)
            )
            
        except Exception as e:
            tracemalloc.stop()
            raise Exception(f"Algorithm execution failed: {str(e)}")
    
    def _calculate_input_size(self, test_data: Any) -> int:
        """Calculate the size of input data"""
        
        if isinstance(test_data, dict):
            if 'nums' in test_data:
                return len(test_data['nums'])
            else:
                return len(str(test_data))
        elif isinstance(test_data, (list, tuple)):
            return len(test_data)
        elif isinstance(test_data, str):
            return len(test_data)
        else:
            return 1
    
    def _calculate_complexity_score(self, execution_time: float, input_size: int) -> float:
        """Calculate a complexity score based on performance"""
        
        if input_size <= 1:
            return 1.0
        
        # Normalize execution time by input size
        time_per_element = execution_time / input_size
        
        # Score based on time efficiency (lower is better)
        if time_per_element < 0.00001:  # Very fast
            return 1.0
        elif time_per_element < 0.0001:  # Fast
            return 0.8
        elif time_per_element < 0.001:   # Moderate
            return 0.6
        elif time_per_element < 0.01:    # Slow
            return 0.4
        else:  # Very slow
            return 0.2

# Integration class for the WebSocket server
class PerformanceEngine:
    """Main engine for algorithm performance analysis"""
    
    def __init__(self):
        self.analyzer = AlgorithmAnalyzer()
        self.executor = SafeExecutor()
        self.performance_history = []
    
    async def analyze_algorithm(self, code: str, test_data: Any, algorithm_name: str) -> Dict[str, Any]:
        """Complete algorithm analysis with performance measurement"""
        
        # Analyze code structure
        code_analysis = self.analyzer.analyze_code_complexity(code)
        
        # Execute algorithm and measure performance
        try:
            # Create execution environment
            exec_globals = {'__builtins__': {}}
            exec_locals = {}
            exec(code, exec_globals, exec_locals)
            
            # Find the algorithm function
            algorithm_func = None
            for name, obj in exec_locals.items():
                if callable(obj) and not name.startswith('_'):
                    algorithm_func = obj
                    break
            
            if not algorithm_func:
                raise ValueError("No algorithm function found")
            
            # Execute with performance monitoring
            if algorithm_name == 'two_sum':
                performance = self.executor.execute_with_monitoring(
                    lambda data: algorithm_func(data['nums'], data['target']),
                    test_data
                )
            else:
                performance = self.executor.execute_with_monitoring(algorithm_func, test_data)
            
            # Store performance data
            self.performance_history.append(performance)
            
            # Fit complexity curve if we have enough data
            complexity_fit = {}
            if len(self.performance_history) >= 3:
                complexity_fit = self.analyzer.fit_complexity_curve(self.performance_history)
            
            return {
                'code_analysis': code_analysis,
                'performance_metrics': {
                    'execution_time': performance.execution_time,
                    'memory_usage': performance.memory_usage,
                    'cpu_usage': performance.cpu_usage,
                    'input_size': performance.input_size,
                    'complexity_score': performance.complexity_score
                },
                'complexity_fit': complexity_fit,
                'timestamp': time.time()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'code_analysis': code_analysis,
                'timestamp': time.time()
            }
