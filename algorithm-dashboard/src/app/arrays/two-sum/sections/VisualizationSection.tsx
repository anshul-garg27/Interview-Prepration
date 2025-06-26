'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Zap, Play, Shuffle, Dice6 } from 'lucide-react'
import { StepVisualizer } from '@/components/StepVisualizer'

interface VisualizationSectionProps {
  array: number[]
  target: number
  leftPointer: number
  rightPointer: number
  currentSum: number
  foundSolution: { left: number; right: number } | null
  algorithmSteps: any[]
  currentStepIndex: number
  isStepPlaying: boolean
  stepPlaybackSpeed: number
  onStepChange: (step: number) => void
  onPlayToggle: () => void
  onSpeedChange: (speed: number) => void
  runTwoSumAlgorithm: () => void
  onArrayChange?: (newArray: number[]) => void
  onTargetChange?: (newTarget: number) => void
}

export const VisualizationSection: React.FC<VisualizationSectionProps> = ({
  array,
  target,
  leftPointer,
  rightPointer,
  currentSum,
  foundSolution,
  algorithmSteps,
  currentStepIndex,
  isStepPlaying,
  stepPlaybackSpeed,
  onStepChange,
  onPlayToggle,
  onSpeedChange,
  runTwoSumAlgorithm,
  onArrayChange,
  onTargetChange
}) => {
  // Random array generator function
  const generateRandomArray = (size: number = 8, min: number = 1, max: number = 20) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => a - b) // Keep it sorted for Two Pointers approach
    
    if (onArrayChange) {
      onArrayChange(newArray)
    }
  }

  // Generate random target based on array
  const generateRandomTarget = () => {
    if (array.length >= 2) {
      // Sometimes use a valid sum, sometimes use a random number
      const useValidSum = Math.random() > 0.5
      let newTarget: number
      
      if (useValidSum) {
        // Pick two random elements and use their sum
        const idx1 = Math.floor(Math.random() * array.length)
        let idx2 = Math.floor(Math.random() * array.length)
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * array.length)
        }
        newTarget = array[idx1] + array[idx2]
      } else {
        // Generate a random target
        const min = Math.min(...array)
        const max = Math.max(...array)
        newTarget = Math.floor(Math.random() * (max * 2 - min)) + min
      }
      
      if (onTargetChange) {
        onTargetChange(newTarget)
      }
    }
  }

  // Preset interesting arrays
  const presetArrays = [
    { name: "Classic", array: [2, 7, 11, 15], target: 9 },
    { name: "Challenge", array: [3, 2, 4], target: 6 },
    { name: "Large", array: [1, 5, 8, 12, 15, 18, 22, 25], target: 27 },
    { name: "Duplicates", array: [3, 3, 4, 4, 5, 5], target: 8 },
    { name: "Edge Case", array: [-1, 0, 1, 2], target: 1 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* 🎲 SPECTACULAR RANDOM ARRAY GENERATOR */}
      <div className="bg-gradient-to-br from-purple-900/60 to-pink-800/60 rounded-3xl p-8 border-2 border-purple-400/40 backdrop-blur-lg shadow-2xl overflow-hidden relative">
        {/* Animated Background Magic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-purple-400/20 rounded-full"
              animate={{
                x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                scale: [0.5, 2, 0.5],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-3xl font-bold text-purple-300 flex items-center">
              🎲 Array Generator Magic
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="ml-3 text-4xl"
              >
                🎰
              </motion.div>
            </h4>
            <div className="bg-purple-900/50 rounded-full px-6 py-3 border border-purple-400/30">
              <span className="text-purple-300 font-mono text-lg font-bold">Random Test Cases</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Random Generator Controls */}
            <div className="space-y-6">
              <div className="bg-black/50 rounded-2xl p-6 border border-purple-500/30">
                <h5 className="text-xl font-bold text-purple-400 mb-6 flex items-center">
                  🎯 Custom Generator
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    ⚙️
                  </motion.div>
                </h5>

                <div className="space-y-4">
                  {/* Array Size Selector */}
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <label className="text-purple-300 font-bold mb-2 block">Array Size</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[4, 6, 8, 10].map(size => (
                        <motion.button
                          key={size}
                          onClick={() => generateRandomArray(size)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-lg py-2 px-3 text-purple-300 font-bold transition-all"
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => generateRandomArray()}
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-4 px-6 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center"
                    >
                      <Shuffle className="w-5 h-5 mr-2" />
                      New Array
                    </motion.button>

                    <motion.button
                      onClick={generateRandomTarget}
                      whileHover={{ scale: 1.05, rotateY: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-xl py-4 px-6 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center"
                    >
                      <Dice6 className="w-5 h-5 mr-2" />
                      New Target
                    </motion.button>
                  </div>

                  {/* Ultimate Random Button */}
                  <motion.button
                    onClick={() => {
                      generateRandomArray(Math.floor(Math.random() * 7) + 4)
                      setTimeout(generateRandomTarget, 100)
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 rounded-xl py-6 px-8 text-white font-bold text-xl shadow-2xl transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full animate-pulse" />
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mr-3 text-2xl"
                      >
                        🎲
                      </motion.div>
                      SURPRISE ME!
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="ml-3 text-2xl"
                      >
                        ✨
                      </motion.div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right: Preset Arrays */}
            <div className="bg-black/50 rounded-2xl p-6 border border-purple-500/30">
              <h5 className="text-xl font-bold text-purple-400 mb-6 flex items-center">
                📚 Preset Challenges
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2"
                >
                  📖
                </motion.div>
              </h5>

              <div className="space-y-3">
                {presetArrays.map((preset, idx) => (
                  <motion.div
                    key={preset.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-xl p-4 border border-purple-400/20 cursor-pointer transition-all"
                    onClick={() => {
                      if (onArrayChange) onArrayChange(preset.array)
                      if (onTargetChange) onTargetChange(preset.target)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 font-bold text-lg">{preset.name}</span>
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        className="text-purple-400"
                      >
                        🎯
                      </motion.div>
                    </div>
                    <div className="text-gray-300 text-sm mb-2">
                      Array: [{preset.array.join(', ')}]
                    </div>
                    <div className="text-purple-200 text-sm">
                      Target: <span className="font-bold text-purple-300">{preset.target}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fun Facts */}
              <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-400/20">
                <div className="text-center">
                  <div className="text-purple-300 font-bold mb-2">🎪 Fun Fact</div>
                  <div className="text-gray-300 text-sm">
                    Our generator creates {Math.random() > 0.5 ? 'solvable' : 'challenging'} test cases 
                    50% of the time to keep you on your toes!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Array Display */}
          <div className="mt-8 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl p-6 border border-purple-400/20">
            <div className="text-center">
              <h6 className="text-lg font-bold text-purple-400 mb-4">🎯 Current Test Case</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-2">Array:</div>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-purple-300 font-bold text-lg">
                    [{array.join(', ')}]
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Target:</div>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-pink-300 font-bold text-lg">
                    {target}
                  </div>
                </div>
              </div>
              
              {/* Visualization Trigger */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <motion.button
                  onClick={runTwoSumAlgorithm}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-4 px-8 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center mx-auto"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Visualize This Array!
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="ml-2"
                  >
                    🚀
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Problem Overview Card */}
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-7 h-7 mr-3 text-cyan-400" />
          🎨 Interactive Visualization
        </h3>
        
        {/* Real-World Analogy */}
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-400/30 mb-6">
          <h4 className="text-xl font-bold text-green-400 mb-3">🌍 Real-World Analogy</h4>
          <p className="text-blue-200 leading-relaxed mb-4">
            Like finding two people in a line whose ages add up to a specific number:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h5 className="font-bold text-yellow-300 mb-2">❌ Brute Force</h5>
              <p className="text-sm text-gray-300">Check every pair of people → O(n²) time</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h5 className="font-bold text-yellow-300 mb-2">✅ Smart Approach</h5>
              <p className="text-sm text-gray-300">Start with youngest and oldest, adjust based on their sum</p>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-400/30 mb-6">
          <h4 className="text-xl font-bold text-purple-400 mb-3">🔑 Key Insight</h4>
          <p className="text-blue-200 leading-relaxed">
            In a sorted array, we can make <strong className="text-yellow-300">intelligent decisions</strong> about which direction to move our pointers based on the current sum compared to our target.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="font-bold text-cyan-400 mb-3 text-lg">🔍 The Challenge</h4>
              <p className="text-blue-200 leading-relaxed">
                Given a sorted array and a target sum, find two numbers that add up to the target. 
                Return their indices.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="font-bold text-green-400 mb-3 text-lg">⚡ The Insight</h4>
              <p className="text-green-200 leading-relaxed">
                Use two pointers starting from both ends. The sorted nature lets us make smart decisions about which pointer to move.
              </p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-purple-400 mb-4 text-lg">🎨 Strategy Visualization</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-blue-900/50 p-3 rounded-lg">
                <span className="text-blue-300">Sum too small?</span>
                <span className="text-blue-400 font-bold">Move LEFT →</span>
              </div>
              <div className="flex items-center justify-between bg-red-900/50 p-3 rounded-lg">
                <span className="text-red-300">Sum too big?</span>
                <span className="text-red-400 font-bold">← Move RIGHT</span>
              </div>
              <div className="flex items-center justify-between bg-green-900/50 p-3 rounded-lg">
                <span className="text-green-300">Perfect match?</span>
                <span className="text-green-400 font-bold">🎉 FOUND!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced StepVisualizer Integration */}
      {algorithmSteps.length > 0 ? (
        <StepVisualizer
          steps={algorithmSteps}
          currentStep={currentStepIndex}
          onStepChange={onStepChange}
          isPlaying={isStepPlaying}
          onPlayToggle={onPlayToggle}
          playbackSpeed={stepPlaybackSpeed}
          onSpeedChange={onSpeedChange}
          enableAudio={true}
          enableVoiceNarration={false}
        >
          {/* Enhanced Array Visualization */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Two Sum Algorithm Visualization</h4>
            
            {/* Pointer Labels */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-semibold">Left Pointer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 font-semibold">Right Pointer</span>
                </div>
                {foundSolution && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 font-semibold">Solution Found!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Array Elements with Better Spacing */}
            <div className="flex justify-center items-center space-x-4 mb-8 px-4">
              {array.map((num, index) => {
                const isLeft = index === leftPointer
                const isRight = index === rightPointer
                const isSolution = foundSolution && (index === foundSolution.left || index === foundSolution.right)
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-3">
                    {/* Index label at top with better spacing */}
                    <div className="h-6 flex items-center">
                      <span className="text-xs text-gray-400 bg-black/60 px-2 py-1 rounded border border-gray-600">
                        {index}
                      </span>
                    </div>
                    
                    {/* Array element */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${
                        isSolution
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-lg shadow-yellow-500/50'
                          : isLeft
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300 shadow-lg shadow-green-500/50'
                          : isRight
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-300 shadow-lg shadow-red-500/50'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white border-gray-500'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      animate={isSolution ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <span>{num}</span>
                    </motion.div>
                    
                    {/* Pointer indicators at bottom with better spacing */}
                    <div className="h-8 flex items-center">
                      {isLeft && (
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-green-400 text-xl">↑</span>
                          <span className="text-green-400 font-bold text-xs">LEFT</span>
                        </motion.div>
                      )}
                      {isRight && (
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-red-400 text-xl">↑</span>
                          <span className="text-red-400 font-bold text-xs">RIGHT</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Current Sum Display */}
            <div className="text-center">
              <div className="inline-block bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-sm text-gray-400 mb-2">Current Calculation:</div>
                <div className="text-2xl font-bold text-white mb-2">
                  {array[leftPointer]} + {array[rightPointer]} = {currentSum}
                </div>
                <div className={`text-lg font-semibold ${
                  currentSum === target ? 'text-green-400' : 
                  currentSum < target ? 'text-blue-400' : 'text-red-400'
                }`}>
                  {currentSum === target ? '🎉 Perfect Match!' : 
                   currentSum < target ? '📈 Too Small - Move Left →' : '📉 Too Big - ← Move Right'}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Target: {target}
                </div>
              </div>
            </div>
          </div>
        </StepVisualizer>
      ) : (
        /* Call-to-Action for Step Visualizer */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Enhanced Step Visualizer</h3>
            <p className="text-purple-200 max-w-2xl">
              Experience the Two Sum algorithm like never before! Our advanced step visualizer provides 
              interactive controls, audio feedback, and detailed explanations for each step of the algorithm.
            </p>
            <motion.button
              onClick={runTwoSumAlgorithm}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6 inline mr-2" />
              Launch Step Visualizer
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
