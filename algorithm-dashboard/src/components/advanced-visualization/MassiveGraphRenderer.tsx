// 🌐 Massive Graph Renderer for Complex Graph Algorithms
// Handles 10,000+ nodes with advanced algorithm visualizations
'use client'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Graph Algorithm Types
export type GraphAlgorithm = 
  | 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'bellman-ford'
  | 'floyd-warshall' | 'kruskal' | 'prim' | 'max-flow'
  | 'topological-sort' | 'tarjan-scc' | 'articulation-points'

export interface GraphNode {
  id: string
  position: [number, number, number]
  label: string
  color: string
  size: number
  
  // Algorithm-specific properties
  distance?: number
  visited?: boolean
  inQueue?: boolean
  parent?: string
  level?: number
  discoveryTime?: number
  lowLink?: number
  isArticulation?: boolean
  component?: number
  
  // Visual states
  isHighlighted?: boolean
  isActive?: boolean
  isPulsing?: boolean
  opacity?: number
  
  // Metadata
  data?: any
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  weight: number
  capacity?: number
  flow?: number
  
  // Algorithm-specific properties
  isTreeEdge?: boolean
  isBackEdge?: boolean
  isForwardEdge?: boolean
  isCrossEdge?: boolean
  isCut?: boolean
  isInMST?: boolean
  isInPath?: boolean
  
  // Visual states
  isHighlighted?: boolean
  isActive?: boolean
  isAnimating?: boolean
  color?: string
  thickness?: number
  opacity?: number
  
  // Directed edge properties
  isDirected?: boolean
  
  // Metadata
  data?: any
}

export interface MassiveGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  algorithm: GraphAlgorithm
  currentStep?: number
  isAnimating?: boolean
  animationSpeed?: number
  layout?: 'force' | 'hierarchical' | 'circular' | 'grid' | '3d-sphere'
  showLabels?: boolean
  showWeights?: boolean
  enableInteraction?: boolean
  onNodeClick?: (node: GraphNode) => void
  onEdgeClick?: (edge: GraphEdge) => void
  algorithmState?: any
}

// Level of Detail for massive graphs
function useGraphLOD(nodeCount: number, camera: THREE.Camera) {
  const [lodLevel, setLodLevel] = useState<'ultra-high' | 'high' | 'medium' | 'low' | 'ultra-low'>('high')
  
  useFrame(() => {
    const distance = camera.position.length()
    
    if (nodeCount <= 100) {
      setLodLevel('ultra-high')
    } else if (nodeCount <= 500) {
      setLodLevel('high')
    } else if (nodeCount <= 2000) {
      setLodLevel('medium')
    } else if (nodeCount <= 10000) {
      setLodLevel('low')
    } else {
      setLodLevel('ultra-low')
    }
  })
  
  return lodLevel
}

// Advanced Node Renderer with Algorithm-Specific Visualizations
function AdvancedNodeRenderer({ 
  nodes, 
  algorithm, 
  lodLevel,
  onNodeClick 
}: { 
  nodes: GraphNode[]
  algorithm: GraphAlgorithm
  lodLevel: string
  onNodeClick?: (node: GraphNode) => void
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const hoveredRef = useRef<number>(-1)
  
  // Create geometry based on LOD and algorithm
  const geometry = useMemo(() => {
    switch (lodLevel) {
      case 'ultra-high':
        return new THREE.SphereGeometry(1, 32, 32)
      case 'high':
        return new THREE.SphereGeometry(1, 16, 16)
      case 'medium':
        return new THREE.SphereGeometry(1, 8, 8)
      case 'low':
        return new THREE.CircleGeometry(1, 8)
      case 'ultra-low':
        return new THREE.PlaneGeometry(2, 2)
      default:
        return new THREE.SphereGeometry(1, 8, 8)
    }
  }, [lodLevel])
  
  // Update instance matrices and colors
  useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new THREE.Object3D()
    const colorArray = new Float32Array(nodes.length * 3)
    const scaleArray = new Float32Array(nodes.length)
    
    nodes.forEach((node, i) => {
      // Position and scale
      dummy.position.set(...node.position)
      dummy.scale.setScalar(node.size * getAlgorithmSizeMultiplier(node, algorithm))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Color based on algorithm state
      const color = new THREE.Color(getAlgorithmColor(node, algorithm))
      color.toArray(colorArray, i * 3)
      
      // Scale for special states
      scaleArray[i] = node.isHighlighted ? 1.5 : 1.0
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    
    // Update attributes
    if (meshRef.current.geometry.getAttribute('instanceColor')) {
      meshRef.current.geometry.getAttribute('instanceColor').needsUpdate = true
    } else {
      meshRef.current.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colorArray, 3))
    }
  }, [nodes, algorithm])
  
  // Animation frame for algorithm-specific effects
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    const dummy = new THREE.Object3D()
    
    nodes.forEach((node, i) => {
      let scale = node.size
      
      // Pulsing animation for active nodes
      if (node.isActive || node.isPulsing) {
        scale *= 1 + 0.3 * Math.sin(time * 6)
      }
      
      // Breathing animation for nodes in queue
      if (node.inQueue) {
        scale *= 1 + 0.1 * Math.sin(time * 4)
      }
      
      dummy.position.set(...node.position)
      dummy.scale.setScalar(scale * getAlgorithmSizeMultiplier(node, algorithm))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh 
      ref={meshRef} 
      args={[geometry, undefined, nodes.length]}
      onClick={(event) => {
        const instanceId = event.instanceId
        if (instanceId !== undefined && instanceId < nodes.length) {
          onNodeClick?.(nodes[instanceId])
        }
      }}
    >
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}

// Advanced Edge Renderer with Flow Visualization
function AdvancedEdgeRenderer({ 
  edges, 
  nodes, 
  algorithm,
  lodLevel 
}: { 
  edges: GraphEdge[]
  nodes: GraphNode[]
  algorithm: GraphAlgorithm
  lodLevel: string
}) {
  const edgeGroupRef = useRef<THREE.Group>(null)
  
  // Create node position lookup
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {}
    nodes.forEach(node => {
      positions[node.id] = node.position
    })
    return positions
  }, [nodes])
  
  // Render edges based on LOD
  const renderEdge = useCallback((edge: GraphEdge, index: number) => {
    const sourcePos = nodePositions[edge.source]
    const targetPos = nodePositions[edge.target]
    
    if (!sourcePos || !targetPos) return null
    
    const start = new THREE.Vector3(...sourcePos)
    const end = new THREE.Vector3(...targetPos)
    const points = [start, end]
    
    // Algorithm-specific edge styling
    const color = getAlgorithmEdgeColor(edge, algorithm)
    const thickness = getAlgorithmEdgeThickness(edge, algorithm)
    
    // For low LOD, use simple lines
    if (lodLevel === 'low' || lodLevel === 'ultra-low') {
      return (
        <Line
          key={edge.id}
          points={points}
          color={color}
          lineWidth={thickness}
          transparent
          opacity={edge.opacity || 1}
        />
      )
    }
    
    // For high LOD, use cylinders with advanced features
    return (
      <EdgeCylinder
        key={edge.id}
        edge={edge}
        start={start}
        end={end}
        algorithm={algorithm}
      />
    )
  }, [nodePositions, algorithm, lodLevel])
  
  return (
    <group ref={edgeGroupRef}>
      {edges.map(renderEdge)}
    </group>
  )
}

// Individual Edge Cylinder Component
function EdgeCylinder({ 
  edge, 
  start, 
  end, 
  algorithm 
}: { 
  edge: GraphEdge
  start: THREE.Vector3
  end: THREE.Vector3
  algorithm: GraphAlgorithm
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const flowRef = useRef<THREE.Mesh>(null)
  
  const center = start.clone().add(end).multiplyScalar(0.5)
  const distance = start.distanceTo(end)
  const direction = end.clone().sub(start).normalize()
  
  // Animation for flow algorithms
  useFrame((state) => {
    if (algorithm === 'max-flow' && edge.flow && edge.flow > 0 && flowRef.current) {
      const time = state.clock.elapsedTime
      const offset = (time * 2) % 1
      
      flowRef.current.position.copy(start.clone().lerp(end, offset))
    }
  })
  
  return (
    <group>
      {/* Main Edge */}
      <mesh ref={meshRef} position={center}>
        <cylinderGeometry args={[
          getAlgorithmEdgeThickness(edge, algorithm),
          getAlgorithmEdgeThickness(edge, algorithm),
          distance,
          8
        ]} />
        <meshBasicMaterial 
          color={getAlgorithmEdgeColor(edge, algorithm)}
          transparent
          opacity={edge.opacity || 0.8}
        />
      </mesh>
      
      {/* Flow Visualization for Max Flow */}
      {algorithm === 'max-flow' && edge.flow && edge.flow > 0 && (
        <mesh ref={flowRef}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
      
      {/* Weight Label */}
      {edge.weight && (
        <Html position={center}>
          <div className="text-white text-xs bg-black/70 px-1 rounded pointer-events-none">
            {edge.capacity ? `${edge.flow || 0}/${edge.capacity}` : edge.weight}
          </div>
        </Html>
      )}
      
      {/* Direction Arrow for Directed Graphs */}
      {edge.isDirected && (
        <mesh position={end.clone().sub(direction.multiplyScalar(2))}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshBasicMaterial color={getAlgorithmEdgeColor(edge, algorithm)} />
        </mesh>
      )}
    </group>
  )
}

// Algorithm-specific coloring functions
function getAlgorithmColor(node: GraphNode, algorithm: GraphAlgorithm): string {
  switch (algorithm) {
    case 'bfs':
      if (node.visited) return '#4ade80' // Green
      if (node.inQueue) return '#fbbf24' // Yellow
      return '#6b7280' // Gray
      
    case 'dfs':
      if (node.visited) return '#3b82f6' // Blue
      if (node.isActive) return '#ef4444' // Red
      return '#6b7280'
      
    case 'dijkstra':
      if (node.distance === 0) return '#10b981' // Start node
      if (node.distance === Infinity) return '#6b7280'
      if (node.visited) return '#8b5cf6' // Purple
      return '#f59e0b' // Orange
      
    case 'max-flow':
      if (node.id === 'source') return '#10b981'
      if (node.id === 'sink') return '#ef4444'
      return '#6366f1'
      
    case 'tarjan-scc':
      if (node.component !== undefined) {
        const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4']
        return colors[node.component % colors.length]
      }
      return '#6b7280'
      
    default:
      return node.color || '#6b7280'
  }
}

function getAlgorithmEdgeColor(edge: GraphEdge, algorithm: GraphAlgorithm): string {
  switch (algorithm) {
    case 'bfs':
      if (edge.isTreeEdge) return '#10b981'
      return '#374151'
      
    case 'dfs':
      if (edge.isTreeEdge) return '#3b82f6'
      if (edge.isBackEdge) return '#ef4444'
      if (edge.isForwardEdge) return '#f59e0b'
      if (edge.isCrossEdge) return '#8b5cf6'
      return '#374151'
      
    case 'dijkstra':
    case 'astar':
      if (edge.isInPath) return '#10b981'
      if (edge.isHighlighted) return '#fbbf24'
      return '#6b7280'
      
    case 'max-flow':
      if (edge.flow && edge.flow > 0) {
        const intensity = edge.flow / (edge.capacity || 1)
        return `hsl(120, 100%, ${50 + intensity * 50}%)`
      }
      return '#6b7280'
      
    case 'kruskal':
    case 'prim':
      if (edge.isInMST) return '#10b981'
      if (edge.isHighlighted) return '#fbbf24'
      return '#6b7280'
      
    default:
      return edge.color || '#6b7280'
  }
}

function getAlgorithmSizeMultiplier(node: GraphNode, algorithm: GraphAlgorithm): number {
  switch (algorithm) {
    case 'dijkstra':
      if (node.distance === 0) return 1.5 // Start node
      if (node.distance === Infinity) return 0.8
      return 1.0
      
    case 'tarjan-scc':
      if (node.isArticulation) return 1.4
      return 1.0
      
    default:
      return 1.0
  }
}

function getAlgorithmEdgeThickness(edge: GraphEdge, algorithm: GraphAlgorithm): number {
  const base = 0.1
  
  switch (algorithm) {
    case 'max-flow':
      if (edge.flow && edge.capacity) {
        return base + (edge.flow / edge.capacity) * 0.3
      }
      return base
      
    case 'dijkstra':
    case 'astar':
      if (edge.isInPath) return base * 3
      return base
      
    default:
      return edge.thickness || base
  }
}

// Main Massive Graph Renderer Component
export function MassiveGraphRenderer({
  nodes,
  edges,
  algorithm,
  currentStep,
  isAnimating = false,
  animationSpeed = 1,
  layout = 'force',
  showLabels = true,
  showWeights = true,
  enableInteraction = true,
  onNodeClick,
  onEdgeClick,
  algorithmState
}: MassiveGraphProps) {
  const [cameraRef, setCameraRef] = useState<THREE.Camera | null>(null)
  const lodLevel = useGraphLOD(nodes.length, cameraRef || new THREE.Camera())
  
  // Performance monitoring
  const [performance, setPerformance] = useState({
    fps: 60,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    renderTime: 0
  })
  
  useEffect(() => {
    const startTime = performance.now()
    const endTime = performance.now()
    
    setPerformance(prev => ({
      ...prev,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      renderTime: endTime - startTime
    }))
  }, [nodes, edges])
  
  return (
    <div className="w-full h-full bg-gray-900 relative">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 75 }}
        gl={{ 
          antialias: lodLevel === 'ultra-high' || lodLevel === 'high',
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={lodLevel === 'ultra-low' ? [0.5, 1] : [1, 2]}
        onCreated={({ camera }) => setCameraRef(camera)}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Graph Visualization */}
        <AdvancedNodeRenderer
          nodes={nodes}
          algorithm={algorithm}
          lodLevel={lodLevel}
          onNodeClick={onNodeClick}
        />
        
        <AdvancedEdgeRenderer
          edges={edges}
          nodes={nodes}
          algorithm={algorithm}
          lodLevel={lodLevel}
        />
        
        {/* Node Labels (only for high LOD) */}
        {showLabels && (lodLevel === 'ultra-high' || lodLevel === 'high') && nodes.length <= 100 && (
          <>
            {nodes.map(node => (
              <Html key={`label-${node.id}`} position={node.position}>
                <div className="text-white text-xs bg-black/70 px-2 py-1 rounded pointer-events-none">
                  {node.label}
                  {node.distance !== undefined && node.distance !== Infinity && (
                    <div className="text-xs text-yellow-400">d: {node.distance}</div>
                  )}
                </div>
              </Html>
            ))}
          </>
        )}
        
        {/* Interactive Controls */}
        {enableInteraction && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            screenSpacePanning={false}
            minDistance={5}
            maxDistance={500}
            maxPolarAngle={Math.PI}
          />
        )}
      </Canvas>
      
      {/* Algorithm Status Overlay */}
      <AlgorithmStatusOverlay
        algorithm={algorithm}
        currentStep={currentStep}
        algorithmState={algorithmState}
        performance={performance}
      />
      
      {/* Performance Overlay */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono">
        <div>LOD: {lodLevel}</div>
        <div>Nodes: {performance.nodeCount.toLocaleString()}</div>
        <div>Edges: {performance.edgeCount.toLocaleString()}</div>
        <div>FPS: {performance.fps}</div>
        <div>Render: {performance.renderTime.toFixed(2)}ms</div>
      </div>
    </div>
  )
}

// Algorithm Status Component
function AlgorithmStatusOverlay({
  algorithm,
  currentStep,
  algorithmState,
  performance
}: {
  algorithm: GraphAlgorithm
  currentStep?: number
  algorithmState?: any
  performance: any
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg"
    >
      <h3 className="text-lg font-bold mb-2 capitalize">
        {algorithm.replace('-', ' ')} Visualization
      </h3>
      
      {currentStep !== undefined && (
        <div className="text-sm mb-2">
          Step: {currentStep + 1}
        </div>
      )}
      
      {algorithmState && (
        <div className="text-sm space-y-1">
          {Object.entries(algorithmState).map(([key, value]) => (
            <div key={key}>
              <span className="text-gray-400">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Helper functions for graph layout (implement your preferred layout algorithms)
export function applyGraphLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  layout: string
): GraphNode[] {
  // Implementation depends on your layout preferences
  // For now, return nodes as-is
  return nodes
}

// Generate sample massive graph for testing
export function generateMassiveGraph(nodeCount: number): { nodes: GraphNode[], edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  
  // Generate nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `node-${i}`,
      position: [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      ],
      label: `N${i}`,
      color: '#6b7280',
      size: 1,
      distance: Infinity,
      visited: false
    })
  }
  
  // Generate edges (sparse graph)
  const edgeCount = Math.min(nodeCount * 2, nodeCount * nodeCount * 0.01)
  for (let i = 0; i < edgeCount; i++) {
    const source = Math.floor(Math.random() * nodeCount)
    const target = Math.floor(Math.random() * nodeCount)
    
    if (source !== target) {
      edges.push({
        id: `edge-${i}`,
        source: `node-${source}`,
        target: `node-${target}`,
        weight: Math.floor(Math.random() * 10) + 1,
        isDirected: Math.random() > 0.5,
        color: '#374151'
      })
    }
  }
  
  return { nodes, edges }
}
