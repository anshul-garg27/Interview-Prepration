// src/app/arrays/two-sum/components/EnhancedVisualizationSection.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Target, Shuffle, Play, RotateCcw, Zap, X, Maximize2, Activity, Cpu, HardDrive } from 'lucide-react'
import { StepVisualizer } from '../../../../components/StepVisualizer'
import { ArrayGenerator } from './ArrayGenerator/ArrayGenerator'
import { ArrayVisualization } from './EnhancedVisualization/ArrayVisualization'
import { useTwoSumAlgorithm } from '../hooks/useTwoSumAlgorithm'
import { useStepVisualization } from '../hooks/useStepVisualization'
import { useRealAlgorithmExecution } from '../../../../hooks/useRealAlgorithmExecution'
import { useState, useEffect } from 'react'

export function EnhancedVisualizationSection() {
  const { 
    algorithmSteps, 
    array, 
    target, 
    generateRandomArray, 
    runAlgorithm,
    isAnimating 
  } = useTwoSumAlgorithm()
  const {
    currentStep,
    isPlaying,
    playbackSpeed,
    steps,
    handleStepChange,
    togglePlayback,
    setPlaybackSpeed
  } = useStepVisualization()

  // 🚀 NEW: Real Algorithm Execution Integration
  const {
    isConnected,
    isExecuting,
    executeAlgorithm,
    runPerformanceBenchmark,
    latestResult,
    benchmarkResults,
    performanceTrends,
    error: executionError
  } = useRealAlgorithmExecution()

  // State for popup visualization window
  const [isVisualizationPopupOpen, setIsVisualizationPopupOpen] = useState(false)
  const [showRealPerformance, setShowRealPerformance] = useState(false)

  // Enhanced run algorithm with real execution and popup window
  const handleRunAlgorithm = async () => {
    // Open the popup window first
    setIsVisualizationPopupOpen(true)
    
    // Run the traditional algorithm for visualization
    await runAlgorithm()

    // 🚀 NEW: Execute real algorithm with performance measurement
    if (isConnected) {
      const twoSumCode = `
def two_sum(nums, target):
    """
    Hash Map approach for Two Sum problem
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
`
      
      await executeAlgorithm(twoSumCode, { nums: array, target }, 'two_sum')
      setShowRealPerformance(true)
    }
  }

  // Run performance benchmark across different input sizes
  const handleRunBenchmark = async () => {
    if (!isConnected) return

    const twoSumCode = `
def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
`
    
    await runPerformanceBenchmark(twoSumCode, 'two_sum')
    setShowRealPerformance(true)
  }

  // Close popup handler
  const closeVisualizationPopup = () => {
    setIsVisualizationPopupOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* 🚀 Prominent Quick Controls - Like Container Water */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-900/60 via-blue-900/60 to-purple-900/60 rounded-3xl p-8 border border-cyan-400/30 backdrop-blur-xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Current Array Display */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4 flex items-center">
                <Target className="w-7 h-7 mr-3 text-cyan-400" />
                🎯 Two Sum Visualizer
              </h3>
              <div className="bg-black/50 rounded-2xl p-4 border border-cyan-500/30">
                <div className="text-sm text-cyan-400 mb-2">Current Array & Target:</div>
                <div className="flex items-center space-x-4">
                  <div className="text-white font-mono">
                    [{array.join(', ')}]
                  </div>
                  <div className="text-yellow-400 font-bold">
                    Target: {target}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={generateRandomArray}
                disabled={isAnimating}
                whileHover={!isAnimating ? { scale: 1.02 } : {}}
                whileTap={!isAnimating ? { scale: 0.98 } : {}}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isAnimating
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25'
                }`}
              >
                <Shuffle className="w-5 h-5" />
                <span>New Array</span>
              </motion.button>

              <motion.button
                onClick={handleRunAlgorithm}
                disabled={isAnimating}
                whileHover={!isAnimating ? { scale: 1.02 } : {}}
                whileTap={!isAnimating ? { scale: 0.98 } : {}}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isAnimating
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                }`}
              >
                {isAnimating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    <span>Launch Visualizer</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Smart Generation Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-xl p-4 border border-emerald-400/30"
          >
            <div className="flex items-center space-x-2 text-emerald-300 text-sm">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Smart Generation:</span>
              <span>Creates sorted arrays with 70% chance of having a valid solution</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Problem Overview */}
        <ProblemOverview />

        {/* Call to Action if no algorithm steps */}
        {/* {algorithmSteps.length === 0 && <CallToAction onLaunchVisualizer={handleRunAlgorithm} />} */}
      </motion.div>

      {/* 🚀 Popup Visualization Window */}
      <AnimatePresence>
        {isVisualizationPopupOpen && (
          <VisualizationPopup
            isOpen={isVisualizationPopupOpen}
            onClose={closeVisualizationPopup}
            algorithmSteps={algorithmSteps}
            currentStep={currentStep}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onStepChange={handleStepChange}
            onPlayToggle={togglePlayback}
            onSpeedChange={setPlaybackSpeed}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ProblemOverview() {
  return (
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
  )
}

function CallToAction({ onLaunchVisualizer }: { onLaunchVisualizer: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">Enhanced Step Visualizer</h3>
        <p className="text-purple-200 max-w-2xl">
          Experience the Two Sum algorithm like never before! Our advanced step visualizer provides 
          interactive controls, audio feedback, and detailed explanations for each step of the algorithm.
        </p>
        <motion.button
          onClick={onLaunchVisualizer}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Maximize2 className="w-6 h-6 inline mr-2" />
          Launch Step Visualizer
        </motion.button>
      </div>
    </motion.div>
  )
}

// 🚀 Immersive Popup Visualization Component
function VisualizationPopup({ 
  isOpen, 
  onClose, 
  algorithmSteps, 
  currentStep, 
  isPlaying, 
  playbackSpeed, 
  onStepChange, 
  onPlayToggle, 
  onSpeedChange 
}: {
  isOpen: boolean
  onClose: () => void
  algorithmSteps: any[]
  currentStep: number
  isPlaying: boolean
  playbackSpeed: number
  onStepChange: (step: number) => void
  onPlayToggle: () => void
  onSpeedChange: (speed: number) => void
}) {
  // ESC key support for closing popup
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress)
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-[95vw] h-[90vh] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl border border-cyan-400/30 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  🎯 Two Sum Algorithm Visualizer
                </h2>
                <p className="text-cyan-300">Interactive Step-by-Step Visualization</p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Visualization Content */}
        <div className="p-6 h-full overflow-y-auto">
          {algorithmSteps.length > 0 ? (
            <StepVisualizer
              steps={algorithmSteps}
              currentStep={currentStep}
              onStepChange={onStepChange}
              isPlaying={isPlaying}
              onPlayToggle={onPlayToggle}
              playbackSpeed={playbackSpeed}
              onSpeedChange={onSpeedChange}
              enableAudio={true}
              enableVoiceNarration={false}
            >
              <ArrayVisualization />
            </StepVisualizer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400 border-t-transparent rounded-full"
                />
                <h3 className="text-xl font-bold text-white mb-2">Preparing Visualization...</h3>
                <p className="text-cyan-300">Setting up the Two Sum algorithm steps</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Info Panel */}
        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-emerald-300">
                <Zap className="w-4 h-4" />
                <span className="font-semibold text-sm">Immersive Learning Mode</span>
              </div>
              <div className="text-cyan-300 text-sm">
                Full-screen visualization with enhanced controls
              </div>
            </div>
            <div className="text-gray-400 text-xs">
              Press ESC or click outside to close
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
