// 🎯 Advanced Subsets Algorithm Implementation
// World-class backtracking with comprehensive educational features

import { ConstraintInfo, ExecutionStep, TreeNode } from '../types/BacktrackingTypes'

export interface SubsetsParameters {
  numbers: number[]
  allowDuplicates?: boolean
  targetSum?: number
  minLength?: number
  maxLength?: number
  includeEmpty?: boolean
}

export interface SubsetsResult {
  allSubsets: number[][]
  totalCount: number
  uniqueCount: number
  expectedCount: number
  isComplete: boolean
}

export class SubsetsAlgorithm {
  private parameters: SubsetsParameters
  private executionSteps: ExecutionStep<number[]>[] = []
  private allSubsets: number[][] = []
  private currentSubset: number[] = []
  private stepCounter = 0
  private onStepCallback?: (step: ExecutionStep<number[]>) => void
  private onNodeCallback?: (node: TreeNode<number>) => void
  private abortController = new AbortController()

  constructor(parameters: SubsetsParameters) {
    this.parameters = {
      allowDuplicates: true,
      includeEmpty: true,
      ...parameters
    }
  }

  // 🚀 Main execution with comprehensive monitoring
  async execute(
    onStep?: (step: ExecutionStep<number[]>) => void,
    onNode?: (node: TreeNode<number>) => void
  ): Promise<SubsetsResult> {
    this.onStepCallback = onStep
    this.onNodeCallback = onNode
    this.reset()

    const startTime = performance.now()
    
    // Sort for consistent ordering and duplicate handling
    const sortedNumbers = [...this.parameters.numbers].sort((a, b) => a - b)
    
    try {
      await this.generateSubsets(sortedNumbers, 0, [])
      
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Add completion step
      await this.addStep({
        type: 'solution',
        description: 'Algorithm completed',
        currentPath: [...this.currentSubset],
        availableChoices: [],
        solutionFound: true,
        metadata: {
          totalSubsets: this.allSubsets.length,
          executionTime,
          expectedCount: this.calculateExpectedCount()
        }
      })

      return {
        allSubsets: [...this.allSubsets],
        totalCount: this.allSubsets.length,
        uniqueCount: this.getUniqueCount(),
        expectedCount: this.calculateExpectedCount(),
        isComplete: true
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          allSubsets: [...this.allSubsets],
          totalCount: this.allSubsets.length,
          uniqueCount: this.getUniqueCount(),
          expectedCount: this.calculateExpectedCount(),
          isComplete: false
        }
      }
      throw error
    }
  }

  // 🎯 Core recursive backtracking implementation
  private async generateSubsets(
    numbers: number[],
    startIndex: number,
    currentSubset: number[]
  ): Promise<void> {
    if (this.abortController.signal.aborted) {
      throw new DOMException('Execution aborted', 'AbortError')
    }

    // Create tree node for current state
    const nodeId = `subset-${this.stepCounter}`
    const depth = currentSubset.length
    
    const node: TreeNode<number> = {
      id: nodeId,
      value: startIndex < numbers.length ? numbers[startIndex] : -1,
      depth,
      children: [],
      isLeaf: startIndex >= numbers.length,
      isSolution: false,
      isBacktracked: false,
      isActive: true,
      executionOrder: this.stepCounter,
      pathFromRoot: [...currentSubset],
      metadata: {
        choicesRemaining: numbers.length - startIndex,
        estimatedBranches: Math.pow(2, numbers.length - startIndex)
      }
    }

    this.onNodeCallback?.(node)

    // Base case: current subset is a valid subset
    const isValidSubset = this.isValidSubset(currentSubset)
    
    if (isValidSubset) {
      this.allSubsets.push([...currentSubset])
      
      await this.addStep({
        type: 'solution',
        description: `Found valid subset: [${currentSubset.join(', ')}]`,
        currentPath: [...currentSubset],
        availableChoices: [],
        solutionFound: true,
        metadata: {
          subsetLength: currentSubset.length,
          subsetSum: currentSubset.reduce((a, b) => a + b, 0),
          totalFound: this.allSubsets.length
        }
      })

      node.isSolution = true
    }

    // Generate all possible extensions
    for (let i = startIndex; i < numbers.length; i++) {
      // Skip duplicates if not allowed
      if (!this.parameters.allowDuplicates && i > startIndex && numbers[i] === numbers[i - 1]) {
        continue
      }

      const choice = numbers[i]
      const newSubset = [...currentSubset, choice]

      // Check constraints before making choice
      const constraints = this.checkConstraints(newSubset, numbers, i + 1)
      const canContinue = constraints.every(c => !c.isViolated)

      await this.addStep({
        type: 'choice',
        description: `Considering adding ${choice} to subset`,
        currentPath: [...currentSubset],
        availableChoices: numbers.slice(i),
        choiceMade: choice,
        constraints,
        metadata: {
          remainingChoices: numbers.length - i - 1,
          currentSum: newSubset.reduce((a, b) => a + b, 0)
        }
      })

      if (canContinue) {
        // Recursive call
        await this.generateSubsets(numbers, i + 1, newSubset)
      } else {
        await this.addStep({
          type: 'pruning',
          description: `Pruned: constraints violated for ${choice}`,
          currentPath: [...currentSubset],
          availableChoices: [],
          pruningReason: constraints.find(c => c.isViolated)?.description
        })
      }
    }

    // Backtrack step
    await this.addStep({
      type: 'backtrack',
      description: `Backtracking from subset [${currentSubset.join(', ')}]`,
      currentPath: [...currentSubset],
      availableChoices: []
    })
  }

  // 🎯 Constraint validation
  private checkConstraints(subset: number[], allNumbers: number[], nextIndex: number): ConstraintInfo[] {
    const constraints: ConstraintInfo[] = []

    // Length constraints
    if (this.parameters.maxLength !== undefined) {
      constraints.push({
        type: 'custom',
        description: `Length ≤ ${this.parameters.maxLength}`,
        isViolated: subset.length > this.parameters.maxLength,
        severity: 'high'
      })
    }

    // Target sum constraint
    if (this.parameters.targetSum !== undefined) {
      const currentSum = subset.reduce((a, b) => a + b, 0)
      const remainingSum = allNumbers.slice(nextIndex).reduce((a, b) => a + b, 0)
      
      constraints.push({
        type: 'custom',
        description: `Sum can reach target ${this.parameters.targetSum}`,
        isViolated: currentSum > this.parameters.targetSum || 
                   (currentSum + remainingSum < this.parameters.targetSum),
        severity: 'medium'
      })
    }

    return constraints
  }

  // 🎯 Subset validation
  private isValidSubset(subset: number[]): boolean {
    // Empty subset handling
    if (subset.length === 0) {
      return this.parameters.includeEmpty ?? true
    }

    // Length constraints
    if (this.parameters.minLength && subset.length < this.parameters.minLength) {
      return false
    }
    if (this.parameters.maxLength && subset.length > this.parameters.maxLength) {
      return false
    }

    // Target sum constraint
    if (this.parameters.targetSum !== undefined) {
      const sum = subset.reduce((a, b) => a + b, 0)
      return sum === this.parameters.targetSum
    }

    return true
  }

  // 📊 Mathematical calculations
  private calculateExpectedCount(): number {
    const n = this.parameters.numbers.length
    
    if (this.parameters.targetSum !== undefined) {
      // For target sum, it's complex to calculate exactly
      return -1 // Unknown
    }
    
    if (!this.parameters.allowDuplicates) {
      // Count unique values
      const uniqueCount = new Set(this.parameters.numbers).size
      return Math.pow(2, uniqueCount)
    }
    
    return Math.pow(2, n)
  }

  private getUniqueCount(): number {
    const uniqueSubsets = new Set(this.allSubsets.map(subset => JSON.stringify([...subset].sort())))
    return uniqueSubsets.size
  }

  // 🎯 Step management
  private async addStep(stepData: Partial<ExecutionStep<number[]>>): Promise<void> {
    const step: ExecutionStep<number[]> = {
      id: `step-${this.stepCounter++}`,
      timestamp: Date.now(),
      depth: this.currentSubset.length,
      currentPath: [...this.currentSubset],
      availableChoices: [],
      type: 'choice',
      description: '',
      ...stepData
    }

    this.executionSteps.push(step)
    
    if (this.onStepCallback) {
      this.onStepCallback(step)
      // Add small delay for visualization
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  // 🧩 Educational utilities
  getComplexityAnalysis(): {
    timeComplexity: string
    spaceComplexity: string
    explanation: string
  } {
    const n = this.parameters.numbers.length
    return {
      timeComplexity: 'O(2^n)',
      spaceComplexity: 'O(n × 2^n)',
      explanation: `
        Time: O(2^n) - We explore 2^n possible subsets
        Space: O(n × 2^n) - Maximum recursion depth is n, and we store 2^n subsets
        For n=${n}: ~${Math.pow(2, n)} operations, ~${n * Math.pow(2, n)} space units
      `
    }
  }

  getEducationalContent(): {
    keyInsights: string[]
    commonMistakes: string[]
    optimizations: string[]
    realWorldApplications: string[]
  } {
    return {
      keyInsights: [
        'Subsets are different from permutations - order doesn\'t matter',
        'Every element has 2 choices: include or exclude',
        'Total subsets = 2^n for n distinct elements',
        'Backtracking naturally generates all possibilities',
        'Constraints can significantly prune the search space'
      ],
      commonMistakes: [
        'Forgetting to handle duplicate elements properly',
        'Not considering the empty subset when required',
        'Confusing subsets with subsequences or combinations',
        'Missing early pruning opportunities',
        'Incorrect handling of target sum constraints'
      ],
      optimizations: [
        'Sort input to enable duplicate skipping',
        'Use bit manipulation for small inputs (n ≤ 20)',
        'Implement early pruning for constraint violations',
        'Use iterative approach with bit patterns',
        'Dynamic programming for subset sum problems'
      ],
      realWorldApplications: [
        'Feature selection in machine learning',
        'Creating power sets in mathematics',
        'Subset sum problems in financial planning',
        'Generating test cases for software testing',
        'Finding optimal resource combinations'
      ]
    }
  }

  // 🎮 Interactive challenges
  getInteractiveChallenges(): Array<{
    title: string
    description: string
    input: number[]
    constraints?: Partial<SubsetsParameters>
    expectedOutput?: number
  }> {
    return [
      {
        title: 'Basic Subsets',
        description: 'Generate all subsets of [1,2,3]',
        input: [1, 2, 3],
        expectedOutput: 8
      },
      {
        title: 'Target Sum Subsets',
        description: 'Find subsets that sum to 10',
        input: [2, 3, 5, 6, 8, 10],
        constraints: { targetSum: 10 },
        expectedOutput: 3
      },
      {
        title: 'Fixed Length Subsets',
        description: 'Find all subsets of length 2',
        input: [1, 2, 3, 4],
        constraints: { minLength: 2, maxLength: 2 },
        expectedOutput: 6
      },
      {
        title: 'Duplicate Handling',
        description: 'Handle duplicate elements correctly',
        input: [1, 2, 2, 3],
        constraints: { allowDuplicates: false },
        expectedOutput: 6
      }
    ]
  }

  // 🧹 Cleanup
  abort(): void {
    this.abortController.abort()
  }

  reset(): void {
    this.allSubsets = []
    this.currentSubset = []
    this.executionSteps = []
    this.stepCounter = 0
    this.abortController = new AbortController()
  }

  getExecutionSteps(): ExecutionStep<number[]>[] {
    return [...this.executionSteps]
  }
}

// 🎯 Export utility functions
export const createSubsetsVisualization = (steps: ExecutionStep<number[]>[]) => {
  return {
    type: 'subsets',
    totalSteps: steps.length,
    solutionSteps: steps.filter(s => s.type === 'solution').length,
    backtrackSteps: steps.filter(s => s.type === 'backtrack').length,
    pruningSteps: steps.filter(s => s.type === 'pruning').length,
    maxDepth: Math.max(...steps.map(s => s.depth))
  }
}

export const generateSubsetsTestCases = (): Array<{
  name: string
  input: SubsetsParameters
  expectedOutput: number
}> => {
  return [
    {
      name: 'Empty array',
      input: { numbers: [] },
      expectedOutput: 1
    },
    {
      name: 'Single element',
      input: { numbers: [1] },
      expectedOutput: 2
    },
    {
      name: 'Three elements',
      input: { numbers: [1, 2, 3] },
      expectedOutput: 8
    },
    {
      name: 'With duplicates',
      input: { numbers: [1, 2, 2], allowDuplicates: false },
      expectedOutput: 6
    },
    {
      name: 'Target sum',
      input: { numbers: [1, 2, 3, 4], targetSum: 5 },
      expectedOutput: 3
    }
  ]
}
