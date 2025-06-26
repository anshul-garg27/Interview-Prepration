'use client';

import React, { useCallback, useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';

interface ConceptSectionProps {
  className?: string;
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({
  className = ''
}) => {
  const { state } = useBacktracking();
  const [activeTab, setActiveTab] = useState<'fundamentals' | 'process' | 'complexity' | 'applications'>('fundamentals');
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  const handleConceptToggle = useCallback((concept: string) => {
    setExpandedConcept(expandedConcept === concept ? null : concept);
  }, [expandedConcept]);

  // Core concepts for backtracking
  const fundamentalConcepts = [
    {
      id: 'definition',
      title: 'What is Backtracking?',
      summary: 'A systematic method for solving problems by trying partial solutions and abandoning them if they cannot lead to a complete solution.',
      content: `
        Backtracking is an algorithmic approach that considers searching every possible combination in order to solve computational problems. It builds candidates to the solutions incrementally and abandons candidates (backtracks) as soon as it determines they cannot possibly be extended to a valid solution.

        Key characteristics:
        • **Systematic exploration**: Explores all possible solutions methodically
        • **Pruning**: Eliminates invalid paths early to save computation
        • **Recursive structure**: Naturally implemented using recursion
        • **State space search**: Navigates through a tree of possible states
      `,
      examples: ['N-Queens problem', 'Sudoku solver', 'Maze solving', 'Permutation generation']
    },
    {
      id: 'decision-tree',
      title: 'Decision Tree Structure',
      summary: 'Understanding how backtracking creates and navigates through a tree of decisions.',
      content: `
        Every backtracking algorithm implicitly creates a decision tree where:
        
        **Nodes represent states** of partial solutions
        **Edges represent choices** or decisions made
        **Leaves represent** either complete solutions or dead ends
        **Backtracking occurs** when we hit a dead end and return to the parent node

        Tree properties:
        • Root: Initial empty state
        • Internal nodes: Partial solutions
        • Leaves: Complete solutions or invalid states
        • Height: Maximum depth of recursion
        • Branching factor: Number of choices at each step
      `,
      examples: ['Tree visualization', 'Node expansion', 'Pruning demonstration']
    },
    {
      id: 'state-space',
      title: 'State Space Exploration',
      summary: 'How backtracking systematically explores the space of all possible solutions.',
      content: `
        The state space is the set of all possible states that can be reached during the search:

        **State representation**: How we encode partial solutions
        **State transitions**: Valid moves from one state to another
        **Goal states**: States that represent complete solutions
        **Constraint checking**: Validating if a state is promising

        Exploration strategy:
        • Depth-first search pattern
        • Generate candidates incrementally
        • Check constraints at each step
        • Backtrack when constraints are violated
      `,
      examples: ['State representation', 'Valid transitions', 'Constraint validation']
    },
    {
      id: 'pruning',
      title: 'Pruning and Optimization',
      summary: 'Techniques to eliminate unpromising branches early and improve efficiency.',
      content: `
        Pruning is the key to making backtracking efficient:

        **Early termination**: Stop exploring paths that cannot lead to solutions
        **Constraint propagation**: Use constraints to eliminate future possibilities
        **Bound checking**: Compare partial solutions with known bounds
        **Symmetry breaking**: Avoid exploring equivalent states

        Types of pruning:
        • Feasibility pruning: Check if current state can be extended
        • Optimality pruning: Eliminate paths that cannot improve best solution
        • Symmetry pruning: Skip equivalent states
        • Dominance pruning: Remove inferior partial solutions
      `,
      examples: ['Constraint checking', 'Early termination', 'Symmetry detection']
    }
  ];

  // Backtracking process explanation
  const processSteps = [
    {
      step: 1,
      title: 'Initialize',
      description: 'Start with an empty or initial state',
      details: 'Set up the initial problem state, data structures, and any preprocessing required.',
      visualization: '🚀'
    },
    {
      step: 2,
      title: 'Generate Candidates',
      description: 'Generate all possible next choices from current state',
      details: 'Create a list of all valid moves or decisions that can be made from the current state.',
      visualization: '🔍'
    },
    {
      step: 3,
      title: 'Check Constraints',
      description: 'Validate if the candidate is promising',
      details: 'Apply constraint checks to determine if this candidate can potentially lead to a solution.',
      visualization: '✅'
    },
    {
      step: 4,
      title: 'Extend Solution',
      description: 'Add the candidate to the current partial solution',
      details: 'If the candidate passes constraint checks, extend the current solution with this choice.',
      visualization: '➕'
    },
    {
      step: 5,
      title: 'Recurse or Complete',
      description: 'Either recurse deeper or check if solution is complete',
      details: 'If solution is complete, record it. Otherwise, recursively apply the algorithm to the extended state.',
      visualization: '🔄'
    },
    {
      step: 6,
      title: 'Backtrack',
      description: 'Remove the candidate and try the next one',
      details: 'Undo the last choice and try the next candidate. If no more candidates, return to the previous level.',
      visualization: '⬅️'
    }
  ];

  // Complexity analysis
  const complexityAnalysis = {
    timeComplexity: {
      worst: 'O(b^d)',
      average: 'O(b^(d/2)) with good pruning',
      best: 'O(d) when solution found quickly',
      explanation: 'Where b is branching factor and d is maximum depth'
    },
    spaceComplexity: {
      value: 'O(d)',
      explanation: 'Stack space for recursion depth, plus space for storing the current solution'
    },
    factors: [
      'Branching factor (number of choices at each step)',
      'Maximum depth of the search tree',
      'Effectiveness of pruning techniques',
      'Distribution of solutions in the search space',
      'Quality of constraint checking'
    ]
  };

  // Real-world applications
  const applications = [
    {
      category: 'Puzzle Solving',
      examples: ['Sudoku', 'N-Queens', 'Knight\'s Tour', 'Crossword puzzles'],
      description: 'Classic constraint satisfaction problems with well-defined rules'
    },
    {
      category: 'Game AI',
      examples: ['Chess engines', 'Game tree search', 'Move generation', 'Position evaluation'],
      description: 'Strategic game playing and decision making under constraints'
    },
    {
      category: 'Optimization',
      examples: ['Traveling Salesman', 'Knapsack variants', 'Scheduling', 'Resource allocation'],
      description: 'Finding optimal solutions among many possible configurations'
    },
    {
      category: 'Parsing & Compilation',
      examples: ['Regular expression matching', 'Grammar parsing', 'Syntax analysis', 'Code generation'],
      description: 'Language processing and formal grammar applications'
    },
    {
      category: 'Graph Problems',
      examples: ['Path finding', 'Graph coloring', 'Hamiltonian paths', 'Clique detection'],
      description: 'Complex graph algorithms with constraint satisfaction'
    },
    {
      category: 'Computational Biology',
      examples: ['Protein folding', 'Gene sequencing', 'Phylogenetic trees', 'Drug discovery'],
      description: 'Biological sequence analysis and structure prediction'
    }
  ];

  const tabs = [
    { id: 'fundamentals', label: 'Fundamentals', icon: '📚' },
    { id: 'process', label: 'Process', icon: '⚙️' },
    { id: 'complexity', label: 'Complexity', icon: '📊' },
    { id: 'applications', label: 'Applications', icon: '🌍' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Concept Learning
            </h2>
            <p className="text-gray-600">
              Master the fundamental concepts and principles of backtracking algorithms
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Current Algorithm</div>
            <div className="text-lg font-semibold text-blue-600 capitalize">
              {state.currentPattern}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Concept tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'fundamentals' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Core Concepts of Backtracking
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Understanding these fundamental concepts is essential for mastering backtracking algorithms
                </p>
              </div>

              <div className="space-y-4">
                {fundamentalConcepts.map((concept) => (
                  <div key={concept.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleConceptToggle(concept.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {concept.title}
                          </h4>
                          <p className="text-gray-600 mt-1">{concept.summary}</p>
                        </div>
                        <span className="text-gray-400">
                          {expandedConcept === concept.id ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    
                    {expandedConcept === concept.id && (
                      <div className="px-4 pb-4">
                        <div className="pt-4 border-t border-gray-100">
                          <div className="prose prose-sm max-w-none text-gray-700">
                            {concept.content.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-3 last:mb-0">
                                {paragraph.trim()}
                              </p>
                            ))}
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-800 mb-2">Examples:</h5>
                            <div className="flex flex-wrap gap-2">
                              {concept.examples.map((example, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Backtracking Process
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Step-by-step breakdown of how backtracking algorithms work
                </p>
              </div>

              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{step.visualization}</span>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="flex justify-center mt-4">
                          <div className="w-px h-6 bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Process Flow Diagram */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Decision Flow</h4>
                <div className="flex justify-center">
                  <div className="text-center text-sm text-gray-600">
                    <div className="space-y-2">
                      <div>Start → Generate Candidates → Check Constraints</div>
                      <div>↓</div>
                      <div>Valid? → Yes: Extend Solution → Complete? → Yes: Record Solution</div>
                      <div>↓ No ↙ No</div>
                      <div>Backtrack ← Recurse</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complexity' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Complexity Analysis
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Understanding the time and space complexity of backtracking algorithms
                </p>
              </div>

              {/* Time Complexity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Time Complexity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{complexityAnalysis.timeComplexity.worst}</div>
                    <div className="text-sm text-red-700">Worst Case</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{complexityAnalysis.timeComplexity.average}</div>
                    <div className="text-sm text-yellow-700">Average Case</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{complexityAnalysis.timeComplexity.best}</div>
                    <div className="text-sm text-green-700">Best Case</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{complexityAnalysis.timeComplexity.explanation}</p>
              </div>

              {/* Space Complexity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Space Complexity</h4>
                <div className="text-center p-4 bg-blue-50 rounded-lg mb-4">
                  <div className="text-xl font-bold text-blue-600">{complexityAnalysis.spaceComplexity.value}</div>
                  <div className="text-sm text-blue-700">Space Complexity</div>
                </div>
                <p className="text-gray-600 text-sm">{complexityAnalysis.spaceComplexity.explanation}</p>
              </div>

              {/* Factors Affecting Performance */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Factors Affecting Performance</h4>
                <ul className="space-y-2">
                  {complexityAnalysis.factors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Real-World Applications
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover how backtracking algorithms are used across various domains
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      {app.category}
                    </h4>
                    <p className="text-gray-600 mb-4">{app.description}</p>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-800">Examples:</h5>
                      <div className="flex flex-wrap gap-2">
                        {app.examples.map((example, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptSection;
