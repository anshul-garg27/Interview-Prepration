"""
AMAZON INTERVIEW - COMPREHENSIVE PRACTICE PROBLEMS
Organized by difficulty and frequency at Amazon interviews.
Each problem includes multiple solution approaches and detailed explanations.
"""

from collections import deque, defaultdict
import heapq

# =============================================================================
# HOUR 1-2: ARRAYS & TWO POINTERS - DETAILED SOLUTIONS
# =============================================================================

def container_with_most_water(height):
    """
    LC 11 - Container With Most Water
    AMAZON FREQUENCY: VERY HIGH
    
    Problem: Find two lines that together with x-axis forms container holding most water.
    
    Approach 1: Brute Force O(n²)
    Approach 2: Two Pointers O(n) ← OPTIMAL
    
    Key Insight: Moving pointer with smaller height might increase area,
    moving pointer with larger height will definitely not increase area.
    """
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        max_area = max(max_area, current_area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area

def three_sum_with_variations(nums):
    """
    LC 15 - 3Sum
    AMAZON FREQUENCY: VERY HIGH
    
    Find all unique triplets that sum to zero.
    
    Key Points for Amazon Interview:
    1. Handle duplicates correctly
    2. Explain why sorting is necessary
    3. Time complexity: O(n²)
    4. Space complexity: O(1) excluding output
    """
    if len(nums) < 3:
        return []
    
    nums.sort()  # Essential for two-pointer approach
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for first number
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        # Two-pointer approach for remaining two numbers
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for second number
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # Skip duplicates for third number
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result

def longest_substring_without_repeating_detailed(s):
    """
    LC 3 - Longest Substring Without Repeating Characters
    AMAZON FREQUENCY: VERY HIGH
    
    Sliding Window Pattern - Template Problem
    
    Amazon Follow-ups:
    1. What if we want the actual substring?
    2. What if we allow at most k repeating characters?
    3. What about Unicode characters?
    """
    if not s:
        return 0
    
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Shrink window while we have duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        # Add current character and update max
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length

def subarray_sum_equals_k(nums, k):
    """
    LC 560 - Subarray Sum Equals K
    AMAZON FREQUENCY: HIGH
    
    Prefix Sum + Hash Map Pattern
    Key insight: If prefix_sum[j] - prefix_sum[i] = k, 
    then sum of subarray from i+1 to j equals k
    """
    count = 0
    prefix_sum = 0
    sum_count = {0: 1}  # Important: Initialize with 0:1
    
    for num in nums:
        prefix_sum += num
        
        # Check if there's a previous prefix sum that makes current sum = k
        if prefix_sum - k in sum_count:
            count += sum_count[prefix_sum - k]
        
        # Add current prefix sum to map
        sum_count[prefix_sum] = sum_count.get(prefix_sum, 0) + 1
    
    return count

# =============================================================================
# HOUR 3: BINARY SEARCH - ADVANCED PATTERNS
# =============================================================================

def search_in_rotated_array_with_duplicates(nums, target):
    """
    LC 81 - Search in Rotated Sorted Array II (with duplicates)
    AMAZON FREQUENCY: MEDIUM-HIGH
    
    Harder version of LC 33. Handle duplicates by shrinking boundaries.
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return True
        
        # Handle duplicates: can't determine which side is sorted
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        # Left side is sorted
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right side is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return False

def find_minimum_in_rotated_array(nums):
    """
    LC 153 - Find Minimum in Rotated Sorted Array
    AMAZON FREQUENCY: HIGH
    
    Key insight: Minimum is always in the unsorted half
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # If mid > right, minimum is in right half
        if nums[mid] > nums[right]:
            left = mid + 1
        # If mid <= right, minimum is in left half (including mid)
        else:
            right = mid
    
    return nums[left]

def search_2d_matrix(matrix, target):
    """
    LC 74 - Search a 2D Matrix
    AMAZON FREQUENCY: MEDIUM
    
    Treat 2D matrix as 1D sorted array
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        mid_value = matrix[mid // n][mid % n]
        
        if mid_value == target:
            return True
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False

# =============================================================================
# HOUR 4-5: TREES - COMPREHENSIVE PATTERNS
# =============================================================================

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def serialize_deserialize_tree(root):
    """
    LC 297 - Serialize and Deserialize Binary Tree
    AMAZON FREQUENCY: HIGH
    
    This is a design problem - show different approaches
    """
    def serialize(root):
        """Preorder traversal with null markers"""
        if not root:
            return "null"
        
        return f"{root.val},{serialize(root.left)},{serialize(root.right)}"
    
    def deserialize(data):
        """Reconstruct tree from preorder string"""
        def build_tree():
            val = next(vals)
            if val == "null":
                return None
            
            node = TreeNode(int(val))
            node.left = build_tree()
            node.right = build_tree()
            return node
        
        vals = iter(data.split(','))
        return build_tree()
    
    # Example usage
    serialized = serialize(root)
    return deserialize(serialized)

def binary_tree_right_side_view(root):
    """
    LC 199 - Binary Tree Right Side View
    AMAZON FREQUENCY: HIGH
    
    Level order traversal - keep track of rightmost node at each level
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # If this is the last node in current level
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

def lowest_common_ancestor_with_path(root, p, q):
    """
    LC 236 - Lowest Common Ancestor of Binary Tree
    AMAZON FREQUENCY: VERY HIGH
    
    Multiple approaches:
    1. Recursive (implemented below)
    2. Store parent pointers
    3. Store paths to both nodes
    """
    if not root or root == p or root == q:
        return root
    
    left = lowest_common_ancestor_with_path(root.left, p, q)
    right = lowest_common_ancestor_with_path(root.right, p, q)
    
    # If both subtrees contain one of p, q - current root is LCA
    if left and right:
        return root
    
    # Return the subtree that contains either p or q
    return left or right

def path_sum_all_paths(root, target_sum):
    """
    LC 113 - Path Sum II
    AMAZON FREQUENCY: MEDIUM-HIGH
    
    Find all root-to-leaf paths with given sum
    Backtracking pattern
    """
    def dfs(node, remaining, path, result):
        if not node:
            return
        
        # Add current node to path
        path.append(node.val)
        remaining -= node.val
        
        # Check if this is a leaf with target sum
        if not node.left and not node.right and remaining == 0:
            result.append(path[:])  # Make a copy
        
        # Recurse on children
        dfs(node.left, remaining, path, result)
        dfs(node.right, remaining, path, result)
        
        # Backtrack
        path.pop()
    
    result = []
    dfs(root, target_sum, [], result)
    return result

# =============================================================================
# AMAZON SYSTEM DESIGN CODING QUESTIONS
# =============================================================================

class LRUCache:
    """
    LC 146 - LRU Cache
    AMAZON FREQUENCY: VERY HIGH
    
    This tests data structure design skills
    Use doubly linked list + hash map
    """
    
    class Node:
        def __init__(self, key=0, val=0):
            self.key = key
            self.val = val
            self.prev = None
            self.next = None
    
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Create dummy head and tail
        self.head = self.Node()
        self.tail = self.Node()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_node(self, node):
        """Add node right after head"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        """Remove an existing node"""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _move_to_head(self, node):
        """Move node to head (mark as recently used)"""
        self._remove_node(node)
        self._add_node(node)
    
    def _pop_tail(self):
        """Remove last node before tail"""
        last_node = self.tail.prev
        self._remove_node(last_node)
        return last_node
    
    def get(self, key):
        node = self.cache.get(key)
        if node:
            self._move_to_head(node)
            return node.val
        return -1
    
    def put(self, key, value):
        node = self.cache.get(key)
        
        if node:
            # Update existing key
            node.val = value
            self._move_to_head(node)
        else:
            # Add new key
            new_node = self.Node(key, value)
            
            if len(self.cache) >= self.capacity:
                # Remove LRU item
                tail = self._pop_tail()
                del self.cache[tail.key]
            
            self.cache[key] = new_node
            self._add_node(new_node)

# =============================================================================
# AMAZON BEHAVIORAL + TECHNICAL INTEGRATION
# =============================================================================

def merge_k_sorted_lists(lists):
    """
    LC 23 - Merge k Sorted Lists
    AMAZON FREQUENCY: HIGH
    
    This problem tests:
    1. Understanding of heap data structure
    2. Ability to optimize (divide and conquer vs heap)
    3. Handle edge cases
    
    Amazon often asks about scaling this to millions of lists
    """
    if not lists:
        return None
    
    # Min heap approach
    heap = []
    dummy = ListNode(0)
    current = dummy
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    # Process until heap is empty
    while heap:
        val, list_idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        # Add next node from the same list
        if node.next:
            heapq.heappush(heap, (node.next.val, list_idx, node.next))
    
    return dummy.next

# =============================================================================
# FINAL TIPS FOR AMAZON INTERVIEWS
# =============================================================================

"""
AMAZON LEADERSHIP PRINCIPLES IN CODING:

1. CUSTOMER OBSESSION
   - Always ask about edge cases
   - Consider performance implications
   - Think about user experience (error handling)

2. OWNERSHIP
   - Write clean, maintainable code
   - Think about corner cases proactively
   - Consider long-term scalability

3. INVENT AND SIMPLIFY
   - Start with simplest solution that works
   - Optimize iteratively
   - Explain trade-offs clearly

4. LEARN AND BE CURIOUS
   - Ask clarifying questions
   - Explore multiple approaches
   - Show genuine interest in finding optimal solution

5. INSIST ON HIGHEST STANDARDS
   - Test your code thoroughly
   - Handle all edge cases
   - Write production-quality code

COMMON AMAZON FOLLOW-UP QUESTIONS:
- "How would you handle this with millions of inputs?"
- "What if memory is limited?"
- "How would you make this thread-safe?"
- "What happens if the input is streaming?"
- "How would you test this in production?"
"""
