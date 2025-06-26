# 🔍 Binary Search - Complete Mastery Guide

## 📚 What is Binary Search?

### 🤔 **The Core Insight - Why Binary Search is Magical**

**Real-World Analogy**: Like finding a page in a book
- **Method 1** (Linear): Start from page 1, flip through every page → O(n) time
- **Method 2** (Binary): Always open to middle, eliminate half → O(log n) time

**Key Requirements**:
✅ Array must be **SORTED** (ascending or descending)
✅ Elements must be **COMPARABLE** (can determine if target is bigger/smaller)

### 📖 **Binary Search Strategy - The Logic Explained:**

```
🎯 THE ALGORITHM:
1. Find middle element
2. Compare with target:
   - If equal: FOUND!
   - If target < middle: Search LEFT half
   - If target > middle: Search RIGHT half
3. Repeat on chosen half

WHY IT'S FAST:
Each comparison eliminates HALF the remaining elements!
Array size: 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1
Only ~10 steps to search 1000 elements!
```

### 🔍 **Visual Step-by-Step Execution:**

```
EXAMPLE: Find 5 in [1, 2, 3, 4, 5, 6, 7, 8, 9]

INITIAL STATE:
Array: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        ↑              ↑           ↑
     left=0         mid=4       right=8
                  (value=5)

┌─────────────────────────────────────────┐
│ STEP 1: Check middle element           │
│ left=0, right=8                        │
│ mid = (0 + 8) / 2 = 4                  │
│ arr[4] = 5                             │
│ target = 5                             │
│ 5 == 5 → FOUND! Return index 4        │
└─────────────────────────────────────────┘

MORE COMPLEX EXAMPLE: Find 7

┌─────────────────────────────────────────┐
│ STEP 1: Initial search                 │
│ Array: [1, 2, 3, 4, 5, 6, 7, 8, 9]    │
│         ↑              ↑           ↑    │
│      left=0         mid=4       right=8 │
│ arr[4] = 5, target = 7                 │
│ 7 > 5, search RIGHT half              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Search right half              │
│ Array: [1, 2, 3, 4, 5, 6, 7, 8, 9]    │
│                        ↑     ↑     ↑   │
│                     left=5 mid=6 right=8│
│ arr[6] = 7, target = 7                 │
│ 7 == 7 → FOUND! Return index 6        │
└─────────────────────────────────────────┘

RESULT: Found 7 at index 6
STEPS: Only 2 comparisons instead of 7!
```

### 🚀 **The Golden Binary Search Template:**

```python
def binary_search(nums, target):
    """
    🎯 MASTER TEMPLATE - Works for most binary search problems
    
    Time: O(log n) - eliminate half each iteration
    Space: O(1) - only use constant extra space
    """
    left = 0
    right = len(nums) - 1
    
    while left <= right:  # ⚠️ Important: <= not just <
        mid = left + (right - left) // 2  # ⚠️ Prevents overflow
        
        if nums[mid] == target:
            return mid  # Found target
        elif nums[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Target not found

# 🔍 WHY THESE DETAILS MATTER:
# 1. left <= right: Handles single element case
# 2. mid calculation: Prevents integer overflow in other languages
# 3. mid + 1 and mid - 1: Ensures we don't get stuck in infinite loop
```

## 🎯 Pattern 1: Basic Binary Search

### Problem:
Find the position of a target number in a sorted array.

### The Golden Template:
```python
def binary_search(nums, target):
    """
    Standard binary search template
    
    Time: O(log n) - cut array in half each time
    Space: O(1) - only use a few variables
    """
    left = 0
    right = len(nums) - 1
    
    while left <= right:  # Note: <= not just <
        mid = left + (right - left) // 2  # Prevents overflow
        
        print(f"Searching in range [{left}, {right}], checking index {mid} (value={nums[mid]})")
        
        if nums[mid] == target:
            return mid  # Found it!
        elif nums[mid] < target:
            left = mid + 1  # Target is in right half
            print(f"Target {target} > {nums[mid]}, searching right half")
        else:
            right = mid - 1  # Target is in left half
            print(f"Target {target} < {nums[mid]}, searching left half")
    
    return -1  # Not found

# Test it:
nums = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
result = binary_search(nums, target)
print(f"\nTarget {target} found at index: {result}")
```

### Why Binary Search is Fast:
```
Array size: 1,000,000 elements
Linear search: Up to 1,000,000 comparisons
Binary search: Only 20 comparisons maximum!

How? Each step eliminates half:
1,000,000 → 500,000 → 250,000 → 125,000 → ... → 1
```

## 🎯 Pattern 2: Find First/Last Occurrence

### 🤔 **Problem Understanding - The Duplicate Challenge**

**Real-World Analogy**: Like finding the first and last page of a chapter in a book
- **Regular binary search**: Finds any page in the chapter
- **First occurrence**: Find the very first page where the chapter starts
- **Last occurrence**: Find the very last page where the chapter ends

**Key Insight**: When we find the target, don't stop searching - continue to find the boundary!

### 📖 **Problem Statement:**
In a sorted array with duplicates, find the first or last occurrence of a target value.

**Example:**
```
Array: [1, 2, 2, 2, 3, 4, 5]
Target: 2

First occurrence: index 1  ← leftmost position
Last occurrence: index 3   ← rightmost position

Visual:
[1, 2, 2, 2, 3, 4, 5]
   ↑     ↑
 first  last
```

### 🎯 **Algorithm Strategy - Modified Binary Search:**

```
🎯 FINDING FIRST OCCURRENCE:
1. When nums[mid] == target: DON'T STOP!
2. Save current position as potential answer
3. Continue searching LEFT (right = mid - 1)
4. Keep going until we can't find any earlier occurrence

🎯 FINDING LAST OCCURRENCE:
1. When nums[mid] == target: DON'T STOP!
2. Save current position as potential answer  
3. Continue searching RIGHT (left = mid + 1)
4. Keep going until we can't find any later occurrence
```

### 🔍 **Step-by-Step Visual Trace for FIRST Occurrence:**

```
EXAMPLE: Find FIRST occurrence of 2 in [1, 2, 2, 2, 3, 4, 5]
Array indices:                           [0, 1, 2, 3, 4, 5, 6]

INITIAL STATE:
Array: [1, 2, 2, 2, 3, 4, 5]
        ↑           ↑
     left=0      right=6
     first_pos = -1

┌─────────────────────────────────────────┐
│ STEP 1: Initial search                  │
│ left=0, right=6, mid=(0+6)//2=3        │
│ nums[3] = 2 == target ✓                │
│ Found match! But continue searching LEFT│
│ first_pos = 3 (save current answer)    │
│ right = mid - 1 = 2                    │
│ Continue searching in [0, 2]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Search left half               │
│ left=0, right=2, mid=(0+2)//2=1        │
│ nums[1] = 2 == target ✓                │
│ Found earlier match!                    │
│ first_pos = 1 (update answer)          │
│ right = mid - 1 = 0                    │
│ Continue searching in [0, 0]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Search remaining                │
│ left=0, right=0, mid=(0+0)//2=0        │
│ nums[0] = 1 ≠ target                   │
│ 1 < 2, so left = mid + 1 = 1          │
│ Now left > right, exit loop            │
└─────────────────────────────────────────┘

FINAL RESULT: first_pos = 1
```

### 🔍 **Step-by-Step Visual Trace for LAST Occurrence:**

```
EXAMPLE: Find LAST occurrence of 2 in [1, 2, 2, 2, 3, 4, 5]
Array indices:                          [0, 1, 2, 3, 4, 5, 6]

INITIAL STATE:
Array: [1, 2, 2, 2, 3, 4, 5]
        ↑           ↑
     left=0      right=6
     last_pos = -1

┌─────────────────────────────────────────┐
│ STEP 1: Initial search                  │
│ left=0, right=6, mid=(0+6)//2=3        │
│ nums[3] = 2 == target ✓                │
│ Found match! But continue searching RIGHT│
│ last_pos = 3 (save current answer)     │
│ left = mid + 1 = 4                     │
│ Continue searching in [4, 6]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Search right half              │
│ left=4, right=6, mid=(4+6)//2=5        │
│ nums[5] = 4 ≠ target                   │
│ 4 > 2, so right = mid - 1 = 4          │
│ Continue searching in [4, 4]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Search remaining                │
│ left=4, right=4, mid=(4+4)//2=4        │
│ nums[4] = 3 ≠ target                   │
│ 3 > 2, so right = mid - 1 = 3          │
│ Now left > right, exit loop            │
└─────────────────────────────────────────┘

FINAL RESULT: last_pos = 3
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def find_first_occurrence(nums, target):
    """
    🎯 FIND FIRST OCCURRENCE - MODIFIED BINARY SEARCH
    
    Args:
        nums: Sorted array with possible duplicates
        target: Value to find first occurrence of
        
    Returns:
        Index of first occurrence, or -1 if not found
        
    Time: O(log n) - Still binary search, just modified termination
    Space: O(1) - Only using a few variables
    """
    left = 0
    right = len(nums) - 1
    first_pos = -1  # Track the leftmost position found
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            first_pos = mid      # Save this position
            right = mid - 1      # But keep searching LEFT for earlier occurrence
        elif nums[mid] < target:
            left = mid + 1       # Target is in right half
        else:
            right = mid - 1      # Target is in left half
    
    return first_pos

def find_last_occurrence(nums, target):
    """
    🎯 FIND LAST OCCURRENCE - MODIFIED BINARY SEARCH
    
    Args:
        nums: Sorted array with possible duplicates
        target: Value to find last occurrence of
        
    Returns:
        Index of last occurrence, or -1 if not found
        
    Time: O(log n) - Still binary search, just modified termination
    Space: O(1) - Only using a few variables
    """
    left = 0
    right = len(nums) - 1
    last_pos = -1   # Track the rightmost position found
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            last_pos = mid       # Save this position
            left = mid + 1       # But keep searching RIGHT for later occurrence
        elif nums[mid] < target:
            left = mid + 1       # Target is in right half
        else:
            right = mid - 1      # Target is in left half
    
    return last_pos

def find_first_and_last(nums, target):
    """
    🎯 FIND BOTH FIRST AND LAST OCCURRENCES
    
    Returns: [first_index, last_index] or [-1, -1] if not found
    """
    first = find_first_occurrence(nums, target)
    if first == -1:
        return [-1, -1]  # Target not found
    
    last = find_last_occurrence(nums, target)
    return [first, last]

# 🔍 TRACE FUNCTION:
def find_first_with_trace(nums, target):
    """Same algorithm with detailed tracing"""
    print(f"Finding FIRST occurrence of {target} in {nums}")
    
    left = 0
    right = len(nums) - 1
    first_pos = -1
    step = 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        print(f"Step {step}:")
        print(f"  Range: [{left}, {right}], mid = {mid}")
        print(f"  nums[{mid}] = {nums[mid]}")
        
        if nums[mid] == target:
            first_pos = mid
            right = mid - 1
            print(f"  ✓ Found {target}! Saved position {mid}, searching left for earlier occurrence")
        elif nums[mid] < target:
            left = mid + 1
            print(f"  {nums[mid]} < {target}, search right half")
        else:
            right = mid - 1
            print(f"  {nums[mid]} > {target}, search left half")
        
        print(f"  Current first_pos: {first_pos}")
        step += 1
        print()
    
    return first_pos

# 📝 TESTING THE SOLUTION:
def test_first_last_occurrence():
    test_cases = [
        ([1, 2, 2, 2, 3, 4, 5], 2),      # Expected: [1, 3]
        ([5, 7, 7, 8, 8, 10], 8),        # Expected: [3, 4]
        ([5, 7, 7, 8, 8, 10], 6),        # Expected: [-1, -1]
        ([1], 1),                        # Expected: [0, 0]
        ([2, 2, 2, 2], 2),              # Expected: [0, 3]
    ]
    
    for nums, target in test_cases:
        result = find_first_and_last(nums, target)
        print(f"Array: {nums}, Target: {target}")
        print(f"First and Last: {result}")
        
        if result[0] != -1:
            print(f"Range: nums[{result[0]}:{result[1]+1}] = {nums[result[0]:result[1]+1]}")
        print("---")

test_first_last_occurrence()
```

### ⚡ **When to Use This Approach:**

```
✅ PERFECT FOR:
- Finding range of target values in sorted array
- Counting occurrences of a value
- Problems asking for "first" or "last" position
- Range queries in sorted data

❌ NOT SUITABLE FOR:
- Unsorted arrays (sort first or use different approach)
- When you need ALL positions (use linear search)
- Single occurrence guaranteed (use regular binary search)
```

### 🔍 **Common Pitfalls & Advanced Insights:**

```
❌ PITFALL 1: Stopping when first match is found
Solution: Continue searching for boundary even after finding target

❌ PITFALL 2: Wrong direction after finding match
For first: search LEFT (right = mid - 1)
For last: search RIGHT (left = mid + 1)

❌ PITFALL 3: Not handling edge cases
Solution: Return -1 when target not found, handle single elements

❌ PITFALL 4: Using wrong template
This requires the "save and continue" pattern, not regular binary search

🎯 ADVANCED INSIGHT - COUNT OCCURRENCES:
count = last_occurrence - first_occurrence + 1
This gives you the number of times target appears in O(log n) time!

🔍 PATTERN EXTENSION:
This technique works for finding boundaries in ANY monotonic sequence:
- First element ≥ target
- Last element ≤ target  
- First element where condition becomes true
```
        else:
            right = mid - 1
    
    return first_pos

def find_last_occurrence(nums, target):
    """
    Find the rightmost (last) occurrence of target
    
    Key insight: When we find target, keep searching right
    to find later occurrences.
    """
    left = 0
    right = len(nums) - 1
    last_pos = -1
    
    print(f"Looking for LAST occurrence of {target}")
    
    while left <= right:
        mid = left + (right - left) // 2
        
        print(f"Range [{left}, {right}], checking index {mid} (value={nums[mid]})")
        
        if nums[mid] == target:
            last_pos = mid  # Found one, but keep looking right!
            left = mid + 1  # Continue searching in right half
            print(f"Found {target} at index {mid}, but searching right for later occurrence")
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return last_pos

# Test it:
nums = [1, 2, 2, 2, 3, 4, 5]
target = 2

first = find_first_occurrence(nums, target)
print(f"\nFirst occurrence of {target}: index {first}")

last = find_last_occurrence(nums, target)
print(f"Last occurrence of {target}: index {last}")

print(f"Total count of {target}: {last - first + 1}")
```

## 🎯 Pattern 3: Search in Rotated Array

### Problem:
A sorted array has been rotated. Find a target element.

### Example:
```
Original: [1, 2, 3, 4, 5, 6, 7]
Rotated:  [4, 5, 6, 7, 1, 2, 3]  (rotated at index 4)

The array is broken into two sorted parts:
Part 1: [4, 5, 6, 7] (sorted)
Part 2: [1, 2, 3] (sorted)
```

### Visual Understanding:
```
[4, 5, 6, 7, 1, 2, 3]
 --------   -------
 sorted     sorted
 part 1     part 2

Key insight: One half is always completely sorted!
```

### Solution:
```python
def search_rotated_array(nums, target):
    """
    Search in rotated sorted array
    
    Strategy:
    1. Find which half is sorted
    2. Check if target is in the sorted half
    3. If yes, search there; if no, search the other half
    """
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        print(f"Range [{left}, {right}], mid={mid}")
        print(f"Values: left={nums[left]}, mid={nums[mid]}, right={nums[right]}")
        
        if nums[mid] == target:
            return mid
        
        # Check which half is sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            print("Left half is sorted")
            # Check if target is in sorted left half
            if nums[left] <= target < nums[mid]:
                right = mid - 1
                print(f"Target {target} is in sorted left half")
            else:
                left = mid + 1
                print(f"Target {target} is NOT in sorted left half, search right")
        else:  # Right half is sorted
            print("Right half is sorted")
            # Check if target is in sorted right half
            if nums[mid] < target <= nums[right]:
                left = mid + 1
                print(f"Target {target} is in sorted right half")
            else:
                right = mid - 1
                print(f"Target {target} is NOT in sorted right half, search left")
        print()
    
    return -1

# Test it:
nums = [4, 5, 6, 7, 1, 2, 3]
target = 2
result = search_rotated_array(nums, target)
print(f"Target {target} found at index: {result}")
```

## 🎯 Pattern 4: Search Insert Position

### Problem:
Given a sorted array and a target, return the index where target should be inserted to keep the array sorted.

### Example:
```
Array: [1, 3, 5, 6]
Target: 5 → Insert at index 2 (already exists)
Target: 2 → Insert at index 1
Target: 7 → Insert at index 4 (end)
Target: 0 → Insert at index 0 (beginning)

Visual for target = 2:
[1, 3, 5, 6]
   ↑
Insert here to get [1, 2, 3, 5, 6]
```

### Solution:
```python
def search_insert_position(nums, target):
    """
    Find position where target should be inserted
    
    Key insight: When binary search ends without finding target,
    'left' pointer will be at the correct insertion position!
    """
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        print(f"Range [{left}, {right}], checking index {mid} (value={nums[mid]})")
        
        if nums[mid] == target:
            return mid  # Found exact position
        elif nums[mid] < target:
            left = mid + 1
            print(f"{nums[mid]} < {target}, search right")
        else:
            right = mid - 1
            print(f"{nums[mid]} > {target}, search left")
    
    print(f"Target not found, should insert at index {left}")
    return left  # This is the insertion position!

# Test all cases:
nums = [1, 3, 5, 6]
test_targets = [5, 2, 7, 0]

for target in test_targets:
    print(f"\nTesting target = {target}")
    pos = search_insert_position(nums, target)
    print(f"Insert position: {pos}")
    
    # Show what the array would look like
    new_array = nums[:pos] + [target] + nums[pos:]
    print(f"New array: {new_array}")
```

## 🎯 Pattern 5: Find Peak Element

### Problem:
A peak element is greater than its neighbors. Find any peak element.

### Example:
```
Array: [1, 2, 3, 1]
Peak: Index 2 (value 3) because 3 > 2 and 3 > 1

Array: [1, 2, 1, 3, 5, 6, 4]
Peaks: Index 1 (value 2), Index 5 (value 6)

Visual:
    3
   / \      6
  2   1    /|\
 /     \  5 | 4
1       \|  |/
         3  
```

### Solution:
```python
def find_peak_element(nums):
    """
    Find any peak element using binary search
    
    Key insight: Always move towards the higher neighbor.
    This guarantees we'll find a peak!
    """
    left = 0
    right = len(nums) - 1
    
    while left < right:  # Note: < not <=
        mid = left + (right - left) // 2
        
        print(f"Range [{left}, {right}], checking index {mid}")
        print(f"Comparing nums[{mid}]={nums[mid]} with nums[{mid+1}]={nums[mid+1]}")
        
        if nums[mid] > nums[mid + 1]:
            # Peak is in left half (including mid)
            right = mid
            print("Going left (downward slope)")
        else:
            # Peak is in right half
            left = mid + 1
            print("Going right (upward slope)")
    
    print(f"Peak found at index {left} with value {nums[left]}")
    return left

# Test it:
nums = [1, 2, 3, 1]
peak_index = find_peak_element(nums)
print(f"\nPeak element: {nums[peak_index]} at index {peak_index}")

# Test with multiple peaks:
nums2 = [1, 2, 1, 3, 5, 6, 4]
peak_index2 = find_peak_element(nums2)
print(f"Peak element: {nums2[peak_index2]} at index {peak_index2}")
```

## 🎯 Pattern 6: Binary Search on Answer Space

### Problem:
Sometimes we binary search on the answer itself, not the array!

### Example: Square Root
Find the integer square root of a number.

```python
def sqrt_binary_search(x):
    """
    Find integer square root using binary search
    
    Instead of searching in an array, we search in the
    space of possible answers: 0 to x
    """
    if x < 2:
        return x
    
    left = 1
    right = x // 2  # Square root is at most x/2 for x >= 2
    
    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid
        
        print(f"Trying {mid}: {mid}² = {square}")
        
        if square == x:
            return mid
        elif square < x:
            left = mid + 1
            print(f"{square} < {x}, try larger numbers")
        else:
            right = mid - 1
            print(f"{square} > {x}, try smaller numbers")
    
    return right  # Return the largest integer whose square <= x

# Test it:
x = 8
result = sqrt_binary_search(x)
print(f"\nInteger square root of {x} is {result}")
print(f"Verification: {result}² = {result*result}, {result+1}² = {(result+1)*(result+1)}")
```

## 🧠 Binary Search Decision Framework

### When to Use Binary Search:
1. **Array is sorted** (or can be sorted)
2. **Looking for a specific value** or condition
3. **Can eliminate half the search space** each time
4. **Answer space is monotonic** (for answer-space binary search)

### Common Patterns:
```
1. Find exact element → Standard binary search
2. Find first/last occurrence → Modified binary search
3. Find insertion position → Standard + return left
4. Search in rotated array → Check which half is sorted
5. Find peak → Move towards higher neighbor
6. Search answer space → Binary search on possible answers
```

## 🎯 Practice Problems

### Easy:
1. **Binary Search** - Basic template
2. **Search Insert Position** - Find where to insert
3. **First Bad Version** - Answer space binary search

### Medium:
1. **Find First and Last Position** - Modified binary search
2. **Search in Rotated Sorted Array** - Two-part sorted array
3. **Find Peak Element** - Move towards higher side

### Hard:
1. **Median of Two Sorted Arrays** - Complex binary search
2. **Find Minimum in Rotated Sorted Array** - Find rotation point
3. **Split Array Largest Sum** - Binary search on answer

## 📝 Quick Templates

### Standard Binary Search:
```python
left, right = 0, len(nums) - 1
while left <= right:
    mid = left + (right - left) // 2
    if nums[mid] == target: return mid
    elif nums[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

### Find First Occurrence:
```python
left, right = 0, len(nums) - 1
result = -1
while left <= right:
    mid = left + (right - left) // 2
    if nums[mid] == target:
        result = mid
        right = mid - 1  # Keep searching left
    elif nums[mid] < target: left = mid + 1
    else: right = mid - 1
return result
```

This guide covers all essential binary search patterns with clear examples and visual explanations!
