# Arrays & Two Pointers - Complete Mastery Guide 🎯

## 📚 Table of Contents
1. [Core Concepts](#core-concepts)
2. [Pattern Recognition](#pattern-recognition)
3. [Visual Examples](#visual-examples)
4. [Problem Categories](#problem-categories)
5. [Step-by-Step Solutions](#step-by-step-solutions)
6. [Practice Problems](#practice-problems)

---

## 🎯 Core Concepts

### What are Arrays?
Arrays are contiguous memory locations that store elements of the same data type.

```
Visual: Array Structure
Index:  0   1   2   3   4
Array: [5, 2, 8, 1, 9]
       ↑              ↑
    Start           End
```

### Two Pointers Technique
A powerful technique using two pointers to traverse arrays efficiently.

```
Types of Two Pointers:
1. Opposite Direction (left, right)
2. Same Direction (slow, fast)
3. Sliding Window (start, end)
```

---

## 🔍 Pattern Recognition

### When to Use Two Pointers:
✅ **Sorted Array Problems**
✅ **Finding Pairs/Triplets**
✅ **Palindrome Checking**
✅ **Sliding Window Problems**
✅ **Removing Duplicates**

### Visual Pattern Examples:

#### 1. Opposite Direction Pattern
```
Target Sum = 9
[1, 2, 6, 8, 9]
 ↑           ↑
left       right

Step 1: 1 + 9 = 10 > 9, move right pointer left
[1, 2, 6, 8, 9]
 ↑        ↑
left    right

Step 2: 1 + 8 = 9 ✓ Found!
```

#### 2. Fast-Slow Pointer Pattern
```
Finding Cycle in Array (Floyd's Algorithm)
[1, 2, 3, 4, 2] (index 4 points to index 2)

slow: 0 → 1 → 2 → 3 → 2 → 3 → 2...
fast: 0 → 2 → 3 → 2 → 3 → 2 → 3...
         ↑     ↑
       Meeting point (cycle detected)
```

---

## 📊 Visual Examples

### Problem 1: Two Sum (Sorted Array)
```python
def two_sum_sorted(nums, target):
    """
    Visual Walkthrough:
    nums = [2, 7, 11, 15], target = 9
    
    Step 1: [2, 7, 11, 15]  left=0, right=3
             ↑          ↑   sum = 2+15 = 17 > 9, right--
    
    Step 2: [2, 7, 11, 15]  left=0, right=2  
             ↑      ↑       sum = 2+11 = 13 > 9, right--
    
    Step 3: [2, 7, 11, 15]  left=0, right=1
             ↑  ↑           sum = 2+7 = 9 ✓ Found!
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []

# Test
nums = [2, 7, 11, 15]
target = 9
print(two_sum_sorted(nums, target))  # Output: [0, 1]
```

### Problem 2: Container With Most Water
```python
def max_area(height):
    """
    Visual Example:
    height = [1,8,6,2,5,4,8,3,7]
    
    Initial: left=0, right=8
    [1,8,6,2,5,4,8,3,7]
     ↑               ↑
     
    Area = min(1,7) * (8-0) = 1 * 8 = 8
    Move left++ (smaller height)
    
    Step 2: left=1, right=8
    [1,8,6,2,5,4,8,3,7]
       ↑             ↑
       
    Area = min(8,7) * (8-1) = 7 * 7 = 49
    Move right-- (smaller height)
    
    Continue until left meets right...
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_area = min(height[left], height[right]) * width
        max_water = max(max_water, current_area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water

# Test
height = [1,8,6,2,5,4,8,3,7]
print(max_area(height))  # Output: 49
```

---

## 🎯 Problem Categories

### Category 1: Pair Finding Problems

#### Three Sum Problem
```python
def three_sum(nums):
    """
    Visual Process:
    nums = [-1,0,1,2,-1,-4]
    After sorting: [-4,-1,-1,0,1,2]
    
    i=0: target = -(-4) = 4
    [-4,-1,-1,0,1,2]
      ↑  ↑       ↑
      i  left   right
      
    Continue with two pointers...
    """
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates
        if i > 0 and nums[i] == nums[i-1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            if nums[left] + nums[right] == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                    
                left += 1
                right -= 1
            elif nums[left] + nums[right] < target:
                left += 1
            else:
                right -= 1
    
    return result
```

### Category 2: Sliding Window Problems

#### Longest Substring Without Repeating Characters
```python
def length_of_longest_substring(s):
    """
    Visual Sliding Window:
    s = "abcabcbb"
    
    Window: [a]     → length = 1
    Window: [ab]    → length = 2  
    Window: [abc]   → length = 3
    Window: [abc|a] → 'a' repeats, shrink from left
    Window: [bc|a]  → length = 3
    Window: [bca]   → length = 3
    Window: [cab]   → length = 3
    Window: [ab]    → 'b' repeats, shrink
    Window: [b]     → length = 1
    Window: [bb]    → 'b' repeats, shrink
    Window: [b]     → length = 1
    
    Max length = 3
    """
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Shrink window until no duplicates
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## 🚀 Step-by-Step Problem Solving Framework

### Step 1: Identify the Pattern
```
Questions to Ask:
1. Is the array sorted?
2. Do I need to find pairs/triplets?
3. Is this a sliding window problem?
4. Am I looking for a specific sum?
5. Do I need to remove duplicates?
```

### Step 2: Choose Pointer Strategy
```
Strategies:
1. Opposite Direction: For sorted arrays, sum problems
2. Same Direction: For cycle detection, fast-slow
3. Sliding Window: For substring/subarray problems
```

### Step 3: Handle Edge Cases
```
Common Edge Cases:
1. Empty array
2. Single element
3. All elements same
4. Duplicates
5. Negative numbers
```

---

## 🧠 Advanced Patterns

### Fast-Slow Pointer (Floyd's Cycle Detection)
```python
def has_cycle(head):
    """
    Visual Cycle Detection:
    
    No Cycle:
    1 → 2 → 3 → 4 → None
    
    With Cycle:
    1 → 2 → 3 → 4
        ↑       ↓
        6 ← 5 ←-
    
    slow moves 1 step, fast moves 2 steps
    If there's a cycle, they will meet!
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while fast and fast.next:
        if slow == fast:
            return True
        slow = slow.next
        fast = fast.next.next
    
    return False
```

### Remove Duplicates Pattern
```python
def remove_duplicates(nums):
    """
    Visual Process:
    nums = [1,1,2,2,3,4,4,5]
    
    slow=0, fast=0: nums[0]=1
    [1,1,2,2,3,4,4,5]
     ↑
   slow,fast
   
    slow=0, fast=1: nums[1]=1 (duplicate, skip)
    [1,1,2,2,3,4,4,5]
     ↑ ↑
   slow fast
   
    slow=0, fast=2: nums[2]=2 (new, copy)
    [1,2,2,2,3,4,4,5]
     ↑   ↑
   slow fast → slow++
   
    Continue pattern...
    Result: [1,2,3,4,5,_,_,_]
    """
    if not nums:
        return 0
    
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1
```

---

## 📝 Practice Problems by Difficulty

### Easy Level 🟢
1. **Two Sum** (LeetCode 1)
2. **Remove Duplicates from Sorted Array** (LeetCode 26)
3. **Merge Sorted Array** (LeetCode 88)
4. **Valid Palindrome** (LeetCode 125)

### Medium Level 🟡
1. **3Sum** (LeetCode 15)
2. **Container With Most Water** (LeetCode 11)
3. **Longest Substring Without Repeating Characters** (LeetCode 3)
4. **Find the Duplicate Number** (LeetCode 287)

### Hard Level 🔴
1. **Trapping Rain Water** (LeetCode 42)
2. **Minimum Window Substring** (LeetCode 76)
3. **Sliding Window Maximum** (LeetCode 239)

---

## 🎯 Time & Space Complexity Guide

### Two Pointers Patterns:
```
Pattern                   Time        Space
Opposite Direction       O(n)        O(1)
Same Direction          O(n)        O(1)
Sliding Window          O(n)        O(k)
```

### When Two Pointers Beats Brute Force:
```
Problem Type           Brute Force    Two Pointers
Two Sum (sorted)       O(n²)         O(n)
Three Sum             O(n³)         O(n²)
Container Water       O(n²)         O(n)
```

---

## 🏆 Pro Tips for Interviews

### 1. Always Draw It Out
```
Before coding, draw the array and pointer movements
This helps visualize the solution and catch edge cases
```

### 2. Start with Brute Force
```
Explain O(n²) solution first, then optimize with two pointers
Shows your thinking process and problem-solving approach
```

### 3. Handle Edge Cases
```
Empty arrays, single elements, all same values
Discuss these before implementing
```

### 4. Dry Run Your Code
```
Walk through 2-3 examples with your interviewer
Trace through pointer movements step by step
```

---

## 🔗 Related Patterns
- **Binary Search**: For sorted array optimization
- **Sliding Window**: For subarray/substring problems  
- **Hash Tables**: For unsorted array problems
- **Dynamic Programming**: For optimization problems

Remember: Two pointers is about **efficiency** - turning O(n²) into O(n) solutions! 🚀
