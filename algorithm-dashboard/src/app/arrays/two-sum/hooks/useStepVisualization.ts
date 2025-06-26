// src/app/arrays/two-sum/hooks/useStepVisualization.ts
'use client'

import { useCallback, useEffect } from 'react'
import { useTwoSum } from '../context/TwoSumContext'

export function useStepVisualization() {
  const { state, dispatch } = useTwoSum()

  const handleStepChange = useCallback((step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step })
    
    // Update pointers based on step
    if (step < state.algorithmSteps.length) {
      const stepData = state.algorithmSteps[step].visualState
      if (stepData.left !== undefined && stepData.right !== undefined) {
        dispatch({ 
          type: 'SET_POINTERS', 
          payload: { left: stepData.left, right: stepData.right } 
        })
      }
    }
  }, [state.algorithmSteps, dispatch])

  const togglePlayback = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAYING' })
  }, [dispatch])

  const setPlaybackSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed })
  }, [dispatch])

  const playStepsAutomatically = useCallback(async () => {
    if (!state.isStepPlaying) return
    
    for (let i = state.currentStepIndex; i < state.algorithmSteps.length && state.isStepPlaying; i++) {
      handleStepChange(i)
      await new Promise(resolve => 
        setTimeout(resolve, (2000 / state.stepPlaybackSpeed))
      )
      
      // Check if still playing (could have been stopped)
      if (!state.isStepPlaying) break
    }
    
    if (state.isStepPlaying) {
      dispatch({ type: 'TOGGLE_PLAYING' }) // Stop when finished
    }
  }, [state.isStepPlaying, state.currentStepIndex, state.algorithmSteps, state.stepPlaybackSpeed, handleStepChange, dispatch])

  // Auto-play effect
  useEffect(() => {
    if (state.isStepPlaying) {
      playStepsAutomatically()
    }
  }, [state.isStepPlaying])

  return {
    currentStep: state.currentStepIndex,
    isPlaying: state.isStepPlaying,
    playbackSpeed: state.stepPlaybackSpeed,
    steps: state.algorithmSteps,
    handleStepChange,
    togglePlayback,
    setPlaybackSpeed
  }
}
