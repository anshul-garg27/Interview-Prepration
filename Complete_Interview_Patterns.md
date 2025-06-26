# 🎯 Complete Interview Patterns Guide

## 📋 Essential Patterns for All Tech Interviews

This guide covers ALL major patterns that appear in technical interviews at Google, Meta, Microsoft, Apple, Netflix, and other top tech companies.

---

## 1. Arrays & Strings

### Pattern 1: Two Pointers
**When to use**: Sorted arrays, finding pairs, palindromes
**Time**: O(n), **Space**: O(1)

```python
# Template
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        if condition_met(arr[left], arr[right]):
            return [left, right]
        elif need_larger_sum:
            left += 1
        else:
            right -= 1
    return []

# Key Problems:
# - Two Sum (sorted array)
# - Container With Most Water
# - Valid Palindrome
# - 3Sum, 4Sum
```

### Pattern 2: Sliding Window
**When to use**: Subarray/substring problems, "maximum/minimum in window"
**Time**: O(n), **Space**: O(k)

```python
# Fixed Window Template
def sliding_window_fixed(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Variable Window Template
def sliding_window_variable(s):
    left = 0
    char_count = {}
    max_length = 0
    
    for right in range(len(s)):
        char_count[s[right]] = char_count.get(s[right], 0) + 1
        
        while window_invalid(char_count):
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length

# Key Problems:
# - Longest Substring Without Repeating Characters
# - Minimum Window Substring
# - Sliding Window Maximum
# - Subarray Sum Equals K
```

### Pattern 3: Prefix Sums
**When to use**: Range sum queries, subarray problems
**Time**: O(n), **Space**: O(n)

```python
def prefix_sum_template(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    
    # Range sum from i to j (inclusive)
    def range_sum(i, j):
        return prefix[j + 1] - prefix[i]
    
    return range_sum

# Key Problems:
# - Subarray Sum Equals K
# - Range Sum Query
# - Continuous Subarray Sum
```

---

## 2. Binary Search

### Pattern 1: Basic Binary Search
```python
def binary_search(arr, target):
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

### Pattern 2: Find First/Last Occurrence
```python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

### Pattern 3: Search in Rotated Array
```python
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        if nums[left] <= nums[mid]:  # Left half sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

**Key Problems**: Search Insert Position, Find Peak Element, Search 2D Matrix

---

## 3. Trees & Graphs

### Pattern 1: Tree Traversals
```python
# DFS - Recursive
def dfs_recursive(root):
    if not root:
        return
    
    # Preorder: root -> left -> right
    process(root.val)
    dfs_recursive(root.left)
    dfs_recursive(root.right)

# BFS - Level Order
def bfs_level_order(root):
    if not root:
        return []
    
    from collections import deque
    queue = deque([root])
    result = []
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
```

### Pattern 2: Tree Properties
```python
# Maximum Depth
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Validate BST
def is_valid_bst(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

# Lowest Common Ancestor
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    
    if left and right:
        return root
    
    return left or right
```

### Pattern 3: Graph Traversal
```python
# DFS Template
def dfs_graph(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs_graph(graph, neighbor, visited))
    
    return result

# BFS Template
def bfs_graph(graph, start):
    from collections import deque
    
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result
```

**Key Problems**: Binary Tree Paths, Symmetric Tree, Same Tree, Number of Islands

---

## 4. Dynamic Programming

### Pattern 1: 1D DP
```python
# Fibonacci Pattern
def fibonacci_dp(n):
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1

# House Robber Pattern
def rob_houses(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current
    
    return prev1
```

### Pattern 2: 2D DP
```python
# Grid Path Problems
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

# Longest Common Subsequence
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

**Key Problems**: Climbing Stairs, Coin Change, Edit Distance, Maximum Subarray

---

## 5. Linked Lists

### Pattern 1: Two Pointers
```python
# Find Middle
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

# Detect Cycle
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### Pattern 2: Reversal
```python
def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev
```

**Key Problems**: Merge Two Lists, Remove Nth Node, Palindrome List

---

## 6. Stacks & Queues

### Pattern 1: Monotonic Stack
```python
def next_greater_element(nums):
    result = [-1] * len(nums)
    stack = []  # Indices
    
    for i in range(len(nums)):
        while stack and nums[i] > nums[stack[-1]]:
            index = stack.pop()
            result[index] = nums[i]
        stack.append(i)
    
    return result
```

### Pattern 2: Valid Parentheses
```python
def is_valid_parentheses(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack
```

**Key Problems**: Daily Temperatures, Largest Rectangle in Histogram

---

## 7. Heaps

### Pattern 1: Top K Elements
```python
import heapq

def find_k_largest(nums, k):
    return heapq.nlargest(k, nums)

def k_closest_points(points, k):
    heap = []
    for x, y in points:
        distance = x*x + y*y
        heapq.heappush(heap, (distance, x, y))
    
    return [(x, y) for _, x, y in heapq.nsmallest(k, heap)]
```

**Key Problems**: Kth Largest Element, Top K Frequent Elements, Merge K Lists

---

## 8. Backtracking

### Template
```python
def backtrack(candidates, target, start, path, result):
    if target == 0:
        result.append(path[:])
        return
    
    for i in range(start, len(candidates)):
        if candidates[i] > target:
            break
        
        path.append(candidates[i])
        backtrack(candidates, target - candidates[i], i, path, result)
        path.pop()
```

**Key Problems**: Permutations, Combinations, N-Queens, Word Search

---

## 9. Quick Reference

### Time Complexities
- **Arrays**: Access O(1), Search O(n), Insert/Delete O(n)
- **Hash Map**: All operations O(1) average
- **Binary Search**: O(log n)
- **Tree Operations**: O(log n) balanced, O(n) worst
- **Graph Traversal**: O(V + E)
- **Sorting**: O(n log n)

### Space Complexities
- **Two Pointers**: O(1)
- **Sliding Window**: O(k)
- **DFS**: O(h) where h is height
- **BFS**: O(w) where w is width
- **DP**: Often O(n) or O(n²)

### Must-Know Problems by Company
**Google**: Arrays, DP, System Design
**Meta**: Trees, Graphs, Behavioral
**Microsoft**: All patterns, practical coding
**Apple**: Clean code, optimization
**Netflix**: Scalability, system design
