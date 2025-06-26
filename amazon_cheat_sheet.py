"""
AMAZON INTERVIEW - QUICK REFERENCE CHEAT SHEET
Last-minute review guide for maximum retention
"""

# =============================================================================
# 🔥 TOP 5 MUST-KNOW PATTERNS (Practice these first!)
# =============================================================================

# 1. TWO SUM PATTERN
def two_sum_template(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# 2. SLIDING WINDOW PATTERN
def sliding_window_template(s):
    left = 0
    window = {}
    result = 0
    
    for right in range(len(s)):
        # Expand window
        window[s[right]] = window.get(s[right], 0) + 1
        
        # Contract window while invalid
        while window_invalid():
            window[s[left]] -= 1
            left += 1
        
        # Update result
        result = max(result, right - left + 1)
    
    return result

# 3. BINARY SEARCH PATTERN
def binary_search_template(nums, target):
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

# 4. TREE BFS PATTERN
def tree_bfs_template(root):
    if not root: return []
    queue = deque([root])
    result = []
    
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

# 5. TREE DFS PATTERN
def tree_dfs_template(root):
    if not root: return None
    
    # Process current
    result = process(root.val)
    
    # Recurse
    left = tree_dfs_template(root.left)
    right = tree_dfs_template(root.right)
    
    return combine(result, left, right)

# =============================================================================
# ⚡ COMPLEXITY QUICK REFERENCE
# =============================================================================

"""
ARRAY OPERATIONS:
Access: O(1)
Search: O(n)
Insert/Delete: O(n)

HASH TABLE:
All operations: O(1) average, O(n) worst

BINARY SEARCH:
Search: O(log n)

TREE OPERATIONS:
Search/Insert/Delete: O(log n) balanced, O(n) worst
Traversal: O(n)

SORTING:
Quick/Merge: O(n log n)
Heap: O(n log n)
Bucket/Counting: O(n + k)

GRAPH TRAVERSAL:
BFS/DFS: O(V + E)
"""

# =============================================================================
# 🎯 AMAZON'S FAVORITE PROBLEMS (HIGH PROBABILITY)
# =============================================================================

# ARRAYS (40% of interviews)
problems_arrays = [
    "Two Sum (LC 1) - Hash map approach",
    "Three Sum (LC 15) - Sort + two pointers",
    "Container With Most Water (LC 11) - Two pointers",
    "Maximum Subarray (LC 53) - Kadane's algorithm",
    "Product of Array Except Self (LC 238) - Prefix/suffix",
    "Best Time to Buy/Sell Stock (LC 121) - One pass"
]

# TREES (60% of interviews have tree problems)
problems_trees = [
    "Binary Tree Level Order (LC 102) - BFS template",
    "Maximum Depth (LC 104) - Simple DFS",
    "Validate BST (LC 98) - Range validation",
    "Lowest Common Ancestor (LC 236) - Recursive",
    "Binary Tree Right Side View (LC 199) - BFS variant",
    "Serialize/Deserialize Tree (LC 297) - Design problem"
]

# BINARY SEARCH (Easy wins)
problems_binary_search = [
    "Binary Search (LC 704) - Basic template",
    "Search Rotated Array (LC 33) - Amazon's favorite!",
    "Find First/Last Position (LC 34) - Two searches",
    "Find Minimum in Rotated Array (LC 153) - Modified BS"
]

# =============================================================================
# 💡 INTERVIEW SUCCESS STRATEGIES
# =============================================================================

def amazon_interview_approach():
    """
    5-STEP AMAZON APPROACH:
    
    1. CLARIFY (2-3 mins)
       - "Can the array be empty?"
       - "Any constraints on input size?"
       - "Should I optimize for time or space?"
    
    2. BRUTE FORCE (2 mins)
       - Always start here
       - "The naive approach would be..."
       - State time/space complexity
    
    3. OPTIMIZE (5-7 mins)
       - "I can improve this by..."
       - Explain why optimization works
       - Draw examples if helpful
    
    4. CODE (20-25 mins)
       - Think out loud
       - Use meaningful variable names
       - Handle edge cases as you go
    
    5. TEST (5 mins)
       - Walk through with example
       - Consider edge cases:
         * Empty input
         * Single element
         * All same elements
         * Minimum/maximum values
    """
    pass

# =============================================================================
# 🚨 COMMON AMAZON MISTAKES TO AVOID
# =============================================================================

mistakes_to_avoid = [
    "❌ Jumping straight to code without discussion",
    "❌ Not asking clarifying questions",
    "❌ Forgetting edge cases (empty, null, single element)",
    "❌ Poor variable naming (i, j, k instead of left, right, mid)",
    "❌ Not explaining time/space complexity",
    "❌ Going silent during problem solving",
    "❌ Not testing the solution with examples",
    "❌ Giving up too quickly when stuck"
]

# =============================================================================
# 🔥 EMERGENCY 30-MINUTE CRASH COURSE
# =============================================================================

def emergency_study_plan():
    """
    If you only have 30 minutes left:
    
    1. Two Sum (5 mins) - Hash map approach
    2. Binary Search Template (5 mins) - Memorize this
    3. Tree Level Order Traversal (10 mins) - BFS with queue
    4. Three Sum (10 mins) - Sort + two pointers
    
    These 4 patterns cover 70% of Amazon questions!
    """
    
    # MEMORIZE THESE EXACTLY:
    
    # Two Sum
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    
    # Binary Search
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    
    # Tree BFS
    queue = deque([root])
    while queue:
        for _ in range(len(queue)):
            node = queue.popleft()
            # process node
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)

# =============================================================================
# 📞 PHONE SCREEN VS ONSITE DIFFERENCES
# =============================================================================

phone_screen_focus = [
    "✅ 1-2 medium problems in 45 minutes",
    "✅ Focus on coding accuracy",
    "✅ Explain approach clearly",
    "✅ Handle basic edge cases",
    "✅ Clean, readable code"
]

onsite_focus = [
    "✅ Leadership principles integration",
    "✅ System design thinking",
    "✅ Optimization discussions",
    "✅ Scalability considerations",
    "✅ Follow-up questions handling"
]

# =============================================================================
# 💬 SAMPLE AMAZON INTERVIEW DIALOGUE
# =============================================================================

def sample_dialogue():
    """
    INTERVIEWER: "Given an array of integers, return indices of two numbers that add up to a specific target."
    
    YOU: "Great! Let me clarify a few things:
          - Can the array be empty? 
          - Are there always exactly one solution?
          - Can I use the same element twice?
          - Any constraints on the array size?"
    
    INTERVIEWER: "Assume there's exactly one solution and you can't use same element twice."
    
    YOU: "Perfect. The brute force approach would be to check every pair - that's O(n²) time.
          But I can optimize this using a hash map to get O(n) time, O(n) space.
          
          The idea is: for each number, I check if its complement (target - number) 
          exists in what I've seen so far. Let me code this up..."
    
    [Code the solution while explaining each step]
    
    YOU: "Let me trace through an example: [2,7,11,15], target=9
          - i=0, num=2, complement=7, not in seen, add 2:0 to seen
          - i=1, num=7, complement=2, found in seen at index 0, return [0,1]
          
          Edge cases to consider: empty array, no solution exists..."
    """

# =============================================================================
# 🎭 LEADERSHIP PRINCIPLES IN ACTION
# =============================================================================

leadership_examples = {
    "Customer Obsession": "I'm thinking about edge cases because in production, invalid inputs could crash the system and hurt user experience.",
    
    "Ownership": "I'll write this code as if I have to maintain it for years - using clear variable names and handling all edge cases.",
    
    "Invent and Simplify": "While there are multiple approaches, I prefer the hash map solution because it's simple to understand and optimal.",
    
    "Learn and Be Curious": "This reminds me of the subset sum problem. Are there other variations you'd like me to consider?",
    
    "Insist on Highest Standards": "Let me test this thoroughly with edge cases before we move on."
}

# =============================================================================
# ⏰ FINAL COUNTDOWN CHECKLIST
# =============================================================================

final_checklist = """
NIGHT BEFORE:
□ Review the 4 core templates above
□ Practice explaining solutions out loud
□ Prepare questions about the role/team
□ Get good sleep (8+ hours)

INTERVIEW DAY:
□ Test audio/video 30 mins early
□ Have water and paper ready
□ Take deep breaths
□ Remember: They want you to succeed!

DURING INTERVIEW:
□ Ask clarifying questions first
□ Start with brute force approach
□ Think out loud constantly
□ Test with examples
□ Handle edge cases
□ Stay calm and confident

YOU'VE GOT THIS! 🚀
"""
