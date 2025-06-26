// 🎯 Optimized Dynamic Programming Grid Renderer
// Handles massive DP tables (1000x1000+) with smooth performance
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'

// DP Cell Types
export interface DPCell {
  value: number | string
  isOptimal?: boolean
  isCurrentStep?: boolean
  isCalculated?: boolean
  dependencies?: [number, number][]
  computation?: string
  metadata?: any
}

export interface DPGridProps {
  dpTable: DPCell[][]
  algorithm: 'knapsack' | 'lcs' | 'editDistance' | 'coinChange' | 'matrixChain' | 'custom'
  currentRow?: number
  currentCol?: number
  optimalPath?: [number, number][]
  isAnimating?: boolean
  animationSpeed?: number
  showDependencies?: boolean
  showComputations?: boolean
  onCellClick?: (row: number, col: number, cell: DPCell) => void
  onPathHighlight?: (path: [number, number][]) => void
}

// Memoized Cell Component for Performance
const DPCell = ({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}: {
  columnIndex: number
  rowIndex: number
  style: React.CSSProperties
  data: any
}) => {
  const {
    dpTable,
    algorithm,
    currentRow,
    currentCol,
    optimalPath,
    showDependencies,
    showComputations,
    onCellClick
  } = data
  
  const cell = dpTable[rowIndex]?.[columnIndex]
  if (!cell) return <div style={style} />
  
  const isOptimal = optimalPath?.some(([r, c]) => r === rowIndex && c === columnIndex)
  const isCurrent = currentRow === rowIndex && currentCol === columnIndex
  const isCalculated = cell.isCalculated
  
  // Algorithm-specific styling
  const getCellColor = () => {
    if (isCurrent) return 'bg-yellow-400 text-black'
    if (isOptimal) return 'bg-green-500 text-white'
    if (isCalculated) return 'bg-blue-500/30 text-white'
    return 'bg-gray-800 text-gray-300'
  }
  
  // Get cell content based on algorithm
  const getCellContent = () => {
    switch (algorithm) {
      case 'knapsack':
        return typeof cell.value === 'number' ? cell.value : '0'
      case 'lcs':
        return cell.value
      case 'editDistance':
        return cell.value
      case 'coinChange':
        return cell.value === Infinity ? '∞' : cell.value
      case 'matrixChain':
        return cell.value === Infinity ? '∞' : cell.value
      default:
        return cell.value
    }
  }
  
  return (
    <motion.div
      style={style}
      className={`
        border border-gray-600 flex items-center justify-center text-xs font-mono
        cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10
        ${getCellColor()}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: isCalculated ? (rowIndex + columnIndex) * 0.02 : 0 
      }}
      onClick={() => onCellClick?.(rowIndex, columnIndex, cell)}
      whileHover={{ scale: 1.1, zIndex: 10 }}
    >
      <div className="text-center">
        <div className="font-bold">{getCellContent()}</div>
        {showComputations && cell.computation && (
          <div className="text-xs opacity-70 mt-1">
            {cell.computation}
          </div>
        )}
      </div>
      
      {/* Dependencies Visualization */}
      {showDependencies && cell.dependencies && cell.dependencies.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {cell.dependencies.map(([depRow, depCol], index) => (
            <DependencyArrow
              key={index}
              from={[depRow, depCol]}
              to={[rowIndex, columnIndex]}
              color="rgba(255, 255, 0, 0.6)"
            />
          ))}
        </div>
      )}
      
      {/* Current Step Indicator */}
      {isCurrent && (
        <motion.div
          className="absolute inset-0 border-2 border-yellow-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

// Dependency Arrow Component
function DependencyArrow({ 
  from, 
  to, 
  color 
}: { 
  from: [number, number]
  to: [number, number]
  color: string 
}) {
  // Calculate arrow path (simplified - in production use SVG paths)
  const dx = to[1] - from[1]
  const dy = to[0] - from[0]
  const angle = Math.atan2(dy, dx)
  
  return (
    <div
      className="absolute w-0.5 h-0.5 opacity-60"
      style={{
        background: color,
        transform: `rotate(${angle}rad)`,
        transformOrigin: '0 0',
        width: Math.sqrt(dx * dx + dy * dy) * 20, // Scale factor
        left: from[1] * 20,
        top: from[0] * 20
      }}
    />
  )
}

// Algorithm Pattern Visualizations
function AlgorithmPatternOverlay({ 
  algorithm, 
  dpTable, 
  currentRow, 
  currentCol 
}: {
  algorithm: string
  dpTable: DPCell[][]
  currentRow?: number
  currentCol?: number
}) {
  switch (algorithm) {
    case 'knapsack':
      return <KnapsackPatternOverlay dpTable={dpTable} currentRow={currentRow} currentCol={currentCol} />
    case 'lcs':
      return <LCSPatternOverlay dpTable={dpTable} currentRow={currentRow} currentCol={currentCol} />
    case 'editDistance':
      return <EditDistancePatternOverlay dpTable={dpTable} currentRow={currentRow} currentCol={currentCol} />
    default:
      return null
  }
}

// Knapsack-specific visualization
function KnapsackPatternOverlay({ 
  dpTable, 
  currentRow, 
  currentCol 
}: {
  dpTable: DPCell[][]
  currentRow?: number
  currentCol?: number
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Weight capacity indicator */}
      {currentCol !== undefined && (
        <div 
          className="absolute top-0 bg-blue-500/20 w-0.5"
          style={{ 
            left: currentCol * 60,
            height: '100%'
          }}
        />
      )}
      
      {/* Item consideration indicator */}
      {currentRow !== undefined && (
        <div 
          className="absolute left-0 bg-green-500/20 h-0.5"
          style={{ 
            top: currentRow * 40,
            width: '100%'
          }}
        />
      )}
    </div>
  )
}

// LCS-specific visualization
function LCSPatternOverlay({ 
  dpTable, 
  currentRow, 
  currentCol 
}: {
  dpTable: DPCell[][]
  currentRow?: number
  currentCol?: number
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Diagonal highlighting for matches */}
      {dpTable.map((row, r) => 
        row.map((cell, c) => {
          if (r > 0 && c > 0 && cell.value === dpTable[r-1][c-1].value) {
            return (
              <div
                key={`${r}-${c}`}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                  left: c * 60 + 30,
                  top: r * 40 + 20
                }}
              />
            )
          }
          return null
        })
      )}
    </div>
  )
}

// Edit Distance-specific visualization
function EditDistancePatternOverlay({ 
  dpTable, 
  currentRow, 
  currentCol 
}: {
  dpTable: DPCell[][]
  currentRow?: number
  currentCol?: number
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Operation indicators */}
      {dpTable.map((row, r) => 
        row.map((cell, c) => {
          if (r > 0 && c > 0) {
            const operations = []
            
            // Insert (from left)
            if (cell.value === dpTable[r][c-1].value + 1) {
              operations.push('insert')
            }
            
            // Delete (from above)
            if (cell.value === dpTable[r-1][c].value + 1) {
              operations.push('delete')
            }
            
            // Replace (from diagonal)
            if (cell.value === dpTable[r-1][c-1].value + 1) {
              operations.push('replace')
            }
            
            return operations.map((op, index) => (
              <div
                key={`${r}-${c}-${op}`}
                className={`absolute w-2 h-2 rounded-full ${
                  op === 'insert' ? 'bg-green-400' :
                  op === 'delete' ? 'bg-red-400' : 'bg-yellow-400'
                }`}
                style={{
                  left: c * 60 + index * 8,
                  top: r * 40 + 35
                }}
              />
            ))
          }
          return null
        })
      )}
    </div>
  )
}

// Main DP Grid Renderer
export function OptimizedDPGrid({
  dpTable,
  algorithm,
  currentRow,
  currentCol,
  optimalPath,
  isAnimating = false,
  animationSpeed = 1,
  showDependencies = false,
  showComputations = false,
  onCellClick,
  onPathHighlight
}: DPGridProps) {
  const gridRef = useRef<any>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null)
  const [viewportInfo, setViewportInfo] = useState({ startRow: 0, endRow: 0, startCol: 0, endCol: 0 })
  
  // Grid dimensions
  const rowCount = dpTable.length
  const columnCount = dpTable[0]?.length || 0
  const cellHeight = 40
  const cellWidth = 60
  
  // Auto-scroll to current step
  useEffect(() => {
    if (currentRow !== undefined && currentCol !== undefined && gridRef.current) {
      gridRef.current.scrollToItem({
        rowIndex: currentRow,
        columnIndex: currentCol,
        align: 'center'
      })
    }
  }, [currentRow, currentCol])
  
  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, cell: DPCell) => {
    setSelectedCell({ row, col })
    onCellClick?.(row, col, cell)
    
    // Highlight path to this cell
    if (onPathHighlight && cell.dependencies) {
      const path = findPathToCell(dpTable, row, col)
      onPathHighlight(path)
    }
  }, [dpTable, onCellClick, onPathHighlight])
  
  // Memoized item data for performance
  const itemData = useMemo(() => ({
    dpTable,
    algorithm,
    currentRow,
    currentCol,
    optimalPath,
    showDependencies,
    showComputations,
    onCellClick: handleCellClick
  }), [
    dpTable,
    algorithm,
    currentRow,
    currentCol,
    optimalPath,
    showDependencies,
    showComputations,
    handleCellClick
  ])
  
  return (
    <div className="w-full h-full bg-gray-900 relative">
      {/* Grid Headers */}
      <div className="absolute top-0 left-0 z-10 bg-gray-800 border-b border-gray-600">
        <div className="flex">
          {/* Corner cell */}
          <div className="w-16 h-8 border-r border-gray-600 flex items-center justify-center text-xs text-gray-400">
            {algorithm}
          </div>
          
          {/* Column headers */}
          {Array.from({ length: Math.min(columnCount, 50) }, (_, i) => (
            <div 
              key={i}
              className="flex items-center justify-center text-xs text-gray-400 border-r border-gray-600"
              style={{ width: cellWidth, height: 32 }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
      
      {/* Row headers */}
      <div className="absolute top-8 left-0 z-10 bg-gray-800 border-r border-gray-600">
        {Array.from({ length: Math.min(rowCount, 50) }, (_, i) => (
          <div 
            key={i}
            className="flex items-center justify-center text-xs text-gray-400 border-b border-gray-600"
            style={{ width: 64, height: cellHeight }}
          >
            {i}
          </div>
        ))}
      </div>
      
      {/* Main Grid */}
      <div className="absolute top-8 left-16 w-full h-full">
        <Grid
          ref={gridRef}
          height={600}
          width={800}
          rowCount={rowCount}
          columnCount={columnCount}
          rowHeight={cellHeight}
          columnWidth={cellWidth}
          itemData={itemData}
          onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }) => {
            setViewportInfo({
              startRow: visibleRowStartIndex,
              endRow: visibleRowStopIndex,
              startCol: visibleColumnStartIndex,
              endCol: visibleColumnStopIndex
            })
          }}
        >
          {DPCell}
        </Grid>
      </div>
      
      {/* Algorithm Pattern Overlay */}
      <AlgorithmPatternOverlay
        algorithm={algorithm}
        dpTable={dpTable}
        currentRow={currentRow}
        currentCol={currentCol}
      />
      
      {/* Selected Cell Info */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-md"
          >
            <h4 className="text-lg font-bold mb-2">
              Cell [{selectedCell.row}, {selectedCell.col}]
            </h4>
            <div className="text-sm space-y-1">
              <div>Value: {dpTable[selectedCell.row][selectedCell.col].value}</div>
              {dpTable[selectedCell.row][selectedCell.col].computation && (
                <div>Computation: {dpTable[selectedCell.row][selectedCell.col].computation}</div>
              )}
              {dpTable[selectedCell.row][selectedCell.col].dependencies && (
                <div>
                  Dependencies: {dpTable[selectedCell.row][selectedCell.col].dependencies!.map(([r, c]) => `[${r},${c}]`).join(', ')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Performance Info */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono">
        <div>Grid: {rowCount} × {columnCount}</div>
        <div>Cells: {(rowCount * columnCount).toLocaleString()}</div>
        <div>Visible: {(viewportInfo.endRow - viewportInfo.startRow + 1) * (viewportInfo.endCol - viewportInfo.startCol + 1)}</div>
        <div>Algorithm: {algorithm}</div>
      </div>
    </div>
  )
}

// Helper function to find path to a cell
function findPathToCell(dpTable: DPCell[][], targetRow: number, targetCol: number): [number, number][] {
  const path: [number, number][] = []
  let row = targetRow
  let col = targetCol
  
  while (row >= 0 && col >= 0) {
    path.unshift([row, col])
    
    const cell = dpTable[row][col]
    if (!cell.dependencies || cell.dependencies.length === 0) break
    
    // Take the first dependency (can be enhanced for optimal path)
    const [depRow, depCol] = cell.dependencies[0]
    row = depRow
    col = depCol
  }
  
  return path
}

// Algorithm-specific DP table generators
export function generateKnapsackTable(weights: number[], values: number[], capacity: number): DPCell[][] {
  const n = weights.length
  const dp: DPCell[][] = Array(n + 1).fill(null).map(() => 
    Array(capacity + 1).fill(null).map(() => ({ value: 0, isCalculated: false }))
  )
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        const include = values[i-1] + dp[i-1][w - weights[i-1]].value
        const exclude = dp[i-1][w].value
        
        dp[i][w] = {
          value: Math.max(include, exclude),
          isCalculated: true,
          dependencies: [[i-1, w], [i-1, w - weights[i-1]]],
          computation: `max(${include}, ${exclude})`
        }
      } else {
        dp[i][w] = {
          value: dp[i-1][w].value,
          isCalculated: true,
          dependencies: [[i-1, w]],
          computation: `exclude item ${i}`
        }
      }
    }
  }
  
  return dp
}

export function generateLCSTable(str1: string, str2: string): DPCell[][] {
  const m = str1.length
  const n = str2.length
  const dp: DPCell[][] = Array(m + 1).fill(null).map(() => 
    Array(n + 1).fill(null).map(() => ({ value: 0, isCalculated: false }))
  )
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = {
          value: dp[i-1][j-1].value + 1,
          isCalculated: true,
          dependencies: [[i-1, j-1]],
          computation: `match: ${str1[i-1]}`
        }
      } else {
        const left = dp[i][j-1].value
        const up = dp[i-1][j].value
        
        dp[i][j] = {
          value: Math.max(left, up),
          isCalculated: true,
          dependencies: [[i, j-1], [i-1, j]],
          computation: `max(${left}, ${up})`
        }
      }
    }
  }
  
  return dp
}
