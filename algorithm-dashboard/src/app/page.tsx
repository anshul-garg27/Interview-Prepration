'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  TreePine, 
  BarChart3, 
  Network, 
  BookOpen, 
  Play,
  ArrowRight,
  Brain
} from 'lucide-react'

const modules = [
  {
    id: 'trees',
    title: 'Trees & Binary Search',
    icon: TreePine,
    description: 'Interactive tree traversals, BST operations, and hierarchical data structures',
    color: 'from-emerald-500 to-teal-600',
    href: '/trees' // Placeholder for future implementation
  },
  {
    id: 'arrays',
    title: 'Arrays & Two Pointers',
    icon: BarChart3,
    description: 'Dynamic array visualizations, two pointers technique, and sliding window',
    color: 'from-blue-500 to-indigo-600',
    href: '/arrays'
  },
  {
    id: 'graphs',
    title: 'Graphs & Networks',
    icon: Network,
    description: 'Graph traversals, shortest paths, and network algorithms',
    color: 'from-purple-500 to-pink-600',
    href: '/graphs' // Placeholder for future implementation
  },
  {
    id: 'materials',
    title: 'Study Materials',
    icon: BookOpen,
    description: 'Your comprehensive algorithm study guides and notes',
    color: 'from-orange-500 to-red-600',
    href: '/materials' // Placeholder for future implementation
  }
]

// Simple placeholder components
const TreeVisualizer = () => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">🌳 Tree Visualizer</h2>
      <p className="text-blue-200">Interactive tree algorithms coming soon!</p>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <TreePine className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Tree visualization will load here</p>
          <p className="text-blue-300 mt-2">Binary tree traversals, BST operations, and more!</p>
        </div>
      </div>
    </div>
  </div>
)

// Enhanced Array Visualizer with content from your markdown file
const ArrayVisualizer = () => {
  const [array, setArray] = useState([2, 7, 11, 15])
  const [target, setTarget] = useState(9)
  const [leftPointer, setLeftPointer] = useState(0)
  const [rightPointer, setRightPointer] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Array<{
    left: number
    right: number
    sum: number
    action: string
    reasoning: string
  }>>([])
  const [foundSolution, setFoundSolution] = useState<{left: number, right: number} | null>(null)
  const [problemType, setProblemType] = useState<'twoSum' | 'containerWater'>('twoSum')

  const generateRandomArray = () => {
    const newArray = Array.from({length: 8}, () => Math.floor(Math.random() * 20) + 1).sort((a, b) => a - b)
    setArray(newArray)
    setLeftPointer(0)
    setRightPointer(newArray.length - 1)
    setFoundSolution(null)
    setSteps([])
    setCurrentStep(0)
  }

  const runTwoSumAlgorithm = async () => {
    setIsAnimating(true)
    setFoundSolution(null)
    setSteps([])
    
    const algorithmSteps: Array<{left: number, right: number, sum: number, action: string, reasoning: string}> = []
    let left = 0
    let right = array.length - 1

    while (left < right) {
      const sum = array[left] + array[right]
      
      if (sum === target) {
        algorithmSteps.push({
          left, right, sum,
          action: `🎉 FOUND! ${array[left]} + ${array[right]} = ${sum}`,
          reasoning: `Perfect match! The values at indices ${left} and ${right} sum to our target.`
        })
        setFoundSolution({left, right})
        break
      } else if (sum < target) {
        algorithmSteps.push({
          left, right, sum,
          action: `${array[left]} + ${array[right]} = ${sum} < ${target} (too small)`,
          reasoning: `Sum is less than target. Move LEFT pointer RIGHT to get a larger sum.`
        })
        left++
      } else {
        algorithmSteps.push({
          left, right, sum,
          action: `${array[left]} + ${array[right]} = ${sum} > ${target} (too big)`,
          reasoning: `Sum is greater than target. Move RIGHT pointer LEFT to get a smaller sum.`
        })
        right--
      }
    }

    if (!foundSolution && left >= right) {
      algorithmSteps.push({
        left, right, sum: 0,
        action: 'No solution found',
        reasoning: 'Pointers have crossed without finding a valid pair.'
      })
    }

    setSteps(algorithmSteps)
    
    // Animate through steps
    for (let i = 0; i < algorithmSteps.length; i++) {
      const step = algorithmSteps[i]
      setLeftPointer(step.left)
      setRightPointer(step.right)
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    setIsAnimating(false)
  }

  const reset = () => {
    setLeftPointer(0)
    setRightPointer(array.length - 1)
    setFoundSolution(null)
    setSteps([])
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const currentSum = array[leftPointer] + array[rightPointer]
  const currentStepData = steps[currentStep]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">🎯 Two Pointers Array Mastery</h2>
        <p className="text-blue-200 text-lg">
          Interactive visualization based on your complete study guide
        </p>
      </motion.div>

      {/* Algorithm Explanation from your markdown */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-400/30">
        <h3 className="text-xl font-bold text-white mb-4">🧠 The Core Concept</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-200">
          <div>
            <h4 className="font-semibold text-white mb-2">Real-World Analogy:</h4>
            <p className="text-sm">Like searching for two books in a library. Instead of checking every book with every other book (slow!), start from both ends and walk toward center (fast!).</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">The Magic:</h4>
            <p className="text-sm">Sorted array gives us ordering information. If sum is too small → move left right. If sum is too big → move right left.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-white font-semibold">Target Sum:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
            disabled={isAnimating}
          />
        </div>
        
        <button
          onClick={runTwoSumAlgorithm}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>Run Two Sum Algorithm</span>
        </button>
        
        <button
          onClick={reset}
          disabled={isAnimating}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          Reset
        </button>
        
        <button
          onClick={generateRandomArray}
          disabled={isAnimating}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          New Array
        </button>
      </div>

      {/* Array Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex justify-center items-end space-x-3 mb-8">
          {array.map((value, index) => {
            const isLeftPointer = index === leftPointer
            const isRightPointer = index === rightPointer
            const isInSolution = foundSolution && (index === foundSolution.left || index === foundSolution.right)
            
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Pointer indicators */}
                <div className="h-12 flex flex-col justify-end mb-2">
                  {isLeftPointer && (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-blue-400 font-bold text-lg"
                    >
                      ↑ LEFT
                    </motion.div>
                  )}
                  {isRightPointer && (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                      className="text-red-400 font-bold text-lg"
                    >
                      ↑ RIGHT
                    </motion.div>
                  )}
                </div>
                
                {/* Array element */}
                <motion.div
                  animate={isInSolution ? { 
                    scale: [1, 1.2, 1], 
                    backgroundColor: ['rgb(34, 197, 94)', 'rgb(16, 185, 129)', 'rgb(34, 197, 94)']
                  } : {}}
                  transition={{ duration: 0.6 }}
                  className={`
                    w-16 h-16 flex items-center justify-center rounded-xl font-bold text-lg border-2 transition-all
                    ${isInSolution
                      ? 'bg-green-500 text-white border-green-300 shadow-lg shadow-green-500/30'
                      : isLeftPointer || isRightPointer
                        ? 'bg-yellow-500 text-black border-yellow-300 shadow-lg shadow-yellow-500/30'
                        : 'bg-white/90 text-gray-800 border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  {value}
                </motion.div>
                
                {/* Index */}
                <div className="text-blue-300 text-sm mt-2 font-semibold">
                  {index}
                </div>
              </div>
            )
          })}
        </div>

        {/* Current calculation */}
        <div className="text-center">
          <div className={`
            inline-block px-8 py-4 rounded-xl font-bold text-xl border-2
            ${currentSum === target
              ? 'bg-green-500 text-white border-green-300 shadow-lg shadow-green-500/30'
              : currentSum < target
                ? 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-500/30'
                : 'bg-red-500 text-white border-red-300 shadow-lg shadow-red-500/30'
            }
          `}>
            {array[leftPointer]} + {array[rightPointer]} = {currentSum}
            {currentSum === target && ' 🎉 TARGET FOUND!'}
            {currentSum < target && ' (too small - move LEFT →)'}
            {currentSum > target && ' (too big - move ← RIGHT)'}
          </div>
        </div>
      </div>

      {/* Step-by-step explanation from your markdown */}
      {currentStepData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🔍 Current Step Analysis</h3>
            <div className="space-y-3">
              <div>
                <span className="text-blue-300 font-semibold">Step {currentStep + 1}:</span>
                <div className="text-white font-medium mt-1">{currentStepData.action}</div>
              </div>
              <div>
                <span className="text-blue-300 font-semibold">Reasoning:</span>
                <div className="text-blue-200 mt-1">{currentStepData.reasoning}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">📊 Algorithm Metrics</h3>
            <div className="space-y-3 text-blue-200">
              <div><strong className="text-white">Time Complexity:</strong> O(n) - Single pass</div>
              <div><strong className="text-white">Space Complexity:</strong> O(1) - Two pointers only</div>
              <div><strong className="text-white">Current Pointers:</strong> LEFT={leftPointer}, RIGHT={rightPointer}</div>
              <div><strong className="text-white">Steps Taken:</strong> {currentStep + 1} / {steps.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Key insights from your markdown */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-bold text-white mb-4">🚀 When to Use Two Pointers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-green-400 font-semibold mb-2">✅ Perfect For:</h4>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• Array is sorted (or can be sorted)</li>
              <li>• Looking for pairs with specific sum</li>
              <li>• Need O(1) extra space</li>
              <li>• Finding palindromes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-semibold mb-2">❌ Not Suitable For:</h4>
            <ul className="text-red-200 text-sm space-y-1">
              <li>• Array is unsorted and can't be sorted</li>
              <li>• Need to maintain original indices</li>
              <li>• Looking for single elements</li>
              <li>• Order of operations matters</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code implementation from your markdown */}
      <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">💻 Implementation (from your study guide)</h3>
        <pre className="text-green-400 text-sm overflow-x-auto">
{`function twoSum(nums, target) {
    let left = 0;                    // Start from smallest element
    let right = nums.length - 1;     // Start from largest element
    
    while (left < right) {           // Continue until pointers meet
        const currentSum = nums[left] + nums[right];
        
        if (currentSum === target) {
            return [left, right];    // Found the answer!
        } else if (currentSum < target) {
            left++;                  // Need bigger sum → move left right
        } else {
            right--;                 // Need smaller sum → move right left
        }
    }
    
    return [];  // No solution found
}

// Time: O(n) - Single pass through array
// Space: O(1) - Only using two pointer variables`}
        </pre>
      </div>
    </div>
  )
}

const GraphVisualizer = () => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">🌐 Graph Visualizer</h2>
      <p className="text-blue-200">Graph algorithms and pathfinding!</p>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Network className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg">Graph visualization will load here</p>
          <p className="text-blue-300 mt-2">BFS, DFS, shortest paths, and network algorithms!</p>
        </div>
      </div>
    </div>
  </div>
)

const StudyMaterials = () => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">📚 Study Materials</h2>
      <p className="text-blue-200">Your algorithm study library!</p>
    </div>
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          'Arrays & Two Pointers Complete',
          'Trees Complete Guide',
          'Dynamic Programming Strategy',
          'Graphs Complete Ecosystem',
          'Binary Search Detective',
          'Backtracking Complete'
        ].map((title, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 p-4 rounded-lg border border-white/20 hover:border-blue-400 transition-colors cursor-pointer"
          >
            <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-blue-200 text-sm mt-1">Algorithm study guide</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-b border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Algorithm Mastery Dashboard
                </h1>
                <p className="text-blue-200 mt-1">
                  Next.js + React - Professional Multi-Page Structure! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Module Selection */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Explore interactive algorithm visualizations with beautiful React components.
              Each module now has its own dedicated pages with comprehensive content!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={module.href || '#'} className="block">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${module.color}`}>
                          <module.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {module.title}
                          </h3>
                          {module.href && (
                            <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                              ✅ Available Now
                            </span>
                          )}
                          {!module.href && (
                            <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold">
                              🚧 Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-blue-200 text-lg mb-6 leading-relaxed">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center text-white font-semibold group-hover:text-blue-300 transition-colors">
                        <Play className="w-5 h-5 mr-2" />
                        {module.href ? 'Start Learning' : 'Coming Soon'}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-blue-400/30 mt-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🎯 What Makes This Special</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Multi-Page Structure</h4>
                <p className="text-blue-200 text-sm">Each algorithm gets its own dedicated page with comprehensive content</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Interactive Visualizations</h4>
                <p className="text-blue-200 text-sm">Step-by-step animations with detailed explanations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Study Guide Integration</h4>
                <p className="text-blue-200 text-sm">Based on your comprehensive markdown study materials</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
          >
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-white">Study Materials</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">React</div>
              <div className="text-white">Modern Framework</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">Next.js</div>
              <div className="text-white">Multi-Page App</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-orange-400 mb-2">Interactive</div>
              <div className="text-white">Visualizations</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-blue-300">
            Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-blue-400 mt-2">
            🚀 Professional multi-page structure with dedicated algorithm visualizers!
          </p>
        </div>
      </footer>
    </div>
  )
}
