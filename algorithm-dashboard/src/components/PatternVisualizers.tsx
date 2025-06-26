// 🎨 WORLD-CLASS PATTERN VISUALIZATION COMPONENTS
// Specialized components for each algorithm pattern
// Ultra-sophisticated visual language for pattern understanding

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

// 🎯 Two Pointers Pattern Visualization
export const TwoPointersVisualizer: React.FC<{
  array: number[];
  leftPointer: number;
  rightPointer: number;
  isAnimating: boolean;
  speed: number;
}> = ({ array, leftPointer, rightPointer, isAnimating, speed }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Array Elements */}
      {array.map((value, index) => (
        <motion.div
          key={index}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            position: 'relative',
            zIndex: 2
          }}
          animate={{
            backgroundColor: 
              index === leftPointer ? '#007AFF' :
              index === rightPointer ? '#FF3B30' :
              '#2C2C2E',
            scale: (index === leftPointer || index === rightPointer) ? 1.1 : 1,
            boxShadow: 
              index === leftPointer ? '0 0 20px #007AFF80' :
              index === rightPointer ? '0 0 20px #FF3B3080' :
              '0 4px 12px rgba(0,0,0,0.3)'
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            duration: 1 / speed
          }}
        >
          {value}
        </motion.div>
      ))}

      {/* Connection Arc Between Pointers */}
      <AnimatePresence>
        {leftPointer !== rightPointer && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
            width="100%"
            height="60px"
          >
            <motion.path
              d={`M ${(leftPointer + 0.5) * 58} 0 Q ${((leftPointer + rightPointer) / 2 + 0.5) * 58} -30 ${(rightPointer + 0.5) * 58} 0`}
              stroke="url(#connectionGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#007AFF" />
                <stop offset="100%" stopColor="#FF3B30" />
              </linearGradient>
            </defs>
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Pointer Labels */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: `${(leftPointer + 0.5) * 58}px`,
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: '#007AFF',
          fontWeight: '600'
        }}
        animate={{
          x: (leftPointer + 0.5) * 58 - (array.length * 58) / 2
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        LEFT
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-40px',
          right: `${(array.length - rightPointer - 0.5) * 58}px`,
          transform: 'translateX(50%)',
          fontSize: '12px',
          color: '#FF3B30',
          fontWeight: '600'
        }}
        animate={{
          x: -((array.length - rightPointer - 0.5) * 58 - (array.length * 58) / 2)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        RIGHT
      </motion.div>
    </div>
  );
};

// 🌳 Backtracking Tree Visualization
export const BacktrackingVisualizer: React.FC<{
  treeData: any;
  currentPath: number[];
  isAnimating: boolean;
  speed: number;
}> = ({ treeData, currentPath, isAnimating, speed }) => {
  const renderNode = (node: any, level: number, index: number, path: number[]) => {
    const isCurrentPath = path.every((val, i) => val === currentPath[i]) && path.length <= currentPath.length;
    const isExplored = path.length < currentPath.length;
    
    return (
      <motion.div
        key={`${level}-${index}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 10px'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: isCurrentPath ? 'none' : isExplored ? 'brightness(0.6)' : 'brightness(0.3)'
        }}
        transition={{ delay: level * 0.2, duration: 0.5 }}
      >
        {/* Node Circle */}
        <motion.div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '20px',
            position: 'relative'
          }}
          animate={{
            backgroundColor: isCurrentPath ? '#5856D6' : isExplored ? '#007AFF' : '#2C2C2E',
            boxShadow: isCurrentPath ? 
              '0 0 25px #5856D680, 0 0 50px #5856D640' : 
              isExplored ? '0 0 15px #007AFF40' : 'none'
          }}
          whileHover={{ scale: 1.1 }}
        >
          {node.value}
          
          {/* Pulse Effect for Current Node */}
          {isCurrentPath && path.length === currentPath.length && (
            <motion.div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid #5856D6',
                top: 0,
                left: 0
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            {node.children.map((child: any, childIndex: number) => 
              renderNode(child, level + 1, childIndex, [...path, childIndex])
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div style={{
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '300px',
      overflow: 'auto'
    }}>
      {treeData && renderNode(treeData, 0, 0, [0])}
    </div>
  );
};

// 💎 Dynamic Programming Matrix Visualization
export const DynamicProgrammingVisualizer: React.FC<{
  matrix: number[][];
  currentCell: [number, number];
  filledCells: Set<string>;
  isAnimating: boolean;
  speed: number;
}> = ({ matrix, currentCell, filledCells, isAnimating, speed }) => {
  return (
    <div style={{
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 60px)`,
        gap: '4px',
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #1C1C1E80, #2C2C2E40)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #8E8E9320'
      }}>
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const isCurrent = currentCell[0] === rowIndex && currentCell[1] === colIndex;
            const isFilled = filledCells.has(cellKey);
            
            return (
              <motion.div
                key={cellKey}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  position: 'relative',
                  border: '1px solid #8E8E9340'
                }}
                animate={{
                  backgroundColor: 
                    isCurrent ? '#00D4AA' :
                    isFilled ? '#007AFF40' :
                    '#2C2C2E80',
                  scale: isCurrent ? 1.1 : 1,
                  boxShadow: isCurrent ? 
                    '0 0 20px #00D4AA80, 0 0 40px #00D4AA40' : 
                    isFilled ? '0 0 10px #007AFF20' : 'none'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isCurrent ? 1.1 : 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: (rowIndex + colIndex) * 0.05
                }}
              >
                {cell !== undefined ? cell : ''}
                
                {/* Building Block Effect */}
                {isFilled && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #00D4AA20, #007AFF20)',
                      border: '1px solid #00D4AA40'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// 🌐 Graph Network Visualization
export const GraphVisualizer: React.FC<{
  nodes: Array<{ id: string; x: number; y: number; visited?: boolean; current?: boolean }>;
  edges: Array<{ from: string; to: string; active?: boolean }>;
  isAnimating: boolean;
  speed: number;
}> = ({ nodes, edges, isAnimating, speed }) => {
  return (
    <div style={{
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg
        width="400"
        height="300"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #1C1C1E80, #2C2C2E40)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #8E8E9320'
        }}
      >
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edge.active ? '#FF9500' : '#8E8E9360'}
              strokeWidth={edge.active ? '3' : '2'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g key={node.id}>
            {/* Node Circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="16"
              fill={
                node.current ? '#FF9500' :
                node.visited ? '#007AFF' :
                '#2C2C2E'
              }
              stroke={
                node.current ? '#FF950080' :
                node.visited ? '#007AFF80' :
                '#8E8E9360'
              }
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
            
            {/* Node Label */}
            <motion.text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            >
              {node.id}
            </motion.text>

            {/* Pulse Effect for Current Node */}
            {node.current && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="16"
                fill="none"
                stroke="#FF9500"
                strokeWidth="2"
                animate={{
                  r: [16, 24, 16],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

// 🎵 Sorting Flow Visualization  
export const SortingVisualizer: React.FC<{
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  isAnimating: boolean;
  speed: number;
}> = ({ array, comparing, swapping, sorted, isAnimating, speed }) => {
  const maxValue = Math.max(...array);
  
  return (
    <div style={{
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      height: '300px',
      gap: '4px'
    }}>
      {array.map((value, index) => (
        <motion.div
          key={index}
          style={{
            width: '20px',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: '600',
            color: '#FFFFFF',
            position: 'relative'
          }}
          animate={{
            height: `${(value / maxValue) * 200}px`,
            backgroundColor: 
              swapping.includes(index) ? '#FF3B30' :
              comparing.includes(index) ? '#FF9500' :
              sorted.includes(index) ? '#00D4AA' :
              '#007AFF',
            scale: (swapping.includes(index) || comparing.includes(index)) ? 1.05 : 1,
            boxShadow: 
              swapping.includes(index) ? '0 0 15px #FF3B3080' :
              comparing.includes(index) ? '0 0 15px #FF950080' :
              sorted.includes(index) ? '0 0 15px #00D4AA80' :
              '0 4px 8px rgba(0,0,0,0.3)'
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 1 / speed
          }}
        >
          <span style={{
            position: 'absolute',
            bottom: '5px',
            fontSize: '8px'
          }}>
            {value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
