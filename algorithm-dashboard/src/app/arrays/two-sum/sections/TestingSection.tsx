'use client'

import { motion } from 'framer-motion'
import { Terminal, Play, RotateCcw, CheckCircle } from 'lucide-react'

interface TestResult {
  name: string
  passed: boolean
  time: string
  details: string
  input: string
  expected: string
  actual: string
}

interface TestingSectionProps {
  isRunning: boolean
  output: string[]
  testResults: TestResult[]
  currentCommandIndex: number
  commands: Array<{ command: string, description: string }>
  terminalHistory: string[]
  runAllTests: () => Promise<void>
  clearTerminal: () => void
}

export default function TestingSection({
  isRunning,
  output,
  testResults,
  currentCommandIndex,
  commands,
  terminalHistory,
  runAllTests,
  clearTerminal
}: TestingSectionProps) {
  
  const comprehensiveTestCases = [
    {
      category: "Basic Mastery",
      tests: [
        { input: "[2, 7, 11, 15], target=9", expected: "[0, 1]", description: "Classic example" },
        { input: "[3, 2, 4], target=6", expected: "[1, 2]", description: "Unordered array" },
        { input: "[3, 3], target=6", expected: "[0, 1]", description: "Duplicate values" },
        { input: "[1, 2, 3, 4, 5], target=8", expected: "[2, 4]", description: "Multiple possibilities" }
      ]
    },
    {
      category: "Edge Cases",
      tests: [
        { input: "[], target=0", expected: "[]", description: "Empty array" },
        { input: "[5], target=5", expected: "[]", description: "Single element" },
        { input: "[1, 2], target=4", expected: "[]", description: "No solution" },
        { input: "[-1, -2, -3, -4, -5], target=-8", expected: "[2, 4]", description: "Negative numbers" }
      ]
    },
    {
      category: "Performance Tests",
      tests: [
        { input: "[10^9, 10^9-1], target=2*10^9-1", expected: "[0, 1]", description: "Large numbers" },
        { input: "Array of 100,000 elements", expected: "< 1 second", description: "Large dataset" },
        { input: "Worst case: solution at end", expected: "O(n) time", description: "Algorithm efficiency" }
      ]
    }
  ]

  const gamifiedLevels = [
    {
      level: "Level 1: Apprentice",
      tasks: [
        "✅ Implement basic two sum with hash map",
        "✅ Handle edge cases (empty array, no solution)",
        "✅ Explain time/space complexity"
      ],
      color: "green"
    },
    {
      level: "Level 2: Journeyman",
      tasks: [
        "✅ Implement two pointers approach",
        "✅ Handle duplicates correctly",
        "✅ Optimize for memory usage"
      ],
      color: "blue"
    },
    {
      level: "Level 3: Expert",
      tasks: [
        "✅ Implement all variations (closest, all pairs, etc.)",
        "✅ Handle floating point numbers",
        "✅ Implement in multiple languages"
      ],
      color: "purple"
    },
    {
      level: "Level 4: Master",
      tasks: [
        "✅ Design API for streaming data",
        "✅ Handle concurrent access",
        "✅ Optimize for specific hardware"
      ],
      color: "gold"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Comprehensive Test Suite Header */}
      <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl p-8 border border-emerald-400/30 backdrop-blur-sm mb-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Terminal className="w-7 h-7 mr-3 text-emerald-400" />
          🔍 Comprehensive Testing Strategy
        </h3>
        
        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {comprehensiveTestCases.map((category, index) => (
            <div key={index} className="bg-black/30 rounded-xl p-6 border border-gray-600/30">
              <h4 className="text-lg font-bold text-yellow-400 mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.tests.map((test, testIndex) => (
                  <div key={testIndex} className="text-sm">
                    <div className="text-green-300 font-mono">{test.input}</div>
                    <div className="text-blue-300">Expected: {test.expected}</div>
                    <div className="text-gray-400 text-xs">{test.description}</div>
                    <hr className="border-gray-700 my-2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gamified Learning Levels */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-400/30">
          <h4 className="text-xl font-bold text-purple-400 mb-4">🎮 Gamified Learning Challenges</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamifiedLevels.map((level, index) => (
              <div key={index} className={`bg-gradient-to-br from-${level.color}-900/50 to-${level.color}-800/50 rounded-lg p-4 border border-${level.color}-400/30`}>
                <h5 className={`font-bold text-${level.color}-400 mb-2 text-sm`}>{level.level}</h5>
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

      {/* Enhanced Terminal Interface */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-600/50 shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 font-medium">two-sum-test-suite</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </motion.button>
              
              <motion.button
                onClick={clearTerminal}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
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
              <p>Ready to run comprehensive test suite...</p>
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
                    line.includes('📋') ? 'text-blue-400' :
                    line.includes('🎉') ? 'text-yellow-400' :
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
              
              {/* Ready prompt */}
              {!isRunning && currentCommandIndex < commands.length && (
                <div className="text-green-400">
                  <span className="mr-1">$</span>
                  <span className="opacity-50">Ready to run: {commands[currentCommandIndex]?.command}</span>
                </div>
              )}
              
              {/* Completion message */}
              {!isRunning && currentCommandIndex >= commands.length && terminalHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-cyan-400 font-semibold mt-4 p-3 bg-cyan-900/20 rounded border border-cyan-500/30"
                >
                  🎉 All tests completed! Terminal session finished.
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
              Test Results Summary
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
  )
}
