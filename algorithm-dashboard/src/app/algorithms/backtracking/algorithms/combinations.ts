// 🎯 Combinations Algorithm - Advanced Implementation with Educational Features
// World-class combination generation with mathematical precision

import { ConstraintInfo } from '../types/BacktrackingTypes'
import { AlgorithmExecutionContext, AlgorithmResult, BacktrackingEngine } from './backtrackingEngine'

export interface CombinationState {
  n: number
  k: number
  currentCombination: number[]
  startIndex: number
  remainingSlots: number
}

export interface CombinationParameters {
  n: number
  k: number
  generateAll?: boolean
  maxSolutions?: number
  startFrom?: number
}

export interface CombinationResult {
  combinations: number[][]
  totalCount: number
  expectedCount: number
  isComplete: boolean
  efficiency: number
  mathematicalVerification: boolean
}

// 🚀 Advanced Combination Generator with Mathematical Precision
export class CombinationAlgorithm {
  private engine: BacktrackingEngine<number>
  private parameters: CombinationParameters
  private startTime: number = 0
  
  constructor(context: AlgorithmExecutionContext<number>, parameters: CombinationParameters) {
    this.engine = new BacktrackingEngine(context)
    this.parameters = parameters
  }
  
  // 🎯 Main execution method with comprehensive validation
  async execute(): Promise<AlgorithmResult<number>> {
    this.startTime = performance.now()
    
    try {
      this.validateInput()
      
      const initialState: CombinationState = {
        n: this.parameters.n,
        k: this.parameters.k,
        currentCombination: [],
        startIndex: this.parameters.startFrom || 1,
        remainingSlots: this.parameters.k
      }
      
      return await this.engine.executeBacktracking<CombinationState>(
        initialState,
        this.isComplete.bind(this),
        this.getChoices.bind(this),
        this.makeChoice.bind(this),
        this.isValid.bind(this),
        this.unmakeChoice.bind(this),
        this.getConstraints.bind(this)
      )
    } catch (error) {
      throw new Error(`Combination execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // 📊 Mathematical calculation of binomial coefficient C(n,k)
  static calculateBinomialCoefficient(n: number, k: number): number {
    if (k > n || k < 0) return 0
    if (k === 0 || k === n) return 1
    
    // Use the more efficient formula: C(n,k) = C(n,n-k)
    k = Math.min(k, n - k)
    
    let result = 1
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1)
    }
    
    return Math.round(result)
  }
  
  // 🔍 Comprehensive analysis with mathematical verification
  static analyzeCombinations(combinations: number[][], n: number, k: number): CombinationResult {
    const totalCount = combinations.length
    const expectedCount = this.calculateBinomialCoefficient(n, k)
    
    // Verify mathematical properties
    const mathematicalVerification = this.verifyCombinationProperties(combinations, n, k)
    
    // Calculate efficiency (how close we are to the expected result)
    const efficiency = expectedCount > 0 ? (totalCount / expectedCount) * 100 : 0
    
    return {
      combinations,
      totalCount,
      expectedCount,
      isComplete: totalCount === expectedCount,
      efficiency,
      mathematicalVerification
    }
  }
  
  // 🧮 Mathematical verification of combination properties
  static verifyCombinationProperties(combinations: number[][], n: number, k: number): boolean {
    // Property 1: Each combination should have exactly k elements
    const allHaveCorrectLength = combinations.every(combo => combo.length === k)
    
    // Property 2: All elements should be in range [1, n]
    const allInRange = combinations.every(combo => 
      combo.every(num => num >= 1 && num <= n)
    )
    
    // Property 3: Each combination should be in ascending order (canonical form)
    const allAscending = combinations.every(combo => {
      for (let i = 1; i < combo.length; i++) {
        if (combo[i] <= combo[i-1]) return false
      }
      return true
    })
    
    // Property 4: No duplicate combinations
    const uniqueCombinations = new Set(combinations.map(combo => JSON.stringify(combo)))
    const noDuplicates = uniqueCombinations.size === combinations.length
    
    // Property 5: No duplicate elements within each combination
    const noInternalDuplicates = combinations.every(combo => {
      const uniqueElements = new Set(combo)
      return uniqueElements.size === combo.length
    })
    
    return allHaveCorrectLength && allInRange && allAscending && noDuplicates && noInternalDuplicates
  }
  
  // 🎯 Algorithm State Management Methods
  
  private isComplete(state: CombinationState): boolean {
    return state.currentCombination.length === state.k
  }
  
  private getChoices(state: CombinationState): number[] {
    const choices: number[] = []
    const remainingSlots = state.k - state.currentCombination.length
    const maxPossibleStart = state.n - remainingSlots + 1
    
    // Generate choices from startIndex to maxPossibleStart
    for (let i = state.startIndex; i <= Math.min(state.n, maxPossibleStart); i++) {
      choices.push(i)
    }
    
    return choices
  }
  
  private makeChoice(state: CombinationState, choice: number): CombinationState {
    return {
      ...state,
      currentCombination: [...state.currentCombination, choice],
      startIndex: choice + 1, // Next choice must be greater than current
      remainingSlots: state.remainingSlots - 1
    }
  }
  
  private isValid(state: CombinationState, choice: number): boolean {
    // Choice must be greater than or equal to startIndex
    if (choice < state.startIndex) return false
    
    // Choice must be within valid range
    if (choice < 1 || choice > state.n) return false
    
    // Must have enough remaining numbers to complete the combination
    const remainingSlots = state.k - state.currentCombination.length - 1 // -1 for current choice
    const remainingNumbers = state.n - choice
    
    return remainingNumbers >= remainingSlots
  }
  
  private unmakeChoice(state: CombinationState): CombinationState {
    if (state.currentCombination.length === 0) {
      return state
    }
    
    const newCombination = state.currentCombination.slice(0, -1)
    const newStartIndex = newCombination.length > 0 ? 
      newCombination[newCombination.length - 1] + 1 : 1
    
    return {
      ...state,
      currentCombination: newCombination,
      startIndex: newStartIndex,
      remainingSlots: state.remainingSlots + 1
    }
  }
  
  private getConstraints(state: CombinationState, choice: number): ConstraintInfo[] {
    const constraints: ConstraintInfo[] = []
    
    // Check ascending order constraint
    if (state.currentCombination.length > 0) {
      const lastChoice = state.currentCombination[state.currentCombination.length - 1]
      if (choice <= lastChoice) {
        constraints.push({
          type: 'custom',
          description: `Choice ${choice} must be greater than previous choice ${lastChoice}`,
          isViolated: true,
          severity: 'high'
        })
      }
    }
    
    // Check feasibility constraint
    const remainingSlots = state.k - state.currentCombination.length - 1
    const remainingNumbers = state.n - choice
    
    if (remainingNumbers < remainingSlots) {
      constraints.push({
        type: 'custom',
        description: `Not enough numbers remaining (${remainingNumbers}) to fill ${remainingSlots} slots`,
        isViolated: true,
        severity: 'high'
      })
    }
    
    // Check range constraint
    if (choice < 1 || choice > state.n) {
      constraints.push({
        type: 'custom',
        description: `Choice ${choice} is outside valid range [1, ${state.n}]`,
        isViolated: true,
        severity: 'high'
      })
    }
    
    // Check solution limit
    if (this.parameters.maxSolutions && state.currentCombination.length >= this.parameters.maxSolutions) {
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
    if (this.parameters.n < 0) {
      throw new Error('n must be non-negative')
    }
    
    if (this.parameters.k < 0) {
      throw new Error('k must be non-negative')
    }
    
    if (this.parameters.k > this.parameters.n) {
      throw new Error('k cannot be greater than n')
    }
    
    if (this.parameters.n > 20) {
      console.warn('Large n value detected. This may result in many combinations and slow performance.')
    }
    
    if (this.parameters.maxSolutions && this.parameters.maxSolutions < 1) {
      throw new Error('Maximum solutions must be positive')
    }
  }
}

// 🎓 Educational Utilities for Combination Learning

export class CombinationEducator {
  // 📚 Generate step-by-step explanation
  static generateExplanation(n: number, k: number, currentPath: number[], startIndex: number): string {
    if (currentPath.length === 0) {
      return `Starting combination generation C(${n},${k}). We need to choose ${k} numbers from 1 to ${n}. Starting with numbers ≥ ${startIndex}.`
    }
    
    if (currentPath.length === k) {
      return `✅ Found complete combination: [${currentPath.join(', ')}]. This is one of C(${n},${k}) = ${CombinationAlgorithm.calculateBinomialCoefficient(n, k)} possible combinations.`
    }
    
    const remaining = k - currentPath.length
    return `Current combination: [${currentPath.join(', ')}]. Need ${remaining} more numbers. Next choices start from ${startIndex} (must be > ${currentPath[currentPath.length - 1] || 0}).`
  }
  
  // 🧮 Pascal's Triangle visualization for educational purposes
  static generatePascalTriangle(rows: number): number[][] {
    const triangle: number[][] = []
    
    for (let i = 0; i <= rows; i++) {
      triangle[i] = []
      for (let j = 0; j <= i; j++) {
        if (j === 0 || j === i) {
          triangle[i][j] = 1
        } else {
          triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]
        }
      }
    }
    
    return triangle
  }
  
  // 📊 Complexity analysis explanation
  static getComplexityExplanation(n: number, k: number): string {
    const combinations = CombinationAlgorithm.calculateBinomialCoefficient(n, k)
    return `
      Time Complexity: O(C(n,k) × k) = O(${combinations} × ${k})
      - We generate C(n,k) = ${combinations} combinations
      - Each combination takes O(k) time to construct and copy
      
      Space Complexity: O(k)
      - Recursion depth: ${k} (depth of our combination)
      - Additional space for current combination: O(k)
      - Each combination stored: O(k)
      
      Why this is efficient:
      - We use the "start index" technique to avoid duplicates
      - We prune branches early when not enough numbers remain
      - We don't generate invalid combinations
    `
  }
  
  // 🎯 Interactive challenges
  static generateChallenge(difficulty: 'easy' | 'medium' | 'hard') {
    switch (difficulty) {
      case 'easy':
        return {
          n: 4, k: 2,
          question: "How many ways can you choose 2 items from 4?",
          answer: CombinationAlgorithm.calculateBinomialCoefficient(4, 2),
          explanation: "C(4,2) = 4!/(2!×2!) = 24/(2×2) = 6",
          combinations: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
        }
      case 'medium':
        return {
          n: 5, k: 3,
          question: "How many ways can you choose 3 items from 5?",
          answer: CombinationAlgorithm.calculateBinomialCoefficient(5, 3),
          explanation: "C(5,3) = C(5,2) = 5!/(3!×2!) = 120/(6×2) = 10",
          hint: "Notice that C(5,3) = C(5,2) due to symmetry!"
        }
      case 'hard':
        return {
          n: 10, k: 4,
          question: "A committee of 4 people from 10. How many ways?",
          answer: CombinationAlgorithm.calculateBinomialCoefficient(10, 4),
          explanation: "C(10,4) = 10!/(4!×6!) = 3,628,800/(24×720) = 210",
          realWorld: "This is like choosing 4 team members from 10 candidates"
        }
    }
  }
  
  // 🔍 Common pitfalls and solutions
  static getCommonPitfalls(): string[] {
    return [
      "Forgetting the 'start index' - leads to duplicate combinations like [1,2] and [2,1]",
      "Not checking if enough numbers remain - generates impossible branches",
      "Confusing combinations with permutations (order doesn't matter in combinations)",
      "Inefficient pruning - not stopping early when combinations become impossible",
      "Off-by-one errors in loop bounds and indices",
      "Not handling edge cases like k=0 or k=n properly"
    ]
  }
  
  // 🎲 Real-world applications
  static getRealWorldApplications(): string[] {
    return [
      "Lottery number selection (choose 6 from 49)",
      "Team formation (choose starting lineup from roster)",
      "Menu combinations (choose 3 courses from 10 options)",
      "Investment portfolio (choose 5 stocks from 100 candidates)",
      "Survey design (choose representative sample)",
      "Tournament brackets (choose matchups)",
      "Feature selection in machine learning",
      "Cryptographic key generation"
    ]
  }
  
  // 🧪 Testing utilities
  static generateTestCases(): Array<{n: number, k: number, expected: number}> {
    return [
      { n: 0, k: 0, expected: 1 },
      { n: 5, k: 0, expected: 1 },
      { n: 5, k: 5, expected: 1 },
      { n: 5, k: 1, expected: 5 },
      { n: 5, k: 4, expected: 5 },
      { n: 4, k: 2, expected: 6 },
      { n: 6, k: 3, expected: 20 },
      { n: 10, k: 3, expected: 120 }
    ]
  }
}
