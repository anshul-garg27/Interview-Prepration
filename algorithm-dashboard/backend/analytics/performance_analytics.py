#!/usr/bin/env python3
"""
📊 Live Performance Analytics Engine
Real-time performance monitoring and analysis with WebSocket streaming
"""

import asyncio
import json
import time
import numpy as np
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, asdict
from scipy import stats
import logging
from collections import deque
import threading

logger = logging.getLogger(__name__)

@dataclass
class PerformancePoint:
    """Single performance measurement point"""
    timestamp: float
    input_size: int
    execution_time: float
    memory_usage: float
    cpu_usage: float
    algorithm_name: str
    session_id: str

@dataclass
class ComplexityFit:
    """Complexity analysis results"""
    best_fit: str
    r_squared: float
    coefficients: List[float]
    residuals: List[float]
    confidence_interval: Dict[str, float]

@dataclass
class PerformanceTrend:
    """Performance trend analysis"""
    algorithm_name: str
    data_points: int
    avg_execution_time: float
    avg_memory_usage: float
    avg_cpu_usage: float
    time_complexity: ComplexityFit
    space_complexity: ComplexityFit
    performance_regression: bool
    optimization_suggestions: List[str]

class ComplexityAnalyzer:
    """Analyzes algorithm complexity using curve fitting"""
    
    def __init__(self):
        self.complexity_functions = {
            'O(1)': lambda n: np.ones_like(n),
            'O(log n)': lambda n: np.log2(n),
            'O(n)': lambda n: n,
            'O(n log n)': lambda n: n * np.log2(n),
            'O(n²)': lambda n: n ** 2,
            'O(n³)': lambda n: n ** 3,
            'O(2^n)': lambda n: 2 ** n
        }
    
    def analyze_time_complexity(self, input_sizes: List[int], execution_times: List[float]) -> ComplexityFit:
        """Analyze time complexity using curve fitting"""
        if len(input_sizes) < 3:
            return ComplexityFit("O(n)", 0.0, [], [], {})
        
        input_sizes = np.array(input_sizes)
        execution_times = np.array(execution_times)
        
        best_fit = None
        best_r_squared = -1
        best_coeffs = []
        best_residuals = []
        
        for complexity_name, func in self.complexity_functions.items():
            try:
                # Skip exponential for large inputs to avoid overflow
                if complexity_name == 'O(2^n)' and max(input_sizes) > 20:
                    continue
                
                # Generate complexity function values
                complexity_values = func(input_sizes)
                
                # Skip if any values are invalid
                if np.any(np.isnan(complexity_values)) or np.any(np.isinf(complexity_values)):
                    continue
                
                # Perform linear regression
                slope, intercept, r_value, p_value, std_err = stats.linregress(
                    complexity_values, execution_times
                )
                
                r_squared = r_value ** 2
                
                if r_squared > best_r_squared:
                    best_fit = complexity_name
                    best_r_squared = r_squared
                    best_coeffs = [slope, intercept]
                    
                    # Calculate residuals
                    predicted = slope * complexity_values + intercept
                    best_residuals = (execution_times - predicted).tolist()
                    
            except Exception as e:
                logger.debug(f"Failed to fit {complexity_name}: {e}")
                continue
        
        # Calculate confidence interval
        confidence_interval = self._calculate_confidence_interval(best_r_squared, len(input_sizes))
        
        return ComplexityFit(
            best_fit=best_fit or "O(n)",
            r_squared=best_r_squared,
            coefficients=best_coeffs,
            residuals=best_residuals,
            confidence_interval=confidence_interval
        )
    
    def analyze_space_complexity(self, input_sizes: List[int], memory_usages: List[float]) -> ComplexityFit:
        """Analyze space complexity using curve fitting"""
        return self.analyze_time_complexity(input_sizes, memory_usages)  # Same method
    
    def _calculate_confidence_interval(self, r_squared: float, n: int) -> Dict[str, float]:
        """Calculate confidence interval for fit"""
        if n < 3:
            return {"lower": 0.0, "upper": 1.0}
        
        # Simple confidence interval based on R-squared and sample size
        margin = (1 - r_squared) / np.sqrt(n)
        
        return {
            "lower": max(0.0, r_squared - margin),
            "upper": min(1.0, r_squared + margin)
        }

class PerformanceAnalytics:
    """Live performance analytics engine"""
    
    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self.performance_history: deque = deque(maxlen=max_history)
        self.algorithm_trends: Dict[str, List[PerformancePoint]] = {}
        self.complexity_analyzer = ComplexityAnalyzer()
        self.subscribers: List[Callable] = []
        self.analytics_thread = None
        self.running = False
    
    def start_analytics(self):
        """Start real-time analytics processing"""
        self.running = True
        self.analytics_thread = threading.Thread(target=self._analytics_loop, daemon=True)
        self.analytics_thread.start()
        logger.info("📊 Performance analytics engine started")
    
    def stop_analytics(self):
        """Stop analytics processing"""
        self.running = False
        if self.analytics_thread:
            self.analytics_thread.join()
        logger.info("📊 Performance analytics engine stopped")
    
    def add_performance_point(self, point: PerformancePoint):
        """Add new performance measurement"""
        self.performance_history.append(point)
        
        # Group by algorithm
        if point.algorithm_name not in self.algorithm_trends:
            self.algorithm_trends[point.algorithm_name] = []
        
        self.algorithm_trends[point.algorithm_name].append(point)
        
        # Limit algorithm history
        if len(self.algorithm_trends[point.algorithm_name]) > self.max_history:
            self.algorithm_trends[point.algorithm_name] = \
                self.algorithm_trends[point.algorithm_name][-self.max_history:]
        
        # Trigger real-time analysis
        self._notify_subscribers('performance_point', asdict(point))
    
    def get_algorithm_trend(self, algorithm_name: str) -> Optional[PerformanceTrend]:
        """Get performance trend for specific algorithm"""
        if algorithm_name not in self.algorithm_trends:
            return None
        
        points = self.algorithm_trends[algorithm_name]
        if len(points) < 2:
            return None
        
        # Extract data
        input_sizes = [p.input_size for p in points]
        execution_times = [p.execution_time for p in points]
        memory_usages = [p.memory_usage for p in points]
        cpu_usages = [p.cpu_usage for p in points]
        
        # Analyze complexity
        time_complexity = self.complexity_analyzer.analyze_time_complexity(
            input_sizes, execution_times
        )
        space_complexity = self.complexity_analyzer.analyze_space_complexity(
            input_sizes, memory_usages
        )
        
        # Check for performance regression
        regression = self._detect_performance_regression(points)
        
        # Generate optimization suggestions
        suggestions = self._generate_optimization_suggestions(
            time_complexity, space_complexity, points
        )
        
        return PerformanceTrend(
            algorithm_name=algorithm_name,
            data_points=len(points),
            avg_execution_time=np.mean(execution_times),
            avg_memory_usage=np.mean(memory_usages),
            avg_cpu_usage=np.mean(cpu_usages),
            time_complexity=time_complexity,
            space_complexity=space_complexity,
            performance_regression=regression,
            optimization_suggestions=suggestions
        )
    
    def get_comparative_analysis(self, algorithm_names: List[str]) -> Dict[str, Any]:
        """Compare multiple algorithms performance"""
        comparison = {
            "algorithms": [],
            "winner": None,
            "analysis": {}
        }
        
        trends = []
        for name in algorithm_names:
            trend = self.get_algorithm_trend(name)
            if trend:
                trends.append(trend)
                comparison["algorithms"].append({
                    "name": name,
                    "avg_time": trend.avg_execution_time,
                    "avg_memory": trend.avg_memory_usage,
                    "complexity": trend.time_complexity.best_fit,
                    "confidence": trend.time_complexity.r_squared
                })
        
        if trends:
            # Determine winner (lowest average execution time)
            winner = min(trends, key=lambda t: t.avg_execution_time)
            comparison["winner"] = winner.algorithm_name
            
            # Generate analysis
            comparison["analysis"] = {
                "fastest": winner.algorithm_name,
                "most_memory_efficient": min(trends, key=lambda t: t.avg_memory_usage).algorithm_name,
                "best_complexity": min(trends, key=lambda t: self._complexity_score(t.time_complexity.best_fit)).algorithm_name,
                "recommendations": self._generate_comparison_recommendations(trends)
            }
        
        return comparison
    
    def get_real_time_metrics(self) -> Dict[str, Any]:
        """Get current real-time metrics"""
        if not self.performance_history:
            return {"status": "no_data"}
        
        recent_points = list(self.performance_history)[-10:]  # Last 10 points
        
        return {
            "status": "active",
            "total_measurements": len(self.performance_history),
            "active_algorithms": len(self.algorithm_trends),
            "recent_average_time": np.mean([p.execution_time for p in recent_points]),
            "recent_average_memory": np.mean([p.memory_usage for p in recent_points]),
            "performance_trend": self._calculate_recent_trend(recent_points),
            "last_measurement": asdict(recent_points[-1]) if recent_points else None
        }
    
    def subscribe(self, callback: Callable):
        """Subscribe to real-time analytics updates"""
        self.subscribers.append(callback)
    
    def unsubscribe(self, callback: Callable):
        """Unsubscribe from analytics updates"""
        if callback in self.subscribers:
            self.subscribers.remove(callback)
    
    def _analytics_loop(self):
        """Background analytics processing loop"""
        while self.running:
            try:
                # Perform periodic analysis
                for algorithm_name in self.algorithm_trends:
                    trend = self.get_algorithm_trend(algorithm_name)
                    if trend:
                        self._notify_subscribers('trend_update', {
                            "algorithm": algorithm_name,
                            "trend": asdict(trend)
                        })
                
                # Send real-time metrics
                metrics = self.get_real_time_metrics()
                self._notify_subscribers('metrics_update', metrics)
                
                time.sleep(5)  # Update every 5 seconds
                
            except Exception as e:
                logger.error(f"Analytics loop error: {e}")
                time.sleep(1)
    
    def _notify_subscribers(self, event_type: str, data: Any):
        """Notify all subscribers of analytics events"""
        for callback in self.subscribers:
            try:
                callback(event_type, data)
            except Exception as e:
                logger.error(f"Subscriber notification failed: {e}")
    
    def _detect_performance_regression(self, points: List[PerformancePoint]) -> bool:
        """Detect if performance is regressing"""
        if len(points) < 5:
            return False
        
        # Compare recent vs older performance
        recent = points[-3:]
        older = points[-6:-3] if len(points) >= 6 else points[:-3]
        
        recent_avg = np.mean([p.execution_time for p in recent])
        older_avg = np.mean([p.execution_time for p in older])
        
        # Regression if recent performance is 20% worse
        return recent_avg > older_avg * 1.2
    
    def _generate_optimization_suggestions(
        self, 
        time_complexity: ComplexityFit, 
        space_complexity: ComplexityFit,
        points: List[PerformancePoint]
    ) -> List[str]:
        """Generate optimization suggestions"""
        suggestions = []
        
        # Time complexity suggestions
        if time_complexity.best_fit == "O(n²)":
            suggestions.append("Consider using hash maps or sorting to reduce time complexity to O(n) or O(n log n)")
        elif time_complexity.best_fit == "O(2^n)":
            suggestions.append("Use dynamic programming or memoization to avoid exponential time complexity")
        
        # Space complexity suggestions
        if space_complexity.best_fit in ["O(n²)", "O(n³)"]:
            suggestions.append("Optimize memory usage by using in-place algorithms or better data structures")
        
        # Performance regression suggestions
        if len(points) > 5:
            recent_memory = np.mean([p.memory_usage for p in points[-3:]])
            if recent_memory > 100:  # MB
                suggestions.append("High memory usage detected - consider memory optimization")
        
        return suggestions or ["Algorithm performance looks good!"]
    
    def _generate_comparison_recommendations(self, trends: List[PerformanceTrend]) -> List[str]:
        """Generate recommendations from algorithm comparison"""
        recommendations = []
        
        # Find patterns
        complexities = [t.time_complexity.best_fit for t in trends]
        if "O(n²)" in complexities and "O(n)" in complexities:
            recommendations.append("Consider using the O(n) algorithm for better scalability")
        
        memory_usages = [t.avg_memory_usage for t in trends]
        if max(memory_usages) > min(memory_usages) * 2:
            recommendations.append("Significant memory usage difference detected - choose based on memory constraints")
        
        return recommendations or ["All algorithms perform similarly"]
    
    def _complexity_score(self, complexity: str) -> int:
        """Score complexity for comparison (lower is better)"""
        scores = {
            "O(1)": 1,
            "O(log n)": 2,
            "O(n)": 3,
            "O(n log n)": 4,
            "O(n²)": 5,
            "O(n³)": 6,
            "O(2^n)": 7
        }
        return scores.get(complexity, 5)
    
    def _calculate_recent_trend(self, points: List[PerformancePoint]) -> str:
        """Calculate recent performance trend"""
        if len(points) < 3:
            return "stable"
        
        times = [p.execution_time for p in points]
        
        # Linear regression on recent points
        x = np.arange(len(times))
        slope, _, _, _, _ = stats.linregress(x, times)
        
        if slope > 0.001:
            return "degrading"
        elif slope < -0.001:
            return "improving"
        else:
            return "stable"
