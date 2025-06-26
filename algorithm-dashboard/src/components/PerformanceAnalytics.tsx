// Performance Analytics Dashboard Component
import { motion } from 'framer-motion'
import { Award, Clock, Cpu, MemoryStick, Target, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface PerformanceData {
  algorithm: string
  timeComplexity: string
  spaceComplexity: string
  executionTime: number // milliseconds
  memoryUsage: number // MB
  iterations: number
  cacheHits: number
  cacheMisses: number
  testCases: {
    input: any
    expected: any
    actual: any
    passed: boolean
    executionTime: number
  }[]
}

export interface PerformanceAnalyticsProps {
  data: PerformanceData[]
  currentAlgorithm: string
  showComparison?: boolean
}

const complexityColors = {
  'O(1)': '#10b981',
  'O(log n)': '#3b82f6',
  'O(n)': '#f59e0b',
  'O(n log n)': '#f97316',
  'O(n²)': '#ef4444',
  'O(2ⁿ)': '#8b5cf6'
}

export function PerformanceAnalytics({ 
  data, 
  currentAlgorithm, 
  showComparison = true 
}: PerformanceAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'time' | 'memory' | 'efficiency'>('time')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview')
  
  const currentData = data.find(d => d.algorithm === currentAlgorithm)
  
  // Calculate efficiency score (0-100)
  const calculateEfficiencyScore = (algorithm: PerformanceData) => {
    const timeScore = Math.max(0, 100 - (algorithm.executionTime / 10)) // Assuming 1000ms = 0 score
    const memoryScore = Math.max(0, 100 - (algorithm.memoryUsage / 0.1)) // Assuming 10MB = 0 score
    const successRate = (algorithm.testCases.filter(tc => tc.passed).length / algorithm.testCases.length) * 100
    
    return Math.round((timeScore * 0.4 + memoryScore * 0.3 + successRate * 0.3))
  }

  // Prepare chart data
  const performanceChartData = data.map(d => ({
    name: d.algorithm,
    time: d.executionTime,
    memory: d.memoryUsage,
    efficiency: calculateEfficiencyScore(d),
    complexity: d.timeComplexity,
    successRate: (d.testCases.filter(tc => tc.passed).length / d.testCases.length) * 100
  }))

  // Cache performance data
  const cacheData = currentData ? [
    { name: 'Cache Hits', value: currentData.cacheHits, color: '#10b981' },
    { name: 'Cache Misses', value: currentData.cacheMisses, color: '#ef4444' }
  ] : []

  // Test case distribution
  const testCaseData = currentData ? [
    { 
      name: 'Passed', 
      value: currentData.testCases.filter(tc => tc.passed).length,
      color: '#10b981'
    },
    { 
      name: 'Failed', 
      value: currentData.testCases.filter(tc => !tc.passed).length,
      color: '#ef4444'
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Header with Metrics Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-cyan-400" />
          Performance Analytics
        </h3>
        
        <div className="flex space-x-2">
          {(['overview', 'detailed', 'comparison'] as const).map(mode => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && currentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Execution Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/40 rounded-xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
              <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded">
                {currentData.timeComplexity}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentData.executionTime.toFixed(2)}ms
            </div>
            <div className="text-blue-300 text-sm">Execution Time</div>
          </motion.div>

          {/* Memory Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-900/40 to-green-700/40 rounded-xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <MemoryStick className="w-8 h-8 text-green-400" />
              <span className="text-xs px-2 py-1 bg-green-600/20 text-green-300 rounded">
                {currentData.spaceComplexity}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentData.memoryUsage.toFixed(2)}MB
            </div>
            <div className="text-green-300 text-sm">Memory Usage</div>
          </motion.div>

          {/* Efficiency Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/40 rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {calculateEfficiencyScore(currentData)}/100
            </div>
            <div className="text-purple-300 text-sm">Efficiency Score</div>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-700/40 rounded-xl p-6 border border-orange-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-400" />
              <span className="text-xs px-2 py-1 bg-orange-600/20 text-orange-300 rounded">
                {currentData.testCases.length} tests
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {((currentData.testCases.filter(tc => tc.passed).length / currentData.testCases.length) * 100).toFixed(1)}%
            </div>
            <div className="text-orange-300 text-sm">Success Rate</div>
          </motion.div>
        </div>
      )}

      {/* Detailed Charts */}
      {(viewMode === 'detailed' || viewMode === 'comparison') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Comparison Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-white font-bold mb-4">Algorithm Performance Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar 
                  dataKey={selectedMetric === 'time' ? 'time' : selectedMetric === 'memory' ? 'memory' : 'efficiency'} 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Metric Selector */}
            <div className="flex space-x-2 mt-4">
              {[
                { key: 'time', label: 'Execution Time', icon: Clock },
                { key: 'memory', label: 'Memory Usage', icon: MemoryStick },
                { key: 'efficiency', label: 'Efficiency', icon: Zap }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as any)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedMetric === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cache Performance and Test Results */}
          <div className="space-y-6">
            {/* Cache Performance */}
            {currentData && cacheData.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-bold mb-4">Cache Performance</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={cacheData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {cacheData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Test Case Results */}
            {currentData && testCaseData.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-bold mb-4">Test Case Results</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={testCaseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {testCaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Test Case Breakdown */}
      {viewMode === 'detailed' && currentData && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-bold mb-4">Test Case Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-gray-300">Input</th>
                  <th className="text-left py-2 text-gray-300">Expected</th>
                  <th className="text-left py-2 text-gray-300">Actual</th>
                  <th className="text-left py-2 text-gray-300">Time (ms)</th>
                  <th className="text-left py-2 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.testCases.map((testCase, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-700/50"
                  >
                    <td className="py-2 text-gray-300 font-mono text-xs">
                      {JSON.stringify(testCase.input)}
                    </td>
                    <td className="py-2 text-gray-300 font-mono text-xs">
                      {JSON.stringify(testCase.expected)}
                    </td>
                    <td className="py-2 text-gray-300 font-mono text-xs">
                      {JSON.stringify(testCase.actual)}
                    </td>
                    <td className="py-2 text-gray-300">
                      {testCase.executionTime.toFixed(2)}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        testCase.passed 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {testCase.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-500/30">
        <h4 className="text-white font-bold mb-4 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-indigo-400" />
          Performance Insights
        </h4>
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-indigo-300 font-medium mb-2">Optimization Opportunities</h5>
              <ul className="space-y-1 text-sm text-gray-300">
                {currentData.executionTime > 100 && (
                  <li>• Consider algorithm optimization - execution time is high</li>
                )}
                {currentData.memoryUsage > 5 && (
                  <li>• Memory usage could be optimized</li>
                )}
                {currentData.cacheMisses > currentData.cacheHits && (
                  <li>• Cache hit rate is low - consider improving data locality</li>
                )}
                {currentData.testCases.some(tc => !tc.passed) && (
                  <li>• Some test cases are failing - check edge cases</li>
                )}
              </ul>
            </div>
            <div>
              <h5 className="text-indigo-300 font-medium mb-2">Strengths</h5>
              <ul className="space-y-1 text-sm text-gray-300">
                {currentData.executionTime <= 50 && (
                  <li>• Excellent execution performance</li>
                )}
                {currentData.memoryUsage <= 2 && (
                  <li>• Efficient memory usage</li>
                )}
                {currentData.cacheHits > currentData.cacheMisses && (
                  <li>• Good cache locality</li>
                )}
                {currentData.testCases.every(tc => tc.passed) && (
                  <li>• All test cases passing</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
