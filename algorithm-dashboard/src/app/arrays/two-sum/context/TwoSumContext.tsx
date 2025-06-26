// src/app/arrays/two-sum/context/TwoSumContext.tsx
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface TwoSumState {
  // Algorithm State
  array: number[]
  target: number
  leftPointer: number
  rightPointer: number
  currentSum: number
  foundSolution: { left: number; right: number } | null
  
  // Visualization State
  algorithmSteps: AlgorithmStep[]
  currentStepIndex: number
  isStepPlaying: boolean
  stepPlaybackSpeed: number
  
  // UI State
  activeSection: 'visualization' | 'concept' | 'pitfalls' | 'patterns' | 'code' | 'testing'
  isAnimating: boolean
  
  // Testing State
  isRunning: boolean
  testResults: TestResult[]
}

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

export interface TestResult {
  name: string
  passed: boolean
  time: string
  details: string
  input: string
  expected: string
  actual: string
}

// Actions
export type TwoSumAction = 
  | { type: 'SET_ARRAY'; payload: number[] }
  | { type: 'SET_TARGET'; payload: number }
  | { type: 'SET_POINTERS'; payload: { left: number; right: number } }
  | { type: 'SET_SOLUTION'; payload: { left: number; right: number } | null }
  | { type: 'SET_ALGORITHM_STEPS'; payload: AlgorithmStep[] }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_ACTIVE_SECTION'; payload: TwoSumState['activeSection'] }
  | { type: 'SET_ANIMATING'; payload: boolean }
  | { type: 'RESET_ALGORITHM' }
  | { type: 'GENERATE_RANDOM_ARRAY' }

// Initial State
const initialState: TwoSumState = {
  array: [2, 7, 11, 15],
  target: 9,
  leftPointer: 0,
  rightPointer: 3,
  currentSum: 0,
  foundSolution: null,
  algorithmSteps: [],
  currentStepIndex: 0,
  isStepPlaying: false,
  stepPlaybackSpeed: 1,
  activeSection: 'visualization',
  isAnimating: false,
  isRunning: false,
  testResults: []
}

// Reducer
function twoSumReducer(state: TwoSumState, action: TwoSumAction): TwoSumState {
  switch (action.type) {
    case 'SET_ARRAY':
      return {
        ...state,
        array: action.payload,
        leftPointer: 0,
        rightPointer: action.payload.length - 1,
        currentSum: action.payload[0] + action.payload[action.payload.length - 1],
        foundSolution: null,
        algorithmSteps: [],
        currentStepIndex: 0
      }
    
    case 'SET_TARGET':
      return { ...state, target: action.payload }
    
    case 'SET_POINTERS':
      return {
        ...state,
        leftPointer: action.payload.left,
        rightPointer: action.payload.right,
        currentSum: state.array[action.payload.left] + state.array[action.payload.right]
      }
    
    case 'SET_SOLUTION':
      return { ...state, foundSolution: action.payload }
    
    case 'SET_ALGORITHM_STEPS':
      return { ...state, algorithmSteps: action.payload }
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStepIndex: action.payload }
    
    case 'TOGGLE_PLAYING':
      return { ...state, isStepPlaying: !state.isStepPlaying }
    
    case 'SET_SPEED':
      return { ...state, stepPlaybackSpeed: action.payload }
    
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload }
    
    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.payload }
    
    case 'RESET_ALGORITHM':
      return {
        ...state,
        leftPointer: 0,
        rightPointer: state.array.length - 1,
        currentSum: state.array[0] + state.array[state.array.length - 1],
        foundSolution: null,
        algorithmSteps: [],
        currentStepIndex: 0,
        isStepPlaying: false,
        isAnimating: false
      }
    
    case 'GENERATE_RANDOM_ARRAY':
      // Enhanced random generation with variable length like Container Water
      const arrayLength = Math.floor(Math.random() * 6) + 6 // 6-11 elements
      const newArray = Array.from({ length: arrayLength }, () => 
        Math.floor(Math.random() * 50) + 1
      ).sort((a, b) => a - b)
      
      // Smart target generation (70% chance of being solvable)
      const shouldBeSolvable = Math.random() > 0.3
      let newTarget: number
      
      if (shouldBeSolvable && newArray.length >= 2) {
        const idx1 = Math.floor(Math.random() * newArray.length)
        let idx2 = Math.floor(Math.random() * newArray.length)
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * newArray.length)
        }
        newTarget = newArray[idx1] + newArray[idx2]
      } else {
        newTarget = Math.floor(Math.random() * 60) + 10
      }
      
      return {
        ...state,
        array: newArray,
        target: newTarget,
        leftPointer: 0,
        rightPointer: newArray.length - 1,
        currentSum: newArray[0] + newArray[newArray.length - 1],
        foundSolution: null,
        algorithmSteps: [],
        currentStepIndex: 0,
        isStepPlaying: false
      }
    
    default:
      return state
  }
}

// Context
const TwoSumContext = createContext<{
  state: TwoSumState
  dispatch: React.Dispatch<TwoSumAction>
} | null>(null)

// Provider
export function TwoSumProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(twoSumReducer, initialState)

  return (
    <TwoSumContext.Provider value={{ state, dispatch }}>
      {children}
    </TwoSumContext.Provider>
  )
}

// Hook
export function useTwoSum() {
  const context = useContext(TwoSumContext)
  if (!context) {
    throw new Error('useTwoSum must be used within a TwoSumProvider')
  }
  return context
}
