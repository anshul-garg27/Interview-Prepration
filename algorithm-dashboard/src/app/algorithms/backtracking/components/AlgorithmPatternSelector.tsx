// 🎮 Advanced Algorithm Pattern Selector Component
// Interactive pattern selection with previews and difficulty indicators

'use client'

import React, { useEffect, useState } from 'react'
import { BacktrackingPattern } from '../types/BacktrackingTypes'

interface PatternInfo {
  id: BacktrackingPattern
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  timeComplexity: string
  spaceComplexity: string
  realWorldUses: string[]
  keyInsights: string[]
  prerequisites: string[]
  estimatedTime: string
  icon: string
  color: string
  popularityScore: number
  interviewFrequency: 'low' | 'medium' | 'high' | 'very-high'
}

interface AlgorithmPatternSelectorProps {
  selectedPattern?: BacktrackingPattern
  onPatternSelect: (pattern: BacktrackingPattern) => void
  onPatternPreview?: (pattern: BacktrackingPattern | null) => void
  showDifficulty?: boolean
  showComplexity?: boolean
  showPrerequisites?: boolean
  filterByDifficulty?: PatternInfo['difficulty'][]
  className?: string
}

const patternData: PatternInfo[] = [
  {
    id: 'permutations',
    name: 'Permutations',
    description: 'Generate all possible arrangements of elements where order matters',
    difficulty: 'beginner',
    timeComplexity: 'O(n! × n)',
    spaceComplexity: 'O(n)',
    realWorldUses: [
      'Password generation',
      'Task scheduling',
      'Route optimization',
      'Cryptography'
    ],
    keyInsights: [
      'Order matters (ABC ≠ BCA)',
      'Each position has decreasing choices',
      'Swap-based optimization available',
      'Duplicate handling is crucial'
    ],
    prerequisites: ['Basic recursion', 'Array manipulation'],
    estimatedTime: '15-20 minutes',
    icon: '🔄',
    color: 'from-blue-400 to-blue-600',
    popularityScore: 85,
    interviewFrequency: 'very-high'
  },
  {
    id: 'combinations',
    name: 'Combinations',
    description: 'Select groups of elements where order does not matter',
    difficulty: 'beginner',
    timeComplexity: 'O(C(n,k))',
    spaceComplexity: 'O(k)',
    realWorldUses: [
      'Team formation',
      'Investment portfolios',
      'Feature selection',
      'Menu planning'
    ],
    keyInsights: [
      'Order doesn\'t matter (ABC = BCA)',
      'Choose k from n elements',
      'Pascal\'s triangle relationship',
      'Start index prevents duplicates'
    ],
    prerequisites: ['Basic recursion', 'Mathematical combinations'],
    estimatedTime: '10-15 minutes',
    icon: '🎯',
    color: 'from-green-400 to-green-600',
    popularityScore: 80,
    interviewFrequency: 'high'
  },
  {
    id: 'subsets',
    name: 'Subsets (Power Set)',
    description: 'Generate all possible subsets including empty set',
    difficulty: 'intermediate',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n × 2^n)',
    realWorldUses: [
      'Feature engineering',
      'Set theory problems',
      'Dynamic programming optimization',
      'Boolean satisfiability'
    ],
    keyInsights: [
      'Every element: include or exclude',
      'Total subsets = 2^n',
      'Empty set is valid subset',
      'Bit manipulation alternative'
    ],
    prerequisites: ['Recursion', 'Binary thinking', 'Set theory'],
    estimatedTime: '15-25 minutes',
    icon: '🎲',
    color: 'from-purple-400 to-purple-600',
    popularityScore: 75,
    interviewFrequency: 'high'
  },
  {
    id: 'nqueens',
    name: 'N-Queens',
    description: 'Place N queens on NxN board with no conflicts',
    difficulty: 'advanced',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    realWorldUses: [
      'Constraint satisfaction',
      'Resource allocation',
      'Conflict resolution',
      'Game AI development'
    ],
    keyInsights: [
      'Constraint propagation crucial',
      'Diagonal checking optimization',
      'Symmetry breaking possible',
      'Pruning dramatically helps'
    ],
    prerequisites: ['Advanced recursion', 'Constraint satisfaction', '2D arrays'],
    estimatedTime: '25-35 minutes',
    icon: '👑',
    color: 'from-yellow-400 to-orange-600',
    popularityScore: 90,
    interviewFrequency: 'very-high'
  },
  {
    id: 'wordsearch',
    name: 'Word Search',
    description: 'Find words in 2D character grid using backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(N × M × 4^L)',
    spaceComplexity: 'O(L)',
    realWorldUses: [
      'Text processing',
      'Pattern matching',
      'Bioinformatics',
      'Game development'
    ],
    keyInsights: [
      'Grid traversal in 8 directions',
      'Path marking prevents cycles',
      'Trie optimization for multiple words',
      'DFS with backtracking'
    ],
    prerequisites: ['2D arrays', 'DFS', 'String manipulation'],
    estimatedTime: '20-30 minutes',
    icon: '🔍',
    color: 'from-indigo-400 to-indigo-600',
    popularityScore: 70,
    interviewFrequency: 'medium'
  },
  {
    id: 'sudoku',
    name: 'Sudoku Solver',
    description: 'Solve 9x9 Sudoku puzzle using constraint checking',
    difficulty: 'expert',
    timeComplexity: 'O(9^(n²))',
    spaceComplexity: 'O(n²)',
    realWorldUses: [
      'Puzzle solving',
      'Logic programming',
      'Constraint satisfaction',
      'AI problem solving'
    ],
    keyInsights: [
      'Multiple constraint types',
      'Constraint propagation',
      'Most constrained variable',
      'Arc consistency'
    ],
    prerequisites: ['Advanced backtracking', 'Constraint satisfaction', 'Optimization'],
    estimatedTime: '35-45 minutes',
    icon: '🧩',
    color: 'from-red-400 to-red-600',
    popularityScore: 65,
    interviewFrequency: 'medium'
  },
  {
    id: 'generate-parentheses',
    name: 'Generate Parentheses',
    description: 'Generate all valid combinations of n pairs of parentheses',
    difficulty: 'intermediate',
    timeComplexity: 'O(4^n / √n)',
    spaceComplexity: 'O(n)',
    realWorldUses: [
      'Expression parsing',
      'Compiler design',
      'Math expression validation',
      'Code formatting'
    ],
    keyInsights: [
      'Catalan number sequence',
      'Valid constraints crucial',
      'Early pruning opportunity',
      'Stack-based validation'
    ],
    prerequisites: ['Recursion', 'String building', 'Stack concepts'],
    estimatedTime: '15-20 minutes',
    icon: '()',
    color: 'from-teal-400 to-teal-600',
    popularityScore: 88,
    interviewFrequency: 'very-high'
  }
]

export const AlgorithmPatternSelector: React.FC<AlgorithmPatternSelectorProps> = ({
  selectedPattern,
  onPatternSelect,
  onPatternPreview,
  showDifficulty = true,
  showComplexity = true,
  showPrerequisites = true,
  filterByDifficulty,
  className = ''
}) => {
  const [hoveredPattern, setHoveredPattern] = useState<BacktrackingPattern | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popularity' | 'difficulty' | 'name'>('popularity')

  // Filter and sort patterns
  const filteredPatterns = patternData
    .filter(pattern => !filterByDifficulty || filterByDifficulty.includes(pattern.difficulty))
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularityScore - a.popularityScore
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  // Handle pattern hover
  useEffect(() => {
    onPatternPreview?.(hoveredPattern)
  }, [hoveredPattern, onPatternPreview])

  const getDifficultyColor = (difficulty: PatternInfo['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-orange-600 bg-orange-100'
      case 'expert': return 'text-red-600 bg-red-100'
    }
  }

  const getFrequencyColor = (frequency: PatternInfo['interviewFrequency']) => {
    switch (frequency) {
      case 'low': return 'text-gray-600 bg-gray-100'
      case 'medium': return 'text-blue-600 bg-blue-100'
      case 'high': return 'text-purple-600 bg-purple-100'
      case 'very-high': return 'text-red-600 bg-red-100'
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header with controls */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Algorithm Patterns</h3>
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>

            {/* Sort controls */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Pattern statistics */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{filteredPatterns.length} patterns available</span>
          <span>•</span>
          <span>Avg difficulty: {getAverageDifficulty(filteredPatterns)}</span>
          <span>•</span>
          <span>High interview frequency: {filteredPatterns.filter(p => p.interviewFrequency === 'very-high').length}</span>
        </div>
      </div>

      {/* Pattern grid/list */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatterns.map(pattern => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                isSelected={selectedPattern === pattern.id}
                showDifficulty={showDifficulty}
                showComplexity={showComplexity}
                onSelect={() => onPatternSelect(pattern.id)}
                onHover={() => setHoveredPattern(pattern.id)}
                onLeave={() => setHoveredPattern(null)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPatterns.map(pattern => (
              <PatternListItem
                key={pattern.id}
                pattern={pattern}
                isSelected={selectedPattern === pattern.id}
                showDifficulty={showDifficulty}
                showComplexity={showComplexity}
                showPrerequisites={showPrerequisites}
                onSelect={() => onPatternSelect(pattern.id)}
                onHover={() => setHoveredPattern(pattern.id)}
                onLeave={() => setHoveredPattern(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Pattern card component for grid view
interface PatternCardProps {
  pattern: PatternInfo
  isSelected: boolean
  showDifficulty: boolean
  showComplexity: boolean
  onSelect: () => void
  onHover: () => void
  onLeave: () => void
}

const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  isSelected,
  showDifficulty,
  showComplexity,
  onSelect,
  onHover,
  onLeave
}) => {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Pattern header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pattern.color} flex items-center justify-center text-white text-lg`}>
            {pattern.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
            {showDifficulty && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pattern.difficulty)}`}>
                {pattern.difficulty}
              </span>
            )}
          </div>
        </div>
        
        {/* Popularity score */}
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{pattern.popularityScore}%</div>
          <div className="text-xs text-gray-500">popularity</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {pattern.description}
      </p>

      {/* Complexity info */}
      {showComplexity && (
        <div className="space-y-1 mb-3">
          <div className="text-xs">
            <span className="text-gray-500">Time:</span>
            <span className="ml-1 font-mono text-purple-600">{pattern.timeComplexity}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-500">Space:</span>
            <span className="ml-1 font-mono text-purple-600">{pattern.spaceComplexity}</span>
          </div>
        </div>
      )}

      {/* Interview frequency */}
      <div className="flex items-center justify-between">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(pattern.interviewFrequency)}`}>
          {pattern.interviewFrequency.replace('-', ' ')} frequency
        </span>
        <span className="text-xs text-gray-500">{pattern.estimatedTime}</span>
      </div>
    </div>
  )
}

// Pattern list item component for list view
interface PatternListItemProps extends PatternCardProps {
  showPrerequisites: boolean
}

const PatternListItem: React.FC<PatternListItemProps> = ({
  pattern,
  isSelected,
  showDifficulty,
  showComplexity,
  showPrerequisites,
  onSelect,
  onHover,
  onLeave
}) => {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon and basic info */}
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pattern.color} flex items-center justify-center text-white text-xl`}>
            {pattern.icon}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
              {showDifficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pattern.difficulty)}`}>
                  {pattern.difficulty}
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(pattern.interviewFrequency)}`}>
                {pattern.interviewFrequency.replace('-', ' ')} frequency
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
            
            {/* Prerequisites */}
            {showPrerequisites && pattern.prerequisites.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>Prerequisites:</span>
                {pattern.prerequisites.map((prereq, index) => (
                  <span key={prereq} className="bg-gray-100 px-2 py-1 rounded">
                    {prereq}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="text-right space-y-1">
          <div className="text-sm font-medium text-gray-900">{pattern.popularityScore}%</div>
          <div className="text-xs text-gray-500">{pattern.estimatedTime}</div>
          {showComplexity && (
            <div className="text-xs space-y-1">
              <div>T: <span className="font-mono text-purple-600">{pattern.timeComplexity}</span></div>
              <div>S: <span className="font-mono text-purple-600">{pattern.spaceComplexity}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Utility functions
function getDifficultyColor(difficulty: PatternInfo['difficulty']) {
  switch (difficulty) {
    case 'beginner': return 'text-green-600 bg-green-100'
    case 'intermediate': return 'text-yellow-600 bg-yellow-100'
    case 'advanced': return 'text-orange-600 bg-orange-100'
    case 'expert': return 'text-red-600 bg-red-100'
  }
}

function getFrequencyColor(frequency: PatternInfo['interviewFrequency']) {
  switch (frequency) {
    case 'low': return 'text-gray-600 bg-gray-100'
    case 'medium': return 'text-blue-600 bg-blue-100'
    case 'high': return 'text-purple-600 bg-purple-100'
    case 'very-high': return 'text-red-600 bg-red-100'
  }
}

function getAverageDifficulty(patterns: PatternInfo[]): string {
  const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
  const avg = patterns.reduce((sum, p) => sum + difficultyMap[p.difficulty], 0) / patterns.length
  
  if (avg <= 1.5) return 'Beginner'
  if (avg <= 2.5) return 'Intermediate'
  if (avg <= 3.5) return 'Advanced'
  return 'Expert'
}

export default AlgorithmPatternSelector
