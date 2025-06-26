'use client'

import { motion } from 'framer-motion'
import { BookOpen, Lightbulb } from 'lucide-react'

export default function PatternsSection() {
  const advancedVariations = [
    {
      title: "🔍 Multiple Solutions",
      description: "Find ALL pairs that sum to target",
      complexity: "O(n) time, O(n) space",
      difficulty: "Medium",
      color: "blue",
      useCase: "When you need all possible combinations"
    },
    {
      title: "🎯 Closest Two Sum",
      description: "Find pair with sum closest to target",
      complexity: "O(n log n) time, O(1) space",
      difficulty: "Medium",
      color: "green",
      useCase: "Optimization problems, approximate solutions"
    },
    {
      title: "🔄 Two Sum in Circular Array",
      description: "Array wraps around (last connects to first)",
      complexity: "O(n) time, O(n) space",
      difficulty: "Hard",
      color: "purple",
      useCase: "Circular data structures, ring buffers"
    },
    {
      title: "📏 Two Sum with Max Distance",
      description: "Indices must be within max distance",
      complexity: "O(n) time, O(k) space",
      difficulty: "Hard",
      color: "red",
      useCase: "Constraint-based problems, sliding window"
    }
  ]

  const relatedPatterns = [
    {
      title: "🎯 Three Sum",
      description: "Fix one element, use two pointers for the rest",
      complexity: "O(n²) time",
      color: "blue",
      difficulty: "Medium"
    },
    {
      title: "🏺 Container With Most Water",
      description: "Find maximum area between two walls",
      complexity: "O(n) time",
      color: "green",
      difficulty: "Medium"
    },
    {
      title: "🌊 Trapping Rain Water",
      description: "Calculate trapped water between heights",
      complexity: "O(n) time",
      color: "purple",
      difficulty: "Hard"
    },
    {
      title: "🔍 Four Sum",
      description: "Find quadruplets that sum to target",
      complexity: "O(n³) time",
      color: "orange",
      difficulty: "Medium"
    }
  ]

  const interviewFollowUps = [
    {
      question: "What if the array is sorted?",
      answer: "Use two pointers for O(1) space instead of O(n)",
      color: "blue"
    },
    {
      question: "What if we need all pairs?",
      answer: "Modify to store multiple indices per value",
      color: "green"
    },
    {
      question: "What about duplicates?",
      answer: "Hash map stores lists of indices instead of single index",
      color: "purple"
    },
    {
      question: "Space complexity too high?",
      answer: "If we can sort, use two pointers for O(1) space",
      color: "red"
    },
    {
      question: "What if target changes frequently?",
      answer: "Preprocess into sorted array with original indices",
      color: "orange"
    }
  ]

  const learningSteps = [
    {
      title: "Three Sum",
      description: "Master Three Sum for triplet problems",
      color: "blue-400"
    },
    {
      title: "Sliding Window",
      description: "Learn Sliding Window for substring problems",
      color: "green-400"
    },
    {
      title: "Fast & Slow Pointers",
      description: "Practice Fast & Slow Pointers for cycle detection",
      color: "purple-400"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Advanced Variations Section */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <BookOpen className="w-7 h-7 mr-3 text-pink-400" />
          🧠 Advanced Variations & Follow-ups
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {advancedVariations.map((variation, index) => (
            <div key={index} className={`bg-gradient-to-br from-${variation.color}-900/50 to-${variation.color}-800/50 rounded-xl p-6 border border-${variation.color}-400/30`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className={`text-lg font-bold text-${variation.color}-400`}>{variation.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full bg-${variation.color}-900/50 text-${variation.color}-300`}>
                  {variation.difficulty}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{variation.description}</p>
              <div className="space-y-2">
                <div className={`text-xs font-mono text-${variation.color}-300`}>{variation.complexity}</div>
                <div className="text-xs text-gray-400">
                  <strong>Use Case:</strong> {variation.useCase}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interview Follow-ups */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-6 border border-cyan-400/30 mb-6">
          <h4 className="text-xl font-bold text-cyan-400 mb-4">❓ Common Interview Follow-ups</h4>
          <div className="space-y-3">
            {interviewFollowUps.map((followUp, index) => (
              <div key={index} className={`border-l-4 border-${followUp.color}-400 pl-4 bg-black/20 rounded-r-lg p-3`}>
                <div className={`font-bold text-${followUp.color}-300 mb-1`}>
                  📝 INTERVIEWER: "{followUp.question}"
                </div>
                <div className="text-green-300">
                  🎯 YOUR ANSWER: "{followUp.answer}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Patterns Section */}
      <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Lightbulb className="w-7 h-7 mr-3 text-cyan-400" />
          🌟 Related Patterns to Master
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPatterns.map((pattern, index) => (
            <div key={index} className={`bg-gradient-to-br from-${pattern.color}-900/50 to-${pattern.color}-800/50 rounded-xl p-6 border border-${pattern.color}-400/30`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className={`text-lg font-bold text-${pattern.color}-400`}>{pattern.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full bg-${pattern.color}-900/50 text-${pattern.color}-300`}>
                  {pattern.difficulty}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
              <div className={`text-xs font-mono text-${pattern.color}-300`}>{pattern.complexity}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Patterns Overview Card */}
      <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-2xl p-8 border border-green-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <BookOpen className="w-7 h-7 mr-3 text-teal-400" />
          🔗 Exploring Related Patterns
        </h3>
        <div className="space-y-4">
          <p className="text-blue-200 leading-relaxed">
            The Two Pointers pattern is widely applicable! 
            Let's explore some related patterns that use similar principles.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPatterns.map((pattern, index) => (
              <div key={index} className={`bg-gradient-to-br from-${pattern.color}-900/50 to-${pattern.color}-800/50 rounded-xl p-6 border border-${pattern.color}-400/30`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`text-lg font-bold text-${pattern.color}-400`}>{pattern.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${pattern.color}-900/50 text-${pattern.color}-300`}>
                    {pattern.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
                <div className={`text-xs font-mono text-${pattern.color}-300`}>{pattern.complexity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps in Learning */}
      <div className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 rounded-2xl p-8 border border-gray-600/50">
        <h4 className="text-lg font-bold text-white mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          🎓 Next Steps in Your Learning Journey
        </h4>
        <ul className="space-y-2 text-gray-300">
          {learningSteps.map((step, index) => (
            <li key={index} className="flex items-center">
              <span className={`text-${step.color} mr-3`}>→</span>
              <span>Master <strong className="text-white">{step.title}</strong> {step.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
