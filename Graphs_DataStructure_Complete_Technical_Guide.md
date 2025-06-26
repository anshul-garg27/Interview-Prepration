# 📊 Complete Technical Guide to Graph Data Structures

## Table of Contents
1. [Introduction & Fundamentals](#introduction--fundamentals)
2. [Graph Theory Basics](#graph-theory-basics)
3. [Graph Representations](#graph-representations)
4. [Graph Types & Classifications](#graph-types--classifications)
5. [Core Graph Algorithms](#core-graph-algorithms)
6. [Advanced Graph Algorithms](#advanced-graph-algorithms)
7. [Implementation Patterns](#implementation-patterns)
8. [Interview Problems & Patterns](#interview-problems--patterns)
9. [Optimization Techniques](#optimization-techniques)
10. [Advanced Topics](#advanced-topics)
11. [Practice Problems](#practice-problems)
12. [References & Further Reading](#references--further-reading)

---

## Introduction & Fundamentals

### What are Graphs?

A **Graph** is a non-linear data structure consisting of:
- **Vertices (V)**: Also called nodes, represent entities
- **Edges (E)**: Connections between vertices, represent relationships

**Mathematical Definition**: G = (V, E)
- V = {v₁, v₂, v₃, ..., vₙ} (set of vertices)
- E = {(u,v) | u,v ∈ V} (set of edges)

### Graph vs Other Data Structures

| Aspect | Array | Tree | Graph |
|--------|-------|------|-------|
| Structure | Linear | Hierarchical | Non-linear |
| Relationships | Sequential | Parent-Child | Any-to-Any |
| Cycles | No | No | Yes (possible) |
| Root | N/A | One | None/Multiple |
| Traversal | Index-based | DFS/BFS | DFS/BFS |

### Real-World Applications

1. **Social Networks**: Facebook friends, LinkedIn connections
2. **Transportation**: Road networks, flight routes
3. **Computer Networks**: Internet topology, routing
4. **Biology**: Neural networks, protein interactions
5. **Economics**: Trade relationships, supply chains
6. **Gaming**: Game states, decision trees
7. **Web**: Web pages and hyperlinks
8. **Scheduling**: Task dependencies, project management

---

## Graph Theory Basics

### Vertices and Edges

**Vertex (Node)**:
- Fundamental unit of a graph
- Can store data/information
- Identified by unique labels/IDs

**Edge**:
- Connection between two vertices
- Can be directed or undirected
- May have weights/costs associated

### Graph Orientation

#### Undirected Graph
```
    A ---- B
    |      |
    |      |
    C ---- D
```
- Edges have no direction
- Edge (A,B) = Edge (B,A)
- Symmetric relationships

#### Directed Graph (Digraph)
```
    A ---> B
    ^      |
    |      v
    C <--- D
```
- Edges have direction
- Edge (A,B) ≠ Edge (B,A)
- Asymmetric relationships

### Graph Weights

#### Unweighted Graph
```
A ---- B ---- C
|      |      |
D ---- E ---- F
```
- All edges have equal importance
- Boolean connectivity

#### Weighted Graph
```
    A --5-- B --3-- C
    |       |       |
    2       1       4
    |       |       |
    D --7-- E --6-- F
```
- Edges have associated costs/weights
- Represents distance, time, cost, etc.

### Graph Properties

#### Degree
- **Degree of a vertex**: Number of edges connected to it
- **In-degree** (directed): Number of incoming edges
- **Out-degree** (directed): Number of outgoing edges

#### Path
- **Path**: Sequence of vertices connected by edges
- **Simple Path**: No repeated vertices
- **Cycle**: Path that starts and ends at the same vertex

#### Connectivity
- **Connected Graph**: Path exists between every pair of vertices
- **Strongly Connected** (directed): Path exists in both directions
- **Weakly Connected** (directed): Connected when treating as undirected

---

## Graph Representations

### 1. Adjacency Matrix

**Definition**: 2D array where matrix[i][j] represents edge between vertex i and j

#### Unweighted Graph
```python
# Example: 4 vertices (0,1,2,3)
# Edges: (0,1), (0,2), (1,2), (2,3)

adjacency_matrix = [
    [0, 1, 1, 0],  # Vertex 0
    [1, 0, 1, 0],  # Vertex 1  
    [1, 1, 0, 1],  # Vertex 2
    [0, 0, 1, 0]   # Vertex 3
]
```

#### Weighted Graph
```python
# INF represents no edge
INF = float('inf')
weighted_matrix = [
    [0,   5,   2,   INF],
    [5,   0,   3,   INF],
    [2,   3,   0,   4  ],
    [INF, INF, 4,   0  ]
]
```

**Advantages**:
- O(1) edge lookup
- Simple to implement
- Good for dense graphs

**Disadvantages**:
- O(V²) space complexity
- Inefficient for sparse graphs
- Adding vertices is expensive

### 2. Adjacency List

**Definition**: Array of lists where each list contains neighbors of a vertex

```python
# Same graph as above
adjacency_list = {
    0: [1, 2],
    1: [0, 2], 
    2: [0, 1, 3],
    3: [2]
}

# Weighted version
weighted_adjacency_list = {
    0: [(1, 5), (2, 2)],
    1: [(0, 5), (2, 3)],
    2: [(0, 2), (1, 3), (3, 4)],
    3: [(2, 4)]
}
```

**Advantages**:
- O(V + E) space complexity
- Efficient for sparse graphs
- Easy to iterate over neighbors

**Disadvantages**:
- O(degree) edge lookup
- More complex implementation

### 3. Edge List

**Definition**: List of all edges in the graph

```python
# Unweighted
edge_list = [(0,1), (0,2), (1,2), (2,3)]

# Weighted
weighted_edge_list = [(0,1,5), (0,2,2), (1,2,3), (2,3,4)]
```

**Advantages**:
- Simple representation
- Good for algorithms that process all edges
- Minimal space for sparse graphs

**Disadvantages**:
- O(E) edge lookup
- No direct neighbor access

### 4. Incidence Matrix

**Definition**: Matrix where rows represent vertices and columns represent edges

```python
# Edges: e1(0,1), e2(0,2), e3(1,2), e4(2,3)
incidence_matrix = [
    [1, 1, 0, 0],  # Vertex 0
    [1, 0, 1, 0],  # Vertex 1
    [0, 1, 1, 1],  # Vertex 2
    [0, 0, 0, 1]   # Vertex 3
]
```

### Representation Comparison

| Operation | Adj Matrix | Adj List | Edge List |
|-----------|------------|----------|-----------|
| Space | O(V²) | O(V+E) | O(E) |
| Add Vertex | O(V²) | O(1) | O(1) |
| Add Edge | O(1) | O(1) | O(1) |
| Check Edge | O(1) | O(degree) | O(E) |
| Get Neighbors | O(V) | O(degree) | O(E) |

---

## Graph Types & Classifications

### 1. Simple vs Complex Graphs

#### Simple Graph
- No self-loops
- No multiple edges between same vertices
- Most common in algorithms

#### Multigraph
- Multiple edges allowed between vertices
- Used in network modeling

#### Pseudograph
- Self-loops allowed
- Multiple edges allowed

### 2. Connectivity Classifications

#### Connected Graph (Undirected)
```
A --- B --- C
|     |     |
D --- E --- F
```
- Path exists between every pair of vertices

#### Disconnected Graph
```
A --- B    C --- D
          
E --- F    G
```
- Multiple connected components

#### Strongly Connected (Directed)
```
A ---> B
^      |
|      v
D <--- C
```
- Path exists between every ordered pair

#### Weakly Connected (Directed)
- Connected when treating edges as undirected

### 3. Special Graph Types

#### Complete Graph (Kₙ)
- Every vertex connected to every other vertex
- n vertices have n(n-1)/2 edges

#### Bipartite Graph
```
A1 --- B1
|   X  |
A2 --- B2
```
- Vertices can be divided into two disjoint sets
- Edges only between sets, not within

#### Tree
- Connected acyclic graph
- n vertices, n-1 edges
- Unique path between any two vertices

#### Forest
- Collection of disjoint trees

#### Directed Acyclic Graph (DAG)
- Directed graph with no cycles
- Used in scheduling, dependency resolution

---

## Core Graph Algorithms

### 1. Graph Traversal

#### Breadth-First Search (BFS)

**Mathematical Foundation**: BFS is fundamentally based on the concept of exploring a graph in layers, where each layer consists of vertices at distance d from the source vertex. This creates a BFS tree T = (V', E') where V' ⊆ V and E' ⊆ E, and for any vertex v ∈ V', the distance from source s to v in T equals the shortest path distance in the original graph G.

**Formal Algorithm Definition**:

**Input**: Graph G = (V, E), source vertex s ∈ V
**Output**: BFS tree T, distances d[v] for all v ∈ V

**Invariants**:
1. **Distance Invariant**: d[v] = shortest path from s to v
2. **Queue Invariant**: All vertices in queue are at most one level apart
3. **Color Invariant**: White (unvisited), Gray (in queue), Black (processed)

```python
from collections import deque
import sys

class BFSAnalyzer:
    """
    Advanced BFS implementation with detailed analysis and optimizations
    """
    
    def __init__(self):
        self.stats = {
            'vertices_explored': 0,
            'edges_examined': 0,
            'queue_max_size': 0,
            'levels_discovered': 0
        }
    
    def bfs_complete_analysis(self, graph, start):
        """
        Complete BFS with mathematical analysis and optimizations
        
        Theorem: BFS computes shortest paths in O(V + E) time
        Proof: Each vertex is visited exactly once (V operations)
               Each edge is examined exactly twice for undirected graphs (E operations)
        """
        n = len(graph)
        
        # Initialize data structures
        visited = [False] * n  # Boolean array for O(1) lookup
        distance = [-1] * n    # Distance from source
        parent = [-1] * n      # Parent pointers for path reconstruction
        level_sets = []        # Vertices at each level
        queue = deque([start])
        
        # Initialize source
        visited[start] = True
        distance[start] = 0
        current_level = 0
        level_sets.append([start])
        
        while queue:
            level_size = len(queue)
            next_level = []
            self.stats['queue_max_size'] = max(self.stats['queue_max_size'], level_size)
            
            # Process all vertices at current level
            for _ in range(level_size):
                vertex = queue.popleft()
                self.stats['vertices_explored'] += 1
                
                # Examine all neighbors
                for neighbor in graph[vertex]:
                    self.stats['edges_examined'] += 1
                    
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        distance[neighbor] = distance[vertex] + 1
                        parent[neighbor] = vertex
                        queue.append(neighbor)
                        next_level.append(neighbor)
            
            if next_level:
                current_level += 1
                level_sets.append(next_level)
                self.stats['levels_discovered'] = current_level + 1
        
        return {
            'distances': distance,
            'parents': parent,
            'level_sets': level_sets,
            'bfs_tree': self._construct_bfs_tree(parent, start),
            'statistics': self.stats
        }
    
    def _construct_bfs_tree(self, parent, start):
        """Reconstruct BFS tree from parent pointers"""
        tree = {}
        for i, p in enumerate(parent):
            if p != -1:
                if p not in tree:
                    tree[p] = []
                tree[p].append(i)
            elif i == start:
                tree[i] = tree.get(i, [])
        return tree
    
    def bidirectional_bfs(self, graph, start, target):
        """
        Bidirectional BFS for shortest path
        
        Theorem: Reduces time complexity from O(b^d) to O(b^(d/2))
        where b is branching factor and d is shortest path length
        """
        if start == target:
            return [start]
        
        # Forward and backward searches
        forward_queue = deque([start])
        backward_queue = deque([target])
        forward_visited = {start: [start]}
        backward_visited = {target: [target]}
        
        while forward_queue and backward_queue:
            # Always expand the smaller frontier (optimization)
            if len(forward_queue) <= len(backward_queue):
                if self._expand_level(graph, forward_queue, forward_visited, backward_visited):
                    return self._construct_path(forward_visited, backward_visited)
            else:
                if self._expand_level(graph, backward_queue, backward_visited, forward_visited):
                    return self._construct_path(forward_visited, backward_visited)
        
        return None  # No path exists
    
    def _expand_level(self, graph, queue, visited, other_visited):
        """Expand one level of BFS search"""
        level_size = len(queue)
        for _ in range(level_size):
            current = queue.popleft()
            for neighbor in graph[current]:
                if neighbor in other_visited:
                    return True  # Path found
                if neighbor not in visited:
                    visited[neighbor] = visited[current] + [neighbor]
                    queue.append(neighbor)
        return False
    
    def parallel_bfs(self, graph, sources):
        """
        Multi-source BFS for computing distances from multiple sources
        
        Applications: 
        - Finding nearest facility (hospitals, fire stations)
        - Voronoi diagrams on graphs
        - Multi-commodity flow problems
        """
        n = len(graph)
        distance = [float('inf')] * n
        source_map = [-1] * n  # Which source is closest
        queue = deque()
        
        # Initialize all sources
        for i, source in enumerate(sources):
            distance[source] = 0
            source_map[source] = i
            queue.append(source)
        
        while queue:
            vertex = queue.popleft()
            
            for neighbor in graph[vertex]:
                if distance[neighbor] == float('inf'):
                    distance[neighbor] = distance[vertex] + 1
                    source_map[neighbor] = source_map[vertex]
                    queue.append(neighbor)
        
        return distance, source_map

# Advanced BFS Applications

def bfs_shortest_path_unweighted(graph, start, end):
    """
    Theorem: BFS finds shortest path in unweighted graphs
    Proof: By induction on distance levels
    """
    if start == end:
        return [start]
    
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        vertex, path = queue.popleft()
        
        for neighbor in graph[vertex]:
            if neighbor == end:
                return path + [neighbor]
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return None

def bfs_bipartite_check(graph):
    """
    Theorem: A graph is bipartite iff it contains no odd-length cycles
    Algorithm: 2-color the graph using BFS
    """
    n = len(graph)
    color = [-1] * n  # -1: uncolored, 0: color A, 1: color B
    
    for start in range(n):
        if color[start] == -1:
            queue = deque([start])
            color[start] = 0
            
            while queue:
                vertex = queue.popleft()
                
                for neighbor in graph[vertex]:
                    if color[neighbor] == -1:
                        color[neighbor] = 1 - color[vertex]
                        queue.append(neighbor)
                    elif color[neighbor] == color[vertex]:
                        return False, None  # Odd cycle found
    
    return True, color

def bfs_level_order_properties(graph, start):
    """
    Advanced level-order analysis with graph properties
    """
    queue = deque([(start, 0)])
    visited = {start}
    levels = {}
    max_width = 0
    
    while queue:
        vertex, level = queue.popleft()
        
        if level not in levels:
            levels[level] = []
        levels[level].append(vertex)
        max_width = max(max_width, len(levels[level]))
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, level + 1))
    
    return {
        'levels': levels,
        'max_width': max_width,
        'diameter_lower_bound': max(levels.keys()) if levels else 0,
        'eccentricity': max(levels.keys()) if levels else 0
    }

# Time: O(V + E), Space: O(V)
```

**Advanced Mathematical Analysis**:

1. **Complexity Proof**:
   - **Time**: Each vertex is enqueued exactly once → O(V)
   - **Time**: Each edge is examined exactly twice (undirected) → O(E)  
   - **Space**: Queue size ≤ O(V), visited array = O(V) → O(V)

2. **Optimality Theorem**: BFS produces a shortest-path tree where d[v] represents the minimum number of edges from source to vertex v.

3. **Level Structure**: BFS partitions vertices into levels L₀, L₁, ..., Lₖ where Lᵢ = {v : d[v] = i}

**Advanced Applications & Research**:

1. **Social Network Analysis**: 
   - Six degrees of separation
   - Friend recommendation systems
   - Viral spread modeling

2. **Computational Biology**:
   - Protein interaction networks
   - Gene regulatory networks
   - Phylogenetic tree construction

3. **Web Search & Information Retrieval**:
   - Web crawling strategies
   - PageRank computation foundation
   - Link analysis algorithms

4. **Parallel BFS**: 
   - Level-synchronous parallel BFS
   - Direction-optimizing BFS
   - Delta-stepping algorithms

**Modern Optimizations**:

1. **Direction-Optimizing BFS**: Switch between top-down and bottom-up approaches
2. **Compressed Sparse Row (CSR)**: Memory-efficient graph representation
3. **SIMD Vectorization**: Parallel processing of adjacency lists
4. **Cache-Conscious Layouts**: Optimize memory access patterns

#### Depth-First Search (DFS)

**Mathematical Foundation**: DFS is based on the systematic exploration of graph structure using a Last-In-First-Out (LIFO) principle. It creates a DFS forest F = {T₁, T₂, ..., Tₖ} where each Tᵢ is a DFS tree rooted at a vertex that starts a new DFS traversal.

**Formal Algorithm Theory**:

**Edge Classification Theorem**: In any DFS of an undirected graph, every edge is either:
1. **Tree Edge**: Part of the DFS forest
2. **Back Edge**: Connects vertex to its ancestor

**For Directed Graphs**, edges are classified as:
1. **Tree Edge**: (u,v) where v is discovered from u
2. **Back Edge**: (u,v) where v is ancestor of u (indicates cycle)
3. **Forward Edge**: (u,v) where v is descendant of u (not tree edge)
4. **Cross Edge**: All other edges

**White Path Theorem**: In DFS of directed graph, vertex v is descendant of u iff at time d[u], there exists a white path from u to v.

```python
import sys
from enum import Enum
from typing import List, Dict, Set, Tuple, Optional

class EdgeType(Enum):
    TREE = "tree"
    BACK = "back"
    FORWARD = "forward"
    CROSS = "cross"

class DFSState(Enum):
    WHITE = 0  # Undiscovered
    GRAY = 1   # Discovered but not finished
    BLACK = 2  # Finished

class AdvancedDFS:
    """
    PhD-level DFS implementation with complete mathematical analysis
    """
    
    def __init__(self):
        self.time = 0
        self.discovery_time = {}
        self.finish_time = {}
        self.parent = {}
        self.state = {}
        self.edge_classification = {}
        self.back_edges = []
        self.strongly_connected_components = []
        self.topological_order = []
        
    def dfs_complete_analysis(self, graph: Dict[int, List[int]], directed: bool = True):
        """
        Complete DFS with mathematical analysis and edge classification
        
        Theorem: DFS visits each vertex exactly once and examines each edge exactly once (directed) 
                or twice (undirected), giving O(V + E) time complexity.
        """
        self._initialize(graph)
        
        # Main DFS loop - handles disconnected components
        for vertex in graph:
            if self.state[vertex] == DFSState.WHITE:
                self._dfs_visit(graph, vertex, directed)
        
        return {
            'discovery_times': self.discovery_time,
            'finish_times': self.finish_time,
            'parents': self.parent,
            'edge_classification': self.edge_classification,
            'back_edges': self.back_edges,
            'topological_order': self.topological_order[::-1],  # Reverse for correct order
            'has_cycle': len(self.back_edges) > 0,
            'strongly_connected_components': self.strongly_connected_components
        }
    
    def _initialize(self, graph):
        """Initialize DFS data structures"""
        self.time = 0
        for vertex in graph:
            self.state[vertex] = DFSState.WHITE
            self.parent[vertex] = None
            self.discovery_time[vertex] = 0
            self.finish_time[vertex] = 0
    
    def _dfs_visit(self, graph, vertex, directed):
        """
        Core DFS visit procedure with timestamp analysis
        
        Invariant Maintenance:
        1. White vertices are undiscovered
        2. Gray vertices are in the current DFS path
        3. Black vertices are completely processed
        """
        self.time += 1
        self.discovery_time[vertex] = self.time
        self.state[vertex] = DFSState.GRAY
        
        # Explore all adjacent vertices
        for neighbor in graph[vertex]:
            edge = (vertex, neighbor)
            
            if self.state[neighbor] == DFSState.WHITE:
                # Tree edge
                self.edge_classification[edge] = EdgeType.TREE
                self.parent[neighbor] = vertex
                self._dfs_visit(graph, neighbor, directed)
                
            elif self.state[neighbor] == DFSState.GRAY:
                # Back edge (indicates cycle)
                self.edge_classification[edge] = EdgeType.BACK
                self.back_edges.append(edge)
                
            elif directed and self.state[neighbor] == DFSState.BLACK:
                # Forward or cross edge (only in directed graphs)
                if self.discovery_time[vertex] < self.discovery_time[neighbor]:
                    self.edge_classification[edge] = EdgeType.FORWARD
                else:
                    self.edge_classification[edge] = EdgeType.CROSS
        
        # Finish processing vertex
        self.state[vertex] = DFSState.BLACK
        self.time += 1
        self.finish_time[vertex] = self.time
        self.topological_order.append(vertex)
    
    def articulation_points_and_bridges(self, graph):
        """
        Tarjan's algorithm for finding articulation points and bridges
        
        Theorem: A vertex v is an articulation point iff:
        1. v is root of DFS tree and has ≥2 children, OR
        2. v has child u such that low[u] ≥ discovery[v]
        
        Bridge (u,v) exists iff low[v] > discovery[u] where u is parent of v
        """
        self._initialize(graph)
        low = {}
        articulation_points = set()
        bridges = []
        
        def dfs_ap_bridge(vertex, parent=None):
            children = 0
            self.time += 1
            self.discovery_time[vertex] = self.time
            low[vertex] = self.time
            self.state[vertex] = DFSState.GRAY
            
            for neighbor in graph[vertex]:
                if self.state[neighbor] == DFSState.WHITE:
                    children += 1
                    self.parent[neighbor] = vertex
                    dfs_ap_bridge(neighbor, vertex)
                    
                    # Update low value
                    low[vertex] = min(low[vertex], low[neighbor])
                    
                    # Check for articulation point
                    if parent is None and children > 1:
                        articulation_points.add(vertex)  # Root with multiple children
                    elif parent is not None and low[neighbor] >= self.discovery_time[vertex]:
                        articulation_points.add(vertex)  # Non-root articulation point
                    
                    # Check for bridge
                    if low[neighbor] > self.discovery_time[vertex]:
                        bridges.append((vertex, neighbor))
                        
                elif neighbor != parent:  # Back edge (not to parent)
                    low[vertex] = min(low[vertex], self.discovery_time[neighbor])
            
            self.state[vertex] = DFSState.BLACK
        
        # Handle disconnected components
        for vertex in graph:
            if self.state[vertex] == DFSState.WHITE:
                dfs_ap_bridge(vertex)
        
        return list(articulation_points), bridges
    
    def strongly_connected_components_kosaraju(self, graph):
        """
        Kosaraju's algorithm for strongly connected components
        
        Theorem: SCCs can be found in O(V + E) time using two DFS traversals
        """
        # First DFS to get finish times
        first_dfs = AdvancedDFS()
        result = first_dfs.dfs_complete_analysis(graph, directed=True)
        
        # Create transpose graph
        transpose = self._create_transpose(graph)
        
        # Second DFS in decreasing order of finish times
        vertices_by_finish_time = sorted(
            result['finish_times'].items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        self._initialize(transpose)
        sccs = []
        
        for vertex, _ in vertices_by_finish_time:
            if self.state[vertex] == DFSState.WHITE:
                scc = []
                self._dfs_collect_scc(transpose, vertex, scc)
                sccs.append(scc)
        
        return sccs
    
    def _create_transpose(self, graph):
        """Create transpose graph by reversing all edges"""
        transpose = {vertex: [] for vertex in graph}
        for vertex in graph:
            for neighbor in graph[vertex]:
                transpose[neighbor].append(vertex)
        return transpose
    
    def _dfs_collect_scc(self, graph, vertex, scc):
        """Collect vertices in current SCC"""
        self.state[vertex] = DFSState.BLACK
        scc.append(vertex)
        
        for neighbor in graph[vertex]:
            if self.state[neighbor] == DFSState.WHITE:
                self._dfs_collect_scc(graph, neighbor, scc)
    
    def cycle_detection_directed(self, graph):
        """
        Detect cycles in directed graph using DFS
        
        Theorem: Directed graph has cycle iff DFS produces back edge
        """
        self._initialize(graph)
        
        def has_cycle_util(vertex, path):
            self.state[vertex] = DFSState.GRAY
            path.add(vertex)
            
            for neighbor in graph[vertex]:
                if neighbor in path:  # Back edge found
                    return True, self._extract_cycle(path, neighbor, vertex)
                elif self.state[neighbor] == DFSState.WHITE:
                    has_cycle, cycle = has_cycle_util(neighbor, path)
                    if has_cycle:
                        return True, cycle
            
            self.state[vertex] = DFSState.BLACK
            path.remove(vertex)
            return False, None
        
        for vertex in graph:
            if self.state[vertex] == DFSState.WHITE:
                has_cycle, cycle = has_cycle_util(vertex, set())
                if has_cycle:
                    return True, cycle
        
        return False, None
    
    def _extract_cycle(self, path, start, end):
        """Extract cycle from path when back edge is found"""
        path_list = list(path)
        start_idx = path_list.index(start)
        return path_list[start_idx:] + [start]

# Advanced DFS Applications

def dfs_path_finding_all(graph, start, end, path=None):
    """
    Find all paths between two vertices using DFS
    Exponential time complexity in worst case
    """
    if path is None:
        path = []
    
    path = path + [start]
    
    if start == end:
        return [path]
    
    paths = []
    for neighbor in graph.get(start, []):
        if neighbor not in path:  # Avoid cycles
            new_paths = dfs_path_finding_all(graph, neighbor, end, path)
            paths.extend(new_paths)
    
    return paths

def dfs_maze_solving(maze, start, end):
    """
    Solve maze using DFS with backtracking
    Classical application of DFS in AI and robotics
    """
    rows, cols = len(maze), len(maze[0])
    visited = set()
    path = []
    
    def is_valid(r, c):
        return (0 <= r < rows and 0 <= c < cols and 
                maze[r][c] != 1 and (r, c) not in visited)
    
    def dfs_solve(r, c):
        if (r, c) == end:
            path.append((r, c))
            return True
        
        if not is_valid(r, c):
            return False
        
        visited.add((r, c))
        path.append((r, c))
        
        # Try all four directions
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            if dfs_solve(r + dr, c + dc):
                return True
        
        # Backtrack
        path.pop()
        return False
    
    if dfs_solve(start[0], start[1]):
        return path
    return None

def dfs_tree_serialization(tree_root):
    """
    Serialize binary tree using DFS preorder traversal
    Used in tree persistence and transmission
    """
    def serialize(node):
        if not node:
            return "null"
        return f"{node.val},{serialize(node.left)},{serialize(node.right)}"
    
    return serialize(tree_root)

# Time: O(V + E), Space: O(V)
```

**Advanced Mathematical Analysis**:

1. **Parenthesis Theorem**: For any two vertices u and v, exactly one of following holds:
   - Intervals [d[u], f[u]] and [d[v], f[v]] are disjoint
   - One interval is contained within the other

2. **Cycle Detection Complexity**:
   - **Undirected**: O(V + E) using back edge detection
   - **Directed**: O(V + E) using three-coloring method

3. **SCC Decomposition**: Creates condensation graph (DAG) representing SCCs

**Research Applications**:

1. **Compiler Design**: 
   - Dependency analysis
   - Dead code elimination
   - Register allocation

2. **Artificial Intelligence**:
   - Game tree search
   - Constraint satisfaction
   - Planning algorithms

3. **Network Analysis**:
   - Social influence modeling
   - Information cascade prediction
   - Community detection

4. **Bioinformatics**:
   - Protein folding pathways
   - Metabolic network analysis
   - Evolutionary tree construction

**Modern Optimizations**:

1. **Iterative DFS**: Eliminate recursion using explicit stack
2. **Parallel DFS**: Work-stealing algorithms for parallel exploration
3. **Memory-Efficient DFS**: Streaming algorithms for massive graphs
4. **Approximate DFS**: Randomized algorithms for large-scale networks

### 2. Shortest Path Algorithms

#### Dijkstra's Algorithm

**Mathematical Foundation**: Dijkstra's algorithm is based on the **greedy choice property** and **optimal substructure** for shortest path problems. It maintains the invariant that once a vertex is finalized, its distance represents the true shortest path from the source.

**Formal Correctness Proof**:

**Theorem**: Upon termination, Dijkstra's algorithm has computed shortest paths from source s to all reachable vertices.

**Proof by Induction**:
- **Base Case**: d[s] = 0 is correct
- **Inductive Step**: When vertex u is selected with minimum distance d[u], this distance is optimal
- **Key Insight**: Any shorter path to u would require going through an unprocessed vertex v with d[v] ≥ d[u], contradicting the greedy choice

**Mathematical Prerequisites**:
1. **Non-negative edge weights**: w(u,v) ≥ 0 for all edges (u,v)
2. **Relaxation Property**: d[v] ≤ d[u] + w(u,v) after relaxing edge (u,v)
3. **Triangle Inequality**: δ(s,v) ≤ δ(s,u) + w(u,v) where δ represents true distance

```python
import heapq
import math
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from enum import Enum

class DijkstraVariant(Enum):
    STANDARD = "standard"
    BIDIRECTIONAL = "bidirectional"
    A_STAR = "a_star"
    GOAL_DIRECTED = "goal_directed"

@dataclass
class PathResult:
    distance: float
    path: List[int]
    vertices_processed: int
    edges_relaxed: int
    heap_operations: int

class AdvancedDijkstra:
    """
    PhD-level implementation of Dijkstra's algorithm with advanced optimizations
    and mathematical analysis
    """
    
    def __init__(self):
        self.stats = {
            'vertices_processed': 0,
            'edges_relaxed': 0,
            'heap_operations': 0,
            'relaxation_calls': 0,
            'successful_relaxations': 0
        }
    
    def dijkstra_single_source(self, graph: Dict[int, List[Tuple[int, float]]], 
                              source: int) -> Dict[int, PathResult]:
        """
        Single-source shortest paths with complete analysis
        
        Complexity Analysis:
        - Time: O((V + E) log V) with binary heap
        - Time: O(V log V + E) with Fibonacci heap
        - Space: O(V) for distance array and priority queue
        
        Returns complete path information for all reachable vertices
        """
        n = len(graph)
        
        # Initialize data structures
        distances = {vertex: math.inf for vertex in graph}
        previous = {vertex: None for vertex in graph}
        distances[source] = 0
        
        # Priority queue: (distance, vertex)
        pq = [(0, source)]
        processed = set()
        
        while pq:
            current_dist, current_vertex = heapq.heappop(pq)
            self.stats['heap_operations'] += 1
            
            # Skip if already processed (handles duplicate entries)
            if current_vertex in processed:
                continue
            
            processed.add(current_vertex)
            self.stats['vertices_processed'] += 1
            
            # Early termination optimization for single-target queries
            # if current_vertex == target: break
            
            # Relax all outgoing edges
            for neighbor, weight in graph.get(current_vertex, []):
                self._relax_edge(current_vertex, neighbor, weight, 
                               distances, previous, pq, processed)
        
        # Construct path results
        results = {}
        for vertex in graph:
            if distances[vertex] != math.inf:
                path = self._reconstruct_path(previous, source, vertex)
                results[vertex] = PathResult(
                    distance=distances[vertex],
                    path=path,
                    vertices_processed=self.stats['vertices_processed'],
                    edges_relaxed=self.stats['edges_relaxed'],
                    heap_operations=self.stats['heap_operations']
                )
        
        return results
    
    def _relax_edge(self, u: int, v: int, weight: float, 
                   distances: Dict, previous: Dict, pq: List, processed: Set):
        """
        Edge relaxation with mathematical analysis
        
        Relaxation Condition: d[v] > d[u] + w(u,v)
        """
        self.stats['relaxation_calls'] += 1
        
        if v not in processed:  # Only relax unprocessed vertices
            new_distance = distances[u] + weight
            
            if new_distance < distances[v]:
                distances[v] = new_distance
                previous[v] = u
                heapq.heappush(pq, (new_distance, v))
                self.stats['successful_relaxations'] += 1
                self.stats['heap_operations'] += 1
        
        self.stats['edges_relaxed'] += 1
    
    def dijkstra_bidirectional(self, graph: Dict[int, List[Tuple[int, float]]], 
                              source: int, target: int) -> Optional[PathResult]:
        """
        Bidirectional Dijkstra for single source-target queries
        
        Theorem: Reduces search space from O(b^d) to O(b^(d/2))
        where b is branching factor and d is shortest path length
        """
        if source == target:
            return PathResult(0, [source], 0, 0, 0)
        
        # Forward and backward searches
        forward_queue = deque([source])
        backward_queue = deque([target])
        forward_visited = {source: [source]}
        backward_visited = {target: [target]}
        
        best_distance = math.inf
        meeting_point = None
        
        while forward_queue and backward_queue:
            # Always expand from the search with smaller top element
            if forward_queue[0][0] <= backward_queue[0][0]:
                # Forward expansion
                dist, vertex = heapq.heappop(forward_queue)
                if vertex in forward_visited:
                    continue
                
                forward_visited[vertex] = forward_visited[vertex] + [vertex]
                
                # Check for meeting
                if vertex in backward_visited:
                    total_dist = forward_visited[vertex] + backward_visited[vertex]
                    if total_dist < best_distance:
                        best_distance = total_dist
                        meeting_point = vertex
                
                # Relax forward edges
                for neighbor, weight in graph.get(vertex, []):
                    if neighbor not in forward_visited:
                        new_dist = forward_visited[vertex] + weight
                        if new_dist < forward_visited[neighbor]:
                            forward_visited[neighbor] = new_dist
                            heapq.heappush(forward_queue, (new_dist, neighbor))
            else:
                # Backward expansion
                dist, vertex = heapq.heappop(backward_queue)
                if vertex in backward_visited:
                    continue
                
                backward_visited[vertex] = backward_visited[vertex] + [vertex]
                
                # Check for meeting
                if vertex in forward_visited:
                    total_dist = forward_visited[vertex] + backward_visited[vertex]
                    if total_dist < best_distance:
                        best_distance = total_dist
                        meeting_point = vertex
                
                # Relax backward edges
                for neighbor, weight in graph.get(vertex, []):
                    if neighbor not in backward_visited:
                        new_dist = backward_visited[vertex] + weight
                        if new_dist < backward_visited[neighbor]:
                            backward_visited[neighbor] = new_dist
                            heapq.heappush(backward_queue, (new_dist, neighbor))
            
            # Early termination condition
            if (forward_queue and backward_queue and 
                forward_queue[0][0] + backward_queue[0][0] >= best_distance):
                break
        
        if meeting_point is None:
            return None
        
        # Reconstruct path
        forward_path = self._reconstruct_path(forward_visited, source, meeting_point)
        backward_path = self._reconstruct_path(backward_visited, target, meeting_point)
        full_path = forward_path + backward_path[1:][::-1]
        
        return PathResult(
            distance=best_distance,
            path=full_path,
            vertices_processed=len(forward_visited) + len(backward_visited),
            edges_relaxed=self.stats['edges_relaxed'],
            heap_operations=self.stats['heap_operations']
        )
    
    def dijkstra_with_heuristic(self, graph: Dict[int, List[Tuple[int, float]]], 
                               source: int, target: int, 
                               heuristic: callable) -> Optional[PathResult]:
        """
        A* algorithm: Dijkstra with admissible heuristic
        
        Admissibility Condition: h(v) ≤ δ(v, target) for all vertices v
        Consistency Condition: h(u) ≤ c(u,v) + h(v) for all edges (u,v)
        
        Theorem: A* is optimal if heuristic is admissible
        """
        distances = {vertex: math.inf for vertex in graph}
        previous = {vertex: None for vertex in graph}
        distances[source] = 0
        
        # Priority queue: (f_score, g_score, vertex) where f = g + h
        pq = [(heuristic(source, target), 0, source)]
        processed = set()
        
        while pq:
            f_score, g_score, current = heapq.heappop(pq)
            
            if current in processed:
                continue
            
            if current == target:
                path = self._reconstruct_path(previous, source, target)
                return PathResult(
                    distance=distances[target],
                    path=path,
                    vertices_processed=len(processed),
                    edges_relaxed=self.stats['edges_relaxed'],
                    heap_operations=self.stats['heap_operations']
                )
            
            processed.add(current)
            
            for neighbor, weight in graph.get(current, []):
                if neighbor not in processed:
                    tentative_g = distances[current] + weight
                    
                    if tentative_g < distances[neighbor]:
                        distances[neighbor] = tentative_g
                        previous[neighbor] = current
                        f_score = tentative_g + heuristic(neighbor, target)
                        heapq.heappush(pq, (f_score, tentative_g, neighbor))
        
        return None
    
    def dijkstra_k_shortest_paths(self, graph: Dict[int, List[Tuple[int, float]]], 
                                 source: int, target: int, k: int) -> List[PathResult]:
        """
        Yen's algorithm for K shortest paths
        
        Complexity: O(K * V * (E + V log V))
        """
        # First shortest path using standard Dijkstra
        first_path = self.dijkstra_single_source(graph, source).get(target)
        if not first_path:
            return []
        
        shortest_paths = [first_path]
        candidate_paths = []
        
        for i in range(1, k):
            # Generate candidate paths by deviating from previous shortest paths
            for j in range(len(shortest_paths[i-1].path) - 1):
                spur_node = shortest_paths[i-1].path[j]
                root_path = shortest_paths[i-1].path[:j+1]
                
                # Create modified graph by removing conflicting edges/nodes
                modified_graph = self._create_modified_graph(graph, shortest_paths, root_path, j)
                
                # Find shortest path from spur node to target
                spur_path_result = self.dijkstra_single_source(modified_graph, spur_node).get(target)
                
                if spur_path_result:
                    total_path = root_path[:-1] + spur_path_result.path
                    total_distance = (shortest_paths[i-1].distance - 
                                    self._path_distance(graph, shortest_paths[i-1].path[j:]) +
                                    spur_path_result.distance)
                    
                    candidate_result = PathResult(
                        distance=total_distance,
                        path=total_path,
                        vertices_processed=spur_path_result.vertices_processed,
                        edges_relaxed=spur_path_result.edges_relaxed,
                        heap_operations=spur_path_result.heap_operations
                    )
                    
                    # Add to candidates if not duplicate
                    if not any(c.path == candidate_result.path for c in candidate_paths):
                        candidate_paths.append(candidate_result)
            
            if not candidate_paths:
                break
            
            # Select shortest candidate path
            candidate_paths.sort(key=lambda x: x.distance)
            shortest_paths.append(candidate_paths.pop(0))
        
        return shortest_paths
    
    def _create_reverse_graph(self, graph):
        """Create reverse graph by reversing all edges"""
        reverse = {vertex: [] for vertex in graph}
        for vertex in graph:
            for neighbor, weight in graph[vertex]:
                reverse[neighbor].append((vertex, weight))
        return reverse
    
    def _reconstruct_path(self, previous, source, target):
        """Reconstruct shortest path from previous pointers"""
        path = []
        current = target
        
        while current is not None:
            path.append(current)
            current = previous[current]
        
        return path[::-1] if path and path[-1] == source else []
    
    def _create_modified_graph(self, graph, paths, root_path, deviation_index):
        """Create modified graph for k-shortest paths algorithm"""
        # Implementation details for Yen's algorithm
        # This is a simplified version - full implementation requires careful edge removal
        modified = {vertex: list(edges) for vertex, edges in graph.items()}
        return modified
    
    def _path_distance(self, graph, path):
        """Calculate total distance of a path"""
        if len(path) < 2:
            return 0
        
        total = 0
        for i in range(len(path) - 1):
            current, next_vertex = path[i], path[i+1]
            for neighbor, weight in graph.get(current, []):
                if neighbor == next_vertex:
                    total += weight
                    break
        return total

# Advanced Applications and Variants

def dijkstra_with_turn_restrictions(graph, source, target, turn_costs):
    """
    Dijkstra with turn restrictions for vehicle routing
    State space: (vertex, incoming_edge) instead of just vertex
    """
    # State: (distance, vertex, previous_edge)
    pq = [(0, source, None)]
    distances = {}  # (vertex, prev_edge) -> distance
    distances[(source, None)] = 0
    
    while pq:
        dist, vertex, prev_edge = heapq.heappop(pq)
        
        if (vertex, prev_edge) in distances and dist > distances[(vertex, prev_edge)]:
            continue
        
        if vertex == target:
            return dist
        
        for next_vertex, edge_weight in graph.get(vertex, []):
            turn_cost = turn_costs.get((prev_edge, (vertex, next_vertex)), 0)
            new_distance = dist + edge_weight + turn_cost
            state = (next_vertex, (vertex, next_vertex))
            
            if state not in distances or new_distance < distances[state]:
                distances[state] = new_distance
                heapq.heappush(pq, (new_distance, next_vertex, (vertex, next_vertex)))
    
    return float('inf')

def dijkstra_time_dependent(graph, source, target, departure_time):
    """
    Time-dependent shortest paths where edge weights vary with time
    Applications: traffic-aware routing, public transportation
    """
    # Each edge has function weight(time) instead of constant weight
    pq = [(0, departure_time, source)]
    best_arrival = {source: departure_time}
    
    while pq:
        travel_time, arrival_time, vertex = heapq.heappop(pq)
        
        if vertex == target:
            return travel_time
        
        if arrival_time > best_arrival.get(vertex, float('inf')):
            continue
        
        for neighbor, weight_function in graph.get(vertex, []):
            # Weight depends on departure time from current vertex
            edge_weight = weight_function(arrival_time)
            new_arrival = arrival_time + edge_weight
            new_travel_time = travel_time + edge_weight
            
            if new_arrival < best_arrival.get(neighbor, float('inf')):
                best_arrival[neighbor] = new_arrival
                heapq.heappush(pq, (new_travel_time, new_arrival, neighbor))
    
    return float('inf')

# Time Complexity: O((V + E) log V) with binary heap, O(V log V + E) with Fibonacci heap
# Space Complexity: O(V)
```

**Advanced Mathematical Analysis**:

1. **Optimality Conditions**:
   - **Cut Property**: Minimum edge crossing any cut contains MST edge
   - **Greedy Choice**: Always select minimum weight edge that doesn't create cycle

2. **Complexity Improvements**:
   - **Fibonacci Heap**: Achieves O(V log V + E) time complexity
   - **Bucket Implementation**: O(V + E) for integer weights ≤ C
   - **Parallel Algorithms**: Delta-stepping for shared-memory systems

3. **Theoretical Limits**:
   - **Lower Bound**: Ω(V + E) for decision tree model
   - **All-pairs**: O(V³) using repeated Dijkstra vs. O(V³) Floyd-Warshall

**Modern Research Applications**:

1. **Transportation Networks**:
   - GPS navigation systems
   - Public transit routing
   - Traffic-aware path planning

2. **Network Analysis**:
   - Internet routing protocols (OSPF)
   - Social network distances
   - Communication network optimization

3. **Operations Research**:
   - Resource allocation with penalties
   - Supply chain optimization
   - Project scheduling with delays

4. **Machine Learning**:
   - Graph neural networks
   - Manifold learning
   - Clustering algorithms

**Advanced Optimizations**:

1. **Goal-Directed Search**: A* with landmarks and geometric containers
2. **Contraction Hierarchies**: Preprocess graph for faster queries
3. **Hub Labeling**: Distance oracles for massive graphs
4. **Parallel Implementations**: GPU-based and distributed algorithms

#### Bellman-Ford Algorithm

**Mathematical Foundation**: The Bellman-Ford algorithm is based on **dynamic programming** principles and the **principle of relaxation**. Unlike Dijkstra's algorithm, it can handle **negative edge weights** and detect **negative cycles**, making it fundamental in economics, network analysis, and arbitrage detection.

**Theoretical Foundation**:

**Bellman's Principle of Optimality**: An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.

**Key Theorems**:

1. **Convergence Theorem**: If no negative cycles exist, Bellman-Ford converges to optimal solution in at most V-1 iterations
2. **Negative Cycle Detection Theorem**: A negative cycle exists iff any distance decreases in the V-th iteration
3. **Path Optimality**: If shortest path has k edges, optimal distances are found after k iterations

**Mathematical Proof of Correctness**:

**Lemma**: After i iterations, d[v] ≤ shortest path distance using at most i edges.

**Proof by Induction**:
- **Base**: i=0, d[source]=0, all others=∞ (correct for 0-edge paths)
- **Step**: If d[u] is optimal for i-1 edges, then d[v] ≤ d[u] + w(u,v) gives optimal for i edges

```python
import math
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict
import networkx as nx  # For advanced analysis

@dataclass
class BellmanFordResult:
    distances: Dict[int, float]
    predecessors: Dict[int, Optional[int]]
    has_negative_cycle: bool
    negative_cycle_vertices: Set[int]
    iterations_to_convergence: int
    relaxation_count: int

class AdvancedBellmanFord:
    """
    PhD-level implementation of Bellman-Ford with negative cycle analysis,
    economic applications, and advanced optimizations
    """
    
    def __init__(self):
        self.relaxation_count = 0
        self.iteration_count = 0
        self.convergence_history = []
    
    def bellman_ford_complete(self, graph: Dict[int, List[Tuple[int, float]]], 
                             source: int) -> BellmanFordResult:
        """
        Complete Bellman-Ford with negative cycle detection and analysis
        
        Time Complexity: O(VE) 
        Space Complexity: O(V)
        
        Applications:
        - Currency arbitrage detection
        - Network reliability analysis  
        - Game theory (zero-sum games)
        - Resource allocation with penalties
        """
        self._initialize(graph)
        vertices = set(graph.keys()) | set(v for neighbors in graph.values() for v in neighbors)
        low = {}
        articulation_points = set()
        bridges = []
        
        def dfs_ap_bridge(vertex, parent=None):
            children = 0
            self.time += 1
            self.discovery_time[vertex] = self.time
            low[vertex] = self.time
            self.state[vertex] = DFSState.GRAY
            
            for neighbor in graph[vertex]:
                if self.state[neighbor] == DFSState.WHITE:
                    children += 1
                    self.parent[neighbor] = vertex
                    dfs_ap_bridge(neighbor, vertex)
                    
                    # Update low value
                    low[vertex] = min(low[vertex], low[neighbor])
                    
                    # Check for articulation point
                    if parent is None and children > 1:
                        articulation_points.add(vertex)  # Root with multiple children
                    elif parent is not None and low[neighbor] >= self.discovery_time[vertex]:
                        articulation_points.add(vertex)  # Non-root articulation point
                    
                    # Check for bridge
                    if low[neighbor] > self.discovery_time[vertex]:
                        bridges.append((vertex, neighbor))
                        
                elif neighbor != parent:  # Back edge (not to parent)
                    low[vertex] = min(low[vertex], self.discovery_time[neighbor])
            
            self.state[vertex] = DFSState.BLACK
        
        # Handle disconnected components
        for vertex in graph:
            if self.state[vertex] == DFSState.WHITE:
                dfs_ap_bridge(vertex)
        
        return list(articulation_points), bridges
    
    def strongly_connected_components_kosaraju(self, graph):
        """
        Kosaraju's algorithm for strongly connected components
        
        Theorem: SCCs can be found in O(V + E) time using two DFS traversals
        """
        # First DFS to get finish times
        first_dfs = AdvancedDFS()
        result = first_dfs.dfs_complete_analysis(graph, directed=True)
        
        # Create transpose graph
        transpose = self._create_transpose(graph)
        
        # Second DFS in decreasing order of finish times
        vertices_by_finish_time = sorted(
            result['finish_times'].items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        self._initialize(transpose)
        sccs = []
        
        for vertex, _ in vertices_by_finish_time:
            if self.state[vertex] == DFSState.WHITE:
                scc = []
                self._dfs_collect_scc(transpose, vertex, scc)
                sccs.append(scc)
        
        return sccs
    
    def _create_transpose(self, graph):
        """Create transpose graph by reversing all edges"""
        transpose = {vertex: [] for vertex in graph}
        for vertex in graph:
            for neighbor in graph[vertex]:
                transpose[neighbor].append(vertex)
        return transpose
    
    def _dfs_collect_scc(self, graph, vertex, scc):
        """Collect vertices in current SCC"""
        self.state[vertex] = DFSState.BLACK
        scc.append(vertex)
        
        for neighbor in graph[vertex]:
            if self.state[neighbor] == DFSState.WHITE:
                self._dfs_collect_scc(graph, neighbor, scc)
    
    def cycle_detection_directed(self, graph):
        """
        Detect cycles in directed graph using DFS
        
        Theorem: Directed graph has cycle iff DFS produces back edge
        """
        self._initialize(graph)
        
        def has_cycle_util(vertex, path):
            self.state[vertex] = DFSState.GRAY
            path.add(vertex)
            
            for neighbor in graph[vertex]:
                if neighbor in path:  # Back edge found
                    return True, self._extract_cycle(path, neighbor, vertex)
                elif self.state[neighbor] == DFSState.WHITE:
                    has_cycle, cycle = has_cycle_util(neighbor, path)
                    if has_cycle:
                        return True, cycle
            
            self.state[vertex] = DFSState.BLACK
            path.remove(vertex)
            return False, None
        
        for vertex in graph:
            if self.state[vertex] == DFSState.WHITE:
                has_cycle, cycle = has_cycle_util(vertex, set())
                if has_cycle:
                    return True, cycle
        
        return False, None
    
    def _extract_cycle(self, path, start, end):
        """Extract cycle from path when back edge is found"""
        path_list = list(path)
        start_idx = path_list.index(start)
        return path_list[start_idx:] + [start]

# Advanced DFS Applications

def dfs_path_finding_all(graph, start, end, path=None):
    """
    Find all paths between two vertices using DFS
    Exponential time complexity in worst case
    """
    if path is None:
        path = []
    
    path = path + [start]
    
    if start == end:
        return [path]
    
    paths = []
    for neighbor in graph.get(start, []):
        if neighbor not in path:  # Avoid cycles
            new_paths = dfs_path_finding_all(graph, neighbor, end, path)
            paths.extend(new_paths)
    
    return paths

def dfs_maze_solving(maze, start, end):
    """
    Solve maze using DFS with backtracking
    Classical application of DFS in AI and robotics
    """
    rows, cols = len(maze), len(maze[0])
    visited = set()
    path = []
    
    def is_valid(r, c):
        return (0 <= r < rows and 0 <= c < cols and 
                maze[r][c] != 1 and (r, c) not in visited)
    
    def dfs_solve(r, c):
        if (r, c) == end:
            path.append((r, c))
            return True
        
        if not is_valid(r, c):
            return False
        
        visited.add((r, c))
        path.append((r, c))
        
        # Try all four directions
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            if dfs_solve(r + dr, c + dc):
                return True
        
        # Backtrack
        path.pop()
        return False
    
    if dfs_solve(start[0], start[1]):
        return path
    return None

def dfs_tree_serialization(tree_root):
    """
    Serialize binary tree using DFS preorder traversal
    Used in tree persistence and transmission
    """
    def serialize(node):
        if not node:
            return "null"
        return f"{node.val},{serialize(node.left)},{serialize(node.right)}"
    
    return serialize(tree_root)

# Time: O(V + E), Space: O(V)
```

**Advanced Mathematical Analysis**:

1. **Parenthesis Theorem**: For any two vertices u and v, exactly one of following holds:
   - Intervals [d[u], f[u]] and [d[v], f[v]] are disjoint
   - One interval is contained within the other

2. **Cycle Detection Complexity**:
   - **Undirected**: O(V + E) using back edge detection
   - **Directed**: O(V + E) using three-coloring method

3. **SCC Decomposition**: Creates condensation graph (DAG) representing SCCs

**Research Applications**:

1. **Compiler Design**: 
   - Dependency analysis
   - Dead code elimination
   - Register allocation

2. **Artificial Intelligence**:
   - Game tree search
   - Constraint satisfaction
   - Planning algorithms

3. **Network Analysis**:
   - Social influence modeling
   - Information cascade prediction
   - Community detection

4. **Bioinformatics**:
   - Protein folding pathways
   - Metabolic network analysis
   - Evolutionary tree construction

**Modern Optimizations**:

1. **Iterative DFS**: Eliminate recursion using explicit stack
2. **Parallel DFS**: Work-stealing algorithms for parallel exploration
3. **Memory-Efficient DFS**: Streaming algorithms for massive graphs
4. **Approximate DFS**: Randomized algorithms for large-scale networks

### 2. Shortest Path Algorithms

#### Dijkstra's Algorithm

**Mathematical Foundation**: Dijkstra's algorithm is based on the **greedy choice property** and **optimal substructure** for shortest path problems. It maintains the invariant that once a vertex is finalized, its distance represents the true shortest path from the source.

**Formal Correctness Proof**:

**Theorem**: Upon termination, Dijkstra's algorithm has computed shortest paths from source s to all reachable vertices.

**Proof by Induction**:
- **Base Case**: d[s] = 0 is correct
- **Inductive Step**: When vertex u is selected with minimum distance d[u], this distance is optimal
- **Key Insight**: Any shorter path to u would require going through an unprocessed vertex v with d[v] ≥ d[u], contradicting the greedy choice

**Mathematical Prerequisites**:
1. **Non-negative edge weights**: w(u,v) ≥ 0 for all edges (u,v)
2. **Relaxation Property**: d[v] ≤ d[u] + w(u,v) after relaxing edge (u,v)
3. **Triangle Inequality**: δ(s,v) ≤ δ(s,u) + w(u,v) where δ represents true distance

```python
import heapq
import math
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from enum import Enum

class DijkstraVariant(Enum):
    STANDARD = "standard"
    BIDIRECTIONAL = "bidirectional"
    A_STAR = "a_star"
    GOAL_DIRECTED = "goal_directed"

@dataclass
class PathResult:
    distance: float
    path: List[int]
    vertices_processed: int
    edges_relaxed: int
    heap_operations: int

class AdvancedDijkstra:
    """
    PhD-level implementation of Dijkstra's algorithm with advanced optimizations
    and mathematical analysis
    """
    
    def __init__(self):
        self.stats = {
            'vertices_processed': 0,
            'edges_relaxed': 0,
            'heap_operations': 0,
            'relaxation_calls': 0,
            'successful_relaxations': 0
        }
    
    def dijkstra_single_source(self, graph: Dict[int, List[Tuple[int, float]]], 
                              source: int) -> Dict[int, PathResult]:
        """
        Single-source shortest paths with complete analysis
        
        Complexity Analysis:
        - Time: O((V + E) log V) with binary heap
        - Time: O(V log V + E) with Fibonacci heap
        - Space: O(V) for distance array and priority queue
        
        Returns complete path information for all reachable vertices
        """
        n = len(graph)
        
        # Initialize data structures
        distances = {vertex: math.inf for vertex in graph}
        previous = {vertex: None for vertex in graph}
        distances[source] = 0
        
        # Priority queue: (distance, vertex)
        pq = [(0, source)]
        processed = set()
        
        while pq:
            current_dist, current_vertex = heapq.heappop(pq)
            self.stats['heap_operations'] += 1
            
            # Skip if already processed (handles duplicate entries)
            if current_vertex in processed:
                continue
            
            processed.add(current_vertex)
            self.stats['vertices_processed'] += 1
            
            # Early termination optimization for single-target queries
            # if current_vertex == target: break
            
            # Relax all outgoing edges
            for neighbor, weight in graph.get(current_vertex, []):
                self._relax_edge(current_vertex, neighbor, weight, 
                               distances, previous, pq, processed)
        
        # Construct path results
        results = {}
        for vertex in graph:
            if distances[vertex] != math.inf:
                path = self._reconstruct_path(previous, source, vertex)
                results[vertex] = PathResult(
                    distance=distances[vertex],
                    path=path,
                    vertices_processed=self.stats['vertices_processed'],
                    edges_relaxed=self.stats['edges_relaxed'],
                    heap_operations=self.stats['heap_operations']
                )
        
        return results
    
    def _relax_edge(self, u: int, v: int, weight: float, 
                   distances: Dict, previous: Dict, pq: List, processed: Set):
        """
        Edge relaxation with mathematical analysis
        
        Relaxation Condition: d[v] > d[u] + w(u,v)
        """
        self.stats['relaxation_calls'] += 1
        
        if v not in processed:  # Only relax unprocessed vertices
            new_distance = distances[u] + weight
            
            if new_distance < distances[v]:
                distances[v] = new_distance
                previous[v] = u
                heapq.heappush(pq, (new_distance, v))
                self.stats['successful_relaxations'] += 1
                self.stats['heap_operations'] += 1
        
        self.stats['edges_relaxed'] += 1
    
    def dijkstra_bidirectional(self, graph: Dict[int, List[Tuple[int, float]]], 
                              source: int, target: int) -> Optional[PathResult]:
        """
        Bidirectional Dijkstra for single source-target queries
        
        Theorem: Reduces search space from O(b^d) to O(b^(d/2))
        where b is branching factor and d is shortest path length
        """
        if source == target:
            return PathResult(0, [source], 0, 0, 0)
        
        # Forward and backward searches
        forward_queue = deque([source])
        backward_queue = deque([target])
        forward_visited = {source: [source]}
        backward_visited = {target: [target]}
        
        best_distance = math.inf
        meeting_point = None
        
        while forward_queue and backward_queue:
            # Always expand from the search with smaller top element
            if forward_queue[0][0] <= backward_queue[0][0]:
                # Forward expansion
                dist, vertex = heapq.heappop(forward_queue)
                if vertex in forward_visited:
                    continue
                
                forward_visited[vertex] = forward_visited[vertex] + [vertex]
                
                # Check for meeting
                if vertex in backward_visited:
                    total_dist = forward_visited[vertex] + backward_visited[vertex]
                    if total_dist < best_distance:
                        best_distance = total_dist
                        meeting_point = vertex
                
                # Relax forward edges
                for neighbor, weight in graph.get(vertex, []):
                    if neighbor not in forward_visited:
                        new_dist = forward_visited[vertex] + weight
                        if new_dist < forward_visited[neighbor]:
                            forward_visited[neighbor] = new_dist
                            heapq.heappush(forward_queue, (new_dist, neighbor))
            else:
                # Backward expansion
                dist, vertex = heapq.heappop(backward_queue)
                if vertex in backward_visited:
                    continue
                
                backward_visited[vertex] = backward_visited[vertex] + [vertex]
                
                # Check for meeting
                if vertex in forward_visited:
                    total_dist = forward_visited[vertex] + backward_visited[vertex]
                    if total_dist < best_distance:
                        best_distance = total_dist
                        meeting_point = vertex
                
                # Relax backward edges
                for neighbor, weight in graph.get(vertex, []):
                    if neighbor not in backward_visited:
                        new_dist = backward_visited[vertex] + weight
                        if new_dist < backward_visited[neighbor]:
                            backward_visited[neighbor] = new_dist
                            heapq.heappush(backward_queue, (new_dist, neighbor))
            
            # Early termination condition
            if (forward_queue and backward_queue and 
                forward_queue[0][0] + backward_queue[0][0] >= best_distance):
                break
        
        if meeting_point is None:
            return None
        
        # Reconstruct path
        forward_path = self._reconstruct_path(forward_visited, source, meeting_point)
        backward_path = self._reconstruct_path(backward_visited, target, meeting_point)
        full_path = forward_path + backward_path[1:][::-1]
        
        return PathResult(
            distance=best_distance,
            path=full_path,
            vertices_processed=len(forward_visited) + len(backward_visited),
            edges_relaxed=self.stats['edges_relaxed'],
            heap_operations=self.stats['heap_operations']
        )
    
    def dijkstra_with_heuristic(self, graph: Dict[int, List[Tuple[int, float]]], 
                               source: int, target: int, 
                               heuristic: callable) -> Optional[PathResult]:
        """
        A* algorithm: Dijkstra with admissible heuristic
        
        Admissibility Condition: h(v) ≤ δ(v, target) for all vertices v
        Consistency Condition: h(u) ≤ c(u,v) + h(v) for all edges (u,v)
        
        Theorem: A* is optimal if heuristic is admissible
        """
        distances = {vertex: math.inf for vertex in graph}
        previous = {vertex: None for vertex in graph}
        distances[source] = 0
        
        # Priority queue: (f_score, g_score, vertex) where f = g + h
        pq = [(heuristic(source, target), 0, source)]
        processed = set()
        
        while pq:
            f_score, g_score, current = heapq.heappop(pq)
            
            if current in processed:
                continue
            
            if current == target:
                path = self._reconstruct_path(previous, source, target)
                return PathResult(
                    distance=distances[target],
                    path=path,
                    vertices_processed=len(processed),
                    edges_relaxed=self.stats['edges_relaxed'],
                    heap_operations=self.stats['heap_operations']
                )
            
            processed.add(current)
            
            for neighbor, weight in graph.get(current, []):
                if neighbor not in processed:
                    tentative_g = distances[current] + weight
                    
                    if tentative_g < distances[neighbor]:
                        distances[neighbor] = tentative_g
                        previous[neighbor] = current
                        f_score = tentative_g + heuristic(neighbor, target)
                        heapq.heappush(pq, (f_score, tentative_g, neighbor))
        
        return None
    
    def dijkstra_k_shortest_paths(self, graph: Dict[int, List[Tuple[int, float]]], 
                                 source: int, target: int, k: int) -> List[PathResult]:
        """
        Yen's algorithm for K shortest paths
        
        Complexity: O(K * V * (E + V log V))
        """
        # First shortest path using standard Dijkstra
        first_path = self.dijkstra_single_source(graph, source).get(target)
        if not first_path:
            return []
        
        shortest_paths = [first_path]
        candidate_paths = []
        
        for i in range(1, k):
            # Generate candidate paths by deviating from previous shortest paths
            for j in range(len(shortest_paths[i-1].path) - 1):
                spur_node = shortest_paths[i-1].path[j]
                root_path = shortest_paths[i-1].path[:j+1]
                
                # Create modified graph by removing conflicting edges/nodes
                modified_graph = self._create_modified_graph(graph, shortest_paths, root_path, j)
                
                # Find shortest path from spur node to target
                spur_path_result = self.dijkstra_single_source(modified_graph, spur_node).get(target)
                
                if spur_path_result:
                    total_path = root_path[:-1] + spur_path_result.path
                    total_distance = (shortest_paths[i-1].distance - 
                                    self._path_distance(graph, shortest_paths[i-1].path[j:]) +
                                    spur_path_result.distance)
                    
                    candidate_result = PathResult(
                        distance=total_distance,
                        path=total_path,
                        vertices_processed=spur_path_result.vertices_processed,
                        edges_relaxed=spur_path_result.edges_relaxed,
                        heap_operations=spur_path_result.heap_operations
                    )
                    
                    # Add to candidates if not duplicate
                    if not any(c.path == candidate_result.path for c in candidate_paths):
                        candidate_paths.append(candidate_result)
            
            if not candidate_paths:
                break
            
            # Select shortest candidate path
            candidate_paths.sort(key=lambda x: x.distance)
            shortest_paths.append(candidate_paths.pop(0))
        
        return shortest_paths
    
    def _create_reverse_graph(self, graph):
        """Create reverse graph by reversing all edges"""
        reverse = {vertex: [] for vertex in graph}
        for vertex in graph:
            for neighbor, weight in graph[vertex]:
                reverse[neighbor].append((vertex, weight))
        return reverse
    
    def _reconstruct_path(self, previous, source, target):
        """Reconstruct shortest path from previous pointers"""
        path = []
        current = target
        
        while current is not None:
            path.append(current)
            current = previous[current]
        
        return path[::-1] if path and path[-1] == source else []
    
    def _create_modified_graph(self, graph, paths, root_path, deviation_index):
        """Create modified graph for k-shortest paths algorithm"""
        # Implementation details for Yen's algorithm
        # This is a simplified version - full implementation requires careful edge removal
        modified = {vertex: list(edges) for vertex, edges in graph.items()}
        return modified
    
    def _path_distance(self, graph, path):
        """Calculate total distance of a path"""
        if len(path) < 2:
            return 0
        
        total = 0
        for i in range(len(path) - 1):
            current, next_vertex = path[i], path[i+1]
            for neighbor, weight in graph.get(current, []):
                if neighbor == next_vertex:
                    total += weight
                    break
        return total

# Advanced Applications and Variants

def dijkstra_with_turn_restrictions(graph, source, target, turn_costs):
    """
    Dijkstra with turn restrictions for vehicle routing
    State space: (vertex, incoming_edge) instead of just vertex
    """
    # State: (distance, vertex, previous_edge)
    pq = [(0, source, None)]
    distances = {}  # (vertex, prev_edge) -> distance
    distances[(source, None)] = 0
    
    while pq:
        dist, vertex, prev_edge = heapq.heappop(pq)
        
        if (vertex, prev_edge) in distances and dist > distances[(vertex, prev_edge)]:
            continue
        
        if vertex == target:
            return dist
        
        for next_vertex, edge_weight in graph.get(vertex, []):
            turn_cost = turn_costs.get((prev_edge, (vertex, next_vertex)), 0)
            new_distance = dist + edge_weight + turn_cost
            state = (next_vertex, (vertex, next_vertex))
            
            if state not in distances or new_distance < distances[state]:
                distances[state] = new_distance
                heapq.heappush(pq, (new_distance, next_vertex, (vertex, next_vertex)))
    
    return float('inf')

def dijkstra_time_dependent(graph, source, target, departure_time):
    """
    Time-dependent shortest paths where edge weights vary with time
    Applications: traffic-aware routing, public transportation
    """
    # Each edge has function weight(time) instead of constant weight
    pq = [(0, departure_time, source)]
    best_arrival = {source: departure_time}
    
    while pq:
        travel_time, arrival_time, vertex = heapq.heappop(pq)
        
        if vertex == target:
            return travel_time
        
        if arrival_time > best_arrival.get(vertex, float('inf')):
            continue
        
        for neighbor, weight_function in graph.get(vertex, []):
            # Weight depends on departure time from current vertex
            edge_weight = weight_function(arrival_time)
            new_arrival = arrival_time + edge_weight
            new_travel_time = travel_time + edge_weight
            
            if new_arrival < best_arrival.get(neighbor, float('inf')):
                best_arrival[neighbor] = new_arrival
                heapq.heappush(pq, (new_travel_time, new_arrival, neighbor))
    
    return float('inf')

# Time Complexity: O((V + E) log V) with binary heap, O(V log V + E) with Fibonacci heap
# Space Complexity: O(V)
```

**Advanced Mathematical Analysis**:

1. **Optimality Conditions**:
   - **Cut Property**: Minimum edge crossing any cut contains MST edge
   - **Greedy Choice**: Always select minimum weight edge that doesn't create cycle

2. **Complexity Improvements**:
   - **Fibonacci Heap**: Achieves O(V log V + E) time complexity
   - **Bucket Implementation**: O(V + E) for integer weights ≤ C
   - **Parallel Algorithms**: Delta-stepping for shared-memory systems

3. **Theoretical Limits**:
   - **Lower Bound**: Ω(V + E) for decision tree model
   - **All-pairs**: O(V³) using repeated Dijkstra vs. O(V³) Floyd-Warshall

**Modern Research Applications**:

1. **Transportation Networks**:
   - GPS navigation systems
   - Public transit routing
   - Traffic-aware path planning

2. **Network Analysis**:
   - Internet routing protocols (OSPF)
   - Social network distances
   - Communication network optimization

3. **Operations Research**:
   - Resource allocation with penalties
   - Supply chain optimization
   - Project scheduling with delays

4. **Machine Learning**:
   - Graph neural networks
   - Manifold learning
   - Clustering algorithms

**Advanced Optimizations**:

1. **Goal-Directed Search**: A* with landmarks and geometric containers
2. **Contraction Hierarchies**: Preprocess graph for faster queries
3. **Hub Labeling**: Distance oracles for massive graphs
4. **Parallel Implementations**: GPU-based and distributed algorithms

#### Bellman-Ford Algorithm

**Mathematical Foundation**: The Bellman-Ford algorithm is based on **dynamic programming** principles and the **principle of relaxation**. Unlike Dijkstra's algorithm, it can handle **negative edge weights** and detect **negative cycles**, making it fundamental in economics, network analysis, and arbitrage detection.

**Theoretical Foundation**:

**Bellman's Principle of Optimality**: An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.

**Key Theorems**:

1. **Convergence Theorem**: If no negative cycles exist, Bellman-Ford converges to optimal solution in at most V-1 iterations
2. **Negative Cycle Detection Theorem**: A negative cycle exists iff any distance decreases in the V-th iteration
3. **Path Optimality**: If shortest path has k edges, optimal distances are found after k iterations

**Mathematical Proof of Correctness**:

**Lemma**: After i iterations, d[v] ≤ shortest path distance using at most i edges.

**Proof by Induction**:
- **Base**: i=0, d[source]=0, all others=∞ (correct for 0-edge paths)
- **Step**: If d[u] is optimal for i-1 edges, then d[v] ≤ d[u] + w(u,v) gives optimal for i edges

```python
import math
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict
import networkx as nx  # For advanced analysis

@dataclass
class BellmanFordResult:
    distances: Dict[int, float]
    predecessors: Dict[int, Optional[int]]
    has_negative_cycle: bool
    negative_cycle_vertices: Set[int]
    iterations_to_convergence: int
    relaxation_count: int

class AdvancedBellmanFord:
    """
    PhD-level implementation of Bellman-Ford with negative cycle analysis,
    economic applications, and advanced optimizations
    """
    
    def __init__(self):
        self.relaxation_count = 0
        self.iteration_count = 0
        self.convergence_history = []
    
    def bellman_ford_complete(self, graph: Dict[int, List[Tuple[int, float]]], 
                             source: int) -> BellmanFordResult:
        """
        Complete Bellman-Ford with negative cycle detection and analysis
        
        Time Complexity: O(VE) 
        Space Complexity: O(V)
        
        Applications:
        - Currency arbitrage detection
        - Network reliability analysis  
        - Game theory (zero-sum games)
        - Resource allocation with penalties
        """
        self._initialize(graph)
        
        # Initialize distances and predecessors
        distances = {v: math.inf for v in graph}
        predecessors = {v: None for v in graph}
        distances[source] = 0
        
        # Relaxation phase: V-1 iterations
        converged_at = -1
        for i in range(len(graph) - 1):
            self.iteration_count = i + 1
            changed = False
            iteration_relaxations = 0
            
            # Relax all edges
            for u in graph:
                if distances[u] != math.inf:
                    for v in graph[u]:
                        old_distance = distances[v]
                        if self._relax_edge(u, v, graph[u][v], distances, predecessors):
                            changed = True
                            iteration_relaxations += 1
            
            self.convergence_history.append({
                'iteration': i + 1,
                'relaxations': iteration_relaxations,
                'changed': changed,
                'distances_snapshot': distances.copy()
            })
            
            if not changed and converged_at == -1:
                converged_at = i + 1
                # Early termination optimization
                break
        
        # Negative cycle detection phase
        negative_cycle_vertices = set()
        has_negative_cycle = False
        
        # Check for negative cycles by attempting one more relaxation
        for u in graph:
            if distances[u] != math.inf:
                for v in graph[u]:
                    if distances[u] + graph[u][v] < distances[v]:
                        has_negative_cycle = True
                        negative_cycle_vertices.add(v)
        
        execution_time = time.time() - start_time
        
        # Reconstruct actual flow on original edges
        final_flow = {}
        for (u, v), original_cap in capacity.items():
            final_flow[(u, v)] = original_cap - residual[u][v]
        
        return {
            'max_flow_value': max_flow_value,
            'min_cost': total_cost,
            'cost_per_unit_flow': total_cost / max_flow_value if max_flow_value > 0 else 0,
            'improvement_paths': flow_paths,
            'improvement_iterations': improvement_iterations,
            'execution_time': execution_time
        }
    
    def _verify_flow(self, capacity: Dict[Tuple[int,int], int], 
                    flow: Dict[Tuple[int,int], int], 
                    source: int, sink: int) -> Dict:
        """Verify flow satisfies all constraints"""
        verification = {
            'capacity_constraints': True,
            'flow_conservation': True,
            'violations': []
        }
        
        # Check capacity constraints
        for edge, flow_val in flow.items():
            if flow_val < 0 or flow_val > capacity[edge]:
                verification['capacity_constraints'] = False
                verification['violations'].append({
                    'type': 'capacity',
                    'edge': edge,
                    'flow': flow_val,
                    'capacity': capacity[edge]
                })
        
        # Check flow conservation
        vertices = set()
        for u, v in capacity.keys():
            vertices.update([u, v])
        
        for vertex in vertices:
            if vertex == source or vertex == sink:
                continue
            
            inflow = sum(flow.get((u, vertex), 0) for u in vertices if (u, vertex) in flow)
            outflow = sum(flow.get((vertex, v), 0) for v in vertices if (vertex, v) in flow)
            
            if abs(inflow - outflow) > 1e-9:
                verification['flow_conservation'] = False
                verification['violations'].append({
                    'type': 'conservation',
                    'vertex': vertex,
                    'inflow': inflow,
                    'outflow': outflow,
                    'difference': inflow - outflow
                })
        
        return verification
    
    def _analyze_dinic_efficiency(self, phase_analysis: List[Dict]) -> Dict:
        """Analyze efficiency of Dinic's algorithm"""
        if not phase_analysis:
            return {}
        
        total_phases = len(phase_analysis)
        avg_phase_time = sum(p['phase_time'] for p in phase_analysis) / total_phases
        max_distance = max(p['sink_distance'] for p in phase_analysis)
        
        flow_distribution = [p['phase_flow'] for p in phase_analysis]
        
        return {
            'total_phases': total_phases,
            'max_sink_distance': max_distance,
            'average_phase_time': avg_phase_time,
            'flow_distribution': flow_distribution,
            'distance_progression': [p['sink_distance'] for p in phase_analysis],
            'efficiency_ratio': total_phases / max_distance if max_distance > 0 else 1
        }
    
    def _analyze_height_function(self, height: Dict, vertices: Set) -> Dict:
        """Analyze height function in push-relabel"""
        height_distribution = defaultdict(int)
        for h in height.values():
            height_distribution[h] += 1
        
        max_height = max(height.values())
        min_height = min(height.values())
        
        return {
            'max_height': max_height,
            'min_height': min_height,
            'height_range': max_height - min_height,
            'height_distribution': dict(height_distribution),
            'average_height': sum(height.values()) / len(vertices)
        }
```

### 2. Graph Coloring

#### Greedy Coloring Algorithm

```python
def graph_coloring(graph):
    colors = {}
    
    for vertex in graph:
        # Find colors used by neighbors
        used_colors = set()
        for neighbor in graph[vertex]:
            if neighbor in colors:
                used_colors.add(colors[neighbor])
        
        # Assign smallest available color
        color = 0
        while color in used_colors:
            color += 1
        colors[vertex] = color
    
    return colors
```

### 3. Eulerian Paths and Circuits

```python
def find_eulerian_path(graph):
    def count_odd_degree_vertices():
        odd_vertices = []
        for vertex in graph:
            if len(graph[vertex]) % 2 == 1:
                odd_vertices.append(vertex)
        return odd_vertices
    
    def hierholzer_algorithm(start_vertex):
        # Create a copy of the graph for modification
        temp_graph = {v: list(neighbors) for v, neighbors in graph.items()}
        stack = [start_vertex]
        path = []
        
        while stack:
            vertex = stack[-1]
            if temp_graph[vertex]:
                next_vertex = temp_graph[vertex].pop()
                temp_graph[next_vertex].remove(vertex)
                stack.append(next_vertex)
            else:
                path.append(stack.pop())
        
        return path[::-1]
    
    odd_vertices = count_odd_degree_vertices()
    
    if len(odd_vertices) == 0:
        # Eulerian circuit exists
        start = next(iter(graph))
        return hierholzer_algorithm(start)
    elif len(odd_vertices) == 2:
        # Eulerian path exists
        return hierholzer_algorithm(odd_vertices[0])
    else:
        # No Eulerian path or circuit
        return None
```

### 4. Hamiltonian Path

```python
def hamiltonian_path(graph, start, path=[]):
    path = path + [start]
    
    if len(path) == len(graph):
        return path
    
    for neighbor in graph[start]:
        if neighbor not in path:
            result = hamiltonian_path(graph, neighbor, path)
            if result:
                return result
    
    return None
```

---

## Implementation Patterns

### 1. Graph Class Design

```python
class Graph:
    def __init__(self, directed=False):
        self.directed = directed
        self.adjacency_list = {}
    
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
    
    def add_edge(self, u, v, weight=1):
        self.add_vertex(u)
        self.add_vertex(v)
        
        self.adjacency_list[u].append((v, weight))
        if not self.directed:
            self.adjacency_list[v].append((u, weight))
    
    def remove_edge(self, u, v):
        self.adjacency_list[u] = [(vertex, weight) for vertex, weight in self.adjacency_list[u] if vertex != v]
        if not self.directed:
            self.adjacency_list[v] = [(vertex, weight) for vertex, weight in self.adjacency_list[v] if vertex != u]
    
    def get_neighbors(self, vertex):
        return self.adjacency_list.get(vertex, [])
    
    def has_edge(self, u, v):
        return any(neighbor == v for neighbor, _ in self.get_neighbors(u))
    
    def get_vertices(self):
        return list(self.adjacency_list.keys())
    
    def get_edges(self):
        edges = []
        for vertex in self.adjacency_list:
            for neighbor, weight in self.adjacency_list[vertex]:
                if self.directed or vertex <= neighbor:  # Avoid duplicates in undirected
                    edges.append((vertex, neighbor, weight))
        return edges
    
    def __str__(self):
        return str(self.adjacency_list)
```

### 2. Union-Find (Disjoint Set) Implementation

```python
class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
        self.components = len(vertices)
    
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
    
    def component_count(self):
        return self.components
```

### 3. Priority Queue for Graph Algorithms

```python
import heapq

class PriorityQueue:
    def __init__(self):
        self.heap = []
        self.index = 0
    
    def push(self, priority, item):
        heapq.heappush(self.heap, (priority, self.index, item))
        self.index += 1
    
    def pop(self):
        return heapq.heappop(self.heap)[2]
    
    def empty(self):
        return len(self.heap) == 0
```

---

## Interview Problems & Patterns

### Pattern 1: Graph Traversal

#### Problem: Number of Islands

```python
def num_islands(grid):
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    islands = 0
    
    def dfs(r, c):
        if (r, c) in visited or r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        
        visited.add((r, c))
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            dfs(r + dr, c + dc)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                dfs(r, c)
                islands += 1
    
    return islands
```

#### Problem: Clone Graph

```python
def clone_graph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
```

### Pattern 2: Shortest Path

#### Problem: Word Ladder

```python
from collections import deque

def ladder_length(begin_word, end_word, word_list):
    if end_word not in word_list:
        return 0
    
    word_set = set(word_list)
    queue = deque([(begin_word, 1)])
    visited = {begin_word}
    
    while queue:
        word, level = queue.popleft()
        
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                
                if next_word in word_set and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, level + 1))
    
    return 0
```

### Pattern 3: Cycle Detection

#### Problem: Course Schedule

```python
def can_finish(num_courses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # 0: unvisited, 1: visiting, 2: visited
    states = [0] * num_courses
    
    def has_cycle(course):
        if states[course] == 1:  # Currently visiting - cycle detected
            return True
        if states[course] == 2:  # Already processed
            return False
        
        states[course] = 1  # Mark as visiting
        
        for next_course in graph[course]:
            if has_cycle(next_course):
                return True
        
        states[course] = 2  # Mark as visited
        return False
    
    for course in range(num_courses):
        if has_cycle(course):
            return False
    
    return True
```

### Pattern 4: Union-Find

#### Problem: Number of Connected Components

```python
def count_components(n, edges):
    uf = UnionFind(range(n))
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.component_count()
```

### Pattern 5: Graph Construction

#### Problem: Reconstruct Itinerary

```python
from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    
    # Build graph and sort destinations
    for src, dst in tickets:
        graph[src].append(dst)
    
    for src in graph:
        graph[src].sort(reverse=True)  # Sort in reverse for pop()
    
    stack = ['JFK']
    itinerary = []
    
    while stack:
        while graph[stack[-1]]:
            stack.append(graph[stack[-1]].pop())
        itinerary.append(stack.pop())
    
    return itinerary[::-1]
```

---

## Optimization Techniques

### 1. Memoization in Graph Problems

```python
def longest_increasing_path(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    memo = {}
    
    def dfs(r, c):
        if (r, c) in memo:
            return memo[(r, c)]
        
        max_length = 1
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                max_length = max(max_length, 1 + dfs(nr, nc))
        
        memo[(r, c)] = max_length
        return max_length
    
    result = 0
    for r in range(rows):
        for c in range(cols):
            result = max(result, dfs(r, c))
    
    return result
```

### 2. Bidirectional Search

```python
from collections import deque

def bidirectional_search(graph, start, end):
    if start == end:
        return [start]
    
    front_queue = deque([start])
    back_queue = deque([end])
    front_visited = {start: [start]}
    back_visited = {end: [end]}
    
    while front_queue and back_queue:
        # Expand from the smaller frontier
        if len(front_queue) <= len(back_queue):
            current = front_queue.popleft()
            for neighbor in graph[current]:
                if neighbor in back_visited:
                    return front_visited[current] + back_visited[neighbor][::-1]
                if neighbor not in front_visited:
                    front_visited[neighbor] = front_visited[current] + [neighbor]
                    front_queue.append(neighbor)
        else:
            current = back_queue.popleft()
            for neighbor in graph[current]:
                if neighbor in front_visited:
                    return front_visited[neighbor] + back_visited[current][::-1]
                if neighbor not in back_visited:
                    back_visited[neighbor] = back_visited[current] + [neighbor]
                    back_queue.append(neighbor)
    
    return None
```

### 3. A* Search Algorithm

```python
import heapq

def a_star_search(graph, start, goal, heuristic):
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    
    while open_set:
        f_score, g_score, current = heapq.heappop(open_set)
        
        if current in came_from:
            continue
        
        if current == goal:
            path = reconstruct_path(came_from, start, goal)
            return path
        
        for neighbor, weight in graph.get(current, []):
            tentative_g_score = g_score[current] + weight
            
            if tentative_g_score < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score = tentative_g_score + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score, tentative_g_score, neighbor))
    
    return None
```

---

## Advanced Topics

### 1. Graph Databases

#### Neo4j Cypher Query Examples

```cypher
// Create nodes and relationships
CREATE (alice:Person {name: 'Alice', age: 30})
CREATE (bob:Person {name: 'Bob', age: 25})
CREATE (alice)-[:KNOWS]->(bob)

// Find shortest path
MATCH (start:Person {name: 'Alice'}), (end:Person {name: 'Bob'})
CALL algo.shortestPath.stream(start, end, 'weight')
YIELD nodeId, cost
RETURN nodeId, cost

// Community detection
CALL algo.louvain.stream('Person', 'KNOWS')
YIELD nodeId, community
RETURN nodeId, community
```

### 2. Social Network Analysis

#### PageRank Algorithm

```python
def pagerank(graph, damping=0.85, max_iterations=100, tolerance=1e-6):
    vertices = list(graph.keys())
    n = len(vertices)
    
    # Initialize PageRank values
    pr = {v: 1.0 / n for v in vertices}
    
    for _ in range(max_iterations):
        new_pr = {}
        
        for vertex in vertices:
            new_pr[vertex] = (1 - damping) / n
            
            for neighbor in vertices:
                if vertex in graph[neighbor]:
                    out_degree = len(graph[neighbor])
                    new_pr[vertex] += damping * pr[neighbor] / out_degree
        
        # Check convergence
        diff = sum(abs(new_pr[v] - pr[v]) for v in vertices)
        if diff < tolerance:
            break
        
        pr = new_pr
    
    return pr
```

#### Betweenness Centrality

```python
def betweenness_centrality(graph):
    centrality = {v: 0.0 for v in graph}
    
    for s in graph:
        # Single-source shortest paths
        stack = []
        paths = {v: [] for v in graph}
        sigma = {v: 0.0 for v in graph}
        sigma[s] = 1.0
        distance = {v: -1 for v in graph}
        distance[s] = 0
        queue = [s]
        
        while queue:
            v = queue.pop(0)
            stack.append(v)
            
            for w in graph[v]:
                if distance[w] < 0:
                    queue.append(w)
                    distance[w] = distance[v] + 1
                
                if distance[w] == distance[v] + 1:
                    sigma[w] += sigma[v]
                    paths[w].append(v)
        
        # Accumulation
        delta = {v: 0.0 for v in graph}
        while stack:
            w = stack.pop()
            for v in paths[w]:
                delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w])
            if w != s:
                centrality[w] += delta[w]
    
    return centrality
```

### 3. Machine Learning on Graphs

#### Graph Neural Network Concepts

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional
import numpy as np

class GraphConvolutionalLayer(nn.Module):
    """
    Graph Convolutional Layer for learning graph representations
    
    Mathematical Foundation:
    H^(l+1) = σ(D^(-1/2) A D^(-1/2) H^(l) W^(l))
    
    Where:
    - A: Adjacency matrix with self-loops
    - D: Degree matrix  
    - H^(l): Node features at layer l
    - W^(l): Learnable weight matrix
    - σ: Activation function
    """
    
    def __init__(self, in_features: int, out_features: int):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.weight = nn.Parameter(torch.FloatTensor(in_features, out_features))
        self.bias = nn.Parameter(torch.FloatTensor(out_features))
        self.reset_parameters()
    
    def reset_parameters(self):
        nn.init.xavier_uniform_(self.weight)
        nn.init.zeros_(self.bias)
    
    def forward(self, features: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        """Forward pass through GCN layer"""
        # Add self-loops to adjacency matrix
        adjacency = adjacency + torch.eye(adjacency.size(0))
        
        # Compute degree matrix
        degree = torch.sum(adjacency, dim=1)
        degree_inv_sqrt = torch.pow(degree, -0.5)
        degree_inv_sqrt[degree_inv_sqrt == float('inf')] = 0
        
        # Normalize adjacency matrix
        degree_matrix = torch.diag(degree_inv_sqrt)
        normalized_adj = torch.mm(torch.mm(degree_matrix, adjacency), degree_matrix)
        
        # Apply graph convolution
        support = torch.mm(features, self.weight)
        output = torch.mm(normalized_adj, support) + self.bias
        
        return output

class GraphNeuralNetworkPathPredictor(nn.Module):
    """
    GNN for predicting optimal paths in graphs
    
    Applications:
    - Learning shortest path heuristics
    - Predicting bottleneck edges
    - Graph clustering optimization
    """
    
    def __init__(self, node_features: int, hidden_dim: int, num_layers: int):
        super().__init__()
        
        self.num_layers = num_layers
        self.layers = nn.ModuleList()
        
        # Input layer
        self.layers.append(GraphConvolutionalLayer(node_features, hidden_dim))
        
        # Hidden layers
        for _ in range(num_layers - 2):
            self.layers.append(GraphConvolutionalLayer(hidden_dim, hidden_dim))
        
        # Output layer
        self.layers.append(GraphConvolutionalLayer(hidden_dim, 1))
        
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, node_features: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        """Predict node importance scores for path finding"""
        x = node_features
        
        for i, layer in enumerate(self.layers[:-1]):
            x = F.relu(layer(x, adjacency))
            x = self.dropout(x)
        
        # Final layer without activation
        x = self.layers[-1](x, adjacency)
        
        return torch.sigmoid(x)

def train_gnn_shortest_path_predictor():
    """
    Train GNN to learn shortest path patterns
    
    This demonstrates how modern ML can enhance classical algorithms
    """
    # Generate synthetic graph data
    num_graphs = 1000
    training_data = []
    
    for _ in range(num_graphs):
        # Generate random graph
        n_nodes = np.random.randint(10, 50)
        adjacency = generate_random_graph_matrix(n_nodes)
        
        # Compute shortest paths using Floyd-Warshall
        distances = floyd_warshall_numpy(adjacency)
        
        # Create node features (degree, clustering coefficient, etc.)
        node_features = compute_graph_features(adjacency)
        
        # Label: 1 if node is on many shortest paths, 0 otherwise
        centrality_scores = compute_betweenness_centrality(distances)
        labels = (centrality_scores > np.median(centrality_scores)).astype(float)
        
        training_data.append({
            'adjacency': adjacency,
            'features': node_features,
            'labels': labels
        })
    
    # Initialize and train model
    model = GraphNeuralNetworkPathPredictor(
        node_features=node_features.shape[1],
        hidden_dim=64,
        num_layers=3
    )
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.BCELoss()
    
    # Training loop
    for epoch in range(100):
        total_loss = 0
        
        for data in training_data:
            optimizer.zero_grad()
            
            # Convert to tensors
            features = torch.FloatTensor(data['features'])
            adjacency = torch.FloatTensor(data['adjacency'])
            labels = torch.FloatTensor(data['labels']).unsqueeze(1)
            
            # Forward pass
            predictions = model(features, adjacency)
            loss = criterion(predictions, labels)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        if epoch % 20 == 0:
            print(f"Epoch {epoch}, Average Loss: {total_loss / len(training_data):.4f}")
    
    return model

def generate_random_graph_matrix(n: int) -> np.ndarray:
    """Generate random symmetric adjacency matrix"""
    adjacency = np.random.random((n, n)) < 0.3
    adjacency = adjacency | adjacency.T
    np.fill_diagonal(adjacency, 0)
    return adjacency.astype(float)

def compute_graph_features(adjacency: np.ndarray) -> np.ndarray:
    """Compute node-level graph features"""
    n = adjacency.shape[0]
    features = []
    
    for i in range(n):
        # Degree
        degree = np.sum(adjacency[i])
        
        # Clustering coefficient
        neighbors = np.where(adjacency[i])[0]
        if len(neighbors) <= 1:
            clustering = 0
        else:
            possible_edges = len(neighbors) * (len(neighbors) - 1) / 2
            actual_edges = 0
            for j in neighbors:
                for k in neighbors:
                    if j < k and adjacency[j, k]:
                        actual_edges += 1
            clustering = actual_edges / possible_edges if possible_edges > 0 else 0
        
        # Eigenvalue centrality approximation
        eigenvalue_centrality = np.sum(adjacency[i] * np.sum(adjacency, axis=0))
        
        features.append([degree, clustering, eigenvalue_centrality])
    
    return np.array(features)
```

### Quantum Graph Algorithms: Future Directions

#### Quantum Walk-Based Graph Algorithms

```python
import numpy as np
from typing import Complex, List, Tuple
import cmath

class QuantumGraphWalk:
    """
    Quantum walk algorithms for graph problems
    
    Theoretical Advantages:
    - Quadratic speedup for certain graph problems
    - Enhanced connectivity detection
    - Novel centrality measures
    
    Quantum Walk on Graph:
    |ψ(t+1)⟩ = U|ψ(t)⟩
    where U is the quantum walk operator
    """
    
    def __init__(self, adjacency_matrix: np.ndarray):
        self.adjacency = adjacency_matrix
        self.n_vertices = adjacency_matrix.shape[0]
        self.quantum_state = self._initialize_quantum_state()
    
    def _initialize_quantum_state(self) -> np.ndarray:
        """Initialize uniform superposition state"""
        state = np.ones(self.n_vertices, dtype=complex) / np.sqrt(self.n_vertices)
        return state
    
    def discrete_quantum_walk_step(self) -> np.ndarray:
        """
        Perform one step of discrete quantum walk
        
        Uses coin operator and shift operator:
        U = S(C ⊗ I)
        """
        # Hadamard coin operator
        coin = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        
        # Create extended Hilbert space (position ⊗ coin)
        extended_state = np.zeros(2 * self.n_vertices, dtype=complex)
        
        # Initialize with current state
        for i in range(self.n_vertices):
            extended_state[2*i] = self.quantum_state[i] / np.sqrt(2)
            extended_state[2*i + 1] = self.quantum_state[i] / np.sqrt(2)
        
        # Apply coin operator
        for i in range(self.n_vertices):
            local_state = extended_state[2*i:2*i+2]
            extended_state[2*i:2*i+2] = coin @ local_state
        
        # Apply shift operator based on graph structure
        new_extended_state = np.zeros_like(extended_state)
        
        for i in range(self.n_vertices):
            neighbors = np.where(self.adjacency[i])[0]
            degree = len(neighbors)
            
            if degree > 0:
                # Distribute amplitude to neighbors
                for j in neighbors:
                    new_extended_state[2*j] += extended_state[2*i] / np.sqrt(degree)
                    new_extended_state[2*j + 1] += extended_state[2*i + 1] / np.sqrt(degree)
        
        # Project back to position space
        new_state = np.zeros(self.n_vertices, dtype=complex)
        for i in range(self.n_vertices):
            new_state[i] = extended_state[2*i] + extended_state[2*i + 1]
        
        self.quantum_state = new_state / np.linalg.norm(new_state)
        return self.quantum_state
    
    def quantum_hitting_time(self, target_vertex: int, max_steps: int = 1000) -> Dict:
        """
        Estimate hitting time using quantum walk
        
        Quantum hitting time can be quadratically faster than classical
        """
        hitting_probabilities = []
        
        for step in range(max_steps):
            self.discrete_quantum_walk_step()
            
            # Probability of being at target vertex
            prob = abs(self.quantum_state[target_vertex])**2
            hitting_probabilities.append(prob)
            
            # Check if we've "hit" the target with high probability
            if prob > 0.9:
                return {
                    'hitting_time': step,
                    'final_probability': prob,
                    'probability_evolution': hitting_probabilities
                }
        
        return {
            'hitting_time': max_steps,
            'final_probability': hitting_probabilities[-1],
            'probability_evolution': hitting_probabilities
        }
    
def quantum_graph_connectivity(adjacency: np.ndarray) -> Dict:
    """
    Use quantum walk to detect graph connectivity
    
    Theoretical basis: Quantum walk spreads uniformly over connected components
    """
    qwalk = QuantumGraphWalk(adjacency)
    n_steps = 100
    
    # Run quantum walk
    state_evolution = []
    for _ in range(n_steps):
        state = qwalk.discrete_quantum_walk_step()
        state_evolution.append(abs(state)**2)
    
    # Analyze final distribution
    final_distribution = state_evolution[-1]
    
    # Connected components should have similar probabilities
    variance = np.var(final_distribution)
    
    return {
        'connectivity_measure': 1 / (1 + variance),
        'final_distribution': final_distribution,
        'state_evolution': state_evolution
    }
```

### Real-World Graph Algorithm Applications

#### Social Network Analysis and Recommendation Systems

```python
class SocialNetworkAnalyzer:
    """
    Advanced social network analysis using multiple graph algorithms
    
    Combines:
    - Community detection
    - Influence propagation
    - Link prediction
    - Recommendation algorithms
    """
    
    def __init__(self, social_graph: Dict[int, List[int]], 
                 user_features: Dict[int, List[float]]):
        self.graph = social_graph
        self.user_features = user_features
        self.algorithms = AdvancedGraphAlgorithms()
    
    def detect_communities_multilevel(self) -> Dict:
        """
        Multi-level community detection using modularity optimization
        
        Combines:
        - Louvain algorithm for modularity maximization
        - Graph neural networks for feature-based clustering
        - Temporal community evolution tracking
        """
        # Convert to weighted graph based on interaction strength
        weighted_graph = self._compute_interaction_weights()
        
        # Apply Louvain algorithm
        communities = self._louvain_community_detection(weighted_graph)
        
        # Refine using graph neural networks
        refined_communities = self._gnn_community_refinement(communities)
        
        # Analyze community structure
        analysis = self._analyze_community_structure(refined_communities)
        
        return {
            'communities': refined_communities,
            'modularity_score': analysis['modularity'],
            'community_sizes': analysis['sizes'],
            'inter_community_edges': analysis['inter_edges'],
            'community_features': analysis['features']
        }
    
    def influence_propagation_simulation(self, seed_users: List[int], 
                                       propagation_model: str = 'IC') -> Dict:
        """
        Simulate influence propagation in social network
        
        Models:
        - Independent Cascade (IC)
        - Linear Threshold (LT)
        - Competitive influence
        """
        if propagation_model == 'IC':
            return self._independent_cascade(seed_users)
        elif propagation_model == 'LT':
            return self._linear_threshold(seed_users)
        else:
            raise ValueError(f"Unknown propagation model: {propagation_model}")
    
    def _independent_cascade(self, seed_users: List[int]) -> Dict:
        """Independent Cascade model for influence propagation"""
        activated = set(seed_users)
        newly_activated = set(seed_users)
        propagation_steps = []
        
        step = 0
        while newly_activated:
            step += 1
            next_activated = set()
            
            for user in newly_activated:
                if user in self.graph:
                    for neighbor in self.graph[user]:
                        if neighbor not in activated:
                            # Probability of activation based on edge weight
                            activation_prob = self._compute_activation_probability(user, neighbor)
                            if np.random.random() < activation_prob:
                                next_activated.add(neighbor)
            
            newly_activated = next_activated
            activated.update(newly_activated)
            
            propagation_steps.append({
                'step': step,
                'newly_activated': list(newly_activated),
                'total_activated': len(activated)
            })
        
        return {
            'final_activated': list(activated),
            'total_influenced': len(activated),
            'propagation_steps': propagation_steps,
            'influence_spread': len(activated) / len(self.user_features)
        }
    
    def personalized_recommendations(self, user_id: int, num_recommendations: int = 10) -> Dict:
        """
        Generate personalized recommendations using graph algorithms
        
        Combines:
        - Collaborative filtering via random walks
        - Content-based filtering using user features
        - Community-based recommendations
        """
        # Random walk based collaborative filtering
        collab_scores = self._random_walk_recommendations(user_id)
        
        # Content-based recommendations
        content_scores = self._content_based_recommendations(user_id)
        
        # Community-based recommendations
        community_scores = self._community_based_recommendations(user_id)
        
        # Combine scores using weighted ensemble
        final_scores = {}
        all_candidates = set(collab_scores.keys()) | set(content_scores.keys()) | set(community_scores.keys())
        
        for candidate in all_candidates:
            collab_score = collab_scores.get(candidate, 0)
            content_score = content_scores.get(candidate, 0)
            community_score = community_scores.get(candidate, 0)
            
            # Weighted combination
            final_scores[candidate] = (
                0.5 * collab_score + 
                0.3 * content_score + 
                0.2 * community_score
            )
        
        # Sort and return top recommendations
        recommendations = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:num_recommendations]
        
        return {
            'recommendations': recommendations,
            'collaborative_scores': collab_scores,
            'content_scores': content_scores,
            'community_scores': community_scores,
            'explanation': self._generate_recommendation_explanations(user_id, recommendations)
        }
    
    def _random_walk_recommendations(self, user_id: int, walk_length: int = 100, num_walks: int = 1000) -> Dict[int, float]:
        """Generate recommendations using random walks"""
        visit_counts = defaultdict(int)
        
        for _ in range(num_walks):
            current = user_id
            for _ in range(walk_length):
                if current in self.graph and self.graph[current]:
                    current = np.random.choice(self.graph[current])
                    visit_counts[current] += 1
                else:
                    break
        
        # Convert to probabilities
        total_visits = sum(visit_counts.values())
        if total_visits == 0:
            return {}
        
        recommendations = {user: count / total_visits for user, count in visit_counts.items()}
        
        # Remove already connected users
        if user_id in self.graph:
            for connected_user in self.graph[user_id]:
                recommendations.pop(connected_user, None)
        
        return recommendations
```

### Distributed Graph Algorithm Implementations

#### Apache Spark GraphX Integration

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import networkx as nx

class DistributedGraphAlgorithms:
    """
    Distributed graph algorithms using Apache Spark
    
    Scalable implementations for:
    - PageRank on billion-node graphs
    - Connected components at scale
    - Triangle counting
    - Graph neural network training
    """
    
    def __init__(self, spark_session: SparkSession):
        self.spark = spark_session
    
    def distributed_pagerank(self, edges_df, damping_factor: float = 0.85, 
                           max_iterations: int = 20, tolerance: float = 1e-6) -> Dict:
        """
        Distributed PageRank implementation
        
        Handles graphs with billions of edges using:
        - Vertex-centric computation model
        - Efficient message passing
        - Dynamic convergence detection
        """
        start_time = time.time()
        
        # Initialize vertex scores
        vertices = edges_df.select("src").union(edges_df.select("dst")).distinct()
        vertex_count = vertices.count()
        
        # Create initial PageRank values
        pagerank_df = vertices.withColumn("pagerank", lit(1.0 / vertex_count))
        pagerank_df = pagerank_df.withColumnRenamed("src", "vertex_id")
        
        # Compute out-degrees
        out_degrees = edges_df.groupBy("src").agg(count("dst").alias("out_degree"))
        
        convergence_history = []
        
        for iteration in range(max_iterations):
            iteration_start = time.time()
            
            # Join PageRank with out-degrees
            vertex_info = pagerank_df.join(out_degrees, pagerank_df.vertex_id == out_degrees.src, "left")
            vertex_info = vertex_info.fillna({"out_degree": 0})
            
            # Compute contributions to send
            contributions = vertex_info.join(edges_df, vertex_info.vertex_id == edges_df.src, "left")
            contributions = contributions.select(
                col("dst").alias("vertex_id"),
                (col("pagerank") / col("out_degree")).alias("contribution")
            )
            
            # Sum contributions for each vertex
            new_pagerank = contributions.groupBy("vertex_id").agg(
                sum("contribution").alias("total_contribution")
            )
            
            # Apply PageRank formula
            new_pagerank = new_pagerank.withColumn(
                "new_pagerank",
                lit((1 - damping_factor) / vertex_count) + 
                lit(damping_factor) * col("total_contribution")
            )
            
            # Check convergence
            convergence_check = pagerank_df.join(new_pagerank, "vertex_id").select(
                abs(col("pagerank") - col("new_pagerank")).alias("diff")
            )
            
            max_diff = convergence_check.agg(max("diff")).collect()[0][0]
            convergence_history.append({
                'iteration': iteration,
                'max_change': max_diff,
                'iteration_time': time.time() - iteration_start
            })
            
            if max_diff < tolerance:
                print(f"PageRank converged after {iteration + 1} iterations")
                break
            
            # Update PageRank values
            pagerank_df = new_pagerank.select("vertex_id", col("new_pagerank").alias("pagerank"))
        
        execution_time = time.time() - start_time
        
        # Collect top vertices
        top_vertices = pagerank_df.orderBy(col("pagerank").desc()).limit(100).collect()
        
        return {
            'top_vertices': [(row.vertex_id, row.pagerank) for row in top_vertices],
            'iterations_to_convergence': len(convergence_history),
            'convergence_history': convergence_history,
            'total_execution_time': execution_time,
            'vertex_count': vertex_count
        }
    
    def distributed_connected_components(self, edges_df) -> Dict:
        """
        Find connected components in distributed graph
        
        Uses label propagation algorithm optimized for Spark
        """
        start_time = time.time()
        
        # Initialize each vertex with its own component ID
        vertices = edges_df.select("src").union(edges_df.select("dst")).distinct()
        components_df = vertices.withColumn("component_id", col("src"))
        components_df = components_df.withColumnRenamed("src", "vertex_id")
        
        max_iterations = 100
        
        for iteration in range(max_iterations):
            # Propagate minimum component ID
            propagated = components_df.alias("c1").join(
                edges_df, col("c1.vertex_id") == col("src")
            ).join(
                components_df.alias("c2"), col("dst") == col("c2.vertex_id")
            ).select(
                col("c1.vertex_id"),
                least(col("c1.component_id"), col("c2.component_id")).alias("new_component_id")
            )
            
            # Aggregate minimum for each vertex
            new_components = propagated.groupBy("vertex_id").agg(
                min("new_component_id").alias("component_id")
            )
            
            # Check for convergence
            changes = components_df.join(new_components, "vertex_id").select(
                (col("component_id") != col("new_component_id")).alias("changed")
            )
            
            change_count = changes.filter(col("changed")).count()
            
            if change_count == 0:
                print(f"Connected components converged after {iteration + 1} iterations")
                break
            
            components_df = new_components
        
        execution_time = time.time() - start_time
        
        # Analyze component sizes
        component_sizes = components_df.groupBy("component_id").agg(
            count("vertex_id").alias("size")
        ).orderBy(col("size").desc())
        
        size_distribution = component_sizes.collect()
        
        return {
            'num_components': len(size_distribution),
            'largest_component_size': size_distribution[0].size if size_distribution else 0,
            'component_size_distribution': [(row.component_id, row.size) for row in size_distribution[:20]],
            'execution_time': execution_time,
            'iterations_to_convergence': iteration + 1
        }

def create_distributed_graph_processing_pipeline():
    """
    Create end-to-end distributed graph processing pipeline
    
    Demonstrates:
    - Data ingestion from multiple sources
    - Graph preprocessing and cleaning
    - Multiple algorithm execution
    - Result aggregation and visualization
    """
    spark = SparkSession.builder \
        .appName("DistributedGraphProcessing") \
        .config("spark.sql.adaptive.enabled", "true") \
        .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
        .getOrCreate()
    
    algorithms = DistributedGraphAlgorithms(spark)
    
    # Example pipeline configuration
    pipeline_config = {
        'input_sources': [
            {'type': 'social_network', 'path': 'hdfs://social_edges.parquet'},
            {'type': 'collaboration', 'path': 'hdfs://collaboration_edges.parquet'}
        ],
        'algorithms': ['pagerank', 'connected_components', 'triangle_counting'],
        'output_format': 'parquet',
        'optimization_level': 'high'
    }
    
    return {
        'spark_session': spark,
        'algorithms': algorithms,
        'pipeline_config': pipeline_config
    }
```

---

## Modern Graph Algorithm Research: Cutting-Edge Applications

### Advanced Graph Neural Networks and Algorithm Integration

#### Graph Convolutional Networks (GCN) for Algorithm Enhancement

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional
import numpy as np

class GraphConvolutionalLayer(nn.Module):
    """
    Graph Convolutional Layer for learning graph representations
    
    Mathematical Foundation:
    H^(l+1) = σ(D^(-1/2) A D^(-1/2) H^(l) W^(l))
    
    Where:
    - A: Adjacency matrix with self-loops
    - D: Degree matrix  
    - H^(l): Node features at layer l
    - W^(l): Learnable weight matrix
    - σ: Activation function
    """
    
    def __init__(self, in_features: int, out_features: int):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.weight = nn.Parameter(torch.FloatTensor(in_features, out_features))
        self.bias = nn.Parameter(torch.FloatTensor(out_features))
        self.reset_parameters()
    
    def reset_parameters(self):
        nn.init.xavier_uniform_(self.weight)
        nn.init.zeros_(self.bias)
    
    def forward(self, features: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        """Forward pass through GCN layer"""
        # Add self-loops to adjacency matrix
        adjacency = adjacency + torch.eye(adjacency.size(0))
        
        # Compute degree matrix
        degree = torch.sum(adjacency, dim=1)
        degree_inv_sqrt = torch.pow(degree, -0.5)
        degree_inv_sqrt[degree_inv_sqrt == float('inf')] = 0
        
        # Normalize adjacency matrix
        degree_matrix = torch.diag(degree_inv_sqrt)
        normalized_adj = torch.mm(torch.mm(degree_matrix, adjacency), degree_matrix)
        
        # Apply graph convolution
        support = torch.mm(features, self.weight)
        output = torch.mm(normalized_adj, support) + self.bias
        
        return output

class GraphNeuralNetworkPathPredictor(nn.Module):
    """
    GNN for predicting optimal paths in graphs
    
    Applications:
    - Learning shortest path heuristics
    - Predicting bottleneck edges
    - Graph clustering optimization
    """
    
    def __init__(self, node_features: int, hidden_dim: int, num_layers: int):
        super().__init__()
        
        self.num_layers = num_layers
        self.layers = nn.ModuleList()
        
        # Input layer
        self.layers.append(GraphConvolutionalLayer(node_features, hidden_dim))
        
        # Hidden layers
        for _ in range(num_layers - 2):
            self.layers.append(GraphConvolutionalLayer(hidden_dim, hidden_dim))
        
        # Output layer
        self.layers.append(GraphConvolutionalLayer(hidden_dim, 1))
        
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, node_features: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        """Predict node importance scores for path finding"""
        x = node_features
        
        for i, layer in enumerate(self.layers[:-1]):
            x = F.relu(layer(x, adjacency))
            x = self.dropout(x)p Implementation)
        
        # Final layer without activation
        x = self.layers[-1](x, adjacency)ue
        
        return torch.sigmoid(x) source, sink):
th():
def train_gnn_shortest_path_predictor():        visited = set([source])
    """e, [source])])
    Train GNN to learn shortest path patterns
    
    This demonstrates how modern ML can enhance classical algorithms
    """            
    # Generate synthetic graph data
    num_graphs = 1000bor]
    training_data = []                if neighbor not in visited and residual_capacity > 0:
      if neighbor == sink:
    for _ in range(num_graphs):ghbor]
        # Generate random graph
        n_nodes = np.random.randint(10, 50)                    visited.add(neighbor)
        adjacency = generate_random_graph_matrix(n_nodes)
                return None
        # Compute shortest paths using Floyd-Warshall
        distances = floyd_warshall_numpy(adjacency)w = 0
        
        # Create node features (degree, clustering coefficient, etc.)
        node_features = compute_graph_features(adjacency)
        
        # Label: 1 if node is on many shortest paths, 0 otherwisebreak
        centrality_scores = compute_betweenness_centrality(distances)        
        labels = (centrality_scores > np.median(centrality_scores)).astype(float)acity along the path
        [path[i+1]] for i in range(len(path)-1))
        training_data.append({ flow
            'adjacency': adjacency,
            'features': node_features,
            'labels': labels        for i in range(len(path)-1):
        })[i]][path[i+1]] -= flow
         graph[path[i+1]][path[i]] += flow
    # Initialize and train model
    model = GraphNeuralNetworkPathPredictor(return max_flow
        node_features=node_features.shape[1],
        hidden_dim=64,
        num_layers=3
    )
    lgorithm
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.BCELoss()on
    graph_coloring(graph):
    # Training loop
    for epoch in range(100):
        total_loss = 0
        hbors
        for data in training_data:
            optimizer.zero_grad()]:
             colors:
            # Convert to tensors       used_colors.add(colors[neighbor])
            features = torch.FloatTensor(data['features'])    
            adjacency = torch.FloatTensor(data['adjacency'])
            labels = torch.FloatTensor(data['labels']).unsqueeze(1)
        while color in used_colors:
            color += 1
        colors[vertex] = color
    
    return colors
```

### 3. Eulerian Paths and Circuits

```python
def find_eulerian_path(graph):
    def count_odd_degree_vertices():
        odd_vertices = []
        for vertex in graph:
            if len(graph[vertex]) % 2 == 1:
                odd_vertices.append(vertex)
        return odd_vertices
    
    def hierholzer_algorithm(start_vertex):
        # Create a copy of the graph for modification
        temp_graph = {v: list(neighbors) for v, neighbors in graph.items()}
        stack = [start_vertex]
        path = []
        
        while stack:
            vertex = stack[-1]
            if temp_graph[vertex]:
                next_vertex = temp_graph[vertex].pop()
                temp_graph[next_vertex].remove(vertex)
                stack.append(next_vertex)
            else:
                path.append(stack.pop())
        
        return path[::-1]
    
    odd_vertices = count_odd_degree_vertices()
    
    if len(odd_vertices) == 0:
        # Eulerian circuit exists
        start = next(iter(graph))
        return hierholzer_algorithm(start)
    elif len(odd_vertices) == 2:
        # Eulerian path exists
        return hierholzer_algorithm(odd_vertices[0])
    else:
        # No Eulerian path or circuit
        return None
```

### 4. Hamiltonian Path

```python
def hamiltonian_path(graph, start, path=[]):
    path = path + [start]
    
    if len(path) == len(graph):
        return path
    
    for neighbor in graph[start]:
        if neighbor not in path:
            result = hamiltonian_path(graph, neighbor, path)
            if result:
                return result
    
    return None
```

---

## Implementation Patterns

### 1. Graph Class Design

```python
class Graph:
    def __init__(self, directed=False):
        self.directed = directed
        self.adjacency_list = {}
    
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
    
    def add_edge(self, u, v, weight=1):
        self.add_vertex(u)
        self.add_vertex(v)
        
        self.adjacency_list[u].append((v, weight))
        if not self.directed:
            self.adjacency_list[v].append((u, weight))
    
    def remove_edge(self, u, v):
        self.adjacency_list[u] = [(vertex, weight) for vertex, weight in self.adjacency_list[u] if vertex != v]
        if not self.directed:
            self.adjacency_list[v] = [(vertex, weight) for vertex, weight in self.adjacency_list[v] if vertex != u]
    
    def get_neighbors(self, vertex):
        return self.adjacency_list.get(vertex, [])
    
    def has_edge(self, u, v):
        return any(neighbor == v for neighbor, _ in self.get_neighbors(u))
    
    def get_vertices(self):
        return list(self.adjacency_list.keys())
    
    def get_edges(self):
        edges = []
        for vertex in self.adjacency_list:
            for neighbor, weight in self.adjacency_list[vertex]:
                if self.directed or vertex <= neighbor:  # Avoid duplicates in undirected
                    edges.append((vertex, neighbor, weight))
        return edges
    
    def __str__(self):
        return str(self.adjacency_list)
```

### 2. Union-Find (Disjoint Set) Implementation

```python
class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
        self.components = len(vertices)
    
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
    
    def component_count(self):
        return self.components
```

### 3. Priority Queue for Graph Algorithms

```python
import heapq

class PriorityQueue:
    def __init__(self):
        self.heap = []
        self.index = 0
    
    def push(self, priority, item):
        heapq.heappush(self.heap, (priority, self.index, item))
        self.index += 1
    
    def pop(self):
        return heapq.heappop(self.heap)[2]
    
    def empty(self):
        return len(self.heap) == 0
```

---

## Interview Problems & Patterns

### Pattern 1: Graph Traversal

#### Problem: Number of Islands

```python
def num_islands(grid):
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    islands = 0
    
    def dfs(r, c):
        if (r, c) in visited or r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        
        visited.add((r, c))
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dr, dc in directions:
            dfs(r + dr, c + dc)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                dfs(r, c)
                islands += 1
    
    return islands
```

#### Problem: Clone Graph

```python
def clone_graph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
```

### Pattern 2: Shortest Path

#### Problem: Word Ladder

```python
from collections import deque

def ladder_length(begin_word, end_word, word_list):
    if end_word not in word_list:
        return 0
    
    word_set = set(word_list)
    queue = deque([(begin_word, 1)])
    visited = {begin_word}
    
    while queue:
        word, level = queue.popleft()
        
        if word == end_word:
            return level
        
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                
                if next_word in word_set and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, level + 1))
    
    return 0
```

### Pattern 3: Cycle Detection

#### Problem: Course Schedule

```python
def can_finish(num_courses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # 0: unvisited, 1: visiting, 2: visited
    states = [0] * num_courses
    
    def has_cycle(course):
        if states[course] == 1:  # Currently visiting - cycle detected
            return True
        if states[course] == 2:  # Already processed
            return False
        
        states[course] = 1  # Mark as visiting
        
        for next_course in graph[course]:
            if has_cycle(next_course):
                return True
        
        states[course] = 2  # Mark as visited
        return False
    
    for course in range(num_courses):
        if has_cycle(course):
            return False
    
    return True
```

### Pattern 4: Union-Find

#### Problem: Number of Connected Components

```python
def count_components(n, edges):
    uf = UnionFind(range(n))
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.component_count()
```

### Pattern 5: Graph Construction

#### Problem: Reconstruct Itinerary

```python
from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    
    # Build graph and sort destinations
    for src, dst in tickets:
        graph[src].append(dst)
    
    for src in graph:
        graph[src].sort(reverse=True)  # Sort in reverse for pop()
    
    stack = ['JFK']
    itinerary = []
    
    while stack:
        while graph[stack[-1]]:
            stack.append(graph[stack[-1]].pop())
        itinerary.append(stack.pop())
    
    return itinerary[::-1]
```

---

## Optimization Techniques

### 1. Memoization in Graph Problems

```python
def longest_increasing_path(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    memo = {}
    
    def dfs(r, c):
        if (r, c) in memo:
            return memo[(r, c)]
        
        max_length = 1
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                max_length = max(max_length, 1 + dfs(nr, nc))
        
        memo[(r, c)] = max_length
        return max_length
    
    result = 0
    for r in range(rows):
        for c in range(cols):
            result = max(result, dfs(r, c))
    
    return result
```

### 2. Bidirectional Search

```python
from collections import deque

def bidirectional_search(graph, start, end):
    if start == end:
        return [start]
    
    front_queue = deque([start])
    back_queue = deque([end])
    front_visited = {start: [start]}
    back_visited = {end: [end]}
    
    while front_queue and back_queue:
        # Expand from the smaller frontier
        if len(front_queue) <= len(back_queue):
            current = front_queue.popleft()
            for neighbor in graph[current]:
                if neighbor in back_visited:
                    return front_visited[current] + back_visited[neighbor][::-1]
                if neighbor not in front_visited:
                    front_visited[neighbor] = front_visited[current] + [neighbor]
                    front_queue.append(neighbor)
        else:
            current = back_queue.popleft()
            for neighbor in graph[current]:
                if neighbor in front_visited:
                    return front_visited[neighbor] + back_visited[current][::-1]
                if neighbor not in back_visited:
                    back_visited[neighbor] = back_visited[current] + [neighbor]
                    back_queue.append(neighbor)
    
    return None
```

### 3. A* Search Algorithm

```python
import heapq

def a_star_search(graph, start, goal, heuristic):
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    
    while open_set:
        current = heapq.heappop(open_set)[1]
        
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        
        for neighbor, weight in graph[current]:
            tentative_g_score = g_score[current] + weight
            
            if tentative_g_score < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = tentative_g_score + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    return None
```

---

## Advanced Topics

### 1. Graph Databases

#### Neo4j Cypher Query Examples

```cypher
// Create nodes and relationships
CREATE (alice:Person {name: 'Alice', age: 30})
CREATE (bob:Person {name: 'Bob', age: 25})
CREATE (alice)-[:KNOWS]->(bob)

// Find shortest path
MATCH (start:Person {name: 'Alice'}), (end:Person {name: 'Bob'})
CALL algo.shortestPath.stream(start, end, 'weight')
YIELD nodeId, cost
RETURN nodeId, cost

// Community detection
CALL algo.louvain.stream('Person', 'KNOWS')
YIELD nodeId, community
RETURN nodeId, community
```

### 2. Social Network Analysis

#### PageRank Algorithm

```python
def pagerank(graph, damping=0.85, max_iterations=100, tolerance=1e-6):
    vertices = list(graph.keys())
    n = len(vertices)
    
    # Initialize PageRank values
    pr = {v: 1.0 / n for v in vertices}
    
    for _ in range(max_iterations):
        new_pr = {}
        
        for vertex in vertices:
            new_pr[vertex] = (1 - damping) / n
            
            for neighbor in vertices:
                if vertex in graph[neighbor]:
                    out_degree = len(graph[neighbor])
                    new_pr[vertex] += damping * pr[neighbor] / out_degree
        
        # Check convergence
        diff = sum(abs(new_pr[v] - pr[v]) for v in vertices)
        if diff < tolerance:
            break
        
        pr = new_pr
    
    return pr
```

#### Betweenness Centrality

```python
def betweenness_centrality(graph):
    centrality = {v: 0.0 for v in graph}
    
    for s in graph:
        # Single-source shortest paths
        stack = []
        paths = {v: [] for v in graph}
        sigma = {v: 0.0 for v in graph}
        sigma[s] = 1.0
        distance = {v: -1 for v in graph}
        distance[s] = 0
        queue = [s]
        
        while queue:
            v = queue.pop(0)
            stack.append(v)
            
            for w in graph[v]:
                if distance[w] < 0:
                    queue.append(w)
                    distance[w] = distance[v] + 1
                
                if distance[w] == distance[v] + 1:
                    sigma[w] += sigma[v]
                    paths[w].append(v)
        
        # Accumulation
        delta = {v: 0.0 for v in graph}
        while stack:
            w = stack.pop()
            for v in paths[w]:
                delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w])
            if w != s:
                centrality[w] += delta[w]
    
    return centrality
```

### 3. Machine Learning on Graphs

#### Graph Neural Network Concepts

```python
import numpy as np

class SimpleGCN:
    def __init__(self, input_dim, hidden_dim, output_dim):
        self.W1 = np.random.randn(input_dim, hidden_dim) * 0.1
        self.W2 = np.random.randn(hidden_dim, output_dim) * 0.1
    
    def forward(self, adjacency_matrix, features):
        # Normalize adjacency matrix
        degree_matrix = np.diag(np.sum(adjacency_matrix, axis=1))
        normalized_adj = np.linalg.inv(degree_matrix) @ adjacency_matrix
        
        # First layer
        h1 = np.tanh(normalized_adj @ features @ self.W1)
        
        # Second layer
        output = normalized_adj @ h1 @ self.W2
        
        return output
```

### 4. Graph Streaming Algorithms

#### Reservoir Sampling for Graph Streams

```python
import random

class GraphStreamSampler:
    def __init__(self, sample_size):
        self.sample_size = sample_size
        self.edges = []
        self.count = 0
    
    def add_edge(self, u, v):
        self.count += 1
        
        if len(self.edges) < self.sample_size:
            self.edges.append((u, v))
        else:
            # Reservoir sampling
            j = random.randint(0, self.count - 1)
            if j < self.sample_size:
                self.edges[j] = (u, v)
    
    def get_sample(self):
        return self.edges
```

---

## Practice Problems

### Easy Level

1. **Find if Path Exists in Graph** (LeetCode 1971)
2. **All Paths from Source to Target** (LeetCode 797)
3. **Find Center of Star Graph** (LeetCode 1791)
4. **Find the Town Judge** (LeetCode 997)
5. **Minimum Number of Vertices to Reach All Nodes** (LeetCode 1557)

### Medium Level

1. **Number of Islands** (LeetCode 200)
2. **Clone Graph** (LeetCode 133)
3. **Course Schedule** (LeetCode 207)
4. **Pacific Atlantic Water Flow** (LeetCode 417)
5. **Surrounded Regions** (LeetCode 130)
6. **Word Ladder** (LeetCode 127)
7. **Network Delay Time** (LeetCode 743)
8. **Cheapest Flights Within K Stops** (LeetCode 787)
9. **Redundant Connection** (LeetCode 684)
10. **Accounts Merge** (LeetCode 721)

### Hard Level

1. **Word Ladder II** (LeetCode 126)
2. **Alien Dictionary** (LeetCode 269)
3. **Critical Connections in a Network** (LeetCode 1192)
4. **Minimum Cost to Make at Least One Valid Path** (LeetCode 1368)
5. **Swim in Rising Water** (LeetCode 778)

### System Design Problems

1. **Design a Social Network**
2. **Design a Recommendation System**
3. **Design a Ride-Sharing Service**
4. **Design a Flight Booking System**
5. **Design a Dependency Management System**

---

## Time & Space Complexity Summary

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| BFS | O(V + E) | O(V) | Shortest path (unweighted) |
| DFS | O(V + E) | O(V) | Cycle detection, connectivity |
| Dijkstra | O((V + E) log V) | O(V) | Shortest path (non-negative) |
| Bellman-Ford | O(VE) | O(V) | Shortest path (negative edges) |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest path |
| Kruskal | O(E log E) | O(V) | Minimum spanning tree |
| Prim | O(E log V) | O(V) | Minimum spanning tree |
| Topological Sort | O(V + E) | O(V) | DAG ordering |
| Kosaraju SCC | O(V + E) | O(V) | Strongly connected components |

---

## References & Further Reading

### Books
1. **"Introduction to Algorithms" by Cormen, Leiserson, Rivest, and Stein** - Comprehensive coverage of graph algorithms
2. **"Graph Theory with Applications" by Bondy and Murty** - Mathematical foundations
3. **"Networks, Crowds, and Markets" by Easley and Kleinberg** - Social network analysis
4. **"Algorithm Design" by Kleinberg and Tardos** - Graph algorithm design techniques

### Online Resources
1. **LeetCode Graph Problems** - Practice implementation
2. **GeeksforGeeks Graph Algorithms** - Tutorials and examples
3. **Coursera: Algorithms on Graphs** - University of California San Diego
4. **NetworkX Documentation** - Python graph library
5. **Neo4j Graph Database** - Graph database concepts

### Research Papers
1. **"The PageRank Citation Ranking"** - Page, Brin, Motwani, Winograd
2. **"Finding and Evaluating Community Structure in Networks"** - Newman
3. **"Graph Neural Networks: A Review of Methods and Applications"** - Zhou et al.

### Tools and Libraries
1. **NetworkX (Python)** - Graph analysis library
2. **igraph (R/Python)** - Graph analysis and visualization
3. **SNAP (C++)** - Stanford Network Analysis Platform
4. **Gephi** - Graph visualization software
5. **Neo4j** - Graph database platform

---

## Conclusion

Graphs are fundamental data structures that model relationships and connections in various domains. Mastering graph algorithms and their implementations is crucial for:

- **Technical Interviews**: Many companies test graph knowledge extensively
- **System Design**: Understanding network topologies and data relationships
- **Machine Learning**: Graph neural networks and network analysis
- **Real-world Applications**: Social networks, recommendation systems, routing

Key takeaways:
1. **Choose the right representation** based on graph density and operations
2. **Understand time/space trade-offs** for different algorithms
3. **Practice pattern recognition** for common graph problems
4. **Master both recursive and iterative approaches**
5. **Learn optimization techniques** for large-scale graphs

Continue practicing with real problems and implementing algorithms from scratch to build deep understanding and intuition for graph problems.

---

*Last updated: June 2025*
*Total pages: ~50*
*Difficulty: Beginner to Advanced*
