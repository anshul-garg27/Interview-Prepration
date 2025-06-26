'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Eye, EyeOff, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { CodeBlock } from './CodeBlock'

interface PitfallChallengeProps {
  challenge: {
    title: string
    buggyCode: string
    issue: string
    fix: string
    explanation: string
  }
}

export function PitfallChallenge({ challenge }: PitfallChallengeProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-400/30"
    >
      <h4 className="text-red-400 font-bold text-lg mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        {challenge.title}
      </h4>
      
      <div className="space-y-4">
        <div>
          <h5 className="text-orange-300 font-semibold mb-2">🐛 Buggy Code:</h5>
          <CodeBlock 
            code={challenge.buggyCode} 
            language="python" 
            title="🐛 Buggy Implementation"
            showLineNumbers={false}
            className="border-2 border-red-500/30"
          />
        </div>
        
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
          <h5 className="text-red-300 font-semibold mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Issue:
          </h5>
          <p className="text-red-200">{challenge.issue}</p>
        </div>
        
        <motion.button
          onClick={() => setIsRevealed(!isRevealed)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hide Solution</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Show Solution</span>
            </>
          )}
        </motion.button>
        
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <h5 className="text-green-300 font-semibold mb-2">✅ Fixed Code:</h5>
              <CodeBlock 
                code={challenge.fix} 
                language="javascript" 
                showLineNumbers={false}
              />
            </div>
            
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
              <h5 className="text-green-300 font-semibold mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Explanation:
              </h5>
              <p className="text-green-200">{challenge.explanation}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
export {};