// Enhanced Algorithm Step Visualizer with Audio/Visual Feedback
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, RotateCcw, Settings, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export interface AlgorithmStep {
  id: number
  description: string
  code: string
  visualState: any
  explanation: string
  complexity?: string
  isDecision?: boolean
  branches?: Array<{ condition: string; outcome: string }>
}

export interface StepVisualizerProps {
  steps: AlgorithmStep[]
  currentStep: number
  onStepChange: (step: number) => void
  isPlaying: boolean
  onPlayToggle: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
  children: React.ReactNode // The visualization component
  enableAudio?: boolean
  enableVoiceNarration?: boolean
}

const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' }
]

export function StepVisualizer({
  steps,
  currentStep,
  onStepChange,
  isPlaying,
  onPlayToggle,
  playbackSpeed,
  onSpeedChange,
  children,
  enableAudio = true,
  enableVoiceNarration = false
}: StepVisualizerProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(enableAudio)
  const [narrationEnabled, setNarrationEnabled] = useState(enableVoiceNarration)
  
  // Audio feedback for step changes
  const playStepSound = useCallback(() => {
    if (!audioEnabled) return
    
    // Create a subtle audio cue for step progression
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }, [audioEnabled])

  // Voice narration
  const narrateStep = useCallback((step: AlgorithmStep) => {
    if (!narrationEnabled || !('speechSynthesis' in window)) return
    
    window.speechSynthesis.cancel() // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(
      `Step ${step.id}: ${step.description}. ${step.explanation}`
    )
    utterance.rate = playbackSpeed
    utterance.pitch = 1
    utterance.volume = 0.7
    
    window.speechSynthesis.speak(utterance)
  }, [narrationEnabled, playbackSpeed])

  // Handle step changes with audio feedback
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      playStepSound()
      if (narrationEnabled) {
        setTimeout(() => narrateStep(steps[currentStep]), 100)
      }
    }
  }, [currentStep, steps, playStepSound, narrateStep, narrationEnabled])

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const resetToStart = () => {
    onStepChange(0)
    if (isPlaying) onPlayToggle()
  }

  const currentStepData = steps[currentStep] || null

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-blue-900/60 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
      {/* Enhanced Controls Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Play className="w-7 h-7 mr-3 text-green-400" />
          Algorithm Step Visualizer
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Audio Controls */}
          <motion.button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg transition-all ${
              audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={audioEnabled ? 'Disable audio' : 'Enable audio'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10"
          >
            <h4 className="text-white font-medium mb-3">Visualization Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Playback Speed</label>
                <div className="flex space-x-2">
                  {speedOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => onSpeedChange(option.value)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        playbackSpeed === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Accessibility</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={narrationEnabled}
                      onChange={(e) => setNarrationEnabled(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-300">Voice narration</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Algorithm Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 rounded-xl p-4 border border-white/10 min-h-[400px]">
            {children}
          </div>
        </div>

        {/* Step Information Panel */}
        <div className="space-y-4">
          {/* Current Step Info */}
          {currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">Step {currentStepData.id}</h4>
                {currentStepData.complexity && (
                  <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded">
                    {currentStepData.complexity}
                  </span>
                )}
              </div>
              
              <p className="text-blue-200 mb-3">{currentStepData.description}</p>
              
              {currentStepData.explanation && (
                <div className="text-sm text-gray-300 bg-black/20 p-3 rounded-lg">
                  {currentStepData.explanation}
                </div>
              )}

              {/* Decision Branches */}
              {currentStepData.isDecision && currentStepData.branches && (
                <div className="mt-3 space-y-2">
                  <h5 className="text-sm font-medium text-yellow-400">Decision Point:</h5>
                  {currentStepData.branches.map((branch, index) => (
                    <div key={index} className="text-xs p-2 bg-yellow-900/20 rounded border-l-2 border-yellow-500">
                      <span className="text-yellow-300">If {branch.condition}:</span>
                      <br />
                      <span className="text-gray-300">{branch.outcome}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Code Snippet */}
          {currentStepData?.code && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <h5 className="text-sm font-medium text-cyan-400 mb-2">Current Code</h5>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                <code>{currentStepData.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Control Bar */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={resetToStart}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </motion.button>
            
            <motion.button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={onPlayToggle}
              className={`p-3 rounded-lg font-medium transition-all ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Step Counter */}
          <div className="text-white text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Navigation Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onStepChange(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-500 scale-125'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
