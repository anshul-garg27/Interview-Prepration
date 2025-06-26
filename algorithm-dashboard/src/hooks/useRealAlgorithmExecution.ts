// Real-Time Algorithm Execution Hook
// /src/hooks/useRealAlgorithmExecution.ts

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ExecutionResult {
  algorithmName: string
  executionTime: number
  memoryUsage: number
  cpuUsage: number
  result: any
  inputSize: number
  timestamp: number
  complexityAnalysis: {
    estimatedTimeComplexity: string
    estimatedSpaceComplexity: string
    confidence: number
  }
}

interface BenchmarkResult {
  inputSize: number
  executionTime: number
  memoryUsage: number
  complexityFit: {
    bestFit: string
    rSquared: number
  }
}

export function useRealAlgorithmExecution() {
  const [isConnected, setIsConnected] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([])
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Connect to WebSocket server
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket('ws://localhost:8080')
      
      ws.onopen = () => {
        console.log('🚀 Connected to Algorithm Execution Server')
        setIsConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      ws.onclose = () => {
        console.log('❌ Disconnected from Algorithm Execution Server')
        setIsConnected(false)
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...')
          connect()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Failed to connect to execution server')
      }

      wsRef.current = ws
    } catch (e) {
      console.error('Failed to create WebSocket connection:', e)
      setError('Failed to connect to execution server')
    }
  }, [])

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    // 🚀 NEW: Log what data we received from backend
    console.log('📥 RECEIVED FROM BACKEND:', {
      type: data.type,
      sessionId: data.sessionId || 'N/A',
      timestamp: data.timestamp || 'N/A',
      hasResult: !!data.result,
      hasError: !!data.error,
      allKeys: Object.keys(data)
    })
    
    // Log detailed data based on message type
    switch (data.type) {
      case 'EXECUTION_STARTED':
        console.log('🎬 EXECUTION_STARTED:', {
          sessionId: data.sessionId,
          algorithmName: data.algorithmName,
          timestamp: data.timestamp
        })
        setIsExecuting(true)
        setCurrentSession(data.sessionId)
        setError(null)
        break

      case 'EXECUTION_STEP':
        console.log('⚡ EXECUTION_STEP:', {
          performanceMetrics: data.performanceMetrics,
          result: data.result,
          complexityAnalysis: data.complexityAnalysis,
          inputSize: data.inputSize
        })
        const result: ExecutionResult = {
          algorithmName: data.algorithmName || 'unknown',
          executionTime: data.performanceMetrics.executionTime,
          memoryUsage: data.performanceMetrics.memoryUsage,
          cpuUsage: data.performanceMetrics.cpuUsage,
          result: data.result,
          inputSize: data.inputSize || 0,
          timestamp: data.timestamp,
          complexityAnalysis: data.complexityAnalysis || {
            estimatedTimeComplexity: 'Unknown',
            estimatedSpaceComplexity: 'Unknown',
            confidence: 0
          }
        }
        setExecutionResults(prev => [...prev, result])
        break

      case 'EXECUTION_COMPLETED':
        console.log('✅ EXECUTION_COMPLETED:', {
          sessionId: data.sessionId,
          finalResult: data.finalResult,
          timestamp: data.timestamp
        })
        setIsExecuting(false)
        setCurrentSession(null)
        console.log('✅ Algorithm execution completed')
        break

      case 'BENCHMARK_PROGRESS':
        console.log('📊 BENCHMARK_PROGRESS:', {
          currentSize: data.currentSize,
          totalSizes: data.totalSizes,
          result: data.result,
          progress: `${data.currentSize}/${data.totalSizes || '?'}`
        })
        
        // 🚀 FIXED: Handle data structure properly
        const benchmarkPoint: BenchmarkResult = {
          inputSize: data.result.inputSize,
          executionTime: data.result.executionTime,
          memoryUsage: data.result.memoryUsage,
          complexityFit: {
            // Handle both old and new data structures
            bestFit: data.result.complexityFit?.timeComplexity || 
                     data.result.complexityFit?.bestFit || 
                     'O(n)',
            rSquared: data.result.complexityFit?.confidence || 
                     data.result.complexityFit?.rSquared || 
                     0.8
          }
        }
        setBenchmarkResults(prev => [...prev, benchmarkPoint])
        break

      case 'BENCHMARK_COMPLETED':
        console.log('🏁 BENCHMARK_COMPLETED:', {
          sessionId: data.sessionId,
          resultsCount: data.results?.length || 0,
          results: data.results,
          timestamp: data.timestamp
        })
        setIsExecuting(false)
        setBenchmarkResults(data.results)
        console.log('📊 Performance benchmark completed')
        break

      case 'EXECUTION_ERROR':
      case 'BENCHMARK_ERROR':
        console.error('❌ ERROR RECEIVED:', {
          type: data.type,
          sessionId: data.sessionId,
          error: data.error,
          timestamp: data.timestamp
        })
        setIsExecuting(false)
        setError(data.error)
        console.error('Execution error:', data.error)
        break

      default:
        console.warn('❓ UNKNOWN MESSAGE TYPE:', {
          type: data.type,
          fullData: data
        })
        console.log('Unknown message type:', data.type)
    }
  }

  // Execute algorithm with real performance measurement
  const executeAlgorithm = useCallback(async (
    algorithmCode: string,
    testData: any,
    algorithmName: string = 'unknown'
  ) => {
    if (!wsRef.current || !isConnected) {
      setError('Not connected to execution server')
      return
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Clear previous results
    setExecutionResults([])
    setError(null)

    // 🚀 NEW: Log what data we're sending
    const requestData = {
      type: 'EXECUTE_ALGORITHM',
      sessionId,
      algorithmCode,
      testData,
      algorithmName
    }
    
    console.log('📤 SENDING TO BACKEND:', {
      type: requestData.type,
      sessionId: requestData.sessionId,
      algorithmName: requestData.algorithmName,
      testData: requestData.testData,
      algorithmCode: requestData.algorithmCode.substring(0, 100) + '...' // Show first 100 chars
    })

    // Send execution request
    wsRef.current.send(JSON.stringify(requestData))
  }, [isConnected])

  // Run performance benchmark across multiple input sizes
  const runPerformanceBenchmark = useCallback(async (
    algorithmCode: string,
    algorithmName: string = 'unknown'
  ) => {
    if (!wsRef.current || !isConnected) {
      setError('Not connected to execution server')
      return
    }

    const sessionId = `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Clear previous benchmark results
    setBenchmarkResults([])
    setError(null)

    // 🚀 NEW: Log what benchmark data we're sending
    const benchmarkData = {
      type: 'PERFORMANCE_BENCHMARK',
      sessionId,
      algorithmCode,
      algorithmName
    }
    
    console.log('📊 SENDING BENCHMARK REQUEST:', {
      type: benchmarkData.type,
      sessionId: benchmarkData.sessionId,
      algorithmName: benchmarkData.algorithmName,
      algorithmCodePreview: benchmarkData.algorithmCode.substring(0, 150) + '...'
    })

    // Send benchmark request
    wsRef.current.send(JSON.stringify(benchmarkData))
  }, [isConnected])

  // Connect on mount
  useEffect(() => {
    connect()
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  // Get latest execution result
  const latestResult = executionResults.length > 0 
    ? executionResults[executionResults.length - 1] 
    : null

  // Calculate performance trends
  const performanceTrends = {
    // For benchmark data, use benchmarkResults
    executionTimeAvg: benchmarkResults.length > 0 
      ? benchmarkResults.reduce((sum, r) => sum + r.executionTime, 0) / benchmarkResults.length
      : executionResults.length > 0 
        ? executionResults.reduce((sum, r) => sum + r.executionTime, 0) / executionResults.length
        : 0,
    
    memoryUsageAvg: benchmarkResults.length > 0
      ? benchmarkResults.reduce((sum, r) => sum + r.memoryUsage, 0) / benchmarkResults.length
      : executionResults.length > 0
        ? executionResults.reduce((sum, r) => sum + r.memoryUsage, 0) / executionResults.length
        : 0,
        
    complexityConfidence: latestResult?.complexityAnalysis.confidence || 0
  }

  return {
    // Connection state
    isConnected,
    isExecuting,
    error,
    currentSession,

    // Execution functions
    executeAlgorithm,
    runPerformanceBenchmark,
    connect,

    // Results
    executionResults,
    benchmarkResults,
    latestResult,
    performanceTrends,

    // Utilities
    clearResults: () => {
      setExecutionResults([])
      setBenchmarkResults([])
      setError(null)
    }
  }
}
