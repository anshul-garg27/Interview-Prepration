// Real-Time Performance Analytics with Live Data
// /src/components/RealTimePerformanceAnalytics.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, HardDrive, Clock, Zap, PlayCircle } from 'lucide-react'

interface LivePerformanceData {
  executionTime: number
  memoryUsage: number
  cpuUsage: number
  stepCount: number
  complexityFit: {
    timeComplexity: string
    spaceComplexity: string
    rSquared: number
  }
  timestamp: number
}

interface AlgorithmExecution {
  algorithmName: string
  inputSize: number
  currentStep: number
  totalSteps: number
  isRunning: boolean
  performanceHistory: LivePerformanceData[]
}

export function RealTimePerformanceAnalytics({ algorithmName }: { algorithmName: string }) {
  const [execution, setExecution] = useState<AlgorithmExecution | null>(null)
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null)
  const [performanceComparison, setPerformanceComparison] = useState<any[]>([])
  const chartRef = useRef<HTMLCanvasElement>(null)

  // WebSocket connection for real-time data
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/performance-stream')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'EXECUTION_STEP') {
        updateExecutionData(data)
      } else if (data.type === 'PERFORMANCE_COMPARISON') {
        setPerformanceComparison(data.algorithms)
      }
    }

    ws.onopen = () => {
      console.log('Connected to performance stream')
      setWsConnection(ws)
    }

    return () => {
      ws.close()
    }
  }, [])

  const executeAlgorithm = async (inputData: any[], algorithmCode: string) => {
    if (!wsConnection) return

    // Send execution request to backend
    wsConnection.send(JSON.stringify({
      type: 'EXECUTE_ALGORITHM',
      algorithmName,
      algorithmCode,
      inputData,
      performanceTracking: true
    }))

    setExecution({
      algorithmName,
      inputSize: inputData.length,
      currentStep: 0,
      totalSteps: inputData.length,
      isRunning: true,
      performanceHistory: []
    })
  }

  const updateExecutionData = (data: any) => {
    setExecution(prev => {
      if (!prev) return null
      
      const newPerformanceData: LivePerformanceData = {
        executionTime: data.performanceMetrics.executionTime,
        memoryUsage: data.performanceMetrics.memoryUsage,
        cpuUsage: data.performanceMetrics.cpuUsage,
        stepCount: data.step,
        complexityFit: data.complexityAnalysis,
        timestamp: data.timestamp
      }

      return {
        ...prev,
        currentStep: data.step,
        isRunning: data.step < prev.totalSteps,
        performanceHistory: [...prev.performanceHistory, newPerformanceData]
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Execution Status */}
      <AnimatePresence>
        {execution?.isRunning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-400/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-400 flex items-center">
                <Activity className="w-6 h-6 mr-2" />
                Live Algorithm Execution
              </h3>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"
                />
                <span className="text-green-300">Running...</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-green-300 mb-2">
                <span>Step {execution.currentStep} of {execution.totalSteps}</span>
                <span>{Math.round((execution.currentStep / execution.totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(execution.currentStep / execution.totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Real-Time Metrics */}
            {execution.performanceHistory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RealTimeMetric
                  icon={Clock}
                  label="Execution Time"
                  value={`${execution.performanceHistory[execution.performanceHistory.length - 1].executionTime.toFixed(4)}ms`}
                  trend="up"
                  color="blue"
                />
                <RealTimeMetric
                  icon={HardDrive}
                  label="Memory Usage"
                  value={`${execution.performanceHistory[execution.performanceHistory.length - 1].memoryUsage.toFixed(2)}MB`}
                  trend="stable"
                  color="purple"
                />
                <RealTimeMetric
                  icon={Cpu}
                  label="CPU Usage"
                  value={`${execution.performanceHistory[execution.performanceHistory.length - 1].cpuUsage.toFixed(1)}%`}
                  trend="down"
                  color="yellow"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Comparison Dashboard */}
      <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/50 rounded-xl p-6 border border-slate-400/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-400" />
          Algorithm Performance Comparison
        </h3>

        {performanceComparison.length > 0 ? (
          <div className="space-y-4">
            {performanceComparison.map((algo, index) => (
              <AlgorithmComparisonCard key={index} algorithm={algo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PlayCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400">Run algorithms to see performance comparison</p>
          </div>
        )}
      </div>

      {/* Live Performance Chart */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-400/30">
        <h3 className="text-xl font-bold text-white mb-4">Live Performance Graph</h3>
        <canvas ref={chartRef} width={800} height={400} className="w-full" />
      </div>
    </div>
  )
}

function RealTimeMetric({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: any
  label: string
  value: string
  trend: 'up' | 'down' | 'stable'
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500'
  }

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-20 rounded-lg p-4 border border-white/20`}>
      <div className="flex items-center justify-between">
        <Icon className="w-8 h-8 text-white" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-right"
        >
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-300">{label}</div>
        </motion.div>
      </div>
    </div>
  )
}

function AlgorithmComparisonCard({ algorithm }: { algorithm: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/30 rounded-lg p-4 border border-white/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white">{algorithm.name}</h4>
          <p className="text-sm text-gray-400">{algorithm.timeComplexity} time, {algorithm.spaceComplexity} space</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{algorithm.executionTime}ms</div>
          <div className="text-sm text-gray-400">{algorithm.memoryUsage}MB</div>
        </div>
      </div>
      
      {/* Performance Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            style={{ width: `${algorithm.performanceScore}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
