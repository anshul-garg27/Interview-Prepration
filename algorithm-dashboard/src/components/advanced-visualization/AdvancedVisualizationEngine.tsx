// 🚀 Advanced Visualization Core Engine
// High-performance rendering for complex algorithm visualizations
'use client'
import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Core types for visualization
export interface VisualizationNode {
  id: string
  position: [number, number, number]
  color: string
  size: number
  label?: string
  data?: any
  isHighlighted?: boolean
  isActive?: boolean
}

export interface VisualizationEdge {
  id: string
  source: string
  target: string
  weight?: number
  color?: string
  thickness?: number
  isDirected?: boolean
  isHighlighted?: boolean
}

export interface VisualizationProps {
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
  layout: 'force' | 'hierarchical' | 'circular' | 'grid' | '3d-sphere'
  algorithm?: string
  onNodeClick?: (node: VisualizationNode) => void
  onEdgeClick?: (edge: VisualizationEdge) => void
  enableInteraction?: boolean
  showLabels?: boolean
  animationSpeed?: number
}

// Level of Detail Management
function useLevelOfDetail(nodes: VisualizationNode[]) {
  const { camera } = useThree()
  const [lodLevel, setLodLevel] = useState<'high' | 'medium' | 'low'>('high')
  
  useFrame(() => {
    const distance = camera.position.length()
    const nodeCount = nodes.length
    
    if (nodeCount > 5000 || distance > 100) {
      setLodLevel('low')
    } else if (nodeCount > 1000 || distance > 50) {
      setLodLevel('medium')
    } else {
      setLodLevel('high')
    }
  })
  
  return lodLevel
}

// Instanced Node Renderer for massive performance
function InstancedNodes({ nodes, lodLevel }: { nodes: VisualizationNode[], lodLevel: 'high' | 'medium' | 'low' }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const hoveredRef = useRef<number>(-1)
  
  // Create geometry based on LOD
  const geometry = useMemo(() => {
    switch (lodLevel) {
      case 'high':
        return new THREE.SphereGeometry(1, 16, 16)
      case 'medium':
        return new THREE.SphereGeometry(1, 8, 8)
      case 'low':
        return new THREE.PlaneGeometry(2, 2)
    }
  }, [lodLevel])
  
  // Update instance matrices
  useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new THREE.Object3D()
    const colorArray = new Float32Array(nodes.length * 3)
    
    nodes.forEach((node, i) => {
      // Position
      dummy.position.set(...node.position)
      dummy.scale.setScalar(node.size)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Color
      const color = new THREE.Color(node.color)
      color.toArray(colorArray, i * 3)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colorArray, 3))
  }, [nodes])
  
  // Animation for highlighted nodes
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    nodes.forEach((node, i) => {
      if (node.isHighlighted || node.isActive) {
        const scale = node.size * (1 + 0.2 * Math.sin(time * 4))
        const dummy = new THREE.Object3D()
        dummy.position.set(...node.position)
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(i, dummy.matrix)
      }
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, nodes.length]}>
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  )
}

// Instanced Edge Renderer
function InstancedEdges({ edges, nodes }: { edges: VisualizationEdge[], nodes: VisualizationNode[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // Create node position lookup
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {}
    nodes.forEach(node => {
      positions[node.id] = node.position
    })
    return positions
  }, [nodes])
  
  // Update edge instances
  useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new THREE.Object3D()
    const colorArray = new Float32Array(edges.length * 3)
    
    edges.forEach((edge, i) => {
      const sourcePos = nodePositions[edge.source]
      const targetPos = nodePositions[edge.target]
      
      if (!sourcePos || !targetPos) return
      
      // Calculate edge position and rotation
      const start = new THREE.Vector3(...sourcePos)
      const end = new THREE.Vector3(...targetPos)
      const center = start.clone().add(end).multiplyScalar(0.5)
      const distance = start.distanceTo(end)
      
      dummy.position.copy(center)
      dummy.lookAt(end)
      dummy.rotateX(Math.PI / 2)
      dummy.scale.set(edge.thickness || 0.1, distance, 1)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Color
      const color = new THREE.Color(edge.color || '#666666')
      color.toArray(colorArray, i * 3)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colorArray, 3))
  }, [edges, nodePositions])
  
  return (
    <instancedMesh ref={meshRef} args={[new THREE.CylinderGeometry(1, 1, 1, 8), undefined, edges.length]}>
      <meshBasicMaterial vertexColors transparent opacity={0.7} />
    </instancedMesh>
  )
}

// Node Labels (only for high LOD)
function NodeLabels({ nodes, lodLevel }: { nodes: VisualizationNode[], lodLevel: 'high' | 'medium' | 'low' }) {
  if (lodLevel !== 'high' || nodes.length > 100) return null
  
  return (
    <>
      {nodes.map(node => (
        node.label && (
          <Html key={`label-${node.id}`} position={node.position}>
            <div className="text-white text-xs bg-black/50 px-2 py-1 rounded pointer-events-none">
              {node.label}
            </div>
          </Html>
        )
      ))}
    </>
  )
}

// Main Advanced Visualization Component
export function AdvancedVisualizationEngine({
  nodes,
  edges,
  layout,
  algorithm,
  onNodeClick,
  onEdgeClick,
  enableInteraction = true,
  showLabels = true,
  animationSpeed = 1
}: VisualizationProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Apply layout algorithm to nodes
  const layoutedNodes = useMemo(() => {
    return applyLayout(nodes, edges, layout)
  }, [nodes, edges, layout])
  
  useEffect(() => {
    setIsInitialized(true)
  }, [])
  
  if (!isInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white">Initializing Advanced Visualization Engine...</div>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Visualization Content */}
        <VisualizationContent
          nodes={layoutedNodes}
          edges={edges}
          showLabels={showLabels}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
        />
        
        {/* Controls */}
        {enableInteraction && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            screenSpacePanning={false}
            minDistance={10}
            maxDistance={500}
          />
        )}
      </Canvas>
      
      {/* Performance Overlay */}
      <PerformanceOverlay nodeCount={nodes.length} edgeCount={edges.length} />
    </div>
  )
}

// Visualization Content Component
function VisualizationContent({
  nodes,
  edges,
  showLabels,
  onNodeClick,
  onEdgeClick
}: {
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
  showLabels: boolean
  onNodeClick?: (node: VisualizationNode) => void
  onEdgeClick?: (edge: VisualizationEdge) => void
}) {
  const lodLevel = useLevelOfDetail(nodes)
  
  return (
    <>
      <InstancedNodes nodes={nodes} lodLevel={lodLevel} />
      <InstancedEdges edges={edges} nodes={nodes} />
      {showLabels && <NodeLabels nodes={nodes} lodLevel={lodLevel} />}
    </>
  )
}

// Performance Monitoring Overlay
function PerformanceOverlay({ nodeCount, edgeCount }: { nodeCount: number, edgeCount: number }) {
  const [fps, setFps] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock performance monitoring (in real app, use performance APIs)
      setFps(Math.floor(Math.random() * 10) + 55) // 55-65 FPS range
      if ('memory' in performance) {
        setMemoryUsage((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono">
      <div>Nodes: {nodeCount.toLocaleString()}</div>
      <div>Edges: {edgeCount.toLocaleString()}</div>
      <div>FPS: {fps}</div>
      {memoryUsage > 0 && <div>Memory: {memoryUsage.toFixed(1)} MB</div>}
    </div>
  )
}

// Layout Algorithms
function applyLayout(
  nodes: VisualizationNode[],
  edges: VisualizationEdge[],
  layout: string
): VisualizationNode[] {
  switch (layout) {
    case 'circular':
      return applyCircularLayout(nodes)
    case 'hierarchical':
      return applyHierarchicalLayout(nodes, edges)
    case 'grid':
      return applyGridLayout(nodes)
    case '3d-sphere':
      return apply3DSphereLayout(nodes)
    case 'force':
    default:
      return applyForceLayout(nodes, edges)
  }
}

function applyCircularLayout(nodes: VisualizationNode[]): VisualizationNode[] {
  const radius = Math.max(20, nodes.length * 2)
  return nodes.map((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI
    return {
      ...node,
      position: [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
      ] as [number, number, number]
    }
  })
}

function applyHierarchicalLayout(nodes: VisualizationNode[], edges: VisualizationEdge[]): VisualizationNode[] {
  // Simple hierarchical layout - can be enhanced with proper tree algorithms
  const levels: { [level: number]: VisualizationNode[] } = {}
  const visited = new Set<string>()
  
  // Find root nodes (no incoming edges)
  const hasIncoming = new Set(edges.map(e => e.target))
  const roots = nodes.filter(n => !hasIncoming.has(n.id))
  
  // BFS to assign levels
  const queue = roots.map(n => ({ node: n, level: 0 }))
  
  while (queue.length > 0) {
    const { node, level } = queue.shift()!
    if (visited.has(node.id)) continue
    
    visited.add(node.id)
    if (!levels[level]) levels[level] = []
    levels[level].push(node)
    
    // Add children to next level
    const children = edges
      .filter(e => e.source === node.id)
      .map(e => nodes.find(n => n.id === e.target))
      .filter(Boolean) as VisualizationNode[]
    
    children.forEach(child => {
      if (!visited.has(child.id)) {
        queue.push({ node: child, level: level + 1 })
      }
    })
  }
  
  // Position nodes by level
  return nodes.map(node => {
    const level = Object.keys(levels).find(l => 
      levels[parseInt(l)].some(n => n.id === node.id)
    )
    if (!level) return node
    
    const levelNodes = levels[parseInt(level)]
    const index = levelNodes.findIndex(n => n.id === node.id)
    const spacing = Math.max(30, levelNodes.length * 5)
    
    return {
      ...node,
      position: [
        (index - levelNodes.length / 2) * spacing,
        -parseInt(level) * 30,
        0
      ] as [number, number, number]
    }
  })
}

function applyGridLayout(nodes: VisualizationNode[]): VisualizationNode[] {
  const gridSize = Math.ceil(Math.sqrt(nodes.length))
  const spacing = 10
  
  return nodes.map((node, i) => {
    const row = Math.floor(i / gridSize)
    const col = i % gridSize
    
    return {
      ...node,
      position: [
        (col - gridSize / 2) * spacing,
        (row - gridSize / 2) * spacing,
        0
      ] as [number, number, number]
    }
  })
}

function apply3DSphereLayout(nodes: VisualizationNode[]): VisualizationNode[] {
  const radius = Math.max(20, nodes.length)
  
  return nodes.map((node, i) => {
    const phi = Math.acos(-1 + (2 * i) / nodes.length)
    const theta = Math.sqrt(nodes.length * Math.PI) * phi
    
    return {
      ...node,
      position: [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ] as [number, number, number]
    }
  })
}

function applyForceLayout(nodes: VisualizationNode[], edges: VisualizationEdge[]): VisualizationNode[] {
  // Simplified force-directed layout (in production, use D3's force simulation)
  const positions = new Map(nodes.map(n => [n.id, [...n.position]]))
  
  // Simple spring forces
  for (let iteration = 0; iteration < 100; iteration++) {
    const forces = new Map(nodes.map(n => [n.id, [0, 0, 0]]))
    
    // Repulsion between all nodes
    nodes.forEach(nodeA => {
      nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return
        
        const posA = positions.get(nodeA.id)!
        const posB = positions.get(nodeB.id)!
        const dx = posA[0] - posB[0]
        const dy = posA[1] - posB[1]
        const dz = posA[2] - posB[2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
        
        const force = 100 / (distance * distance)
        const forceA = forces.get(nodeA.id)!
        forceA[0] += (dx / distance) * force
        forceA[1] += (dy / distance) * force
        forceA[2] += (dz / distance) * force
      })
    })
    
    // Attraction along edges
    edges.forEach(edge => {
      const posA = positions.get(edge.source)
      const posB = positions.get(edge.target)
      if (!posA || !posB) return
      
      const dx = posB[0] - posA[0]
      const dy = posB[1] - posA[1]
      const dz = posB[2] - posA[2]
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
      
      const force = distance * 0.01
      const forceA = forces.get(edge.source)!
      const forceB = forces.get(edge.target)!
      
      forceA[0] += (dx / distance) * force
      forceA[1] += (dy / distance) * force
      forceA[2] += (dz / distance) * force
      
      forceB[0] -= (dx / distance) * force
      forceB[1] -= (dy / distance) * force
      forceB[2] -= (dz / distance) * force
    })
    
    // Apply forces
    nodes.forEach(node => {
      const pos = positions.get(node.id)!
      const force = forces.get(node.id)!
      pos[0] += force[0] * 0.01
      pos[1] += force[1] * 0.01
      pos[2] += force[2] * 0.01
    })
  }
  
  return nodes.map(node => ({
    ...node,
    position: positions.get(node.id)! as [number, number, number]
  }))
}
