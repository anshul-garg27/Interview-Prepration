'use client';

import React, { useCallback, useState } from 'react';
import AlgorithmPatternSelector from '../components/AlgorithmPatternSelector';
import { useBacktracking } from '../context/BacktrackingContext';
import { BacktrackingPattern, PatternConfig } from '../types/BacktrackingTypes';

interface PatternSectionProps {
  className?: string;
}

export const PatternSection: React.FC<PatternSectionProps> = ({
  className = ''
}) => {
  const { state, dispatch } = useBacktracking();
  const [selectedPattern, setSelectedPattern] = useState<BacktrackingPattern>(state.currentPattern);
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({});
  const [showComparison, setShowComparison] = useState(false);
  const [comparePatterns, setComparePatterns] = useState<BacktrackingPattern[]>([]);

  // Pattern details and explanations
  const patternDetails = {
    permutations: {
      title: 'Permutations',
      description: 'Generate all possible arrangements of elements',
      icon: '🔄',
      difficulty: 'Beginner',
      timeComplexity: 'O(n! × n)',
      spaceComplexity: 'O(n)',
      keyFeatures: [
        'Fixed-length arrangements',
        'Each element used exactly once',
        'Order matters',
        'Factorial growth pattern'
      ],
      variations: [
        'All permutations',
        'Permutations with repetition',
        'Next permutation',
        'Lexicographic ordering'
      ],
      constraints: [
        'Element uniqueness',
        'Length restrictions',
        'Ordering requirements'
      ],
      examples: [
        { input: '[1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
        { input: '[1,2]', output: '[[1,2],[2,1]]' }
      ]
    },
    combinations: {
      title: 'Combinations',
      description: 'Select subsets of elements where order doesn\'t matter',
      icon: '🎯',
      difficulty: 'Beginner',
      timeComplexity: 'O(2^n)',
      spaceComplexity: 'O(n)',
      keyFeatures: [
        'Variable-length selections',
        'Order doesn\'t matter',
        'No repetition of elements',
        'Binomial coefficient count'
      ],
      variations: [
        'All combinations',
        'Combinations of specific size',
        'Combinations with repetition',
        'Combination sum problems'
      ],
      constraints: [
        'Selection size limits',
        'Element availability',
        'Sum constraints'
      ],
      examples: [
        { input: '[1,2,3,4] size=2', output: '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]' },
        { input: '[1,2] size=1', output: '[[1],[2]]' }
      ]
    },
    subsets: {
      title: 'Subsets (Power Set)',
      description: 'Generate all possible subsets including empty set',
      icon: '⚡',
      difficulty: 'Intermediate',
      timeComplexity: 'O(2^n × n)',
      spaceComplexity: 'O(n)',
      keyFeatures: [
        'Includes empty set',
        'All possible sizes',
        'Bit manipulation analogy',
        'Exponential growth'
      ],
      variations: [
        'All subsets',
        'Subsets with duplicates',
        'Subset sum',
        'Maximum subset'
      ],
      constraints: [
        'Duplicate handling',
        'Sum targets',
        'Size restrictions'
      ],
      examples: [
        { input: '[1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
        { input: '[0]', output: '[[],[0]]' }
      ]
    },
    nqueens: {
      title: 'N-Queens',
      description: 'Place N queens on N×N board without attacking each other',
      icon: '👑',
      difficulty: 'Advanced',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      keyFeatures: [
        'Constraint satisfaction',
        'Grid-based placement',
        'Attack pattern checking',
        'Symmetry considerations'
      ],
      variations: [
        'Standard N-Queens',
        'N-Queens counting',
        'Queens with obstacles',
        'Generalized pieces'
      ],
      constraints: [
        'Row conflicts',
        'Column conflicts',
        'Diagonal conflicts',
        'Board boundaries'
      ],
      examples: [
        { input: 'N=4', output: '2 solutions: positions [(1,3),(3,0),(0,2),(2,1)] and [(2,1),(0,3),(3,0),(1,2)]' },
        { input: 'N=8', output: '92 solutions total' }
      ]
    },
    wordsearch: {
      title: 'Word Search',
      description: 'Find words in a 2D grid by connecting adjacent letters',
      icon: '🔍',
      difficulty: 'Advanced',
      timeComplexity: 'O(M×N×4^L)',
      spaceComplexity: 'O(L)',
      keyFeatures: [
        'Grid traversal',
        'Path tracking',
        'Directional movement',
        'Word validation'
      ],
      variations: [
        'Single word search',
        'Multiple word search',
        'Word search II',
        'Circular word search'
      ],
      constraints: [
        'Grid boundaries',
        'Path uniqueness',
        'Direction restrictions',
        'Letter matching'
      ],
      examples: [
        { input: 'Grid + word "ABCCED"', output: 'Path found: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)' },
        { input: 'Grid + word "SEE"', output: 'Path found: (1,1)→(1,2)→(2,2)' }
      ]
    }
  };

  // Handle pattern selection
  const handlePatternSelect = useCallback((pattern: BacktrackingPattern) => {
    setSelectedPattern(pattern);
    dispatch({
      type: 'SET_ALGORITHM_PATTERN',
      payload: { pattern }
    });
  }, [dispatch]);

  // Handle pattern configuration
  const handleConfigChange = useCallback((config: PatternConfig) => {
    setPatternConfig(config);
    dispatch({
      type: 'UPDATE_PATTERN_CONFIG',
      payload: { config }
    });
  }, [dispatch]);

  // Toggle pattern comparison
  const handleCompareToggle = useCallback((pattern: BacktrackingPattern) => {
    setComparePatterns(prev => {
      if (prev.includes(pattern)) {
        return prev.filter(p => p !== pattern);
      } else if (prev.length < 3) {
        return [...prev, pattern];
      }
      return prev;
    });
  }, []);

  // Get pattern metrics for comparison
  const getPatternMetrics = (pattern: BacktrackingPattern) => {
    const details = patternDetails[pattern];
    const difficultyScore = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3
    }[details.difficulty] || 1;

    return {
      difficulty: difficultyScore,
      timeComplexity: details.timeComplexity,
      spaceComplexity: details.spaceComplexity,
      features: details.keyFeatures.length,
      variations: details.variations.length
    };
  };

  const currentPatternDetails = patternDetails[selectedPattern];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pattern Exploration
            </h2>
            <p className="text-gray-600">
              Explore and compare different backtracking algorithm patterns
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showComparison 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <AlgorithmPatternSelector
        onPatternSelect={handlePatternSelect}
        className="mb-6"
      />

      {/* Pattern Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Pattern Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{currentPatternDetails.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {currentPatternDetails.title}
              </h3>
              <p className="text-gray-600">{currentPatternDetails.description}</p>
            </div>
          </div>

          {/* Pattern Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Difficulty</div>
              <div className={`font-semibold ${
                currentPatternDetails.difficulty === 'Beginner' ? 'text-green-600' :
                currentPatternDetails.difficulty === 'Intermediate' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentPatternDetails.difficulty}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Time Complexity</div>
              <div className="font-semibold text-gray-800">{currentPatternDetails.timeComplexity}</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
            <div className="space-y-2">
              {currentPatternDetails.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Examples</h4>
            <div className="space-y-3">
              {currentPatternDetails.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-mono text-sm">
                    <div className="text-gray-600">Input: <span className="text-blue-600">{example.input}</span></div>
                    <div className="text-gray-600 mt-1">Output: <span className="text-green-600">{example.output}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Variations and Constraints */}
        <div className="space-y-6">
          {/* Variations */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Pattern Variations</h4>
            <div className="space-y-2">
              {currentPatternDetails.variations.map((variation, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-medium">{variation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Common Constraints</h4>
            <div className="space-y-2">
              {currentPatternDetails.constraints.map((constraint, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-700">{constraint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Complexity Analysis</h4>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Time Complexity:</span>
                <span className="ml-2 font-mono text-red-600">{currentPatternDetails.timeComplexity}</span>
              </div>
              <div>
                <span className="text-gray-600">Space Complexity:</span>
                <span className="ml-2 font-mono text-blue-600">{currentPatternDetails.spaceComplexity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Comparison */}
      {showComparison && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Pattern Comparison</h3>
            <div className="text-sm text-gray-600">
              Select up to 3 patterns to compare (currently {comparePatterns.length}/3)
            </div>
          </div>

          {/* Pattern Selection for Comparison */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {Object.entries(patternDetails).map(([pattern, details]) => (
              <button
                key={pattern}
                onClick={() => handleCompareToggle(pattern as BacktrackingPattern)}
                disabled={!comparePatterns.includes(pattern as BacktrackingPattern) && comparePatterns.length >= 3}
                className={`p-3 rounded-lg border transition-colors text-center ${
                  comparePatterns.includes(pattern as BacktrackingPattern)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className="text-lg mb-1">{details.icon}</div>
                <div className="text-xs font-medium">{details.title}</div>
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          {comparePatterns.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Aspect</th>
                    {comparePatterns.map(pattern => (
                      <th key={pattern} className="text-center py-3 px-4 font-semibold text-gray-800">
                        <div className="flex items-center justify-center space-x-2">
                          <span>{patternDetails[pattern].icon}</span>
                          <span>{patternDetails[pattern].title}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">Difficulty</td>
                    {comparePatterns.map(pattern => (
                      <td key={pattern} className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patternDetails[pattern].difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          patternDetails[pattern].difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {patternDetails[pattern].difficulty}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">Time Complexity</td>
                    {comparePatterns.map(pattern => (
                      <td key={pattern} className="py-3 px-4 text-center font-mono text-sm text-red-600">
                        {patternDetails[pattern].timeComplexity}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">Space Complexity</td>
                    {comparePatterns.map(pattern => (
                      <td key={pattern} className="py-3 px-4 text-center font-mono text-sm text-blue-600">
                        {patternDetails[pattern].spaceComplexity}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">Key Features</td>
                    {comparePatterns.map(pattern => (
                      <td key={pattern} className="py-3 px-4 text-center">
                        <span className="text-gray-600">{patternDetails[pattern].keyFeatures.length} features</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Variations</td>
                    {comparePatterns.map(pattern => (
                      <td key={pattern} className="py-3 px-4 text-center">
                        <span className="text-gray-600">{patternDetails[pattern].variations.length} variations</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatternSection;
