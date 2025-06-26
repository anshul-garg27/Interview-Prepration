# 💎 Dynamic Programming - Complete Mastery Guide

## 📚 What is Dynamic Programming?

### 🤔 **The Core Insight - Why DP is Revolutionary**

**Real-World Analogy**: Like taking notes during a lecture
- **Without notes**: Every time you forget something, re-attend the entire lecture
- **With notes**: Look up what you wrote down - instant recall!

**DP is the "taking notes" of algorithms** - we save answers to avoid recalculating them.

### 📖 **The Two Key Properties That Enable DP:**

```
🎯 PROPERTY 1: OVERLAPPING SUBPROBLEMS
Same smaller problems appear multiple times

Example: Calculating F(5)
F(5) = F(4) + F(3)
F(4) = F(3) + F(2)  ← F(3) appears again!
F(3) = F(2) + F(1)

Without DP: F(3) calculated multiple times
With DP: F(3) calculated once, then reused

🎯 PROPERTY 2: OPTIMAL SUBSTRUCTURE  
Optimal solution contains optimal solutions to subproblems

Example: Shortest path from A to C through B
If A→B→C is shortest, then A→B must also be shortest path to B
```

### 🔍 **Visual Comparison - The DP Advantage:**

```
FIBONACCI WITHOUT DP (Naive Recursion):
                    F(5)
                   /    \
                F(4)    F(3)
               /  \     /  \
            F(3)  F(2) F(2) F(1)
           /  \   /  \
        F(2) F(1) F(1) F(0)
        /  \
     F(1) F(0)

❌ Problems:
- F(3) calculated 2 times
- F(2) calculated 3 times  
- F(1) calculated 5 times
- Time: O(2^n) - EXPONENTIAL!

FIBONACCI WITH DP (Memoization):
                    F(5)
                   /    \
                F(4)    F(3) ✓ (lookup)
               /  \     
            F(3) ✓ F(2) ✓ (lookup)
           /  \   
        F(2) ✓ F(1) ✓ (lookup)
        /  \
     F(1) ✓ F(0) ✓

✅ Benefits:
- Each subproblem calculated ONCE
- Subsequent calls = O(1) lookup
- Time: O(n) - LINEAR!
```

### 🚀 **The Two DP Approaches Explained:**

#### **Top-Down (Memoization) - "Start Big, Break Down"**
```
🎯 ANALOGY: Like solving a puzzle
1. Start with big picture (final goal)
2. Break into smaller pieces as needed
3. Remember each piece you solve
4. Reuse pieces when needed again

ALGORITHM:
1. Check if problem already solved (in memo)
2. If yes: return saved answer
3. If no: solve recursively, save answer, return it

WHEN TO USE:
✅ When recursion feels natural
✅ Don't need to solve ALL subproblems
✅ Problem has clear recursive structure
```

#### **Bottom-Up (Tabulation) - "Start Small, Build Up"**
```
🎯 ANALOGY: Like building a pyramid
1. Start with foundation (base cases)
2. Build each level using previous levels
3. Work your way up to the top

ALGORITHM:
1. Create table for all subproblems
2. Fill base cases
3. Fill remaining entries using smaller problems
4. Return final answer

WHEN TO USE:
✅ Need to solve most/all subproblems anyway
✅ Want to avoid recursion overhead
✅ Clear order of solving subproblems
```

## 🎯 Pattern 1: Fibonacci Sequence

### 🤔 **Problem Understanding - The Overlapping Subproblems Challenge**

**Real-World Analogy**: Like climbing stairs where you can take 1 or 2 steps at a time
- **Naive approach**: Calculate every possible way from scratch (exponential time)
- **Smart approach**: Remember previous calculations and reuse them
- **Key insight**: F(n) depends on F(n-1) and F(n-2) - classic overlapping subproblems

**Mathematical Foundation**: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)

### 📖 **Problem Statement:**
Calculate the nth Fibonacci number efficiently.

**Example:**
```
F(0) = 0
F(1) = 1  
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
...
```

### 🎯 **The Evolution from Naive to Optimal:**

### Method 1: Naive Recursion (❌ EXPONENTIAL TIME)

```python
def fib_naive(n):
    """
    🚫 NAIVE RECURSIVE APPROACH - EXPONENTIALLY SLOW!
    
    Time: O(2^n) - Each call makes 2 more calls
    Space: O(n) - Maximum recursion depth
    
    WHY IT'S TERRIBLE:
    - Recalculates same values multiple times
    - F(5) calculates F(3) multiple times
    - F(3) calculates F(2) multiple times
    - Explosive growth in redundant calculations
    """
    print(f"🔄 Calculating F({n})")
    
    if n <= 1:
        print(f"✓ Base case: F({n}) = {n}")
        return n
    
    left = fib_naive(n - 1)
    right = fib_naive(n - 2)
    result = left + right
    
    print(f"✓ F({n}) = F({n-1}) + F({n-2}) = {left} + {right} = {result}")
    return result

# ⚠️ DON'T RUN for n > 35 - it will take forever!
```

### 🔍 **Why Naive Recursion is So Slow - Call Tree Analysis:**

```
EXAMPLE: Computing F(5) with naive recursion

                    F(5)
                   /     \
               F(4)       F(3)
              /   \       /   \
          F(3)   F(2)   F(2)  F(1)
         /  \    / \    / \
     F(2) F(1) F(1) F(0) F(1) F(0)
     / \
  F(1) F(0)

REDUNDANT CALCULATIONS:
- F(3) calculated 2 times
- F(2) calculated 3 times  
- F(1) calculated 5 times
- F(0) calculated 3 times

Total function calls: 15 for just F(5)!
F(40) would need ~2 billion calls!
```

### Method 2: Top-Down DP with Memoization (✅ EFFICIENT)

```python
def fib_memo(n, memo=None):
    """
    🎯 TOP-DOWN DP WITH MEMOIZATION
    
    Args:
        n: Fibonacci number to calculate
        memo: Dictionary storing previously calculated results
        
    Returns:
        nth Fibonacci number
        
    Time: O(n) - Each number calculated exactly once
    Space: O(n) - Memo dictionary + recursion stack
    
    KEY INSIGHT: "Calculate once, use many times"
    """
    if memo is None:
        memo = {}
    
    print(f"🔍 Calculating F({n})")
    
    # Check if already calculated (memoization magic!)
    if n in memo:
        print(f"💾 Cache hit! F({n}) = {memo[n]} (already calculated)")
        return memo[n]
    
    # Base cases
    if n <= 1:
        memo[n] = n
        print(f"📌 Base case: F({n}) = {n}")
        return n
    
    # Calculate and store result
    left = fib_memo(n - 1, memo)
    right = fib_memo(n - 2, memo)
    memo[n] = left + right
    
    print(f"💾 Storing: F({n}) = F({n-1}) + F({n-2}) = {left} + {right} = {memo[n]}")
    
    return memo[n]

# 🔍 TRACE FUNCTION:
def fib_memo_with_trace(n):
    """Same algorithm with detailed execution trace"""
    memo = {}
    
    def trace_fib(num, depth=0):
        indent = "  " * depth
        print(f"{indent}→ F({num})")
        
        if num in memo:
            print(f"{indent}  💾 Found in cache: {memo[num]}")
            return memo[num]
        
        if num <= 1:
            memo[num] = num
            print(f"{indent}  📌 Base case: {num}")
            return num
        
        print(f"{indent}  🔄 Need to calculate F({num-1}) and F({num-2})")
        left = trace_fib(num - 1, depth + 1)
        right = trace_fib(num - 2, depth + 1)
        
        memo[num] = left + right
        print(f"{indent}  ✓ F({num}) = {left} + {right} = {memo[num]}")
        
        return memo[num]
    
    result = trace_fib(n)
    print(f"\n🎯 Final memo table: {dict(sorted(memo.items()))}")
    return result
```

### Method 3: Bottom-Up DP (Tabulation) (✅ ITERATIVE & EFFICIENT)

```python
def fib_bottom_up(n):
    """
    🎯 BOTTOM-UP DP (TABULATION)
    
    Args:
        n: Fibonacci number to calculate
        
    Returns:
        nth Fibonacci number
        
    Time: O(n) - Single loop from 0 to n
    Space: O(n) - DP table
    
    STRATEGY: Build solution from smallest subproblems up
    """
    if n <= 1:
        return n
    
    # Create table to store ALL results from 0 to n
    dp = [0] * (n + 1)
    
    # Initialize base cases
    dp[0] = 0  # F(0) = 0
    dp[1] = 1  # F(1) = 1
    
    print(f"📊 Initial DP table: {dp}")
    print(f"📌 Base cases: dp[0] = {dp[0]}, dp[1] = {dp[1]}")
    
    # Fill table from bottom up (small to large)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        print(f"🔢 dp[{i}] = dp[{i-1}] + dp[{i-2}] = {dp[i-1]} + {dp[i-2]} = {dp[i]}")
        print(f"📊 Current table: {dp[:i+1]}")
    
    print(f"🎯 Final DP table: {dp}")
    return dp[n]
```

### Method 4: Space-Optimized DP (✅ OPTIMAL)

```python
def fib_optimized(n):
    """
    🎯 SPACE-OPTIMIZED DP - ONLY KEEP LAST 2 VALUES
    
    Args:
        n: Fibonacci number to calculate
        
    Returns:
        nth Fibonacci number
        
    Time: O(n) - Single loop
    Space: O(1) - Only 3 variables
    
    KEY INSIGHT: We only need previous 2 values, not entire history
    """
    if n <= 1:
        return n
    
    # Only keep track of last 2 Fibonacci numbers
    prev2, prev1 = 0, 1  # F(0), F(1)
    
    print(f"🔢 Starting: F(0) = {prev2}, F(1) = {prev1}")
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        print(f"🔢 F({i}) = F({i-1}) + F({i-2}) = {prev1} + {prev2} = {current}")
        
        # Slide the window forward
        prev2, prev1 = prev1, current
        print(f"📊 Updated: prev2 = {prev2}, prev1 = {prev1}")
    
    return prev1

# 📝 TESTING ALL APPROACHES:
def test_fibonacci_methods():
    test_values = [0, 1, 5, 10, 15]
    
    for n in test_values:
        print(f"\n{'='*50}")
        print(f"🎯 TESTING F({n})")
        print(f"{'='*50}")
        
        # Only test naive for small values (it's too slow)
        if n <= 10:
            print("🚫 Naive Recursive (first few only):")
            if n <= 7:  # Even smaller limit for demo
                result_naive = fib_naive(n)
                print(f"Result: {result_naive}\n")
        
        print("🎯 Memoized Recursive:")
        result_memo = fib_memo_with_trace(n)
        print()
        
        print("🎯 Bottom-Up DP:")
        result_bottom_up = fib_bottom_up(n)
        print()
        
        print("🎯 Space-Optimized:")
        result_optimized = fib_optimized(n)
        print(f"Final result: {result_optimized}")

test_fibonacci_methods()
```

### ⚡ **Performance Comparison:**

```
🔍 COMPLEXITY ANALYSIS:

Method 1 - Naive Recursion:
❌ Time: O(2^n) - Exponential explosion
❌ Space: O(n) - Recursion stack depth
❌ Use case: NEVER use this for n > 30

Method 2 - Memoization:
✅ Time: O(n) - Each subproblem solved once
✅ Space: O(n) - Memo table + recursion stack
✅ Use case: When recursive thinking is natural

Method 3 - Bottom-Up DP:
✅ Time: O(n) - Single loop
✅ Space: O(n) - DP table
✅ Use case: When iterative approach is clearer

Method 4 - Space-Optimized:
✅ Time: O(n) - Single loop
✅ Space: O(1) - Only 3 variables
✅ Use case: When memory is critical

BENCHMARK RESULTS:
F(40):
- Naive: ~1.6 seconds (2^40 ≈ 1 trillion operations)
- Memoized: 0.0001 seconds (40 operations)
- Bottom-up: 0.0001 seconds (40 operations)  
- Optimized: 0.0001 seconds (40 operations)
```

### 🔍 **Common Pitfalls & Advanced Insights:**

```
❌ PITFALL 1: Using naive recursion for large n
Solution: Always use memoization or tabulation

❌ PITFALL 2: Not initializing memo properly
Solution: Use None check or pass empty dict

❌ PITFALL 3: Off-by-one errors in loops
Solution: Carefully check range(2, n + 1)

❌ PITFALL 4: Not optimizing space when possible
Solution: Ask if you need the entire DP table

🎯 ADVANCED INSIGHTS:
1. Matrix exponentiation can solve in O(log n) time
2. Golden ratio formula exists but has floating point precision issues
3. This pattern applies to ANY recurrence relation
4. Memoization = Top-Down, Tabulation = Bottom-Up

🔍 PATTERN RECOGNITION:
The Fibonacci pattern appears in:
- Climbing stairs problems
- Decode ways
- House robber
- Minimum cost climbing stairs
All follow: dp[i] = function(dp[i-1], dp[i-2], ...)
```
    
    return prev1

# Test it:
result = fib_optimized(10)
print(f"F(10) = {result}")
```

## 🎯 Pattern 2: Climbing Stairs

### 🤔 **Problem Understanding - The Step-by-Step Journey**

**Real-World Analogy**: Like planning routes to reach a destination
- **From step n-1**: Take one more step to reach step n
- **From step n-2**: Take a big 2-step jump to reach step n
- **Total ways**: Sum of all possible previous positions

**Key Insight**: This is Fibonacci in disguise! Every step depends on the previous two steps.

### 📖 **Problem Statement:**
You're climbing stairs. You can take 1 or 2 steps at a time. How many distinct ways can you reach the nth step?

**Example:**
```
n = 4 stairs

All possible ways to reach step 4:
1. 1+1+1+1 (four 1-steps)
2. 1+1+2   (two 1-steps, one 2-step) 
3. 1+2+1   (one 1-step, one 2-step, one 1-step)
4. 2+1+1   (one 2-step, two 1-steps)
5. 2+2     (two 2-steps)

Total: 5 ways
```

### 🎯 **Algorithm Strategy - Dynamic Programming Recognition:**

```
🎯 THE RECURRENCE RELATION:
To reach step n, you can come from:
- Step (n-1) → take 1 step → reach step n
- Step (n-2) → take 2 steps → reach step n

Therefore: ways(n) = ways(n-1) + ways(n-2)

BASE CASES:
- ways(0) = 1 (one way to stay at ground)
- ways(1) = 1 (only one 1-step)
- ways(2) = 2 (either 1+1 or single 2-step)

PATTERN RECOGNITION: This is Fibonacci sequence!
```

### 🔍 **Step-by-Step Visual Building Process:**

```
EXAMPLE: Calculate ways to reach step 5

BUILDING FROM BOTTOM UP:
┌─────────────────────────────────────────┐
│ STEP 0: ways(0) = 1                     │
│ One way: stay at ground level           │
│ Paths: [start]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 1: ways(1) = 1                     │
│ One way: take single 1-step             │
│ Paths: [1]                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: ways(2) = ways(1) + ways(0)     │
│         = 1 + 1 = 2                     │
│ From step 1: take 1-step → [1,1]        │
│ From step 0: take 2-step → [2]          │
│ Paths: [1,1], [2]                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: ways(3) = ways(2) + ways(1)     │
│         = 2 + 1 = 3                     │
│ From step 2: take 1-step → [1,1,1], [2,1]│
│ From step 1: take 2-step → [1,2]        │
│ Paths: [1,1,1], [2,1], [1,2]            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 4: ways(4) = ways(3) + ways(2)     │
│         = 3 + 2 = 5                     │
│ From step 3: take 1-step                │
│   → [1,1,1,1], [2,1,1], [1,2,1]        │
│ From step 2: take 2-step                │
│   → [1,1,2], [2,2]                     │
│ Paths: [1,1,1,1], [2,1,1], [1,2,1],    │
│        [1,1,2], [2,2]                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 5: ways(5) = ways(4) + ways(3)     │
│         = 5 + 3 = 8                     │
│ Total ways to reach step 5: 8           │
└─────────────────────────────────────────┘

FIBONACCI SEQUENCE: 1, 1, 2, 3, 5, 8...
CLIMBING STAIRS:    1, 1, 2, 3, 5, 8...
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def climb_stairs(n):
    """
    🎯 CLIMBING STAIRS - DYNAMIC PROGRAMMING SOLUTION
    
    Args:
        n: Number of stairs to climb
        
    Returns:
        Number of distinct ways to reach the nth step
        
    Time: O(n) - Single pass through all steps
    Space: O(n) - DP array storage
    """
    if n <= 2:
        return n
    
    # dp[i] = number of ways to reach step i
    dp = [0] * (n + 1)
    dp[0] = 1  # One way to stay at start (for calculation purposes)
    dp[1] = 1  # One way to reach step 1: [1]
    dp[2] = 2  # Two ways to reach step 2: [1,1] or [2]
    
    print(f"📊 Base cases:")
    print(f"   Step 0: {dp[0]} way (stay at start)")
    print(f"   Step 1: {dp[1]} way → [1]")
    print(f"   Step 2: {dp[2]} ways → [1,1], [2]")
    print()
    
    # Build up solution from step 3 to n
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        print(f"📈 Step {i}: ways({i-1}) + ways({i-2}) = {dp[i-1]} + {dp[i-2]} = {dp[i]}")
        print(f"   Can reach from step {i-1} (take 1-step) or step {i-2} (take 2-step)")
    
    print(f"\n🎯 Final DP array: {dp}")
    return dp[n]

# 🔍 SPACE-OPTIMIZED VERSION:
def climb_stairs_optimized(n):
    """
    🎯 SPACE-OPTIMIZED CLIMBING STAIRS
    
    Args:
        n: Number of stairs to climb
        
    Returns:
        Number of distinct ways to reach the nth step
        
    Time: O(n) - Single loop
    Space: O(1) - Only track last 2 values
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2  # ways(1), ways(2)
    
    print(f"🚀 Space-optimized approach:")
    print(f"   Starting: ways(1) = {prev2}, ways(2) = {prev1}")
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        print(f"   Step {i}: {prev1} + {prev2} = {current}")
        prev2, prev1 = prev1, current
    
    return prev1

# 🔍 TRACE WITH PATH RECONSTRUCTION:
def climb_stairs_with_paths(n):
    """
    Enhanced version that shows actual paths
    """
    if n <= 0:
        return []
    if n == 1:
        return [[1]]
    if n == 2:
        return [[1, 1], [2]]
    
    # dp[i] stores all possible paths to reach step i
    dp = [[] for _ in range(n + 1)]
    dp[0] = [[]]  # Empty path to stay at start
    dp[1] = [[1]]
    dp[2] = [[1, 1], [2]]
    
    print(f"🛤️  Path reconstruction:")
    print(f"   Step 1 paths: {dp[1]}")
    print(f"   Step 2 paths: {dp[2]}")
    
    for i in range(3, n + 1):
        dp[i] = []
        
        # Add paths from step i-1 (append 1-step)
        for path in dp[i - 1]:
            dp[i].append(path + [1])
        
        # Add paths from step i-2 (append 2-step)
        for path in dp[i - 2]:
            dp[i].append(path + [2])
        
        print(f"   Step {i} paths: {dp[i]} (total: {len(dp[i])})")
    
    return dp[n]

# 📝 TESTING ALL APPROACHES:
def test_climbing_stairs():
    test_cases = [1, 2, 3, 4, 5, 6]
    
    for n in test_cases:
        print(f"\n{'='*60}")
        print(f"🎯 TESTING CLIMBING {n} STAIRS")
        print(f"{'='*60}")
        
        # Standard DP approach
        print("📊 Standard DP Approach:")
        result1 = climb_stairs(n)
        print()
        
        # Space-optimized approach
        print("🚀 Space-Optimized Approach:")
        result2 = climb_stairs_optimized(n)
        print()
        
        # Show actual paths for small n
        if n <= 5:
            print("🛤️  All Possible Paths:")
            paths = climb_stairs_with_paths(n)
            for i, path in enumerate(paths, 1):
                steps_sum = sum(path)
                print(f"   Path {i}: {path} → sum = {steps_sum}")
            print()
        
        print(f"✅ Results match: {result1 == result2}")
        print(f"🎯 Total ways to climb {n} stairs: {result1}")

test_climbing_stairs()
```

### ⚡ **When to Use This Approach:**

```
✅ PERFECT FOR:
- Path counting problems with constraints
- Step-by-step progression problems  
- Problems with limited choices at each stage
- Fibonacci-like recurrence relations

❌ NOT SUITABLE FOR:
- Problems requiring specific path details (use backtracking)
- Optimization problems (finding best path, not counting)
- When step sizes are variable or unlimited
```

### 🔍 **Common Pitfalls & Pattern Extensions:**

```
❌ PITFALL 1: Wrong base cases
Correct: ways(1) = 1, ways(2) = 2
Wrong: ways(0) = 0 (should be 1 for DP calculations)

❌ PITFALL 2: Not recognizing Fibonacci pattern
Solution: Look for dp[i] = dp[i-1] + dp[i-2] structure

❌ PITFALL 3: Overcomplicting the problem
Solution: Focus on "how many ways" not "what are the ways"

❌ PITFALL 4: Not optimizing space when possible
Solution: Only keep last 2 values if full array not needed

🎯 PATTERN EXTENSIONS:
1. Variable step sizes: dp[i] = sum(dp[i-j] for valid j)
2. Cost optimization: Find minimum cost path instead of counting
3. Constraints: Add conditions to valid transitions
4. 2D problems: Climbing stairs in a grid

🔍 RELATED PROBLEMS:
- Decode Ways: Same Fibonacci pattern
- House Robber: Can't take adjacent elements
- Minimum Cost Climbing Stairs: Optimization variant
- Unique Paths: 2D version of same concept

INTERVIEW TIP:
Always ask: "Are there any constraints on step sizes?" 
This determines if it's simple Fibonacci or needs modification.
```

# Test it:
n = 5
result = climb_stairs(n)
print(f"Ways to climb {n} stairs: {result}")
```

## 🎯 Pattern 3: House Robber

### Problem:
You're a robber. Houses are in a line, each has money. You can't rob adjacent houses (alarm goes off). What's the maximum money you can rob?

### Example:
```
Houses: [2, 7, 9, 3, 1]
Options:
- Rob houses 0, 2, 4: 2 + 9 + 1 = 12
- Rob houses 1, 3: 7 + 3 = 10
- Rob houses 0, 3: 2 + 3 = 5
- Rob houses 1, 4: 7 + 1 = 8

Maximum: 12 (rob houses 0, 2, 4)
```

### Key Insight:
For each house, you have 2 choices:
1. **Rob it**: Take this house's money + max money from houses before previous house
2. **Skip it**: Take max money from previous house

### Visual Decision Process:
```
Houses: [2, 7, 9, 3, 1]
Index:   0  1  2  3  4

At house 0: rob = 2, skip = 0 → max = 2
At house 1: rob = 7 + 0 = 7, skip = 2 → max = 7
At house 2: rob = 9 + 2 = 11, skip = 7 → max = 11
At house 3: rob = 3 + 7 = 10, skip = 11 → max = 11
At house 4: rob = 1 + 11 = 12, skip = 11 → max = 12
```

### Solution:
```python
def rob_houses(nums):
    """Find maximum money that can be robbed"""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    n = len(nums)
    dp = [0] * n
    
    # Base cases
    dp[0] = nums[0]  # Can only rob first house
    dp[1] = max(nums[0], nums[1])  # Better of first two houses
    
    print(f"Houses: {nums}")
    print(f"dp[0] = {dp[0]} (rob house 0)")
    print(f"dp[1] = {dp[1]} (best of houses 0,1)")
    
    for i in range(2, n):
        # Choice 1: Rob current house + max from 2 houses ago
        rob_current = nums[i] + dp[i - 2]
        
        # Choice 2: Skip current house, take max from previous house
        skip_current = dp[i - 1]
        
        dp[i] = max(rob_current, skip_current)
        
        print(f"House {i} (${nums[i]}): rob = ${rob_current}, skip = ${skip_current} → max = ${dp[i]}")
    
    return dp[n - 1]

# Test it:
houses = [2, 7, 9, 3, 1]
result = rob_houses(houses)
print(f"Maximum money: ${result}")

# Space-optimized version:
def rob_houses_optimized(nums):
    """Space-optimized version - only track last 2 values"""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = nums[0]  # dp[i-2]
    prev1 = max(nums[0], nums[1])  # dp[i-1]
    
    for i in range(2, len(nums)):
        current = max(nums[i] + prev2, prev1)
        prev2, prev1 = prev1, current
    
    return prev1
```

## 🎯 Pattern 4: Coin Change

### Problem:
You have coins of different denominations. Find the minimum number of coins needed to make a target amount.

### Example:
```
Coins: [1, 3, 4]
Target: 6

Ways to make 6:
- 6 coins of 1: 1+1+1+1+1+1 = 6 coins
- 2 coins of 3: 3+3 = 2 coins
- 1 coin of 4 + 2 coins of 1: 4+1+1 = 3 coins

Minimum: 2 coins (3+3)
```

### Key Insight:
For each amount, try using each coin and take the minimum.

### Visual DP Table:
```
Amount:  0  1  2  3  4  5  6
Coins: [1, 3, 4]

dp[0] = 0 (0 coins needed for amount 0)
dp[1] = 1 (use coin 1)
dp[2] = 2 (use coin 1 twice)
dp[3] = 1 (use coin 3)
dp[4] = 1 (use coin 4)
dp[5] = 2 (use coin 4 + coin 1, or coin 3 + coin 1 + coin 1)
dp[6] = 2 (use coin 3 twice)
```

### Solution:
```python
def coin_change(coins, amount):
    """Find minimum coins needed to make amount"""
    # dp[i] = minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins needed for amount 0
    
    print(f"Coins: {coins}, Target amount: {amount}")
    print(f"Initial dp: {dp}")
    
    for i in range(1, amount + 1):
        print(f"\nCalculating dp[{i}] (amount {i}):")
        
        for coin in coins:
            if coin <= i:  # Can use this coin
                coins_needed = 1 + dp[i - coin]
                print(f"  Using coin {coin}: 1 + dp[{i-coin}] = 1 + {dp[i-coin]} = {coins_needed}")
                dp[i] = min(dp[i], coins_needed)
        
        print(f"  dp[{i}] = {dp[i]}")
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Test it:
coins = [1, 3, 4]
amount = 6
result = coin_change(coins, amount)
print(f"\nMinimum coins needed: {result}")
```

## 🎯 Pattern 5: Longest Common Subsequence (2D DP)

### Problem:
Find the length of the longest common subsequence between two strings.

### Example:
```
String 1: "ABCDGH"
String 2: "AEDFHR"

Common subsequences:
- "A" (length 1)
- "AD" (length 2)  
- "AH" (length 2)
- "ADH" (length 3) ← Longest

Answer: 3
```

### Key Insight:
If characters match, take 1 + LCS of remaining strings.
If they don't match, take max of skipping either character.

### 2D DP Table:
```
    ""  A  E  D  F  H  R
""   0  0  0  0  0  0  0
A    0  1  1  1  1  1  1
B    0  1  1  1  1  1  1
C    0  1  1  1  1  1  1
D    0  1  1  2  2  2  2
G    0  1  1  2  2  2  2
H    0  1  1  2  2  3  3
```

### Solution:
```python
def longest_common_subsequence(text1, text2):
    """Find length of longest common subsequence"""
    m, n = len(text1), len(text2)
    
    # dp[i][j] = LCS length of text1[0:i] and text2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    print(f"Text1: {text1}")
    print(f"Text2: {text2}")
    print("\nDP Table construction:")
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # Characters match!
                dp[i][j] = dp[i - 1][j - 1] + 1
                print(f"Match! text1[{i-1}]='{text1[i-1]}' == text2[{j-1}]='{text2[j-1]}'")
                print(f"dp[{i}][{j}] = dp[{i-1}][{j-1}] + 1 = {dp[i-1][j-1]} + 1 = {dp[i][j]}")
            else:
                # Characters don't match, take max of skipping either
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                print(f"No match: text1[{i-1}]='{text1[i-1]}' != text2[{j-1}]='{text2[j-1]}'")
                print(f"dp[{i}][{j}] = max(dp[{i-1}][{j}], dp[{i}][{j-1}]) = max({dp[i-1][j]}, {dp[i][j-1]}) = {dp[i][j]}")
    
    # Print final DP table
    print("\nFinal DP table:")
    print("    ", end="")
    for char in " " + text2:
        print(f"{char:3}", end="")
    print()
    
    for i in range(m + 1):
        if i == 0:
            print("  ", end="")
        else:
            print(f"{text1[i-1]:2}", end="")
        for j in range(n + 1):
            print(f"{dp[i][j]:3}", end="")
        print()
    
    return dp[m][n]

# Test it:
text1 = "ABCDGH"
text2 = "AEDFHR"
result = longest_common_subsequence(text1, text2)
print(f"\nLongest Common Subsequence length: {result}")
```

## 🧠 DP Pattern Recognition

### 1D DP Problems:
- **Fibonacci-like**: Each state depends on previous few states
- **Examples**: Climbing stairs, house robber, decode ways

### 2D DP Problems:
- **Grid-based**: Path counting, minimum path sum
- **String matching**: LCS, edit distance, regex matching
- **Knapsack variants**: 0/1 knapsack, unbounded knapsack

### When to Use DP:
1. **Optimal substructure**: Optimal solution contains optimal subsolutions
2. **Overlapping subproblems**: Same subproblems appear multiple times
3. **Decision at each step**: Choose between options at each step

## 🎯 Practice Problems

### 1D DP:
1. **Climbing Stairs** - Basic Fibonacci pattern
2. **House Robber** - Adjacent constraint
3. **Decode Ways** - String DP
4. **Coin Change** - Minimum coins

### 2D DP:
1. **Unique Paths** - Grid path counting
2. **Longest Common Subsequence** - String matching
3. **Edit Distance** - String transformation
4. **0/1 Knapsack** - Classic DP problem

### Advanced DP:
1. **Longest Increasing Subsequence** - O(n log n) optimization
2. **Palindrome Partitioning** - String partitioning
3. **Buy/Sell Stock** - State machine DP

## 📝 Quick Templates

### 1D DP:
```python
dp = [0] * (n + 1)
dp[0] = base_case
for i in range(1, n + 1):
    dp[i] = function_of(dp[i-1], dp[i-2], ...)
return dp[n]
```

### 2D DP:
```python
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(1, m + 1):
    for j in range(1, n + 1):
        if condition:
            dp[i][j] = dp[i-1][j-1] + something
        else:
            dp[i][j] = max/min(dp[i-1][j], dp[i][j-1])
return dp[m][n]
```

This comprehensive guide covers all essential DP patterns with detailed explanations and examples!
