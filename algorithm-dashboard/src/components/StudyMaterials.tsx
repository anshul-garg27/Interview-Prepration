import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { BookOpen, Search, Filter, Clock, FileText } from 'lucide-react'

interface StudyMaterial {
  name: string
  content: string
  size: number
  category: string
}

interface StudyMaterialsProps {}

const StudyMaterials: React.FC<StudyMaterialsProps> = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, this would fetch from your markdown files
  useEffect(() => {
    const mockMaterials: StudyMaterial[] = [
      {
        name: 'Arrays & Two Pointers Complete',
        content: `# Arrays & Two Pointers - Complete Guide

## Overview
The two pointers technique is a powerful algorithmic pattern used to solve array and string problems efficiently.

## Key Concepts
- **Two Pointers**: Use two indices to traverse the array
- **Time Complexity**: Often O(n) instead of O(n²)
- **Space Complexity**: Usually O(1)

## Common Patterns
1. **Opposite Direction**: Start from both ends
2. **Same Direction**: Both pointers move forward
3. **Sliding Window**: Dynamic window size

## Example Problems
- Two Sum in Sorted Array
- Remove Duplicates
- Container With Most Water
- Trapping Rain Water

## Implementation
\`\`\`javascript
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  
  return [];
}
\`\`\`

## Practice Problems
1. **Easy**: Two Sum II, Valid Palindrome
2. **Medium**: 3Sum, Container With Most Water
3. **Hard**: Trapping Rain Water, Minimum Window Substring`,
        size: 1247,
        category: 'Arrays'
      },
      {
        name: 'Trees Complete Guide',
        content: `# Binary Trees - Complete Guide

## Tree Fundamentals
A binary tree is a hierarchical data structure where each node has at most two children.

## Tree Traversals
### Depth-First Search (DFS)
- **Preorder**: Root → Left → Right
- **Inorder**: Left → Root → Right  
- **Postorder**: Left → Right → Root

### Breadth-First Search (BFS)
- **Level Order**: Process nodes level by level

## Binary Search Trees (BST)
- Left subtree values < root
- Right subtree values > root
- Inorder traversal gives sorted sequence

## Common Operations
- Insert: O(log n) average, O(n) worst
- Search: O(log n) average, O(n) worst
- Delete: O(log n) average, O(n) worst

## Advanced Topics
- AVL Trees (Self-balancing)
- Red-Black Trees
- Segment Trees
- Fenwick Trees`,
        size: 987,
        category: 'Trees'
      },
      {
        name: 'Dynamic Programming Strategy',
        content: `# Dynamic Programming - Master Strategy

## Core Principles
1. **Optimal Substructure**: Solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: Same subproblems solved multiple times
3. **Memoization**: Store results to avoid recomputation

## Approaches
### Top-Down (Memoization)
- Start with original problem
- Break into subproblems recursively
- Cache results

### Bottom-Up (Tabulation)
- Start with smallest subproblems
- Build up to original problem
- Use iterative approach

## Classic Problems
- Fibonacci Sequence
- Climbing Stairs
- Coin Change
- Longest Common Subsequence
- Knapsack Problem

## Problem-Solving Framework
1. Identify if DP is applicable
2. Define state representation
3. Write recurrence relation
4. Determine base cases
5. Implement and optimize`,
        size: 756,
        category: 'Dynamic Programming'
      },
      {
        name: 'Graphs Complete Ecosystem',
        content: `# Graph Algorithms - Complete Ecosystem

## Graph Representations
- **Adjacency Matrix**: 2D array representation
- **Adjacency List**: Array of lists/sets
- **Edge List**: List of all edges

## Traversal Algorithms
### Breadth-First Search (BFS)
- Uses queue (FIFO)
- Level-by-level exploration
- Shortest path in unweighted graphs

### Depth-First Search (DFS)
- Uses stack (LIFO) or recursion
- Go deep then backtrack
- Useful for cycle detection

## Shortest Path Algorithms
- **Dijkstra**: Single source, non-negative weights
- **Bellman-Ford**: Single source, handles negative weights
- **Floyd-Warshall**: All pairs shortest path

## Minimum Spanning Tree
- **Kruskal's Algorithm**: Edge-based, uses Union-Find
- **Prim's Algorithm**: Vertex-based, uses priority queue

## Advanced Topics
- Topological Sorting
- Strongly Connected Components
- Network Flow Algorithms`,
        size: 1156,
        category: 'Graphs'
      }
    ]

    // Simulate loading
    setTimeout(() => {
      setMaterials(mockMaterials)
      setIsLoading(false)
    }, 1000)
  }, [])

  const categories = ['All', ...new Set(materials.map(m => m.category))]
  
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">📚 Study Materials Library</h2>
        <p className="text-blue-200">
          Your comprehensive algorithm and data structure study guides
        </p>
      </motion.div>

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-80 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none appearance-none"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMaterial ? (
        // Material Viewer
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedMaterial.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-blue-300">
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{formatFileSize(selectedMaterial.size)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{estimateReadTime(selectedMaterial.content)} min read</span>
                </span>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {selectedMaterial.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedMaterial(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ← Back to Library
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-blue-300 mb-4 mt-8">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold text-blue-200 mb-3 mt-6">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="text-gray-300 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="text-gray-300 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  code: ({ children }) => <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-700">{children}</pre>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>
                }}
              >
                {selectedMaterial.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ) : (
        // Materials Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMaterial(material)}
              className="group cursor-pointer"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {material.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                      {material.category}
                    </span>
                  </div>
                </div>

                <div className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {material.content.substring(0, 150)}...
                </div>

                <div className="flex items-center justify-between text-blue-300 text-sm">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{formatFileSize(material.size)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadTime(material.content)} min</span>
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                    Read More →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No materials found matching your search.</p>
        </div>
      )}

      {/* Statistics */}
      {!selectedMaterial && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-blue-400">{materials.length}</div>
            <div className="text-gray-300 text-sm">Total Materials</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-green-400">{categories.length - 1}</div>
            <div className="text-gray-300 text-sm">Categories</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(materials.reduce((acc, m) => acc + m.size, 0) / 1024)}
            </div>
            <div className="text-gray-300 text-sm">Total KB</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {materials.reduce((acc, m) => acc + estimateReadTime(m.content), 0)}
            </div>
            <div className="text-gray-300 text-sm">Total Minutes</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyMaterials
