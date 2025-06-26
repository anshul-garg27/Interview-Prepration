# 📚 Stacks & Queues - Complete Mastery Guide

## 📚 What are Stacks?

### 🤔 **Understanding Stack Behavior - The LIFO Principle**

**Real-World Analogy**: Like a stack of cafeteria trays
- **Last tray placed** is the **first one taken**
- You can't grab a tray from the middle without moving others
- Perfect for **"undo" operations** and **tracking where you came from**

**Key Insight**: Stacks are perfect for **reversing order** and **keeping track of nested operations**

### 📖 **Stack Operations - Why Each One Matters:**

```
🎯 CORE STACK OPERATIONS:

✅ PUSH (add to top): O(1)
- Add new element to top of stack
- Used for: saving state, building expressions

✅ POP (remove from top): O(1)  
- Remove and return top element
- Used for: backtracking, unwinding operations

✅ PEEK/TOP (look at top): O(1)
- See top element without removing
- Used for: checking current state

✅ IS_EMPTY: O(1)
- Check if stack has elements
- Used for: loop termination, validation

WHY STACKS ARE POWERFUL:
- Function calls use stacks (call stack)
- Expression evaluation uses stacks
- Backtracking algorithms use stacks
- Browser history uses stacks
```

### 🔍 **Visual Step-by-Step - Stack in Action:**

```
EXAMPLE: Evaluate expression "2 + 3 * 4" using stacks

STEP 1: Process "2"
Stack: [2]
Action: Push operand

STEP 2: Process "+"  
Stack: [2, +]
Action: Push operator

STEP 3: Process "3"
Stack: [2, +, 3]  
Action: Push operand

STEP 4: Process "*" (higher precedence than +)
Stack: [2, +, 3, *]
Action: Push operator

STEP 5: Process "4"
Stack: [2, +, 3, *, 4]
Action: Push operand

STEP 6: End of expression - evaluate
Pop: 4, *, 3 → 3*4 = 12
Stack: [2, +, 12]

Pop: 12, +, 2 → 2+12 = 14  
Stack: [14]

RESULT: 14

🎯 WHY STACKS WORK HERE:
- LIFO naturally handles operator precedence
- Inner operations (higher precedence) evaluated first
- Outer operations wait in stack until needed
```

## 📚 What are Queues?

### 🤔 **Understanding Queue Behavior - The FIFO Principle**

**Real-World Analogy**: Like a line at a coffee shop
- **First person in line** is **first served**
- New people join at the back (rear)
- People leave from the front
- Fair ordering - no cutting in line!

**Key Insight**: Queues are perfect for **processing in order** and **scheduling tasks**

### 📖 **Queue Operations - The Fair Processing System:**

```
🎯 CORE QUEUE OPERATIONS:

✅ ENQUEUE (add to rear): O(1)
- Add new element to back of queue
- Used for: task scheduling, BFS traversal

✅ DEQUEUE (remove from front): O(1)
- Remove and return front element  
- Used for: processing next task

✅ FRONT (peek at front): O(1)
- See front element without removing
- Used for: checking next item to process

✅ IS_EMPTY: O(1)
- Check if queue has elements
- Used for: loop termination

WHY QUEUES ARE ESSENTIAL:
- BFS traversal uses queues
- Task scheduling uses queues  
- Print job management uses queues
- Buffer management uses queues
```

### 🔍 **Visual Step-by-Step - Queue in Action:**

```
EXAMPLE: BFS traversal using queue

INITIAL GRAPH:
    A
   / \
  B   C
 /   / \
D   E   F

STEP 1: Start BFS from A
Queue: [A]
Visited: {}
Action: Add starting node

STEP 2: Process A (dequeue front)
Queue: [B, C]     ← Added A's neighbors to rear
Visited: {A}
Action: Visit A, add its unvisited neighbors

STEP 3: Process B (dequeue front)  
Queue: [C, D]     ← Added B's neighbors to rear
Visited: {A, B}
Action: Visit B, add its unvisited neighbors

STEP 4: Process C (dequeue front)
Queue: [D, E, F]  ← Added C's neighbors to rear  
Visited: {A, B, C}
Action: Visit C, add its unvisited neighbors

STEP 5: Process D (dequeue front)
Queue: [E, F]     ← D has no unvisited neighbors
Visited: {A, B, C, D}

Continue until queue is empty...

🎯 WHY QUEUES WORK FOR BFS:
- FIFO ensures we visit all nodes at distance d before distance d+1
- Natural level-by-level exploration
- Guarantees shortest path in unweighted graphs
```

### 🚀 **Stack vs Queue - When to Use Which:**

```
🔍 USE STACKS WHEN:
✅ Need to reverse order (LIFO)
✅ Implementing recursion iteratively
✅ Parsing nested structures (parentheses, HTML tags)
✅ Backtracking algorithms
✅ Function call management
✅ Undo operations

EXAMPLES:
- Valid parentheses checking
- DFS traversal
- Expression evaluation
- Browser back button

⚡ USE QUEUES WHEN:
✅ Need to maintain order (FIFO)
✅ Processing tasks in arrival order
✅ Level-order traversal
✅ Shortest path algorithms
✅ Buffering data streams

EXAMPLES:
- BFS traversal
- Task scheduling
- Print job management
- Keyboard buffer
```
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Test basic stack operations
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(f"Top element: {stack.peek()}")
stack.pop()
stack.pop()
```

## 🔥 Problem: Valid Parentheses

### 🤔 **Problem Understanding - The Bracket Matching Challenge**

**Real-World Analogy**: Like checking if doors are properly opened and closed in a building
- **Opening bracket** = Opening a door (must remember to close it)
- **Closing bracket** = Closing a door (must match the most recently opened door)
- **Stack behavior** = LIFO matches natural door behavior (last opened, first closed)
- **Invalid cases** = Closing wrong door or leaving doors open

**Key Insight**: Stack's LIFO property perfectly matches the nested nature of valid parentheses

### 📖 **Problem Statement:**
Given a string containing only parentheses characters '(', ')', '{', '}', '[', ']', determine if the input string is valid.

**Valid string rules:**
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order
3. Every close bracket has a corresponding open bracket

**Examples:**
```
VALID:
"()" → True
"()[]{}" → True  
"{[()]}" → True (properly nested)

INVALID:
"(]" → False (wrong bracket type)
"([)]" → False (wrong order)
"(((" → False (unclosed brackets)
")))" → False (no opening brackets)
```

### 🎯 **Algorithm Strategy - Stack-Based Matching:**

```
🎯 VALID PARENTHESES ALGORITHM:
1. Use stack to track opening brackets
2. For each character:
   a. If opening bracket → push to stack
   b. If closing bracket → check if it matches top of stack
   c. If match → pop from stack
   d. If no match or empty stack → invalid
3. At end, stack must be empty (all brackets closed)

WHY STACK WORKS:
- LIFO naturally handles nested structure
- Most recent opening bracket should be closed first
- Stack tracks "pending" opening brackets
- Empty stack at end = all brackets properly closed
```

### 🔍 **Step-by-Step Visual Trace:**

```
EXAMPLE 1: "{[()]}" (VALID case)

┌─────────────────────────────────────────┐
│ STEP 1: Process '{'                     │
│ Opening bracket → Push to stack         │
│ Stack: ['{']                            │
│ Action: Continue                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Process '['                     │
│ Opening bracket → Push to stack         │
│ Stack: ['{', '[']                       │
│ Action: Continue                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Process '('                     │
│ Opening bracket → Push to stack         │
│ Stack: ['{', '[', '(']                  │
│ Action: Continue                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 4: Process ')'                     │
│ Closing bracket → Check top of stack    │
│ Top: '(' matches ')' ✓                  │
│ Stack: ['{', '[']                       │
│ Action: Pop and continue                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 5: Process ']'                     │
│ Closing bracket → Check top of stack    │
│ Top: '[' matches ']' ✓                  │
│ Stack: ['{']                            │
│ Action: Pop and continue                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 6: Process '}'                     │
│ Closing bracket → Check top of stack    │
│ Top: '{' matches '}' ✓                  │
│ Stack: []                               │
│ Action: Pop and continue                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ END: All characters processed           │
│ Stack is empty ✓                       │
│ Result: VALID                           │
└─────────────────────────────────────────┘

EXAMPLE 2: "([)]" (INVALID case)

┌─────────────────────────────────────────┐
│ STEP 1: Process '('                     │
│ Stack: ['(']                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Process '['                     │
│ Stack: ['(', '[']                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Process ')'                     │
│ Closing bracket → Check top of stack    │
│ Top: '[' does NOT match ')' ✗           │
│ Expected ']' but found ')'              │
│ Result: INVALID                         │
└─────────────────────────────────────────┘
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def is_valid_parentheses(s):
    """
    🎯 STACK-BASED PARENTHESES VALIDATION
    
    Args:
        s: String containing only parentheses characters
        
    Returns:
        Boolean indicating if parentheses are valid
        
    Time: O(n) - Single pass through string
    Space: O(n) - Stack can hold at most n/2 opening brackets
    """
    # Define matching pairs
    matching = {')': '(', '}': '{', ']': '['}
    opening = set(['(', '{', '['])
    stack = []
    
    for char in s:
        if char in opening:
            # Opening bracket - push to stack
            stack.append(char)
        elif char in matching:
            # Closing bracket - check for match
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        # Ignore non-bracket characters if any
    
    # Valid only if all brackets are closed (stack empty)
    return len(stack) == 0

def is_valid_optimized(s):
    """
    🎯 OPTIMIZED VERSION WITH EARLY TERMINATION
    
    Additional optimizations:
    - Early return if string length is odd
    - Early return if more closing than opening brackets
    """
    # Odd length strings can't be valid
    if len(s) % 2 == 1:
        return False
    
    matching = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            # Closing bracket
            if not stack or stack.pop() != matching[char]:
                return False
    
    return len(stack) == 0

# 🔍 TRACE FUNCTION:
def is_valid_with_trace(s):
    """Same algorithm with detailed execution tracing"""
    print(f"\n🔍 VALIDATING PARENTHESES: '{s}'")
    
    if not s:
        print("Empty string → Valid")
        return True
    
    matching = {')': '(', '}': '{', ']': '['}
    opening = set(['(', '{', '['])
    stack = []
    
    for i, char in enumerate(s):
        print(f"\nStep {i+1}: Processing '{char}'")
        print(f"  Stack before: {stack}")
        
        if char in opening:
            stack.append(char)
            print(f"  Opening bracket → Push to stack")
            print(f"  Stack after: {stack}")
        
        elif char in matching:
            print(f"  Closing bracket → Check for match")
            
            if not stack:
                print(f"  ❌ ERROR: Stack is empty, no opening bracket for '{char}'")
                return False
            
            top = stack[-1]
            expected = matching[char]
            
            if top == expected:
                stack.pop()
                print(f"  ✅ MATCH: '{top}' matches '{char}'")
                print(f"  Stack after pop: {stack}")
            else:
                print(f"  ❌ ERROR: Expected '{expected}' but found '{top}'")
                return False
    
    print(f"\n🎯 End of string analysis:")
    print(f"  Final stack: {stack}")
    
    if len(stack) == 0:
        print(f"  ✅ Stack is empty → VALID")
        return True
    else:
        print(f"  ❌ Stack not empty → INVALID (unclosed brackets)")
        return False

# 📝 TESTING THE SOLUTION:
def test_valid_parentheses():
    test_cases = [
        ("()", True),           # Simple valid
        ("()[]{}", True),       # Multiple types valid
        ("{[()]}", True),       # Nested valid
        ("(]", False),          # Wrong type
        ("([)]", False),        # Wrong order
        ("((", False),          # Unclosed
        ("))", False),          # No opening
        ("", True),             # Empty string
        ("(())", True),         # Nested same type
        ("{[}]", False),        # Interleaved invalid
    ]
    
    print("🧪 TESTING VALID PARENTHESES ALGORITHMS")
    print("=" * 50)
    
    for i, (test_string, expected) in enumerate(test_cases):
        print(f"\nTest Case {i+1}: '{test_string}'")
        
        result = is_valid_parentheses(test_string)
        optimized_result = is_valid_optimized(test_string)
        
        print(f"Expected: {expected}")
        print(f"Basic algorithm: {result}")
        print(f"Optimized algorithm: {optimized_result}")
        
        status = "✅ PASS" if result == expected else "❌ FAIL"
        print(f"Status: {status}")
        
        # Detailed trace for interesting cases
        if test_string in ["{[()]}", "([)]"]:
            is_valid_with_trace(test_string)

test_valid_parentheses()

Stack is empty → Valid!
```

### Implementation:
```python
def is_valid_parentheses(s):
    """Check if parentheses string is valid"""
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    print(f"Checking: {s}")
    
    for i, char in enumerate(s):
        if char in mapping:  # Closing bracket
            if not stack:
                print(f"Step {i+1}: Found closing '{char}' but stack is empty - INVALID")
                return False
            
            top = stack.pop()
            expected = mapping[char]
            
            if top != expected:
                print(f"Step {i+1}: Found closing '{char}', expected '{expected}' but got '{top}' - INVALID")
                return False
            
            print(f"Step {i+1}: Matched '{char}' with '{top}' ✓")
        else:  # Opening bracket
            stack.append(char)
            print(f"Step {i+1}: Pushed opening '{char}' to stack: {stack}")
    
    is_valid = len(stack) == 0
    if is_valid:
        print("All brackets matched - VALID")
    else:
        print(f"Unmatched opening brackets remain: {stack} - INVALID")
    
    return is_valid

# Test cases
test_cases = ["()", "()[]{}", "(]", "([)]", "{[()]}"]

for test in test_cases:
    result = is_valid_parentheses(test)
    print(f"'{test}' → {result}\n")
```

## 🎯 Pattern 2: Monotonic Stack

### What is a Monotonic Stack?
A stack where elements are always in increasing or decreasing order. We pop elements that violate this order.

### Problem: Next Greater Element
For each element in array, find the next greater element to its right.

### Example:
```
Array: [2, 1, 2, 4, 3, 1]
Result: [4, 2, 4, -1, -1, -1]

Explanation:
- 2: next greater is 4
- 1: next greater is 2  
- 2: next greater is 4
- 4: no greater element → -1
- 3: no greater element → -1
- 1: no greater element → -1
```

### Strategy:
Use a stack to keep track of elements waiting for their "next greater element".

### Visual Solution:
```
Array: [2, 1, 2, 4, 3, 1]
Index:  0  1  2  3  4  5

Process index 0 (value 2):
Stack: [0] (indices waiting for next greater)
Result: [-1, -1, -1, -1, -1, -1]

Process index 1 (value 1):  
1 < 2, so 1 still waiting
Stack: [0, 1]
Result: [-1, -1, -1, -1, -1, -1]

Process index 2 (value 2):
2 > 1, so element at index 1 found its next greater!
Pop 1, set result[1] = 2
2 == 2, so element at index 0 still waiting
Stack: [0, 2]
Result: [-1, 2, -1, -1, -1, -1]

Process index 3 (value 4):
4 > 2, so elements at indices 2 and 0 found next greater!
Pop 2, set result[2] = 4
Pop 0, set result[0] = 4
Stack: [3]
Result: [4, 2, 4, -1, -1, -1]

And so on...
```

### Implementation:
```python
def next_greater_element(nums):
    """Find next greater element for each position"""
    result = [-1] * len(nums)
    stack = []  # Store indices
    
    print(f"Array: {nums}")
    print("Finding next greater elements:")
    
    for i in range(len(nums)):
        print(f"\nStep {i+1}: Processing index {i} (value {nums[i]})")
        
        # Pop elements smaller than current
        while stack and nums[i] > nums[stack[-1]]:
            index = stack.pop()
            result[index] = nums[i]
            print(f"  Found next greater for index {index} (value {nums[index]}) → {nums[i]}")
        
        stack.append(i)
        print(f"  Stack now: {[f'{idx}({nums[idx]})' for idx in stack]}")
        print(f"  Result so far: {result}")
    
    print(f"\nFinal result: {result}")
    return result

# Test next greater element
nums = [2, 1, 2, 4, 3, 1]
result = next_greater_element(nums)
```

### Daily Temperatures (Variation):
Instead of finding the next greater element, find how many days until a warmer temperature.

```python
def daily_temperatures(temperatures):
    """Find days until warmer temperature"""
    result = [0] * len(temperatures)
    stack = []  # Store indices
    
    print(f"Temperatures: {temperatures}")
    
    for i in range(len(temperatures)):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            days_diff = i - prev_day
            result[prev_day] = days_diff
            print(f"Day {prev_day} ({temperatures[prev_day]}°) → Day {i} ({temperatures[i]}°): {days_diff} days")
        
        stack.append(i)
    
    print(f"Result: {result}")
    return result

# Test daily temperatures
temps = [73, 74, 75, 71, 69, 72, 76, 73]
daily_temperatures(temps)
```

## 📚 What are Queues?

A queue is like a line at a store - first person in line is first to be served. This is called **FIFO** (First In, First Out).

### Visual Representation:
```
Queue Operations:
    ┌─┬─┬─┐     Enqueue 4     ┌─┬─┬─┬─┐
    │1│2│3│  ────────────────>│1│2│3│4│
    └─┴─┴─┘                   └─┴─┴─┴─┘
    ↑                         ↑
   front                     front

    ┌─┬─┬─┐     Dequeue()     ┌─┬─┐
    │2│3│4│  <────────────────│2│3│4│  returns 1
    └─┴─┴─┘                   └─┴─┘
    ↑                         ↑
   front                     front
```

### Basic Queue Implementation:
```python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        """Add item to rear of queue"""
        self.items.append(item)
        print(f"Enqueued {item}, queue: {list(self.items)}")
    
    def dequeue(self):
        """Remove and return front item"""
        if self.is_empty():
            return None
        item = self.items.popleft()
        print(f"Dequeued {item}, queue: {list(self.items)}")
        return item
    
    def front(self):
        """Return front item without removing"""
        if self.is_empty():
            return None
        return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Test basic queue operations
queue = Queue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
print(f"Front element: {queue.front()}")
queue.dequeue()
queue.dequeue()
```

## 🎯 Pattern 3: Level Order Traversal (BFS)

### Problem:
Traverse a binary tree level by level using a queue.

### Visual Example:
```
Tree:
       1
      / \
     2   3
    / \
   4   5

Level 0: [1]
Level 1: [2, 3]  
Level 2: [4, 5]

Queue operations:
Start: queue = [1]
Process 1: queue = [2, 3] (add children of 1)
Process 2: queue = [3, 4, 5] (add children of 2)
Process 3: queue = [4, 5] (no children for 3)
Process 4: queue = [5] (no children for 4)
Process 5: queue = [] (no children for 5)
```

### Implementation:
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root):
    """Level order traversal using queue"""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    print("Level order traversal:")
    level = 0
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        print(f"Level {level}: processing {level_size} nodes")
        
        for i in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            print(f"  Processing node {node.val}")
            
            if node.left:
                queue.append(node.left)
                print(f"    Added left child {node.left.val}")
            if node.right:
                queue.append(node.right)
                print(f"    Added right child {node.right.val}")
        
        result.append(current_level)
        print(f"  Level {level} result: {current_level}")
        level += 1
    
    return result

# Build example tree
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

result = level_order_traversal(root)
print(f"Final result: {result}")
```

## 🎯 Pattern 4: Sliding Window Maximum

### Problem:
Given an array and window size k, find the maximum element in each sliding window.

### Example:
```
Array: [1, 3, -1, -3, 5, 3, 6, 7]
k = 3

Windows:
[1, 3, -1] → max = 3
[3, -1, -3] → max = 3  
[-1, -3, 5] → max = 5
[-3, 5, 3] → max = 5
[5, 3, 6] → max = 6
[3, 6, 7] → max = 7

Result: [3, 3, 5, 5, 6, 7]
```

### Strategy:
Use a deque to maintain indices of useful elements in decreasing order of their values.

### Implementation:
```python
def sliding_window_maximum(nums, k):
    """Find maximum in each sliding window"""
    result = []
    dq = deque()  # Store indices
    
    print(f"Array: {nums}, window size: {k}")
    
    for i in range(len(nums)):
        print(f"\nStep {i+1}: Processing index {i} (value {nums[i]})")
        
        # Remove indices outside current window
        while dq and dq[0] <= i - k:
            removed = dq.popleft()
            print(f"  Removed index {removed} (outside window)")
        
        # Remove indices with smaller values (they're useless)
        while dq and nums[i] >= nums[dq[-1]]:
            removed = dq.pop()
            print(f"  Removed index {removed} (value {nums[removed]} ≤ {nums[i]})")
        
        dq.append(i)
        print(f"  Added index {i} to deque: {list(dq)}")
        
        # If window is full, record maximum
        if i >= k - 1:
            max_idx = dq[0]
            max_val = nums[max_idx]
            result.append(max_val)
            print(f"  Window [{i-k+1}:{i+1}]: maximum = {max_val} (at index {max_idx})")
    
    print(f"\nResult: {result}")
    return result

# Test sliding window maximum
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
sliding_window_maximum(nums, k)
```

## 🧠 When to Use Stacks vs Queues

### Use Stacks for:
- **Matching/Balancing**: Parentheses, HTML tags
- **Undo operations**: Text editors, browser back button
- **Expression evaluation**: Infix to postfix, calculator
- **Backtracking**: DFS, maze solving
- **Monotonic problems**: Next greater element, largest rectangle

### Use Queues for:
- **Level-order processing**: BFS, tree level traversal
- **Task scheduling**: Print queue, CPU scheduling
- **Sliding window**: Moving average, window maximum
- **Stream processing**: First come, first served

## 🎯 Practice Problems

### Stack Problems:
1. **Valid Parentheses** - Basic stack matching
2. **Min Stack** - Stack with constant-time minimum
3. **Evaluate Reverse Polish Notation** - Calculator using stack
4. **Daily Temperatures** - Monotonic stack pattern
5. **Largest Rectangle in Histogram** - Advanced monotonic stack

### Queue Problems:
1. **Binary Tree Level Order Traversal** - BFS with queue
2. **Sliding Window Maximum** - Deque optimization
3. **Moving Average** - Simple queue application
4. **Design Hit Counter** - Queue with time windows

### Advanced:
1. **Implement Stack using Queues** - Data structure conversion
2. **Implement Queue using Stacks** - Data structure conversion
3. **Design Browser History** - Stack for back/forward

## 📝 Quick Templates

### Stack Template:
```python
stack = []
stack.append(item)    # Push
item = stack.pop()    # Pop
top = stack[-1]       # Peek
```

### Queue Template (using deque):
```python
from collections import deque
queue = deque()
queue.append(item)      # Enqueue
item = queue.popleft()  # Dequeue
front = queue[0]        # Front
```

### Monotonic Stack:
```python
stack = []
for i, num in enumerate(nums):
    while stack and nums[i] > nums[stack[-1]]:
        # Found next greater for stack[-1]
        index = stack.pop()
    stack.append(i)
```

This comprehensive guide covers all essential stack and queue patterns with detailed explanations and examples!
