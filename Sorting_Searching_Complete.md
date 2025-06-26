# 🔄 Sorting & Searching Algorithms - Complete Mastery Guide

## 📚 What is Sorting?

### 🤔 **Why Sorting Matters - The Foundation of Algorithms**

**Real-World Analogy**: Like organizing a library
- **Unsorted books**: Finding a book takes forever (linear search)
- **Sorted books**: Find any book quickly using call numbers (binary search)
- **Investment pays off**: Time spent sorting enables fast future searches

**Key Insight**: Sorting is often a **preprocessing step** that makes other operations dramatically faster

### 📖 **Sorting Algorithm Categories - Understanding the Trade-offs:**

```
🎯 SIMPLE SORTS (O(n²) - Educational but Slow):
- Bubble Sort: Compare adjacent, swap if wrong order
- Selection Sort: Find minimum, place at beginning
- Insertion Sort: Insert each element in correct position

🎯 EFFICIENT SORTS (O(n log n) - Production Ready):
- Merge Sort: Divide and conquer, stable
- Quick Sort: Partition around pivot, in-place
- Heap Sort: Use heap property, in-place

🎯 SPECIAL SORTS (Linear time for specific cases):
- Counting Sort: For small range of integers
- Radix Sort: For integers with fixed number of digits
- Bucket Sort: For uniformly distributed data

WHEN TO USE WHICH:
✅ Small data (n < 50): Insertion sort (simple, low overhead)
✅ General purpose: Quick sort (average O(n log n), in-place)
✅ Stability required: Merge sort (guaranteed O(n log n), stable)
✅ Memory constrained: Heap sort (in-place, worst-case O(n log n))
```

### 🔍 **Bubble Sort - Step-by-Step Understanding:**

```
🎯 BUBBLE SORT ALGORITHM:
Like bubbles rising to surface - largest elements "bubble" to the end

WHY IT'S CALLED BUBBLE SORT:
Large elements gradually move right like air bubbles rising in water

DETAILED EXECUTION of [64, 34, 25, 12, 22, 11, 90]:

PASS 1 (Bubble largest to end):
┌─────────────────────────────────────────┐
│ Compare 64, 34: 64 > 34 → SWAP         │
│ [34, 64, 25, 12, 22, 11, 90]           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Compare 64, 25: 64 > 25 → SWAP         │
│ [34, 25, 64, 12, 22, 11, 90]           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Compare 64, 12: 64 > 12 → SWAP         │
│ [34, 25, 12, 64, 22, 11, 90]           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Compare 64, 22: 64 > 22 → SWAP         │
│ [34, 25, 12, 22, 64, 11, 90]           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Compare 64, 11: 64 > 11 → SWAP         │
│ [34, 25, 12, 22, 11, 64, 90]           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Compare 64, 90: 64 < 90 → NO SWAP      │
│ [34, 25, 12, 22, 11, 64, 90]           │
│ 90 is now in correct position!         │
└─────────────────────────────────────────┘

PASS 2 (Bubble second largest):
[34, 25, 12, 22, 11, 64, 90] → [25, 12, 22, 11, 34, 64, 90]
64 is now in correct position!

Continue until no swaps needed...

FINAL RESULT: [11, 12, 22, 25, 34, 64, 90]

🎯 WHY BUBBLE SORT IS INEFFICIENT:
- Compares every adjacent pair even if array is mostly sorted
- Makes many unnecessary passes
- Time: O(n²) in all cases
- Only advantage: Simplicity and detects if array is already sorted
```

## 🔥 Problem: Merge Sort - The Divide and Conquer Master

### 🤔 **Problem Understanding - The Split-and-Merge Strategy**

**Real-World Analogy**: Like organizing a massive library using teamwork
- **Divide the work**: Split books among multiple librarians
- **Sort individually**: Each librarian sorts their small pile quickly
- **Merge results**: Combine sorted piles maintaining overall order
- **Key insight**: Breaking big problems into smaller ones makes them manageable

**Why Merge Sort is Special**: Guaranteed O(n log n) performance, stable, and predictable

### 📖 **Problem Statement:**
Sort an array using the divide-and-conquer approach that splits the array in half, recursively sorts each half, then merges the results.

**Example:**
```
Input:  [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]
```

### 🎯 **Algorithm Strategy - Divide, Conquer, Combine:**

```
🎯 MERGE SORT ALGORITHM:
1. DIVIDE: Split array into two halves
2. CONQUER: Recursively sort each half
3. COMBINE: Merge the two sorted halves

WHY IT WORKS:
- Base case: Arrays of size 1 are already sorted
- Merging two sorted arrays is linear O(n) operation
- Tree depth is log n (halving each time)
- Total work: O(n) per level × O(log n) levels = O(n log n)

RECURSION TREE VISUALIZATION:
                [64, 34, 25, 12]
                      ↓ DIVIDE
                [64, 34]  [25, 12]
                   ↓         ↓ DIVIDE
                [64][34]  [25][12]
                   ↓         ↓ MERGE
                [34, 64]  [12, 25]
                      ↓ MERGE
                [12, 25, 34, 64]
```

### 🔍 **Step-by-Step Visual Trace:**

```
EXAMPLE: Sorting [38, 27, 43, 3]

LEVEL 0 (DIVIDE):
┌─────────────────────────────────────────┐
│ merge_sort([38, 27, 43, 3])             │
│ Split at mid=2                          │
│ Left: [38, 27]    Right: [43, 3]        │
│ → Call merge_sort([38, 27])             │
│ → Call merge_sort([43, 3])              │
└─────────────────────────────────────────┘

LEVEL 1 (DIVIDE FURTHER):
┌─────────────────────────────────────────┐
│ merge_sort([38, 27])                    │
│ Split at mid=1                          │
│ Left: [38]        Right: [27]           │
│ → Call merge_sort([38])  (returns [38]) │
│ → Call merge_sort([27])  (returns [27]) │
│ → Call merge([38], [27])                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ merge_sort([43, 3])                     │
│ Split at mid=1                          │
│ Left: [43]        Right: [3]            │
│ → Call merge_sort([43])  (returns [43]) │
│ → Call merge_sort([3])   (returns [3])  │
│ → Call merge([43], [3])                 │
└─────────────────────────────────────────┘

LEVEL 1 (MERGE OPERATIONS):
┌─────────────────────────────────────────┐
│ merge([38], [27])                       │
│ Compare: 38 vs 27 → 27 smaller          │
│ Result: [27]                            │
│ Add remaining: [27, 38]                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ merge([43], [3])                        │
│ Compare: 43 vs 3 → 3 smaller            │
│ Result: [3]                             │
│ Add remaining: [3, 43]                  │
└─────────────────────────────────────────┘

LEVEL 0 (FINAL MERGE):
┌─────────────────────────────────────────┐
│ merge([27, 38], [3, 43])                │
│ Compare: 27 vs 3 → 3 smaller            │
│ Result: [3]                             │
│ Compare: 27 vs 43 → 27 smaller          │
│ Result: [3, 27]                         │
│ Compare: 38 vs 43 → 38 smaller          │
│ Result: [3, 27, 38]                     │
│ Add remaining: [3, 27, 38, 43]          │
└─────────────────────────────────────────┘

FINAL RESULT: [3, 27, 38, 43]
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def merge_sort(arr):
    """
    🎯 MERGE SORT - DIVIDE AND CONQUER ALGORITHM
    
    Args:
        arr: List of comparable elements to sort
        
    Returns:
        New sorted list (doesn't modify original)
        
    Time: O(n log n) - Guaranteed best, average, and worst case
    Space: O(n) - For temporary arrays during merging
    """
    # Base case: arrays of length 0 or 1 are already sorted
    if len(arr) <= 1:
        return arr.copy()
    
    # DIVIDE: Split array into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # CONQUER: Recursively sort each half
    left_sorted = merge_sort(left_half)
    right_sorted = merge_sort(right_half)
    
    # COMBINE: Merge the sorted halves
    return merge(left_sorted, right_sorted)

def merge(left, right):
    """
    🎯 MERGE TWO SORTED ARRAYS INTO ONE SORTED ARRAY
    
    Args:
        left: First sorted array
        right: Second sorted array
        
    Returns:
        Single sorted array containing all elements
        
    Time: O(n + m) where n, m are lengths of input arrays
    Space: O(n + m) for result array
    """
    result = []
    i = j = 0  # Pointers for left and right arrays
    
    # Compare elements from both arrays and pick smaller
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add any remaining elements
    result.extend(left[i:])   # If left array has remaining elements
    result.extend(right[j:])  # If right array has remaining elements
    
    return result

# 🔍 TRACE FUNCTION:
def merge_sort_with_trace(arr, depth=0):
    """Same merge sort algorithm with detailed execution tracing"""
    indent = "  " * depth
    print(f"{indent}🔍 MERGE_SORT({arr}) [depth={depth}]")
    
    if len(arr) <= 1:
        print(f"{indent}   Base case reached - returning {arr}")
        return arr.copy()
    
    # Divide
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    print(f"{indent}   Dividing at mid={mid}:")
    print(f"{indent}   Left half:  {left_half}")
    print(f"{indent}   Right half: {right_half}")
    
    # Conquer
    print(f"{indent}   → Sorting left half...")
    left_sorted = merge_sort_with_trace(left_half, depth + 1)
    print(f"{indent}   ← Left sorted: {left_sorted}")
    
    print(f"{indent}   → Sorting right half...")
    right_sorted = merge_sort_with_trace(right_half, depth + 1)
    print(f"{indent}   ← Right sorted: {right_sorted}")
    
    # Combine
    print(f"{indent}   → Merging {left_sorted} and {right_sorted}...")
    result = merge_with_trace(left_sorted, right_sorted, depth)
    print(f"{indent}   ← Merge result: {result}")
    
    return result

def merge_with_trace(left, right, depth=0):
    """Merge function with detailed tracing"""
    indent = "    " * (depth + 1)
    print(f"{indent}MERGE({left}, {right})")
    
    result = []
    i = j = 0
    step = 1
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            print(f"{indent}Step {step}: {left[i]} ≤ {right[j]} → add {left[i]} → {result}")
            i += 1
        else:
            result.append(right[j])
            print(f"{indent}Step {step}: {left[i]} > {right[j]} → add {right[j]} → {result}")
            j += 1
        step += 1
    
    # Add remaining elements
    if i < len(left):
        remaining = left[i:]
        result.extend(remaining)
        print(f"{indent}Step {step}: Add remaining from left: {remaining} → {result}")
    
    if j < len(right):
        remaining = right[j:]
        result.extend(remaining)
        print(f"{indent}Step {step}: Add remaining from right: {remaining} → {result}")
    
    return result

# 📝 TESTING THE SOLUTION:
def test_merge_sort():
    test_cases = [
        [64, 34, 25, 12, 22, 11, 90],  # General case
        [5, 2, 4, 6, 1, 3],           # Unsorted
        [1, 2, 3, 4, 5],              # Already sorted
        [5, 4, 3, 2, 1],              # Reverse sorted
        [42],                         # Single element
        [],                           # Empty array
        [3, 3, 3, 3],                 # All duplicates
    ]
    
    print("🧪 TESTING MERGE SORT ALGORITHM")
    print("=" * 50)
    
    for i, arr in enumerate(test_cases):
        print(f"\nTest Case {i+1}: {arr}")
        sorted_arr = merge_sort(arr)
        print(f"Sorted:     {sorted_arr}")
        
        # Verify correctness
        expected = sorted(arr)
        is_correct = sorted_arr == expected
        print(f"Correct:    {'✅ Yes' if is_correct else '❌ No'}")
    
    # Detailed trace for small example
    print(f"\n🔍 DETAILED TRACE for [38, 27, 43, 3]:")
    print("=" * 50)
    trace_result = merge_sort_with_trace([38, 27, 43, 3])

test_merge_sort()
    n = len(arr)
    arr = arr.copy()  # Don't modify original
    
    print(f"Starting Bubble Sort with: {arr}")
    
    for i in range(n):
        print(f"\n--- Pass {i + 1} ---")
        swapped = False
        
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            print(f"Comparing arr[{j}]={arr[j]} with arr[{j+1}]={arr[j+1]}")
            
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                print(f"  Swapped! Array: {arr}")
            else:
                print(f"  No swap needed")
        
        print(f"End of pass {i + 1}: {arr}")
        
        # If no swapping occurred, array is sorted
        if not swapped:
            print(f"No swaps in pass {i + 1}, array is sorted!")
            break
    
    return arr

def bubble_sort_optimized(arr):
    """Optimized bubble sort that stops early if sorted"""
    n = len(arr)
    arr = arr.copy()
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return arr

# Test bubble sort
test_array = [64, 34, 25, 12, 22, 11, 90]
sorted_array = bubble_sort(test_array)
print(f"\nFinal sorted array: {sorted_array}")
```

## 🎯 Sorting Algorithm 2: Selection Sort

### Concept:
Find the minimum element and place it at the beginning, then repeat for the remaining array.

### Visual Example:
```
Initial: [64, 25, 12, 22, 11]
         [11, 25, 12, 22, 64]  (Found min 11, swap with first)
         [11, 12, 25, 22, 64]  (Found min 12, swap with second)
         [11, 12, 22, 25, 64]  (Found min 22, swap with third)
         [11, 12, 22, 25, 64]  (25 < 64, no swap needed)

Sorted:  [11, 12, 22, 25, 64]
```

### Implementation:
```python
def selection_sort(arr):
    """Selection sort with detailed visualization"""
    n = len(arr)
    arr = arr.copy()
    
    print(f"Starting Selection Sort with: {arr}")
    
    for i in range(n):
        print(f"\n--- Finding minimum for position {i} ---")
        
        # Find minimum element in remaining array
        min_idx = i
        print(f"Initially assuming arr[{i}]={arr[i]} is minimum")
        
        for j in range(i + 1, n):
            print(f"  Comparing arr[{j}]={arr[j]} with current min arr[{min_idx}]={arr[min_idx]}")
            if arr[j] < arr[min_idx]:
                min_idx = j
                print(f"    New minimum found at index {min_idx}")
        
        # Swap found minimum with first element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            print(f"Swapped arr[{i}] with arr[{min_idx}]: {arr}")
        else:
            print(f"No swap needed, arr[{i}] is already minimum")
        
        print(f"Position {i} is now sorted: {arr}")
    
    return arr

# Test selection sort
test_array = [64, 25, 12, 22, 11]
sorted_array = selection_sort(test_array)
print(f"\nFinal sorted array: {sorted_array}")
```

## 🎯 Sorting Algorithm 3: Insertion Sort

### Concept:
Build the sorted array one element at a time by inserting each element into its correct position.

### Visual Example:
```
Initial: [5, 2, 4, 6, 1, 3]

Step 1:  [5] | 2, 4, 6, 1, 3    (5 is sorted)
Step 2:  [2, 5] | 4, 6, 1, 3    (Insert 2 before 5)
Step 3:  [2, 4, 5] | 6, 1, 3    (Insert 4 between 2 and 5)
Step 4:  [2, 4, 5, 6] | 1, 3    (Insert 6 at end)
Step 5:  [1, 2, 4, 5, 6] | 3    (Insert 1 at beginning)
Step 6:  [1, 2, 3, 4, 5, 6]     (Insert 3 between 2 and 4)
```

### Implementation:
```python
def insertion_sort(arr):
    """Insertion sort with detailed visualization"""
    n = len(arr)
    arr = arr.copy()
    
    print(f"Starting Insertion Sort with: {arr}")
    
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        print(f"\n--- Inserting arr[{i}]={key} into sorted portion ---")
        print(f"Sorted portion: {arr[:i]}, Key: {key}, Remaining: {arr[i+1:]}")
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            print(f"  arr[{j}]={arr[j]} > {key}, shifting right")
            arr[j + 1] = arr[j]
            j -= 1
            print(f"  Array after shift: {arr}")
        
        # Place key in correct position
        arr[j + 1] = key
        print(f"  Inserted {key} at position {j + 1}: {arr}")
    
    return arr

def insertion_sort_binary_search(arr):
    """Insertion sort with binary search to find position"""
    def binary_search_position(arr, val, start, end):
        """Find position to insert val in sorted array[start:end]"""
        if start == end:
            return start if arr[start] > val else start + 1
        
        if start > end:
            return start
        
        mid = (start + end) // 2
        
        if arr[mid] < val:
            return binary_search_position(arr, val, mid + 1, end)
        elif arr[mid] > val:
            return binary_search_position(arr, val, start, mid - 1)
        else:
            return mid
    
    arr = arr.copy()
    
    for i in range(1, len(arr)):
        key = arr[i]
        pos = binary_search_position(arr, key, 0, i - 1)
        
        # Shift elements
        for j in range(i - 1, pos - 1, -1):
            arr[j + 1] = arr[j]
        
        arr[pos] = key
    
    return arr

# Test insertion sort
test_array = [5, 2, 4, 6, 1, 3]
sorted_array = insertion_sort(test_array)
print(f"\nFinal sorted array: {sorted_array}")
```

## 🎯 Sorting Algorithm 4: Merge Sort

### Concept:
Divide array into halves, recursively sort each half, then merge the sorted halves.

### Visual Example:
```
Initial array: [38, 27, 43, 3, 9, 82, 10]

Divide phase:
[38, 27, 43, 3, 9, 82, 10]
    /                \
[38, 27, 43, 3]    [9, 82, 10]
   /        \         /      \
[38, 27]  [43, 3]  [9, 82]  [10]
  /   \    /   \    /   \
[38] [27] [43] [3] [9] [82]

Merge phase:
[27, 38] [3, 43] [9, 82] [10]
    \      /        \     /
  [3, 27, 38, 43]  [9, 10, 82]
          \           /
      [3, 9, 10, 27, 38, 43, 82]
```

### Implementation:
```python
def merge_sort(arr):
    """Merge sort with detailed visualization"""
    def merge(left, right):
        """Merge two sorted arrays"""
        result = []
        i = j = 0
        
        print(f"    Merging {left} and {right}")
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                print(f"      Added {left[i]} from left")
                i += 1
            else:
                result.append(right[j])
                print(f"      Added {right[j]} from right")
                j += 1
        
        # Add remaining elements
        while i < len(left):
            result.append(left[i])
            print(f"      Added remaining {left[i]} from left")
            i += 1
        
        while j < len(right):
            result.append(right[j])
            print(f"      Added remaining {right[j]} from right")
            j += 1
        
        print(f"    Merged result: {result}")
        return result
    
    def merge_sort_recursive(arr, depth=0):
        """Recursive merge sort"""
        indent = "  " * depth
        print(f"{indent}Sorting: {arr}")
        
        if len(arr) <= 1:
            print(f"{indent}Base case reached: {arr}")
            return arr
        
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        
        print(f"{indent}Dividing into left: {left}, right: {right}")
        
        left_sorted = merge_sort_recursive(left, depth + 1)
        right_sorted = merge_sort_recursive(right, depth + 1)
        
        merged = merge(left_sorted, right_sorted)
        print(f"{indent}Merged result: {merged}")
        
        return merged
    
    print("Starting Merge Sort:")
    return merge_sort_recursive(arr.copy())

# Test merge sort
test_array = [38, 27, 43, 3, 9, 82, 10]
sorted_array = merge_sort(test_array)
print(f"\nFinal sorted array: {sorted_array}")
```

## 🎯 Sorting Algorithm 5: Quick Sort

### Concept:
Choose a pivot, partition array so smaller elements are on left and larger on right, then recursively sort both parts.

### Visual Example:
```
Initial: [10, 80, 30, 90, 40, 50, 70]
Pivot: 70 (last element)

Partition:
[10, 80, 30, 90, 40, 50, 70]
 i=0                      pivot=70

Compare 10 with 70: 10 < 70, so 10 stays
Compare 80 with 70: 80 > 70, so 80 will be moved
Compare 30 with 70: 30 < 70, so 30 stays
Compare 90 with 70: 90 > 70, so 90 will be moved
Compare 40 with 70: 40 < 70, so 40 stays
Compare 50 with 70: 50 < 70, so 50 stays

Result after partition: [10, 30, 40, 50, 70, 90, 80]
                        smaller    |  pivot | larger
```

### Implementation:
```python
def quick_sort(arr):
    """Quick sort with detailed visualization"""
    
    def partition(arr, low, high):
        """Partition function using last element as pivot"""
        pivot = arr[high]
        print(f"    Partitioning {arr[low:high+1]} with pivot {pivot}")
        
        i = low - 1  # Index of smaller element
        
        for j in range(low, high):
            print(f"      Comparing arr[{j}]={arr[j]} with pivot {pivot}")
            
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                print(f"        Smaller/equal, swap: {arr[low:high+1]}")
            else:
                print(f"        Larger, no swap")
        
        # Place pivot in correct position
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        print(f"    Pivot placed at index {i + 1}: {arr[low:high+1]}")
        
        return i + 1
    
    def quick_sort_recursive(arr, low, high, depth=0):
        """Recursive quick sort"""
        indent = "  " * depth
        
        if low < high:
            print(f"{indent}Sorting subarray: {arr[low:high+1]} (indices {low}-{high})")
            
            # Partition and get pivot index
            pi = partition(arr, low, high)
            
            print(f"{indent}Pivot {arr[pi]} is in correct position")
            print(f"{indent}Left subarray: {arr[low:pi] if low < pi else '[]'}")
            print(f"{indent}Right subarray: {arr[pi+1:high+1] if pi+1 <= high else '[]'}")
            
            # Recursively sort elements before and after partition
            quick_sort_recursive(arr, low, pi - 1, depth + 1)
            quick_sort_recursive(arr, pi + 1, high, depth + 1)
    
    arr = arr.copy()
    print("Starting Quick Sort:")
    quick_sort_recursive(arr, 0, len(arr) - 1)
    return arr

def quick_sort_randomized(arr):
    """Quick sort with random pivot for better average performance"""
    import random
    
    def randomized_partition(arr, low, high):
        # Randomly choose pivot and swap with last element
        random_index = random.randint(low, high)
        arr[random_index], arr[high] = arr[high], arr[random_index]
        return partition(arr, low, high)
    
    # Implementation similar to above but using randomized_partition
    return arr

# Test quick sort
test_array = [10, 80, 30, 90, 40, 50, 70]
sorted_array = quick_sort(test_array)
print(f"\nFinal sorted array: {sorted_array}")
```

## 🔍 Searching Algorithms

## 🎯 Search Algorithm 1: Linear Search

### Concept:
Search through array sequentially until element is found or end is reached.

### Implementation:
```python
def linear_search(arr, target):
    """Linear search with detailed steps"""
    print(f"Searching for {target} in {arr}")
    
    for i in range(len(arr)):
        print(f"  Step {i + 1}: Checking arr[{i}]={arr[i]}")
        
        if arr[i] == target:
            print(f"  Found {target} at index {i}!")
            return i
        else:
            print(f"  {arr[i]} != {target}, continue...")
    
    print(f"  {target} not found in array")
    return -1

# Test linear search
test_array = [2, 3, 4, 10, 40]
target = 10
result = linear_search(test_array, target)
```

## 🎯 Search Algorithm 2: Binary Search

### Concept:
Search in a sorted array by repeatedly dividing search interval in half.

### Visual Example:
```
Array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
Target: 11

Step 1: low=0, high=9, mid=4
        arr[4]=9 < 11, search right half
        
Step 2: low=5, high=9, mid=7  
        arr[7]=15 > 11, search left half
        
Step 3: low=5, high=6, mid=5
        arr[5]=11 == 11, found!
```

### Implementation:
```python
def binary_search(arr, target):
    """Binary search with detailed visualization"""
    left, right = 0, len(arr) - 1
    step = 1
    
    print(f"Searching for {target} in sorted array: {arr}")
    
    while left <= right:
        mid = (left + right) // 2
        mid_val = arr[mid]
        
        print(f"\nStep {step}:")
        print(f"  Range: indices {left} to {right}")
        print(f"  Array slice: {arr[left:right+1]}")
        print(f"  Mid index: {mid}, Mid value: {mid_val}")
        
        if mid_val == target:
            print(f"  Found {target} at index {mid}!")
            return mid
        elif mid_val < target:
            print(f"  {mid_val} < {target}, search right half")
            left = mid + 1
        else:
            print(f"  {mid_val} > {target}, search left half")
            right = mid - 1
        
        step += 1
    
    print(f"\n{target} not found in array")
    return -1

def binary_search_recursive(arr, target, left=0, right=None):
    """Recursive binary search"""
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

def binary_search_leftmost(arr, target):
    """Find leftmost occurrence of target"""
    left, right = 0, len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left if left < len(arr) and arr[left] == target else -1

def binary_search_rightmost(arr, target):
    """Find rightmost occurrence of target"""
    left, right = 0, len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    
    return left - 1 if left > 0 and arr[left - 1] == target else -1

# Test binary search
test_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 11
result = binary_search(test_array, target)
```

## 📊 Algorithm Complexity Comparison

### Sorting Algorithms:
```
Algorithm      Best Case    Average Case   Worst Case    Space    Stable?
Bubble Sort    O(n)         O(n²)          O(n²)         O(1)     Yes
Selection Sort O(n²)        O(n²)          O(n²)         O(1)     No
Insertion Sort O(n)         O(n²)          O(n²)         O(1)     Yes
Merge Sort     O(n log n)   O(n log n)     O(n log n)    O(n)     Yes
Quick Sort     O(n log n)   O(n log n)     O(n²)         O(log n) No
Heap Sort      O(n log n)   O(n log n)     O(n log n)    O(1)     No
```

### Searching Algorithms:
```
Algorithm      Time Complexity    Space    Prerequisites
Linear Search  O(n)              O(1)     None
Binary Search  O(log n)          O(1)     Sorted array
```

## 🎯 Advanced Searching Techniques

### Exponential Search:
```python
def exponential_search(arr, target):
    """Exponential search for unbounded arrays"""
    if arr[0] == target:
        return 0
    
    # Find range for binary search
    i = 1
    while i < len(arr) and arr[i] <= target:
        i *= 2
    
    # Binary search in found range
    return binary_search_range(arr, target, i // 2, min(i, len(arr) - 1))

def interpolation_search(arr, target):
    """Interpolation search for uniformly distributed data"""
    low, high = 0, len(arr) - 1
    
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1
        
        # Calculate position using interpolation formula
        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low])
        
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    
    return -1
```

## 🎯 Practice Problems

### Sorting:
1. **Sort Colors** (LeetCode 75) - Dutch National Flag
2. **Merge Intervals** (LeetCode 56) 
3. **Largest Number** (LeetCode 179)
4. **Sort List** (LeetCode 148) - Merge sort on linked list

### Searching:
1. **Search in Rotated Sorted Array** (LeetCode 33)
2. **Find Peak Element** (LeetCode 162)
3. **Search a 2D Matrix** (LeetCode 74)
4. **Median of Two Sorted Arrays** (LeetCode 4)

## 📝 Quick Templates

### Binary Search Template:
```python
def binary_search_template(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

### Quick Sort Template:
```python
def quick_sort_template(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort_template(left) + middle + quick_sort_template(right)
```

This comprehensive guide covers all essential sorting and searching algorithms with detailed visualizations and examples!
