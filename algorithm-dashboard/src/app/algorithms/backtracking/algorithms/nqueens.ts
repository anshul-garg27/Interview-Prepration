// 👑 Advanced N-Queens Algorithm Implementation
// World-class backtracking with comprehensive educational features and visualizations

import { ConstraintInfo, ExecutionStep, TreeNode } from '../types/BacktrackingTypes'

export interface NQueensParameters {
  boardSize: number
  findAllSolutions?: boolean
  visualizeAttacks?: boolean
  highlightConstraints?: boolean
  customQueenPositions?: Array<{ row: number; col: number }>
}

export interface NQueensResult {
  solutions: number[][]
  totalSolutions: number
  boardSize: number
  attackPatterns: AttackPattern[]
  isComplete: boolean
  symmetricSolutions?: number[][]
}

export interface AttackPattern {
  queen: { row: number; col: number }
  attackedSquares: Array<{ row: number; col: number; attackType: 'row' | 'column' | 'diagonal' }>
}

export interface BoardState {
  queens: Array<{ row: number; col: number }>
  attackedSquares: Set<string>
  safeSquares: Array<{ row: number; col: number }>
  currentRow: number
}

export class NQueensAlgorithm {
  private parameters: NQueensParameters
  private executionSteps: ExecutionStep<number>[] = []
  private allSolutions: number[][] = []
  private currentBoard: number[] = []
  private stepCounter = 0
  private onStepCallback?: (step: ExecutionStep<number>) => void
  private onNodeCallback?: (node: TreeNode<number>) => void
  private onBoardCallback?: (boardState: BoardState) => void
  private abortController = new AbortController()

  constructor(parameters: NQueensParameters) {
    this.parameters = {
      findAllSolutions: true,
      visualizeAttacks: true,
      highlightConstraints: true,
      ...parameters
    }
  }

  // 🚀 Main execution with comprehensive monitoring
  async execute(
    onStep?: (step: ExecutionStep<number>) => void,
    onNode?: (node: TreeNode<number>) => void,
    onBoard?: (boardState: BoardState) => void
  ): Promise<NQueensResult> {
    this.onStepCallback = onStep
    this.onNodeCallback = onNode
    this.onBoardCallback = onBoard
    this.reset()

    const startTime = performance.now()
    
    try {
      // Initialize board with custom positions if provided
      if (this.parameters.customQueenPositions) {
        this.initializeCustomBoard()
      }

      await this.solveNQueens(0)
      
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Add completion step
      await this.addStep({
        type: 'solution',
        description: `N-Queens completed: Found ${this.allSolutions.length} solution(s)`,
        currentPath: [...this.currentBoard],
        availableChoices: [],
        solutionFound: true,
        metadata: {
          totalSolutions: this.allSolutions.length,
          executionTime,
          expectedSolutions: this.getExpectedSolutionCount()
        }
      })

      return {
        solutions: [...this.allSolutions],
        totalSolutions: this.allSolutions.length,
        boardSize: this.parameters.boardSize,
        attackPatterns: this.generateAttackPatterns(),
        isComplete: true,
        symmetricSolutions: this.findSymmetricSolutions()
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          solutions: [...this.allSolutions],
          totalSolutions: this.allSolutions.length,
          boardSize: this.parameters.boardSize,
          attackPatterns: this.generateAttackPatterns(),
          isComplete: false
        }
      }
      throw error
    }
  }

  // 🎯 Core recursive backtracking implementation
  private async solveNQueens(row: number): Promise<boolean> {
    if (this.abortController.signal.aborted) {
      throw new DOMException('Execution aborted', 'AbortError')
    }

    const n = this.parameters.boardSize

    // Base case: all queens placed successfully
    if (row === n) {
      this.allSolutions.push([...this.currentBoard])
      
      await this.addStep({
        type: 'solution',
        description: `Solution found! Queens at columns: [${this.currentBoard.join(', ')}]`,
        currentPath: [...this.currentBoard],
        availableChoices: [],
        solutionFound: true,
        metadata: {
          solutionNumber: this.allSolutions.length,
          isSymmetric: this.isSymmetricSolution(this.currentBoard)
        }
      })

      // Update board state for visualization
      this.updateBoardState(row)

      // Return true if we only need one solution
      return !this.parameters.findAllSolutions
    }

    // Try placing queen in each column of current row
    for (let col = 0; col < n; col++) {
      // Create tree node for this choice
      const nodeId = `nqueens-${row}-${col}`
      const node: TreeNode<number> = {
        id: nodeId,
        value: col,
        depth: row,
        children: [],
        isLeaf: row === n - 1,
        isSolution: false,
        isBacktracked: false,
        isActive: true,
        executionOrder: this.stepCounter,
        pathFromRoot: [...this.currentBoard, col],
        metadata: {
          choicesRemaining: n - col,
          estimatedBranches: this.calculateBranchingFactor(row, col)
        }
      }

      this.onNodeCallback?.(node)

      // Check if placing queen at (row, col) is safe
      const constraints = this.checkConstraints(row, col)
      const isSafe = constraints.every(c => !c.isViolated)

      await this.addStep({
        type: 'choice',
        description: `Trying to place queen at row ${row}, column ${col}`,
        currentPath: [...this.currentBoard],
        availableChoices: Array.from({ length: n }, (_, i) => i),
        choiceMade: col,
        constraints,
        metadata: {
          attackingQueens: this.getAttackingQueens(row, col),
          safeSquares: this.getSafeSquares(row).length
        }
      })

      if (isSafe) {
        // Place queen
        this.currentBoard[row] = col
        this.updateBoardState(row + 1)

        // Recursive call
        const solutionFound = await this.solveNQueens(row + 1)
        
        if (solutionFound && !this.parameters.findAllSolutions) {
          return true
        }

        // Backtrack
        await this.addStep({
          type: 'backtrack',
          description: `Backtracking from row ${row}, column ${col}`,
          currentPath: [...this.currentBoard],
          availableChoices: [],
          metadata: {
            backtrackReason: 'Exploring other possibilities or continuing search'
          }
        })

        this.currentBoard[row] = -1 // Remove queen
        node.isBacktracked = true
      } else {
        await this.addStep({
          type: 'pruning',
          description: `Cannot place queen at (${row}, ${col}) - conflicts detected`,
          currentPath: [...this.currentBoard],
          availableChoices: [],
          pruningReason: constraints.find(c => c.isViolated)?.description,
          constraints
        })
      }
    }

    return false
  }

  // 🎯 Constraint checking with detailed analysis
  private checkConstraints(row: number, col: number): ConstraintInfo[] {
    const constraints: ConstraintInfo[] = []

    // Check column constraint
    let columnConflict = false
    for (let i = 0; i < row; i++) {
      if (this.currentBoard[i] === col) {
        columnConflict = true
        break
      }
    }

    constraints.push({
      type: 'column',
      description: `Column ${col} must be free`,
      isViolated: columnConflict,
      severity: 'high'
    })

    // Check diagonal constraints
    let diagonalConflict = false
    for (let i = 0; i < row; i++) {
      const queenCol = this.currentBoard[i]
      if (queenCol !== -1) {
        // Check both diagonals
        if (Math.abs(row - i) === Math.abs(col - queenCol)) {
          diagonalConflict = true
          break
        }
      }
    }

    constraints.push({
      type: 'diagonal',
      description: `Diagonals from (${row}, ${col}) must be free`,
      isViolated: diagonalConflict,
      severity: 'high'
    })

    return constraints
  }

  // 📊 Advanced analysis methods
  private getAttackingQueens(row: number, col: number): Array<{ row: number; col: number; attackType: string }> {
    const attacking = []

    for (let i = 0; i < row; i++) {
      const queenCol = this.currentBoard[i]
      if (queenCol !== -1) {
        if (queenCol === col) {
          attacking.push({ row: i, col: queenCol, attackType: 'column' })
        } else if (Math.abs(row - i) === Math.abs(col - queenCol)) {
          attacking.push({ row: i, col: queenCol, attackType: 'diagonal' })
        }
      }
    }

    return attacking
  }

  private getSafeSquares(row: number): Array<{ row: number; col: number }> {
    const safe = []
    const n = this.parameters.boardSize

    for (let col = 0; col < n; col++) {
      const constraints = this.checkConstraints(row, col)
      if (constraints.every(c => !c.isViolated)) {
        safe.push({ row, col })
      }
    }

    return safe
  }

  private calculateBranchingFactor(row: number, col: number): number {
    // Estimate remaining valid choices
    const remainingRows = this.parameters.boardSize - row - 1
    const safeSquares = this.getSafeSquares(row + 1).length
    return remainingRows > 0 ? safeSquares : 0
  }

  // 🎨 Visualization support
  private updateBoardState(currentRow: number): void {
    if (!this.onBoardCallback) return

    const queens = this.currentBoard
      .map((col, row) => col !== -1 ? { row, col } : null)
      .filter(queen => queen !== null) as Array<{ row: number; col: number }>

    const attackedSquares = new Set<string>()
    queens.forEach(queen => {
      this.getAttackedSquares(queen.row, queen.col).forEach(square => {
        attackedSquares.add(`${square.row}-${square.col}`)
      })
    })

    const safeSquares = currentRow < this.parameters.boardSize 
      ? this.getSafeSquares(currentRow) 
      : []

    this.onBoardCallback({
      queens,
      attackedSquares,
      safeSquares,
      currentRow
    })
  }

  private getAttackedSquares(queenRow: number, queenCol: number): Array<{ row: number; col: number }> {
    const attacked = []
    const n = this.parameters.boardSize

    // Row and column attacks
    for (let i = 0; i < n; i++) {
      if (i !== queenRow) attacked.push({ row: i, col: queenCol })
      if (i !== queenCol) attacked.push({ row: queenRow, col: i })
    }

    // Diagonal attacks
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== queenRow && j !== queenCol && Math.abs(i - queenRow) === Math.abs(j - queenCol)) {
          attacked.push({ row: i, col: j })
        }
      }
    }

    return attacked
  }

  // 🔢 Mathematical analysis
  private getExpectedSolutionCount(): number {
    // Known solution counts for N-Queens
    const knownSolutions: { [key: number]: number } = {
      1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40, 8: 92,
      9: 352, 10: 724, 11: 2680, 12: 14200, 13: 73712, 14: 365596
    }

    return knownSolutions[this.parameters.boardSize] ?? -1
  }

  private isSymmetricSolution(solution: number[]): boolean {
    const n = solution.length
    const rotated = solution.map((_, i) => solution[n - 1 - i])
    return JSON.stringify(solution) === JSON.stringify(rotated)
  }

  private findSymmetricSolutions(): number[][] {
    return this.allSolutions.filter(solution => this.isSymmetricSolution(solution))
  }

  private generateAttackPatterns(): AttackPattern[] {
    if (this.allSolutions.length === 0) return []

    const firstSolution = this.allSolutions[0]
    return firstSolution.map((col, row) => ({
      queen: { row, col },
      attackedSquares: this.getAttackedSquares(row, col).map(square => ({
        ...square,
        attackType: this.getAttackType(row, col, square.row, square.col)
      }))
    }))
  }

  private getAttackType(queenRow: number, queenCol: number, targetRow: number, targetCol: number): 'row' | 'column' | 'diagonal' {
    if (queenRow === targetRow) return 'row'
    if (queenCol === targetCol) return 'column'
    return 'diagonal'
  }

  // 🎯 Educational content
  getComplexityAnalysis(): {
    timeComplexity: string
    spaceComplexity: string
    explanation: string
  } {
    const n = this.parameters.boardSize
    return {
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      explanation: `
        Time: O(N!) - In worst case, we try all permutations
        Space: O(N) - Recursion depth is N (one queen per row)
        For N=${n}: ~${this.factorial(n)} operations in worst case
        Actual performance is much better due to constraint pruning
      `
    }
  }

  private factorial(n: number): number {
    return n <= 1 ? 1 : n * this.factorial(n - 1)
  }

  getEducationalContent(): {
    keyInsights: string[]
    commonMistakes: string[]
    optimizations: string[]
    realWorldApplications: string[]
  } {
    return {
      keyInsights: [
        'N-Queens is a classic constraint satisfaction problem',
        'Backtracking with constraint checking is highly effective',
        'Early pruning dramatically reduces search space',
        'The problem has beautiful mathematical symmetries',
        'Solution count grows exponentially but irregularly'
      ],
      commonMistakes: [
        'Forgetting to check diagonal constraints properly',
        'Not implementing efficient backtracking',
        'Missing optimization opportunities',
        'Incorrect board representation',
        'Not handling edge cases (N=1, N=2, N=3)'
      ],
      optimizations: [
        'Use constraint propagation for early pruning',
        'Implement symmetry breaking to reduce search',
        'Use bit manipulation for faster constraint checking',
        'Apply heuristics for queen placement order',
        'Use parallel processing for different starting positions'
      ],
      realWorldApplications: [
        'Resource allocation and scheduling',
        'Graph coloring problems',
        'Facility location planning',
        'Network security and coverage',
        'AI game playing and puzzle solving'
      ]
    }
  }

  // 🎮 Interactive challenges
  getInteractiveChallenges(): Array<{
    title: string
    description: string
    boardSize: number
    customPositions?: Array<{ row: number; col: number }>
    expectedSolutions?: number
  }> {
    return [
      {
        title: 'Classic 4x4',
        description: 'Solve the 4-Queens problem',
        boardSize: 4,
        expectedSolutions: 2
      },
      {
        title: 'Standard 8x8',
        description: 'The classic 8-Queens puzzle',
        boardSize: 8,
        expectedSolutions: 92
      },
      {
        title: 'Impossible 2x2',
        description: 'Try the impossible 2-Queens',
        boardSize: 2,
        expectedSolutions: 0
      },
      {
        title: 'Large 10x10',
        description: 'Challenge yourself with 10-Queens',
        boardSize: 10,
        expectedSolutions: 724
      },
      {
        title: 'Partially Solved',
        description: 'Complete this 6x6 with queen already placed',
        boardSize: 6,
        customPositions: [{ row: 0, col: 1 }],
        expectedSolutions: 1
      }
    ]
  }

  // 🧹 Utility methods
  private initializeCustomBoard(): void {
    if (!this.parameters.customQueenPositions) return

    this.currentBoard = new Array(this.parameters.boardSize).fill(-1)
    this.parameters.customQueenPositions.forEach(pos => {
      this.currentBoard[pos.row] = pos.col
    })
  }

  private async addStep(stepData: Partial<ExecutionStep<number>>): Promise<void> {
    const step: ExecutionStep<number> = {
      id: `step-${this.stepCounter++}`,
      timestamp: Date.now(),
      depth: this.currentBoard.filter(col => col !== -1).length,
      currentPath: [...this.currentBoard],
      availableChoices: [],
      type: 'choice',
      description: '',
      ...stepData
    }

    this.executionSteps.push(step)
    
    if (this.onStepCallback) {
      this.onStepCallback(step)
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  abort(): void {
    this.abortController.abort()
  }

  reset(): void {
    this.allSolutions = []
    this.currentBoard = new Array(this.parameters.boardSize).fill(-1)
    this.executionSteps = []
    this.stepCounter = 0
    this.abortController = new AbortController()
  }

  getExecutionSteps(): ExecutionStep<number>[] {
    return [...this.executionSteps]
  }
}

// 🎯 Export utility functions
export const createNQueensVisualization = (steps: ExecutionStep<number>[]) => {
  return {
    type: 'nqueens',
    totalSteps: steps.length,
    solutionSteps: steps.filter(s => s.type === 'solution').length,
    backtrackSteps: steps.filter(s => s.type === 'backtrack').length,
    pruningSteps: steps.filter(s => s.type === 'pruning').length,
    maxDepth: Math.max(...steps.map(s => s.depth))
  }
}

export const generateNQueensTestCases = (): Array<{
  name: string
  input: NQueensParameters
  expectedOutput: number
}> => {
  return [
    { name: '1-Queen (trivial)', input: { boardSize: 1 }, expectedOutput: 1 },
    { name: '2-Queens (impossible)', input: { boardSize: 2 }, expectedOutput: 0 },
    { name: '3-Queens (impossible)', input: { boardSize: 3 }, expectedOutput: 0 },
    { name: '4-Queens (classic)', input: { boardSize: 4 }, expectedOutput: 2 },
    { name: '5-Queens (moderate)', input: { boardSize: 5 }, expectedOutput: 10 },
    { name: '6-Queens (challenging)', input: { boardSize: 6 }, expectedOutput: 4 },
    { name: '8-Queens (standard)', input: { boardSize: 8 }, expectedOutput: 92 }
  ]
}
