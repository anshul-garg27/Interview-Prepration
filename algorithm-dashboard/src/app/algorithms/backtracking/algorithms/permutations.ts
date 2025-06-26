// 🎯 Permutations Algorithm - Advanced Implementation with Real-Time Visualization
// World-class permutation generation with comprehensive analytics

import { ConstraintInfo } from '../types/BacktrackingTypes'
import { AlgorithmExecutionContext, AlgorithmResult, BacktrackingEngine } from './backtrackingEngine'

export interface PermutationState {
  inputArray: number[]
  currentPermutation: number[]
  usedIndices: Set<number>
  remainingChoices: number[]
}

export interface PermutationParameters {
  inputArray: number[]
  generateAll?: boolean
  maxSolutions?: number
  allowDuplicates?: boolean
}

export interface PermutationResult {
  permutations: number[][]
  totalCount: number
  expectedCount: number
  isComplete: boolean
  uniqueElements: number
  duplicateCount: number
}

// 🚀 Advanced Permutation Generator with Educational Features
export class PermutationAlgorithm {
  private engine: BacktrackingEngine<number>
  private parameters: PermutationParameters
  private startTime: number = 0
  
  constructor(context: AlgorithmExecutionContext<number>, parameters: PermutationParameters) {
    this.engine = new BacktrackingEngine(context)
    this.parameters = parameters
  }
  
  // 🎯 Main execution method with comprehensive error handling
  async execute(): Promise<AlgorithmResult<number>> {
    this.startTime = performance.now()
    
    try {
      this.validateInput()
      
      const initialState: PermutationState = {
        inputArray: [...this.parameters.inputArray],
        currentPermutation: [],
        usedIndices: new Set(),
        remainingChoices: [...this.parameters.inputArray]
      }
      
      return await this.engine.executeBacktracking<PermutationState>(
        initialState,
        this.isComplete.bind(this),
        this.getChoices.bind(this),
        this.makeChoice.bind(this),
        this.isValid.bind(this),
        this.unmakeChoice.bind(this),
        this.getConstraints.bind(this)
      )
    } catch (error) {
      throw new Error(`Permutation execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // 📊 Educational helper: Calculate expected permutation count
  static calculateExpectedCount(array: number[]): number {
    if (array.length === 0) return 0
    
    // Handle duplicates by counting frequency
    const frequency = new Map<number, number>()
    array.forEach(num => {
      frequency.set(num, (frequency.get(num) || 0) + 1)
    })
    
    // For arrays with duplicates: n! / (n1! * n2! * ... * nk!)
    let factorial = this.factorial(array.length)
    
    for (const count of frequency.values()) {
      if (count > 1) {
        factorial /= this.factorial(count)
      }
    }
    
    return factorial
  }
  
  // 🔍 Comprehensive analysis of permutation characteristics
  static analyzePermutations(permutations: number[][]): PermutationResult {
    const totalCount = permutations.length
    const firstPermutation = permutations[0] || []
    const expectedCount = this.calculateExpectedCount(firstPermutation)
    
    // Check for uniqueness
    const uniquePermutations = new Set(permutations.map(p => JSON.stringify(p)))
    const duplicateCount = totalCount - uniquePermutations.size
    
    // Count unique elements in original array
    const uniqueElements = new Set(firstPermutation).size
    
    return {
      permutations,
      totalCount,
      expectedCount,
      isComplete: totalCount === expectedCount,
      uniqueElements,
      duplicateCount
    }
  }
  
  // 🎯 Algorithm State Management Methods
  
  private isComplete(state: PermutationState): boolean {
    return state.currentPermutation.length === state.inputArray.length
  }
  
  private getChoices(state: PermutationState): number[] {
    // Return available indices (not values) to handle duplicates properly
    const availableIndices: number[] = []
    
    for (let i = 0; i < state.inputArray.length; i++) {
      if (!state.usedIndices.has(i)) {
        // If allowing duplicates, or if this value hasn't been used in this position
        if (this.parameters.allowDuplicates || !this.isDuplicateChoice(state, i)) {
          availableIndices.push(i)
        }
      }
    }
    
    // Return the actual values at these indices
    return availableIndices.map(i => state.inputArray[i])
  }
  
  private makeChoice(state: PermutationState, choice: number): PermutationState {
    // Find the first unused index that contains this value
    const indexToUse = this.findAvailableIndex(state, choice)
    
    return {
      ...state,
      currentPermutation: [...state.currentPermutation, choice],
      usedIndices: new Set([...state.usedIndices, indexToUse]),
      remainingChoices: state.remainingChoices.filter((_, i) => i !== indexToUse)
    }
  }
  
  private isValid(state: PermutationState, choice: number): boolean {
    // Check if we can still make this choice
    const availableIndex = this.findAvailableIndex(state, choice)
    return availableIndex !== -1
  }
  
  private unmakeChoice(state: PermutationState): PermutationState {
    if (state.currentPermutation.length === 0) {
      return state
    }
    
    const lastChoice = state.currentPermutation[state.currentPermutation.length - 1]
    const lastIndex = this.findLastUsedIndex(state, lastChoice)
    
    const newUsedIndices = new Set(state.usedIndices)
    newUsedIndices.delete(lastIndex)
    
    return {
      ...state,
      currentPermutation: state.currentPermutation.slice(0, -1),
      usedIndices: newUsedIndices,
      remainingChoices: [...state.remainingChoices, lastChoice]
    }
  }
  
  private getConstraints(state: PermutationState, choice: number): ConstraintInfo[] {
    const constraints: ConstraintInfo[] = []
    
    // Check if choice is available
    const availableIndex = this.findAvailableIndex(state, choice)
    if (availableIndex === -1) {
      constraints.push({
        type: 'duplicate',
        description: `Value ${choice} is already used in this permutation`,
        isViolated: true,
        severity: 'high'
      })
    }
    
    // Check if this would create a duplicate permutation (if not allowing duplicates)
    if (!this.parameters.allowDuplicates && this.wouldCreateDuplicate(state, choice)) {
      constraints.push({
        type: 'duplicate',
        description: `This choice would create a duplicate permutation`,
        isViolated: true,
        severity: 'medium'
      })
    }
    
    // Check solution limit
    if (this.parameters.maxSolutions && state.currentPermutation.length >= this.parameters.maxSolutions) {
      constraints.push({
        type: 'custom',
        description: `Maximum solution limit (${this.parameters.maxSolutions}) reached`,
        isViolated: true,
        severity: 'low'
      })
    }
    
    return constraints
  }
  
  // 🔧 Helper Methods
  
  private validateInput(): void {
    if (!this.parameters.inputArray || this.parameters.inputArray.length === 0) {
      throw new Error('Input array cannot be empty')
    }
    
    if (this.parameters.inputArray.length > 10) {
      console.warn('Large input array detected. This may result in many permutations and slow performance.')
    }
    
    if (this.parameters.maxSolutions && this.parameters.maxSolutions < 1) {
      throw new Error('Maximum solutions must be positive')
    }
  }
  
  private findAvailableIndex(state: PermutationState, choice: number): number {
    for (let i = 0; i < state.inputArray.length; i++) {
      if (state.inputArray[i] === choice && !state.usedIndices.has(i)) {
        return i
      }
    }
    return -1
  }
  
  private findLastUsedIndex(state: PermutationState, choice: number): number {
    // Find the most recently used index for this value
    for (let i = state.inputArray.length - 1; i >= 0; i--) {
      if (state.inputArray[i] === choice && state.usedIndices.has(i)) {
        return i
      }
    }
    return -1
  }
  
  private isDuplicateChoice(state: PermutationState, index: number): boolean {
    if (this.parameters.allowDuplicates) return false
    
    const value = state.inputArray[index]
    const currentPosition = state.currentPermutation.length
    
    // Check if we've already considered this value at this position
    for (let i = 0; i < index; i++) {
      if (state.inputArray[i] === value && !state.usedIndices.has(i)) {
        return true // We should use the earlier index first
      }
    }
    
    return false
  }
  
  private wouldCreateDuplicate(state: PermutationState, choice: number): boolean {
    // This is a simplified check - in a full implementation,
    // we'd maintain a set of all generated permutations
    return false
  }
  
  private static factorial(n: number): number {
    if (n <= 1) return 1
    return n * this.factorial(n - 1)
  }
}

// 🎓 Educational Utilities for Learning

export class PermutationEducator {
  // 📚 Generate step-by-step explanation
  static generateExplanation(inputArray: number[], step: number, currentPath: number[]): string {
    const remaining = inputArray.filter(x => !currentPath.includes(x))
    
    if (step === 0) {
      return `Starting permutation generation with array [${inputArray.join(', ')}]. We need to try each element as the first position.`
    }
    
    if (currentPath.length === inputArray.length) {
      return `✅ Found complete permutation: [${currentPath.join(', ')}]. This is one of ${PermutationAlgorithm.calculateExpectedCount(inputArray)} possible permutations.`
    }
    
    return `Current path: [${currentPath.join(', ')}]. Remaining choices: [${remaining.join(', ')}]. Next, we'll try each remaining element.`
  }
  
  // 🧮 Calculate complexity explanation
  static getComplexityExplanation(n: number): string {
    return `
      Time Complexity: O(n! × n) = O(${n}! × ${n})
      - We generate n! permutations
      - Each permutation takes O(n) time to construct
      - Total: ${PermutationAlgorithm.calculateExpectedCount(Array.from({length: n}, (_, i) => i))} permutations
      
      Space Complexity: O(n)
      - Recursion depth: ${n}
      - Additional space for tracking used elements: O(n)
      - Each permutation stored: O(n)
    `
  }
  
  // 🔍 Common pitfalls and learning points
  static getCommonPitfalls(): string[] {
    return [
      "Forgetting to mark elements as 'used' - leads to invalid permutations",
      "Not properly backtracking - elements remain marked as used",
      "Incorrect handling of duplicate elements in input array",
      "Stack overflow for large inputs due to deep recursion",
      "Not considering early termination for optimization",
      "Confusing permutations with combinations (order matters in permutations)"
    ]
  }
  
  // 🎯 Interactive challenges
  static generateChallenge(difficulty: 'easy' | 'medium' | 'hard') {
    switch (difficulty) {
      case 'easy':
        return {
          input: [1, 2, 3],
          question: "How many permutations will this generate?",
          answer: 6,
          explanation: "3! = 3 × 2 × 1 = 6 permutations"
        }
      case 'medium':
        return {
          input: [1, 2, 2],
          question: "How many unique permutations will this generate?",
          answer: 3,
          explanation: "3! / 2! = 6 / 2 = 3 unique permutations (due to duplicate 2s)"
        }
      case 'hard':
        return {
          input: [1, 1, 2, 2],
          question: "How many unique permutations will this generate?",
          answer: 6,
          explanation: "4! / (2! × 2!) = 24 / 4 = 6 unique permutations"
        }
    }
  }
}
