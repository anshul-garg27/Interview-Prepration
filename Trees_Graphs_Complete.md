# 🌳 Trees & Graphs - Complete Mastery Guide

## 📚 What are Trees?

A tree is like a family tree - it has a root (ancestor) at the top, and branches (children) going down. Each node can have children, but every node (except root) has exactly one parent.

### Tree Terminology:
```
       A (root)
      / \
     B   C
    / \   \
   D   E   F

- Root: A (top node, no parent)
- Children of A: B, C
- Parent of B: A
- Siblings: B and C (same parent)
- Leaves: D, E, F (no children)
- Height: 2 (longest path from root to leaf)
- Depth of E: 2 (distance from root)
```

### Binary Tree:
Each node has **at most 2 children** (left and right).

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
        
    def __str__(self):
        return str(self.val)
```

## 🎯 Pattern 1: Tree Traversals (DFS - Depth First Search)

### Three Ways to Visit All Nodes:

#### 1. Preorder: Root → Left → Right
```
       1
      / \
     2   3
    / \
   4   5

Visit order: 1 → 2 → 4 → 5 → 3
Process root BEFORE children
```

#### 2. Inorder: Left → Root → Right
```
Same tree: 1
          / \
         2   3
        / \
       4   5

Visit order: 4 → 2 → 5 → 1 → 3
Process root BETWEEN children
(For BST, this gives sorted order!)
```

#### 3. Postorder: Left → Right → Root
```
Same tree: 1
          / \
         2   3
        / \
       4   5

Visit order: 4 → 5 → 2 → 3 → 1
Process root AFTER children
```

### Implementation:
```python
def preorder_traversal(root):
    """Root → Left → Right"""
    if not root:
        return []
    
    result = []
    result.append(root.val)  # Process root first
    result.extend(preorder_traversal(root.left))   # Then left subtree
    result.extend(preorder_traversal(root.right))  # Then right subtree
    
    return result

def inorder_traversal(root):
    """Left → Root → Right"""
    if not root:
        return []
    
    result = []
    result.extend(inorder_traversal(root.left))   # First left subtree
    result.append(root.val)  # Then process root
    result.extend(inorder_traversal(root.right))  # Then right subtree
    
    return result

def postorder_traversal(root):
    """Left → Right → Root"""
    if not root:
        return []
    
    result = []
    result.extend(postorder_traversal(root.left))   # First left subtree
    result.extend(postorder_traversal(root.right))  # Then right subtree
    result.append(root.val)  # Finally process root
    
    return result

# Build example tree:
#       1
#      / \
#     2   3
#    / \
#   4   5

root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Preorder (Root→Left→Right):", preorder_traversal(root))   # [1, 2, 4, 5, 3]
print("Inorder (Left→Root→Right):", inorder_traversal(root))     # [4, 2, 5, 1, 3]
print("Postorder (Left→Right→Root):", postorder_traversal(root)) # [4, 5, 2, 3, 1]
```

## 🎯 Pattern 2: Level Order Traversal (BFS - Breadth First Search)

### Visit nodes level by level (like reading a book):

```
       1     ← Level 0
      / \
     2   3   ← Level 1
    / \
   4   5     ← Level 2

Visit order: 1 → 2 → 3 → 4 → 5
```

### Implementation using Queue:
```python
from collections import deque

def level_order_traversal(root):
    """Visit all nodes level by level"""
    if not root:
        return []
    
    result = []
    queue = deque([root])  # Start with root in queue
    
    while queue:
        level_size = len(queue)  # How many nodes in current level
        current_level = []
        
        print(f"Processing level with {level_size} nodes")
        
        # Process all nodes in current level
        for i in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            print(f"  Visiting node {node.val}")
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
                print(f"    Added left child {node.left.val} to queue")
            if node.right:
                queue.append(node.right)
                print(f"    Added right child {node.right.val} to queue")
        
        result.append(current_level)
        print(f"Level complete: {current_level}")
        print()
    
    return result

# Test with same tree
result = level_order_traversal(root)
print("Level order result:", result)  # [[1], [2, 3], [4, 5]]
```

## 🎯 Pattern 3: Tree Properties and Calculations

### Maximum Depth (Height):
```python
def max_depth(root):
    """Find the maximum depth of the tree"""
    if not root:
        return 0
    
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    print(f"Node {root.val}: left_depth={left_depth}, right_depth={right_depth}")
    
    return 1 + max(left_depth, right_depth)

# Test it
depth = max_depth(root)
print(f"Maximum depth: {depth}")
```

### Check if Tree is Balanced:
A balanced tree means the left and right subtrees' heights differ by at most 1.

```python
def is_balanced(root):
    """Check if tree is height-balanced"""
    
    def check_balance(node):
        """Returns (is_balanced, height)"""
        if not node:
            return True, 0
        
        left_balanced, left_height = check_balance(node.left)
        right_balanced, right_height = check_balance(node.right)
        
        # Current node is balanced if:
        # 1. Both subtrees are balanced
        # 2. Height difference <= 1
        current_balanced = (left_balanced and 
                          right_balanced and 
                          abs(left_height - right_height) <= 1)
        
        current_height = 1 + max(left_height, right_height)
        
        print(f"Node {node.val}: balanced={current_balanced}, height={current_height}")
        
        return current_balanced, current_height
    
    balanced, _ = check_balance(root)
    return balanced

# Test it
result = is_balanced(root)
print(f"Tree is balanced: {result}")
```

## 🎯 Pattern 4: Binary Search Tree (BST)

### BST Property:
For every node:
- **Left subtree** contains only values **less than** the node
- **Right subtree** contains only values **greater than** the node

```
BST Example:
      5
     / \
    3   8
   / \ / \
  2  4 7  9

Inorder traversal: 2, 3, 4, 5, 7, 8, 9 (sorted!)
```

### Validate BST:
```python
def is_valid_bst(root):
    """Check if tree is a valid BST"""
    
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        print(f"Checking node {node.val}: must be in range ({min_val}, {max_val})")
        
        # Check if current node violates BST property
        if node.val <= min_val or node.val >= max_val:
            print(f"  INVALID: {node.val} not in range ({min_val}, {max_val})")
            return False
        
        # Recursively validate subtrees with updated bounds
        left_valid = validate(node.left, min_val, node.val)
        right_valid = validate(node.right, node.val, max_val)
        
        return left_valid and right_valid
    
    return validate(root, float('-inf'), float('inf'))

# Build a BST:
#      5
#     / \
#    3   8
#   / \ / \
#  2  4 7  9

bst = TreeNode(5)
bst.left = TreeNode(3)
bst.right = TreeNode(8)
bst.left.left = TreeNode(2)
bst.left.right = TreeNode(4)
bst.right.left = TreeNode(7)
bst.right.right = TreeNode(9)

print("Is valid BST:", is_valid_bst(bst))
```

### Search in BST:
```python
def search_bst(root, target):
    """Search for a value in BST"""
    if not root:
        return None
    
    print(f"Visiting node {root.val}")
    
    if root.val == target:
        print(f"Found {target}!")
        return root
    elif target < root.val:
        print(f"{target} < {root.val}, going left")
        return search_bst(root.left, target)
    else:
        print(f"{target} > {root.val}, going right")
        return search_bst(root.right, target)

# Test search
target = 7
result = search_bst(bst, target)
print(f"Search result: {result.val if result else 'Not found'}")
```

## 🎯 Pattern 5: Lowest Common Ancestor (LCA)

### Problem:
Find the lowest common ancestor of two nodes in a tree.

```
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4

LCA(5, 1) = 3
LCA(5, 4) = 5
LCA(6, 2) = 5
```

### Solution:
```python
def lowest_common_ancestor(root, p, q):
    """Find LCA of nodes p and q"""
    if not root:
        return None
    
    print(f"Visiting node {root.val}")
    
    # If current node is one of the targets, it's a potential LCA
    if root == p or root == q:
        print(f"Found target node {root.val}")
        return root
    
    # Search in left and right subtrees
    left_lca = lowest_common_ancestor(root.left, p, q)
    right_lca = lowest_common_ancestor(root.right, p, q)
    
    # If both subtrees contain one of the targets, current node is LCA
    if left_lca and right_lca:
        print(f"Node {root.val} is LCA (found targets in both subtrees)")
        return root
    
    # Return whichever subtree contains a target (or None)
    return left_lca or right_lca

# Build example tree and test
tree = TreeNode(3)
tree.left = TreeNode(5)
tree.right = TreeNode(1)
tree.left.left = TreeNode(6)
tree.left.right = TreeNode(2)
tree.right.left = TreeNode(0)
tree.right.right = TreeNode(8)
tree.left.right.left = TreeNode(7)
tree.left.right.right = TreeNode(4)

p_node = tree.left  # Node 5
q_node = tree.left.right.right  # Node 4

lca = lowest_common_ancestor(tree, p_node, q_node)
print(f"LCA of {p_node.val} and {q_node.val}: {lca.val}")
```

## 🌐 What are Graphs?

A graph is like a network of cities connected by roads. Unlike trees, graphs can have cycles and multiple paths between nodes.

### Graph Terminology:
```
Graph Example:
A --- B
|   / |
|  /  |
| /   |
C --- D

- Vertices/Nodes: A, B, C, D
- Edges: A-B, A-C, B-C, B-D, C-D
- Degree of B: 3 (connected to A, C, D)
- Path from A to D: A → B → D or A → C → D
```

### Graph Representation:
```python
# 1. Adjacency List (most common)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C']
}

# 2. Adjacency Matrix
#     A  B  C  D
# A [[0, 1, 1, 0],
# B  [1, 0, 1, 1],
# C  [1, 1, 0, 1],
# D  [0, 1, 1, 0]]
```

## 🎯 Pattern 6: Graph DFS (Depth-First Search)

### Go as deep as possible before backtracking:

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

# Test DFS
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

result = dfs_graph(graph, 'A')
print(f"DFS traversal: {result}")
```

## 🎯 Pattern 7: Graph BFS (Breadth-First Search)

### Visit all neighbors before going deeper:

```python
from collections import deque

def bfs_graph(graph, start):
    """Breadth-first search in graph"""
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        print(f"Visiting {node}")
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                print(f"  Added {neighbor} to queue")
    
    return result

# Test BFS
result = bfs_graph(graph, 'A')
print(f"BFS traversal: {result}")
```

## 🎯 Pattern 8: Detect Cycle in Graph

### Using DFS with colors:
- **White**: Unvisited
- **Gray**: Currently being processed
- **Black**: Completely processed

```python
def has_cycle(graph):
    """Detect cycle in directed graph using DFS"""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}
    
    def dfs(node):
        if color[node] == GRAY:
            print(f"Cycle detected! Back edge to {node}")
            return True  # Back edge = cycle
        
        if color[node] == BLACK:
            return False  # Already processed
        
        color[node] = GRAY  # Mark as being processed
        print(f"Processing {node}")
        
        for neighbor in graph.get(node, []):
            if dfs(neighbor):
                return True
        
        color[node] = BLACK  # Mark as completely processed
        return False
    
    for node in graph:
        if color[node] == WHITE:
            if dfs(node):
                return True
    
    return False

# Test with cyclic graph
cyclic_graph = {
    'A': ['B'],
    'B': ['C'],
    'C': ['A']  # Creates cycle A → B → C → A
}

print("Has cycle:", has_cycle(cyclic_graph))
```

## 🧠 When to Use Each Pattern

### Tree Traversals:
- **Preorder**: Copy/serialize tree, prefix expressions
- **Inorder**: Get sorted values from BST
- **Postorder**: Delete tree, postfix expressions, calculate size
- **Level-order**: Print levels, find minimum depth

### Graph Algorithms:
- **DFS**: Find connected components, detect cycles, topological sort
- **BFS**: Shortest path (unweighted), level-wise processing

## 🎯 Practice Problems

### Tree Problems:
1. **Maximum Depth of Binary Tree** - Basic recursion
2. **Same Tree** - Compare two trees
3. **Symmetric Tree** - Check if tree is mirror of itself
4. **Binary Tree Level Order Traversal** - BFS practice
5. **Validate Binary Search Tree** - BST properties
6. **Lowest Common Ancestor** - Tree traversal logic

### Graph Problems:
1. **Number of Islands** - DFS/BFS on grid
2. **Clone Graph** - Graph traversal with copying
3. **Course Schedule** - Cycle detection in directed graph
4. **Word Ladder** - BFS for shortest path

## 📝 Quick Templates

### Tree DFS:
```python
def dfs(root):
    if not root:
        return
    # Process root
    dfs(root.left)
    dfs(root.right)
```

### Tree BFS:
```python
from collections import deque
queue = deque([root])
while queue:
    node = queue.popleft()
    # Process node
    if node.left: queue.append(node.left)
    if node.right: queue.append(node.right)
```

### Graph DFS:
```python
def dfs(graph, node, visited):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

This comprehensive guide covers all essential tree and graph patterns with visual explanations!
