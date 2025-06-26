// src/app/arrays/two-sum/components/ArrayGenerator/GeneratorControls.tsx
'use client'

import { motion } from 'framer-motion'
import { Shuffle, Dice6 } from 'lucide-react'

interface GeneratorControlsProps {
  onGenerateArray: (size?: number) => void
  onSetArray: (array: number[]) => void
  onSetTarget: (target: number) => void
}

export function GeneratorControls({ 
  onGenerateArray, 
  onSetArray, 
  onSetTarget 
}: GeneratorControlsProps) {
  
  const generateRandomArray = (size: number = 8, min: number = 1, max: number = 20) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    ).sort((a, b) => a - b)
    onSetArray(newArray)
  }

  const generateRandomTarget = (array: number[]) => {
    if (array.length >= 2) {
      const useValidSum = Math.random() > 0.5
      let newTarget: number
      
      if (useValidSum) {
        const idx1 = Math.floor(Math.random() * array.length)
        let idx2 = Math.floor(Math.random() * array.length)
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * array.length)
        }
        newTarget = array[idx1] + array[idx2]
      } else {
        const min = Math.min(...array)
        const max = Math.max(...array)
        newTarget = Math.floor(Math.random() * (max * 2 - min)) + min
      }
      onSetTarget(newTarget)
    }
  }

  return (
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
              onClick={() => {
                // Generate target for current array
                const currentArray = [2, 7, 11, 15] // Will be updated with context
                generateRandomTarget(currentArray)
              }}
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
              const newSize = Math.floor(Math.random() * 7) + 4
              generateRandomArray(newSize)
              // Generate target after array is set
              setTimeout(() => {
                const newArray = Array.from({ length: newSize }, () => 
                  Math.floor(Math.random() * 20) + 1
                ).sort((a, b) => a - b)
                generateRandomTarget(newArray)
              }, 100)
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
  )
}
