// Container With Most Water - Dedicated page with visual representation
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Shuffle, Layers, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContainerWaterPage() {
  const [heights, setHeights] = useState([1, 8, 6, 2, 5, 4, 8, 3, 7])
  const [leftPointer, setLeftPointer] = useState(0)
  const [rightPointer, setRightPointer] = useState(8)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Array<{
    left: number
    right: number
    width: number
    height: number
    area: number
    action: string
    reasoning: string
  }>>([])
  const [maxArea, setMaxArea] = useState(0)
  const [bestSolution, setBestSolution] = useState<{left: number, right: number, area: number} | null>(null)

  const generateRandomHeights = () => {
    const newHeights = Array.from({length: 9}, () => Math.floor(Math.random() * 10) + 1)
    setHeights(newHeights)
    setLeftPointer(0)
    setRightPointer(newHeights.length - 1)
    setMaxArea(0)
    setBestSolution(null)
    setSteps([])
    setCurrentStep(0)
  }

  const runContainerAlgorithm = async () => {
    setIsAnimating(true)
    setMaxArea(0)
    setBestSolution(null)
    setSteps([])
    
    const algorithmSteps: Array<{
      left: number, right: number, width: number, height: number, area: number, action: string, reasoning: string
    }> = []
    
    let left = 0
    let right = heights.length - 1
    let currentMaxArea = 0
    let bestLeft = 0, bestRight = 0

    while (left < right) {
      const width = right - left
      const height = Math.min(heights[left], heights[right])
      const area = width * height
      
      if (area > currentMaxArea) {
        currentMaxArea = area
        bestLeft = left
        bestRight = right
      }

      const action = `Area = ${width} × ${height} = ${area} (max so far: ${currentMaxArea})`
      const reasoning = heights[left] < heights[right] 
        ? `Move LEFT pointer (height ${heights[left]} < ${heights[right]}). Moving the shorter wall might find a taller one.`
        : `Move RIGHT pointer (height ${heights[right]} ≤ ${heights[left]}). Moving the shorter wall might find a taller one.`

      algorithmSteps.push({
        left, right, width, height, area, action, reasoning
      })

      // Move the pointer at the shorter wall
      if (heights[left] < heights[right]) {
        left++
      } else {
        right--
      }
    }

    setSteps(algorithmSteps)
    setBestSolution({left: bestLeft, right: bestRight, area: currentMaxArea})
    
    // Animate through steps
    for (let i = 0; i < algorithmSteps.length; i++) {
      const step = algorithmSteps[i]
      setLeftPointer(step.left)
      setRightPointer(step.right)
      setMaxArea(currentMaxArea)
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 2500))
    }

    setIsAnimating(false)
  }

  const reset = () => {
    setLeftPointer(0)
    setRightPointer(heights.length - 1)
    setMaxArea(0)
    setBestSolution(null)
    setSteps([])
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const currentWidth = rightPointer - leftPointer
  const currentHeight = Math.min(heights[leftPointer], heights[rightPointer])
  const currentArea = currentWidth * currentHeight
  const currentStepData = steps[currentStep]

  // Calculate max height for scaling
  const maxHeight = Math.max(...heights)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-teal-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-b border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Container With Most Water
                </h1>
                <p className="text-green-200 mt-1">
                  Greedy two pointers for area maximization
                </p>
              </div>
            </div>
            
            <Link 
              href="/arrays"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arrays</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Problem explanation from your markdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-400/30"
          >
            <h3 className="text-xl font-bold text-white mb-4">🏊‍♂️ The Water Container Challenge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-200">
              <div>
                <h4 className="font-semibold text-white mb-2">Real-World Analogy:</h4>
                <p className="text-sm">Like finding the best pair of walls to build a swimming pool. Width = distance between walls, Height = limited by shorter wall (water spills over).</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Key Insight:</h4>
                <p className="text-sm">We want to maximize <strong>area = width × min(height1, height2)</strong>. Always move the shorter wall inward!</p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-white font-semibold">Heights:</label>
              <div className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm">
                [{heights.join(', ')}]
              </div>
            </div>
            
            <button
              onClick={runContainerAlgorithm}
              disabled={isAnimating}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              <span>Find Max Area</span>
            </button>
            
            <button
              onClick={reset}
              disabled={isAnimating}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={generateRandomHeights}
              disabled={isAnimating}
              className="flex items-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Shuffle className="w-5 h-5" />
              <span>New Heights</span>
            </button>
          </div>

          {/* Visual Container Representation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🏗️ Container Visualization</h3>
            </div>

            {/* Water container visual */}
            <div className="relative" style={{ height: '300px' }}>
              <div className="flex items-end justify-center space-x-1 h-full">
                {heights.map((height, index) => {
                  const isLeftPointer = index === leftPointer
                  const isRightPointer = index === rightPointer
                  const isInBestSolution = bestSolution && (index === bestSolution.left || index === bestSolution.right)
                  const heightPercentage = (height / maxHeight) * 100
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      {/* Pointer indicators */}
                      <div className="h-8 flex items-end mb-2">
                        {isLeftPointer && (
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-blue-400 font-bold text-sm"
                          >
                            ↑ LEFT
                          </motion.div>
                        )}
                        {isRightPointer && (
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                            className="text-red-400 font-bold text-sm"
                          >
                            ↑ RIGHT
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Wall */}
                      <div className="relative">
                        <motion.div
                          style={{ height: `${heightPercentage * 2}px` }}
                          className={`
                            w-12 border-2 transition-all duration-300
                            ${isInBestSolution
                              ? 'bg-green-500 border-green-300 shadow-lg shadow-green-500/50'
                              : isLeftPointer || isRightPointer
                                ? 'bg-yellow-500 border-yellow-300 shadow-lg shadow-yellow-500/30'
                                : 'bg-blue-400 border-blue-300'
                            }
                          `}
                        />
                        
                        {/* Height label */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-white text-sm font-bold">
                          {height}
                        </div>
                        
                        {/* Index */}
                        <div className="text-green-300 text-xs mt-1 text-center font-semibold">
                          {index}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Water visualization between current pointers */}
              {leftPointer < rightPointer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  style={{
                    position: 'absolute',
                    left: `${((leftPointer + 0.5) / heights.length) * 100}%`,
                    right: `${((heights.length - rightPointer - 0.5) / heights.length) * 100}%`,
                    bottom: '32px',
                    height: `${(currentHeight / maxHeight) * 200}px`,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    border: '2px solid rgb(59, 130, 246)',
                    borderRadius: '4px'
                  }}
                  className="flex items-center justify-center"
                >
                  <div className="text-white font-bold text-lg">
                    💧 {currentArea}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Current calculation */}
            <div className="text-center mt-6">
              <div className={`
                inline-block px-8 py-4 rounded-xl font-bold text-xl border-2
                ${bestSolution && currentArea === bestSolution.area
                  ? 'bg-green-500 text-white border-green-300 shadow-lg shadow-green-500/30'
                  : 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-500/30'
                }
              `}>
                Area = {currentWidth} × {currentHeight} = {currentArea}
                {maxArea > 0 && ` (Max: ${maxArea})`}
                {bestSolution && currentArea === bestSolution.area && ' 🏆 OPTIMAL!'}
              </div>
            </div>
          </div>

          {/* Step-by-step explanation */}
          {currentStepData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">🔍 Current Step Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-green-300 font-semibold">Step {currentStep + 1}:</span>
                    <div className="text-white font-medium mt-1">{currentStepData.action}</div>
                  </div>
                  <div>
                    <span className="text-green-300 font-semibold">Strategy:</span>
                    <div className="text-green-200 mt-1">{currentStepData.reasoning}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-green-300">Width</div>
                      <div className="text-white font-bold">{currentStepData.width}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-green-300">Height</div>
                      <div className="text-white font-bold">{currentStepData.height}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-green-300">Area</div>
                      <div className="text-white font-bold">{currentStepData.area}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">⚡ Greedy Strategy</h3>
                <div className="space-y-3 text-green-200">
                  <div><strong className="text-white">Time Complexity:</strong> O(n) - Single pass</div>
                  <div><strong className="text-white">Space Complexity:</strong> O(1) - Two pointers only</div>
                  <div><strong className="text-white">Key Insight:</strong> Always move the shorter wall</div>
                  <div><strong className="text-white">Why:</strong> Moving taller wall can only decrease area</div>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm explanation from your markdown */}
          <div className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 rounded-xl p-6 border border-teal-400/30">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Greedy Algorithm Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-teal-400 font-semibold mb-3">📋 Step-by-Step Process:</h4>
                <ol className="text-teal-200 text-sm space-y-2">
                  <li>1. Start with widest possible container (left=0, right=n-1)</li>
                  <li>2. Calculate current area = width × min(height[left], height[right])</li>
                  <li>3. Update maximum area if current is better</li>
                  <li>4. Move the pointer at the SHORTER wall inward</li>
                  <li>5. Repeat until pointers meet</li>
                </ol>
              </div>
              <div>
                <h4 className="text-teal-400 font-semibold mb-3">🧠 Why Greedy Works:</h4>
                <ul className="text-teal-200 text-sm space-y-2">
                  <li>• Start with maximum possible width</li>
                  <li>• Moving taller wall → width ↓, height same/↓ → area ↓</li>
                  <li>• Moving shorter wall → width ↓, height might ↑</li>
                  <li>• Greedy: always try to improve limiting factor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code implementation from your markdown */}
          <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">💻 Implementation</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`function maxArea(height) {
    if (height.length < 2) return 0;  // Need at least 2 walls
    
    let left = 0;                     // Start from leftmost wall
    let right = height.length - 1;    // Start from rightmost wall
    let maxArea = 0;                  // Track maximum area found
    
    while (left < right) {
        // Calculate current container area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;
        
        // Update maximum area if current is better
        maxArea = Math.max(maxArea, currentArea);
        
        // Move the pointer at the shorter wall
        // Why? Moving taller wall can only decrease area
        if (height[left] < height[right]) {
            left++;      // Left wall is shorter, move it inward
        } else {
            right--;     // Right wall is shorter (or equal), move it inward
        }
    }
    
    return maxArea;
}

// Time: O(n) - Single pass through array
// Space: O(1) - Only using two pointer variables`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
