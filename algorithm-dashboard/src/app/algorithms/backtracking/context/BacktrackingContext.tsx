'use client'

import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'
import type {
    BacktrackingAction,
    BacktrackingConfig,
    BacktrackingContextType,
    BacktrackingEvent,
    BacktrackingPattern,
    BacktrackingState,
    ExecutionStep,
    PerformanceMetrics,
    SectionType,
    TreeNode,
    UIAction,
    UIState
} from '../types/BacktrackingTypes'

// Utility function to find node by ID (without generic syntax in TSX)
function findNodeById(node: TreeNode<any>, id: string): TreeNode<any> | null {
  if (node.id === id) return node
  for (const child of node.children || []) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

// Initial States
const initialBacktrackingState: BacktrackingState = {
  pattern: 'permutations',
  isExecuting: false,
  isPaused: false,
  isCompleted: false,
  
  executionSpeed: 1000,
  autoPlay: false,
  stepMode: 'step-by-step',
  
  currentStep: 0,
  totalSteps: 0,
  currentPath: [],
  allSolutions: [],
  partialSolutions: [],
  
  decisionTree: null,
  currentNode: null,
  selectedNode: null,
  visitedNodes: new Set(),
  backtrackPath: [],
  
  showTree: true,
  showStack: true,
  showConstraints: true,
  showPerformance: true,
  highlightedPath: [],
  animationQueue: [],
  
  metrics: {
    startTime: 0,
    totalExecutionTime: 0,
    recursionDepth: 0,
    maxRecursionDepth: 0,
    totalFunctionCalls: 0,
    backtrackCount: 0,
    solutionCount: 0,
    pruningCount: 0,
    memoryPeakUsage: 0,
    timeComplexity: 'O(?)',
    spaceComplexity: 'O(?)',
    branchingFactor: 0
  },
  
  userCanInteract: true,
  selectedChoices: [],
  manualMode: false
}

const initialUIState: UIState = {
  sidebarCollapsed: false,
  activeSection: 'visualization',
  modalOpen: null,
  
  theme: 'dark',
  animationSpeed: 'medium',
  visualizationMode: 'combined',
  
  tutorialActive: false,
  hintsEnabled: true,
  soundEnabled: false,
  
  screenSize: 'desktop',
  isTouchDevice: false
}

const initialConfig: BacktrackingConfig = {
  maxRecursionDepth: 1000,
  maxExecutionTime: 30000,
  enablePerformanceMonitoring: true,
  enableAnimation: true,
  defaultAnimationSpeed: 1000,
  autoSaveProgress: true,
  enableTelemetry: false,
  experimentalFeatures: []
}

// Reducer
const backtrackingReducer = (state: BacktrackingState, action: BacktrackingAction): BacktrackingState => {
  switch (action.type) {
    case 'START_EXECUTION':
      return {
        ...state,
        pattern: action.payload.pattern,
        isExecuting: true,
        isPaused: false,
        isCompleted: false,
        currentStep: 0,
        metrics: {
          ...state.metrics,
          startTime: Date.now(),
          totalFunctionCalls: 0,
          backtrackCount: 0,
          solutionCount: 0
        }
      }
      
    case 'PAUSE_EXECUTION':
      return {
        ...state,
        isPaused: true,
        isExecuting: false
      }
      
    case 'RESUME_EXECUTION':
      return {
        ...state,
        isPaused: false,
        isExecuting: true
      }
      
    case 'STEP_FORWARD':
      return {
        ...state,
        currentStep: state.currentStep + 1,
        metrics: {
          ...state.metrics,
          totalFunctionCalls: state.metrics.totalFunctionCalls + 1
        }
      }
      
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
        metrics: {
          ...state.metrics,
          backtrackCount: state.metrics.backtrackCount + 1
        }
      }
      
    case 'RESET_EXECUTION':
      return {
        ...state,
        isExecuting: false,
        isPaused: false,
        isCompleted: false,
        currentStep: 0,
        totalSteps: 0,
        currentPath: [],
        allSolutions: [],
        partialSolutions: [],
        decisionTree: null,
        currentNode: null,
        selectedNode: null,
        visitedNodes: new Set(),
        backtrackPath: [],
        highlightedPath: [],
        metrics: {
          ...initialBacktrackingState.metrics,
          startTime: 0
        }
      }
      
    case 'SET_EXECUTION_SPEED':
      return {
        ...state,
        executionSpeed: action.payload
      }
      
    case 'CHANGE_PATTERN':
      return {
        ...state,
        pattern: action.payload.pattern,
        isExecuting: false,
        isPaused: false,
        currentStep: 0,
        currentPath: [],
        allSolutions: [],
        decisionTree: null
      }
      
    case 'UPDATE_TREE':
      return {
        ...state,
        decisionTree: action.payload
      }
      
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNode: state.decisionTree ? findNodeById(state.decisionTree, action.payload) : null
      }
      
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...action.payload
        }
      }
      
    case 'ADD_SOLUTION':
      return {
        ...state,
        allSolutions: [...state.allSolutions, action.payload],
        metrics: {
          ...state.metrics,
          solutionCount: state.metrics.solutionCount + 1
        }
      }
      
    case 'SET_CURRENT_PATH':
      return {
        ...state,
        currentPath: action.payload
      }
      
    default:
      return state
  }
}

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'UPDATE_UI_STATE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

// Create the context
const BacktrackingContext = createContext<BacktrackingContextType | null>(null)

// Custom hook to use the context
export const useBacktracking = () => {
  const context = useContext(BacktrackingContext)
  if (!context) {
    throw new Error('useBacktracking must be used within a BacktrackingProvider')
  }
  return context
}

// Provider Component
export const BacktrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(backtrackingReducer, initialBacktrackingState)
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUIState)
  
  // Refs for cleanup and performance
  const eventListeners = useRef(new Map<string, Function[]>())
  const executionIntervalRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const algorithmWorkerRef = useRef<Worker | null>(null)
  const performanceObserver = useRef<PerformanceObserver | null>(null)
  
  // Performance monitoring setup
  useEffect(() => {
    if (initialConfig.enablePerformanceMonitoring && 'PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.startsWith('backtracking-')) {
            dispatch({
              type: 'UPDATE_METRICS',
              payload: {
                totalExecutionTime: entry.duration
              }
            })
          }
        })
      })
      
      performanceObserver.current.observe({ entryTypes: ['measure'] })
    }
    
    return () => {
      performanceObserver.current?.disconnect()
    }
  }, [])
  
  // Algorithm Control Functions
  const startExecution = useCallback(async (pattern: BacktrackingPattern, parameters?: any) => {
    performance.mark('backtracking-start')
    
    dispatch({
      type: 'START_EXECUTION',
      payload: { pattern, parameters }
    })
    
    dispatchEvent({
      type: 'execution-started',
      payload: { pattern, parameters },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const pauseExecution = useCallback(() => {
    if (executionIntervalRef.current) {
      clearInterval(executionIntervalRef.current)
      executionIntervalRef.current = null
    }
    
    dispatch({ type: 'PAUSE_EXECUTION' })
    
    dispatchEvent({
      type: 'execution-paused',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const resumeExecution = useCallback(() => {
    dispatch({ type: 'RESUME_EXECUTION' })
    
    if (state.autoPlay && !executionIntervalRef.current) {
      executionIntervalRef.current = window.setInterval(() => {
        stepForward()
      }, state.executionSpeed)
    }
    
    dispatchEvent({
      type: 'execution-resumed',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [state.autoPlay, state.executionSpeed])
  
  const stepForward = useCallback(async () => {
    performance.mark('backtracking-step-start')
    
    dispatch({ type: 'STEP_FORWARD' })
    
    performance.mark('backtracking-step-end')
    performance.measure('backtracking-step', 'backtracking-step-start', 'backtracking-step-end')
    
    dispatchEvent({
      type: 'step-forward',
      payload: { step: state.currentStep + 1 },
      timestamp: Date.now(),
      source: 'algorithm'
    })
  }, [state.currentStep])
  
  const stepBackward = useCallback(() => {
    dispatch({ type: 'STEP_BACKWARD' })
    
    dispatchEvent({
      type: 'step-backward',
      payload: { step: state.currentStep - 1 },
      timestamp: Date.now(),
      source: 'algorithm'
    })
  }, [state.currentStep])
  
  const resetExecution = useCallback(() => {
    if (executionIntervalRef.current) {
      clearInterval(executionIntervalRef.current)
      executionIntervalRef.current = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    dispatch({ type: 'RESET_EXECUTION' })
    
    performance.mark('backtracking-end')
    performance.measure('backtracking-total', 'backtracking-start', 'backtracking-end')
    
    dispatchEvent({
      type: 'execution-reset',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const setExecutionSpeed = useCallback((speed: number) => {
    dispatch({
      type: 'SET_EXECUTION_SPEED',
      payload: speed
    })
    
    if (executionIntervalRef.current) {
      clearInterval(executionIntervalRef.current)
      executionIntervalRef.current = window.setInterval(() => {
        stepForward()
      }, speed)
    }
  }, [stepForward])
  
  // Pattern Management
  const changePattern = useCallback((pattern: BacktrackingPattern, parameters?: any) => {
    dispatch({
      type: 'CHANGE_PATTERN',
      payload: { pattern, parameters }
    })
    
    dispatchEvent({
      type: 'pattern-changed',
      payload: { pattern, parameters },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const updatePatternParameters = useCallback((parameters: any) => {
    dispatchEvent({
      type: 'parameters-updated',
      payload: parameters,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  // Tree Interaction
  const selectNode = useCallback((nodeId: string) => {
    dispatch({
      type: 'SELECT_NODE',
      payload: nodeId
    })
    
    dispatchEvent({
      type: 'node-selected',
      payload: { nodeId },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const expandNode = useCallback((nodeId: string) => {
    dispatchEvent({
      type: 'node-expanded',
      payload: { nodeId },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const collapseNode = useCallback((nodeId: string) => {
    dispatchEvent({
      type: 'node-collapsed',
      payload: { nodeId },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const highlightPath = useCallback((path: string[]) => {
    dispatchEvent({
      type: 'path-highlighted',
      payload: { path },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  // User Interaction (without generic syntax)
  const makeManualChoice = useCallback((choice: any) => {
    dispatchEvent({
      type: 'manual-choice-made',
      payload: { choice },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const enableManualMode = useCallback(() => {
    dispatchEvent({
      type: 'manual-mode-enabled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const disableManualMode = useCallback(() => {
    dispatchEvent({
      type: 'manual-mode-disabled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const requestHint = useCallback((): string | null => {
    const hint = "Try exploring the leftmost branch first"
    
    dispatchEvent({
      type: 'hint-requested',
      payload: { hint },
      timestamp: Date.now(),
      source: 'user'
    })
    
    return hint
  }, [])
  
  // Visualization Control
  const setVisualizationMode = useCallback((mode: 'tree' | 'grid' | 'stack' | 'combined') => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { visualizationMode: mode }
    })
  }, [])
  
  const toggleSection = useCallback((section: string) => {
    dispatchEvent({
      type: 'section-toggled',
      payload: { section },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const setAnimationSpeed = useCallback((speed: 'slow' | 'medium' | 'fast') => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { animationSpeed: speed }
    })
  }, [])
  
  // Performance & Analytics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return state.metrics
  }, [state.metrics])
  
  const exportState = useCallback((): string => {
    return JSON.stringify({
      state,
      uiState,
      timestamp: Date.now()
    })
  }, [state, uiState])
  
  const importState = useCallback((stateString: string) => {
    try {
      const imported = JSON.parse(stateString)
      dispatch({ type: 'RESET_EXECUTION' })
    } catch (error) {
      console.error('Failed to import state:', error)
    }
  }, [])
  
  // Event System
  const addEventListener = useCallback((type: string, handler: Function) => {
    if (!eventListeners.current.has(type)) {
      eventListeners.current.set(type, [])
    }
    eventListeners.current.get(type)!.push(handler)
    
    return () => {
      const handlers = eventListeners.current.get(type)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }, [])
  
  const dispatchEvent = useCallback((event: BacktrackingEvent) => {
    const handlers = eventListeners.current.get(event.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    }
    
    dispatch({
      type: 'DISPATCH_EVENT',
      payload: event
    })
  }, [])
  
  // Advanced Features
  const enableComparison = useCallback((patterns: BacktrackingPattern[]) => {
    dispatchEvent({
      type: 'comparison-enabled',
      payload: { patterns },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const createCustomProblem = useCallback((problem: any) => {
    dispatchEvent({
      type: 'custom-problem-created',
      payload: { problem },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  const startTutorial = useCallback((tutorialId: string) => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { tutorialActive: true }
    })
    
    dispatchEvent({
      type: 'tutorial-started',
      payload: { tutorialId },
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  // Additional methods to match interface
  const toggleTreeView = useCallback(() => {
    dispatchEvent({
      type: 'tree-view-toggled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const toggleStackView = useCallback(() => {
    dispatchEvent({
      type: 'stack-view-toggled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const toggleConstraintsView = useCallback(() => {
    dispatchEvent({
      type: 'constraints-view-toggled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const togglePerformanceView = useCallback(() => {
    dispatchEvent({
      type: 'performance-view-toggled',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    return state.metrics
  }, [state.metrics])

  const exportExecutionData = useCallback(() => {
    return {
      state,
      uiState,
      timestamp: Date.now(),
      executionSteps: [], // Would contain actual execution steps
      metrics: state.metrics
    }
  }, [state, uiState])

  const importExecutionData = useCallback((data: any) => {
    try {
      dispatch({ type: 'RESET_EXECUTION' })
      // Additional import logic would go here
    } catch (error) {
      console.error('Failed to import execution data:', error)
    }
  }, [])

  const removeEventListener = useCallback((type: string, handler: (event: BacktrackingEvent) => void) => {
    const handlers = eventListeners.current.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }, [])

  // Utility Functions
  const getCurrentStep = useCallback((): ExecutionStep | null => {
    // Return current execution step or null
    return null // Placeholder implementation
  }, [])

  const getTotalSteps = useCallback((): number => {
    return state.totalSteps
  }, [state.totalSteps])

  const getProgressPercentage = useCallback((): number => {
    if (state.totalSteps === 0) return 0
    return (state.currentStep / state.totalSteps) * 100
  }, [state.currentStep, state.totalSteps])

  const isExecutionComplete = useCallback((): boolean => {
    return state.isCompleted
  }, [state.isCompleted])

  // UI State Management
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { sidebarCollapsed: collapsed }
    })
  }, [])

  const setActiveSection = useCallback((section: SectionType) => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { activeSection: section }
    })
  }, [])

  const setModalOpen = useCallback((modal: string | null) => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { modalOpen: modal }
    })
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { theme }
    })
  }, [])

  const nextTutorialStep = useCallback(() => {
    dispatchEvent({
      type: 'tutorial-next-step',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const previousTutorialStep = useCallback(() => {
    dispatchEvent({
      type: 'tutorial-previous-step',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])

  const exitTutorial = useCallback(() => {
    uiDispatch({
      type: 'UPDATE_UI_STATE',
      payload: { tutorialActive: false }
    })
    
    dispatchEvent({
      type: 'tutorial-exited',
      payload: null,
      timestamp: Date.now(),
      source: 'user'
    })
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (executionIntervalRef.current) {
        clearInterval(executionIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (algorithmWorkerRef.current) {
        algorithmWorkerRef.current.terminate()
      }
    }
  }, [])
  
  const contextValue: BacktrackingContextType = {
    state,
    uiState,
    config: initialConfig,
    
    startExecution,
    pauseExecution,
    resumeExecution,
    stepForward,
    stepBackward,
    resetExecution,
    setExecutionSpeed,
    
    changePattern,
    updatePatternParameters,
    
    selectNode,
    expandNode,
    collapseNode,
    highlightPath,
    
    makeManualChoice,
    enableManualMode,
    disableManualMode,
    requestHint,
    
    setVisualizationMode,
    toggleSection,
    setAnimationSpeed,
    toggleTreeView,
    toggleStackView,
    toggleConstraintsView,
    togglePerformanceView,
    
    getMetrics,
    getPerformanceMetrics,
    exportState,
    importState,
    exportExecutionData,
    importExecutionData,
    
    addEventListener,
    removeEventListener,
    dispatchEvent,
    dispatch,
    
    getCurrentStep,
    getTotalSteps,
    getProgressPercentage,
    isExecutionComplete,
    
    setSidebarCollapsed,
    setActiveSection,
    setModalOpen,
    setTheme,
    
    enableComparison,
    createCustomProblem,
    startTutorial,
    nextTutorialStep,
    previousTutorialStep,
    exitTutorial
  }
  
  return (
    <BacktrackingContext.Provider value={contextValue}>
      {children}
    </BacktrackingContext.Provider>
  )
}
