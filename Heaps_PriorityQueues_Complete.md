# 🏔️ Heaps & Priority Queues - Complete Mastery Guide

## 📚 What are Heaps?

### 🤔 **The Core Concept - Why Heaps Are Magical**

**Real-World Analogy**: Like a hospital emergency room triage system
- **Priority**: More urgent patients get treated first
- **Efficiency**: Nurse can instantly find the most urgent case
- **Dynamic**: New urgent cases can "jump the line" quickly

**Key Insight**: Heaps give us **O(1) access to the most important element** while keeping **O(log n) insertions**

### 📖 **Heap Properties - The Rules That Make It Work:**

```
🎯 HEAP PROPERTY:
Max Heap: Every parent ≥ all its children
Min Heap: Every parent ≤ all its children

🎯 COMPLETE BINARY TREE:
- All levels completely filled except possibly the last
- Last level filled from left to right
- This ensures balanced tree (height = log n)

WHY THESE PROPERTIES MATTER:
✅ Heap property → Root is always min/max
✅ Complete tree → Height stays logarithmic  
✅ Array representation → No pointers needed
✅ Parent-child math → Fast navigation
```

### 🔍 **Visual Step-by-Step - How Heaps Maintain Order:**

```
EXAMPLE: Building a Max Heap by inserting [10, 20, 15, 30, 25]

STEP 1: Insert 10
Array: [10]
Tree:   10
Result: Valid heap (single element)

STEP 2: Insert 20
Array: [10, 20]
Tree:   10
       /
      20
Problem: 20 > 10 but 20 is child! Violates max heap property

BUBBLE UP (Heapify Up):
- Compare 20 with parent 10
- 20 > 10, so swap them
Array: [20, 10]
Tree:   20
       /
      10
Result: Valid max heap!

STEP 3: Insert 15  
Array: [20, 10, 15]
Tree:   20
       / \
      10  15
Check: 20 ≥ 10 ✓, 20 ≥ 15 ✓
Result: Already valid!

STEP 4: Insert 30
Array: [20, 10, 15, 30]
Tree:   20
       / \
      10  15
     /
    30
Problem: 30 > 10 (its parent)

BUBBLE UP PROCESS:
1. Compare 30 with parent 10 → 30 > 10, swap
Array: [20, 30, 15, 10]
Tree:   20
       / \
      30  15
     /
    10

2. Compare 30 with new parent 20 → 30 > 20, swap  
Array: [30, 20, 15, 10]
Tree:   30
       / \
      20  15
     /
    10
Result: Valid max heap with 30 at root!
```

### 🚀 **Heap Operations - The Core Algorithms:**

```python
class MaxHeap:
    def __init__(self):
        self.heap = []
    
    def parent(self, i):
        """Get parent index - crucial for bubbling up"""
        return (i - 1) // 2
    
    def left_child(self, i):
        """Get left child index"""
        return 2 * i + 1
    
    def right_child(self, i):
        """Get right child index"""  
        return 2 * i + 2
    
    def insert(self, value):
        """
        🎯 INSERT ALGORITHM:
        1. Add element to end (maintains complete tree)
        2. Bubble up until heap property restored
        
        Time: O(log n) - height of tree
        """
        # Step 1: Add to end
        self.heap.append(value)
        
        # Step 2: Bubble up
        self._bubble_up(len(self.heap) - 1)
    
    def _bubble_up(self, index):
        """Move element up until heap property satisfied"""
        while index > 0:
            parent_idx = self.parent(index)
            
            # If heap property satisfied, stop
            if self.heap[index] <= self.heap[parent_idx]:
                break
            
            # Swap with parent and continue
            self.heap[index], self.heap[parent_idx] = \
                self.heap[parent_idx], self.heap[index]
            index = parent_idx
    
    def extract_max(self):
        """
        🎯 EXTRACT MAX ALGORITHM:
        1. Save root (the max element)
        2. Move last element to root
        3. Bubble down until heap property restored
        
        Time: O(log n) - height of tree
        """
        if not self.heap:
            return None
        
        # Step 1: Save max
        max_val = self.heap[0]
        
        # Step 2: Move last to root
        self.heap[0] = self.heap[-1]
        self.heap.pop()
        
        # Step 3: Bubble down
        if self.heap:  # Only if heap not empty
            self._bubble_down(0)
        
        return max_val
    
    def _bubble_down(self, index):
        """Move element down until heap property satisfied"""
        while True:
            largest = index
            left = self.left_child(index)
            right = self.right_child(index)
            
            # Find largest among parent and children
            if (left < len(self.heap) and 
                self.heap[left] > self.heap[largest]):
                largest = left
            
            if (right < len(self.heap) and 
                self.heap[right] > self.heap[largest]):
                largest = right
            
            # If parent is largest, heap property satisfied
            if largest == index:
                break
            
            # Swap and continue
            self.heap[index], self.heap[largest] = \
                self.heap[largest], self.heap[index]
            index = largest

# 🔍 WHY THESE ALGORITHMS WORK:
# - Insert: Adding at end preserves complete tree, bubbling up restores heap property
# - Extract: Moving last to root preserves complete tree, bubbling down restores heap property  
# - Both operations maintain the two crucial heap properties!
```

## 🎯 Heap Operations

### Basic Heap Implementation:
```python
import heapq

class MaxHeap:
    def __init__(self):
        self.heap = []
    
    def push(self, val):
        """Add element to heap"""
        # Python heapq is min heap, so negate for max heap
        heapq.heappush(self.heap, -val)
        print(f"Pushed {val}, heap: {[-x for x in self.heap]}")
    
    def pop(self):
        """Remove and return maximum element"""
        if not self.heap:
            return None
        val = -heapq.heappop(self.heap)
        print(f"Popped {val}, heap: {[-x for x in self.heap]}")
        return val
    
    def peek(self):
        """Return maximum without removing"""
        return -self.heap[0] if self.heap else None
    
    def size(self):
        return len(self.heap)

class MinHeap:
    def __init__(self):
        self.heap = []
    
    def push(self, val):
        heapq.heappush(self.heap, val)
        print(f"Pushed {val}, heap: {self.heap}")
    
    def pop(self):
        if not self.heap:
            return None
        val = heapq.heappop(self.heap)
        print(f"Popped {val}, heap: {self.heap}")
        return val
    
    def peek(self):
        return self.heap[0] if self.heap else None

# Test basic operations
print("Testing Max Heap:")
max_heap = MaxHeap()
for val in [10, 30, 20, 40]:
    max_heap.push(val)
print(f"Max element: {max_heap.peek()}")
max_heap.pop()
max_heap.pop()

print("\nTesting Min Heap:")
min_heap = MinHeap()
for val in [40, 10, 30, 20]:
    min_heap.push(val)
print(f"Min element: {min_heap.peek()}")
```

## 🎯 Pattern 1: Find K Largest/Smallest Elements

### Problem: K Largest Elements
Find the k largest elements in an array.

### Example:
```
Array: [3, 2, 1, 5, 6, 4]
k = 2
Result: [5, 6] (or [6, 5])

Strategy: Use min heap of size k
- Keep only k largest elements
- If heap size > k, remove smallest
```

### Visual Solution:
```
Array: [3, 2, 1, 5, 6, 4], k = 2

Step 1: Add 3
Min heap: [3]

Step 2: Add 2  
Min heap: [2, 3]

Step 3: Add 1, heap size = 3 > k=2
Min heap: [1, 3, 2] → remove min(1) → [2, 3]

Step 4: Add 5, heap size = 3 > k=2
Min heap: [2, 3, 5] → remove min(2) → [3, 5]

Step 5: Add 6, heap size = 3 > k=2
Min heap: [3, 5, 6] → remove min(3) → [5, 6]

Step 6: Add 4, heap size = 3 > k=2
Min heap: [4, 6, 5] → remove min(4) → [5, 6]

Result: k=2 largest elements are [5, 6]
```

### Implementation:
```python
def find_k_largest(nums, k):
    """Find k largest elements using min heap"""
    min_heap = []
    
    print(f"Finding {k} largest elements in {nums}")
    
    for i, num in enumerate(nums):
        print(f"Step {i+1}: Processing {num}")
        
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
            print(f"  Added {num} to heap: {min_heap}")
        elif num > min_heap[0]:
            removed = heapq.heapreplace(min_heap, num)
            print(f"  Replaced {removed} with {num}: {min_heap}")
        else:
            print(f"  {num} ≤ {min_heap[0]} (smallest in heap), skipping")
    
    print(f"Final heap: {min_heap}")
    return sorted(min_heap, reverse=True)  # Return in descending order

# Test k largest
nums = [3, 2, 1, 5, 6, 4]
k = 2
result = find_k_largest(nums, k)
print(f"\n{k} largest elements: {result}")
```

### K Smallest Elements:
```python
def find_k_smallest(nums, k):
    """Find k smallest elements using max heap"""
    max_heap = []
    
    for num in nums:
        if len(max_heap) < k:
            heapq.heappush(max_heap, -num)  # Negate for max heap
        elif num < -max_heap[0]:  # num is smaller than largest in heap
            heapq.heapreplace(max_heap, -num)
    
    return sorted([-x for x in max_heap])  # Convert back and sort

# Test k smallest
result = find_k_smallest(nums, k)
print(f"{k} smallest elements: {result}")
```

## 🎯 Pattern 2: Median from Data Stream

### 🤔 **Problem Understanding - The Dynamic Median Challenge**

**Real-World Analogy**: Like maintaining the "middle score" in a live gaming tournament
- **Players keep joining**: New scores arrive continuously
- **Need median instantly**: Must report middle score at any moment
- **Efficient updates**: Can't re-sort entire list every time

**Key Insight**: Use two heaps to maintain sorted halves - smaller half and larger half

### 📖 **Problem Statement:**
Design a data structure that supports adding integers from a data stream and finding the median efficiently.

**Example:**
```
addNum(1)    → [1]                    → median = 1
addNum(2)    → [1, 2]                 → median = 1.5
addNum(3)    → [1, 2, 3]              → median = 2
addNum(4)    → [1, 2, 3, 4]           → median = 2.5
```

### 🎯 **Algorithm Strategy - Two Heaps Approach:**

```
🎯 TWO HEAPS STRATEGY:
1. Max heap (left): Stores smaller half of numbers
2. Min heap (right): Stores larger half of numbers  
3. Balance constraint: |left_size - right_size| ≤ 1
4. Median = middle element(s) from heap tops

WHY IT WORKS:
- Max heap top = largest of smaller half
- Min heap top = smallest of larger half
- These two elements are closest to median position
- Heaps maintain partial order automatically

HEAP SIZES:
- If total odd: one heap has +1 element, median = top of larger heap
- If total even: both heaps same size, median = average of both tops
```

### 🔍 **Step-by-Step Visual Building Process:**

```
EXAMPLE: Processing stream [5, 15, 1, 3, 8, 7]

┌─────────────────────────────────────────┐
│ STEP 1: Add 5                           │
│ Max heap (smaller): [5]                 │
│ Min heap (larger): []                   │
│ Sizes: 1, 0 → Median = 5 (from max)    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Add 15                          │
│ 15 > 5, so goes to min heap             │
│ Max heap: [5]                           │
│ Min heap: [15]                          │
│ Sizes: 1, 1 → Median = (5+15)/2 = 10   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Add 1                           │
│ 1 ≤ 5, so goes to max heap              │
│ Max heap: [5, 1] → [5] (1 below)        │
│ Min heap: [15]                          │
│ Sizes: 2, 1 → Imbalanced! Rebalance     │
│ Move 5 from max to min                  │
│ Max heap: [1]                           │
│ Min heap: [5, 15] → [5] (15 below)      │
│ Sizes: 1, 2 → Median = 5 (from min)    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 4: Add 3                           │
│ 3 ≤ 5, so goes to max heap              │
│ Max heap: [3, 1] → [3] (1 below)        │
│ Min heap: [5, 15] → [5] (15 below)      │
│ Sizes: 2, 2 → Median = (3+5)/2 = 4     │
└─────────────────────────────────────────┘

CURRENT STATE:
Left half (max heap): [1, 3] → top = 3 (largest of smaller)
Right half (min heap): [5, 15] → top = 5 (smallest of larger)
Numbers in order: [1, 3, 5, 15]
Median position: between 3 and 5 → (3+5)/2 = 4 ✓
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
import heapq

class MedianFinder:
    """
    🎯 MEDIAN FROM DATA STREAM - TWO HEAPS SOLUTION
    
    Data Structure:
        max_heap: Stores smaller half (negated values for max behavior)
        min_heap: Stores larger half (natural min heap)
        
    Invariants:
        1. max_heap size - min_heap size ∈ {-1, 0, 1}
        2. max_heap.top() ≤ min_heap.top() (when both non-empty)
        
    Time Complexity:
        addNum: O(log n) - Heap insertion + rebalancing
        findMedian: O(1) - Just peek at heap tops
        
    Space Complexity: O(n) - Store all numbers
    """
    
    def __init__(self):
        self.max_heap = []  # Smaller half (negated for max heap behavior)
        self.min_heap = []  # Larger half (natural min heap)
    
    def addNum(self, num):
        """
        Add number to data structure maintaining balance
        """
        # Step 1: Decide which heap to add to
        if not self.max_heap or num <= -self.max_heap[0]:
            # Add to max heap (smaller half)
            heapq.heappush(self.max_heap, -num)  # Negate for max heap
        else:
            # Add to min heap (larger half)
            heapq.heappush(self.min_heap, num)
        
        # Step 2: Rebalance if necessary
        self._rebalance()
    
    def _rebalance(self):
        """
        Maintain heap size balance: |max_size - min_size| ≤ 1
        """
        max_size = len(self.max_heap)
        min_size = len(self.min_heap)
        
        if max_size > min_size + 1:
            # Max heap too large, move top to min heap
            element = -heapq.heappop(self.max_heap)  # Remove and negate
            heapq.heappush(self.min_heap, element)
        elif min_size > max_size + 1:
            # Min heap too large, move top to max heap
            element = heapq.heappop(self.min_heap)
            heapq.heappush(self.max_heap, -element)  # Negate for max heap
    
    def findMedian(self):
        """
        Find median in O(1) time
        """
        max_size = len(self.max_heap)
        min_size = len(self.min_heap)
        
        if max_size == min_size:
            # Even number of elements: average of middle two
            if max_size == 0:
                return 0  # Edge case: no elements
            return (-self.max_heap[0] + self.min_heap[0]) / 2.0
        elif max_size > min_size:
            # Odd number, extra element in max heap
            return float(-self.max_heap[0])
        else:
            # Odd number, extra element in min heap
            return float(self.min_heap[0])

# 🔍 TRACE FUNCTION:
class MedianFinderWithTrace(MedianFinder):
    """Same implementation with detailed execution tracing"""
    
    def addNum(self, num):
        print(f"\n➕ Adding {num}")
        print(f"   Before: max_heap={[-x for x in self.max_heap]}, min_heap={self.min_heap}")
        
        # Decide which heap
        if not self.max_heap or num <= -self.max_heap[0]:
            heapq.heappush(self.max_heap, -num)
            print(f"   → Added {num} to max_heap (smaller half)")
        else:
            heapq.heappush(self.min_heap, num)
            print(f"   → Added {num} to min_heap (larger half)")
        
        print(f"   After add: max_heap={[-x for x in self.max_heap]}, min_heap={self.min_heap}")
        
        # Rebalance
        old_max_size = len(self.max_heap)
        old_min_size = len(self.min_heap)
        
        self._rebalance()
        
        new_max_size = len(self.max_heap)
        new_min_size = len(self.min_heap)
        
        if (old_max_size, old_min_size) != (new_max_size, new_min_size):
            print(f"   🔄 Rebalanced: sizes {old_max_size},{old_min_size} → {new_max_size},{new_min_size}")
        
        print(f"   Final: max_heap={[-x for x in self.max_heap]}, min_heap={self.min_heap}")
        print(f"   📊 Current median: {self.findMedian()}")

# 📝 TESTING THE SOLUTION:
def test_median_finder():
    print("🎯 TESTING MEDIAN FINDER")
    print("=" * 50)
    
    # Test case 1: Basic functionality
    mf = MedianFinderWithTrace()
    
    test_stream = [5, 15, 1, 3, 8, 7, 9, 4]
    
    for num in test_stream:
        mf.addNum(num)
    
    print(f"\n🎯 Final median after all additions: {mf.findMedian()}")
    
    # Test case 2: Edge cases
    print(f"\n🧪 EDGE CASE TESTING:")
    
    # Single element
    mf_single = MedianFinder()
    mf_single.addNum(1)
    print(f"Single element [1]: median = {mf_single.findMedian()}")
    
    # Two elements
    mf_two = MedianFinder()
    mf_two.addNum(1)
    mf_two.addNum(2)
    print(f"Two elements [1,2]: median = {mf_two.findMedian()}")
    
    # Verify with sorted approach
    print(f"\n✅ VERIFICATION:")
    sorted_stream = sorted(test_stream)
    n = len(sorted_stream)
    if n % 2 == 1:
        expected_median = sorted_stream[n // 2]
    else:
        expected_median = (sorted_stream[n // 2 - 1] + sorted_stream[n // 2]) / 2
    
    print(f"Sorted stream: {sorted_stream}")
    print(f"Expected median: {expected_median}")
    print(f"Our result: {mf.findMedian()}")
    print(f"Match: {abs(mf.findMedian() - expected_median) < 1e-9}")

test_median_finder()
```

### ⚡ **When to Use This Approach:**

```
✅ PERFECT FOR:
- Real-time data processing (stock prices, sensor data)
- Streaming algorithms where you can't store all data
- Online statistics computation
- Dynamic median tracking in large datasets

❌ NOT SUITABLE FOR:
- Small datasets (simple sorting is fine)
- When you need other percentiles (use different data structures)
- One-time median calculation (sort once instead)
- Memory-constrained environments (stores all numbers)
```

### 🔍 **Common Pitfalls & Advanced Insights:**

```
❌ PITFALL 1: Forgetting to negate values for max heap
Solution: Python only has min heap, so negate values for max behavior

❌ PITFALL 2: Not maintaining balance after each insertion
Solution: Always rebalance after adding element

❌ PITFALL 3: Wrong median calculation for even/odd cases
Solution: Check sizes carefully - average for even, single value for odd

❌ PITFALL 4: Not handling empty heap edge cases
Solution: Check heap emptiness before accessing tops

🎯 ADVANCED OPTIMIZATIONS:
1. Lazy rebalancing: Only rebalance when queried
2. Alternative: Use order statistics tree for O(log n) k-th element
3. Approximation: Use sampling for very large streams
4. Memory optimization: Use reservoir sampling if memory limited

🔍 PATTERN EXTENSIONS:
- K-th largest element: Similar two-heap approach
- Running average: Use simple accumulator
- Running percentiles: Use multiple heaps or segment trees
- Sliding window median: Add element expiration logic

COMPLEXITY COMPARISON:
- Naive sorting: O(n log n) per query
- Two heaps: O(log n) insert, O(1) query
- Order statistics tree: O(log n) insert, O(log n) query
- Multiset (C++): O(log n) insert, O(1) query
```
            heapq.heappush(self.max_heap, -num)
            print(f"  Added {num} to max_heap (smaller half)")
        else:
            heapq.heappush(self.min_heap, num)
            print(f"  Added {num} to min_heap (larger half)")
        
        # Balance heaps
        if len(self.max_heap) > len(self.min_heap) + 1:
            val = -heapq.heappop(self.max_heap)
            heapq.heappush(self.min_heap, val)
            print(f"  Rebalanced: moved {val} from max_heap to min_heap")
        elif len(self.min_heap) > len(self.max_heap) + 1:
            val = heapq.heappop(self.min_heap)
            heapq.heappush(self.max_heap, -val)
            print(f"  Rebalanced: moved {val} from min_heap to max_heap")
        
        print(f"  Max heap (smaller): {[-x for x in self.max_heap]}")
        print(f"  Min heap (larger): {self.min_heap}")
    
    def find_median(self):
        """Find median of all numbers"""
        if len(self.max_heap) == len(self.min_heap):
            median = (-self.max_heap[0] + self.min_heap[0]) / 2
        elif len(self.max_heap) > len(self.min_heap):
            median = -self.max_heap[0]
        else:
            median = self.min_heap[0]
        
        print(f"  Current median: {median}")
        return median

# Test median finder
median_finder = MedianFinder()
stream = [5, 15, 1, 3]

for num in stream:
    median_finder.add_number(num)
    median = median_finder.find_median()
    print(f"Median after adding {num}: {median}\n")
```

## 🎯 Pattern 3: Top K Frequent Elements

### Problem:
Given an array, return the k most frequent elements.

### Example:
```
Array: [1, 1, 1, 2, 2, 3]
k = 2
Result: [1, 2] (1 appears 3 times, 2 appears 2 times)
```

### Strategy:
1. Count frequency of each element
2. Use min heap to track k most frequent
3. Heap stores (frequency, element) tuples

### Implementation:
```python
def top_k_frequent(nums, k):
    """Find k most frequent elements"""
    from collections import Counter
    
    # Count frequencies
    count = Counter(nums)
    print(f"Frequency count: {dict(count)}")
    
    min_heap = []
    
    for num, freq in count.items():
        print(f"Processing {num} (frequency {freq})")
        
        if len(min_heap) < k:
            heapq.heappush(min_heap, (freq, num))
            print(f"  Added ({freq}, {num}) to heap: {min_heap}")
        elif freq > min_heap[0][0]:
            removed = heapq.heapreplace(min_heap, (freq, num))
            print(f"  Replaced {removed} with ({freq}, {num}): {min_heap}")
        else:
            print(f"  Frequency {freq} ≤ {min_heap[0][0]}, skipping")
    
    # Extract elements (ignore frequencies)
    result = [num for freq, num in min_heap]
    print(f"Top {k} frequent elements: {result}")
    return result

# Test top k frequent
nums = [1, 1, 1, 2, 2, 3]
k = 2
result = top_k_frequent(nums, k)
```

## 🎯 Pattern 4: Merge K Sorted Lists

### Problem:
Merge k sorted linked lists into one sorted list.

### Example:
```
Input: 
List 1: 1 → 4 → 5
List 2: 1 → 3 → 4  
List 3: 2 → 6

Output: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

### Strategy:
Use min heap to always get the smallest available element from all lists.

### Implementation:
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    def __lt__(self, other):
        return self.val < other.val

def merge_k_lists(lists):
    """Merge k sorted linked lists using heap"""
    min_heap = []
    
    # Add first node from each non-empty list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(min_heap, head)
            print(f"Added head of list {i}: {head.val}")
    
    dummy = ListNode(0)
    current = dummy
    
    step = 1
    while min_heap:
        # Get smallest node
        node = heapq.heappop(min_heap)
        current.next = node
        current = current.next
        
        print(f"Step {step}: Selected node {node.val}")
        
        # Add next node from same list if exists
        if node.next:
            heapq.heappush(min_heap, node.next)
            print(f"  Added next node from same list: {node.next.val}")
        
        step += 1
    
    return dummy.next

# Create test lists
list1 = ListNode(1)
list1.next = ListNode(4)
list1.next.next = ListNode(5)

list2 = ListNode(1)
list2.next = ListNode(3)
list2.next.next = ListNode(4)

list3 = ListNode(2)
list3.next = ListNode(6)

lists = [list1, list2, list3]

print("Merging k sorted lists:")
result = merge_k_lists(lists)

# Print result
print("Merged list:", end=" ")
current = result
while current:
    print(current.val, end=" → " if current.next else " → NULL\n")
    current = current.next
```

## 🎯 Pattern 5: Sliding Window Maximum

### Problem:
Find the maximum element in each sliding window of size k.

### Example:
```
Array: [1, 3, -1, -3, 5, 3, 6, 7]
k = 3

Windows and maximums:
[1, 3, -1] → max = 3
[3, -1, -3] → max = 3
[-1, -3, 5] → max = 5
[-3, 5, 3] → max = 5
[5, 3, 6] → max = 6
[3, 6, 7] → max = 7

Result: [3, 3, 5, 5, 6, 7]
```

### Strategy (using heap):
Use max heap with (value, index) pairs. Clean expired indices.

### Implementation:
```python
def sliding_window_maximum_heap(nums, k):
    """Find sliding window maximum using heap"""
    max_heap = []
    result = []
    
    print(f"Array: {nums}, window size: {k}")
    
    for i in range(len(nums)):
        # Add current element
        heapq.heappush(max_heap, (-nums[i], i))
        print(f"Step {i+1}: Added ({nums[i]}, {i}) to heap")
        
        # Remove elements outside current window
        while max_heap and max_heap[0][1] <= i - k:
            removed = heapq.heappop(max_heap)
            print(f"  Removed expired element: {removed}")
        
        # If window is complete, record maximum
        if i >= k - 1:
            max_val = -max_heap[0][0]
            max_idx = max_heap[0][1]
            result.append(max_val)
            print(f"  Window [{i-k+1}:{i+1}]: maximum = {max_val} (at index {max_idx})")
    
    print(f"Result: {result}")
    return result

# Test sliding window maximum
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
result = sliding_window_maximum_heap(nums, k)
```

## 🧠 Heap vs Other Data Structures

### Heap Advantages:
- **O(log n) insertion/deletion**: Faster than sorting for partial ordering
- **O(1) access to min/max**: Instant access to extreme values
- **Space efficient**: Complete binary tree structure

### When to Use Heaps:
- **Priority queues**: Task scheduling, Dijkstra's algorithm
- **K-th element problems**: K largest, K smallest, K most frequent
- **Streaming data**: When you can't store all data in memory
- **Merge operations**: Merge k sorted arrays/lists

### Heap vs Alternatives:
```
Operation           | Heap    | Sorted Array | BST
--------------------|---------|--------------|--------
Insert              | O(log n)| O(n)         | O(log n)
Delete min/max      | O(log n)| O(1)/O(n)    | O(log n)
Find min/max        | O(1)    | O(1)         | O(log n)
Space              | O(n)    | O(n)         | O(n)
```

## 🎯 Practice Problems

### Easy:
1. **Kth Largest Element** - Basic heap usage
2. **Last Stone Weight** - Max heap simulation
3. **Find Median from Data Stream** - Two heaps technique

### Medium:
1. **Top K Frequent Elements** - Frequency counting + heap
2. **Merge k Sorted Lists** - Heap for merging
3. **Sliding Window Maximum** - Heap with cleanup
4. **Task Scheduler** - Priority queue simulation

### Hard:
1. **Median of Two Sorted Arrays** - Advanced two-pointer + heap
2. **Smallest Range Covering Elements from K Lists** - Complex heap usage
3. **IPO** - Greedy with heaps

## 📝 Quick Templates

### Min Heap:
```python
import heapq
min_heap = []
heapq.heappush(min_heap, value)
min_val = heapq.heappop(min_heap)
```

### Max Heap:
```python
max_heap = []
heapq.heappush(max_heap, -value)  # Negate values
max_val = -heapq.heappop(max_heap)  # Negate back
```

### K Largest Pattern:
```python
min_heap = []
for num in nums:
    if len(min_heap) < k:
        heapq.heappush(min_heap, num)
    elif num > min_heap[0]:
        heapq.heapreplace(min_heap, num)
```

This comprehensive guide covers all essential heap and priority queue patterns!
