// src/app/arrays/two-sum/components/ArrayGenerator/PresetChallenges.tsx
'use client'

import { motion } from 'framer-motion'

interface PresetChallengesProps {
  onArrayChange: (array: number[]) => void
  onTargetChange: (target: number) => void
}

const presetArrays = [
  { name: "Classic", array: [2, 7, 11, 15], target: 9, description: "The original LeetCode example" },
  { name: "Challenge", array: [3, 2, 4], target: 6, description: "Unsorted edge case" },
  { name: "Large", array: [1, 5, 8, 12, 15, 18, 22, 25], target: 27, description: "Bigger array challenge" },
  { name: "Duplicates", array: [3, 3, 4, 4, 5, 5], target: 8, description: "Duplicate handling" },
  { name: "Edge Case", array: [-1, 0, 1, 2], target: 1, description: "Negative numbers" }
]

export function PresetChallenges({ onArrayChange, onTargetChange }: PresetChallengesProps) {
  return (
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
              onArrayChange(preset.array)
              onTargetChange(preset.target)
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
            <div className="text-purple-200 text-sm mb-1">
              Target: <span className="font-bold text-purple-300">{preset.target}</span>
            </div>
            <div className="text-gray-400 text-xs">
              {preset.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fun Facts */}
      <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-400/20">
        <div className="text-center">
          <div className="text-purple-300 font-bold mb-2">🎪 Smart Generation</div>
          <div className="text-gray-300 text-sm">
            Our AI creates solvable test cases 50% of the time and challenging edge cases 50% of the time to maximize learning!
          </div>
        </div>
      </div>
    </div>
  )
}
