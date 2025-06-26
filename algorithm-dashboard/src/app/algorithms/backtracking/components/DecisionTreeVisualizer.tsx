// 🌳 Advanced Decision Tree Visualizer Component
// World-class interactive tree visualization with real-time animations

'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TreeNode } from '../types/BacktrackingTypes'

interface DecisionTreeVisualizerProps {
  tree: TreeNode | null
  currentNode?: TreeNode | null
  selectedNode?: TreeNode | null
  highlightedPath?: string[]
  animationSpeed?: 'slow' | 'medium' | 'fast'
  showConstraints?: boolean
  showMetrics?: boolean
  onNodeClick?: (node: TreeNode) => void
  onNodeHover?: (node: TreeNode | null) => void
  className?: string
}

interface TreeLayout {
  x: number
  y: number
  node: TreeNode
  children: TreeLayout[]
  width: number
  height: number
}

interface AnimationState {
  isAnimating: boolean
  currentStep: number
  highlightedNodes: Set<string>
  fadeInNodes: Set<string>
  fadeOutNodes: Set<string>
}

export const DecisionTreeVisualizer: React.FC<DecisionTreeVisualizerProps> = ({
  tree,
  currentNode,
  selectedNode,
  highlightedPath = [],
  animationSpeed = 'medium',
  showConstraints = true,
  showMetrics = true,
  onNodeClick,
  onNodeHover,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    currentStep: 0,
    highlightedNodes: new Set(),
    fadeInNodes: new Set(),
    fadeOutNodes: new Set()
  })

  // Animation speed mapping
  const speedMap = {
    slow: 1000,
    medium: 500,
    fast: 200
  }

  // Calculate tree layout using improved algorithm
  const treeLayout = useMemo(() => {
    if (!tree) return null
    return calculateTreeLayout(tree, dimensions.width, dimensions.height)
  }, [tree, dimensions])

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(rect.width, 400),
          height: Math.max(rect.height, 300)
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle path highlighting animation
  useEffect(() => {
    if (highlightedPath.length > 0) {
      animatePathHighlight(highlightedPath)
    }
  }, [highlightedPath])

  // Animate path highlighting
  const animatePathHighlight = (path: string[]) => {
    setAnimationState(prev => ({ ...prev, isAnimating: true }))
    
    path.forEach((nodeId, index) => {
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          highlightedNodes: new Set([...prev.highlightedNodes, nodeId])
        }))
        
        if (index === path.length - 1) {
          setTimeout(() => {
            setAnimationState(prev => ({ ...prev, isAnimating: false }))
          }, speedMap[animationSpeed])
        }
      }, index * (speedMap[animationSpeed] / 3))
    })
  }

  // Node click handler
  const handleNodeClick = (node: TreeNode, event: React.MouseEvent) => {
    event.stopPropagation()
    onNodeClick?.(node)
  }

  // Node hover handlers
  const handleNodeMouseEnter = (node: TreeNode) => {
    onNodeHover?.(node)
  }

  const handleNodeMouseLeave = () => {
    onNodeHover?.(null)
  }

  if (!tree || !treeLayout) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🌳</div>
          <p className="text-gray-600">No decision tree to display</p>
          <p className="text-sm text-gray-500 mt-1">Start an algorithm to see the tree visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Tree Visualization */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          
          {/* Node shadows */}
          <filter id="nodeShadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
          
          {/* Glow effect for active nodes */}
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#bgGradient)" />

        {/* Render edges */}
        {renderEdges(treeLayout)}

        {/* Render nodes */}
        {renderNodes(treeLayout)}
      </svg>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Solution</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Backtracked</span>
          </div>
        </div>
      </div>

      {/* Metrics overlay */}
      {showMetrics && tree && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-sm space-y-1">
            <div>Nodes: {countNodes(tree)}</div>
            <div>Depth: {getMaxDepth(tree)}</div>
            <div>Solutions: {countSolutions(tree)}</div>
          </div>
        </div>
      )}
    </div>
  )

  // Render edges between nodes
  function renderEdges(layout: TreeLayout): React.ReactNode {
    const edges: React.ReactNode[] = []

    function addEdges(nodeLayout: TreeLayout) {
      nodeLayout.children.forEach(child => {
        const isHighlighted = highlightedPath.includes(nodeLayout.node.id) && 
                            highlightedPath.includes(child.node.id)
        const isActive = currentNode?.id === nodeLayout.node.id || currentNode?.id === child.node.id

        edges.push(
          <line
            key={`edge-${nodeLayout.node.id}-${child.node.id}`}
            x1={nodeLayout.x}
            y1={nodeLayout.y}
            x2={child.x}
            y2={child.y}
            stroke={isHighlighted ? '#3b82f6' : isActive ? '#10b981' : '#94a3b8'}
            strokeWidth={isHighlighted ? 3 : isActive ? 2 : 1}
            strokeDasharray={child.node.isBacktracked ? '5,5' : 'none'}
            opacity={child.node.isBacktracked ? 0.5 : 1}
            className="transition-all duration-300"
          />
        )

        // Add arrow marker
        const angle = Math.atan2(child.y - nodeLayout.y, child.x - nodeLayout.x)
        const arrowX = child.x - 25 * Math.cos(angle)
        const arrowY = child.y - 25 * Math.sin(angle)

        edges.push(
          <polygon
            key={`arrow-${nodeLayout.node.id}-${child.node.id}`}
            points={`${arrowX},${arrowY} ${arrowX - 8 * Math.cos(angle - 0.5)},${arrowY - 8 * Math.sin(angle - 0.5)} ${arrowX - 8 * Math.cos(angle + 0.5)},${arrowY - 8 * Math.sin(angle + 0.5)}`}
            fill={isHighlighted ? '#3b82f6' : isActive ? '#10b981' : '#94a3b8'}
            opacity={child.node.isBacktracked ? 0.5 : 1}
          />
        )

        addEdges(child)
      })
    }

    addEdges(layout)
    return edges
  }

  // Render tree nodes
  function renderNodes(layout: TreeLayout): React.ReactNode {
    const nodes: React.ReactNode[] = []

    function addNodes(nodeLayout: TreeLayout) {
      const node = nodeLayout.node
      const isSelected = selectedNode?.id === node.id
      const isCurrent = currentNode?.id === node.id
      const isHighlighted = highlightedPath.includes(node.id)
      const isAnimated = animationState.highlightedNodes.has(node.id)

      // Determine node color based on state
      let nodeColor = '#f1f5f9' // default
      if (node.isSolution) nodeColor = '#10b981'
      else if (node.isBacktracked) nodeColor = '#ef4444'
      else if (isCurrent) nodeColor = '#3b82f6'
      else if (isHighlighted || isAnimated) nodeColor = '#8b5cf6'

      // Node circle
      nodes.push(
        <circle
          key={`node-${node.id}`}
          cx={nodeLayout.x}
          cy={nodeLayout.y}
          r={isSelected ? 22 : 20}
          fill={nodeColor}
          stroke={isSelected ? '#1e40af' : '#64748b'}
          strokeWidth={isSelected ? 3 : 1}
          filter={isCurrent || isAnimated ? 'url(#nodeGlow)' : 'url(#nodeShadow)'}
          className="cursor-pointer transition-all duration-300 hover:r-24"
          onClick={(e) => handleNodeClick(node, e)}
          onMouseEnter={() => handleNodeMouseEnter(node)}
          onMouseLeave={handleNodeMouseLeave}
        />
      )

      // Node label
      nodes.push(
        <text
          key={`label-${node.id}`}
          x={nodeLayout.x}
          y={nodeLayout.y + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="white"
          className="pointer-events-none select-none"
        >
          {String(node.value).slice(0, 3)}
        </text>
      )

      // Constraint indicators
      if (showConstraints && node.constraints && node.constraints.length > 0) {
        const violatedConstraints = node.constraints.filter(c => c.isViolated)
        if (violatedConstraints.length > 0) {
          nodes.push(
            <circle
              key={`constraint-${node.id}`}
              cx={nodeLayout.x + 15}
              cy={nodeLayout.y - 15}
              r={6}
              fill="#ef4444"
              stroke="white"
              strokeWidth={2}
            />
          )
          nodes.push(
            <text
              key={`constraint-text-${node.id}`}
              x={nodeLayout.x + 15}
              y={nodeLayout.y - 11}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="white"
              className="pointer-events-none"
            >
              !
            </text>
          )
        }
      }

      // Execution order badge
      nodes.push(
        <circle
          key={`order-bg-${node.id}`}
          cx={nodeLayout.x - 15}
          cy={nodeLayout.y - 15}
          r={8}
          fill="white"
          stroke="#64748b"
        />
      )
      nodes.push(
        <text
          key={`order-${node.id}`}
          x={nodeLayout.x - 15}
          y={nodeLayout.y - 11}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="#374151"
          className="pointer-events-none"
        >
          {node.executionOrder}
        </text>
      )

      // Recursively add child nodes
      nodeLayout.children.forEach(addNodes)
    }

    addNodes(layout)
    return nodes
  }
}

// Tree layout calculation using improved algorithm
function calculateTreeLayout(tree: TreeNode, containerWidth: number, containerHeight: number): TreeLayout {
  const nodeSize = 40
  const levelHeight = 80
  const minNodeSpacing = 60

  // First pass: calculate subtree sizes
  function calculateSubtreeSize(node: TreeNode): number {
    if (node.children.length === 0) return 1
    return node.children.reduce((sum, child) => sum + calculateSubtreeSize(child), 0)
  }

  // Second pass: position nodes
  function positionNode(
    node: TreeNode, 
    depth: number, 
    leftBound: number, 
    rightBound: number
  ): TreeLayout {
    const x = (leftBound + rightBound) / 2
    const y = 40 + depth * levelHeight
    
    const layout: TreeLayout = {
      x,
      y,
      node,
      children: [],
      width: nodeSize,
      height: nodeSize
    }

    if (node.children.length > 0) {
      const totalWidth = rightBound - leftBound
      let currentX = leftBound

      node.children.forEach(child => {
        const subtreeSize = calculateSubtreeSize(child)
        const totalSize = node.children.reduce((sum, c) => sum + calculateSubtreeSize(c), 0)
        const childWidth = (subtreeSize / totalSize) * totalWidth
        
        const childLayout = positionNode(child, depth + 1, currentX, currentX + childWidth)
        layout.children.push(childLayout)
        
        currentX += childWidth
      })
    }

    return layout
  }

  const maxDepth = getMaxDepth(tree)
  const requiredHeight = Math.max(containerHeight, 40 + maxDepth * levelHeight + 40)
  
  return positionNode(tree, 0, 40, containerWidth - 40)
}

// Utility functions
function countNodes(tree: TreeNode): number {
  return 1 + tree.children.reduce((sum, child) => sum + countNodes(child), 0)
}

function getMaxDepth(tree: TreeNode): number {
  if (tree.children.length === 0) return tree.depth
  return Math.max(...tree.children.map(child => getMaxDepth(child)))
}

function countSolutions(tree: TreeNode): number {
  let count = tree.isSolution ? 1 : 0
  return count + tree.children.reduce((sum, child) => sum + countSolutions(child), 0)
}

export default DecisionTreeVisualizer
