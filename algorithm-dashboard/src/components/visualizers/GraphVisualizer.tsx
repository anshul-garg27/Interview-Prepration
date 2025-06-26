import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Shuffle, RotateCcw } from 'lucide-react'

interface Node {
  id: string
  label: string
  x: number
  y: number
  visited?: boolean
  inPath?: boolean
}

interface Edge {
  from: string
  to: string
  weight?: number
  highlighted?: boolean
}

interface GraphVisualizerProps {}

const GraphVisualizer: React.FC<GraphVisualizerProps> = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', label: 'A', x: 300, y: 100 },
    { id: 'B', label: 'B', x: 150, y: 200 },
    { id: 'C', label: 'C', x: 450, y: 200 },
    { id: 'D', label: 'D', x: 100, y: 350 },
    { id: 'E', label: 'E', x: 300, y: 350 },
    { id: 'F', label: 'F', x: 500, y: 350 }
  ])

  const [edges, setEdges] = useState<Edge[]>([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'B', to: 'E', weight: 1 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'C', to: 'F', weight: 3 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'E', to: 'F', weight: 1 }
  ])

  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs' | 'dijkstra'>('bfs')
  const [startNode, setStartNode] = useState('A')
  const [endNode, setEndNode] = useState('F')
  const [isAnimating, setIsAnimating] = useState(false)
  const [visitedOrder, setVisitedOrder] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [shortestPath, setShortestPath] = useState<string[]>([])

  const resetGraph = () => {
    setNodes(prev => prev.map(node => ({ ...node, visited: false, inPath: false })))
    setEdges(prev => prev.map(edge => ({ ...edge, highlighted: false })))
    setVisitedOrder([])
    setCurrentStep(0)
    setShortestPath([])
    setIsAnimating(false)
  }

  const bfsTraversal = useCallback(async () => {
    const queue = [startNode]
    const visited = new Set<string>()
    const order: string[] = []
    const parent = new Map<string, string>()

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current)) continue

      visited.add(current)
      order.push(current)

      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor))

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor)
          parent.set(neighbor, current)
        }
      }

      if (current === endNode) break
    }

    // Reconstruct path
    const path: string[] = []
    let current = endNode
    while (current && parent.has(current)) {
      path.unshift(current)
      current = parent.get(current)!
    }
    if (current === startNode) path.unshift(startNode)

    return { order, path }
  }, [startNode, endNode, edges])

  const dfsTraversal = useCallback(async () => {
    const stack = [startNode]
    const visited = new Set<string>()
    const order: string[] = []
    const parent = new Map<string, string>()

    while (stack.length > 0) {
      const current = stack.pop()!
      if (visited.has(current)) continue

      visited.add(current)
      order.push(current)

      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor))

      for (const neighbor of neighbors.reverse()) { // Reverse for consistent ordering
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
          if (!parent.has(neighbor)) {
            parent.set(neighbor, current)
          }
        }
      }

      if (current === endNode) break
    }

    // Reconstruct path
    const path: string[] = []
    let current = endNode
    while (current && parent.has(current)) {
      path.unshift(current)
      current = parent.get(current)!
    }
    if (current === startNode) path.unshift(startNode)

    return { order, path }
  }, [startNode, endNode, edges])

  const runAlgorithm = async () => {
    resetGraph()
    setIsAnimating(true)

    let result: { order: string[], path: string[] }

    switch (algorithm) {
      case 'bfs':
        result = await bfsTraversal()
        break
      case 'dfs':
        result = await dfsTraversal()
        break
      default:
        result = await bfsTraversal()
    }

    setVisitedOrder(result.order)
    setShortestPath(result.path)

    // Animate the traversal
    for (let i = 0; i < result.order.length; i++) {
      const nodeId = result.order[i]
      setNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, visited: true } : node
      ))
      setCurrentStep(i + 1)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Highlight the path
    await new Promise(resolve => setTimeout(resolve, 500))
    for (let i = 0; i < result.path.length; i++) {
      const nodeId = result.path[i]
      setNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, inPath: true } : node
      ))
      
      // Highlight edges in path
      if (i < result.path.length - 1) {
        const from = result.path[i]
        const to = result.path[i + 1]
        setEdges(prev => prev.map(edge => 
          (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
            ? { ...edge, highlighted: true } : edge
        ))
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    setIsAnimating(false)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">🌐 Graph Algorithm Visualizer</h2>
        <p className="text-blue-200">
          Interactive graph traversal and pathfinding algorithms
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-white font-semibold">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'bfs' | 'dfs' | 'dijkstra')}
            disabled={isAnimating}
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
          >
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-white font-semibold">Start:</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isAnimating}
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
          >
            {nodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-white font-semibold">End:</label>
          <select
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            disabled={isAnimating}
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
          >
            {nodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={runAlgorithm}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>Run {algorithm.toUpperCase()}</span>
        </button>

        <button
          onClick={resetGraph}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <svg width="600" height="450" className="mx-auto">
          {/* Edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from)!
            const toNode = nodes.find(n => n.id === edge.to)!
            
            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={edge.highlighted ? '#10B981' : '#6B7280'}
                  strokeWidth={edge.highlighted ? 4 : 2}
                  className="transition-all duration-300"
                />
                {/* Edge weight */}
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 5}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-semibold"
                >
                  {edge.weight}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={
                  node.id === startNode ? '#3B82F6' :
                  node.id === endNode ? '#EF4444' :
                  node.inPath ? '#10B981' :
                  node.visited ? '#F59E0B' :
                  '#6B7280'
                }
                stroke="white"
                strokeWidth="3"
                animate={node.visited ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill="white"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-white text-sm">Start Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-white text-sm">End Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-white text-sm">Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm">Shortest Path</span>
          </div>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">📊 Traversal Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-blue-300 font-semibold">Algorithm: </span>
              <span className="text-white">{algorithm.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-blue-300 font-semibold">Nodes Visited: </span>
              <span className="text-white">{visitedOrder.length} / {nodes.length}</span>
            </div>
            <div>
              <span className="text-blue-300 font-semibold">Shortest Path Length: </span>
              <span className="text-white">{shortestPath.length}</span>
            </div>
            {visitedOrder.length > 0 && (
              <div>
                <span className="text-blue-300 font-semibold">Visit Order: </span>
                <span className="text-white">{visitedOrder.join(' → ')}</span>
              </div>
            )}
            {shortestPath.length > 0 && (
              <div>
                <span className="text-blue-300 font-semibold">Path: </span>
                <span className="text-green-400 font-semibold">{shortestPath.join(' → ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">🧠 Algorithm Details</h3>
          <div className="text-blue-200">
            {algorithm === 'bfs' && (
              <div>
                <div className="font-semibold text-white mb-2">Breadth-First Search (BFS)</div>
                <div className="text-sm space-y-1">
                  <div>• Explores neighbors level by level</div>
                  <div>• Uses a queue (FIFO) data structure</div>
                  <div>• Guarantees shortest path in unweighted graphs</div>
                  <div>• Time: O(V + E), Space: O(V)</div>
                </div>
              </div>
            )}
            {algorithm === 'dfs' && (
              <div>
                <div className="font-semibold text-white mb-2">Depth-First Search (DFS)</div>
                <div className="text-sm space-y-1">
                  <div>• Explores as far as possible along each branch</div>
                  <div>• Uses a stack (LIFO) data structure</div>
                  <div>• Good for detecting cycles and topological sorting</div>
                  <div>• Time: O(V + E), Space: O(V)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Implementation */}
      <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">💻 Algorithm Implementation</h3>
        <pre className="text-green-400 text-sm overflow-x-auto">
{algorithm === 'bfs' && `
function bfs(graph, start, end) {
  const queue = [start];
  const visited = new Set();
  const parent = new Map();
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    if (current === end) break;
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        parent.set(neighbor, current);
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let node = end;
  while (node !== undefined) {
    path.unshift(node);
    node = parent.get(node);
  }
  
  return path;
}
`}
{algorithm === 'dfs' && `
function dfs(graph, start, end) {
  const stack = [start];
  const visited = new Set();
  const parent = new Map();
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    if (current === end) break;
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        parent.set(neighbor, current);
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let node = end;
  while (node !== undefined) {
    path.unshift(node);
    node = parent.get(node);
  }
  
  return path;
}
`}
        </pre>
      </div>
    </div>
  )
}

export default GraphVisualizer
