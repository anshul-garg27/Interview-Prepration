// 📚 Advanced Recursion Stack Visualizer Component
// Real-time stack frame visualization with call stack tracking

'use client'

import React, { useEffect, useState } from 'react'
import { ExecutionStep } from '../types/BacktrackingTypes'

interface StackFrame {
  id: string
  functionName: string
  parameters: Record<string, any>
  localVariables: Record<string, any>
  depth: number
  isActive: boolean
  isReturning: boolean
  returnValue?: any
  executionTime?: number
  memoryUsage?: number
}

interface RecursionStackVisualizerProps {
  executionSteps: ExecutionStep[]
  currentStep: number
  maxFramesToShow?: number
  showMemoryUsage?: boolean
  showTimings?: boolean
  animationSpeed?: 'slow' | 'medium' | 'fast'
  onFrameClick?: (frame: StackFrame) => void
  className?: string
}

export const RecursionStackVisualizer: React.FC<RecursionStackVisualizerProps> = ({
  executionSteps,
  currentStep,
  maxFramesToShow = 10,
  showMemoryUsage = true,
  showTimings = true,
  animationSpeed = 'medium',
  onFrameClick,
  className = ''
}) => {
  const [stackFrames, setStackFrames] = useState<StackFrame[]>([])
  const [animatingFrames, setAnimatingFrames] = useState<Set<string>>(new Set())

  // Animation timing
  const animationDuration = {
    slow: 800,
    medium: 400,
    fast: 200
  }[animationSpeed]

  // Build stack frames from execution steps
  useEffect(() => {
    const frames = buildStackFrames(executionSteps, currentStep)
    
    // Animate frame changes
    const previousFrameIds = new Set(stackFrames.map(f => f.id))
    const currentFrameIds = new Set(frames.map(f => f.id))
    
    // Find new frames to animate in
    const newFrames = frames.filter(f => !previousFrameIds.has(f.id))
    if (newFrames.length > 0) {
      const newFrameIds = new Set(newFrames.map(f => f.id))
      setAnimatingFrames(newFrameIds)
      
      setTimeout(() => {
        setAnimatingFrames(new Set())
      }, animationDuration)
    }
    
    setStackFrames(frames)
  }, [executionSteps, currentStep, animationDuration])

  const visibleFrames = stackFrames.slice(-maxFramesToShow)

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900">Recursion Stack</h3>
          </div>
          <div className="text-sm text-gray-600">
            {stackFrames.length} frame{stackFrames.length !== 1 ? 's' : ''} • Depth: {stackFrames.length}
          </div>
        </div>
        
        {/* Stack metrics */}
        <div className="mt-2 flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Max Depth:</span>
            <span className="font-medium">{getMaxStackDepth(executionSteps)}</span>
          </div>
          {showMemoryUsage && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Memory:</span>
              <span className="font-medium">{getTotalMemoryUsage(stackFrames)} KB</span>
            </div>
          )}
          {showTimings && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Total Time:</span>
              <span className="font-medium">{getTotalExecutionTime(stackFrames)} ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Stack visualization */}
      <div className="p-4">
        {stackFrames.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>No active stack frames</p>
            <p className="text-sm mt-1">Start execution to see the call stack</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Stack grows upward - show frames in reverse order */}
            {visibleFrames.reverse().map((frame, index) => (
              <StackFrameComponent
                key={frame.id}
                frame={frame}
                index={visibleFrames.length - 1 - index}
                isAnimating={animatingFrames.has(frame.id)}
                showMemoryUsage={showMemoryUsage}
                showTimings={showTimings}
                onClick={() => onFrameClick?.(frame)}
              />
            ))}
            
            {/* Stack overflow indicator */}
            {stackFrames.length > maxFramesToShow && (
              <div className="text-center py-2 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded">
                ... {stackFrames.length - maxFramesToShow} more frame{stackFrames.length - maxFramesToShow !== 1 ? 's' : ''} below
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stack growth direction indicator */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Stack grows</span>
          <div className="flex flex-col items-center">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-gray-400"></div>
            <div className="w-px h-4 bg-gray-400"></div>
          </div>
          <span>upward</span>
        </div>
      </div>
    </div>
  )
}

// Individual stack frame component
interface StackFrameComponentProps {
  frame: StackFrame
  index: number
  isAnimating: boolean
  showMemoryUsage: boolean
  showTimings: boolean
  onClick: () => void
}

const StackFrameComponent: React.FC<StackFrameComponentProps> = ({
  frame,
  index,
  isAnimating,
  showMemoryUsage,
  showTimings,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Frame styling based on state
  const getFrameStyle = () => {
    let baseStyle = "border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 "
    
    if (frame.isActive) {
      baseStyle += "border-blue-400 bg-blue-50 shadow-md "
    } else if (frame.isReturning) {
      baseStyle += "border-green-400 bg-green-50 shadow-md "
    } else {
      baseStyle += "border-gray-300 bg-gray-50 hover:bg-gray-100 "
    }
    
    if (isAnimating) {
      baseStyle += "animate-pulse scale-105 "
    }
    
    return baseStyle
  }

  return (
    <div 
      className={getFrameStyle()}
      onClick={() => {
        onClick()
        setIsExpanded(!isExpanded)
      }}
      style={{
        marginLeft: `${frame.depth * 8}px`,
        zIndex: 100 - index
      }}
    >
      {/* Frame header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Frame icon */}
          <div className={`w-3 h-3 rounded-full ${
            frame.isActive ? 'bg-blue-500' : 
            frame.isReturning ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          
          {/* Function name and parameters */}
          <div className="font-mono text-sm">
            <span className="font-semibold text-gray-900">{frame.functionName}</span>
            <span className="text-gray-600">
              ({formatParameters(frame.parameters)})
            </span>
          </div>
        </div>

        {/* Frame controls */}
        <div className="flex items-center gap-2">
          {/* Timing info */}
          {showTimings && frame.executionTime && (
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
              {frame.executionTime}ms
            </span>
          )}
          
          {/* Memory usage */}
          {showMemoryUsage && frame.memoryUsage && (
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
              {frame.memoryUsage}KB
            </span>
          )}
          
          {/* Expand/collapse */}
          <button className="text-gray-400 hover:text-gray-600">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Expanded frame details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {/* Local variables */}
          {Object.keys(frame.localVariables).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Local Variables:</div>
              <div className="bg-white rounded p-2 text-xs font-mono">
                {Object.entries(frame.localVariables).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-purple-600">{key}:</span>
                    <span className="text-gray-800">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return value */}
          {frame.returnValue !== undefined && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Return Value:</div>
              <div className="bg-green-100 rounded p-2 text-xs font-mono text-green-800">
                {formatValue(frame.returnValue)}
              </div>
            </div>
          )}

          {/* Frame metadata */}
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Depth: {frame.depth}</span>
            <span>ID: {frame.id.slice(0, 8)}...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Utility functions
function buildStackFrames(steps: ExecutionStep[], currentStep: number): StackFrame[] {
  const frames: StackFrame[] = []
  const frameStack: Map<number, StackFrame> = new Map()

  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const step = steps[i]
    
    // Create or update frame based on step
    if (step.type === 'choice' || step.type === 'backtrack') {
      const frameId = `frame-${step.depth}-${i}`
      
      if (!frameStack.has(step.depth)) {
        // New frame
        const frame: StackFrame = {
          id: frameId,
          functionName: inferFunctionName(step),
          parameters: extractParameters(step),
          localVariables: extractLocalVariables(step),
          depth: step.depth,
          isActive: i === currentStep,
          isReturning: step.type === 'backtrack',
          executionTime: Math.random() * 10 + 5, // Simulated
          memoryUsage: Math.random() * 20 + 10 // Simulated
        }
        
        frameStack.set(step.depth, frame)
      } else {
        // Update existing frame
        const frame = frameStack.get(step.depth)!
        frame.isActive = i === currentStep
        frame.isReturning = step.type === 'backtrack'
        frame.localVariables = { ...frame.localVariables, ...extractLocalVariables(step) }
      }
    }
    
    // Remove frames when backtracking
    if (step.type === 'backtrack') {
      // Remove frames deeper than current depth
      const keysToRemove = Array.from(frameStack.keys()).filter(depth => depth > step.depth)
      keysToRemove.forEach(key => frameStack.delete(key))
    }
  }

  return Array.from(frameStack.values()).sort((a, b) => a.depth - b.depth)
}

function inferFunctionName(step: ExecutionStep): string {
  // Infer function name from step context
  if (step.description.includes('permutation')) return 'generatePermutations'
  if (step.description.includes('combination')) return 'generateCombinations'
  if (step.description.includes('subset')) return 'generateSubsets'
  if (step.description.includes('queen')) return 'solveNQueens'
  if (step.description.includes('word')) return 'searchWord'
  return 'backtrack'
}

function extractParameters(step: ExecutionStep): Record<string, any> {
  return {
    depth: step.depth,
    currentPath: step.currentPath.slice(0, 3), // Truncate for display
    choices: step.availableChoices?.length || 0
  }
}

function extractLocalVariables(step: ExecutionStep): Record<string, any> {
  const vars: Record<string, any> = {
    pathLength: step.currentPath.length
  }
  
  if (step.choiceMade !== undefined) {
    vars.choice = step.choiceMade
  }
  
  if (step.constraints && step.constraints.length > 0) {
    vars.constraintViolations = step.constraints.filter(c => c.isViolated).length
  }
  
  return vars
}

function formatParameters(params: Record<string, any>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(', ')
    .slice(0, 40) + (JSON.stringify(params).length > 40 ? '...' : '')
}

function formatValue(value: any): string {
  if (Array.isArray(value)) {
    return `[${value.slice(0, 3).join(', ')}${value.length > 3 ? '...' : ''}]`
  }
  if (typeof value === 'object' && value !== null) {
    return `{${Object.keys(value).length} props}`
  }
  return String(value)
}

function getMaxStackDepth(steps: ExecutionStep[]): number {
  return Math.max(...steps.map(s => s.depth), 0)
}

function getTotalMemoryUsage(frames: StackFrame[]): number {
  return Math.round(frames.reduce((sum, frame) => sum + (frame.memoryUsage || 0), 0))
}

function getTotalExecutionTime(frames: StackFrame[]): number {
  return Math.round(frames.reduce((sum, frame) => sum + (frame.executionTime || 0), 0))
}

export default RecursionStackVisualizer
