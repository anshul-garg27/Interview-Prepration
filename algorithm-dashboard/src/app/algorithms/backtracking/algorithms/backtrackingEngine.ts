// 🎯 Core Backtracking Engine - World-Class Algorithm Implementation
// Advanced algorithms with real-time visualization and performance monitoring

import { ConstraintInfo, ExecutionStep, PerformanceMetrics, TreeNode } from '../types/BacktrackingTypes'

export interface AlgorithmExecutionContext<T = any> {
  onStepComplete: (step: ExecutionStep<T>) => Promise<void>
  onSolutionFound: (solution: T[]) => void
  onBacktrack: (fromNode: TreeNode<T>, toNode: TreeNode<T>) => void
  onConstraintViolation: (constraint: ConstraintInfo) => void
  shouldPause: () => boolean
  getCurrentSpeed: () => number
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void
}

export interface AlgorithmResult<T = any> {
  solutions: T[][]
  executionSteps: ExecutionStep<T>[]
  decisionTree: TreeNode<T>
  metrics: PerformanceMetrics
  success: boolean
  error?: string
}

// 🚀 Advanced Backtracking Engine with Real-Time Visualization
export class BacktrackingEngine<T = any> {
  private context: AlgorithmExecutionContext<T>
  private startTime: number = 0
  private stepCount: number = 0
  private maxDepth: number = 0
  private solutionCount: number = 0
  private backtrackCount: number = 0
  private pruningCount: number = 0
  
  constructor(context: AlgorithmExecutionContext<T>) {
    this.context = context
  }
  
  // 🎯 Generic Backtracking Template with Advanced Features
  async executeBacktracking<State>(
    initialState: State,
    isComplete: (state: State) => boolean,
    getChoices: (state: State) => T[],
    makeChoice: (state: State, choice: T) => State,
    isValid: (state: State, choice: T) => boolean,
    unmakeChoice: (state: State) => State,
    getConstraints?: (state: State, choice: T) => ConstraintInfo[]
  ): Promise<AlgorithmResult<T>> {
    
    this.startTime = performance.now()
    const solutions: T[][] = []
    const executionSteps: ExecutionStep<T>[] = []
    const rootNode: TreeNode<T> = this.createRootNode()
    
    try {
      await this.backtrackRecursive(
        initialState,
        [],
        rootNode,
        0,
        isComplete,
        getChoices,
        makeChoice,
        isValid,
        unmakeChoice,
        getConstraints,
        solutions,
        executionSteps
      )
      
      const metrics = this.calculateMetrics()
      
      return {
        solutions,
        executionSteps,
        decisionTree: rootNode,
        metrics,
        success: true
      }
    } catch (error) {
      return {
        solutions: [],
        executionSteps,
        decisionTree: rootNode,
        metrics: this.calculateMetrics(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 🔄 Advanced Recursive Backtracking with Visualization Hooks
  private async backtrackRecursive<State>(
    state: State,
    currentPath: T[],
    currentNode: TreeNode<T>,
    depth: number,
    isComplete: (state: State) => boolean,
    getChoices: (state: State) => T[],
    makeChoice: (state: State, choice: T) => State,
    isValid: (state: State, choice: T) => boolean,
    unmakeChoice: (state: State) => State,
    getConstraints: ((state: State, choice: T) => ConstraintInfo[]) | undefined,
    solutions: T[][],
    executionSteps: ExecutionStep<T>[]
  ): Promise<void> {
    
    this.stepCount++
    this.maxDepth = Math.max(this.maxDepth, depth)
    
    // Check if we should pause execution
    if (this.context.shouldPause()) {
      await new Promise(resolve => setTimeout(resolve, this.context.getCurrentSpeed()))
    }
    
    // Create execution step for visualization
    const step: ExecutionStep<T> = {
      id: `step-${this.stepCount}`,
      type: 'choice',
      timestamp: performance.now() - this.startTime,
      depth,
      currentPath: [...currentPath],
      availableChoices: getChoices(state),
      reasoning: `Exploring depth ${depth} with path [${currentPath.join(', ')}]`,
      constraints: [],
      performance: {
        recursionDepth: depth,
        totalCalls: this.stepCount,
        memoryUsage: this.estimateMemoryUsage(),
        executionTime: performance.now() - this.startTime
      }
    }
    
    executionSteps.push(step)
    await this.context.onStepComplete(step)
    
    // Base case: Check if current state is a complete solution
    if (isComplete(state)) {
      this.solutionCount++
      solutions.push([...currentPath])
      currentNode.isSolution = true
      
      const solutionStep: ExecutionStep<T> = {
        ...step,
        id: `solution-${this.solutionCount}`,
        type: 'solution',
        reasoning: `Found solution #${this.solutionCount}: [${currentPath.join(', ')}]`
      }
      
      executionSteps.push(solutionStep)
      await this.context.onStepComplete(solutionStep)
      this.context.onSolutionFound([...currentPath])
      return
    }
    
    // Get available choices for current state
    const choices = getChoices(state)
    
    // Early pruning: no choices available
    if (choices.length === 0) {
      this.pruningCount++
      
      const pruningStep: ExecutionStep<T> = {
        ...step,
        id: `pruning-${this.pruningCount}`,
        type: 'pruning',
        reasoning: 'No valid choices available - pruning branch'
      }
      
      executionSteps.push(pruningStep)
      await this.context.onStepComplete(pruningStep)
      return
    }
    
    // Try each choice
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i]
      
      // Check constraints before making choice
      const constraints = getConstraints ? getConstraints(state, choice) : []
      const violatedConstraints = constraints.filter(c => c.isViolated)
      
      if (violatedConstraints.length > 0) {
        // Constraint violation - skip this choice
        violatedConstraints.forEach(constraint => {
          this.context.onConstraintViolation(constraint)
        })
        
        const constraintStep: ExecutionStep<T> = {
          ...step,
          id: `constraint-${this.stepCount}-${i}`,
          type: 'constraint-check',
          choiceMade: choice,
          reasoning: `Constraint violated for choice ${choice}: ${violatedConstraints[0].description}`,
          constraints: violatedConstraints
        }
        
        executionSteps.push(constraintStep)
        await this.context.onStepComplete(constraintStep)
        continue
      }
      
      // Validate choice
      if (!isValid(state, choice)) {
        const invalidStep: ExecutionStep<T> = {
          ...step,
          id: `invalid-${this.stepCount}-${i}`,
          type: 'constraint-check',
          choiceMade: choice,
          reasoning: `Invalid choice: ${choice}`,
          constraints: [{ 
            type: 'custom', 
            description: 'Choice validation failed', 
            isViolated: true, 
            severity: 'medium' 
          }]
        }
        
        executionSteps.push(invalidStep)
        await this.context.onStepComplete(invalidStep)
        continue
      }
      
      // Create child node for visualization
      const childNode: TreeNode<T> = {
        id: `node-${this.stepCount}-${i}`,
        value: choice,
        depth: depth + 1,
        parent: currentNode,
        children: [],
        isLeaf: false,
        isSolution: false,
        isBacktracked: false,
        isActive: true,
        executionOrder: this.stepCount,
        pathFromRoot: [...currentPath, choice],
        constraints,
        metadata: {
          choicesRemaining: choices.length - i - 1,
          estimatedBranches: choices.length,
          executionTime: performance.now() - this.startTime,
          memoryUsage: this.estimateMemoryUsage()
        }
      }
      
      currentNode.children.push(childNode)
      
      // Make choice and update state
      const newState = makeChoice(state, choice)
      const newPath = [...currentPath, choice]
      
      const choiceStep: ExecutionStep<T> = {
        ...step,
        id: `choice-${this.stepCount}-${i}`,
        type: 'choice',
        choiceMade: choice,
        currentPath: newPath,
        reasoning: `Making choice: ${choice}`,
        constraints
      }
      
      executionSteps.push(choiceStep)
      await this.context.onStepComplete(choiceStep)
      
      // Recursive call
      await this.backtrackRecursive(
        newState,
        newPath,
        childNode,
        depth + 1,
        isComplete,
        getChoices,
        makeChoice,
        isValid,
        unmakeChoice,
        getConstraints,
        solutions,
        executionSteps
      )
      
      // Backtrack: undo choice
      this.backtrackCount++
      childNode.isBacktracked = true
      childNode.isActive = false
      
      const backtrackStep: ExecutionStep<T> = {
        ...step,
        id: `backtrack-${this.backtrackCount}`,
        type: 'backtrack',
        choiceMade: choice,
        reasoning: `Backtracking from choice: ${choice}`,
        constraints: []
      }
      
      executionSteps.push(backtrackStep)
      await this.context.onStepComplete(backtrackStep)
      this.context.onBacktrack(childNode, currentNode)
      
      // Update metrics
      this.context.updateMetrics({
        backtrackCount: this.backtrackCount,
        totalFunctionCalls: this.stepCount
      })
    }
  }
  
  private createRootNode(): TreeNode<T> {
    return {
      id: 'root',
      value: null as any,
      depth: 0,
      children: [],
      isLeaf: false,
      isSolution: false,
      isBacktracked: false,
      isActive: true,
      executionOrder: 0,
      pathFromRoot: [],
      metadata: {
        choicesRemaining: 0,
        estimatedBranches: 0,
        executionTime: 0,
        memoryUsage: 0
      }
    }
  }
  
  private calculateMetrics(): PerformanceMetrics {
    const endTime = performance.now()
    const totalTime = endTime - this.startTime
    
    return {
      startTime: this.startTime,
      endTime,
      totalExecutionTime: totalTime,
      recursionDepth: this.maxDepth,
      maxRecursionDepth: this.maxDepth,
      totalFunctionCalls: this.stepCount,
      backtrackCount: this.backtrackCount,
      solutionCount: this.solutionCount,
      pruningCount: this.pruningCount,
      memoryPeakUsage: this.estimateMemoryUsage(),
      timeComplexity: this.estimateTimeComplexity(),
      spaceComplexity: this.estimateSpaceComplexity(),
      branchingFactor: this.calculateBranchingFactor()
    }
  }
  
  private estimateMemoryUsage(): number {
    // Estimate memory usage based on recursion depth and data structures
    return this.maxDepth * 0.1 + this.stepCount * 0.01 // MB approximation
  }
  
  private estimateTimeComplexity(): string {
    // Heuristic-based complexity estimation
    if (this.stepCount > 1000000) return 'O(2^n)'
    if (this.stepCount > 100000) return 'O(n!)'
    if (this.stepCount > 10000) return 'O(n^3)'
    if (this.stepCount > 1000) return 'O(n^2)'
    return 'O(n)'
  }
  
  private estimateSpaceComplexity(): string {
    // Space complexity based on maximum recursion depth
    if (this.maxDepth > 20) return 'O(n)'
    if (this.maxDepth > 10) return 'O(log n)'
    return 'O(1)'
  }
  
  private calculateBranchingFactor(): number {
    // Average branching factor approximation
    return this.stepCount > 0 ? Math.pow(this.stepCount, 1 / this.maxDepth) : 0
  }
}
