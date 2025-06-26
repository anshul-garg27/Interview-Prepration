# 🌳 Trees & Graphs: The Amazon Ecosystem Navigator

## 🌲 Mental Model: The "Amazon Organization Chart" Framework

Think of trees and graphs like **Amazon's complex business ecosystem** - hierarchical structures, interconnected services, and efficient navigation paths.

```
                    🏢 AMAZON HQ (root)
                   /              \
            🛒 RETAIL            ☁️ AWS
           /   |    \           /   |   \
        📱 TECH 📦 OPS 🎯 MARKETING   EC2 S3 LAMBDA
       /  \    |     \              |  |    |
    UI/UX DEV OPS   LOGISTICS      ...........
```

## 🎨 Visual Tree Traversal Patterns

### BFS: Level-Order (The "Management Meeting" Pattern)
```python
def amazon_org_chart_meetings(ceo_node):
    """
    Amazon Context: CEO wants to meet all employees level by level
    - First meet all VPs (level 1)
    - Then all Directors (level 2)  
    - Then all Managers (level 3)
    - And so on...
    
    This is exactly how BFS works!
    """
    if not ceo_node:
        return []
    
    from collections import deque
    meeting_schedule = []
    queue = deque([ceo_node])
    
    while queue:
        meeting_size = len(queue)  # People in current level
        current_meeting = []
        
        for _ in range(meeting_size):
            employee = queue.popleft()
            current_meeting.append(employee.name)
            
            # Add their direct reports to next meeting
            for report in employee.direct_reports:
                queue.append(report)
        
        meeting_schedule.append(current_meeting)
    
    return meeting_schedule

# Visual Output:
# Level 0: ["CEO"]
# Level 1: ["VP_Retail", "VP_AWS", "VP_Prime"]
# Level 2: ["Dir_Tech", "Dir_Ops", "Dir_EC2", "Dir_S3"]
# ...
```

### DFS: The "Deep Dive Investigation" Pattern
```python
def amazon_audit_department(department_root, audit_type="financial"):
    """
    Amazon Context: Auditing a department deeply before moving to siblings
    - Investigate CEO → VP → Director → Manager → IC completely
    - Then backtrack and investigate next branch
    
    Three DFS flavors = Three audit strategies:
    """
    
    def preorder_audit(node):
        """Audit manager BEFORE their team (top-down)"""
        if not node:
            return []
        
        result = [f"Audit {node.name} ({audit_type})"]
        for subordinate in node.team:
            result.extend(preorder_audit(subordinate))
        return result
    
    def inorder_audit(node):
        """For BST-like structures: left team, manager, right team"""
        if not node:
            return []
        
        result = []
        if node.left_team:
            result.extend(inorder_audit(node.left_team))
        
        result.append(f"Audit {node.name} ({audit_type})")
        
        if node.right_team:
            result.extend(inorder_audit(node.right_team))
        
        return result
    
    def postorder_audit(node):
        """Audit team BEFORE manager (bottom-up)"""
        if not node:
            return []
        
        result = []
        for subordinate in node.team:
            result.extend(postorder_audit(subordinate))
        
        result.append(f"Audit {node.name} ({audit_type})")
        return result
    
    return {
        "preorder": preorder_audit(department_root),
        "inorder": inorder_audit(department_root),
        "postorder": postorder_audit(department_root)
    }
```

## 🚀 Advanced Tree Patterns

### The "Amazon Service Dependency" Problem
```python
def find_service_dependencies(service_tree, target_service):
    """
    Amazon Context: Find all services that depend on a target service
    
    Real scenario: If S3 goes down, which services are affected?
    This is essentially finding all paths from root to target.
    """
    def find_all_paths(node, target, current_path, all_paths):
        if not node:
            return
        
        current_path.append(node.service_name)
        
        if node.service_name == target:
            all_paths.append(current_path[:])  # Found a dependency path
        
        for dependent_service in node.dependencies:
            find_all_paths(dependent_service, target, current_path, all_paths)
        
        current_path.pop()  # Backtrack
    
    dependency_paths = []
    find_all_paths(service_tree, target_service, [], dependency_paths)
    return dependency_paths

# Example Output:
# Paths to S3: [["API_Gateway", "Lambda", "S3"], 
#               ["EC2", "EBS", "S3"],
#               ["CloudFront", "S3"]]
```

### The "Lowest Common Manager" Problem
```python
def find_lowest_common_manager(org_root, employee1, employee2):
    """
    Amazon Context: Find the lowest-level manager who oversees both employees
    
    Use case: Resolving conflicts, coordinating projects, budget allocation
    
    This is the classic Lowest Common Ancestor problem with business context!
    """
    def find_common_manager(node, emp1, emp2):
        if not node or node == emp1 or node == emp2:
            return node
        
        # Search in all direct reports
        found_managers = []
        for report in node.direct_reports:
            result = find_common_manager(report, emp1, emp2)
            if result:
                found_managers.append(result)
        
        # If found both employees in different branches, current node is LCM
        if len(found_managers) >= 2:
            return node
        
        # If found in only one branch, return that result
        return found_managers[0] if found_managers else None
    
    return find_common_manager(org_root, employee1, employee2)
```

## 🧠 Advanced Graph Algorithms

### Amazon's "Prime Delivery Network" (Shortest Path)
```python
def optimize_delivery_routes(distribution_centers, delivery_requests):
    """
    Amazon Context: Find optimal delivery routes in real-time
    
    Graph = Road network
    Nodes = Distribution centers & customer locations  
    Edges = Roads with travel times
    Goal = Minimize total delivery time
    """
    import heapq
    
    def dijkstra_delivery_optimizer(graph, start_center, destinations):
        # Priority queue: (distance, current_location, path)
        pq = [(0, start_center, [start_center])]
        distances = {start_center: 0}
        optimal_routes = {}
        
        while pq:
            current_distance, current_location, path = heapq.heappop(pq)
            
            if current_location in destinations:
                optimal_routes[current_location] = {
                    'distance': current_distance,
                    'route': path
                }
                destinations.remove(current_location)
                if not destinations:
                    break
            
            if current_distance > distances.get(current_location, float('inf')):
                continue
            
            for neighbor, travel_time in graph[current_location].items():
                new_distance = current_distance + travel_time
                
                if new_distance < distances.get(neighbor, float('inf')):
                    distances[neighbor] = new_distance
                    heapq.heappush(pq, (new_distance, neighbor, path + [neighbor]))
        
        return optimal_routes
    
    # Execute optimization for each request
    return dijkstra_delivery_optimizer(distribution_centers, 
                                     delivery_requests['start'], 
                                     delivery_requests['destinations'])
```

### Amazon's "Service Mesh" (Connected Components)
```python
def analyze_service_connectivity(microservices_graph):
    """
    Amazon Context: Analyze microservices architecture
    
    Questions to answer:
    - Which services are isolated?
    - What are the independent service clusters?
    - How many separate deployment units do we have?
    """
    
    def dfs_explore_cluster(service, graph, visited, current_cluster):
        visited.add(service)
        current_cluster.append(service)
        
        for connected_service in graph.get(service, []):
            if connected_service not in visited:
                dfs_explore_cluster(connected_service, graph, visited, current_cluster)
    
    visited = set()
    service_clusters = []
    
    for service in microservices_graph:
        if service not in visited:
            cluster = []
            dfs_explore_cluster(service, microservices_graph, visited, cluster)
            service_clusters.append(cluster)
    
    # Analysis report
    report = {
        'total_clusters': len(service_clusters),
        'clusters': service_clusters,
        'isolated_services': [cluster[0] for cluster in service_clusters if len(cluster) == 1],
        'largest_cluster': max(service_clusters, key=len) if service_clusters else [],
        'deployment_complexity': len(service_clusters)  # Independent deployment units
    }
    
    return report
```

## 🎭 Creative Problem-Solving Frameworks

### The "Amazon Warehouse" Tree Visualization
```
Binary Search Tree = Smart Warehouse Organization

           [Manager: 50]
          /              \
   [Team Lead: 25]    [Team Lead: 75]
    /         \         /           \
[Worker: 15][Worker: 35][Worker: 65][Worker: 85]

Properties:
- Left workers handle smaller package IDs
- Right workers handle larger package IDs  
- Manager knows which team to delegate to
- Efficient O(log n) package routing
```

### The "AWS Region" Graph Model
```python
def aws_region_failover_planning(regions_graph, primary_region):
    """
    Amazon Context: Plan failover strategies for AWS regions
    
    Graph Theory Application:
    - Nodes = AWS regions
    - Edges = Network connections with latency
    - Goal = Find backup regions with minimal latency
    """
    
    def find_optimal_backups(graph, primary, max_backups=3):
        import heapq
        
        # Priority queue: (latency, backup_region)
        backup_options = []
        
        for region, latency in graph[primary].items():
            heapq.heappush(backup_options, (latency, region))
        
        optimal_backups = []
        for _ in range(min(max_backups, len(backup_options))):
            if backup_options:
                latency, region = heapq.heappop(backup_options)
                optimal_backups.append({
                    'region': region,
                    'latency_ms': latency,
                    'failover_priority': len(optimal_backups) + 1
                })
        
        return optimal_backups
    
    return find_optimal_backups(regions_graph, primary_region)
```

## 🎯 Amazon Leadership Principles in Trees/Graphs

### Customer Obsession in Tree Design
```python
def customer_focused_tree_validation(tree_root):
    """
    Customer Obsession: Ensure tree structure never breaks customer experience
    
    Validations that matter to customers:
    - No infinite loops (customer gets stuck)
    - Balanced structure (consistent response times)
    - All nodes reachable (no broken links)
    """
    
    def validate_customer_experience(node, visited=None, depth=0):
        if visited is None:
            visited = set()
        
        # Check for infinite loops (customer nightmare!)
        if id(node) in visited:
            return {"error": "Infinite loop detected - customer will be stuck!"}
        
        visited.add(id(node))
        
        # Check for excessive depth (slow customer experience)
        if depth > 20:  # Reasonable threshold
            return {"warning": "Tree too deep - customers will experience delays"}
        
        # Validate all child nodes
        issues = []
        for child in getattr(node, 'children', []):
            child_result = validate_customer_experience(child, visited.copy(), depth + 1)
            if child_result:
                issues.append(child_result)
        
        return {"status": "healthy", "issues": issues} if not any("error" in issue for issue in issues) else {"error": "Tree structure compromised"}
    
    return validate_customer_experience(tree_root)
```

### Ownership in Graph Algorithms
```python
def production_ready_bfs(graph, start_node):
    """
    Ownership: Write graph traversal code that won't break in production
    
    Production considerations:
    - Handle null inputs gracefully
    - Prevent infinite loops
    - Memory management for large graphs
    - Detailed logging for debugging
    """
    if not graph or start_node not in graph:
        return {"error": "Invalid input", "result": []}
    
    from collections import deque
    import time
    
    visited = set()
    queue = deque([start_node])
    result = []
    start_time = time.time()
    max_iterations = 10000  # Prevent infinite processing
    iterations = 0
    
    while queue and iterations < max_iterations:
        current = queue.popleft()
        iterations += 1
        
        if current in visited:
            continue
        
        visited.add(current)
        result.append(current)
        
        # Add neighbors with validation
        neighbors = graph.get(current, [])
        for neighbor in neighbors:
            if neighbor not in visited and neighbor in graph:
                queue.append(neighbor)
    
    execution_time = time.time() - start_time
    
    return {
        "result": result,
        "stats": {
            "nodes_visited": len(result),
            "execution_time_ms": execution_time * 1000,
            "iterations": iterations,
            "memory_efficient": iterations < max_iterations
        },
        "warnings": ["Max iterations reached - possible infinite loop"] if iterations >= max_iterations else []
    }
```

## 🎨 ASCII Art Tree Visualizations

### Binary Tree Level Order:
```
Tree Structure:
        3
       / \
      9   20
         /  \
        15   7

BFS Traversal Visualization:
Level 0: [3]           Queue: [9, 20]
Level 1: [9, 20]       Queue: [15, 7]  
Level 2: [15, 7]       Queue: []

Amazon Analogy:
Level 0: CEO makes decision
Level 1: VPs get notification  
Level 2: Directors execute plan
```

### Tree Diameter Calculation:
```
Finding "Longest Management Chain":

     A(CEO)
    / \
   B   C
  /   / \
 D   E   F
    /
   G

Possible chains:
D → B → A → C → E → G (length: 5)
D → B → A → C → F     (length: 4)

Longest chain: 5 (company hierarchy depth)
```

## 🚀 Advanced Interview Patterns

### The "Amazon Scale" Challenge
```python
def handle_million_node_tree(tree_root):
    """
    Amazon Interview Follow-up: "What if the tree has a million nodes?"
    
    Optimizations needed:
    1. Iterative vs Recursive (stack overflow)
    2. Memory management
    3. Parallel processing
    4. Early termination conditions
    """
    
    def iterative_tree_processing(root):
        """Memory-efficient iterative approach"""
        if not root:
            return []
        
        stack = [root]
        result = []
        processed_count = 0
        
        while stack:
            node = stack.pop()
            result.append(node.val)
            processed_count += 1
            
            # Memory management: process in chunks
            if processed_count % 10000 == 0:
                # Yield control, allow garbage collection
                yield f"Processed {processed_count} nodes"
            
            # Add children (right first for left-to-right processing)
            if hasattr(node, 'right') and node.right:
                stack.append(node.right)
            if hasattr(node, 'left') and node.left:
                stack.append(node.left)
        
        yield f"Completed: {processed_count} total nodes"
        return result
    
    return iterative_tree_processing(tree_root)
```

This transforms trees and graphs from abstract data structures into powerful tools for modeling Amazon's complex business ecosystem!
