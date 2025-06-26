import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'

interface TreeNode {
  id: string
  value: number
  children?: TreeNode[]
  x?: number
  y?: number
}

interface TreeVisualizerProps {}

const TreeVisualizer: React.FC<TreeVisualizerProps> = () => {
  const [treeData, setTreeData] = useState<TreeNode>({
    id: 'root',
    value: 50,
    children: [
      {
        id: 'left',
        value: 30,
        children: [
          { id: 'left-left', value: 20 },
          { id: 'left-right', value: 40 }
        ]
      },
      {
        id: 'right',
        value: 70,
        children: [
          { id: 'right-left', value: 60 },
          { id: 'right-right', value: 80 }
        ]
      }
    ]
  })

  const [traversalOrder, setTraversalOrder] = useState<string[]>([])
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>('preorder')
  const [isAnimating, setIsAnimating] = useState(false)

  // Tree traversal algorithms
  const preorderTraversal = useCallback((node: TreeNode): string[] => {
    if (!node) return []
    const result = [node.id]
    if (node.children) {
      node.children.forEach(child => {
        result.push(...preorderTraversal(child))
      })
    }
    return result
  }, [])

  const inorderTraversal = useCallback((node: TreeNode): string[] => {
    if (!node) return []
    const result: string[] = []
    if (node.children && node.children[0]) {
      result.push(...inorderTraversal(node.children[0]))
    }
    result.push(node.id)
    if (node.children && node.children[1]) {
      result.push(...inorderTraversal(node.children[1]))
    }
    return result
  }, [])

  const postorderTraversal = useCallback((node: TreeNode): string[] => {
    if (!node) return []
    const result: string[] = []
    if (node.children) {
      node.children.forEach(child => {
        result.push(...postorderTraversal(child))
      })
    }
    result.push(node.id)
    return result
  }, [])

  const animateTraversal = useCallback(async (type: 'preorder' | 'inorder' | 'postorder') => {
    setIsAnimating(true)
    setTraversalOrder([])
    setCurrentNode(null)

    let order: string[] = []
    switch (type) {
      case 'preorder':
        order = preorderTraversal(treeData)
        break
      case 'inorder':
        order = inorderTraversal(treeData)
        break
      case 'postorder':
        order = postorderTraversal(treeData)
        break
    }

    for (let i = 0; i < order.length; i++) {
      setCurrentNode(order[i])
      setTraversalOrder(prev => [...prev, order[i]])
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setCurrentNode(null)
    setIsAnimating(false)
  }, [treeData, preorderTraversal, inorderTraversal, postorderTraversal])

  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const isActive = currentNode === node.id
    const hasBeenVisited = traversalOrder.includes(node.id)

    return (
      <div className="flex flex-col items-center">
        <motion.div
          animate={isActive ? { scale: 1.2, boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' } : {}}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg
            transition-all duration-300 border-2
            ${isActive 
              ? 'bg-blue-500 text-white border-blue-300' 
              : hasBeenVisited
                ? 'bg-green-500 text-white border-green-300'
                : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'
            }
          `}
        >
          {node.value}
        </motion.div>
        
        {node.children && (
          <div className="mt-8 flex space-x-16">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Connection line */}
                <div className={`
                  absolute -top-8 left-1/2 w-0.5 h-8 bg-gray-400
                  ${index === 0 ? 'origin-bottom -rotate-45' : 'origin-bottom rotate-45'}
                `} />
                <TreeNodeComponent node={child} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">🌳 Binary Tree Visualizer</h2>
        <p className="text-blue-200">
          Interactive tree traversals with real-time animation
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {(['preorder', 'inorder', 'postorder'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setTraversalType(type)
              animateTraversal(type)
            }}
            disabled={isAnimating}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${traversalType === type
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Traversal
          </button>
        ))}
      </div>

      {/* Tree Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex justify-center">
          <TreeNodeComponent node={treeData} />
        </div>
      </div>

      {/* Traversal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Traversal Order</h3>
          <div className="flex flex-wrap gap-2">
            {traversalOrder.map((nodeId, index) => (
              <motion.span
                key={`${nodeId}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-green-500 text-white rounded-lg font-semibold"
              >
                {treeData.id === nodeId ? treeData.value : 
                 treeData.children?.find(c => c.id === nodeId)?.value ||
                 treeData.children?.flatMap(c => c.children || []).find(c => c.id === nodeId)?.value}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Algorithm Explanation</h3>
          <div className="text-blue-200">
            {traversalType === 'preorder' && (
              <div>
                <strong>Preorder:</strong> Visit Root → Left → Right
                <br />
                <span className="text-sm">Good for copying/cloning trees</span>
              </div>
            )}
            {traversalType === 'inorder' && (
              <div>
                <strong>Inorder:</strong> Visit Left → Root → Right
                <br />
                <span className="text-sm">Gives sorted order in BST</span>
              </div>
            )}
            {traversalType === 'postorder' && (
              <div>
                <strong>Postorder:</strong> Visit Left → Right → Root
                <br />
                <span className="text-sm">Good for deletion/cleanup</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">📝 Code Implementation</h3>
        <pre className="text-green-400 text-sm overflow-x-auto">
{traversalType === 'preorder' && `
function preorderTraversal(node) {
  if (!node) return [];
  
  const result = [node.value];
  if (node.left) result.push(...preorderTraversal(node.left));
  if (node.right) result.push(...preorderTraversal(node.right));
  
  return result;
}
`}
{traversalType === 'inorder' && `
function inorderTraversal(node) {
  if (!node) return [];
  
  const result = [];
  if (node.left) result.push(...inorderTraversal(node.left));
  result.push(node.value);
  if (node.right) result.push(...inorderTraversal(node.right));
  
  return result;
}
`}
{traversalType === 'postorder' && `
function postorderTraversal(node) {
  if (!node) return [];
  
  const result = [];
  if (node.left) result.push(...postorderTraversal(node.left));
  if (node.right) result.push(...postorderTraversal(node.right));
  result.push(node.value);
  
  return result;
}
`}
        </pre>
      </div>
    </div>
  )
}

export default TreeVisualizer
