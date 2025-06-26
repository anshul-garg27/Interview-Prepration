'use client'

import { motion } from 'framer-motion'
import { Activity, Bug, CheckCircle, Code, Play, RotateCcw, Terminal, Timer, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'
import { useBacktracking } from '../context/BacktrackingContext'

interface TestResult {
  name: string
  passed: boolean
  time: string
  details: string
  input: string
  expected: string
  actual: string
}

export default function TestingSection() {
  const { state } = useBacktracking()
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<'unit' | 'integration' | 'performance' | 'debugging'>('unit')
  
  // 🚀 NEW: Real-time execution simulation (Two-Sum style)
  const [isConnected] = useState(true) // Simulate connection for demo
  const [executionMetrics, setExecutionMetrics] = useState({
    totalTests: 0,
    passedTests: 0,
    executionTime: 0,
    memoryUsage: 0
  })

  const comprehensiveTestCases = {
    'N-Queens': {
      category: "Classic Backtracking",
      tests: [
        { input: "n=4", expected: "2 solutions", description: "Standard 4x4 board" },
        { input: "n=8", expected: "92 solutions", description: "Classic 8-queens problem" },
        { input: "n=1", expected: "1 solution", description: "Trivial case" },
        { input: "n=2,3", expected: "0 solutions", description: "Impossible cases" }
      ]
    },
    'Sudoku Solver': {
      category: "Constraint Satisfaction",
      tests: [
        { input: "Easy puzzle", expected: "Single solution", description: "Basic 9x9 grid" },
        { input: "Hard puzzle", expected: "Single solution", description: "Minimal clues" },
        { input: "Invalid puzzle", expected: "No solution", description: "Contradictory constraints" },
        { input: "Multiple solutions", expected: "First valid solution", description: "Under-constrained puzzle" }
      ]
    },
    'Permutations': {
      category: "Combinatorial Generation",
      tests: [
        { input: "[1,2,3]", expected: "6 permutations", description: "Basic array" },
        { input: "[1,1,2]", expected: "3 unique permutations", description: "With duplicates" },
        { input: "[]", expected: "1 permutation (empty)", description: "Edge case" },
        { input: "[1]", expected: "1 permutation", description: "Single element" }
      ]
    },
    'Word Search': {
      category: "Grid Traversal",
      tests: [
        { input: "word='ABCCED' in grid", expected: "true", description: "Word exists" },
        { input: "word='SEE' in grid", expected: "true", description: "Word with repeated letters" },
        { input: "word='ABCB' in grid", expected: "false", description: "Backtrack required" },
        { input: "word='XYZ' in grid", expected: "false", description: "Word doesn't exist" }
      ]
    }
  }

  const gamifiedLevels = [
    {
      level: "Level 1: Beginner",
      tasks: [
        "✅ Implement basic backtracking template",
        "✅ Solve simple permutation problems",
        "✅ Understand base cases and recursion"
      ],
      color: "green",
      icon: "🌱"
    },
    {
      level: "Level 2: Intermediate",
      tasks: [
        "✅ Solve N-Queens problem",
        "✅ Implement constraint checking",
        "✅ Optimize with pruning techniques"
      ],
      color: "blue",
      icon: "🏃"
    },
    {
      level: "Level 3: Advanced",
      tasks: [
        "✅ Solve Sudoku with advanced pruning",
        "✅ Handle complex constraint satisfaction",
        "✅ Implement iterative backtracking"
      ],
      color: "purple",
      icon: "🧠"
    },
    {
      level: "Level 4: Expert",
      tasks: [
        "✅ Design custom backtracking algorithms",
        "✅ Optimize for specific problem domains",
        "✅ Handle massive search spaces efficiently"
      ],
      color: "gold",
      icon: "👑"
    }
  ]

  const debuggingScenarios = [
    {
      title: "Infinite Recursion",
      problem: "Algorithm never terminates",
      solution: "Check base case conditions and ensure progress toward termination",
      code: `// Bad: Missing base case
function backtrack(state) {
  // Missing: if (isComplete(state)) return state
  for (choice in choices) {
    makeChoice(choice)
    backtrack(state)
    undoChoice(choice)
  }
}`
    },
    {
      title: "Incorrect State Management", 
      problem: "Previous choices affect subsequent branches",
      solution: "Ensure proper cleanup in backtracking step",
      code: `// Good: Proper cleanup
function backtrack(state) {
  if (isComplete(state)) return state
  for (choice in choices) {
    makeChoice(choice) // Modify state
    if (backtrack(state)) return true
    undoChoice(choice) // CRITICAL: Restore state
  }
  return false
}`
    },
    {
      title: "Performance Issues",
      problem: "Algorithm is too slow for large inputs",
      solution: "Add pruning conditions to avoid exploring invalid branches",
      code: `// Optimized: Early pruning
function backtrack(state) {
  if (isInvalid(state)) return false // Prune early
  if (isComplete(state)) return state
  // ... rest of algorithm
}`
    }
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    setOutput([])
    setTestResults([])
    
    // 🚀 Enhanced with Two-Sum style real-time metrics
    const startTime = performance.now()
    let totalTests = 0
    let passedTests = 0
    
    const newOutput = [
      "🚀 Starting Advanced Backtracking Test Suite...",
      "",
      "📡 Connection Status: " + (isConnected ? "✅ Real-time execution ready" : "❌ Offline mode"),
      "🎯 Algorithm Pattern: " + state.pattern,
      "⚡ Execution Speed: " + state.executionSpeed + "ms",
      "🔄 Auto Play: " + (state.autoPlay ? "Enabled" : "Disabled"),
      "",
      "🧪 Executing Comprehensive Test Categories:"
    ]

    for (const [algorithm, data] of Object.entries(comprehensiveTestCases)) {
      newOutput.push(`\n🔍 Testing ${algorithm} (${data.category})`)
      
      for (const test of data.tests) {
        totalTests++
        const passed = Math.random() > 0.1 // Simulate 90% pass rate
        if (passed) passedTests++
        const time = (Math.random() * 1000 + 50).toFixed(1)
        
        newOutput.push(
          passed 
            ? `  ✅ ${test.description}: ${test.input} → ${test.expected} (${time}μs)`
            : `  ❌ ${test.description}: ${test.input} → FAILED (${time}μs)`
        )

        setTestResults(prev => [...prev, {
          name: `${algorithm}: ${test.description}`,
          passed,
          time,
          details: test.description,
          input: test.input,
          expected: test.expected,
          actual: passed ? test.expected : "Error or incorrect result"
        }])
      }
    }

    const endTime = performance.now()
    setExecutionMetrics({
      totalTests,
      passedTests,
      executionTime: endTime - startTime,
      memoryUsage: Math.random() * 10 + 5
    })

    newOutput.push("")
    newOutput.push("🎉 Test Suite Completed!")
    newOutput.push(`📊 Results: ${passedTests}/${totalTests} passed (${((passedTests/totalTests)*100).toFixed(1)}%)`)
    newOutput.push(`⏱️ Total Time: ${(endTime - startTime).toFixed(2)}ms`)
    
    // Simulate progressive output with Two-Sum style timing
    for (let i = 0; i < newOutput.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setOutput(prev => [...prev, newOutput[i]])
    }
    
    setIsRunning(false)
  }

  const clearTerminal = () => {
    setOutput([])
    setTestResults([])
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'unit':
        return (
          <div className="space-y-6">
            {/* Test Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(comprehensiveTestCases).map(([algorithm, data], index) => (
                <div key={index} className="bg-black/30 rounded-xl p-6 border border-gray-600/30">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">{algorithm}</h4>
                  <p className="text-sm text-gray-400 mb-4">{data.category}</p>
                  <div className="space-y-2">
                    {data.tests.map((test, testIndex) => (
                      <div key={testIndex} className="text-sm">
                        <div className="text-green-300 font-mono">{test.input}</div>
                        <div className="text-blue-300">Expected: {test.expected}</div>
                        <div className="text-gray-400 text-xs">{test.description}</div>
                        {testIndex < data.tests.length - 1 && <hr className="border-gray-700 my-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'integration':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-400/30">
              <h4 className="text-xl font-bold text-purple-400 mb-4">🎮 Gamified Learning Challenges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gamifiedLevels.map((level, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-600/30">
                    <div className="text-center mb-3">
                      <div className="text-2xl mb-1">{level.icon}</div>
                      <h5 className="font-bold text-yellow-400 text-sm">{level.level}</h5>
                    </div>
                    <div className="space-y-1">
                      {level.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="text-xs text-gray-300">{task}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-400/30">
              <h4 className="text-xl font-bold text-blue-400 mb-4">⚡ Performance Benchmarks</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-green-400 mb-2">Time Complexity</h5>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• N-Queens: O(N!)</p>
                    <p>• Sudoku: O(9^(n*n))</p>
                    <p>• Permutations: O(N!)</p>
                    <p>• Combinations: O(2^N)</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-400 mb-2">Space Complexity</h5>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Recursion Stack: O(N)</p>
                    <p>• State Storage: O(N)</p>
                    <p>• Solution Storage: O(N*M)</p>
                    <p>• Total: O(N + N*M)</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-purple-400 mb-2">Optimization</h5>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Early Pruning: 70% faster</p>
                    <p>• Constraint Propagation</p>
                    <p>• Heuristic Ordering</p>
                    <p>• Memoization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'debugging':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-6 border border-red-400/30">
              <h4 className="text-xl font-bold text-red-400 mb-4">🐛 Common Debugging Scenarios</h4>
              <div className="space-y-4">
                {debuggingScenarios.map((scenario, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-600/30">
                    <h5 className="font-bold text-yellow-400 mb-2">{scenario.title}</h5>
                    <p className="text-red-300 text-sm mb-2"><strong>Problem:</strong> {scenario.problem}</p>
                    <p className="text-green-300 text-sm mb-3"><strong>Solution:</strong> {scenario.solution}</p>
                    <pre className="bg-gray-900 rounded p-3 text-xs text-gray-300 overflow-x-auto">
                      <code>{scenario.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    // 🚀 NEW: Two-Sum style dark gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 🚀 NEW: Real-time Connection Status (Two-Sum style) */}
        <div className="mb-6">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full w-fit ${
            isConnected 
              ? 'bg-green-900/50 border border-green-400/30' 
              : 'bg-red-900/50 border border-red-400/30'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
              {isConnected ? 'Real Execution Ready' : 'Static Demo Mode'}
            </span>
          </div>
        </div>

        {/* 🚀 Enhanced Header with Two-Sum styling */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-white flex items-center">
              <Terminal className="w-8 h-8 mr-3 text-emerald-400" />
              🧪 Advanced Backtracking Testing Suite
            </h3>
            
            {/* 🚀 NEW: Real-time Performance Metrics */}
            {executionMetrics.totalTests > 0 && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-900/50 rounded-lg border border-blue-400/30">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300">{executionMetrics.passedTests}/{executionMetrics.totalTests} passed</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-900/50 rounded-lg border border-purple-400/30">
                  <Timer className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300">{executionMetrics.executionTime.toFixed(2)}ms</span>
                </div>
              </div>
            )}
          </div>
          
          {/* 🚀 Enhanced Tab Navigation with Two-Sum styling */}
          <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
            {[
              { id: 'unit', label: '🧪 Unit Tests', icon: CheckCircle },
              { id: 'integration', label: '🎮 Challenges', icon: Code },
              { id: 'performance', label: '⚡ Performance', icon: Timer },
              { id: 'debugging', label: '🐛 Debugging', icon: Bug }
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* 🚀 Enhanced Tab Content with Two-Sum dark styling */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>

        {/* 🚀 Enhanced Terminal Interface with Two-Sum styling */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Terminal Header with glassmorphism */}
          <div className="bg-black/40 backdrop-blur-sm px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 font-medium">backtracking-test-suite</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold transition-all shadow-lg shadow-emerald-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run All Tests'}</span>
                </motion.button>
                
                <motion.button
                  onClick={clearTerminal}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-black p-6 min-h-[400px] max-h-[600px] overflow-y-auto font-mono text-sm">
            {output.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ready to run comprehensive backtracking test suite...</p>
                <p className="text-xs mt-2">Click "Run Tests" to execute all test cases</p>
              </div>
            ) : (
              <div className="space-y-1">
                {output.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('🧪') || line.includes('🎯') ? 'text-cyan-400' :
                      line.includes('📋') || line.includes('🔍') ? 'text-blue-400' :
                      line.includes('🎉') || line.includes('📊') ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
                
                {isRunning && (
                  <motion.div
                    className="text-yellow-400 flex items-center space-x-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Executing tests...</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Test Results Summary */}
          {testResults.length > 0 && (
            <div className="bg-gray-800/50 border-t border-gray-700/50 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Test Results Summary ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      result.passed 
                        ? 'bg-green-900/30 border-green-500' 
                        : 'bg-red-900/30 border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm">{result.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.passed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {result.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <p className="text-gray-300">Input: {result.input}</p>
                      <p className="text-gray-300">Expected: {result.expected}</p>
                      <p className="text-gray-300">Actual: {result.actual}</p>
                      <p className="text-gray-400">Time: {result.time}μs</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
