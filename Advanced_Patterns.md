# 🔄 Advanced Patterns & Data Structures

## 10. Union Find (Disjoint Set)

### Template
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        
        self.components -= 1
        return True
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

**When to use**: Connected components, cycle detection, MST
**Key Problems**: Number of Islands II, Friend Circles, Redundant Connection

---

## 11. Trie (Prefix Tree)

### Template
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
```

**When to use**: Prefix matching, autocomplete, word games
**Key Problems**: Word Search II, Design Add and Search Words, Longest Word

---

## 12. Bit Manipulation

### Essential Operations
```python
# Check if bit is set
def is_bit_set(num, i):
    return (num & (1 << i)) != 0

# Set bit
def set_bit(num, i):
    return num | (1 << i)

# Clear bit
def clear_bit(num, i):
    return num & ~(1 << i)

# Toggle bit
def toggle_bit(num, i):
    return num ^ (1 << i)

# Count set bits
def count_bits(num):
    count = 0
    while num:
        count += num & 1
        num >>= 1
    return count

# Brian Kernighan's algorithm (faster)
def count_bits_fast(num):
    count = 0
    while num:
        num &= num - 1  # Removes rightmost set bit
        count += 1
    return count
```

### Common Patterns
```python
# Single Number (XOR property: a ^ a = 0, a ^ 0 = a)
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Power of Two
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# Missing Number
def missing_number(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum

# Or using XOR
def missing_number_xor(nums):
    result = len(nums)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result
```

**Key Problems**: Single Number II, Bitwise AND of Numbers Range, Sum of Two Integers

---

## 13. Greedy Algorithms

### Pattern Recognition
**When to use**: Optimization problems where local optimal leads to global optimal

### Common Greedy Strategies
```python
# Activity Selection (Interval Scheduling)
def max_activities(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    
    return count

# Jump Game
def can_jump(nums):
    max_reach = 0
    for i, num in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + num)
    return True

# Gas Station
def can_complete_circuit(gas, cost):
    total_surplus = 0
    current_surplus = 0
    start_station = 0
    
    for i in range(len(gas)):
        total_surplus += gas[i] - cost[i]
        current_surplus += gas[i] - cost[i]
        
        if current_surplus < 0:
            current_surplus = 0
            start_station = i + 1
    
    return start_station if total_surplus >= 0 else -1
```

**Key Problems**: Meeting Rooms II, Minimum Number of Arrows, Partition Labels

---

## 14. Advanced Tree Patterns

### Segment Tree
```python
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)
    
    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self.build(arr, 2*node+1, start, mid)
            self.build(arr, 2*node+2, mid+1, end)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self.update(2*node+1, start, mid, idx, val)
            else:
                self.update(2*node+2, mid+1, end, idx, val)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        
        mid = (start + end) // 2
        return (self.query(2*node+1, start, mid, l, r) + 
                self.query(2*node+2, mid+1, end, l, r))
```

### Binary Indexed Tree (Fenwick Tree)
```python
class BIT:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)
    
    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)
    
    def query(self, i):
        result = 0
        while i > 0:
            result += self.tree[i]
            i -= i & (-i)
        return result
    
    def range_query(self, l, r):
        return self.query(r) - self.query(l - 1)
```

**When to use**: Range queries, point updates
**Key Problems**: Range Sum Query - Mutable, Count of Smaller Numbers

---

## 15. Graph Algorithms

### Dijkstra's Algorithm (Shortest Path)
```python
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current_dist > distances[current]:
            continue
        
        for neighbor, weight in graph[current].items():
            distance = current_dist + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances
```

### Topological Sort
```python
def topological_sort(graph):
    from collections import deque, defaultdict
    
    in_degree = defaultdict(int)
    
    # Calculate in-degrees
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    
    # Start with nodes having 0 in-degree
    queue = deque([node for node in graph if in_degree[node] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(graph) else []  # Cycle detection
```

**Key Problems**: Course Schedule, Alien Dictionary, Network Delay Time

---

## 16. String Algorithms

### KMP Algorithm (Pattern Matching)
```python
def kmp_search(text, pattern):
    def build_lps(pattern):
        lps = [0] * len(pattern)
        length = 0
        i = 1
        
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps
    
    if not pattern:
        return []
    
    lps = build_lps(pattern)
    results = []
    i = j = 0
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == len(pattern):
            results.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return results
```

### Manacher's Algorithm (Longest Palindrome)
```python
def longest_palindrome_manacher(s):
    # Transform string to handle even-length palindromes
    transformed = '#'.join('^{}$'.format(s))
    n = len(transformed)
    p = [0] * n
    center = right = 0
    
    for i in range(1, n - 1):
        if i < right:
            p[i] = min(right - i, p[2 * center - i])
        
        # Try to expand palindrome centered at i
        while transformed[i + (1 + p[i])] == transformed[i - (1 + p[i])]:
            p[i] += 1
        
        # If palindrome centered at i extends past right, adjust center and right
        if i + p[i] > right:
            center, right = i, i + p[i]
    
    # Find the longest palindrome
    max_len = 0
    center_index = 0
    for i in range(1, n - 1):
        if p[i] > max_len:
            max_len = p[i]
            center_index = i
    
    start = (center_index - max_len) // 2
    return s[start:start + max_len]
```

**Key Problems**: Implement strStr(), Longest Palindromic Substring, Repeated Substring Pattern

---

## 17. Math & Geometry

### Prime Numbers
```python
def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(n + 1) if is_prime[i]]

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
```

### GCD and LCM
```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a * b // gcd(a, b)
```

### Fast Exponentiation
```python
def fast_power(base, exp, mod=None):
    result = 1
    base = base % mod if mod else base
    
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod if mod else result * base
        exp = exp >> 1
        base = (base * base) % mod if mod else base * base
    
    return result
```

**Key Problems**: Happy Number, Ugly Number, Perfect Squares, Rotate Image

---

## 18. Design Patterns

### LRU Cache
```python
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        from collections import OrderedDict
        self.order = OrderedDict()
    
    def get(self, key):
        if key in self.cache:
            self.order.move_to_end(key)
            return self.cache[key]
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self.order.move_to_end(key)
        elif len(self.cache) >= self.capacity:
            oldest = next(iter(self.order))
            del self.cache[oldest]
            del self.order[oldest]
        
        self.cache[key] = value
        self.order[key] = None
```

### Iterator Design
```python
class PeekingIterator:
    def __init__(self, iterator):
        self.iterator = iterator
        self.next_val = None
        self.has_next_val = False
        self._advance()
    
    def peek(self):
        return self.next_val
    
    def next(self):
        ret = self.next_val
        self._advance()
        return ret
    
    def has_next(self):
        return self.has_next_val
    
    def _advance(self):
        if self.iterator.hasNext():
            self.next_val = self.iterator.next()
            self.has_next_val = True
        else:
            self.has_next_val = False
```

**Key Problems**: Design HashMap, Design Twitter, Design Search Autocomplete

This covers all the advanced patterns you'll need for comprehensive interview preparation!
