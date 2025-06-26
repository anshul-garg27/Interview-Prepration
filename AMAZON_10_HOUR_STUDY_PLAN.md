# Amazon Interview - 10 Hour Intensive Study Plan 🚀

## ⏰ Time Allocation (10 Hours Total)

### Hour 1-2: Arrays & Two Pointers (2 hours)
**Priority: HIGHEST** - 40% of Amazon questions

#### Key Patterns:
1. **Two Sum variants** (15 mins)
   - Hash map approach: O(n) time, O(n) space
   - Two pointers on sorted array: O(n) time, O(1) space
   - **Common variations**: Two Sum II, Three Sum, Four Sum
   
2. **Two Pointers technique** (30 mins)
   - **When to use**: Sorted arrays, finding pairs/triplets
   - **Patterns**: Opposite ends, slow-fast pointers, sliding window
   - **Examples**: Container with Most Water, Trapping Rain Water
   
3. **Sliding Window** (45 mins)
   - **Fixed size window**: Maximum sum subarray of size k
   - **Variable size window**: Longest substring without repeating chars
   - **Template pattern**: Expand right, contract left when condition breaks
   
4. **Array manipulation** (30 mins)
   - **In-place operations**: Remove duplicates, rotate array
   - **Prefix sums**: Range sum queries, subarray problems
   - **Kadane's algorithm**: Maximum subarray sum

#### Must Practice Problems:
- **Two Sum (LC 1)** - Hash map approach, explain trade-offs
- **Container With Most Water (LC 11)** - Two pointers, area calculation
- **3Sum (LC 15)** - Sorting + two pointers, duplicate handling
- **Longest Substring Without Repeating Characters (LC 3)** - Sliding window with set
- **Maximum Subarray (LC 53)** - Kadane's algorithm, DP thinking
- **Best Time to Buy and Sell Stock (LC 121)** - One pass, track minimum
- **Product of Array Except Self (LC 238)** - Prefix/suffix products
- **Move Zeroes (LC 283)** - Two pointers, in-place modification

#### Detailed Examples & Edge Cases:
```python
# Two Sum - Handle edge cases
def two_sum_detailed(nums, target):
    """
    Edge cases to discuss:
    - Empty array: return []
    - No solution: return []
    - Duplicate numbers: use indices correctly
    - Negative numbers: works the same
    """
    if len(nums) < 2:
        return []
    
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Container With Most Water - Explain the greedy choice
def max_area_detailed(height):
    """
    Why two pointers work:
    - We want maximum area = min(height[i], height[j]) * (j - i)
    - Moving the pointer with larger height won't increase area
    - Moving the pointer with smaller height might increase area
    """
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_area = min(height[left], height[right]) * width
        max_area = max(max_area, current_area)
        
        # Move the pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area
```

---

### Hour 3: Binary Search (1 hour)
**Priority: HIGH** - Template-based, easy to master

#### Key Concepts:
- **Basic binary search template** - Master this one template
- **Search space reduction** - How to eliminate half each time
- **Boundary conditions** - When to use left <= right vs left < right
- **Search in rotated arrays** - Find the pivot, determine which half to search
- **Find peak element** - Modified binary search condition

#### Must Practice:
- **Binary Search (LC 704)** - Classic implementation
- **Search in Rotated Sorted Array (LC 33)** - Amazon's favorite!
- **Find First and Last Position (LC 34)** - Two binary searches
- **Search Insert Position (LC 35)** - Understanding the final left position
- **Find Peak Element (LC 162)** - Modified condition
- **Search a 2D Matrix (LC 74)** - Treat as 1D array

#### Detailed Binary Search Variations:
```python
# Standard Binary Search Template
def binary_search_template(nums, target):
    """
    This template handles all edge cases:
    - Empty array: returns -1
    - Target not found: returns -1
    - Single element: works correctly
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:  # Note: <= not <
        mid = left + (right - left) // 2  # Prevents overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Find First Occurrence (Left Boundary)
def find_first_occurrence(nums, target):
    """
    Template for finding leftmost occurrence
    """
    left, right = 0, len(nums) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result

# Search in Rotated Array - Detailed explanation
def search_rotated_detailed(nums, target):
    """
    Key insight: At least one half is always sorted
    Steps:
    1. Find which half is sorted
    2. Check if target is in the sorted half
    3. Search accordingly
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            # Check if target is in left sorted half
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            # Check if target is in right sorted half
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

---

### Hour 4-5: Trees & Graph Traversal (2 hours)
**Priority: HIGHEST** - BFS/DFS appear in 60% of interviews

#### Key Patterns:
1. **Tree Traversal** (DFS: Preorder, Inorder, Postorder)
   - **Preorder**: Root → Left → Right (useful for copying trees)
   - **Inorder**: Left → Root → Right (gives sorted order for BST)
   - **Postorder**: Left → Right → Root (useful for deletion, calculating sizes)
   
2. **Level Order Traversal** (BFS)
   - **Queue-based approach**: Process level by level
   - **Applications**: Finding level of node, zigzag traversal
   
3. **Tree Properties** (Height, Diameter, etc.)
   - **Height**: Longest path from root to leaf
   - **Diameter**: Longest path between any two nodes
   - **Balanced**: Height difference between subtrees ≤ 1
   
4. **Binary Search Trees**
   - **Validation**: In-order traversal should be sorted
   - **Search/Insert**: O(log n) average, O(n) worst case

#### Must Practice:
- **Binary Tree Level Order Traversal (LC 102)** - Queue-based BFS
- **Maximum Depth of Binary Tree (LC 104)** - Simple recursion
- **Validate Binary Search Tree (LC 98)** - Range validation approach
- **Lowest Common Ancestor (LC 236)** - Recursive approach
- **Binary Tree Right Side View (LC 199)** - Level order with rightmost
- **Symmetric Tree (LC 101)** - Mirror comparison
- **Path Sum (LC 112)** - DFS with target sum
- **Serialize and Deserialize Binary Tree (LC 297)** - Complex but common

#### Detailed Tree Solutions:
```python
# Tree Node Definition
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Level Order Traversal - Detailed with variations
def level_order_detailed(root):
    """
    Time: O(n), Space: O(w) where w is max width
    Variations:
    - Return as list of lists (this implementation)
    - Return as single list
    - Process level by level with level information
    """
    if not root:
        return []
    
    from collections import deque
    queue = deque([root])
    result = []
    
    while queue:
        level_size = len(queue)  # Important: capture size before loop
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result

# Validate BST - Range method (best approach)
def validate_bst_detailed(root):
    """
    Why range method is better than inorder:
    - More intuitive to explain
    - Handles duplicate values clearly
    - Shows understanding of BST property
    """
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # Check BST property
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Recursively validate subtrees with updated ranges
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

# Tree Diameter - Important Amazon problem
def diameter_of_tree(root):
    """
    Key insight: Diameter at any node = 
    max(left_height + right_height, diameter_of_left, diameter_of_right)
    
    Optimization: Calculate diameter during height calculation
    """
    self.max_diameter = 0
    
    def height(node):
        if not node:
            return 0
        
        left_height = height(node.left)
        right_height = height(node.right)
        
        # Update diameter through this node
        self.max_diameter = max(self.max_diameter, left_height + right_height)
        
        return 1 + max(left_height, right_height)
    
    height(root)
    return self.max_diameter

# Lowest Common Ancestor - Recursive approach
def lca_detailed(root, p, q):
    """
    Cases to consider:
    1. If root is None: return None
    2. If root is p or q: return root
    3. If p and q are in different subtrees: root is LCA
    4. If both are in same subtree: recurse into that subtree
    """
    if not root or root == p or root == q:
        return root
    
    left = lca_detailed(root.left, p, q)
    right = lca_detailed(root.right, p, q)
    
    # If both subtrees return non-null, root is LCA
    if left and right:
        return root
    
    # Return whichever subtree found the nodes
    return left or right
```

---

### Hour 6: Dynamic Programming Basics (1 hour)
**Priority: MEDIUM** - Focus on 1D DP only

#### Key Patterns:
- **Fibonacci-style problems** - Each state depends on previous states
- **House Robber pattern** - Skip adjacent elements optimization
- **Coin Change pattern** - Minimum/maximum ways to reach target
- **Climbing stairs variations** - Number of ways to reach position

#### Must Practice:
- **Climbing Stairs (LC 70)** - Basic Fibonacci pattern
- **House Robber (LC 198)** - Skip adjacent optimization
- **Coin Change (LC 322)** - Minimum coins DP
- **Maximum Product Subarray (LC 152)** - Track both min and max
- **Word Break (LC 139)** - String DP with dictionary

#### Detailed DP Solutions:
```python
# Climbing Stairs - Multiple approaches
def climb_stairs_detailed(n):
    """
    Recurrence: dp[i] = dp[i-1] + dp[i-2]
    Base cases: dp[1] = 1, dp[2] = 2
    
    Space optimization: Only need last 2 values
    """
    if n <= 2:
        return n
    
    # Space optimized O(1)
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1

# House Robber - Explain the choice
def house_robber_detailed(nums):
    """
    At each house, we have a choice:
    1. Rob this house + max money from houses before previous
    2. Don't rob this house + max money from previous house
    
    dp[i] = max(nums[i] + dp[i-2], dp[i-1])
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Space optimized
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current
    
    return prev1

# Coin Change - Classic DP
def coin_change_detailed(coins, amount):
    """
    dp[i] = minimum coins to make amount i
    dp[i] = min(dp[i], dp[i - coin] + 1) for each coin
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Hour 7: Linked Lists (1 hour)
**Priority: MEDIUM** - Common but predictable patterns

#### Key Patterns:
- Two pointer technique on linked lists
- Reverse operations
- Cycle detection

#### Must Practice:
- Reverse Linked List (LC 206)
- Linked List Cycle (LC 141)
- Merge Two Sorted Lists (LC 21)

#### Detailed Linked List Solutions:
```python
# Linked List Node Definition
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Reverse Linked List - Iterative and Recursive
def reverse_linked_list(head):
    """
    Iterative:
    - Prev, curr, next pointers
    - Reverse links one by one
    
    Recursive:
    - Reverse rest of the list
    - Link head to tail
    """
    # Iterative
    prev, curr = None, head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    head = prev
    
    return head

# Detect Cycle - Floyd's Tortoise and Hare
def has_cycle(head):
    """
    Key insight: If there is a cycle, fast pointer and slow pointer will meet
    Steps:
    1. Initialize slow and fast pointers
    2. Move slow by 1 step, fast by 2 steps
    3. If they meet, there is a cycle
    4. To find cycle start, move one pointer to head, keep other at meeting point
    5. Move both by 1 step, they will meet at cycle start
    """
    if not head:
        return None
    
    slow = fast = head
    
    # Phase 1: Detect cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Hour 8: Stack & Queue (1 hour)
**Priority: MEDIUM** - Often combined with other topics

#### Key Patterns:
- Valid parentheses
- Monotonic stack
- Queue using stacks

#### Must Practice:
- Valid Parentheses (LC 20)
- Daily Temperatures (LC 739)
- Implement Queue using Stacks (LC 232)

#### Detailed Stack & Queue Solutions:
```python
# Valid Parentheses - Stack solution
def is_valid_parentheses(s):
    """
    Key insight: Use stack to track opening brackets
    Steps:
    1. Initialize an empty stack
    2. For each character in the string:
       - If it's an opening bracket, push to stack
       - If it's a closing bracket:
         a. Stack is empty: return False
         b. Top of stack is matching opening bracket: pop stack
         c. Otherwise, return False
    3. After processing all characters, stack should be empty
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:  # Closing bracket
            top_element = stack.pop() if stack else '#'
            
            if mapping[char] != top_element:
                return False
        else:  # Opening bracket
            stack.append(char)
    
    return not stack

# Daily Temperatures - Monotonic stack
def daily_temperatures(temperatures):
    """
    Key insight: Use a monotonic stack to track indices of temperatures
    Steps:
    1. Initialize an empty stack and result array
    2. For each temperature:
       - While stack is not empty and current temperature > temperature at stack top:
         a. Pop from stack
         b. Calculate number of days until warmer temperature
         c. Update result for that day
       - Push current day onto stack
    3. Stack may still have indices of days with no warmer temperature
    """
    stack = []
    result = [0] * len(temperatures)
    
    for i, temp in enumerate(temperatures):
        # Check and update result for previous days
        while stack and temp > temperatures[stack[-1]]:
            idx = stack.pop()
            result[idx] = i - idx
        
        stack.append(i)
    
    return result

# Implement Queue using Stacks - Two stacks solution
class MyQueue:
    def __init__(self):
        self.stack1 = []
        self.stack2 = []

    def push(self, x):
        """
        Push element x to the back of queue.
        Always push to stack1
        """
        self.stack1.append(x)

    def pop(self):
        """
        Removes the element from in front of queue.
        If stack2 is empty, pour elements from stack1 to stack2
        """
        if not self.stack2:
            while self.stack1:
                self.stack2.append(self.stack1.pop())
        
        return self.stack2.pop() if self.stack2 else None

    def peek(self):
        """
        Get the front element.
        Pour elements from stack1 to stack2 if stack2 is empty
        """
        if not self.stack2:
            while self.stack1:
                self.stack2.append(self.stack1.pop())
        
        return self.stack2[-1] if self.stack2 else None

    def empty(self):
        """
        Returns whether the queue is empty.
        """
        return not self.stack1 and not self.stack2
```

---

### Hour 9: Backtracking (1 hour)
**Priority: MEDIUM** - Template-based approach

#### Key Patterns:
- Generate all combinations/permutations
- N-Queens style problems
- Word search

#### Must Practice:
- Permutations (LC 46)
- Combinations (LC 77)
- Word Search (LC 79)

#### Detailed Backtracking Solutions:
```python
# Permutations - Backtracking solution
def permute(nums):
    """
    Key insight: Use backtracking to generate all permutations
    Steps:
    1. Initialize an empty result list
    2. Define a backtrack function that takes current permutation and remaining numbers
    3. If remaining numbers are empty, add current permutation to result
    4. For each number in remaining numbers:
       - Add the number to current permutation
       - Recur with updated permutation and remaining numbers
       - Remove the number from permutation (backtrack)
    5. Call backtrack with initial values
    6. Return the result
    """
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            # Choose
            current.append(remaining[i])
            
            # Explore
            backtrack(current, remaining[:i] + remaining[i+1:])
            
            # Un-choose (backtrack)
            current.pop()
    
    backtrack([], nums)
    return result

# Combinations - Backtracking solution
def combine(n, k):
    """
    Key insight: Use backtracking to generate all combinations
    Steps:
    1. Initialize an empty result list
    2. Define a backtrack function that takes current combination, start number, and remaining count
    3. If remaining count is 0, add current combination to result
    4. For each number from start to n:
       - Add the number to current combination
       - Recur with updated combination, next number, and remaining count - 1
       - Remove the number from combination (backtrack)
    5. Call backtrack with initial values
    6. Return the result
    """
    result = []
    
    def backtrack(current, start, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, n + 1):
            # Choose
            current.append(i)
            
            # Explore
            backtrack(current, i + 1, remaining - 1)
            
            # Un-choose (backtrack)
            current.pop()
    
    backtrack([], 1, k)
    return result

# Word Search - Backtracking solution
def exist(board, word):
    """
    Key insight: Use backtracking to search for the word
    Steps:
    1. Define a backtrack function that takes current position and index in word
    2. If index equals word length, we found the word
    3. If out of bounds or character doesn't match, return False
    4. Mark the cell as visited by replacing with '#'
    5. Recur in all 4 directions (up, down, left, right)
    6. Unmark the cell (backtrack)
    7. Call backtrack for each cell in the grid
    8. Return False if not found
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index):
        if index == len(word):
            return True
        if (r < 0 or c < 0 or r >= rows or c >= cols or 
            board[r][c] == '#' or board[r][c] != word[index]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore all directions
        found = (backtrack(r + 1, c, index + 1) or
                 backtrack(r - 1, c, index + 1) or
                 backtrack(r, c + 1, index + 1) or
                 backtrack(r, c - 1, index + 1))
        
        # Unmark (backtrack)
        board[r][c] = temp
        
        return found
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and backtrack(r, c, 0):
                return True
    
    return False
```

---

### Hour 10: Mock Interview & Review (1 hour)
**Priority: CRITICAL** - Practice under time pressure

#### Activities:
- Solve 2-3 medium problems in 45 minutes
- Review common mistakes
- Practice explaining solutions clearly

#### Mock Interview Problems (Choose 2-3):
1. **Two Sum + Follow-up** (15 mins)
   - Basic Two Sum
   - What if array is sorted?
   - What if we need all pairs?
   
2. **Binary Tree Level Order + Variation** (20 mins)
   - Basic level order
   - Right side view
   - Zigzag level order
   
3. **Search in Rotated Array + Follow-up** (15 mins)
   - Basic search
   - What if duplicates allowed?
   - Find minimum in rotated array

#### Self-Assessment Checklist:
- [ ] Explained approach before coding (2 mins)
- [ ] Asked about constraints and edge cases
- [ ] Wrote clean, readable code
- [ ] Tested with sample inputs
- [ ] Analyzed time/space complexity
- [ ] Handled edge cases properly

---

## 🎯 Amazon-Specific Tips

### Leadership Principles in Code:
1. **Customer Obsession**: Always consider edge cases
   - "What if the input is empty?"
   - "What about integer overflow?"
   - "How do we handle invalid inputs?"

2. **Ownership**: Write clean, maintainable code
   - Use meaningful variable names
   - Add comments for complex logic
   - Think about code readability

3. **Invent and Simplify**: Choose the simplest solution that works
   - Start with brute force
   - Optimize step by step
   - Explain trade-offs clearly

4. **Learn and Be Curious**: Explain your thought process
   - "I'm thinking about using a hash map because..."
   - "Another approach could be... but I prefer this because..."
   - "Let me trace through an example"

### Interview Format:
- **45-60 minutes per round**
- **2-3 coding questions OR 1 complex problem**
- **Always start with brute force, then optimize**
- **Communicate constantly**

### Amazon's Behavioral Integration:
- They often ask: "Tell me about a time you optimized something"
- Connect your code optimization to real experiences
- Show how you think about customer impact

### Time Management During Interview:
- **5 mins**: Understand problem, ask clarifying questions
  - "Can the array be empty?"
  - "Are there any constraints on input size?"
  - "Should I optimize for time or space?"
  
- **10 mins**: Discuss approach and complexity
  - "I'm thinking of using X approach because..."
  - "The time complexity would be..."
  - "Let me trace through a quick example"
  
- **25 mins**: Code the solution
  - Think out loud while coding
  - Explain tricky parts
  - Handle edge cases as you go
  
- **5 mins**: Test with examples and edge cases
  - Walk through your code with sample input
  - Consider edge cases: empty, single element, all same elements

---

## 📝 Key Templates to Memorize

### 1. Two Pointers Template
```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Process current pair
        if condition_met(arr[left], arr[right]):
            # Found answer or move both pointers
            return process_result(left, right)
        elif need_larger_sum:
            left += 1
        else:
            right -= 1
    return default_result
```

### 2. Sliding Window Template
```python
def sliding_window(s):
    left = 0
    char_count = {}
    result = 0
    
    for right in range(len(s)):
        # Expand window
        char_count[s[right]] = char_count.get(s[right], 0) + 1
        
        # Contract window while condition violated
        while window_invalid(char_count):
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        # Update result with current valid window
        result = max(result, right - left + 1)
    
    return result
```

### 3. Binary Search Template
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
    
    return -1  # or left for insertion point
```

### 4. DFS Template (Recursive)
```python
def dfs(node):
    # Base case
    if not node:
        return base_value
    
    # Process current node
    current_result = process(node.val)
    
    # Recurse on children
    left_result = dfs(node.left)
    right_result = dfs(node.right)
    
    # Combine results
    return combine(current_result, left_result, right_result)
```

### 5. BFS Template (Iterative)
```python
from collections import deque

def bfs(root):
    if not root:
        return []
    
    queue = deque([root])
    result = []
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

### 6. Backtracking Template
```python
def backtrack(candidates, target, start, path, result):
    # Base case - found valid solution
    if target == 0:
        result.append(path[:])  # Make a copy
        return
    
    # Try all possibilities from current position
    for i in range(start, len(candidates)):
        # Skip invalid choices
        if candidates[i] > target:
            break
        
        # Make choice
        path.append(candidates[i])
        
        # Recurse with updated state
        backtrack(candidates, target - candidates[i], i, path, result)
        
        # Backtrack (undo choice)
        path.pop()
```

---

## 🔥 Last-Minute Checklist

### Before the Interview:
- [ ] Practice explaining solutions out loud
- [ ] Review time/space complexity analysis
- [ ] Prepare 2-3 questions about the role/team
- [ ] Test your video/audio setup

### During the Interview:
- [ ] Ask clarifying questions upfront
- [ ] Start with brute force approach
- [ ] Think out loud constantly
- [ ] Test with examples before submitting
- [ ] Handle edge cases (empty input, single element, etc.)

### Common Mistakes to Avoid:
- [ ] Jumping into code without discussing approach
- [ ] Not handling edge cases
- [ ] Poor variable naming
- [ ] Not testing the solution
- [ ] Going silent during problem solving

---

## 💡 Final Advice

1. **Quality over Quantity**: Better to master 20 problems than to skim 100
2. **Pattern Recognition**: Focus on identifying which pattern to use
3. **Communication**: Amazon values clear thinking and communication
4. **Stay Calm**: If stuck, step back and think about similar problems
5. **Practice Coding on Whiteboard/Paper**: Simulate interview conditions

**Remember**: Amazon interviews are more about problem-solving approach than memorizing solutions. Show your thinking process clearly!

Good luck! 🍀
