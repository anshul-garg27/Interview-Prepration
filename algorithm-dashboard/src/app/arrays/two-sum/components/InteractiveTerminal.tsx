'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Play, RotateCcw, Terminal } from 'lucide-react'
import { useState } from 'react'

interface TerminalCommand {
  command: string
  output: string
  type?: 'success' | 'error' | 'info'
}

interface InteractiveTerminalProps {
  title?: string
  commands?: TerminalCommand[]
  autoRun?: boolean
}

export function InteractiveTerminal({ 
  title = "Terminal", 
  commands = [], 
  autoRun = false 
}: InteractiveTerminalProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)

  const runNextCommand = async () => {
    if (currentCommandIndex >= commands.length || isRunning) return
    
    setIsRunning(true)
    const command = commands[currentCommandIndex]
    
    // Add command to output
    setOutput(prev => [...prev, `$ ${command.command}`])
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add output
    setOutput(prev => [...prev, command.output])
    
    setCurrentCommandIndex(prev => prev + 1)
    setIsRunning(false)
  }

  const resetTerminal = () => {
    setOutput([])
    setCurrentCommandIndex(0)
    setIsRunning(false)
  }

  const getOutputColor = (type?: string) => {
    switch (type) {
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'info': return 'text-blue-400'
      default: return 'text-gray-300'
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Window Controls */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
            </div>
            
            {/* Title */}
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 font-medium">{title}</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={runNextCommand}
              disabled={isRunning || currentCommandIndex >= commands.length}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </motion.button>
            
            <motion.button
              onClick={resetTerminal}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="bg-black min-h-[300px] p-6 font-mono text-sm">
        <div className="space-y-2">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={line.startsWith('$') ? 'text-cyan-400' : 'text-gray-300'}
            >
              {line}
            </motion.div>
          ))}
          
          {/* Cursor */}
          {!isRunning && currentCommandIndex < commands.length && (
            <div className="text-cyan-400 flex items-center">
              <span className="mr-1">$</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-4 bg-cyan-400"
              >
                _
              </motion.span>
            </div>
          )}
          
          {/* Completion message */}
          {!isRunning && currentCommandIndex >= commands.length && output.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 font-semibold mt-4 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Commands completed successfully!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
