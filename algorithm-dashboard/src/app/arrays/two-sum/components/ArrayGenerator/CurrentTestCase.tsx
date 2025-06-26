// src/app/arrays/two-sum/components/ArrayGenerator/CurrentTestCase.tsx
'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface CurrentTestCaseProps {
  array: number[]
  target: number
  onVisualize: () => void
}

export function CurrentTestCase({ array, target, onVisualize }: CurrentTestCaseProps) {
  return (
    <div className="mt-8 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl p-6 border border-purple-400/20">
      <div className="text-center">
        <h6 className="text-lg font-bold text-purple-400 mb-4">🎯 Current Test Case</h6>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-gray-400 text-sm mb-2">Array:</div>
            <motion.div 
              className="bg-black/50 rounded-lg p-3 font-mono text-purple-300 font-bold text-lg"
              whileHover={{ scale: 1.02 }}
            >
              [{array.join(', ')}]
            </motion.div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Target:</div>
            <motion.div 
              className="bg-black/50 rounded-lg p-3 font-mono text-pink-300 font-bold text-lg"
              whileHover={{ scale: 1.02 }}
            >
              {target}
            </motion.div>
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
            onClick={onVisualize}
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
  )
}
