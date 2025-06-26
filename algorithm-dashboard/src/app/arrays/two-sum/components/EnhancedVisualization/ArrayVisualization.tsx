// src/app/arrays/two-sum/components/EnhancedVisualization/ArrayVisualization.tsx
'use client'

import { motion } from 'framer-motion'
import { useTwoSum } from '../../context/TwoSumContext'

export function ArrayVisualization() {
  const { state } = useTwoSum()
  const { array, leftPointer, rightPointer, currentSum, target, foundSolution } = state

  return (
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
  )
}
