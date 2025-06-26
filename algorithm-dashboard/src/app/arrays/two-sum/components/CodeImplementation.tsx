'use client'

import { motion } from 'framer-motion'
import { Code, Zap } from 'lucide-react'
import { useState } from 'react'
import { CodeBlock } from './CodeBlock'

interface CodeLanguage {
  id: string
  name: string
  icon: string
  code: string
}

const codeImplementations: CodeLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    code: `// Two Sum - Optimized Two Pointers Approach
function twoSum(nums, target) {
    // Create array of [value, originalIndex] pairs and sort by value
    const indexedNums = nums.map((num, index) => [num, index])
                           .sort((a, b) => a[0] - b[0]);
    
    let left = 0;
    let right = indexedNums.length - 1;
    
    while (left < right) {
        const sum = indexedNums[left][0] + indexedNums[right][0];
        
        if (sum === target) {
            // Return original indices
            return [indexedNums[left][1], indexedNums[right][1]].sort((a, b) => a - b);
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return []; // No solution found
}

// Time: O(n log n) - due to sorting
// Space: O(n) - for the indexed array`
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    code: `# Two Sum - Hash Map Approach (Most Efficient)
def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    Returns indices of the two numbers.
    """
    seen = {}  # value -> index mapping
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []  # No solution found

# Time: O(n) - single pass
# Space: O(n) - hash map storage

# Alternative: Two Pointers (requires sorted array)
def two_sum_sorted(nums, target):
    """Two pointers approach for sorted arrays."""
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    code: `import java.util.*;

public class TwoSum {
    /**
     * Two Sum - Hash Map Solution
     * Time: O(n), Space: O(n)
     */
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[]{}; // No solution
    }
    
    /**
     * Two Sum - Two Pointers (for sorted array)
     * Time: O(n), Space: O(1)
     */
    public int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            
            if (sum == target) {
                return new int[]{left, right};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{};
    }
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    code: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    /**
     * Two Sum - Hash Map Approach
     * Time: O(n), Space: O(n)
     */
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            
            seen[nums[i]] = i;
        }
        
        return {}; // No solution
    }
    
    /**
     * Two Sum - Two Pointers (sorted array)
     * Time: O(n), Space: O(1)
     */
    vector<int> twoSumSorted(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            
            if (sum == target) {
                return {left, right};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return {};
    }
};`
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    code: `package main

import "fmt"

// TwoSum - Hash Map Approach
// Time: O(n), Space: O(n)
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        
        if idx, found := seen[complement]; found {
            return []int{idx, i}
        }
        
        seen[num] = i
    }
    
    return []int{} // No solution
}

// TwoSumSorted - Two Pointers for sorted array
// Time: O(n), Space: O(1)
func twoSumSorted(nums []int, target int) []int {
    left, right := 0, len(nums)-1
    
    for left < right {
        sum := nums[left] + nums[right]
        
        switch {
        case sum == target:
            return []int{left, right}
        case sum < target:
            left++
        default:
            right--
        }
    }
    
    return []int{}
}

func main() {
    nums := []int{2, 7, 11, 15}
    target := 9
    result := twoSum(nums, target)
    fmt.Printf("Indices: %v\\n", result)
}`
  }
]

export function CodeImplementation() {
  const [activeLanguage, setActiveLanguage] = useState('javascript')

  const currentImplementation = codeImplementations.find(lang => lang.id === activeLanguage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Language Selector */}
      <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 border border-gray-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Code className="w-7 h-7 mr-3 text-green-400" />
          💻 Multi-Language Implementation
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {codeImplementations.map((lang) => (
            <motion.button
              key={lang.id}
              onClick={() => setActiveLanguage(lang.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeLanguage === lang.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{lang.icon}</span>
              <span>{lang.name}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Active Implementation */}
        {currentImplementation && (
          <motion.div
            key={activeLanguage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CodeBlock
              code={currentImplementation.code}
              language={currentImplementation.id}
              title={`${currentImplementation.name} Implementation`}
              showLineNumbers={true}
            />
            
            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-blue-300 font-semibold">Performance Notes:</span>
              </div>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Hash Map approach: O(n) time, O(n) space - Most efficient for unsorted arrays</li>
                <li>• Two Pointers approach: O(n) time, O(1) space - Best for sorted arrays</li>
                <li>• Consider trade-offs between time and space complexity based on constraints</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
