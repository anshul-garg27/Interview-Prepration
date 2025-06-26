// Array Algorithms Main Page - Overview of all array patterns
'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  GitBranch,
  Layers,
  Play,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

const arrayPatterns = [
  {
    id: 'two-sum',
    title: 'Two Sum (Sorted Array)',
    icon: Target,
    description: 'Find pairs with specific sum using two pointers technique',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    color: 'from-blue-500 to-cyan-600',
    href: '/arrays/two-sum'
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    icon: Layers,
    description: 'Maximize area between two walls using greedy two pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    color: 'from-green-500 to-teal-600',
    href: '/arrays/container-water'
  },
  {
    id: 'three-sum',
    title: 'Three Sum',
    icon: GitBranch,
    description: 'Find triplets that sum to target, handling duplicates',
    difficulty: 'Medium',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    color: 'from-purple-500 to-indigo-600',
    href: '/arrays/three-sum'
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    icon: Zap,
    description: 'Dynamic window techniques for subarray problems',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    color: 'from-orange-500 to-red-600',
    href: '/arrays/sliding-window'
  }
]

export default function ArraysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-b border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Arrays & Two Pointers Mastery
                </h1>
                <p className="text-blue-200 mt-1">
                  Interactive visualizations from your complete study guide
                </p>
              </div>
            </div>
            
            <Link 
              href="/"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction from your markdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            🎯 Arrays & Two Pointers - Complete Mastery Guide
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-blue-200 mb-6">
              Master the art of array manipulation with the powerful two pointers technique. 
              From your comprehensive study guide to interactive visualizations.
            </p>
            
            {/* Core concept from your markdown */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-400/30">
              <h3 className="text-xl font-bold text-white mb-4">🧠 The Core Concept</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-200">
                <div>
                  <h4 className="font-semibold text-white mb-2">Real-World Analogy:</h4>
                  <p className="text-sm">
                    Like searching for two books in a library. Instead of checking every book 
                    with every other book (slow!), start from both ends and walk toward center (fast!).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">The Magic:</h4>
                  <p className="text-sm">
                    Sorted array gives us ordering information. If sum is too small → move left right. 
                    If sum is too big → move right left.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pattern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {arrayPatterns.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={pattern.href} className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pattern.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${pattern.color}`}>
                          <pattern.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {pattern.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                            pattern.difficulty === 'Easy' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {pattern.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-blue-200 text-lg mb-6 leading-relaxed">
                      {pattern.description}
                    </p>
                    
                    {/* Complexity info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-300 text-sm font-semibold">Time Complexity</div>
                        <div className="text-white font-bold">{pattern.timeComplexity}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-300 text-sm font-semibold">Space Complexity</div>
                        <div className="text-white font-bold">{pattern.spaceComplexity}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-white font-semibold group-hover:text-blue-300 transition-colors">
                      <Play className="w-5 h-5 mr-2" />
                      Interactive Visualization
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* When to use Two Pointers - from your markdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-400/30 mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6">🚀 When to Use Two Pointers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-green-400 font-semibold mb-4 flex items-center">
                ✅ Perfect For:
              </h4>
              <ul className="text-green-200 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Array is sorted (or can be sorted)
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Looking for pairs/triplets with specific sum
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Need O(1) extra space
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Finding palindromes
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Want to reverse or partition array
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-4 flex items-center">
                ❌ Not Suitable For:
              </h4>
              <ul className="text-red-200 space-y-2">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Array is unsorted and can't be sorted
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Need to maintain original indices
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Looking for single elements
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Order of operations matters
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Study Materials Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              📚 Complete Study Guide
            </h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              All interactive visualizations are based on your comprehensive 
              Arrays & Two Pointers markdown file with detailed explanations, 
              step-by-step traces, and real-world analogies.
            </p>
            <div className="flex justify-center space-x-4">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg">
                25+ Examples
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg">
                Visual Traces
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg">
                Complete Implementations
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
