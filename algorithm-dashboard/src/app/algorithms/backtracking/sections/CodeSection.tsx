'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';
import { BacktrackingPattern } from '../types/BacktrackingTypes';

interface CodeSectionProps {
  className?: string;
}

interface CodeTemplate {
  id: string;
  name: string;
  language: 'typescript' | 'javascript' | 'python' | 'java';
  code: string;
  explanation: string;
  complexity: {
    time: string;
    space: string;
  };
  keyPoints: string[];
}

interface ExecutionStep {
  lineNumber: number;
  variables: Record<string, any>;
  explanation: string;
  highlight: 'normal' | 'backtrack' | 'solution' | 'constraint';
}

export const CodeSection: React.FC<CodeSectionProps> = ({
  className = ''
}) => {
  const { state } = useBacktracking();
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'javascript' | 'python' | 'java'>('typescript');
  const [activeTab, setActiveTab] = useState<'template' | 'custom' | 'execution' | 'comparison'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customCode, setCustomCode] = useState<string>('');
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [comparePatterns, setComparePatterns] = useState<BacktrackingPattern[]>([]);

  // Code templates for each algorithm pattern
  const getCodeTemplates = (): Record<BacktrackingPattern, CodeTemplate[]> => ({
    permutations: [
      {
        id: 'permutations-basic',
        name: 'Basic Permutations',
        language: selectedLanguage,
        code: selectedLanguage === 'typescript' ? `
// Generate all permutations of an array
function generatePermutations(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);
    
    function backtrack(): void {
        // Base case: permutation is complete
        if (current.length === nums.length) {
            result.push([...current]); // Make a copy
            return;
        }
        
        // Try each unused number
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue; // Skip if already used
            
            // Make choice
            current.push(nums[i]);
            used[i] = true;
            
            // Recurse
            backtrack();
            
            // Backtrack (undo choice)
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

// Example usage
const input = [1, 2, 3];
const permutations = generatePermutations(input);
console.log(permutations);
// Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]` : `
# Generate all permutations of an array
def generate_permutations(nums):
    result = []
    current = []
    used = [False] * len(nums)
    
    def backtrack():
        # Base case: permutation is complete
        if len(current) == len(nums):
            result.append(current[:])  # Make a copy
            return
        
        # Try each unused number
        for i in range(len(nums)):
            if used[i]:
                continue  # Skip if already used
            
            # Make choice
            current.append(nums[i])
            used[i] = True
            
            # Recurse
            backtrack()
            
            # Backtrack (undo choice)
            current.pop()
            used[i] = False
    
    backtrack()
    return result

# Example usage
input_nums = [1, 2, 3]
permutations = generate_permutations(input_nums)
print(permutations)
# Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`,
        explanation: 'Classic permutation generation using backtracking. Each recursive call adds one element to the current permutation.',
        complexity: {
          time: 'O(n! × n)',
          space: 'O(n)'
        },
        keyPoints: [
          'Use a boolean array to track used elements',
          'Base case: when current array length equals input length',
          'Backtrack by removing the last element and marking as unused',
          'Each element appears exactly once in each permutation'
        ]
      }
    ],
    combinations: [
      {
        id: 'combinations-basic',
        name: 'Basic Combinations',
        language: selectedLanguage,
        code: selectedLanguage === 'typescript' ? `
// Generate all combinations of size k from array
function generateCombinations(nums: number[], k: number): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    
    function backtrack(start: number): void {
        // Base case: combination is complete
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        // Try each number from start position
        for (let i = start; i < nums.length; i++) {
            // Optimization: if remaining elements + current < k, stop
            if (current.length + (nums.length - i) < k) {
                break;
            }
            
            // Make choice
            current.push(nums[i]);
            
            // Recurse with next start position
            backtrack(i + 1);
            
            // Backtrack
            current.pop();
        }
    }
    
    backtrack(0);
    return result;
}

// Example usage
const input = [1, 2, 3, 4];
const combinations = generateCombinations(input, 2);
console.log(combinations);
// Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]` : `
# Generate all combinations of size k from array
def generate_combinations(nums, k):
    result = []
    current = []
    
    def backtrack(start):
        # Base case: combination is complete
        if len(current) == k:
            result.append(current[:])
            return
        
        # Try each number from start position
        for i in range(start, len(nums)):
            # Optimization: if remaining elements + current < k, stop
            if len(current) + (len(nums) - i) < k:
                break
            
            # Make choice
            current.append(nums[i])
            
            # Recurse with next start position
            backtrack(i + 1)
            
            # Backtrack
            current.pop()
    
    backtrack(0)
    return result

# Example usage
input_nums = [1, 2, 3, 4]
combinations = generate_combinations(input_nums, 2)
print(combinations)
# Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`,
        explanation: 'Generate combinations by choosing elements in order, avoiding duplicates by using start position.',
        complexity: {
          time: 'O(C(n,k) × k)',
          space: 'O(k)'
        },
        keyPoints: [
          'Use start position to avoid duplicate combinations',
          'Pruning optimization: stop early if impossible to reach target size',
          'Order doesn\'t matter in combinations (unlike permutations)',
          'Each element appears at most once in each combination'
        ]
      }
    ],
    subsets: [
      {
        id: 'subsets-basic',
        name: 'Power Set Generation',
        language: selectedLanguage,
        code: selectedLanguage === 'typescript' ? `
// Generate all subsets (power set) of an array
function generateSubsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    
    function backtrack(index: number): void {
        // Base case: processed all elements
        if (index === nums.length) {
            result.push([...current]); // Add current subset
            return;
        }
        
        // Choice 1: Don't include current element
        backtrack(index + 1);
        
        // Choice 2: Include current element
        current.push(nums[index]);
        backtrack(index + 1);
        current.pop(); // Backtrack
    }
    
    backtrack(0);
    return result;
}

// Alternative iterative approach
function generateSubsetsIterative(nums: number[]): number[][] {
    const result: number[][] = [[]]; // Start with empty subset
    
    for (const num of nums) {
        const currentSize = result.length;
        for (let i = 0; i < currentSize; i++) {
            result.push([...result[i], num]);
        }
    }
    
    return result;
}

// Example usage
const input = [1, 2, 3];
const subsets = generateSubsets(input);
console.log(subsets);
// Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]` : `
# Generate all subsets (power set) of an array
def generate_subsets(nums):
    result = []
    current = []
    
    def backtrack(index):
        # Base case: processed all elements
        if index == len(nums):
            result.append(current[:])  # Add current subset
            return
        
        # Choice 1: Don't include current element
        backtrack(index + 1)
        
        # Choice 2: Include current element
        current.append(nums[index])
        backtrack(index + 1)
        current.pop()  # Backtrack
    
    backtrack(0)
    return result

# Alternative iterative approach
def generate_subsets_iterative(nums):
    result = [[]]  # Start with empty subset
    
    for num in nums:
        current_size = len(result)
        for i in range(current_size):
            result.append(result[i] + [num])
    
    return result

# Example usage
input_nums = [1, 2, 3]
subsets = generate_subsets(input_nums)
print(subsets)
# Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]`,
        explanation: 'Generate all possible subsets by making binary choices: include or exclude each element.',
        complexity: {
          time: 'O(2^n × n)',
          space: 'O(n)'
        },
        keyPoints: [
          'Binary choice pattern: include or exclude each element',
          'Total subsets = 2^n (including empty set)',
          'Can be solved iteratively or recursively',
          'Bit manipulation approach also possible'
        ]
      }
    ],
    nqueens: [
      {
        id: 'nqueens-basic',
        name: 'N-Queens Classic',
        language: selectedLanguage,
        code: selectedLanguage === 'typescript' ? `
// Solve N-Queens problem: place N queens on N×N board
function solveNQueens(n: number): string[][] {
    const result: string[][] = [];
    const board: string[][] = Array(n).fill(0).map(() => Array(n).fill('.'));
    
    function isValid(row: number, col: number): boolean {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        
        // Check diagonal (top-left to bottom-right)
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }
        
        // Check diagonal (top-right to bottom-left)
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }
        
        return true;
    }
    
    function backtrack(row: number): void {
        // Base case: all queens placed
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        // Try each column in current row
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                // Place queen
                board[row][col] = 'Q';
                
                // Recurse to next row
                backtrack(row + 1);
                
                // Backtrack (remove queen)
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}

// Example usage
const solutions = solveNQueens(4);
console.log(\`Found \${solutions.length} solutions for 4-Queens\`);
solutions.forEach((solution, index) => {
    console.log(\`Solution \${index + 1}:\`);
    solution.forEach(row => console.log(row));
    console.log('');
});` : `
# Solve N-Queens problem: place N queens on N×N board
def solve_n_queens(n):
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def is_valid(row, col):
        # Check column
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        
        # Check diagonal (top-left to bottom-right)
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1
        
        # Check diagonal (top-right to bottom-left)
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j += 1
        
        return True
    
    def backtrack(row):
        # Base case: all queens placed
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        # Try each column in current row
        for col in range(n):
            if is_valid(row, col):
                # Place queen
                board[row][col] = 'Q'
                
                # Recurse to next row
                backtrack(row + 1)
                
                # Backtrack (remove queen)
                board[row][col] = '.'
    
    backtrack(0)
    return result

# Example usage
solutions = solve_n_queens(4)
print(f"Found {len(solutions)} solutions for 4-Queens")
for i, solution in enumerate(solutions):
    print(f"Solution {i + 1}:")
    for row in solution:
        print(row)
    print()`,
        explanation: 'Classic N-Queens using constraint checking for row, column, and diagonal conflicts.',
        complexity: {
          time: 'O(N!)',
          space: 'O(N²)'
        },
        keyPoints: [
          'Place one queen per row to avoid row conflicts',
          'Check column and both diagonals for conflicts',
          'Only need to check positions above current row',
          'Exponential pruning when constraints violated'
        ]
      }
    ],
    wordsearch: [
      {
        id: 'wordsearch-basic',
        name: 'Word Search in Grid',
        language: selectedLanguage,
        code: selectedLanguage === 'typescript' ? `
// Find if word exists in 2D grid by connecting adjacent letters
function wordSearch(board: string[][], word: string): boolean {
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[0,1], [1,0], [0,-1], [-1,0]]; // right, down, left, up
    
    function backtrack(row: number, col: number, index: number, visited: boolean[][]): boolean {
        // Base case: found complete word
        if (index === word.length) {
            return true;
        }
        
        // Check bounds and constraints
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }
        
        // Mark as visited
        visited[row][col] = true;
        
        // Try all 4 directions
        for (const [dr, dc] of directions) {
            if (backtrack(row + dr, col + dc, index + 1, visited)) {
                visited[row][col] = false; // Cleanup
                return true;
            }
        }
        
        // Backtrack: unmark as visited
        visited[row][col] = false;
        return false;
    }
    
    // Try starting from each cell
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === word[0]) {
                const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
                if (backtrack(i, j, 0, visited)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Example usage
const grid = [
    ['A','B','C','E'],
    ['S','F','C','S'],
    ['A','D','E','E']
];

console.log(wordSearch(grid, "ABCCED")); // true
console.log(wordSearch(grid, "SEE"));    // true
console.log(wordSearch(grid, "ABCB"));   // false` : `
# Find if word exists in 2D grid by connecting adjacent letters
def word_search(board, word):
    rows, cols = len(board), len(board[0])
    directions = [(0,1), (1,0), (0,-1), (-1,0)]  # right, down, left, up
    
    def backtrack(row, col, index, visited):
        # Base case: found complete word
        if index == len(word):
            return True
        
        # Check bounds and constraints
        if (row < 0 or row >= rows or col < 0 or col >= cols or
            visited[row][col] or board[row][col] != word[index]):
            return False
        
        # Mark as visited
        visited[row][col] = True
        
        # Try all 4 directions
        for dr, dc in directions:
            if backtrack(row + dr, col + dc, index + 1, visited):
                visited[row][col] = False  # Cleanup
                return True
        
        # Backtrack: unmark as visited
        visited[row][col] = False
        return False
    
    # Try starting from each cell
    for i in range(rows):
        for j in range(cols):
            if board[i][j] == word[0]:
                visited = [[False] * cols for _ in range(rows)]
                if backtrack(i, j, 0, visited):
                    return True
    
    return False

# Example usage
grid = [
    ['A','B','C','E'],
    ['S','F','C','S'],
    ['A','D','E','E']
]

print(word_search(grid, "ABCCED"))  # True
print(word_search(grid, "SEE"))     # True
print(word_search(grid, "ABCB"))    # False`,
        explanation: 'Search for words in a 2D grid by exploring adjacent cells using backtracking with path tracking.',
        complexity: {
          time: 'O(M×N×4^L)',
          space: 'O(L)'
        },
        keyPoints: [
          'Use visited array to avoid cycles in path',
          'Try all 4 directions from each valid cell',
          'Backtrack by unmarking visited cells',
          'Early termination when character doesn\'t match'
        ]
      }
    ]
  });

  // Get current templates based on selected pattern
  const getCurrentTemplates = (): CodeTemplate[] => {
    const templates = getCodeTemplates();
    return templates[state.pattern] || [];
  };

  // Initialize with first template
  useEffect(() => {
    const templates = getCurrentTemplates();
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0].id);
    }
  }, [state.pattern, selectedTemplate]);

  // Get selected template object
  const getSelectedTemplateObj = (): CodeTemplate | null => {
    const templates = getCurrentTemplates();
    return templates.find(t => t.id === selectedTemplate) || null;
  };

  // Handle language change
  const handleLanguageChange = useCallback((language: typeof selectedLanguage) => {
    setSelectedLanguage(language);
    // Reset selected template to refresh code
    const templates = getCurrentTemplates();
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, [getCurrentTemplates]);

  // Handle custom code execution simulation
  const handleExecuteCode = useCallback(() => {
    setIsExecuting(true);
    setCurrentStep(0);
    
    // Simulate execution steps (in real implementation, this would parse and execute code)
    const mockSteps: ExecutionStep[] = [
      {
        lineNumber: 1,
        variables: { nums: [1, 2, 3], result: [], current: [] },
        explanation: 'Initialize variables: input array, result storage, and current permutation',
        highlight: 'normal'
      },
      {
        lineNumber: 5,
        variables: { nums: [1, 2, 3], result: [], current: [], used: [false, false, false] },
        explanation: 'Create used array to track which elements are in current permutation',
        highlight: 'normal'
      },
      {
        lineNumber: 8,
        variables: { nums: [1, 2, 3], result: [], current: [], used: [false, false, false] },
        explanation: 'Enter backtrack function - check if permutation is complete',
        highlight: 'normal'
      },
      {
        lineNumber: 15,
        variables: { nums: [1, 2, 3], result: [], current: [1], used: [true, false, false] },
        explanation: 'Choose first element (1), mark as used, add to current permutation',
        highlight: 'normal'
      },
      {
        lineNumber: 15,
        variables: { nums: [1, 2, 3], result: [], current: [1, 2], used: [true, true, false] },
        explanation: 'Choose second element (2), add to permutation',
        highlight: 'normal'
      },
      {
        lineNumber: 9,
        variables: { nums: [1, 2, 3], result: [[1, 2, 3]], current: [1, 2, 3], used: [true, true, true] },
        explanation: 'Found complete permutation [1,2,3] - add to result!',
        highlight: 'solution'
      },
      {
        lineNumber: 23,
        variables: { nums: [1, 2, 3], result: [[1, 2, 3]], current: [1, 2], used: [true, true, false] },
        explanation: 'Backtrack: remove last element (3), mark as unused',
        highlight: 'backtrack'
      }
    ];
    
    setExecutionSteps(mockSteps);
    
    // Auto-advance through steps
    let step = 0;
    const interval = setInterval(() => {
      if (step < mockSteps.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsExecuting(false);
      }
    }, 1500);
  }, []);

  const selectedTemplateObj = getSelectedTemplateObj();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              💻 Interactive Code Explorer
            </h2>
            <p className="text-gray-600">
              Study, modify, and execute backtracking algorithms with step-by-step visualization
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as typeof selectedLanguage)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            {/* Current Pattern */}
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
              { id: 'template', label: 'Algorithm Templates', icon: '📝' },
              { id: 'custom', label: 'Custom Code', icon: '✏️' },
              { id: 'execution', label: 'Step-by-Step', icon: '🔍' },
              { id: 'comparison', label: 'Compare Patterns', icon: '⚖️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'template' && (
            <div className="space-y-6">
              {/* Template Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Choose Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {getCurrentTemplates().map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplateObj && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Code Display */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-gray-300 font-medium">
                          {selectedTemplateObj.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {selectedTemplateObj.language}
                          </span>
                          <button
                            onClick={handleExecuteCode}
                            disabled={isExecuting}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {isExecuting ? 'Executing...' : 'Run Code'}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto bg-gray-900 min-h-96">
                        <code>{selectedTemplateObj.code}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Explanation Panel */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Algorithm Explanation</h4>
                      <p className="text-blue-700 text-sm">{selectedTemplateObj.explanation}</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Complexity Analysis</h4>
                      <div className="space-y-1 text-sm text-yellow-700">
                        <div><strong>Time:</strong> {selectedTemplateObj.complexity.time}</div>
                        <div><strong>Space:</strong> {selectedTemplateObj.complexity.space}</div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Key Points</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        {selectedTemplateObj.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Write Your Own Implementation</h3>
                <button
                  onClick={() => {
                    if (selectedTemplateObj) {
                      setCustomCode(selectedTemplateObj.code);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Load Template
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2">
                  <span className="text-gray-300 font-medium">Custom {selectedLanguage} Code</span>
                </div>
                <textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                  placeholder={`Write your ${selectedLanguage} backtracking implementation here...`}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleExecuteCode}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Execute Code
                </button>
              </div>
            </div>
          )}

          {activeTab === 'execution' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Step-by-Step Execution</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {executionSteps.length}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(Math.min(executionSteps.length - 1, currentStep + 1))}
                      disabled={currentStep === executionSteps.length - 1}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {executionSteps.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Step Info */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${
                      executionSteps[currentStep]?.highlight === 'solution' ? 'bg-green-50 border-green-300' :
                      executionSteps[currentStep]?.highlight === 'backtrack' ? 'bg-red-50 border-red-300' :
                      executionSteps[currentStep]?.highlight === 'constraint' ? 'bg-yellow-50 border-yellow-300' :
                      'bg-blue-50 border-blue-300'
                    }`}>
                      <h4 className="font-semibold mb-2">Current Step</h4>
                      <p className="text-sm">{executionSteps[currentStep]?.explanation}</p>
                      <div className="mt-2 text-xs text-gray-600">
                        Line {executionSteps[currentStep]?.lineNumber}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Variable State</h4>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(executionSteps[currentStep]?.variables, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Execution Timeline */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-4">Execution Timeline</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {executionSteps.map((step, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                            index === currentStep ? 'bg-blue-100 border border-blue-300' :
                            index < currentStep ? 'bg-gray-100' : 'bg-gray-50'
                          }`}
                          onClick={() => setCurrentStep(index)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Step {index + 1}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              step.highlight === 'solution' ? 'bg-green-200 text-green-800' :
                              step.highlight === 'backtrack' ? 'bg-red-200 text-red-800' :
                              step.highlight === 'constraint' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {step.highlight}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1 truncate">{step.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {executionSteps.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg mb-2">No Execution Data</p>
                  <p>Run some code to see step-by-step execution!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Compare Algorithm Patterns</h3>
                <div className="text-sm text-gray-600">
                  Select patterns to compare their implementations
                </div>
              </div>

              {/* Pattern Selection */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(['permutations', 'combinations', 'subsets', 'nqueens', 'wordsearch'] as BacktrackingPattern[]).map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => {
                      if (comparePatterns.includes(pattern)) {
                        setComparePatterns(prev => prev.filter(p => p !== pattern));
                      } else if (comparePatterns.length < 2) {
                        setComparePatterns(prev => [...prev, pattern]);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      comparePatterns.includes(pattern)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={!comparePatterns.includes(pattern) && comparePatterns.length >= 2}
                  >
                    <div className="text-2xl mb-2">
                      {pattern === 'permutations' ? '🔄' :
                       pattern === 'combinations' ? '🎯' :
                       pattern === 'subsets' ? '⚡' :
                       pattern === 'nqueens' ? '👑' : '🔍'}
                    </div>
                    <div className="font-medium capitalize">{pattern}</div>
                  </button>
                ))}
              </div>

              {/* Comparison Display */}
              {comparePatterns.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {comparePatterns.map((pattern) => {
                    const templates = getCodeTemplates()[pattern];
                    const template = templates?.[0];
                    
                    return template ? (
                      <div key={pattern} className="bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2">
                          <span className="text-white font-medium capitalize">{pattern}</span>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-gray-700">Time Complexity: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">{template.complexity.time}</code>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Space Complexity: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">{template.complexity.space}</code>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Key Features:</span>
                              <ul className="mt-1 space-y-1">
                                {template.keyPoints.slice(0, 3).map((point, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {comparePatterns.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">⚖️</div>
                  <p className="text-lg mb-2">Select Patterns to Compare</p>
                  <p>Choose up to 2 algorithm patterns to see side-by-side comparison</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSection;
