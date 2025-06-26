'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { PitfallChallenge } from '../components/PitfallChallenge'

export default function PitfallsSection() {
  const pitfalls = [
    {
      title: "Using on unsorted array",
      problem: "Two pointers only work when array is sorted",
      solution: "Either sort first O(n log n) or use hash map O(n)"
    },
    {
      title: "Not handling edge cases",
      problem: "Empty array, single element, no solution",
      solution: "Check for empty array, single element at start"
    },
    {
      title: "Infinite loop with left >= right",
      problem: "Using wrong loop condition",
      solution: "Use left < right in while condition"
    },
    {
      title: "Moving wrong pointer",
      problem: "Confusion about which pointer to move",
      solution: "Remember - small sum = move left right, big sum = move right left"
    },
    {
      title: "Assuming solution always exists",
      problem: "Not handling case where no solution exists",
      solution: "Return empty array if no solution found"
    }
  ]

  const challenges = [
    {
      title: "🐛 Pitfall 1: Wrong Loop Condition",
      buggyCode: `def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:  # BUG HERE!
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`,
      issue: "Using `left <= right` can cause infinite loops or wrong results",
      fix: "Use `left < right` - we need two different elements",
      explanation: "When left equals right, we're looking at the same element twice, which violates the problem constraint."
    },
    {
      title: "🐛 Pitfall 2: Wrong Pointer Movement",
      buggyCode: `def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            right -= 1  # BUG HERE!
        else:
            left += 1   # BUG HERE!
    
    return []`,
      issue: "Moving pointers in wrong direction",
      fix: "If sum < target: move left→ (increase). If sum > target: move right← (decrease)",
      explanation: "Wrong pointer movement will never converge to the solution and may miss valid pairs."
    },
    {
      title: "🐛 Pitfall 3: Unsorted Array Assumption",
      buggyCode: `def two_sum(nums, target):
    # Assuming array is sorted, but it's not!
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`,
      issue: "Two pointers only work on sorted arrays",
      fix: "Either sort the array first or use hashmap approach for unsorted arrays",
      explanation: "The two pointers technique relies on the sorted property to make intelligent decisions about pointer movement."
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Pitfalls Overview Card */}
      <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl p-8 border border-red-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="w-7 h-7 mr-3 text-orange-400" />
          ⚠️ Common Pitfalls & How to Avoid Them
        </h3>
        <div className="space-y-4">
          <p className="text-blue-200 leading-relaxed">
            Even the slightest mistake can lead to incorrect results or infinite loops. 
            Let's explore some common pitfalls and how to steer clear of them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pitfalls.map((pitfall, index) => (
              <div key={index} className="bg-red-900/20 p-6 rounded-xl border-l-4 border-red-500">
                <h4 className="text-xl font-bold text-red-400 mb-3">❌ PITFALL {index + 1}: {pitfall.title}</h4>
                <p className="text-red-300 mb-2"><strong>Problem:</strong> {pitfall.problem}</p>
                <p className="text-green-300"><strong>Solution:</strong> {pitfall.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Pitfall Exploration */}
      <div className="bg-gradient-to-br from-gray-900/60 to-red-900/60 rounded-2xl p-8 border border-gray-600/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="w-7 h-7 mr-3 text-red-400" />
          🔍 Interactive Pitfall Exploration
        </h3>
        
        <div className="space-y-6">
          <p className="text-blue-200 leading-relaxed">
            Think you can spot the mistakes? Below are buggy code snippets with common pitfalls. 
            Click on each snippet to reveal the issues and learn how to fix them!
          </p>
          
          {/* Interactive Challenge Examples */}
          <div className="space-y-6">
            {challenges.map((challenge, index) => (
              <PitfallChallenge key={index} challenge={challenge} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}