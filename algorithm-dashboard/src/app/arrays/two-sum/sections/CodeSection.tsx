'use client'

import { motion } from 'framer-motion'
import { Code, AlertTriangle, Brain } from 'lucide-react'
import { CodeImplementation } from '../components/CodeImplementation'
import { CodeBlock } from '../components/CodeBlock'

export default function CodeSection() {
  const solutionApproaches = [
    {
      name: "Brute Force",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      description: "Check every pair - Educational only",
      useCase: "Learning purposes, never use in interviews",
      color: "red"
    },
    {
      name: "Hash Map",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      description: "Optimal for unsorted arrays",
      useCase: "Most common interview solution",
      color: "green"
    },
    {
      name: "Two Pointers",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      description: "Optimal for sorted arrays",
      useCase: "When array is sorted or can be sorted",
      color: "blue"
    }
  ]

  const edgeCases = [
    { case: "Empty array", input: "[]", expected: "[]", risk: "High" },
    { case: "Single element", input: "[5]", expected: "[]", risk: "High" },
    { case: "Two elements match", input: "[1,2], target=3", expected: "[0,1]", risk: "Medium" },
    { case: "No solution exists", input: "[1,2,3], target=10", expected: "[]", risk: "Medium" },
    { case: "Negative numbers", input: "[-3,-1,0,2], target=-1", expected: "[1,2]", risk: "Low" },
    { case: "Duplicates", input: "[3,3], target=6", expected: "[0,1]", risk: "Low" },
    { case: "Large numbers", input: "[10^9, 10^9-1], target=2*10^9-1", expected: "[0,1]", risk: "Low" }
  ]

  const interviewSteps = [
    {
      title: "1️⃣ Clarify the Problem",
      description: "Is the array sorted? Do we need exact indices or just values? Can I modify the array?",
      color: "blue"
    },
    {
      title: "2️⃣ Discuss Approaches",
      description: "I can use brute force O(n²), hash map O(n), or if sorted - two pointers O(n) with O(1) space.",
      color: "green"
    },
    {
      title: "3️⃣ Code & Test",
      description: "Let me implement two pointers, then test with edge cases like empty array, no solution...",
      color: "purple"
    }
  ]

  const proTips = [
    {
      title: "Start with brute force",
      description: "Show you understand the problem, then optimize",
      color: "cyan-400"
    },
    {
      title: "Draw the solution",
      description: "Visualize pointer movements on whiteboard",
      color: "green-400"
    },
    {
      title: "Test edge cases",
      description: "Empty array, single element, no solution",
      color: "blue-400"
    },
    {
      title: "Explain time/space",
      description: "O(n) time because single pass, O(1) space",
      color: "purple-400"
    }
  ]

  const testSuiteCode = `def test_two_sum():
    """Comprehensive test suite for Two Sum"""
    
    # Test cases: (array, target, expected_result)
    test_cases = [
        # Basic cases
        ([2, 7, 11, 15], 9, [0, 1]),
        ([2, 3, 4], 6, [0, 2]),
        
        # Edge cases
        ([], 0, []),                    # Empty array
        ([5], 5, []),                   # Single element
        ([1, 2], 3, [0, 1]),           # Two elements
        
        # No solution
        ([1, 2, 3], 10, []),
        
        # Negative numbers
        ([-3, -1, 0, 2, 4], -1, [0, 2]),
        
        # Duplicates
        ([3, 3], 6, [0, 1]),
        
        # Large numbers
        ([1000000, 2000000], 3000000, [0, 1])
    ]
    
    passed = 0
    for i, (nums, target, expected) in enumerate(test_cases):
        result = two_sum_sorted(nums, target)
        if result == expected:
            print(f"✅ Test {i+1} passed")
            passed += 1
        else:
            print(f"❌ Test {i+1} failed: got {result}, expected {expected}")
    
    print(f"\\n🎯 Results: {passed}/{len(test_cases)} tests passed")
    
test_two_sum()`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Solution Approaches Overview */}
      <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Code className="w-7 h-7 mr-3 text-cyan-400" />
          🚀 Solution Approaches - Complete Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {solutionApproaches.map((approach, index) => (
            <div key={index} className={`bg-gradient-to-br from-${approach.color}-900/50 to-${approach.color}-800/50 rounded-xl p-6 border border-${approach.color}-400/30`}>
              <h4 className={`text-xl font-bold text-${approach.color}-400 mb-3`}>{approach.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className={`font-mono text-${approach.color}-300`}>{approach.timeComplexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Space:</span>
                  <span className={`font-mono text-${approach.color}-300`}>{approach.spaceComplexity}</span>
                </div>
                <p className="text-sm text-gray-400 mt-3">{approach.description}</p>
                <div className={`text-xs bg-${approach.color}-900/30 rounded-lg p-2 mt-2`}>
                  <strong>Use Case:</strong> {approach.useCase}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hash Map Solution - Most Important */}
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-400/30 mb-6">
          <h4 className="text-xl font-bold text-green-400 mb-4">🏆 Hash Map Solution (Most Important)</h4>
          <CodeBlock
            language="javascript"
            code={`function twoSumOptimal(nums, target) {
  /**
   * 🏆 OPTIMAL SOLUTION for unsorted arrays
   * 
   * 💡 Core Insight: For each number x, we need (target - x)
   * Instead of searching the array, store what we've seen in a hash map!
   * 
   * Time: O(n) - Single pass through array
   * Space: O(n) - Hash map storage
   */
  const seen = new Map(); // num -> index mapping
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    // 🔍 Have we seen the complement before?
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    
    // 📝 Remember this number for future iterations
    seen.set(nums[i], i);
  }
  
  return []; // No solution found
}

// 🎯 WHY THIS WORKS:
// When we're at index i looking at nums[i]:
// - We need to find (target - nums[i]) somewhere in the array
// - Instead of searching the rest of the array (O(n))
// - We check if we've seen it before (O(1) hash lookup)`}
          />
        </div>

        {/* Two Pointers Solution */}
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-6 border border-blue-400/30 mb-6">
          <h4 className="text-xl font-bold text-blue-400 mb-4">🎯 Two Pointers Solution (Sorted Arrays)</h4>
          <CodeBlock
            language="javascript"
            code={`function twoSumSorted(nums, target) {
  /**
   * 🎯 OPTIMAL for sorted arrays
   * 
   * 💡 Core Insight: Use the sorted property!
   * - If sum is too small → move left pointer right (increase sum)
   * - If sum is too big → move right pointer left (decrease sum)
   * 
   * Time: O(n) - Each element visited once
   * Space: O(1) - Only two pointers
   */
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const currentSum = nums[left] + nums[right];
    
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++; // Need bigger sum
    } else {
      right--; // Need smaller sum
    }
  }
  
  return []; // No solution found
}`}
          />
        </div>

        {/* Advanced Variations */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-400/30">
          <h4 className="text-xl font-bold text-purple-400 mb-4">🧠 Advanced Variations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h5 className="font-bold text-yellow-300 mb-2">Multiple Solutions</h5>
              <CodeBlock
                language="javascript"
                code={`function twoSumAllPairs(nums, target) {
  const result = [];
  const seen = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      for (const prevIndex of seen.get(complement)) {
        result.push([prevIndex, i]);
      }
    }
    
    if (!seen.has(nums[i])) {
      seen.set(nums[i], []);
    }
    seen.get(nums[i]).push(i);
  }
  
  return result;
}`}
              />
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h5 className="font-bold text-yellow-300 mb-2">Closest Two Sum</h5>
              <CodeBlock
                language="javascript"
                code={`function twoSumClosest(nums, target) {
  const numsWithIndex = nums.map((num, i) => [num, i]);
  numsWithIndex.sort((a, b) => a[0] - b[0]);
  
  let left = 0, right = nums.length - 1;
  let closestSum = Infinity;
  let result = [];
  
  while (left < right) {
    const currentSum = numsWithIndex[left][0] + numsWithIndex[right][0];
    
    if (Math.abs(currentSum - target) < Math.abs(closestSum - target)) {
      closestSum = currentSum;
      result = [numsWithIndex[left][1], numsWithIndex[right][1]];
    }
    
    if (currentSum < target) left++;
    else right--;
  }
  
  return result.sort((a, b) => a - b);
}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Strategy Overview */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-8 border border-indigo-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Code className="w-7 h-7 mr-3 text-indigo-400" />
          💻 Implementation Masterclass
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-cyan-400 mb-4 text-lg">🎯 Two Approaches</h4>
            <div className="space-y-4">
              <div className="bg-blue-900/50 p-4 rounded-lg">
                <h5 className="font-bold text-blue-300 mb-2">1️⃣ Two Pointers (Sorted Array)</h5>
                <p className="text-blue-200 text-sm mb-2">✅ Time: O(n) | Space: O(1)</p>
                <p className="text-blue-200 text-sm">Perfect for sorted arrays. Uses constant space.</p>
              </div>
              <div className="bg-green-900/50 p-4 rounded-lg">
                <h5 className="font-bold text-green-300 mb-2">2️⃣ Hash Map (Any Array)</h5>
                <p className="text-green-200 text-sm mb-2">✅ Time: O(n) | Space: O(n)</p>
                <p className="text-green-200 text-sm">Works on any array. Uses extra space for hash map.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-purple-400 mb-4 text-lg">🔍 When to Use Which?</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-semibold">Array is sorted</p>
                  <p className="text-gray-300">→ Use Two Pointers for O(1) space</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-semibold">Array is unsorted</p>
                  <p className="text-gray-300">→ Use Hash Map or sort first</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-semibold">Need original indices</p>
                  <p className="text-gray-300">→ Hash Map preserves original positions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Complexity Comparison */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30">
          <h4 className="font-bold text-white mb-4 text-center">⚡ Complexity Quick Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-red-900/30 rounded-lg border border-red-400/30">
              <p className="font-bold text-red-300 mb-1">❌ Brute Force</p>
              <p className="text-red-200">O(n²) time, O(1) space</p>
            </div>
            <div className="text-center p-3 bg-blue-900/30 rounded-lg border border-blue-400/30">
              <p className="font-bold text-blue-300 mb-1">✅ Two Pointers</p>
              <p className="text-blue-200">O(n) time, O(1) space</p>
            </div>
            <div className="text-center p-3 bg-green-900/30 rounded-lg border border-green-400/30">
              <p className="font-bold text-green-300 mb-1">✅ Hash Map</p>
              <p className="text-green-200">O(n) time, O(n) space</p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Language Implementation */}
      <CodeImplementation />
      
      {/* Edge Cases & Testing */}
      <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-2xl p-8 border border-orange-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="w-7 h-7 mr-3 text-orange-400" />
          🧪 Edge Cases & Testing Strategy
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-orange-400 mb-4 text-lg">🚨 Critical Edge Cases</h4>
            <div className="space-y-3 text-sm">
              {edgeCases.map((test, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  test.risk === 'High' ? 'bg-red-900/30 border-red-500' :
                  test.risk === 'Medium' ? 'bg-yellow-900/30 border-yellow-500' :
                  'bg-green-900/30 border-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white">{test.case}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      test.risk === 'High' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'
                    }`}>
                      {test.risk}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">Input: {test.input}</p>
                  <p className="text-gray-300 text-xs">Expected: {test.expected}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-green-400 mb-4 text-lg">✅ Comprehensive Test Suite</h4>
            <CodeBlock 
              code={testSuiteCode}
              language="python"
              title="Comprehensive Test Suite"
            />
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Brain className="w-7 h-7 mr-3 text-pink-400" />
          🎯 Interview Success Strategy
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-pink-400 mb-4 text-lg">💬 What to Say in Interview</h4>
            <div className="space-y-4 text-sm">
              {interviewSteps.map((step, index) => (
                <div key={index} className={`bg-${step.color}-900/30 p-4 rounded-lg`}>
                  <p className={`font-bold text-${step.color}-300 mb-2`}>{step.title}</p>
                  <p className={`text-${step.color}-200`}>"{step.description}"</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="font-bold text-yellow-400 mb-4 text-lg">⚡ Pro Tips</h4>
            <div className="space-y-3 text-sm">
              {proTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 bg-${tip.color} rounded-full mt-2`}></div>
                  <div>
                    <p className="text-white font-semibold">{tip.title}</p>
                    <p className="text-gray-300">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
