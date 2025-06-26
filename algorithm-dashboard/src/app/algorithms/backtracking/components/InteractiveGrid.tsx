'use client';

import React, { useCallback, useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';
import { GridCell, GridConfig } from '../types/BacktrackingTypes';

interface InteractiveGridProps {
  gridSize: number;
  config: GridConfig;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  className?: string;
}

export const InteractiveGrid: React.FC<InteractiveGridProps> = ({
  gridSize,
  config,
  onCellClick,
  onCellHover,
  className = ''
}) => {
  const { state, dispatch } = useBacktracking();
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());

  // Get current grid state from context
  const currentGrid = state.visualizationState.currentGrid || 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill({ state: 'empty' }));

  // Handle cell interactions
  const handleCellClick = useCallback((row: number, col: number) => {
    if (onCellClick) {
      onCellClick(row, col);
    }
    
    // Trigger cell click animation
    const cellKey = `${row}-${col}`;
    setAnimatingCells(prev => new Set(prev).add(cellKey));
    setTimeout(() => {
      setAnimatingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }, 300);

    // Dispatch grid update event
    dispatch({
      type: 'UPDATE_GRID_CELL',
      payload: { row, col, cell: currentGrid[row][col] }
    });
  }, [onCellClick, dispatch, currentGrid]);

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
    if (onCellHover) {
      onCellHover(row, col);
    }
  }, [onCellHover]);

  const handleCellLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Get cell styling based on state and pattern type
  const getCellClassName = useCallback((row: number, col: number, cell: GridCell) => {
    const baseClasses = 'relative flex items-center justify-center transition-all duration-200 cursor-pointer border';
    const cellKey = `${row}-${col}`;
    const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
    const isAnimating = animatingCells.has(cellKey);
    
    let stateClasses = '';
    let patternClasses = '';

    // Base cell state styling
    switch (cell.state) {
      case 'empty':
        stateClasses = 'bg-white border-gray-300 hover:bg-gray-50';
        break;
      case 'occupied':
        stateClasses = 'bg-blue-500 border-blue-600 text-white font-bold';
        break;
      case 'blocked':
        stateClasses = 'bg-gray-800 border-gray-900';
        break;
      case 'path':
        stateClasses = 'bg-green-400 border-green-500';
        break;
      case 'visited':
        stateClasses = 'bg-yellow-200 border-yellow-300';
        break;
      case 'current':
        stateClasses = 'bg-red-400 border-red-500 ring-2 ring-red-300';
        break;
      case 'backtrack':
        stateClasses = 'bg-orange-300 border-orange-400';
        break;
      case 'solution':
        stateClasses = 'bg-green-600 border-green-700 text-white font-bold';
        break;
    }

    // Pattern-specific styling
    if (state.currentPattern === 'nqueens') {
      if (cell.state === 'occupied') {
        patternClasses = 'text-2xl';
      }
      // Highlight attacking squares for N-Queens
      if (cell.isUnderAttack) {
        stateClasses += ' bg-red-100 border-red-200';
      }
    } else if (state.currentPattern === 'wordsearch') {
      if (cell.value) {
        patternClasses = 'font-mono font-bold text-lg';
      }
      // Highlight word path
      if (cell.isPartOfWord) {
        stateClasses += ' ring-2 ring-purple-400';
      }
    }

    // Hover and animation effects
    if (isHovered) {
      stateClasses += ' scale-105 shadow-lg';
    }
    if (isAnimating) {
      stateClasses += ' animate-pulse';
    }

    return `${baseClasses} ${stateClasses} ${patternClasses}`;
  }, [state.currentPattern, hoveredCell, animatingCells]);

  // Get cell content based on pattern
  const getCellContent = useCallback((cell: GridCell) => {
    if (state.currentPattern === 'nqueens' && cell.state === 'occupied') {
      return '♛';
    }
    if (state.currentPattern === 'wordsearch' && cell.value) {
      return cell.value.toUpperCase();
    }
    if (cell.state === 'solution') {
      return '✓';
    }
    return '';
  }, [state.currentPattern]);

  // Calculate grid cell size based on grid size
  const getCellSize = useCallback(() => {
    if (gridSize <= 4) return 'w-16 h-16 text-xl';
    if (gridSize <= 8) return 'w-12 h-12 text-lg';
    if (gridSize <= 12) return 'w-10 h-10 text-base';
    return 'w-8 h-8 text-sm';
  }, [gridSize]);

  // Grid statistics
  const getGridStats = useCallback(() => {
    let emptyCells = 0;
    let occupiedCells = 0;
    let visitedCells = 0;
    let solutionCells = 0;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = currentGrid[row][col];
        switch (cell.state) {
          case 'empty': emptyCells++; break;
          case 'occupied': occupiedCells++; break;
          case 'visited': visitedCells++; break;
          case 'solution': solutionCells++; break;
        }
      }
    }

    return { emptyCells, occupiedCells, visitedCells, solutionCells };
  }, [currentGrid, gridSize]);

  const stats = getGridStats();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Interactive Grid ({gridSize}×{gridSize})
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Empty: {stats.emptyCells}</span>
          <span>Occupied: {stats.occupiedCells}</span>
          <span>Visited: {stats.visitedCells}</span>
          <span>Solutions: {stats.solutionCells}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex justify-center">
        <div 
          className="inline-grid gap-1 p-4 bg-gray-100 rounded-lg shadow-inner"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: gridSize }, (_, row) =>
            Array.from({ length: gridSize }, (_, col) => {
              const cell = currentGrid[row][col];
              const cellSize = getCellSize();
              
              return (
                <div
                  key={`${row}-${col}`}
                  className={`${getCellClassName(row, col, cell)} ${cellSize}`}
                  onClick={() => handleCellClick(row, col)}
                  onMouseEnter={() => handleCellHover(row, col)}
                  onMouseLeave={handleCellLeave}
                  title={`Cell (${row}, ${col}): ${cell.state}${cell.value ? ` - ${cell.value}` : ''}`}
                >
                  {getCellContent(cell)}
                  
                  {/* Cell coordinates overlay for debugging */}
                  {config.showCoordinates && (
                    <div className="absolute -top-1 -left-1 text-xs text-gray-400 bg-white px-1 rounded">
                      {row},{col}
                    </div>
                  )}
                  
                  {/* Attack lines for N-Queens */}
                  {state.currentPattern === 'nqueens' && cell.isUnderAttack && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-0.5 bg-red-300 absolute top-1/2 transform -translate-y-1/2"></div>
                      <div className="h-full w-0.5 bg-red-300 absolute left-1/2 transform -translate-x-1/2"></div>
                      <div className="w-full h-0.5 bg-red-300 absolute top-1/2 transform -translate-y-1/2 rotate-45"></div>
                      <div className="w-full h-0.5 bg-red-300 absolute top-1/2 transform -translate-y-1/2 -rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>Empty</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>Solution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-300 rounded"></div>
          <span>Backtrack</span>
        </div>
      </div>

      {/* Current Cell Info */}
      {hoveredCell && (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <h4 className="font-semibold text-gray-800 mb-2">
            Cell ({hoveredCell.row}, {hoveredCell.col})
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">State:</span>
              <span className="ml-2 font-medium">{currentGrid[hoveredCell.row][hoveredCell.col].state}</span>
            </div>
            {currentGrid[hoveredCell.row][hoveredCell.col].value && (
              <div>
                <span className="text-gray-600">Value:</span>
                <span className="ml-2 font-medium">{currentGrid[hoveredCell.row][hoveredCell.col].value}</span>
              </div>
            )}
            {state.currentPattern === 'nqueens' && (
              <div>
                <span className="text-gray-600">Under Attack:</span>
                <span className="ml-2 font-medium">
                  {currentGrid[hoveredCell.row][hoveredCell.col].isUnderAttack ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {state.currentPattern === 'wordsearch' && (
              <div>
                <span className="text-gray-600">Part of Word:</span>
                <span className="ml-2 font-medium">
                  {currentGrid[hoveredCell.row][hoveredCell.col].isPartOfWord ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGrid;
