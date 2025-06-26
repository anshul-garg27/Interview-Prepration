# 🔤 Strings & Pattern Matching - Complete Mastery Guide

## 📚 What are Strings?

### 🤔 **Understanding String Operations - The Performance Impact**

**Real-World Analogy**: Strings are like **DNA sequences** or **text messages**
- Each character has a specific position (index)
- We can search for patterns within them
- Operations have different costs in time and memory

**Key Insight**: Strings are **immutable** in most languages - modifications create new strings!

### 📖 **String Algorithm Strategy - Why Each Operation Matters:**

```
🎯 FUNDAMENTAL STRING OPERATIONS:

✅ FAST OPERATIONS (O(1)):
- Access character: string[i]
- Get length: len(string)
- Character comparisons

⚠️ EXPENSIVE OPERATIONS:
- Concatenation: O(n) - creates new string
- Substring: O(k) - copies k characters
- String building in loop: O(n²) - use array then join!

PERFORMANCE EXAMPLE:
❌ Slow way (O(n²)):
result = ""
for char in string:
    result += char  # Creates new string each time!

✅ Fast way (O(n)):
result = []
for char in string:
    result.append(char)
final = ''.join(result)  # One concatenation at end
```

### 🔍 **Character Analysis - The Building Blocks:**

```
CHARACTER INSIGHTS for Algorithm Design:

🔹 ASCII VALUES:
'A' to 'Z': 65 to 90
'a' to 'z': 97 to 122  
'0' to '9': 48 to 57

🔹 USEFUL TRICKS:
- Convert to lowercase: ord(char) | 32
- Check if letter: 'A' <= char <= 'Z' or 'a' <= char <= 'z'
- Get alphabet position: ord(char.lower()) - ord('a')
- Case insensitive compare: char1.lower() == char2.lower()

🔹 PATTERN MATCHING HELPERS:
- Frequency counting: use dictionary or array[26] for letters
- Character sets: use set() for O(1) lookup
- Sliding window: track character counts in current window
```

## 🔥 Problem 1: Palindrome Checking

### 🤔 **Problem Understanding - Symmetric Text Recognition**

**Real-World Analogy**: Like checking if a word looks the same in a mirror
- **DNA sequences**: Some genetic sequences are palindromic (important for enzyme recognition)
- **Word games**: "Madam", "racecar", "level" read the same forwards/backwards
- **Data validation**: Ensuring symmetric properties in data structures

**Key Insight**: We only need to check half the string - if left half mirrors right half, it's a palindrome

### 📖 **Problem Statement:**
Check if a string is a palindrome (reads the same forwards and backwards).

**Examples:**
```
PALINDROMES:
"racecar" → True
"madam" → True  
"a" → True (single character)
"" → True (empty string)

NOT PALINDROMES:
"race" → False
"hello" → False
"abc" → False
```

### 🎯 **Algorithm Strategy - Two-Pointer Technique:**

```
🎯 PALINDROME CHECKING ALGORITHM:
1. Place pointer at start (left) and end (right)
2. Compare characters at both pointers
3. If different → NOT palindrome
4. If same → move pointers inward
5. Continue until pointers meet or cross

WHY TWO POINTERS WORK:
- We only need to check corresponding positions
- If s[i] != s[n-1-i] for any i, not palindrome
- Early termination saves time
- O(n/2) comparisons instead of O(n) string reversal
```

### 🔍 **Step-by-Step Visual Trace:**

```
EXAMPLE 1: "racecar" (TRUE case)
Position: 0 1 2 3 4 5 6
String:   r a c e c a r
          ↑           ↑  left=0, right=6

┌─────────────────────────────────────────┐
│ STEP 1: Compare positions 0 and 6        │
│ s[0] = 'r', s[6] = 'r'                  │
│ 'r' == 'r' ✓                           │
│ Move inward: left=1, right=5            │
└─────────────────────────────────────────┘

String:   r a c e c a r
            ↑       ↑    left=1, right=5

┌─────────────────────────────────────────┐
│ STEP 2: Compare positions 1 and 5        │
│ s[1] = 'a', s[5] = 'a'                  │
│ 'a' == 'a' ✓                           │
│ Move inward: left=2, right=4            │
└─────────────────────────────────────────┘

String:   r a c e c a r
              ↑   ↑      left=2, right=4

┌─────────────────────────────────────────┐
│ STEP 3: Compare positions 2 and 4        │
│ s[2] = 'c', s[4] = 'c'                  │
│ 'c' == 'c' ✓                           │
│ Move inward: left=3, right=3            │
└─────────────────────────────────────────┘

String:   r a c e c a r
                ↑        left=3, right=3

┌─────────────────────────────────────────┐
│ STEP 4: Pointers meet (left >= right)    │
│ All comparisons passed - PALINDROME!    │
│ Result: True                            │
└─────────────────────────────────────────┘

EXAMPLE 2: "race" (FALSE case)
Position: 0 1 2 3
String:   r a c e
          ↑     ↑  left=0, right=3

┌─────────────────────────────────────────┐
│ STEP 1: Compare positions 0 and 3        │
│ s[0] = 'r', s[3] = 'e'                  │
│ 'r' != 'e' ✗                           │
│ Mismatch found - NOT PALINDROME!        │
│ Result: False                           │
└─────────────────────────────────────────┘
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def is_palindrome_basic(s):
    """
    🎯 BASIC APPROACH - STRING REVERSAL
    
    Args:
        s: Input string to check
        
    Returns:
        Boolean indicating if string is palindrome
        
    Time: O(n) - Create reversed string
    Space: O(n) - Store reversed string
    """
    return s == s[::-1]

def is_palindrome_two_pointers(s):
    """
    🎯 OPTIMIZED APPROACH - TWO POINTERS
    
    Args:
        s: Input string to check
        
    Returns:
        Boolean indicating if string is palindrome
        
    Time: O(n/2) ≈ O(n) - Check half the characters
    Space: O(1) - Only using pointers
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    
    return True

def is_palindrome_ignore_case_spaces(s):
    """
    🎯 REAL-WORLD PALINDROME - IGNORE CASE AND NON-ALPHANUMERIC
    
    Handles: "A man, a plan, a canal: Panama" → True
    """
    # Clean string: keep only alphanumeric, convert to lowercase
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    
    left, right = 0, len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    
    return True

# 🔍 TRACE FUNCTION:
def is_palindrome_with_trace(s):
    """Same two-pointer algorithm with detailed tracing"""
    print(f"\n🔍 CHECKING PALINDROME: '{s}'")
    print(f"String length: {len(s)}")
    
    if len(s) <= 1:
        print("String length ≤ 1 → Automatically palindrome")
        return True
    
    left, right = 0, len(s) - 1
    step = 1
    
    while left < right:
        print(f"\nStep {step}: Compare positions {left} and {right}")
        print(f"  s[{left}] = '{s[left]}', s[{right}] = '{s[right]}'")
        
        if s[left] != s[right]:
            print(f"  ❌ MISMATCH: '{s[left]}' != '{s[right]}'")
            print(f"  Result: NOT PALINDROME")
            return False
        
        print(f"  ✅ MATCH: '{s[left]}' == '{s[right]}'")
        left += 1
        right -= 1
        step += 1
    
    print(f"\n🎉 All comparisons passed - PALINDROME!")
    return True

# 📝 TESTING THE SOLUTION:
def test_palindrome_checking():
    test_cases = [
        "racecar",      # Standard palindrome
        "race",         # Not palindrome
        "madam",        # Palindrome
        "hello",        # Not palindrome
        "a",            # Single character
        "",             # Empty string
        "abba",         # Even length palindrome
        "A man, a plan, a canal: Panama"  # Real-world case
    ]
    
    print("🧪 TESTING PALINDROME ALGORITHMS")
    print("=" * 50)
    
    for test in test_cases:
        print(f"\nTesting: '{test}'")
        
        basic_result = is_palindrome_basic(test)
        pointer_result = is_palindrome_two_pointers(test)
        advanced_result = is_palindrome_ignore_case_spaces(test)
        
        print(f"Basic approach: {basic_result}")
        print(f"Two-pointer approach: {pointer_result}")
        print(f"Ignore case/spaces: {advanced_result}")
        
        # Detailed trace for interesting cases
        if test in ["racecar", "race"]:
            is_palindrome_with_trace(test)

test_palindrome_checking()
        
        left += 1
        right -= 1
    
    print(f"  All characters match - IS palindrome")
    return True

def is_palindrome_alphanumeric(s):
    """Check palindrome ignoring non-alphanumeric characters"""
    # Clean string: keep only alphanumeric, convert to lowercase
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    print(f"Original: '{s}'")
    print(f"Cleaned: '{cleaned}'")
    
    return is_palindrome_two_pointers(cleaned)

# Test palindrome functions
test_strings = ["racecar", "race", "A man a plan a canal Panama"]

for test in test_strings:
    print(f"\nTesting: '{test}'")
    result = is_palindrome_alphanumeric(test)
    print(f"Result: {result}\n")
```

## 🔥 Problem 2: Anagram Detection

### 🤔 **Problem Understanding - Character Rearrangement Validation**

**Real-World Analogy**: Like checking if two puzzles use the same pieces
- **Scrabble tiles**: Both words must use exact same tiles (letters)
- **DNA sequences**: Checking if two sequences contain same nucleotides
- **Code refactoring**: Ensuring same variables used in different arrangements

**Key Insight**: Anagrams have identical character frequencies - order doesn't matter, count does

### 📖 **Problem Statement:**
Check if two strings are anagrams (contain same characters with same frequency).

**Examples:**
```
ANAGRAMS:
"listen" ↔ "silent" → True
"evil" ↔ "vile" → True  
"a" ↔ "a" → True

NOT ANAGRAMS:
"hello" ↔ "bello" → False (h ≠ b)
"rat" ↔ "car" → False (different frequencies)
"abc" ↔ "def" → False (completely different)
```

### 🎯 **Algorithm Strategy - Multiple Approaches:**

```
🎯 ANAGRAM DETECTION STRATEGIES:

✅ APPROACH 1: SORTING (Simple but slower)
- Sort both strings
- Compare sorted results
- Time: O(n log n), Space: O(n)

✅ APPROACH 2: FREQUENCY COUNTING (Optimal)
- Count character frequencies
- Compare frequency maps
- Time: O(n), Space: O(k) where k = unique characters

✅ APPROACH 3: ARRAY COUNTING (Memory efficient for alphabets)
- Use fixed-size array for character counts
- Increment for first string, decrement for second
- Time: O(n), Space: O(1) for fixed alphabet
```

### 🔍 **Step-by-Step Visual Trace:**

```
EXAMPLE 1: "listen" vs "silent" (TRUE case)

FREQUENCY COUNTING APPROACH:
┌─────────────────────────────────────────┐
│ STEP 1: Count characters in "listen"     │
│ l → count['l'] = 1                      │
│ i → count['i'] = 1                      │
│ s → count['s'] = 1                      │
│ t → count['t'] = 1                      │
│ e → count['e'] = 1                      │
│ n → count['n'] = 1                      │
│ Result: {l:1, i:1, s:1, t:1, e:1, n:1}  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Count characters in "silent"     │
│ s → count['s'] = 1                      │
│ i → count['i'] = 1                      │
│ l → count['l'] = 1                      │
│ e → count['e'] = 1                      │
│ n → count['n'] = 1                      │
│ t → count['t'] = 1                      │
│ Result: {s:1, i:1, l:1, e:1, n:1, t:1}  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Compare frequency maps           │
│ Both contain: {e:1, i:1, l:1, n:1, s:1, t:1} │
│ Maps are identical ✓                    │
│ Result: True (ANAGRAMS)                 │
└─────────────────────────────────────────┘

EXAMPLE 2: "hello" vs "bello" (FALSE case)

┌─────────────────────────────────────────┐
│ "hello" frequencies: {h:1, e:1, l:2, o:1} │
│ "bello" frequencies: {b:1, e:1, l:2, o:1} │
│ Difference: 'h' vs 'b' → NOT ANAGRAMS   │
│ Result: False                           │
└─────────────────────────────────────────┘
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def are_anagrams_sorting(s1, s2):
    """
    🎯 SORTING APPROACH - SIMPLE BUT SLOWER
    
    Args:
        s1, s2: Input strings to compare
        
    Returns:
        Boolean indicating if strings are anagrams
        
    Time: O(n log n) - Sorting dominates
    Space: O(n) - Store sorted strings
    """
    # Quick length check
    if len(s1) != len(s2):
        return False
    
    # Sort and compare
    return sorted(s1.lower()) == sorted(s2.lower())

def are_anagrams_counting(s1, s2):
    """
    🎯 FREQUENCY COUNTING APPROACH - OPTIMAL
    
    Args:
        s1, s2: Input strings to compare
        
    Returns:
        Boolean indicating if strings are anagrams
        
    Time: O(n) - Single pass through both strings
    Space: O(k) - Store character frequencies, k = unique chars
    """
    # Quick length check
    if len(s1) != len(s2):
        return False
    
    from collections import Counter
    
    # Count character frequencies
    count1 = Counter(s1.lower())
    count2 = Counter(s2.lower())
    
    # Compare frequency maps
    return count1 == count2

def are_anagrams_array(s1, s2):
    """
    🎯 ARRAY COUNTING APPROACH - MEMORY EFFICIENT
    
    Works for: lowercase letters only (a-z)
    
    Strategy: Use single array, increment for s1, decrement for s2
    If anagrams, all counts will be zero at the end
    
    Time: O(n) - Single pass
    Space: O(1) - Fixed size array (26 letters)
    """
    # Quick length check
    if len(s1) != len(s2):
        return False
    
    # Count characters using array
    count = [0] * 26
    
    for i in range(len(s1)):
        # Increment count for s1, decrement for s2
        count[ord(s1[i]) - ord('a')] += 1
        count[ord(s2[i]) - ord('a')] -= 1
    
    # If anagrams, all counts should be 0
    return all(c == 0 for c in count)

# 🔍 TRACE FUNCTION:
def are_anagrams_with_trace(s1, s2):
    """Same frequency counting algorithm with detailed tracing"""
    print(f"\n🔍 CHECKING ANAGRAMS: '{s1}' vs '{s2}'")
    
    if len(s1) != len(s2):
        print(f"❌ Different lengths: {len(s1)} ≠ {len(s2)}")
        return False
    
    from collections import Counter
    
    # Count frequencies with tracing
    print(f"\nCounting characters in '{s1}':")
    count1 = Counter(s1.lower())
    for char, freq in sorted(count1.items()):
        print(f"  '{char}': {freq}")
    
    print(f"\nCounting characters in '{s2}':")
    count2 = Counter(s2.lower())
    for char, freq in sorted(count2.items()):
        print(f"  '{char}': {freq}")
    
    # Compare frequencies
    print(f"\nComparing frequencies:")
    all_chars = set(count1.keys()) | set(count2.keys())
    
    is_anagram = True
    for char in sorted(all_chars):
        freq1 = count1.get(char, 0)
        freq2 = count2.get(char, 0)
        match = freq1 == freq2
        status = "✅" if match else "❌"
        
        print(f"  '{char}': {freq1} vs {freq2} {status}")
        if not match:
            is_anagram = False
    
    result = "ANAGRAMS" if is_anagram else "NOT ANAGRAMS"
    print(f"\n🎉 Result: {result}")
    return is_anagram

# 📝 TESTING THE SOLUTION:
def test_anagram_detection():
    test_cases = [
        ("listen", "silent"),       # True - classic anagram
        ("evil", "vile"),          # True - simple anagram
        ("hello", "bello"),        # False - different chars
        ("rat", "car"),            # False - different frequencies
        ("a", "a"),                # True - single character
        ("", ""),                  # True - empty strings
        ("abc", "def"),            # False - completely different
        ("aab", "abb"),            # False - different frequencies
    ]
    
    print("🧪 TESTING ANAGRAM DETECTION ALGORITHMS")
    print("=" * 50)
    
    for s1, s2 in test_cases:
        print(f"\nTesting: '{s1}' vs '{s2}'")
        
        sorting_result = are_anagrams_sorting(s1, s2)
        counting_result = are_anagrams_counting(s1, s2)
        
        print(f"Sorting approach: {sorting_result}")
        print(f"Counting approach: {counting_result}")
        
        # Detailed trace for interesting cases
        if (s1, s2) in [("listen", "silent"), ("hello", "bello")]:
            are_anagrams_with_trace(s1, s2)

test_anagram_detection()

# Test anagram functions
pairs = [("listen", "silent"), ("hello", "bello"), ("evil", "vile")]

for s1, s2 in pairs:
    print(f"\nTesting: '{s1}' vs '{s2}'")
    result = are_anagrams_counting(s1, s2)
    print(f"Are anagrams: {result}\n")
```

## 🎯 Pattern 3: Substring Search

### Problem:
Find if a pattern exists in a text string.

### Naive Approach:
```python
def naive_substring_search(text, pattern):
    """Naive substring search - O(nm) time complexity"""
    n, m = len(text), len(pattern)
    
    print(f"Searching for pattern '{pattern}' in text '{text}'")
    
    for i in range(n - m + 1):
        print(f"  Checking position {i}: '{text[i:i+m]}'")
        
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        
        if match:
            print(f"  Pattern found at index {i}!")
            return i
    
    print(f"  Pattern not found")
    return -1

# Test substring search
text = "abcabcabcabc"
pattern = "abca"
naive_substring_search(text, pattern)
```

### KMP (Knuth-Morris-Pratt) Algorithm:
```python
def kmp_preprocessing(pattern):
    """Build LPS (Longest Proper Prefix which is also Suffix) array"""
    m = len(pattern)
    lps = [0] * m
    length = 0  # Length of previous longest prefix suffix
    i = 1
    
    print(f"Building LPS array for pattern '{pattern}':")
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            print(f"  lps[{i}] = {length} (match: '{pattern[i]}' == '{pattern[length-1]}')")
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
                print(f"  Mismatch, backtrack to length = {length}")
            else:
                lps[i] = 0
                print(f"  lps[{i}] = 0 (no match)")
                i += 1
    
    print(f"  Final LPS array: {lps}")
    return lps

def kmp_search(text, pattern):
    """KMP string matching algorithm"""
    n, m = len(text), len(pattern)
    
    # Preprocess pattern
    lps = kmp_preprocessing(pattern)
    
    print(f"\nSearching pattern '{pattern}' in text '{text}' using KMP:")
    
    i = j = 0  # i for text, j for pattern
    
    while i < n:
        print(f"  Comparing text[{i}]='{text[i]}' with pattern[{j}]='{pattern[j]}'")
        
        if text[i] == pattern[j]:
            i += 1
            j += 1
            print(f"    Match! Moving both pointers")
        
        if j == m:
            print(f"    Pattern found at index {i - j}!")
            return i - j
        elif i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
                print(f"    Mismatch! Using LPS, j = {j}")
            else:
                i += 1
                print(f"    Mismatch! Moving text pointer")
    
    print(f"  Pattern not found")
    return -1

# Test KMP algorithm
text = "ababcababa"
pattern = "ababa"
kmp_search(text, pattern)
```

## 🎯 Pattern 4: Longest Common Subsequence (LCS)

### Problem:
Find the longest subsequence common to two strings.

### Visual Example:
```
String 1: "ABCDGH"
String 2: "AEDFHR"

Common subsequences:
- "A" (length 1)
- "AD" (length 2)
- "AH" (length 2)
- "ADH" (length 3) ← Longest

DP Table:
    ""  A  E  D  F  H  R
""   0  0  0  0  0  0  0
A    0  1  1  1  1  1  1
B    0  1  1  1  1  1  1
C    0  1  1  1  1  1  1
D    0  1  1  2  2  2  2
G    0  1  1  2  2  2  2
H    0  1  1  2  2  3  3
```

### Implementation:
```python
def longest_common_subsequence(text1, text2):
    """Find LCS using dynamic programming"""
    m, n = len(text1), len(text2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    print(f"Finding LCS of '{text1}' and '{text2}':")
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                print(f"  Match: '{text1[i-1]}' at ({i},{j}), LCS length = {dp[i][j]}")
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Print DP table
    print("\nDP Table:")
    print("     ", end="")
    for char in " " + text2:
        print(f"{char:3}", end="")
    print()
    
    for i in range(m + 1):
        if i == 0:
            print("   ", end="")
        else:
            print(f"{text1[i-1]:2}", end="")
        for j in range(n + 1):
            print(f"{dp[i][j]:3}", end="")
        print()
    
    # Reconstruct LCS
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i-1] == text2[j-1]:
            lcs.append(text1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    lcs.reverse()
    print(f"\nLCS: '{''.join(lcs)}' (length: {dp[m][n]})")
    return dp[m][n]

# Test LCS
text1 = "ABCDGH"
text2 = "AEDFHR"
longest_common_subsequence(text1, text2)
```

## 🎯 Pattern 5: String Compression

### Problem:
Compress a string by replacing repeated characters with character + count.

### Visual Example:
```
Input: "aabcccccaaa"
Process:
a → appears 2 times → "a2"
b → appears 1 time → "b" (or "b1")
c → appears 5 times → "c5"  
a → appears 3 times → "a3"

Output: "a2bc5a3" or "a2b1c5a3"
```

### Implementation:
```python
def compress_string(s):
    """Compress string using run-length encoding"""
    if not s:
        return ""
    
    compressed = []
    current_char = s[0]
    count = 1
    
    print(f"Compressing: '{s}'")
    print("Process:")
    
    for i in range(1, len(s)):
        if s[i] == current_char:
            count += 1
            print(f"  Found another '{current_char}', count = {count}")
        else:
            # Add current run to result
            if count == 1:
                compressed.append(current_char)
                print(f"  Adding '{current_char}' (count = 1)")
            else:
                compressed.append(current_char + str(count))
                print(f"  Adding '{current_char}{count}' (count = {count})")
            
            # Start new run
            current_char = s[i]
            count = 1
            print(f"  Starting new run with '{current_char}'")
    
    # Add final run
    if count == 1:
        compressed.append(current_char)
        print(f"  Adding final '{current_char}' (count = 1)")
    else:
        compressed.append(current_char + str(count))
        print(f"  Adding final '{current_char}{count}' (count = {count})")
    
    result = ''.join(compressed)
    print(f"Compressed: '{result}'")
    
    # Return shorter string
    return result if len(result) < len(s) else s

# Test string compression
test_strings = ["aabcccccaaa", "abcdef", "aabbcc"]

for test in test_strings:
    print(f"\nTesting: '{test}'")
    compressed = compress_string(test)
    print(f"Result: '{compressed}'\n")
```

## 🎯 Pattern 6: Valid Parentheses & String Parsing

### Problem:
Check if parentheses/brackets are balanced and properly nested.

### Visual Example:
```
Valid examples:
"()" → Stack: [] (empty after processing)
"()[]{}" → Stack operations:
  ( → [(''] 
  ) → [] (matched)
  [ → ['[']
  ] → [] (matched)
  { → ['{']
  } → [] (matched)

Invalid examples:
"([)]" → Stack: ['(', '['] when we see ')'
  '(' doesn't match ')', so invalid
```

### Implementation:
```python
def is_valid_parentheses(s):
    """Check if parentheses are valid using stack"""
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    print(f"Checking: '{s}'")
    
    for i, char in enumerate(s):
        if char in mapping:  # Closing bracket
            if not stack:
                print(f"  Step {i+1}: Found '{char}' but stack is empty → INVALID")
                return False
            
            top = stack.pop()
            expected = mapping[char]
            
            if top != expected:
                print(f"  Step {i+1}: Found '{char}', expected '{expected}' but got '{top}' → INVALID")
                return False
            
            print(f"  Step {i+1}: Matched '{char}' with '{top}' ✓")
        else:  # Opening bracket
            stack.append(char)
            print(f"  Step {i+1}: Pushed '{char}', stack: {stack}")
    
    if stack:
        print(f"  Unmatched brackets remain: {stack} → INVALID")
        return False
    else:
        print(f"  All brackets matched → VALID")
        return True

def min_remove_to_make_valid(s):
    """Remove minimum brackets to make string valid"""
    # First pass: remove invalid closing brackets
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            if stack:
                stack.pop()  # Valid pair
            else:
                # Invalid closing bracket, skip it
                continue
        
        # Keep the character (it's either '(' or valid ')')
        if char in '()':
            result_chars = list(s[:len(stack)])
    
    # Implementation details...
    return "Implementation for minimum removal"

# Test parentheses validation
test_cases = ["()", "()[]{}", "(]", "([)]", "{[()]}"]

for test in test_cases:
    print(f"\nTesting: '{test}'")
    result = is_valid_parentheses(test)
    print(f"Valid: {result}\n")
```

## 🧠 String Algorithm Complexity Analysis

### Time Complexities:
```
Algorithm                 Time        Space    Use Case
Naive Search             O(nm)       O(1)     Simple pattern matching
KMP Search               O(n+m)      O(m)     Efficient pattern matching
Palindrome Check         O(n)        O(1)     Two pointers approach
Anagram Check (sort)     O(n log n)  O(n)     Small strings
Anagram Check (count)    O(n)        O(k)     k = unique characters
LCS                      O(nm)       O(nm)    Dynamic programming
```

### When to Use Each Approach:
- **Two Pointers**: Palindromes, valid sequences
- **Stack**: Balanced parentheses, nested structures
- **Hash Map/Counter**: Anagrams, character frequency
- **Dynamic Programming**: LCS, edit distance
- **KMP**: Efficient pattern matching in large texts

## 🎯 Practice Problems

### Easy:
1. **Valid Palindrome** (LeetCode 125)
2. **Valid Anagram** (LeetCode 242)
3. **First Unique Character** (LeetCode 387)
4. **Valid Parentheses** (LeetCode 20)

### Medium:
1. **Longest Substring Without Repeating Characters** (LeetCode 3)
2. **Longest Common Subsequence** (LeetCode 1143)
3. **String Compression** (LeetCode 443)
4. **Group Anagrams** (LeetCode 49)

### Hard:
1. **Minimum Window Substring** (LeetCode 76)
2. **Edit Distance** (LeetCode 72)
3. **Regular Expression Matching** (LeetCode 10)
4. **Palindrome Partitioning II** (LeetCode 132)

## 📝 Quick Templates

### Two Pointers for Palindrome:
```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

### Character Frequency Counting:
```python
from collections import Counter
def char_frequency(s):
    return Counter(s)
```

### Stack for Balanced Brackets:
```python
def is_balanced(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        elif char in pairs.values():
            if not stack or pairs[stack.pop()] != char:
                return False
    
    return len(stack) == 0
```

This comprehensive guide covers all essential string manipulation and pattern matching concepts with visual examples and detailed explanations!
