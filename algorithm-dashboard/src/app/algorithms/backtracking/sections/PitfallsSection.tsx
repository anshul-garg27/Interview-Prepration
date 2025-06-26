'use client';

import React, { useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';
import { BacktrackingPattern } from '../types/BacktrackingTypes';

interface PitfallsSectionProps {
  className?: string;
}

interface CommonMistake {
  id: string;
  title: string;
  category: 'logic' | 'performance' | 'implementation' | 'memory';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  badExample: string;
  goodExample: string;
  explanation: string;
  consequences: string[];
  howToAvoid: string[];
  relatedPatterns: BacktrackingPattern[];
}

interface DebuggingScenario {
  id: string;
  title: string;
  problem: string;
  buggyCode: string;
  symptoms: string[];
  diagnosis: string;
  solution: string;
  fixedCode: string;
  lessonLearned: string;
}

export const PitfallsSection: React.FC<PitfallsSectionProps> = ({
  className = ''
}) => {
  const { state } = useBacktracking();
  const [activeTab, setActiveTab] = useState<'mistakes' | 'debugging' | 'performance' | 'best-practices'>('mistakes');
  const [selectedMistake, setSelectedMistake] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'logic' | 'performance' | 'implementation' | 'memory'>('all');

  // Common backtracking mistakes
  const commonMistakes: CommonMistake[] = [
    {
      id: 'forgot-backtrack',
      title: 'Forgetting to Backtrack',
      category: 'logic',
      severity: 'critical',
      description: 'The most fundamental mistake: forgetting to undo changes when backtracking.',
      badExample: `function generatePermutations(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            current.push(nums[i]);
            used[i] = true;
            
            backtrack();
            
            // ❌ MISTAKE: Forgot to backtrack!
            // current.pop();
            // used[i] = false;
        }
    }
    
    backtrack();
    return result;
}`,
      goodExample: `function generatePermutations(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            current.push(nums[i]);
            used[i] = true;
            
            backtrack();
            
            // ✅ CORRECT: Always backtrack!
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}`,
      explanation: 'Backtracking requires undoing all changes made during recursion to properly explore all possibilities.',
      consequences: [
        'Incorrect or incomplete results',
        'State corruption affecting subsequent iterations',
        'Infinite recursion in some cases',
        'Memory leaks from accumulated state'
      ],
      howToAvoid: [
        'Always pair every state change with its corresponding undo',
        'Use try-finally blocks or ensure cleanup in all code paths',
        'Test with small inputs to verify all permutations are generated',
        'Use debugging tools to trace state changes'
      ],
      relatedPatterns: ['permutations', 'combinations', 'subsets', 'nqueens', 'wordsearch']
    },
    {
      id: 'shallow-copy',
      title: 'Shallow Copy Issues',
      category: 'implementation',
      severity: 'critical',
      description: 'Adding references instead of copies to the result, causing all solutions to be identical.',
      badExample: `function generateSubsets(nums) {
    const result = [];
    const current = [];
    
    function backtrack(index) {
        if (index === nums.length) {
            // ❌ MISTAKE: Adding reference, not copy!
            result.push(current);
            return;
        }
        
        // Don't include current element
        backtrack(index + 1);
        
        // Include current element
        current.push(nums[index]);
        backtrack(index + 1);
        current.pop();
    }
    
    backtrack(0);
    return result;
}`,
      goodExample: `function generateSubsets(nums) {
    const result = [];
    const current = [];
    
    function backtrack(index) {
        if (index === nums.length) {
            // ✅ CORRECT: Create a copy!
            result.push([...current]);
            return;
        }
        
        // Don't include current element
        backtrack(index + 1);
        
        // Include current element
        current.push(nums[index]);
        backtrack(index + 1);
        current.pop();
    }
    
    backtrack(0);
    return result;
}`,
      explanation: 'Arrays and objects are reference types. You must create copies when storing intermediate states.',
      consequences: [
        'All solutions in result array become identical',
        'Usually shows only the final state or empty arrays',
        'Very confusing debugging experience',
        'Silent failure - code runs but produces wrong results'
      ],
      howToAvoid: [
        'Always use spread operator [...array] or Array.from() for copies',
        'For objects, use Object.assign() or {...object}',
        'Test with simple cases to verify different solutions',
        'Use immutable data structures when possible'
      ],
      relatedPatterns: ['permutations', 'combinations', 'subsets']
    },
    {
      id: 'inefficient-constraints',
      title: 'Inefficient Constraint Checking',
      category: 'performance',
      severity: 'major',
      description: 'Checking constraints too late or too often, leading to unnecessary work.',
      badExample: `function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function isValid(board) {
        // ❌ MISTAKE: Checking entire board every time!
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (board[i][j] === 'Q') {
                    // Check all directions from this queen
                    for (let k = 0; k < n; k++) {
                        if (k !== j && board[i][k] === 'Q') return false;
                        if (k !== i && board[k][j] === 'Q') return false;
                    }
                    // Check diagonals...
                }
            }
        }
        return true;
    }
    
    function backtrack(row) {
        if (row === n) {
            if (isValid(board)) { // ❌ Too late!
                result.push(board.map(r => r.join('')));
            }
            return;
        }
        
        for (let col = 0; col < n; col++) {
            board[row][col] = 'Q';
            backtrack(row + 1);
            board[row][col] = '.';
        }
    }
    
    backtrack(0);
    return result;
}`,
      goodExample: `function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function isValid(row, col) {
        // ✅ CORRECT: Check only what's necessary!
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        
        // Check diagonals (only up to current row)
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }
        
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }
        
        return true;
    }
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) { // ✅ Check early!
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}`,
      explanation: 'Check constraints as early as possible and only check what\'s necessary to avoid wasted computation.',
      consequences: [
        'Exponential slowdown due to unnecessary work',
        'Timeout on larger inputs',
        'Poor algorithm performance in interviews',
        'Missed opportunities for pruning'
      ],
      howToAvoid: [
        'Check constraints before making recursive calls',
        'Only validate new additions, not entire state',
        'Use early termination when constraints fail',
        'Consider preprocessing to speed up constraint checks'
      ],
      relatedPatterns: ['nqueens', 'wordsearch']
    },
    {
      id: 'base-case-errors',
      title: 'Incorrect Base Cases',
      category: 'logic',
      severity: 'critical',
      description: 'Missing, incorrect, or multiple conflicting base cases leading to infinite recursion or wrong results.',
      badExample: `function generateCombinations(nums, k) {
    const result = [];
    const current = [];
    
    function backtrack(start) {
        // ❌ MISTAKE: Wrong base case condition!
        if (current.length > k) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1);
            current.pop();
        }
    }
    
    backtrack(0);
    return result;
}`,
      goodExample: `function generateCombinations(nums, k) {
    const result = [];
    const current = [];
    
    function backtrack(start) {
        // ✅ CORRECT: Exact base case!
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1);
            current.pop();
        }
    }
    
    backtrack(0);
    return result;
}`,
      explanation: 'Base cases must be precise and handle exactly the condition where recursion should stop.',
      consequences: [
        'Infinite recursion leading to stack overflow',
        'Incorrect results or empty results',
        'Performance degradation',
        'Unpredictable behavior'
      ],
      howToAvoid: [
        'Clearly define when recursion should terminate',
        'Test base cases with minimal examples',
        'Use proper comparison operators (=== not > or <)',
        'Consider edge cases like empty inputs'
      ],
      relatedPatterns: ['permutations', 'combinations', 'subsets']
    },
    {
      id: 'duplicate-handling',
      title: 'Poor Duplicate Handling',
      category: 'implementation',
      severity: 'major',
      description: 'Not properly handling duplicate elements in input, leading to duplicate solutions.',
      badExample: `function permuteUnique(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            // ❌ MISTAKE: No duplicate handling!
            current.push(nums[i]);
            used[i] = true;
            
            backtrack();
            
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}`,
      goodExample: `function permuteUnique(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    
    // ✅ CORRECT: Sort first to group duplicates!
    nums.sort((a, b) => a - b);
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            // ✅ Skip duplicates properly!
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) {
                continue;
            }
            
            current.push(nums[i]);
            used[i] = true;
            
            backtrack();
            
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}`,
      explanation: 'When input has duplicates, you must sort first and skip duplicate branches to avoid duplicate solutions.',
      consequences: [
        'Duplicate solutions in result',
        'Exponentially more work than necessary',
        'Incorrect solution count',
        'Failed test cases'
      ],
      howToAvoid: [
        'Sort input array first to group duplicates',
        'Skip duplicates using the "used[i-1]" pattern',
        'Use Set to track seen combinations (less efficient)',
        'Test with duplicate inputs to verify correctness'
      ],
      relatedPatterns: ['permutations', 'combinations', 'subsets']
    },
    {
      id: 'memory-leaks',
      title: 'Memory Leaks and Stack Overflow',
      category: 'memory',
      severity: 'major',
      description: 'Accumulating memory or hitting recursion limits due to poor implementation.',
      badExample: `function findAllPaths(grid, word) {
    const paths = [];
    
    function backtrack(row, col, index, path) {
        if (index === word.length) {
            paths.push(path); // ❌ MISTAKE: Accumulating large objects!
            return;
        }
        
        // ❌ MISTAKE: No bounds checking leads to infinite recursion!
        if (grid[row][col] !== word[index]) return;
        
        const newPath = [...path, [row, col]]; // ❌ Creating new arrays every call!
        
        // Try all 4 directions
        backtrack(row + 1, col, index + 1, newPath);
        backtrack(row - 1, col, index + 1, newPath);
        backtrack(row, col + 1, index + 1, newPath);
        backtrack(row, col - 1, index + 1, newPath);
    }
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            backtrack(i, j, 0, []);
        }
    }
    
    return paths;
}`,
      goodExample: `function findAllPaths(grid, word) {
    const paths = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    
    function backtrack(row, col, index, path) {
        // ✅ CORRECT: Proper bounds and constraint checking!
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col] || grid[row][col] !== word[index]) {
            return;
        }
        
        if (index === word.length - 1) {
            // ✅ Only store final result, not intermediate states!
            paths.push([...path, [row, col]]);
            return;
        }
        
        // ✅ Use visited array instead of copying paths!
        visited[row][col] = true;
        path.push([row, col]);
        
        // Try all 4 directions
        const directions = [[1,0], [-1,0], [0,1], [0,-1]];
        for (const [dr, dc] of directions) {
            backtrack(row + dr, col + dc, index + 1, path);
        }
        
        // ✅ CORRECT: Backtrack properly!
        path.pop();
        visited[row][col] = false;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === word[0]) {
                backtrack(i, j, 0, []);
            }
        }
    }
    
    return paths;
}`,
      explanation: 'Manage memory carefully by reusing data structures and avoiding unnecessary object creation in recursive calls.',
      consequences: [
        'Stack overflow on deep recursion',
        'Out of memory errors',
        'Slow performance due to garbage collection',
        'Browser/system crashes'
      ],
      howToAvoid: [
        'Reuse data structures instead of creating new ones',
        'Implement iterative solutions for very deep recursion',
        'Use visited arrays instead of copying state',
        'Monitor memory usage during development'
      ],
      relatedPatterns: ['wordsearch', 'nqueens']
    }
  ];

  // Debugging scenarios
  const debuggingScenarios: DebuggingScenario[] = [
    {
      id: 'empty-results',
      title: 'Getting Empty Results',
      problem: 'Your backtracking algorithm runs without errors but returns an empty result array.',
      buggyCode: `function generatePermutations(nums) {
    const result = [];
    const current = [];
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push(current); // BUG: Reference issue
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (current.includes(nums[i])) continue; // BUG: Inefficient check
            
            current.push(nums[i]);
            backtrack();
            current.pop();
        }
    }
    
    backtrack();
    return result; // Returns [[], [], []] instead of actual permutations
}`,
      symptoms: [
        'Result array has correct length but contains empty arrays',
        'All elements in result are identical',
        'Algorithm seems to run correctly without errors'
      ],
      diagnosis: 'The issue is storing references to the same array instead of creating copies.',
      solution: 'Always create copies of arrays/objects when storing them in results.',
      fixedCode: `function generatePermutations(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false); // Better tracking
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]); // FIX: Create copy
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue; // FIX: Efficient check
            
            current.push(nums[i]);
            used[i] = true;
            
            backtrack();
            
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}`,
      lessonLearned: 'Always use spread operator or Array.from() to create copies when storing intermediate states.'
    },
    {
      id: 'infinite-recursion',
      title: 'Stack Overflow from Infinite Recursion',
      problem: 'Your algorithm crashes with "Maximum call stack size exceeded" error.',
      buggyCode: `function wordSearch(board, word) {
    function backtrack(row, col, index) {
        if (index === word.length) return true;
        
        // BUG: No bounds checking!
        if (board[row][col] !== word[index]) return false;
        
        // BUG: No visited tracking leads to cycles!
        return backtrack(row + 1, col, index + 1) ||
               backtrack(row - 1, col, index + 1) ||
               backtrack(row, col + 1, index + 1) ||
               backtrack(row, col - 1, index + 1);
    }
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (backtrack(i, j, 0)) return true;
        }
    }
    
    return false;
}`,
      symptoms: [
        'Stack overflow error',
        'Browser becomes unresponsive',
        'Infinite recursion in debugging tools'
      ],
      diagnosis: 'Missing bounds checking and cycle detection causing infinite recursion loops.',
      solution: 'Add proper bounds checking and use visited tracking to prevent cycles.',
      fixedCode: `function wordSearch(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    
    function backtrack(row, col, index) {
        if (index === word.length) return true;
        
        // FIX: Proper bounds and constraint checking
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }
        
        // FIX: Mark as visited to prevent cycles
        visited[row][col] = true;
        
        const found = backtrack(row + 1, col, index + 1) ||
                     backtrack(row - 1, col, index + 1) ||
                     backtrack(row, col + 1, index + 1) ||
                     backtrack(row, col - 1, index + 1);
        
        // FIX: Backtrack by unmarking
        visited[row][col] = false;
        
        return found;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) return true;
        }
    }
    
    return false;
}`,
      lessonLearned: 'Always validate inputs and use proper state tracking to prevent infinite loops.'
    }
  ];

  // Filter mistakes by category
  const getFilteredMistakes = () => {
    if (filterCategory === 'all') return commonMistakes;
    return commonMistakes.filter(mistake => mistake.category === filterCategory);
  };

  // Get selected mistake object
  const getSelectedMistake = () => {
    return commonMistakes.find(m => m.id === selectedMistake);
  };

  // Get selected scenario object
  const getSelectedScenario = () => {
    return debuggingScenarios.find(s => s.id === selectedScenario);
  };

  // Initialize selections
  React.useEffect(() => {
    const mistakes = getFilteredMistakes();
    if (mistakes.length > 0 && !selectedMistake) {
      setSelectedMistake(mistakes[0].id);
    }
  }, [filterCategory, selectedMistake]);

  React.useEffect(() => {
    if (debuggingScenarios.length > 0 && !selectedScenario) {
      setSelectedScenario(debuggingScenarios[0].id);
    }
  }, [selectedScenario]);

  const selectedMistakeObj = getSelectedMistake();
  const selectedScenarioObj = getSelectedScenario();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ⚠️ Common Pitfalls & Debugging Guide
            </h2>
            <p className="text-gray-600">
              Learn from common mistakes, debug effectively, and write robust backtracking algorithms
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Pattern: <span className="font-medium capitalize">{state.pattern}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'mistakes', label: 'Common Mistakes', icon: '🚫' },
              { id: 'debugging', label: 'Debug Scenarios', icon: '🔧' },
              { id: 'performance', label: 'Performance Tips', icon: '⚡' },
              { id: 'best-practices', label: 'Best Practices', icon: '✅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'mistakes' && (
            <div className="space-y-6">
              {/* Filter Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Filter by category:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="logic">Logic Errors</option>
                    <option value="performance">Performance Issues</option>
                    <option value="implementation">Implementation Problems</option>
                    <option value="memory">Memory Management</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {getFilteredMistakes().length} mistakes found
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mistake List */}
                <div className="space-y-3">
                  {getFilteredMistakes().map((mistake) => (
                    <button
                      key={mistake.id}
                      onClick={() => setSelectedMistake(mistake.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedMistake === mistake.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{mistake.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mistake.severity === 'critical' ? 'bg-red-200 text-red-800' :
                          mistake.severity === 'major' ? 'bg-orange-200 text-orange-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {mistake.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mistake.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          mistake.category === 'logic' ? 'bg-blue-100 text-blue-800' :
                          mistake.category === 'performance' ? 'bg-green-100 text-green-800' :
                          mistake.category === 'implementation' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {mistake.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mistake Details */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedMistakeObj && (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-bold text-red-800 text-lg mb-2">{selectedMistakeObj.title}</h3>
                        <p className="text-red-700">{selectedMistakeObj.explanation}</p>
                      </div>

                      {/* Bad Example */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <span className="text-red-500 mr-2">❌</span>
                          Incorrect Implementation
                        </h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <pre className="p-4 text-sm text-red-400 overflow-x-auto">
                            <code>{selectedMistakeObj.badExample}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Good Example */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          Correct Implementation
                        </h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                            <code>{selectedMistakeObj.goodExample}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Consequences and Solutions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-800 mb-2">Consequences</h4>
                          <ul className="space-y-1">
                            {selectedMistakeObj.consequences.map((consequence, index) => (
                              <li key={index} className="text-orange-700 text-sm flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                {consequence}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2">How to Avoid</h4>
                          <ul className="space-y-1">
                            {selectedMistakeObj.howToAvoid.map((tip, index) => (
                              <li key={index} className="text-green-700 text-sm flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debugging' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scenario List */}
                <div className="space-y-3">
                  {debuggingScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedScenario === scenario.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 mb-2">{scenario.title}</h3>
                      <p className="text-sm text-gray-600">{scenario.problem}</p>
                    </button>
                  ))}
                </div>

                {/* Scenario Details */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedScenarioObj && (
                    <>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-bold text-yellow-800 text-lg mb-2">🐛 {selectedScenarioObj.title}</h3>
                        <p className="text-yellow-700">{selectedScenarioObj.problem}</p>
                      </div>

                      {/* Symptoms */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Symptoms</h4>
                        <ul className="space-y-1">
                          {selectedScenarioObj.symptoms.map((symptom, index) => (
                            <li key={index} className="text-red-700 text-sm flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Buggy Code */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Buggy Code</h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <pre className="p-4 text-sm text-red-400 overflow-x-auto">
                            <code>{selectedScenarioObj.buggyCode}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Diagnosis</h4>
                        <p className="text-blue-700">{selectedScenarioObj.diagnosis}</p>
                      </div>

                      {/* Fixed Code */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Fixed Code</h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                            <code>{selectedScenarioObj.fixedCode}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Lesson Learned */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">💡 Lesson Learned</h4>
                        <p className="text-green-700">{selectedScenarioObj.lessonLearned}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Tips */}
                {[
                  {
                    title: 'Early Constraint Checking',
                    description: 'Check constraints before making recursive calls to prune invalid branches early.',
                    impact: 'High',
                    example: 'In N-Queens, check row/column/diagonal conflicts before placing queen'
                  },
                  {
                    title: 'Efficient State Representation',
                    description: 'Use minimal data structures to represent state and avoid unnecessary copying.',
                    impact: 'Medium',
                    example: 'Use boolean arrays instead of Sets, integers instead of arrays when possible'
                  },
                  {
                    title: 'Pruning Optimizations',
                    description: 'Add problem-specific pruning to eliminate branches that cannot lead to solutions.',
                    impact: 'High',
                    example: 'In combinations, stop if remaining elements + current < target size'
                  },
                  {
                    title: 'Symmetry Breaking',
                    description: 'Eliminate symmetric solutions to reduce search space.',
                    impact: 'Medium',
                    example: 'In N-Queens, only place first queen in first half of first row'
                  }
                ].map((tip, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tip.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tip.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{tip.description}</p>
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
                      <strong>Example:</strong> {tip.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'best-practices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Best Practices Categories */}
                {[
                  {
                    category: 'Code Structure',
                    icon: '🏗️',
                    practices: [
                      'Always define clear base cases first',
                      'Use descriptive variable names (current, used, visited)',
                      'Comment your backtracking and constraint logic',
                      'Separate constraint checking into its own function'
                    ]
                  },
                  {
                    category: 'State Management',
                    icon: '🔧',
                    practices: [
                      'Use the smallest possible state representation',
                      'Always undo changes when backtracking',
                      'Prefer modifying state in-place over creating copies',
                      'Use visited arrays instead of modifying input'
                    ]
                  },
                  {
                    category: 'Error Prevention',
                    icon: '🛡️',
                    practices: [
                      'Check bounds before accessing arrays',
                      'Handle duplicate elements explicitly',
                      'Test with edge cases (empty input, size 1)',
                      'Use spread operator when storing results'
                    ]
                  },
                  {
                    category: 'Debugging Tips',
                    icon: '🔍',
                    practices: [
                      'Add logging to trace recursive calls',
                      'Visualize the decision tree for small inputs',
                      'Test each constraint check independently',
                      'Use debugger to step through backtracking'
                    ]
                  }
                ].map((section, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                      <span className="mr-2 text-2xl">{section.icon}</span>
                      {section.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.practices.map((practice, practiceIndex) => (
                        <div key={practiceIndex} className="flex items-start">
                          <span className="text-green-500 mr-2 flex-shrink-0 mt-1">✓</span>
                          <span className="text-gray-700 text-sm">{practice}</span>
                        </div>
                      ))}
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

export default PitfallsSection;
