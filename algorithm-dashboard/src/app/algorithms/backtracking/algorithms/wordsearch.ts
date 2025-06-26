// 🔍 Advanced Word Search Algorithm Implementation
// World-class backtracking with grid traversal and comprehensive visualizations

import { ExecutionStep, TreeNode } from '../types/BacktrackingTypes'

export interface WordSearchParameters {
  grid: string[][]
  words: string[]
  allowDiagonal?: boolean
  allowReverse?: boolean
  caseSensitive?: boolean
  highlightPaths?: boolean
  showDirections?: boolean
}

export interface WordSearchResult {
  foundWords: FoundWord[]
  totalWords: number
  foundCount: number
  searchPaths: SearchPath[]
  isComplete: boolean
  gridAnalysis: GridAnalysis
}

export interface FoundWord {
  word: string
  path: Array<{ row: number; col: number; char: string }>
  direction: Direction
  startPos: { row: number; col: number }
  endPos: { row: number; col: number }
  pathId: string
}

export interface SearchPath {
  word: string
  attempts: Array<{
    startPos: { row: number; col: number }
    path: Array<{ row: number; col: number }>
    success: boolean
    failureReason?: string
  }>
}

export interface GridAnalysis {
  dimensions: { rows: number; cols: number }
  charFrequency: Map<string, number>
  totalCells: number
  uniqueChars: number
  density: number
}

export type Direction = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up' | 'reverse-horizontal' | 'reverse-vertical' | 'reverse-diagonal-down' | 'reverse-diagonal-up'

export interface GridPosition {
  row: number
  col: number
  char: string
  isVisited: boolean
  isPartOfSolution: boolean
  pathIds: string[]
}

export class WordSearchAlgorithm {
  private parameters: WordSearchParameters
  private executionSteps: ExecutionStep<string>[] = []
  private foundWords: FoundWord[] = []
  private searchPaths: SearchPath[] = []
  private stepCounter = 0
  private onStepCallback?: (step: ExecutionStep<string>) => void
  private onNodeCallback?: (node: TreeNode<string>) => void
  private onGridCallback?: (grid: GridPosition[][]) => void
  private abortController = new AbortController()

  // Direction vectors for 8 directions
  private readonly directions: Array<{ dr: number; dc: number; name: Direction }> = [
    { dr: 0, dc: 1, name: 'horizontal' },
    { dr: 1, dc: 0, name: 'vertical' },
    { dr: 1, dc: 1, name: 'diagonal-down' },
    { dr: 1, dc: -1, name: 'diagonal-up' },
    { dr: 0, dc: -1, name: 'reverse-horizontal' },
    { dr: -1, dc: 0, name: 'reverse-vertical' },
    { dr: -1, dc: -1, name: 'reverse-diagonal-down' },
    { dr: -1, dc: 1, name: 'reverse-diagonal-up' }
  ]

  constructor(parameters: WordSearchParameters) {
    this.parameters = {
      allowDiagonal: true,
      allowReverse: true,
      caseSensitive: false,
      highlightPaths: true,
      showDirections: true,
      ...parameters
    }
  }

  // 🚀 Main execution with comprehensive monitoring
  async execute(
    onStep?: (step: ExecutionStep<string>) => void,
    onNode?: (node: TreeNode<string>) => void,
    onGrid?: (grid: GridPosition[][]) => void
  ): Promise<WordSearchResult> {
    this.onStepCallback = onStep
    this.onNodeCallback = onNode
    this.onGridCallback = onGrid
    this.reset()

    const startTime = performance.now()
    
    try {
      // Initialize grid state
      this.updateGridVisualization()

      // Search for each word
      for (const word of this.parameters.words) {
        await this.searchWord(word)
      }
      
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Add completion step
      await this.addStep({
        type: 'solution',
        description: `Word search completed: Found ${this.foundWords.length}/${this.parameters.words.length} words`,
        currentPath: this.foundWords.map(fw => fw.word),
        availableChoices: [],
        solutionFound: true,
        metadata: {
          totalWords: this.parameters.words.length,
          foundCount: this.foundWords.length,
          executionTime,
          searchEfficiency: this.calculateSearchEfficiency()
        }
      })

      return {
        foundWords: [...this.foundWords],
        totalWords: this.parameters.words.length,
        foundCount: this.foundWords.length,
        searchPaths: [...this.searchPaths],
        isComplete: true,
        gridAnalysis: this.analyzeGrid()
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          foundWords: [...this.foundWords],
          totalWords: this.parameters.words.length,
          foundCount: this.foundWords.length,
          searchPaths: [...this.searchPaths],
          isComplete: false,
          gridAnalysis: this.analyzeGrid()
        }
      }
      throw error
    }
  }

  // 🎯 Core word search implementation
  private async searchWord(word: string): Promise<void> {
    if (this.abortController.signal.aborted) {
      throw new DOMException('Execution aborted', 'AbortError')
    }

    const searchPath: SearchPath = {
      word,
      attempts: []
    }

    await this.addStep({
      type: 'choice',
      description: `Starting search for word: "${word}"`,
      currentPath: [word],
      availableChoices: [],
      metadata: {
        wordLength: word.length,
        searchStarted: true
      }
    })

    const grid = this.parameters.grid
    let found = false

    // Try starting from each position in the grid
    for (let row = 0; row < grid.length && !found; row++) {
      for (let col = 0; col < grid[0].length && !found; col++) {
        // Try each direction
        for (const direction of this.getValidDirections()) {
          const attempt = {
            startPos: { row, col },
            path: [],
            success: false,
            failureReason: undefined as string | undefined
          }

          const result = await this.searchFromPosition(word, row, col, direction.dr, direction.dc, direction.name)
          
          attempt.path = result.path
          attempt.success = result.found
          attempt.failureReason = result.failureReason

          searchPath.attempts.push(attempt)

          if (result.found) {
            const foundWord: FoundWord = {
              word,
              path: result.path,
              direction: direction.name,
              startPos: { row, col },
              endPos: result.path[result.path.length - 1],
              pathId: `word-${this.foundWords.length}`
            }

            this.foundWords.push(foundWord)
            found = true

            await this.addStep({
              type: 'solution',
              description: `Found "${word}" at (${row}, ${col}) going ${direction.name}`,
              currentPath: [word],
              availableChoices: [],
              solutionFound: true,
              metadata: {
                wordFound: true,
                startPosition: { row, col },
                direction: direction.name,
                pathLength: result.path.length
              }
            })

            this.updateGridVisualization()
            break
          }
        }
      }
    }

    this.searchPaths.push(searchPath)

    if (!found) {
      await this.addStep({
        type: 'backtrack',
        description: `Word "${word}" not found in grid`,
        currentPath: [word],
        availableChoices: [],
        metadata: {
          wordNotFound: true,
          totalAttempts: searchPath.attempts.length
        }
      })
    }
  }

  // 🎯 Search from specific position in specific direction
  private async searchFromPosition(
    word: string,
    startRow: number,
    startCol: number,
    deltaRow: number,
    deltaCol: number,
    direction: Direction
  ): Promise<{ found: boolean; path: Array<{ row: number; col: number; char: string }>; failureReason?: string }> {
    const grid = this.parameters.grid
    const path: Array<{ row: number; col: number; char: string }> = []
    const targetWord = this.parameters.caseSensitive ? word : word.toLowerCase()

    // Create tree node for this search attempt
    const nodeId = `search-${startRow}-${startCol}-${direction}`
    const node: TreeNode<string> = {
      id: nodeId,
      value: word,
      depth: 0,
      children: [],
      isLeaf: false,
      isSolution: false,
      isBacktracked: false,
      isActive: true,
      executionOrder: this.stepCounter,
      pathFromRoot: [],
      metadata: {
        startPosition: { row: startRow, col: startCol },
        direction,
        choicesRemaining: word.length
      }
    }

    this.onNodeCallback?.(node)

    let currentRow = startRow
    let currentCol = startCol

    // Check each character of the word
    for (let i = 0; i < word.length; i++) {
      // Check bounds
      if (currentRow < 0 || currentRow >= grid.length || 
          currentCol < 0 || currentCol >= grid[0].length) {
        return {
          found: false,
          path,
          failureReason: `Out of bounds at position (${currentRow}, ${currentCol})`
        }
      }

      const gridChar = this.parameters.caseSensitive ? grid[currentRow][currentCol] : grid[currentRow][currentCol].toLowerCase()
      const targetChar = targetWord[i]

      path.push({
        row: currentRow,
        col: currentCol,
        char: grid[currentRow][currentCol]
      })

      // Check character match
      if (gridChar !== targetChar) {
        await this.addStep({
          type: 'pruning',
          description: `Character mismatch at (${currentRow}, ${currentCol}): expected '${targetChar}', found '${gridChar}'`,
          currentPath: path.map(p => p.char),
          availableChoices: [],
          pruningReason: 'Character mismatch',
          metadata: {
            position: { row: currentRow, col: currentCol },
            expected: targetChar,
            actual: gridChar
          }
        })

        return {
          found: false,
          path,
          failureReason: `Character mismatch: expected '${targetChar}', found '${gridChar}'`
        }
      }

      // Update tree node
      node.depth = i + 1
      node.pathFromRoot = path.map(p => p.char)
      node.isLeaf = i === word.length - 1

      await this.addStep({
        type: 'choice',
        description: `Matched character '${targetChar}' at (${currentRow}, ${currentCol})`,
        currentPath: path.map(p => p.char),
        availableChoices: [targetChar],
        choiceMade: targetChar,
        metadata: {
          position: { row: currentRow, col: currentCol },
          progress: `${i + 1}/${word.length}`,
          direction
        }
      })

      // Move to next position
      if (i < word.length - 1) {
        currentRow += deltaRow
        currentCol += deltaCol
      }
    }

    // Success - found the complete word
    node.isSolution = true
    return { found: true, path }
  }

  // 🎯 Helper methods
  private getValidDirections(): Array<{ dr: number; dc: number; name: Direction }> {
    let validDirections = this.directions.slice(0, 4) // Start with basic 4 directions

    if (this.parameters.allowDiagonal) {
      validDirections = this.directions.slice(0, 4) // First 4 include diagonals
    } else {
      validDirections = [
        { dr: 0, dc: 1, name: 'horizontal' },
        { dr: 1, dc: 0, name: 'vertical' }
      ]
    }

    if (this.parameters.allowReverse) {
      if (this.parameters.allowDiagonal) {
        validDirections = this.directions // All 8 directions
      } else {
        validDirections = [
          { dr: 0, dc: 1, name: 'horizontal' },
          { dr: 1, dc: 0, name: 'vertical' },
          { dr: 0, dc: -1, name: 'reverse-horizontal' },
          { dr: -1, dc: 0, name: 'reverse-vertical' }
        ]
      }
    }

    return validDirections
  }

  private calculateSearchEfficiency(): number {
    const totalPossiblePositions = this.parameters.grid.length * this.parameters.grid[0].length
    const totalAttempts = this.searchPaths.reduce((sum, path) => sum + path.attempts.length, 0)
    return totalAttempts / (totalPossiblePositions * this.parameters.words.length)
  }

  // 🎨 Visualization support
  private updateGridVisualization(): void {
    if (!this.onGridCallback) return

    const grid = this.parameters.grid
    const gridState: GridPosition[][] = []

    for (let row = 0; row < grid.length; row++) {
      gridState[row] = []
      for (let col = 0; col < grid[0].length; col++) {
        const pathIds: string[] = []
        let isPartOfSolution = false

        // Check if this position is part of any found word
        this.foundWords.forEach(foundWord => {
          const isInPath = foundWord.path.some(pos => pos.row === row && pos.col === col)
          if (isInPath) {
            pathIds.push(foundWord.pathId)
            isPartOfSolution = true
          }
        })

        gridState[row][col] = {
          row,
          col,
          char: grid[row][col],
          isVisited: false,
          isPartOfSolution,
          pathIds
        }
      }
    }

    this.onGridCallback(gridState)
  }

  // 📊 Grid analysis
  private analyzeGrid(): GridAnalysis {
    const grid = this.parameters.grid
    const charFrequency = new Map<string, number>()
    let totalCells = 0

    for (const row of grid) {
      for (const char of row) {
        const key = this.parameters.caseSensitive ? char : char.toLowerCase()
        charFrequency.set(key, (charFrequency.get(key) || 0) + 1)
        totalCells++
      }
    }

    return {
      dimensions: { rows: grid.length, cols: grid[0].length },
      charFrequency,
      totalCells,
      uniqueChars: charFrequency.size,
      density: charFrequency.size / totalCells
    }
  }

  // 🎯 Educational content
  getComplexityAnalysis(): {
    timeComplexity: string
    spaceComplexity: string
    explanation: string
  } {
    const rows = this.parameters.grid.length
    const cols = this.parameters.grid[0].length
    const words = this.parameters.words.length
    const maxWordLength = Math.max(...this.parameters.words.map(w => w.length))

    return {
      timeComplexity: 'O(N × M × W × L × D)',
      spaceComplexity: 'O(W × L)',
      explanation: `
        Time: O(N × M × W × L × D) where:
        - N = grid rows (${rows})
        - M = grid columns (${cols})
        - W = number of words (${words})
        - L = maximum word length (${maxWordLength})
        - D = number of directions (${this.getValidDirections().length})
        
        Space: O(W × L) for storing found words and paths
        Total operations: ~${rows * cols * words * maxWordLength * this.getValidDirections().length}
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
        'Word search combines grid traversal with string matching',
        'Backtracking helps when a path doesn\'t lead to a solution',
        'Multiple directions increase complexity exponentially',
        'Early termination saves significant computation time',
        'Grid constraints naturally limit the search space'
      ],
      commonMistakes: [
        'Forgetting to check grid bounds during traversal',
        'Not handling case sensitivity correctly',
        'Missing reverse direction searches',
        'Inefficient character comparison',
        'Not considering overlapping word placements'
      ],
      optimizations: [
        'Use Trie data structure for multiple word search',
        'Implement early pruning for impossible matches',
        'Cache character positions for frequent characters',
        'Use bit manipulation for direction vectors',
        'Parallel search for independent words'
      ],
      realWorldApplications: [
        'Text processing and pattern matching',
        'Bioinformatics sequence alignment',
        'Computer vision template matching',
        'Natural language processing',
        'Game development and puzzle solving'
      ]
    }
  }

  // 🎮 Interactive challenges
  getInteractiveChallenges(): Array<{
    title: string
    description: string
    grid: string[][]
    words: string[]
    constraints?: Partial<WordSearchParameters>
    expectedFound?: number
  }> {
    return [
      {
        title: 'Simple 4x4',
        description: 'Find basic words in a small grid',
        grid: [
          ['C', 'A', 'T', 'S'],
          ['O', 'R', 'A', 'T'],
          ['D', 'O', 'G', 'S'],
          ['M', 'A', 'T', 'H']
        ],
        words: ['CAT', 'DOG', 'MATH'],
        expectedFound: 3
      },
      {
        title: 'No Diagonals',
        description: 'Horizontal and vertical only',
        grid: [
          ['W', 'O', 'R', 'D'],
          ['A', 'B', 'C', 'S'],
          ['T', 'E', 'S', 'T'],
          ['X', 'Y', 'Z', 'A']
        ],
        words: ['WORD', 'TEST', 'ABC'],
        constraints: { allowDiagonal: false },
        expectedFound: 3
      },
      {
        title: 'Case Sensitive',
        description: 'Exact case matching required',
        grid: [
          ['H', 'e', 'L', 'L'],
          ['e', 'L', 'L', 'o'],
          ['L', 'L', 'O', 'w'],
          ['L', 'o', 'W', 'S']
        ],
        words: ['Hello', 'WORLD', 'eLLo'],
        constraints: { caseSensitive: true },
        expectedFound: 1
      },
      {
        title: 'Overlapping Words',
        description: 'Words that share letters',
        grid: [
          ['S', 'H', 'A', 'R', 'E'],
          ['T', 'A', 'B', 'L', 'E'],
          ['A', 'R', 'T', 'I', 'S'],
          ['R', 'E', 'A', 'D', 'Y'],
          ['T', 'E', 'S', 'T', 'S']
        ],
        words: ['SHARE', 'TABLE', 'ART', 'READ', 'TEST'],
        expectedFound: 5
      }
    ]
  }

  // 🧹 Utility methods
  private async addStep(stepData: Partial<ExecutionStep<string>>): Promise<void> {
    const step: ExecutionStep<string> = {
      id: `step-${this.stepCounter++}`,
      timestamp: Date.now(),
      depth: 0,
      currentPath: [],
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
    this.foundWords = []
    this.searchPaths = []
    this.executionSteps = []
    this.stepCounter = 0
    this.abortController = new AbortController()
  }

  getExecutionSteps(): ExecutionStep<string>[] {
    return [...this.executionSteps]
  }
}

// 🎯 Export utility functions
export const createWordSearchVisualization = (steps: ExecutionStep<string>[]) => {
  return {
    type: 'wordsearch',
    totalSteps: steps.length,
    solutionSteps: steps.filter(s => s.type === 'solution').length,
    backtrackSteps: steps.filter(s => s.type === 'backtrack').length,
    pruningSteps: steps.filter(s => s.type === 'pruning').length,
    maxDepth: Math.max(...steps.map(s => s.depth))
  }
}

export const generateWordSearchTestCases = (): Array<{
  name: string
  input: WordSearchParameters
  expectedOutput: number
}> => {
  return [
    {
      name: 'Simple 3x3',
      input: {
        grid: [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']],
        words: ['ABC', 'DEF']
      },
      expectedOutput: 2
    },
    {
      name: 'No diagonal',
      input: {
        grid: [['A', 'B'], ['C', 'D']],
        words: ['AB', 'AC'],
        allowDiagonal: false
      },
      expectedOutput: 2
    },
    {
      name: 'Case sensitive',
      input: {
        grid: [['A', 'b'], ['C', 'D']],
        words: ['Ab', 'AB'],
        caseSensitive: true
      },
      expectedOutput: 1
    }
  ]
}
