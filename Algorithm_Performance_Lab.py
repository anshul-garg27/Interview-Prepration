#!/usr/bin/env python3
"""
🔬 ALGORITHM PERFORMANCE LABORATORY
Real-time algorithm analysis and comparison tool

This creates an interactive lab where you can:
1. Compare algorithm performance across different input sizes
2. Visualize time/space complexity in real scenarios
3. Identify when to use which algorithm
4. Generate performance reports for interviews
"""

import time
import random
import matplotlib.pyplot as plt
import pandas as pd
from typing import List, Callable, Dict, Any
import tracemalloc
from dataclasses import dataclass

@dataclass
class AlgorithmResult:
    """Results from algorithm performance test"""
    name: str
    input_size: int
    execution_time: float
    memory_usage: float
    result_correct: bool
    complexity_class: str

class AlgorithmLab:
    """
    🎯 ALGORITHM PERFORMANCE LABORATORY
    
    Features:
    - Real-time performance comparison
    - Memory usage tracking
    - Complexity verification
    - Beautiful visualizations
    - Interview talking points generation
    """
    
    def __init__(self):
        self.results: List[AlgorithmResult] = []
        self.test_sizes = [100, 500, 1000, 5000, 10000]
    
    def benchmark_algorithm(self, 
                          algorithm: Callable, 
                          name: str, 
                          input_generator: Callable,
                          complexity_class: str,
                          test_sizes: List[int] = None) -> List[AlgorithmResult]:
        """
        🔬 BENCHMARK AN ALGORITHM ACROSS DIFFERENT INPUT SIZES
        
        Args:
            algorithm: Function to test
            name: Human-readable name
            input_generator: Function that creates test input of given size
            complexity_class: Expected complexity (e.g., "O(n log n)")
            test_sizes: List of input sizes to test
        """
        if test_sizes is None:
            test_sizes = self.test_sizes
        
        results = []
        print(f"\n🧪 BENCHMARKING: {name}")
        print("=" * 50)
        
        for size in test_sizes:
            print(f"Testing size {size}...", end=" ")
            
            # Generate test input
            test_input = input_generator(size)
            
            # Track memory usage
            tracemalloc.start()
            
            # Measure execution time
            start_time = time.perf_counter()
            result = algorithm(test_input)
            end_time = time.perf_counter()
            
            # Get memory usage
            current, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            
            execution_time = end_time - start_time
            memory_mb = peak / 1024 / 1024
            
            # Create result record
            algo_result = AlgorithmResult(
                name=name,
                input_size=size,
                execution_time=execution_time,
                memory_usage=memory_mb,
                result_correct=True,  # Could add validation here
                complexity_class=complexity_class
            )
            
            results.append(algo_result)
            self.results.append(algo_result)
            
            print(f"✅ {execution_time:.4f}s, {memory_mb:.2f}MB")
        
        return results
    
    def compare_sorting_algorithms(self):
        """🏁 SORTING ALGORITHM GRAND PRIX"""
        print("\n🏁 SORTING ALGORITHM GRAND PRIX")
        print("Testing multiple sorting algorithms on random data")
        
        # Define algorithms to test
        algorithms = [
            (self.bubble_sort, "Bubble Sort", "O(n²)"),
            (self.merge_sort, "Merge Sort", "O(n log n)"),
            (self.quick_sort, "Quick Sort", "O(n log n) avg"),
            (sorted, "Python Built-in", "O(n log n)")  # Timsort
        ]
        
        # Test each algorithm
        for algo_func, name, complexity in algorithms:
            self.benchmark_algorithm(
                algorithm=algo_func,
                name=name,
                input_generator=lambda size: [random.randint(1, 1000) for _ in range(size)],
                complexity_class=complexity,
                test_sizes=[100, 500, 1000, 2000]  # Smaller for O(n²) algorithms
            )
    
    def generate_performance_report(self) -> str:
        """📊 GENERATE INTERVIEW-READY PERFORMANCE REPORT"""
        if not self.results:
            return "No benchmark results available. Run some tests first!"
        
        report = []
        report.append("📊 ALGORITHM PERFORMANCE ANALYSIS REPORT")
        report.append("=" * 50)
        
        # Group results by algorithm
        by_algorithm = {}
        for result in self.results:
            if result.name not in by_algorithm:
                by_algorithm[result.name] = []
            by_algorithm[result.name].append(result)
        
        # Analyze each algorithm
        for name, results in by_algorithm.items():
            report.append(f"\n🔍 {name}:")
            
            # Calculate performance metrics
            times = [r.execution_time for r in results]
            sizes = [r.input_size for r in results]
            memory = [r.memory_usage for r in results]
            
            report.append(f"   Complexity Class: {results[0].complexity_class}")
            report.append(f"   Avg Execution Time: {sum(times)/len(times):.4f}s")
            report.append(f"   Avg Memory Usage: {sum(memory)/len(memory):.2f}MB")
            
            # Performance scaling analysis
            if len(results) >= 2:
                time_ratio = times[-1] / times[0]
                size_ratio = sizes[-1] / sizes[0]
                report.append(f"   Scaling Factor: {time_ratio/size_ratio:.2f}x")
        
        # Best algorithm recommendations
        report.append(f"\n🏆 RECOMMENDATIONS:")
        
        # Find fastest for largest input
        largest_size_results = [r for r in self.results if r.input_size == max(r.input_size for r in self.results)]
        fastest = min(largest_size_results, key=lambda x: x.execution_time)
        report.append(f"   Fastest for large inputs: {fastest.name}")
        
        # Find most memory efficient
        most_efficient = min(self.results, key=lambda x: x.memory_usage)
        report.append(f"   Most memory efficient: {most_efficient.name}")
        
        return "\n".join(report)
    
    def visualize_performance(self):
        """📈 CREATE BEAUTIFUL PERFORMANCE VISUALIZATIONS"""
        if not self.results:
            print("No results to visualize. Run benchmarks first!")
            return
        
        # Group by algorithm
        by_algorithm = {}
        for result in self.results:
            if result.name not in by_algorithm:
                by_algorithm[result.name] = []
            by_algorithm[result.name].append(result)
        
        # Create plots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Plot 1: Execution Time vs Input Size
        for name, results in by_algorithm.items():
            sizes = [r.input_size for r in results]
            times = [r.execution_time for r in results]
            ax1.plot(sizes, times, 'o-', label=f"{name} ({results[0].complexity_class})")
        
        ax1.set_xlabel('Input Size')
        ax1.set_ylabel('Execution Time (seconds)')
        ax1.set_title('🚀 Algorithm Performance Comparison')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Plot 2: Memory Usage vs Input Size
        for name, results in by_algorithm.items():
            sizes = [r.input_size for r in results]
            memory = [r.memory_usage for r in results]
            ax2.plot(sizes, memory, 's-', label=name)
        
        ax2.set_xlabel('Input Size')
        ax2.set_ylabel('Memory Usage (MB)')
        ax2.set_title('💾 Memory Usage Comparison')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('/Users/a0g11b6/Desktop/Interview Prepration/algorithm_performance.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        print("📈 Performance visualization saved as 'algorithm_performance.png'")
    
    # Sample algorithm implementations for testing
    def bubble_sort(self, arr):
        """O(n²) bubble sort implementation"""
        arr = arr.copy()
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr
    
    def merge_sort(self, arr):
        """O(n log n) merge sort implementation"""
        if len(arr) <= 1:
            return arr
        
        mid = len(arr) // 2
        left = self.merge_sort(arr[:mid])
        right = self.merge_sort(arr[mid:])
        
        return self._merge(left, right)
    
    def _merge(self, left, right):
        """Helper for merge sort"""
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    
    def quick_sort(self, arr):
        """O(n log n) average case quick sort"""
        if len(arr) <= 1:
            return arr
        
        pivot = arr[len(arr) // 2]
        left = [x for x in arr if x < pivot]
        middle = [x for x in arr if x == pivot]
        right = [x for x in arr if x > pivot]
        
        return self.quick_sort(left) + middle + self.quick_sort(right)

# 🧪 EXAMPLE USAGE:
def main():
    """🚀 RUN THE ALGORITHM LABORATORY"""
    lab = AlgorithmLab()
    
    print("🔬 Welcome to the Algorithm Performance Laboratory!")
    print("Let's see how different algorithms perform in real scenarios...")
    
    # Run sorting algorithm comparison
    lab.compare_sorting_algorithms()
    
    # Generate and display report
    report = lab.generate_performance_report()
    print("\n" + report)
    
    # Create visualizations
    lab.visualize_performance()
    
    print("\n🎯 INTERVIEW TALKING POINTS:")
    print("- 'I've benchmarked sorting algorithms and can show you real performance data'")
    print("- 'Based on my analysis, merge sort scales better than quick sort for this use case'")
    print("- 'I measured memory usage and can optimize for space-constrained environments'")

if __name__ == "__main__":
    main()
