// Enhanced Algorithm Complexity Indicator Component
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Clock, TrendingUp, Zap } from 'lucide-react'

export interface ComplexityProps {
  timeComplexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)'
  spaceComplexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)'
  bestCase?: string
  averageCase?: string
  worstCase?: string
  isInteractive?: boolean
  showDetails?: boolean
}

const complexityConfig = {
  'O(1)': { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30', icon: Zap, rating: 5 },
  'O(log n)': { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30', icon: TrendingUp, rating: 4 },
  'O(n)': { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: Clock, rating: 3 },
  'O(n log n)': { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30', icon: TrendingUp, rating: 2 },
  'O(n²)': { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', icon: AlertTriangle, rating: 1 },
  'O(2ⁿ)': { color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30', icon: AlertCircle, rating: 0 }
}

export function ComplexityIndicator({ 
  timeComplexity, 
  spaceComplexity, 
  bestCase,
  averageCase,
  worstCase,
  isInteractive = false,
  showDetails = true 
}: ComplexityProps) {
  const timeConfig = complexityConfig[timeComplexity]
  const spaceConfig = complexityConfig[spaceComplexity]
  const TimeIcon = timeConfig.icon
  const SpaceIcon = spaceConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
    >
      <h4 className="font-bold text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-cyan-400" />
        Algorithm Complexity Analysis
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className={`p-4 rounded-lg border ${timeConfig.bg} ${timeConfig.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Time Complexity</span>
            <TimeIcon className={`w-5 h-5 ${timeConfig.color}`} />
          </div>
          <div className={`text-2xl font-bold ${timeConfig.color} mb-2`}>
            {timeComplexity}
          </div>
          {showDetails && (
            <div className="space-y-1 text-sm">
              {bestCase && <div className="text-green-300">Best: {bestCase}</div>}
              {averageCase && <div className="text-yellow-300">Average: {averageCase}</div>}
              {worstCase && <div className="text-red-300">Worst: {worstCase}</div>}
            </div>
          )}
          {/* Performance Rating */}
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-400 mr-2">Performance:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mr-1 ${
                    i < timeConfig.rating ? timeConfig.color.replace('text-', 'bg-') : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Space Complexity */}
        <div className={`p-4 rounded-lg border ${spaceConfig.bg} ${spaceConfig.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Space Complexity</span>
            <SpaceIcon className={`w-5 h-5 ${spaceConfig.color}`} />
          </div>
          <div className={`text-2xl font-bold ${spaceConfig.color} mb-2`}>
            {spaceComplexity}
          </div>
          {/* Performance Rating */}
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-400 mr-2">Memory:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mr-1 ${
                    i < spaceConfig.rating ? spaceConfig.color.replace('text-', 'bg-') : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complexity Comparison Chart */}
      {showDetails && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Relative Performance Scale (n=1000)</div>
          <div className="space-y-1">
            {Object.entries(complexityConfig).map(([complexity, config]) => {
              const isCurrentTime = complexity === timeComplexity
              const isCurrentSpace = complexity === spaceComplexity
              const width = Math.max(5, config.rating * 20)
              
              return (
                <div key={complexity} className="flex items-center">
                  <div className="w-16 text-xs text-gray-300">{complexity}</div>
                  <div className="flex-1 bg-gray-700/50 rounded-full h-2 relative">
                    <motion.div
                      className={`h-full rounded-full ${config.color.replace('text-', 'bg-')} ${
                        isCurrentTime || isCurrentSpace ? 'ring-2 ring-white/50' : ''
                      }`}
                      style={{ width: `${width}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    />
                  </div>
                  {(isCurrentTime || isCurrentSpace) && (
                    <span className="ml-2 text-xs text-cyan-400">
                      {isCurrentTime && isCurrentSpace ? 'Both' : isCurrentTime ? 'Time' : 'Space'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
