// 🎯 Comprehensive Type System for Backtracking Dashboard
// World-class TypeScript architecture with complete type safety

export type BacktrackingPattern = 
  | 'permutations' 
  | 'combinations' 
  | 'subsets' 
  | 'nqueens' 
  | 'wordsearch'
  | 'sudoku'
  | 'generate-parentheses'

export type DashboardSection = 
  | 'visualization' 
  | 'concept' 
  | 'patterns' 
  | 'code' 
  | 'pitfalls' 
  | 'testing'

export interface TreeNode<T = any> {
  id: string
  value: T
  depth: number
  parent?: TreeNode<T>
  children: TreeNode<T>[]
  isLeaf: boolean
  isSolution: boolean
  isBacktracked: boolean
  isActive: boolean
  executionOrder: number
  pathFromRoot: T[]
  constraints?: ConstraintInfo[]
  metadata?: NodeMetadata
}

export interface NodeMetadata {
  choicesRemaining: number
  estimatedBranches: number
  pruningReason?: string
  executionTime?: number
  memoryUsage?: number
}

export interface ConstraintInfo {
  type: 'row' | 'column' | 'diagonal' | 'path' | 'duplicate' | 'custom'
  description: string
  isViolated: boolean
  severity: 'low' | 'medium' | 'high'
}

export interface ExecutionStep<T = any> {
  id: string
  type: 'choice' | 'backtrack' | 'solution' | 'pruning' | 'constraint-check'
  timestamp: number
  depth: number
  currentPath: T[]
  availableChoices: T[]
  choiceMade?: T
  reasoning: string
  constraints: ConstraintInfo[]
  performance: {
    recursionDepth: number
    totalCalls: number
    memoryUsage: number
    executionTime: number
  }
}

export interface BacktrackingState<T = any> {
  // Core Algorithm State
  pattern: BacktrackingPattern
  isExecuting: boolean
  isPaused: boolean
  isCompleted: boolean
  
  // Execution Control
  executionSpeed: number // ms between steps
  autoPlay: boolean
  stepMode: 'realtime' | 'step-by-step' | 'instant'
  
  // Algorithm Progress
  currentStep: number
  totalSteps: number
  currentPath: T[]
  allSolutions: T[][]
  partialSolutions: T[][]
  
  // Tree State
  decisionTree: TreeNode<T> | null
  currentNode: TreeNode<T> | null
  selectedNode: TreeNode<T> | null
  visitedNodes: Set<string>
  backtrackPath: string[] // node IDs in backtrack order
  
  // Visualization State
  showTree: boolean
  showStack: boolean
  showConstraints: boolean
  showPerformance: boolean
  highlightedPath: string[]
  animationQueue: AnimationEvent[]
  
  // Performance Metrics
  metrics: PerformanceMetrics
  
  // User Interaction
  userCanInteract: boolean
  selectedChoices: T[]
  manualMode: boolean
}

export interface PerformanceMetrics {
  startTime: number
  endTime?: number
  totalExecutionTime: number
  recursionDepth: number
  maxRecursionDepth: number
  totalFunctionCalls: number
  backtrackCount: number
  solutionCount: number
  pruningCount: number
  memoryPeakUsage: number
  timeComplexity: string
  spaceComplexity: string
  branchingFactor: number
}

export interface AnimationEvent {
  id: string
  type: 'node-enter' | 'node-exit' | 'choice-made' | 'backtrack' | 'solution-found' | 'constraint-violation'
  nodeId: string
  duration: number
  delay: number
  properties: Record<string, any>
}

// Pattern-Specific Types

export interface PermutationState {
  inputArray: number[]
  currentPermutation: number[]
  usedIndices: Set<number>
  remainingChoices: number[]
}

export interface CombinationState {
  n: number
  k: number
  currentCombination: number[]
  startIndex: number
  remainingSlots: number
}

export interface SubsetState {
  inputSet: number[]
  currentSubset: number[]
  currentIndex: number
  includeChoices: boolean[]
}

export interface NQueensState {
  boardSize: number
  queensPositions: Position[]
  currentRow: number
  attackingPairs: AttackPair[]
  safePositions: Position[]
}

export interface Position {
  row: number
  col: number
}

export interface AttackPair {
  queen1: Position
  queen2: Position
  attackType: 'row' | 'column' | 'diagonal'
}

export interface WordSearchState {
  grid: string[][]
  targetWord: string
  currentPath: Position[]
  foundPaths: Position[][]
  currentPosition: Position
  visitedCells: Set<string>
  directions: Position[]
}

// UI/UX State Management

export interface UIState {
  // Layout
  sidebarCollapsed: boolean
  activeSection: SectionType
  modalOpen: string | null
  
  // Visualization Preferences
  theme: 'light' | 'dark' | 'auto'
  animationSpeed: 'slow' | 'medium' | 'fast'
  visualizationMode: 'tree' | 'grid' | 'stack' | 'combined'
  
  // Interactive Features
  tutorialActive: boolean
  hintsEnabled: boolean
  soundEnabled: boolean
  
  // Responsive Design
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'large'
  isTouchDevice: boolean
}

export type SectionType = 
  | 'visualization' 
  | 'concepts' 
  | 'patterns' 
  | 'code' 
  | 'pitfalls' 
  | 'testing'
  | 'playground'

// Event System Types

export interface BacktrackingEvent<T = any> {
  type: string
  payload: T
  timestamp: number
  source: 'user' | 'algorithm' | 'animation' | 'system'
}

// Reducer Action Types
export interface BacktrackingAction {
  type: 'SET_PATTERN' | 'START_EXECUTION' | 'PAUSE_EXECUTION' | 'RESUME_EXECUTION' | 'STOP_EXECUTION' | 'RESET_STATE' |
        'STEP_FORWARD' | 'STEP_BACKWARD' | 'SET_SPEED' | 'SET_AUTO_PLAY' | 'SET_STEP_MODE' |
        'ADD_SOLUTION' | 'UPDATE_TREE' | 'SET_CURRENT_NODE' | 'SELECT_NODE' | 'HIGHLIGHT_PATH' |
        'TOGGLE_TREE_VIEW' | 'TOGGLE_STACK_VIEW' | 'TOGGLE_CONSTRAINTS_VIEW' | 'TOGGLE_PERFORMANCE_VIEW' |
        'ADD_ANIMATION' | 'REMOVE_ANIMATION' | 'UPDATE_METRICS' | 'SET_USER_INTERACTION' |
        'SET_MANUAL_MODE' | 'ADD_USER_CHOICE' | 'CLEAR_USER_CHOICES' | 'UPDATE_EXECUTION_STEP' |
        'RESET_EXECUTION' | 'SET_EXECUTION_SPEED' | 'CHANGE_PATTERN' | 'SET_CURRENT_PATH' | 'DISPATCH_EVENT'
  payload?: any
}

export interface UIAction {
  type: 'SET_SIDEBAR_COLLAPSED' | 'SET_ACTIVE_SECTION' | 'SET_MODAL_OPEN' | 'SET_THEME' | 
        'SET_ANIMATION_SPEED' | 'SET_VISUALIZATION_MODE' | 'TOGGLE_TUTORIAL' | 'TOGGLE_HINTS' | 
        'TOGGLE_SOUND' | 'SET_SCREEN_SIZE' | 'SET_TOUCH_DEVICE' | 'UPDATE_UI_STATE'
  payload?: any
}

// Context Type Definition
export interface BacktrackingContextType {
  // State
  state: BacktrackingState
  uiState: UIState
  config: BacktrackingConfig
  
  // Algorithm Control
  startExecution: (pattern: BacktrackingPattern, parameters?: any) => void
  pauseExecution: () => void
  resumeExecution: () => void
  stepForward: () => void
  stepBackward: () => void
  resetExecution: () => void
  setExecutionSpeed: (speed: number) => void
  
  // Pattern Management
  changePattern: (pattern: BacktrackingPattern, parameters?: any) => void
  updatePatternParameters: (parameters: any) => void
  
  // Tree Interaction
  selectNode: (nodeId: string) => void
  highlightPath: (path: string[]) => void
  expandNode: (nodeId: string) => void
  collapseNode: (nodeId: string) => void
  
  // User Interaction
  makeManualChoice: (choice: any) => void
  enableManualMode: () => void
  disableManualMode: () => void
  requestHint: () => string | null
  
  // Visualization Controls
  setVisualizationMode: (mode: 'tree' | 'grid' | 'stack' | 'combined') => void
  toggleSection: (section: string) => void
  setAnimationSpeed: (speed: 'slow' | 'medium' | 'fast') => void
  toggleTreeView: () => void
  toggleStackView: () => void
  toggleConstraintsView: () => void
  togglePerformanceView: () => void
  
  // Performance & Analytics
  getMetrics: () => PerformanceMetrics
  getPerformanceMetrics: () => PerformanceMetrics
  exportState: () => string
  importState: (stateString: string) => void
  exportExecutionData: () => any
  importExecutionData: (data: any) => void
  
  // Event System
  addEventListener: (type: string, handler: Function) => () => void
  removeEventListener: (type: string, handler: (event: BacktrackingEvent) => void) => void
  dispatchEvent: (event: BacktrackingEvent) => void
  dispatch: any
  
  // Utility Functions
  getCurrentStep: () => ExecutionStep | null
  getTotalSteps: () => number
  getProgressPercentage: () => number
  isExecutionComplete: () => boolean
  
  // UI State Management
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveSection: (section: SectionType) => void
  setModalOpen: (modal: string | null) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  
  // Advanced Features
  enableComparison: (patterns: BacktrackingPattern[]) => void
  createCustomProblem: (problem: any) => void
  startTutorial: (tutorialId: string) => void
  nextTutorialStep: () => void
  previousTutorialStep: () => void
  exitTutorial: () => void
}

// Configuration Types
export interface BacktrackingConfig {
  maxRecursionDepth: number
  maxExecutionTime: number
  enablePerformanceMonitoring: boolean
  enableAnimation: boolean
  defaultAnimationSpeed: number
  autoSaveProgress: boolean
  enableTelemetry: boolean
  experimentalFeatures: string[]
}

// Export utility types for better developer experience
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Pattern-specific utility types
export type PatternState<T extends BacktrackingPattern> = 
  T extends 'permutations' ? PermutationState :
  T extends 'combinations' ? CombinationState :
  T extends 'subsets' ? SubsetState :
  T extends 'nqueens' ? NQueensState :
  T extends 'wordsearch' ? WordSearchState :
  never

// Event handler types for better type safety
export type EventHandler<T = any> = (event: BacktrackingEvent<T>) => void | Promise<void>

export type PatternEventHandlers = {
  [K in BacktrackingPattern]: {
    onStepForward: EventHandler<PatternState<K>>
    onStepBackward: EventHandler<PatternState<K>>
    onSolutionFound: EventHandler<PatternState<K>>
    onBacktrack: EventHandler<PatternState<K>>
    onConstraintViolation: EventHandler<ConstraintInfo>
  }
}
