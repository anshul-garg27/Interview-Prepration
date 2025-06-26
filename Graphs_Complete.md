# 🌐 Graphs - Complete Mastery Guide

## 📚 What are Graphs?

A graph is like a network of cities connected by roads. Unlike trees, graphs can have cycles and multiple paths between nodes. They represent relationships and connections in the real world.

### Graph Terminology:
```
Graph Example:
A --- B
|   / |
|  /  |
| /   |
C --- D

- Vertices/Nodes: A, B, C, D (the cities)
- Edges: A-B, A-C, B-C, B-D, C-D (the roads)
- Degree of B: 3 (connected to A, C, D)
- Path from A to D: A → B → D or A → C → D
- Cycle: A → B → C → A
```

### Types of Graphs:

#### 1. Directed vs Undirected:
```
Undirected Graph:     Directed Graph (Digraph):
A --- B               A --> B
|     |               |     ↓
|     |               ↓     |
C --- D               C --> D

Edges have no direction    Edges have direction (arrows)
```

#### 2. Weighted vs Unweighted:
```
Unweighted:           Weighted:
A --- B               A --5-- B
|     |               |       |
|     |               3       2
|     |               |       |
C --- D               C --1-- D

All edges equal       Edges have costs/weights
```

### Graph Representation:

#### 1. Adjacency List (Most Common):
```python
# Undirected graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C']
}

# Directed graph
directed_graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

# Weighted graph
weighted_graph = {
    'A': [('B', 5), ('C', 3)],
    'B': [('A', 5), ('C', 2), ('D', 1)],
    'C': [('A', 3), ('B', 2), ('D', 1)],
    'D': [('B', 1), ('C', 1)]
}
```

#### 2. Adjacency Matrix:
```python
# For graph with nodes A(0), B(1), C(2), D(3)
#     A  B  C  D
# A [[0, 1, 1, 0],
# B  [1, 0, 1, 1],
# C  [1, 1, 0, 1],
# D  [0, 1, 1, 0]]

class GraphMatrix:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.matrix = [[0] * num_vertices for _ in range(num_vertices)]
    
    def add_edge(self, u, v, weight=1):
        """Add edge between vertices u and v"""
        self.matrix[u][v] = weight
        self.matrix[v][u] = weight  # For undirected graph
    
    def print_graph(self):
        """Print adjacency matrix"""
        for row in self.matrix:
            print(row)

# Example usage
graph_matrix = GraphMatrix(4)
graph_matrix.add_edge(0, 1)  # A-B
graph_matrix.add_edge(0, 2)  # A-C
graph_matrix.add_edge(1, 2)  # B-C
graph_matrix.add_edge(1, 3)  # B-D
graph_matrix.add_edge(2, 3)  # C-D

print("Adjacency Matrix:")
graph_matrix.print_graph()
```

## 🔥 Problem 1: Graph DFS (Depth-First Search)

### 🤔 **Problem Understanding - The "Go Deep" Exploration Strategy**

**Real-World Analogy**: Like exploring a maze or cave system
- **Cave exploration**: Enter cave, go as deep as possible down one tunnel
- **Maze solving**: Follow one path completely before trying alternatives
- **File system traversal**: Explore entire subdirectory before moving to next folder
- **Social networks**: Follow one friend's entire network before exploring others

**Key Insight**: Use a **STACK** (Last In, First Out) - either explicitly or via recursion for natural backtracking

### 📖 **Problem Statement:**
Traverse all nodes in a graph using depth-first search, exploring as deep as possible before backtracking.

**Example:**
```
Graph:     A --- B
           |   / |
           |  /  |
           | /   |
           C --- D

One possible DFS order: A → B → C → D
Another possible order: A → C → B → D
(Order depends on neighbor order in adjacency list)
```

### 🎯 **Algorithm Strategy - Stack-Based Exploration:**

```
🎯 DFS ALGORITHM STEPS:
1. Start at source node, mark as visited
2. Process current node (add to result)
3. For each unvisited neighbor:
   a. Recursively apply DFS to that neighbor
4. When no unvisited neighbors remain, backtrack
5. Continue until all reachable nodes visited

WHY DFS WORKS:
- Stack behavior (recursion) ensures we go deep first
- Visited set prevents infinite loops in cycles
- Backtracking naturally explores all paths
- Time: O(V + E), Space: O(V) for visited set + recursion stack
```

### 🔍 **Step-by-Step Visual Trace:**

```
EXAMPLE GRAPH:
A --- B
|   / |
|  /  |
| /   |
C --- D

Adjacency List:
A: [B, C]     (A connects to B and C)
B: [A, C, D]  (B connects to A, C, and D)
C: [A, B, D]  (C connects to A, B, and D)
D: [B, C]     (D connects to B and C)

DETAILED DFS EXECUTION starting from A:

┌─────────────────────────────────────────┐
│ CALL: DFS(A)                            │
│ Mark A as visited: {A}                  │
│ Add A to result: [A]                    │
│ Neighbors of A: [B, C]                  │
│ Try first unvisited: B                 │
│ → Call DFS(B)                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CALL: DFS(B) [from A]                   │
│ Mark B as visited: {A, B}               │
│ Add B to result: [A, B]                 │
│ Neighbors of B: [A, C, D]              │
│ A already visited, try C               │
│ → Call DFS(C)                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CALL: DFS(C) [from B]                   │
│ Mark C as visited: {A, B, C}            │
│ Add C to result: [A, B, C]              │
│ Neighbors of C: [A, B, D]              │
│ A,B already visited, try D             │
│ → Call DFS(D)                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CALL: DFS(D) [from C]                   │
│ Mark D as visited: {A, B, C, D}         │
│ Add D to result: [A, B, C, D]           │
│ Neighbors of D: [B, C]                 │
│ Both B,C already visited               │
│ No unvisited neighbors → RETURN        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BACK IN: DFS(C)                         │
│ All neighbors of C processed           │
│ No more unvisited neighbors → RETURN   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BACK IN: DFS(B)                         │
│ Continue with next neighbor: D          │
│ D already visited, skip                │
│ All neighbors processed → RETURN       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BACK IN: DFS(A)                         │
│ Continue with next neighbor: C          │
│ C already visited, skip                │
│ All neighbors processed → RETURN       │
└─────────────────────────────────────────┘

FINAL RESULT: [A, B, C, D]
VISITED NODES: {A, B, C, D}
```

### 🚀 **Complete Implementation with Detailed Comments:**

```python
def dfs_recursive(graph, start):
    """
    🎯 RECURSIVE DFS IMPLEMENTATION
    
    Args:
        graph: Dictionary representing adjacency list
        start: Starting node for DFS traversal
        
    Returns:
        List of nodes in DFS order
        
    Time: O(V + E) - Visit each vertex and edge once
    Space: O(V) - Visited set + recursion stack depth
    """
    visited = set()
    result = []
    
    def dfs_helper(node):
        """Recursive DFS helper function"""
        # Mark current node as visited
        visited.add(node)
        result.append(node)
        
        # Recursively visit all unvisited neighbors
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs_helper(neighbor)
    
    dfs_helper(start)
    return result

def dfs_iterative(graph, start):
    """
    🎯 ITERATIVE DFS USING EXPLICIT STACK
    
    Args:
        graph: Dictionary representing adjacency list
        start: Starting node for DFS traversal
        
    Returns:
        List of nodes in DFS order
        
    Note: Order may differ from recursive due to stack processing
    """
    visited = set()
    result = []
    stack = [start]
    
    while stack:
        node = stack.pop()  # Get last added (LIFO)
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack (reverse order for same traversal as recursive)
            neighbors = graph.get(node, [])
            for neighbor in reversed(neighbors):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result

def dfs_all_paths(graph, start, end):
    """
    🎯 FIND ALL PATHS BETWEEN TWO NODES USING DFS
    
    Uses backtracking to explore all possible paths
    """
    all_paths = []
    
    def dfs_paths(current, target, path, visited):
        if current == target:
            all_paths.append(path[:])  # Found complete path
            return
        
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                path.append(neighbor)
                visited.add(neighbor)
                dfs_paths(neighbor, target, path, visited)
                # Backtrack
                path.pop()
                visited.remove(neighbor)
    
    # Start DFS with initial path and visited set
    dfs_paths(start, end, [start], {start})
    return all_paths

# 🔍 TRACE FUNCTION:
def dfs_with_trace(graph, start):
    """Same recursive DFS with detailed execution tracing"""
    visited = set()
    result = []
    call_stack = []
    
    def trace_dfs(node, depth=0):
        indent = "  " * depth
        call_stack.append(node)
        
        print(f"{indent}🔍 CALL: DFS({node}) [depth={depth}]")
        print(f"{indent}   Call stack: {call_stack}")
        
        # Mark as visited
        visited.add(node)
        result.append(node)
        
        print(f"{indent}   Visited: {visited}")
        print(f"{indent}   Result so far: {result}")
        
        # Get neighbors
        neighbors = graph.get(node, [])
        print(f"{indent}   Neighbors: {neighbors}")
        
        # Visit unvisited neighbors
        unvisited_neighbors = [n for n in neighbors if n not in visited]
        print(f"{indent}   Unvisited neighbors: {unvisited_neighbors}")
        
        for neighbor in unvisited_neighbors:
            print(f"{indent}   → Calling DFS({neighbor})")
            trace_dfs(neighbor, depth + 1)
            print(f"{indent}   ← Returned from DFS({neighbor})")
        
        print(f"{indent}   All neighbors processed for {node}")
        call_stack.pop()
        
    trace_dfs(start)
    return result

# 📝 TESTING THE SOLUTION:
def test_graph_dfs():
    # Create example graph
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'C', 'D'],
        'C': ['A', 'B', 'D'],
        'D': ['B', 'C']
    }
    
    print("🧪 TESTING GRAPH DFS ALGORITHMS")
    print("=" * 50)
    print("Graph structure:")
    print("A --- B")
    print("|   / |")
    print("|  /  |") 
    print("| /   |")
    print("C --- D")
    print()
    
    for node, neighbors in graph.items():
        print(f"{node}: {neighbors}")
    
    print(f"\n🔍 RECURSIVE DFS from A:")
    recursive_result = dfs_recursive(graph, 'A')
    print(f"Result: {recursive_result}")
    
    print(f"\n🔍 ITERATIVE DFS from A:")
    iterative_result = dfs_iterative(graph, 'A')
    print(f"Result: {iterative_result}")
    
    print(f"\n🔍 ALL PATHS from A to D:")
    all_paths = dfs_all_paths(graph, 'A', 'D')
    for i, path in enumerate(all_paths):
        print(f"Path {i+1}: {' → '.join(path)}")
    
    print(f"\n🔍 DETAILED TRACE of DFS from A:")
    trace_result = dfs_with_trace(graph, 'A')

test_graph_dfs()
│ All neighbors processed - DONE!        │
└─────────────────────────────────────────┘

FINAL RESULT: [A, B, C, D]
PATH TAKEN: A → B → C → D
```

### 🚀 **DFS vs BFS - When to Use Which?**

```
🔍 USE DFS WHEN:
✅ Finding ANY path (not necessarily shortest)
✅ Detecting cycles
✅ Topological sorting
✅ Connected components
✅ Memory is limited (DFS uses less memory)

Examples:
- "Can I reach city B from city A?" → DFS
- "Find all islands in a grid" → DFS  
- "Detect cycle in course prerequisites" → DFS

⚡ USE BFS WHEN:
✅ Finding SHORTEST path (unweighted graphs)
✅ Level-order processing needed
✅ Finding minimum steps/distance

Examples:
- "Shortest path in a maze" → BFS
- "Six degrees of separation" → BFS
- "Minimum steps to solve puzzle" → BFS
```

### DFS Implementation:
```python
def dfs_graph(graph, start, visited=None):
    """Depth-first search in graph"""
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    print(f"Visiting {start}")
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            print(f"  Going deeper to {neighbor}")
            result.extend(dfs_graph(graph, neighbor, visited))
        else:
            print(f"  {neighbor} already visited, skipping")
    
    return result

def dfs_iterative(graph, start):
    """Iterative DFS using stack"""
    visited = set()
    stack = [start]
    result = []
    
    print("DFS Iterative:")
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            print(f"  Visiting {node}")
            
            # Add neighbors to stack (in reverse order for consistent traversal)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
                    print(f"    Added {neighbor} to stack")
        
        print(f"    Stack: {stack}")
    
    return result

# Test DFS
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

print("DFS Recursive:")
result_recursive = dfs_graph(graph, 'A')
print(f"DFS traversal: {result_recursive}")

print("\n" + "="*40 + "\n")

result_iterative = dfs_iterative(graph, 'A')
print(f"DFS traversal: {result_iterative}")
```

### DFS Applications:
```python
def has_path_dfs(graph, start, end, visited=None):
    """Check if path exists between start and end"""
    if visited is None:
        visited = set()
    
    if start == end:
        print(f"Found path to {end}!")
        return True
    
    visited.add(start)
    print(f"Exploring from {start}")
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            if has_path_dfs(graph, neighbor, end, visited):
                return True
    
    return False

def find_all_paths_dfs(graph, start, end, path=None):
    """Find all paths between start and end"""
    if path is None:
        path = []
    
    path = path + [start]
    
    if start == end:
        return [path]
    
    paths = []
    for neighbor in graph[start]:
        if neighbor not in path:  # Avoid cycles
            new_paths = find_all_paths_dfs(graph, neighbor, end, path)
            paths.extend(new_paths)
    
    return paths

# Test path finding
print("Testing path existence:")
has_path = has_path_dfs(graph, 'A', 'D')
print(f"Path from A to D exists: {has_path}")

print("\nAll paths from A to D:")
all_paths = find_all_paths_dfs(graph, 'A', 'D')
for i, path in enumerate(all_paths, 1):
    print(f"  Path {i}: {' → '.join(path)}")
```

## 🎯 Pattern 2: Graph BFS (Breadth-First Search)

### 🤔 **Why BFS? Understanding the "Level by Level" Strategy**

**Real-World Analogy**: Like ripples in a pond
- Drop a stone at starting point
- First ripple reaches immediate neighbors
- Second ripple reaches neighbors of neighbors
- Continue until entire pond is covered

**Key Insight**: Use a **QUEUE** (First In, First Out) to ensure we process nodes in order of discovery

### 📖 **BFS Algorithm - Step by Step Explanation:**

```
🎯 THE ALGORITHM:
1. Add starting node to queue and mark as visited
2. While queue is not empty:
   a. Remove front node from queue
   b. Process that node
   c. Add all unvisited neighbors to back of queue
   d. Mark those neighbors as visited
3. Repeat until queue is empty

WHY QUEUE WORKS:
- We discover neighbors in "waves" or "levels"
- Queue ensures we process all nodes at distance d before any node at distance d+1
- This guarantees we find shortest path first!

SAME GRAPH EXAMPLE:
A --- B
|   / |
|  /  |
| /   |
C --- D
```

### 🔍 **Detailed BFS Execution Trace:**

```
Starting BFS from A:

┌─────────────────────────────────────────┐
│ INITIAL STATE:                          │
│ Queue: [A]                              │
│ Visited: {A}                            │
│ Result: []                              │
│ Level 0: A                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 1: Process A                       │
│ Remove A from queue                     │
│ Queue: []                               │
│ Result: [A]                             │
│ Add A's neighbors (B, C) to queue      │
│ Queue: [B, C]                           │
│ Visited: {A, B, C}                     │
│ Level 1: B, C                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 2: Process B                       │
│ Remove B from front of queue           │
│ Queue: [C]                              │
│ Result: [A, B]                          │
│ B's neighbors: A(visited), C(visited), D│
│ Add only D to queue                     │
│ Queue: [C, D]                           │
│ Visited: {A, B, C, D}                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 3: Process C                       │
│ Remove C from front of queue           │
│ Queue: [D]                              │
│ Result: [A, B, C]                       │
│ C's neighbors: A(visited), B(visited), D│
│ D already in visited set               │
│ Queue remains: [D]                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ STEP 4: Process D                       │
│ Remove D from queue                     │
│ Queue: []                               │
│ Result: [A, B, C, D]                    │
│ D's neighbors: B(visited), C(visited)  │
│ No new nodes to add                     │
│ Queue is empty - DONE!                 │
└─────────────────────────────────────────┘

FINAL RESULT: [A, B, C, D]
LEVELS: Level 0: [A], Level 1: [B, C], Level 2: [D]
```

### 🎯 **BFS for Shortest Path - The Magic Explained:**

```
🔍 WHY BFS FINDS SHORTEST PATH:

Key Insight: BFS visits nodes in order of increasing distance from start

Example: Find shortest path from A to D

Step 1: Distance 0 → Visit A
Step 2: Distance 1 → Visit B, C (neighbors of A)  
Step 3: Distance 2 → Visit D (neighbor of B or C)

When we first reach D, we KNOW it's via shortest path because:
✅ We've explored all paths of length 1 (didn't find D)
✅ We've started exploring paths of length 2 (found D)
✅ Any other path to D must be length ≥ 2

SHORTEST PATH RECONSTRUCTION:
A → B → D (length 2) OR A → C → D (length 2)

VISUAL PATH TRACE:
A(dist=0) → B(dist=1) → D(dist=2)
A(dist=0) → C(dist=1) → D(dist=2)
Both paths have same length = 2 (shortest possible)
```

### BFS Implementation:
```python
from collections import deque

def bfs_graph(graph, start):
    """Breadth-first search in graph"""
    visited = set([start])
    queue = deque([start])
    result = []
    
    print("BFS Traversal:")
    
    while queue:
        node = queue.popleft()
        result.append(node)
        print(f"  Visiting {node}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                print(f"    Added {neighbor} to queue")
        
        print(f"    Queue: {list(queue)}")
    
    return result

def bfs_shortest_path(graph, start, end):
    """Find shortest path using BFS"""
    if start == end:
        return [start]
    
    visited = set([start])
    queue = deque([(start, [start])])  # (node, path_to_node)
    
    print(f"Finding shortest path from {start} to {end}:")
    
    while queue:
        node, path = queue.popleft()
        print(f"  Exploring {node}, current path: {' → '.join(path)}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                new_path = path + [neighbor]
                
                if neighbor == end:
                    print(f"  Found destination! Path: {' → '.join(new_path)}")
                    return new_path
                
                visited.add(neighbor)
                queue.append((neighbor, new_path))
                print(f"    Added {neighbor} to queue")
    
    return None  # No path found

def bfs_level_traversal(graph, start):
    """BFS with level information"""
    visited = set([start])
    queue = deque([(start, 0)])  # (node, level)
    levels = {}
    
    while queue:
        node, level = queue.popleft()
        
        if level not in levels:
            levels[level] = []
        levels[level].append(node)
        
        print(f"Node {node} at level {level}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, level + 1))
    
    return levels

# Test BFS
print("BFS Traversal:")
result_bfs = bfs_graph(graph, 'A')
print(f"BFS result: {result_bfs}")

print("\n" + "="*40 + "\n")

shortest_path = bfs_shortest_path(graph, 'A', 'D')
print(f"Shortest path: {' → '.join(shortest_path)}")

print("\n" + "="*40 + "\n")

print("BFS Level Traversal:")
levels = bfs_level_traversal(graph, 'A')
for level, nodes in levels.items():
    print(f"Level {level}: {nodes}")
```

## 🎯 Pattern 3: Cycle Detection

### 🤔 **Why is Cycle Detection Important?**

**Real-World Examples:**
- **Course Prerequisites**: Can you complete all courses or is there a circular dependency?
- **Deadlock Detection**: Are processes waiting for each other in a circle?
- **Dependency Resolution**: Can we install software packages without conflicts?

### 📖 **Cycle Detection in Undirected Graphs - The Logic:**

```
🎯 KEY INSIGHT: In undirected graph, edge A-B means both A→B and B→A

❌ NAIVE APPROACH: "If we visit a node we've seen before, it's a cycle"
This is WRONG! Why?

A --- B
|
C

DFS from A: A → B → A (we see A again)
But this is NOT a cycle! We just went A→B and came back via B→A
This is normal in undirected graphs!

✅ CORRECT APPROACH: "Visited node that's NOT my immediate parent = cycle"

ALGORITHM LOGIC:
1. Track current node and its parent
2. If we visit a node that's:
   - Already visited AND
   - NOT our immediate parent
   Then we found a cycle!

WHY THIS WORKS:
- We came from parent, so seeing parent again is expected
- Seeing any OTHER visited node means we found alternate path = cycle
```

### 🔍 **Undirected Cycle Detection - Step by Step:**

```
EXAMPLE WITH CYCLE:
A --- B
|   / 
|  /  
| /   
C     

Adjacency List:
A: [B, C]
B: [A, C]  
C: [A, B]

DFS TRACE:
┌─────────────────────────────────────────┐
│ STEP 1: DFS(A, parent=null)            │
│ Visited: {A}                            │
│ Neighbors: [B, C]                       │
│ Try B first                             │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 2: DFS(B, parent=A)               │
│ Visited: {A, B}                         │
│ Neighbors: [A, C]                       │
│ A is parent, skip. Try C                │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 3: DFS(C, parent=B)               │
│ Visited: {A, B, C}                     │
│ Neighbors: [A, B]                       │
│ A is visited but NOT parent B           │
│ 🚨 CYCLE DETECTED! 🚨                   │
│ Cycle: A → B → C → A                   │
└─────────────────────────────────────────┘

CYCLE PATH RECONSTRUCTION: A → B → C → A
```

### 📖 **Cycle Detection in Directed Graphs - The Challenge:**

```
🎯 DIRECTED GRAPHS ARE TRICKIER!

Consider this directed graph:
A → B → C
↓       ↑
D ------

Is there a cycle? YES! A → D → C → B → A

But simple "visited" tracking isn't enough:
- We might visit C from A→B→C path  
- Later visit C from A→D→C path
- This doesn't mean cycle!

✅ SOLUTION: Three-Color Algorithm
⚪ WHITE: Unvisited
🟡 GRAY: Currently being explored (in recursion stack)  
⚫ BLACK: Completely explored

CYCLE RULE: If we reach a GRAY node, we found a cycle!
(GRAY = currently in our path = back edge = cycle)
```

### 🔍 **Directed Cycle Detection - Step by Step:**

```
EXAMPLE WITH CYCLE:
A → B
↓   ↓
C → D

DFS TRACE with 3-Color:
┌─────────────────────────────────────────┐
│ INITIAL: All nodes WHITE               │
│ A:⚪ B:⚪ C:⚪ D:⚪                      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 1: DFS(A)                          │
│ A becomes GRAY (exploring)              │
│ A:🟡 B:⚪ C:⚪ D:⚪                      │
│ Neighbors: [B, C]                       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 2: DFS(B) from A                   │
│ B becomes GRAY                          │
│ A:🟡 B:🟡 C:⚪ D:⚪                      │
│ Neighbors: [D]                          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 3: DFS(D) from B                   │
│ D becomes GRAY                          │
│ A:🟡 B:🟡 C:⚪ D:🟡                      │
│ D has no neighbors                      │
│ D becomes BLACK (finished)              │
│ A:🟡 B:🟡 C:⚪ D:⚫                      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 4: Back to B                       │
│ B finished, becomes BLACK               │
│ A:🟡 B:⚫ C:⚪ D:⚫                      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ STEP 5: Back to A, try next neighbor C  │
│ DFS(C) from A                           │
│ C becomes GRAY                          │
│ A:🟡 B:⚫ C:🟡 D:⚫                      │
│ C has no neighbors                      │
│ C becomes BLACK                         │
│ A:🟡 B:⚫ C:⚫ D:⚫                      │
└─────────────────────────────────────────┘

RESULT: No GRAY node encountered while GRAY → No cycle
```
```python
def has_cycle_undirected(graph):
    """Detect cycle in undirected graph using DFS"""
    visited = set()
    
    def dfs_cycle(node, parent):
        visited.add(node)
        print(f"Visiting {node} (parent: {parent})")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs_cycle(neighbor, node):
                    return True
            elif neighbor != parent:
                print(f"Found cycle: {neighbor} is visited and not parent of {node}")
                return True
        
        return False
    
    # Check all components
    for node in graph:
        if node not in visited:
            print(f"Starting DFS from {node}")
            if dfs_cycle(node, None):
                return True
    
    return False

def has_cycle_undirected_union_find(graph):
    """Detect cycle using Union-Find (Disjoint Set)"""
    parent = {}
    
    def find(x):
        if x not in parent:
            parent[x] = x
        if parent[x] != x:
            parent[x] = find(parent[x])  # Path compression
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False  # Same component, adding edge creates cycle
        parent[px] = py
        return True
    
    edges = set()
    for node in graph:
        for neighbor in graph[node]:
            edge = tuple(sorted([node, neighbor]))
            edges.add(edge)
    
    print("Checking edges with Union-Find:")
    for u, v in edges:
        print(f"  Checking edge {u}-{v}")
        if not union(u, v):
            print(f"  Cycle detected with edge {u}-{v}")
            return True
    
    return False

# Test cycle detection
cycle_graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C'],
    'C': ['A', 'B']
}

acyclic_graph = {
    'A': ['B'],
    'B': ['A', 'C'],
    'C': ['B']
}

print("Testing cycle detection (DFS):")
print(f"Cycle graph has cycle: {has_cycle_undirected(cycle_graph)}")
print(f"Acyclic graph has cycle: {has_cycle_undirected(acyclic_graph)}")

print("\nTesting cycle detection (Union-Find):")
print(f"Cycle graph has cycle: {has_cycle_undirected_union_find(cycle_graph)}")
```

### Detect Cycles in Directed Graph:
```python
def has_cycle_directed(graph):
    """Detect cycle in directed graph using DFS"""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}
    
    def dfs_cycle(node):
        if color[node] == GRAY:
            print(f"Back edge found at {node} - cycle detected!")
            return True
        if color[node] == BLACK:
            return False
        
        color[node] = GRAY
        print(f"Exploring {node} (marked as GRAY)")
        
        for neighbor in graph[node]:
            if dfs_cycle(neighbor):
                return True
        
        color[node] = BLACK
        print(f"Finished exploring {node} (marked as BLACK)")
        return False
    
    for node in graph:
        if color[node] == WHITE:
            print(f"Starting DFS from {node}")
            if dfs_cycle(node):
                return True
    
    return False

# Test directed cycle detection
directed_cycle_graph = {
    'A': ['B'],
    'B': ['C'],
    'C': ['A'],  # Creates cycle A → B → C → A
    'D': []
}

directed_acyclic_graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

print("Testing directed cycle detection:")
print(f"Directed cycle graph has cycle: {has_cycle_directed(directed_cycle_graph)}")
print(f"Directed acyclic graph has cycle: {has_cycle_directed(directed_acyclic_graph)}")
```

## 🎯 Pattern 4: Topological Sort

### Order nodes in a Directed Acyclic Graph (DAG):

```
Example: Course prerequisites
A (Math) → B (Physics) → D (Engineering)
A (Math) → C (Chemistry) → D (Engineering)

Topological order: A, B, C, D or A, C, B, D
```

### Topological Sort Implementation:
```python
def topological_sort_dfs(graph):
    """Topological sort using DFS"""
    visited = set()
    stack = []
    
    def dfs(node):
        visited.add(node)
        print(f"Visiting {node}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
        
        stack.append(node)
        print(f"Added {node} to result (finished processing)")
    
    # Visit all nodes
    for node in graph:
        if node not in visited:
            print(f"Starting DFS from {node}")
            dfs(node)
    
    # Reverse to get topological order
    result = stack[::-1]
    return result

def topological_sort_bfs(graph):
    """Topological sort using BFS (Kahn's algorithm)"""
    # Calculate in-degrees
    in_degree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    
    print("In-degrees:", in_degree)
    
    # Find nodes with no incoming edges
    queue = deque([node for node in in_degree if in_degree[node] == 0])
    result = []
    
    print("Starting with nodes having in-degree 0:", list(queue))
    
    while queue:
        node = queue.popleft()
        result.append(node)
        print(f"Processing {node}")
        
        # Remove edges from this node
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            print(f"  Reduced in-degree of {neighbor} to {in_degree[neighbor]}")
            
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                print(f"  Added {neighbor} to queue (in-degree became 0)")
    
    # Check if all nodes were processed (no cycle)
    if len(result) != len(graph):
        print("Cycle detected - topological sort not possible")
        return None
    
    return result

# Test topological sort
dag = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

print("Topological Sort (DFS):")
topo_dfs = topological_sort_dfs(dag)
print(f"Result: {topo_dfs}")

print("\n" + "="*40 + "\n")

print("Topological Sort (BFS - Kahn's Algorithm):")
topo_bfs = topological_sort_bfs(dag)
print(f"Result: {topo_bfs}")
```

## 🎯 Pattern 5: Shortest Path Algorithms

### Single Source Shortest Path - Dijkstra's Algorithm:
```python
import heapq

def dijkstra(graph, start):
    """Find shortest paths from start to all other nodes"""
    # Initialize distances
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    previous = {}
    visited = set()
    
    print(f"Starting Dijkstra from {start}")
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        
        visited.add(current)
        print(f"Processing {current} with distance {current_dist}")
        
        # Check all neighbors
        for neighbor, weight in graph[current]:
            if neighbor not in visited:
                new_dist = current_dist + weight
                
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
                    print(f"  Updated {neighbor}: distance = {new_dist}, previous = {current}")
    
    return distances, previous

def reconstruct_path(previous, start, end):
    """Reconstruct shortest path from start to end"""
    path = []
    current = end
    
    while current is not None:
        path.append(current)
        current = previous.get(current)
    
    path.reverse()
    
    if path[0] == start:
        return path
    else:
        return None  # No path exists

# Test Dijkstra
weighted_graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('C', 1), ('D', 5)],
    'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
    'D': [('B', 5), ('C', 8), ('E', 2)],
    'E': [('C', 10), ('D', 2)]
}

print("Dijkstra's Algorithm:")
distances, previous = dijkstra(weighted_graph, 'A')
print(f"Shortest distances from A: {distances}")

print("\nShortest paths:")
for node in distances:
    if node != 'A':
        path = reconstruct_path(previous, 'A', node)
        if path:
            print(f"A to {node}: {' → '.join(path)} (distance: {distances[node]})")
```

### All Pairs Shortest Path - Floyd-Warshall Algorithm:
```python
def floyd_warshall(graph):
    """Find shortest paths between all pairs of vertices"""
    # Get all nodes
    nodes = list(graph.keys())
    n = len(nodes)
    
    # Create node to index mapping
    node_to_idx = {node: i for i, node in enumerate(nodes)}
    
    # Initialize distance matrix
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    
    # Distance from node to itself is 0
    for i in range(n):
        dist[i][i] = 0
    
    # Fill initial distances
    for node in graph:
        i = node_to_idx[node]
        for neighbor, weight in graph[node]:
            j = node_to_idx[neighbor]
            dist[i][j] = weight
    
    print("Initial distance matrix:")
    print_matrix(dist, nodes)
    
    # Floyd-Warshall algorithm
    for k in range(n):
        print(f"\nUsing {nodes[k]} as intermediate vertex:")
        
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    old_dist = dist[i][j]
                    dist[i][j] = dist[i][k] + dist[k][j]
                    print(f"  Updated dist[{nodes[i]}][{nodes[j]}] from {old_dist} to {dist[i][j]}")
        
        print("Distance matrix after considering", nodes[k])
        print_matrix(dist, nodes)
    
    return dist, nodes

def print_matrix(matrix, nodes):
    """Helper function to print distance matrix"""
    n = len(nodes)
    
    # Print header
    print("     ", end="")
    for node in nodes:
        print(f"{node:5}", end="")
    print()
    
    # Print rows
    for i, node in enumerate(nodes):
        print(f"{node:5}", end="")
        for j in range(n):
            val = matrix[i][j]
            if val == float('inf'):
                print("  ∞  ", end="")
            else:
                print(f"{val:5}", end="")
        print()

# Test Floyd-Warshall
print("Floyd-Warshall Algorithm:")
dist_matrix, nodes = floyd_warshall(weighted_graph)
```

## 🎯 Pattern 6: Minimum Spanning Tree (MST)

### Problem: Connect all vertices with minimum total edge weight

### Kruskal's Algorithm (Union-Find):
```python
class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        
        if px == py:
            return False  # Already in same set
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        
        return True

def kruskal_mst(graph):
    """Find MST using Kruskal's algorithm"""
    # Get all edges
    edges = []
    vertices = set()
    
    for u in graph:
        vertices.add(u)
        for v, weight in graph[u]:
            vertices.add(v)
            edges.append((weight, u, v))
    
    # Sort edges by weight
    edges.sort()
    print("Edges sorted by weight:", edges)
    
    uf = UnionFind(vertices)
    mst = []
    total_weight = 0
    
    print("\nBuilding MST:")
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
            print(f"Added edge {u}-{v} with weight {weight}")
        else:
            print(f"Skipped edge {u}-{v} (would create cycle)")
    
    return mst, total_weight

# Test Kruskal's algorithm
print("Kruskal's MST Algorithm:")
mst_edges, total_weight = kruskal_mst(weighted_graph)
print(f"\nMST edges: {mst_edges}")
print(f"Total weight: {total_weight}")
```

### Prim's Algorithm:
```python
def prim_mst(graph, start):
    """Find MST using Prim's algorithm"""
    visited = set([start])
    mst = []
    total_weight = 0
    
    # Priority queue: (weight, u, v)
    pq = []
    for neighbor, weight in graph[start]:
        heapq.heappush(pq, (weight, start, neighbor))
    
    print(f"Starting Prim's algorithm from {start}")
    
    while pq and len(visited) < len(graph):
        weight, u, v = heapq.heappop(pq)
        
        if v in visited:
            print(f"Skipped edge {u}-{v} (both vertices already in MST)")
            continue
        
        # Add edge to MST
        visited.add(v)
        mst.append((u, v, weight))
        total_weight += weight
        print(f"Added edge {u}-{v} with weight {weight}")
        
        # Add new edges to priority queue
        for neighbor, edge_weight in graph[v]:
            if neighbor not in visited:
                heapq.heappush(pq, (edge_weight, v, neighbor))
    
    return mst, total_weight

# Test Prim's algorithm
print("\nPrim's MST Algorithm:")
mst_prim, total_weight_prim = prim_mst(weighted_graph, 'A')
print(f"MST edges: {mst_prim}")
print(f"Total weight: {total_weight_prim}")
```

## 🎯 Pattern 7: Strongly Connected Components (SCC)

### Problem: Find groups of vertices where every vertex can reach every other vertex in the group

**Real-World Applications:**
- **Social Networks**: Find tight-knit communities where everyone knows everyone
- **Web Pages**: Find clusters of pages that reference each other
- **Software Dependencies**: Find circular dependency groups

### Kosaraju's Algorithm (Two-Pass DFS):
```python
def kosaraju_scc(graph):
    """
    Find Strongly Connected Components using Kosaraju's algorithm
    
    Algorithm:
    1. First DFS: Get finishing order (topological sort on original graph)
    2. Create transpose graph (reverse all edges)
    3. Second DFS: Run DFS on transpose in reverse finishing order
    """
    
    def dfs_first_pass(node, visited, stack):
        """First DFS to get finishing order"""
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs_first_pass(neighbor, visited, stack)
        stack.append(node)  # Add to stack when finishing
    
    def dfs_second_pass(node, visited, component, transpose_graph):
        """Second DFS to find SCC"""
        visited.add(node)
        component.append(node)
        for neighbor in transpose_graph.get(node, []):
            if neighbor not in visited:
                dfs_second_pass(neighbor, visited, component, transpose_graph)
    
    # Step 1: First DFS pass to get finishing order
    visited = set()
    finish_stack = []
    
    print("Step 1: First DFS pass")
    for node in graph:
        if node not in visited:
            print(f"  Starting DFS from {node}")
            dfs_first_pass(node, visited, finish_stack)
    
    print(f"Finishing order: {finish_stack}")
    
    # Step 2: Create transpose graph
    transpose_graph = {}
    for node in graph:
        transpose_graph[node] = []
    
    for node in graph:
        for neighbor in graph[node]:
            transpose_graph[neighbor].append(node)
    
    print(f"Transpose graph: {transpose_graph}")
    
    # Step 3: Second DFS pass on transpose graph
    visited = set()
    sccs = []
    
    print("\nStep 2: Second DFS pass on transpose")
    while finish_stack:
        node = finish_stack.pop()
        if node not in visited:
            component = []
            print(f"  Starting SCC from {node}")
            dfs_second_pass(node, visited, component, transpose_graph)
            sccs.append(component)
            print(f"  Found SCC: {component}")
    
    return sccs

# Test Kosaraju's algorithm
scc_graph = {
    'A': ['B'],
    'B': ['C'],
    'C': ['A', 'D'],
    'D': ['E'],
    'E': ['F'],
    'F': ['D']
}

print("Testing Kosaraju's SCC Algorithm:")
strongly_connected = kosaraju_scc(scc_graph)
print(f"\nStrongly Connected Components: {strongly_connected}")
```

### Tarjan's Algorithm (Single-Pass DFS):
```python
def tarjan_scc(graph):
    """
    Find Strongly Connected Components using Tarjan's algorithm
    More efficient - single DFS pass with discovery times
    """
    index_counter = [0]
    stack = []
    lowlinks = {}
    index = {}
    on_stack = {}
    sccs = []
    
    def strongconnect(node):
        # Set the depth index for this node
        index[node] = index_counter[0]
        lowlinks[node] = index_counter[0]
        index_counter[0] += 1
        stack.append(node)
        on_stack[node] = True
        
        print(f"Visiting {node}, index: {index[node]}")
        
        # Consider successors
        for neighbor in graph.get(node, []):
            if neighbor not in index:
                # Successor not yet visited; recurse
                strongconnect(neighbor)
                lowlinks[node] = min(lowlinks[node], lowlinks[neighbor])
            elif on_stack[neighbor]:
                # Successor is in stack and hence in current SCC
                lowlinks[node] = min(lowlinks[node], index[neighbor])
        
        # If node is root of SCC, pop the stack
        if lowlinks[node] == index[node]:
            component = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                component.append(w)
                if w == node:
                    break
            sccs.append(component)
            print(f"Found SCC: {component}")
    
    # Run algorithm for all nodes
    for node in graph:
        if node not in index:
            strongconnect(node)
    
    return sccs

print("\nTesting Tarjan's SCC Algorithm:")
tarjan_result = tarjan_scc(scc_graph)
print(f"Strongly Connected Components: {tarjan_result}")
```

## 🎯 Pattern 8: Articulation Points and Bridges

### Problem: Find critical vertices/edges whose removal disconnects the graph

**Real-World Applications:**
- **Network Security**: Find critical routers/connections
- **Transportation**: Find critical roads/intersections
- **Social Networks**: Find influential connectors

### Articulation Points (Cut Vertices):
```python
def find_articulation_points(graph):
    """
    Find articulation points using DFS
    Articulation point: vertex whose removal increases connected components
    """
    visited = set()
    discovery = {}
    low = {}
    parent = {}
    articulation_points = set()
    time = [0]
    
    def dfs_articulation(node):
        children = 0
        visited.add(node)
        discovery[node] = low[node] = time[0]
        time[0] += 1
        
        print(f"Visiting {node}, discovery: {discovery[node]}")
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                children += 1
                parent[neighbor] = node
                dfs_articulation(neighbor)
                
                # Update low value
                low[node] = min(low[node], low[neighbor])
                
                # Check articulation point conditions
                # Case 1: Root with more than one child
                if node not in parent and children > 1:
                    articulation_points.add(node)
                    print(f"  {node} is articulation point (root with {children} children)")
                
                # Case 2: Non-root with low[neighbor] >= discovery[node]
                if node in parent and low[neighbor] >= discovery[node]:
                    articulation_points.add(node)
                    print(f"  {node} is articulation point (low[{neighbor}]={low[neighbor]} >= disc[{node}]={discovery[node]})")
            
            elif neighbor != parent.get(node):
                # Back edge
                low[node] = min(low[node], discovery[neighbor])
                print(f"  Back edge to {neighbor}, updated low[{node}]={low[node]}")
    
    # Run DFS from all unvisited nodes
    for node in graph:
        if node not in visited:
            parent[node] = None
            dfs_articulation(node)
    
    return list(articulation_points)

# Test articulation points
bridge_graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C', 'E'],
    'E': ['D']
}

print("Finding Articulation Points:")
art_points = find_articulation_points(bridge_graph)
print(f"Articulation points: {art_points}")
```

### Bridges (Cut Edges):
```python
def find_bridges(graph):
    """
    Find bridges using DFS
    Bridge: edge whose removal increases connected components
    """
    visited = set()
    discovery = {}
    low = {}
    parent = {}
    bridges = []
    time = [0]
    
    def dfs_bridges(node):
        visited.add(node)
        discovery[node] = low[node] = time[0]
        time[0] += 1
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                parent[neighbor] = node
                dfs_bridges(neighbor)
                
                # Update low value
                low[node] = min(low[node], low[neighbor])
                
                # Check bridge condition: low[neighbor] > discovery[node]
                if low[neighbor] > discovery[node]:
                    bridges.append((node, neighbor))
                    print(f"Bridge found: {node}-{neighbor}")
            
            elif neighbor != parent.get(node):
                # Back edge
                low[node] = min(low[node], discovery[neighbor])
    
    # Run DFS from all unvisited nodes
    for node in graph:
        if node not in visited:
            parent[node] = None
            dfs_bridges(node)
    
    return bridges

print("\nFinding Bridges:")
bridges = find_bridges(bridge_graph)
print(f"Bridges: {bridges}")
```

## 🎯 Pattern 9: Maximum Flow (Ford-Fulkerson)

### Problem: Find maximum flow from source to sink in a flow network

**Real-World Applications:**
- **Network Traffic**: Maximum data flow through network
- **Supply Chain**: Maximum goods flow from factories to stores
- **Bipartite Matching**: Maximum matching problems

### Ford-Fulkerson with DFS (Edmonds-Karp uses BFS):
```python
def ford_fulkerson_max_flow(capacity_graph, source, sink):
    """
    Find maximum flow using Ford-Fulkerson algorithm with DFS
    
    Args:
        capacity_graph: Dictionary of dictionaries {u: {v: capacity}}
        source: Source vertex
        sink: Sink vertex
    """
    
    def dfs_find_path(graph, start, end, path, visited):
        """Find augmenting path using DFS"""
        if start == end:
            return path
        
        visited.add(start)
        
        for neighbor in graph.get(start, {}):
            if neighbor not in visited and graph[start][neighbor] > 0:
                result = dfs_find_path(graph, neighbor, end, 
                                     path + [(start, neighbor)], visited)
                if result:
                    return result
        return None
    
    # Create residual graph (copy of capacity graph)
    residual_graph = {}
    for u in capacity_graph:
        residual_graph[u] = {}
        for v in capacity_graph[u]:
            residual_graph[u][v] = capacity_graph[u][v]
            # Add reverse edge with 0 capacity
            if v not in residual_graph:
                residual_graph[v] = {}
            if u not in residual_graph[v]:
                residual_graph[v][u] = 0
    
    max_flow = 0
    iteration = 1
    
    print(f"Finding maximum flow from {source} to {sink}:")
    
    while True:
        # Find augmenting path
        path = dfs_find_path(residual_graph, source, sink, [], set())
        
        if not path:
            print("No more augmenting paths found")
            break
        
        # Find bottleneck capacity along path
        path_flow = float('inf')
        for u, v in path:
            path_flow = min(path_flow, residual_graph[u][v])
        
        print(f"\nIteration {iteration}:")
        print(f"  Path: {' → '.join([source] + [v for u, v in path])}")
        print(f"  Bottleneck capacity: {path_flow}")
        
        # Update residual capacities
        for u, v in path:
            residual_graph[u][v] -= path_flow  # Forward edge
            residual_graph[v][u] += path_flow  # Backward edge
        
        max_flow += path_flow
        print(f"  Total flow so far: {max_flow}")
        iteration += 1
    
    return max_flow, residual_graph

# Test maximum flow
flow_graph = {
    'S': {'A': 10, 'C': 8},
    'A': {'B': 5, 'C': 2},
    'B': {'T': 10},
    'C': {'B': 7, 'D': 10},
    'D': {'T': 10},
    'T': {}
}

print("Testing Ford-Fulkerson Maximum Flow:")
max_flow_value, residual = ford_fulkerson_max_flow(flow_graph, 'S', 'T')
print(f"\nMaximum flow from S to T: {max_flow_value}")
```

### Edmonds-Karp (BFS-based Ford-Fulkerson):
```python
def edmonds_karp_max_flow(capacity_graph, source, sink):
    """
    Edmonds-Karp algorithm (Ford-Fulkerson with BFS)
    Better time complexity: O(VE²)
    """
    from collections import deque
    
    def bfs_find_path(graph, start, end):
        """Find shortest augmenting path using BFS"""
        if start == end:
            return [start]
        
        visited = {start}
        queue = deque([start])
        parent = {start: None}
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph.get(node, {}):
                if neighbor not in visited and graph[node][neighbor] > 0:
                    visited.add(neighbor)
                    parent[neighbor] = node
                    queue.append(neighbor)
                    
                    if neighbor == end:
                        # Reconstruct path
                        path = []
                        current = end
                        while current is not None:
                            path.append(current)
                            current = parent[current]
                        return path[::-1]
        
        return None
    
    # Create residual graph
    residual_graph = {}
    for u in capacity_graph:
        residual_graph[u] = {}
        for v in capacity_graph[u]:
            residual_graph[u][v] = capacity_graph[u][v]
            if v not in residual_graph:
                residual_graph[v] = {}
            if u not in residual_graph[v]:
                residual_graph[v][u] = 0
    
    max_flow = 0
    iteration = 1
    
    print(f"Edmonds-Karp: Finding maximum flow from {source} to {sink}:")
    
    while True:
        # Find shortest augmenting path using BFS
        path = bfs_find_path(residual_graph, source, sink)
        
        if not path:
            break
        
        # Find bottleneck capacity
        path_flow = float('inf')
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            path_flow = min(path_flow, residual_graph[u][v])
        
        print(f"\nIteration {iteration}:")
        print(f"  Shortest path: {' → '.join(path)}")
        print(f"  Bottleneck: {path_flow}")
        
        # Update residual graph
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            residual_graph[u][v] -= path_flow
            residual_graph[v][u] += path_flow
        
        max_flow += path_flow
        iteration += 1
    
    return max_flow

print("\nTesting Edmonds-Karp:")
ek_flow = edmonds_karp_max_flow(flow_graph, 'S', 'T')
print(f"Maximum flow: {ek_flow}")
```

## 🎯 Pattern 10: Graph Coloring

### Problem: Color vertices so no adjacent vertices have same color

```python
def graph_coloring(graph, num_colors):
    """Try to color graph with given number of colors"""
    nodes = list(graph.keys())
    colors = list(range(num_colors))
    assignment = {}
    
    def is_safe(node, color):
        """Check if assigning color to node is safe"""
        for neighbor in graph[node]:
            if neighbor in assignment and assignment[neighbor] == color:
                return False
        return True
    
    def backtrack(node_idx):
        if node_idx == len(nodes):
            return True  # All nodes colored successfully
        
        node = nodes[node_idx]
        print(f"Trying to color node {node}")
        
        for color in colors:
            if is_safe(node, color):
                assignment[node] = color
                print(f"  Assigned color {color} to {node}")
                
                if backtrack(node_idx + 1):
                    return True
                
                # Backtrack
                del assignment[node]
                print(f"  Backtracked from {node}")
        
        return False
    
    if backtrack(0):
        return assignment
    else:
        return None

def greedy_coloring(graph):
    """Greedy graph coloring algorithm"""
    nodes = list(graph.keys())
    assignment = {}
    
    print("Greedy Graph Coloring:")
    
    for node in nodes:
        # Find colors used by neighbors
        used_colors = set()
        for neighbor in graph[node]:
            if neighbor in assignment:
                used_colors.add(assignment[neighbor])
        
        # Find first available color
        color = 0
        while color in used_colors:
            color += 1
        
        assignment[node] = color
        print(f"Assigned color {color} to {node} (neighbors using: {used_colors})")
    
    return assignment

# Test graph coloring
coloring_graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C']
}

print("Testing graph coloring:")
coloring = graph_coloring(coloring_graph, 3)
print(f"3-coloring result: {coloring}")

print("\n" + "="*40 + "\n")

greedy_result = greedy_coloring(coloring_graph)
print(f"Greedy coloring result: {greedy_result}")
print(f"Number of colors used: {max(greedy_result.values()) + 1}")
```

## 📊 Graph Algorithm Complexities

```
Algorithm               Time Complexity         Space Complexity
DFS                     O(V + E)               O(V)
BFS                     O(V + E)               O(V)
Cycle Detection (DFS)   O(V + E)               O(V)
Topological Sort        O(V + E)               O(V)
Dijkstra               O((V + E) log V)        O(V)
Floyd-Warshall         O(V³)                   O(V²)
Kruskal's MST          O(E log E)             O(V)
Prim's MST             O((V + E) log V)       O(V)
Kosaraju's SCC         O(V + E)               O(V)
Tarjan's SCC           O(V + E)               O(V)
Articulation Points    O(V + E)               O(V)
Bridges                O(V + E)               O(V)
Ford-Fulkerson         O(E * max_flow)        O(V)
Edmonds-Karp           O(VE²)                 O(V)
Graph Coloring         O(k^V) exponential     O(V)

Where: V = vertices, E = edges, k = colors, max_flow = maximum flow value
```

## 🎯 Practice Problems

### Easy Graph Problems:
1. **Number of Islands** (LeetCode 200) - DFS/BFS
2. **Clone Graph** (LeetCode 133) - Graph traversal
3. **Find the Town Judge** (LeetCode 997) - Graph properties
4. **Course Schedule** (LeetCode 207) - Cycle detection

### Medium Graph Problems:
1. **Course Schedule II** (LeetCode 210) - Topological sort
2. **Pacific Atlantic Water Flow** (LeetCode 417) - DFS/BFS
3. **Network Delay Time** (LeetCode 743) - Dijkstra's algorithm
4. **Accounts Merge** (LeetCode 721) - Union-Find
5. **Word Ladder** (LeetCode 127) - BFS shortest path
6. **Redundant Connection** (LeetCode 684) - Union-Find
7. **Is Graph Bipartite?** (LeetCode 785) - Graph coloring

### Hard Graph Problems:
1. **Alien Dictionary** (LeetCode 269) - Topological sort
2. **Critical Connections in a Network** (LeetCode 1192) - Bridges
3. **Minimum Cost to Make at Least One Valid Path** (LeetCode 1368) - Dijkstra
4. **Swim in Rising Water** (LeetCode 778) - Binary search + DFS
5. **Strongly Connected Components** - Kosaraju's/Tarjan's algorithms
6. **Maximum Flow** - Ford-Fulkerson/Edmonds-Karp
7. **Articulation Points in Network** - Cut vertices algorithm

### Advanced Graph Problems:
1. **Graph Valid Tree** - Cycle detection + connectivity
2. **Minimum Spanning Tree** - Kruskal's/Prim's algorithms
3. **Shortest Path in Weighted Graph** - Dijkstra's algorithm
4. **All Pairs Shortest Path** - Floyd-Warshall algorithm
5. **Maximum Bipartite Matching** - Maximum flow applications

## 📝 Quick Templates

### Basic DFS Template:
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    # Process current node
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### Basic BFS Template:
```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        # Process current node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### Dijkstra Template:
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
        
        for neighbor, weight in graph[current]:
            new_dist = current_dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return distances
```

### Union-Find Template:
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True
```

### Topological Sort Template:
```python
from collections import deque

def topological_sort(graph):
    in_degree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    
    queue = deque([node for node in in_degree if in_degree[node] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(graph) else []
```

### Strongly Connected Components Template:
```python
def kosaraju_scc(graph):
    def dfs1(node, visited, stack):
        visited.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs1(neighbor, visited, stack)
        stack.append(node)
    
    def dfs2(node, visited, component, transpose):
        visited.add(node)
        component.append(node)
        for neighbor in transpose.get(node, []):
            if neighbor not in visited:
                dfs2(neighbor, visited, component, transpose)
    
    # First pass
    visited = set()
    stack = []
    for node in graph:
        if node not in visited:
            dfs1(node, visited, stack)
    
    # Create transpose
    transpose = {node: [] for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            transpose[neighbor].append(node)
    
    # Second pass
    visited = set()
    sccs = []
    while stack:
        node = stack.pop()
        if node not in visited:
            component = []
            dfs2(node, visited, component, transpose)
            sccs.append(component)
    
    return sccs
```

### Articulation Points Template:
```python
def find_articulation_points(graph):
    visited = set()
    discovery = {}
    low = {}
    parent = {}
    ap = set()
    time = [0]
    
    def dfs(u):
        children = 0
        visited.add(u)
        discovery[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph.get(u, []):
            if v not in visited:
                children += 1
                parent[v] = u
                dfs(v)
                
                low[u] = min(low[u], low[v])
                
                if u not in parent and children > 1:
                    ap.add(u)
                
                if u in parent and low[v] >= discovery[u]:
                    ap.add(u)
            
            elif v != parent.get(u):
                low[u] = min(low[u], discovery[v])
    
    for node in graph:
        if node not in visited:
            parent[node] = None
            dfs(node)
    
    return list(ap)
```

This comprehensive guide covers all essential graph concepts and advanced algorithms with detailed explanations, visual examples, and working code implementations!
