'use client';

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useBacktracking } from '../context/BacktrackingContext';
import { PerformanceMetrics } from '../types/BacktrackingTypes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartsProps {
  className?: string;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  className = ''
}) => {
  const { state } = useBacktracking();
  const [selectedMetric, setSelectedMetric] = useState<keyof PerformanceMetrics>('recursionDepth');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'doughnut'>('line');
  const [timeWindow, setTimeWindow] = useState<number>(50); // Number of data points to show
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Performance data history
  const [performanceHistory, setPerformanceHistory] = useState<{
    timestamp: number;
    metrics: PerformanceMetrics;
  }[]>([]);

  // Update performance history
  useEffect(() => {
    if (state.performance && state.isRunning) {
      setPerformanceHistory(prev => {
        const newEntry = {
          timestamp: Date.now(),
          metrics: { ...state.performance }
        };
        return [...prev.slice(-timeWindow + 1), newEntry];
      });
    }
  }, [state.performance, state.isRunning, timeWindow]);

  // Auto-refresh when algorithm is running
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        // Force re-render to update charts
        setPerformanceHistory(prev => [...prev]);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  // Prepare chart data
  const getChartData = () => {
    const labels = performanceHistory.map((_, index) => `Step ${index + 1}`);
    const currentMetrics = state.performance || {};

    const datasets = {
      recursionDepth: {
        label: 'Recursion Depth',
        data: performanceHistory.map(entry => entry.metrics.recursionDepth || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      backtrackCount: {
        label: 'Backtrack Count',
        data: performanceHistory.map(entry => entry.metrics.backtrackCount || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      solutionsFound: {
        label: 'Solutions Found',
        data: performanceHistory.map(entry => entry.metrics.solutionsFound || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      statesExplored: {
        label: 'States Explored',
        data: performanceHistory.map(entry => entry.metrics.statesExplored || 0),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
      memoryUsage: {
        label: 'Memory Usage (MB)',
        data: performanceHistory.map(entry => (entry.metrics.memoryUsage || 0) / (1024 * 1024)),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      }
    };

    return {
      labels,
      datasets: selectedMetric === 'all' 
        ? Object.values(datasets)
        : [datasets[selectedMetric as keyof typeof datasets]]
    };
  };

  // Chart options
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Performance Metrics - ${selectedMetric === 'all' ? 'All Metrics' : selectedMetric}`,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: chartType !== 'doughnut' ? {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Algorithm Steps'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          },
          beginAtZero: true
        }
      } : undefined,
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
      },
      animation: {
        duration: 200,
      }
    };

    return baseOptions;
  };

  // Current performance summary
  const getCurrentSummary = () => {
    const metrics = state.performance || {};
    return [
      { label: 'Recursion Depth', value: metrics.recursionDepth || 0, color: 'text-blue-600' },
      { label: 'Backtrack Count', value: metrics.backtrackCount || 0, color: 'text-red-600' },
      { label: 'Solutions Found', value: metrics.solutionsFound || 0, color: 'text-green-600' },
      { label: 'States Explored', value: metrics.statesExplored || 0, color: 'text-purple-600' },
      { label: 'Execution Time', value: `${metrics.executionTime || 0}ms`, color: 'text-gray-600' },
      { label: 'Memory Usage', value: `${((metrics.memoryUsage || 0) / 1024).toFixed(2)} KB`, color: 'text-yellow-600' },
    ];
  };

  // Algorithm efficiency metrics
  const getEfficiencyMetrics = () => {
    const metrics = state.performance || {};
    const totalStates = metrics.statesExplored || 1;
    const solutions = metrics.solutionsFound || 0;
    const backtracks = metrics.backtrackCount || 0;
    
    return {
      efficiency: solutions > 0 ? ((solutions / totalStates) * 100).toFixed(2) : '0.00',
      backtrackRatio: totalStates > 0 ? ((backtracks / totalStates) * 100).toFixed(2) : '0.00',
      avgDepth: totalStates > 0 ? ((metrics.recursionDepth || 0) / totalStates).toFixed(2) : '0.00',
      statesPerSolution: solutions > 0 ? Math.round(totalStates / solutions) : 0,
    };
  };

  const chartData = getChartData();
  const chartOptions = getChartOptions();
  const currentSummary = getCurrentSummary();
  const efficiencyMetrics = getEfficiencyMetrics();

  // Render appropriate chart component
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: chartOptions,
      className: "w-full h-full"
    };

    switch (chartType) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'doughnut':
        // Special handling for doughnut chart
        const doughnutData = {
          labels: ['Solutions', 'Backtracks', 'Explored'],
          datasets: [{
            data: [
              state.performance?.solutionsFound || 0,
              state.performance?.backtrackCount || 0,
              (state.performance?.statesExplored || 0) - (state.performance?.solutionsFound || 0) - (state.performance?.backtrackCount || 0)
            ],
            backgroundColor: ['#22c55e', '#ef4444', '#8b5cf6'],
            borderWidth: 2,
          }]
        };
        return <Doughnut data={doughnutData} options={chartOptions} className="w-full h-full" />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as keyof PerformanceMetrics)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recursionDepth">Recursion Depth</option>
                <option value="backtrackCount">Backtrack Count</option>
                <option value="solutionsFound">Solutions Found</option>
                <option value="statesExplored">States Explored</option>
                <option value="memoryUsage">Memory Usage</option>
                <option value="all">All Metrics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'doughnut')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="doughnut">Doughnut Chart</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Window
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={25}>25 steps</option>
                <option value={50}>50 steps</option>
                <option value={100}>100 steps</option>
                <option value={200}>200 steps</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${state.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {state.isRunning ? 'Live Update' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {currentSummary.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="h-96">
          {performanceHistory.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No performance data available</p>
                <p className="text-sm mt-1">Start an algorithm to see performance metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Efficiency</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{efficiencyMetrics.efficiency}%</div>
            <div className="text-sm text-gray-600 mt-1">Solution Efficiency</div>
            <div className="text-xs text-gray-500 mt-1">Solutions / States Explored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{efficiencyMetrics.backtrackRatio}%</div>
            <div className="text-sm text-gray-600 mt-1">Backtrack Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Backtracks / Total States</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{efficiencyMetrics.avgDepth}</div>
            <div className="text-sm text-gray-600 mt-1">Avg Depth</div>
            <div className="text-xs text-gray-500 mt-1">Average Recursion Depth</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{efficiencyMetrics.statesPerSolution}</div>
            <div className="text-sm text-gray-600 mt-1">States/Solution</div>
            <div className="text-xs text-gray-500 mt-1">Exploration Cost</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
