// src/app/arrays/two-sum/hooks/useTwoSumAlgorithm.ts
'use client'

import { useCallback } from 'react'
import { useTwoSum } from '../context/TwoSumContext'
import type { AlgorithmStep } from '../context/TwoSumContext'

export function useTwoSumAlgorithm() {
  const { state, dispatch } = useTwoSum()

  const runAlgorithm = useCallback(async () => {
    dispatch({ type: 'SET_ANIMATING', payload: true })
    dispatch({ type: 'SET_SOLUTION', payload: null })
    
    const algorithmSteps: AlgorithmStep[] = []
    let left = 0
    let right = state.array.length - 1
    let stepId = 1

    // Initial step
    algorithmSteps.push({
      id: stepId++,
      description: "Initialize two pointers",
      code: `let left = 0;\nlet right = array.length - 1;`,
      visualState: { left, right, sum: state.array[left] + state.array[right] },
      explanation: "Start with pointers at both ends of the sorted array",
      complexity: "O(1)"
    })

    while (left < right) {
      const sum = state.array[left] + state.array[right]
      
      if (sum === state.target) {
        algorithmSteps.push({
          id: stepId++,
          description: `Found target sum!`,
          code: `if (sum === target) {\n  return [${left}, ${right}];\n}`,
          visualState: { left, right, sum, found: true },
          explanation: `Perfect! ${state.array[left]} + ${state.array[right]} = ${sum} equals target ${state.target}`,
          complexity: "O(1)"
        })
        
        dispatch({ type: 'SET_SOLUTION', payload: { left, right } })
        break
      } else if (sum < state.target) {
        algorithmSteps.push({
          id: stepId++,
          description: `Sum too small, move left pointer`,
          code: `if (sum < target) {\n  left++;\n}`,
          visualState: { left, right, sum },
          explanation: `${sum} < ${state.target}, need larger sum. Move left pointer right.`,
          complexity: "O(1)",
          isDecision: true,
          branches: [
            { condition: "sum < target", outcome: "Move left pointer right" },
            { condition: "sum > target", outcome: "Move right pointer left" }
          ]
        })
        left++
      } else {
        algorithmSteps.push({
          id: stepId++,
          description: `Sum too large, move right pointer`,
          code: `if (sum > target) {\n  right--;\n}`,
          visualState: { left, right, sum },
          explanation: `${sum} > ${state.target}, need smaller sum. Move right pointer left.`,
          complexity: "O(1)",
          isDecision: true,
          branches: [
            { condition: "sum < target", outcome: "Move left pointer right" },
            { condition: "sum > target", outcome: "Move right pointer left" }
          ]
        })
        right--
      }
    }

    if (left >= right && !state.foundSolution) {
      algorithmSteps.push({
        id: stepId++,
        description: "No solution exists",
        code: `// Pointers crossed\nreturn []; // No solution`,
        visualState: { left, right, crossed: true },
        explanation: "Pointers crossed without finding valid pair. No solution exists.",
        complexity: "O(1)"
      })
    }

    dispatch({ type: 'SET_ALGORITHM_STEPS', payload: algorithmSteps })
    dispatch({ type: 'SET_ANIMATING', payload: false })
  }, [state.array, state.target, dispatch])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET_ALGORITHM' })
  }, [dispatch])

  const generateRandomArray = useCallback(() => {
    dispatch({ type: 'GENERATE_RANDOM_ARRAY' })
  }, [dispatch])

  const setArray = useCallback((newArray: number[]) => {
    dispatch({ type: 'SET_ARRAY', payload: newArray })
  }, [dispatch])

  const setTarget = useCallback((newTarget: number) => {
    dispatch({ type: 'SET_TARGET', payload: newTarget })
  }, [dispatch])

  return {
    runAlgorithm,
    reset,
    generateRandomArray,
    setArray,
    setTarget,
    // State getters
    array: state.array,
    target: state.target,
    leftPointer: state.leftPointer,
    rightPointer: state.rightPointer,
    currentSum: state.currentSum,
    foundSolution: state.foundSolution,
    algorithmSteps: state.algorithmSteps,
    isAnimating: state.isAnimating
  }
}
