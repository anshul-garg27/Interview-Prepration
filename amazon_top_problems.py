"""
AMAZON INTERVIEW - TOP PRIORITY PROBLEMS
These are the MUST-KNOW problems that appear most frequently in Amazon interviews.
Focus on understanding the patterns, not memorizing solutions.
"""

# =============================================================================
# 1. TWO SUM PATTERN (HIGHEST PRIORITY)
# =============================================================================

def two_sum(nums, target):
    """
    Given array of integers, return indices of two numbers that add up to target.
    
    Pattern: Hash map for O(1) lookup
    Time: O(n), Space: O(n)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Variations you should know:
def two_sum_sorted(nums, target):
    """Two pointers approach for sorted array"""
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

def three_sum(nums):
    """
    Find all unique triplets that sum to zero.
    LC 15 - Very common at Amazon
    """
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result

# =============================================================================
# 2. SLIDING WINDOW PATTERN (HIGHEST PRIORITY)
# =============================================================================

def longest_substring_without_repeating(s):
    """
    LC 3 - Find length of longest substring without repeating characters
    
    Pattern: Sliding window with hash set
    Time: O(n), Space: O(min(m,n)) where m is charset size
    """
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length

def max_subarray_sum(nums):
    """
    LC 53 - Maximum Subarray (Kadane's Algorithm)
    Very common at Amazon
    """
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# =============================================================================
# 3. BINARY SEARCH PATTERN (HIGH PRIORITY)
# =============================================================================

def binary_search(nums, target):
    """
    Classic binary search - know this by heart!
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def search_rotated_array(nums, target):
    """
    LC 33 - Search in Rotated Sorted Array
    Amazon loves this problem!
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1

# =============================================================================
# 4. TREE TRAVERSAL PATTERNS (HIGHEST PRIORITY)
# =============================================================================

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root):
    """
    LC 102 - Binary Tree Level Order Traversal
    BFS pattern - extremely common at Amazon
    """
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

def max_depth(root):
    """
    LC 104 - Maximum Depth of Binary Tree
    Simple DFS - always asked
    """
    if not root:
        return 0
    
    return 1 + max(max_depth(root.left), max_depth(root.right))

def validate_bst(root, min_val=float('-inf'), max_val=float('inf')):
    """
    LC 98 - Validate Binary Search Tree
    Very common at Amazon
    """
    if not root:
        return True
    
    if root.val <= min_val or root.val >= max_val:
        return False
    
    return (validate_bst(root.left, min_val, root.val) and 
            validate_bst(root.right, root.val, max_val))

# =============================================================================
# 5. DYNAMIC PROGRAMMING BASICS (MEDIUM PRIORITY)
# =============================================================================

def climb_stairs(n):
    """
    LC 70 - Climbing Stairs
    Classic DP intro problem
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1

def house_robber(nums):
    """
    LC 198 - House Robber
    Classic DP pattern
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current
    
    return prev1

# =============================================================================
# 6. LINKED LIST PATTERNS (MEDIUM PRIORITY)
# =============================================================================

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    """
    LC 206 - Reverse Linked List
    Must know this!
    """
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

def has_cycle(head):
    """
    LC 141 - Linked List Cycle
    Floyd's Cycle Detection (Two Pointers)
    """
    if not head or not head.next:
        return False
    
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False

def merge_two_lists(l1, l2):
    """
    LC 21 - Merge Two Sorted Lists
    Common Amazon problem
    """
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next

# =============================================================================
# QUICK REFERENCE - TIME COMPLEXITIES
# =============================================================================

"""
MUST MEMORIZE:

Array Operations:
- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

Binary Search: O(log n)

Sorting:
- Quick/Merge Sort: O(n log n)
- Bucket/Counting Sort: O(n + k)

Tree Operations:
- Search/Insert/Delete: O(log n) balanced, O(n) worst
- Traversal: O(n)

Hash Table:
- Average: O(1) for all operations
- Worst: O(n) for all operations

Graph Traversal:
- BFS/DFS: O(V + E)
"""
