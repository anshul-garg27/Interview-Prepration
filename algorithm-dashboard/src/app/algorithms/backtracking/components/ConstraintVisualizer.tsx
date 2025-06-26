'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';
import { Constraint, ConstraintStatus, ConstraintType } from '../types/BacktrackingTypes';

interface ConstraintVisualizerProps {
  constraints: Constraint[];
  className?: string;
}

export const ConstraintVisualizer: React.FC<ConstraintVisualizerProps> = ({
  constraints,
  className = ''
}) => {
  const { state, dispatch } = useBacktracking();
  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null);
  const [constraintHistory, setConstraintHistory] = useState<Constraint[]>([]);

  // Track constraint changes over time
  useEffect(() => {
    if (constraints.length > 0) {
      setConstraintHistory(prev => [...prev.slice(-50), ...constraints]);
    }
  }, [constraints]);

  // Get constraint status color
  const getConstraintStatusColor = useCallback((status: ConstraintStatus) => {
    switch (status) {
      case 'satisfied': return 'text-green-600 bg-green-50 border-green-200';
      case 'violated': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'checking': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, []);

  // Get constraint type icon
  const getConstraintTypeIcon = useCallback((type: ConstraintType) => {
    switch (type) {
      case 'placement': return '📍';
      case 'conflict': return '⚡';
      case 'boundary': return '🚧';
      case 'logical': return '🧠';
      case 'optimization': return '🎯';
      default: return '❓';
    }
  }, []);

  // Get constraint priority color
  const getConstraintPriorityColor = useCallback((priority: number) => {
    if (priority >= 9) return 'bg-red-500 text-white';
    if (priority >= 7) return 'bg-orange-500 text-white';
    if (priority >= 5) return 'bg-yellow-500 text-white';
    if (priority >= 3) return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  }, []);

  // Handle constraint selection
  const handleConstraintClick = useCallback((constraintId: string) => {
    setSelectedConstraint(constraintId === selectedConstraint ? null : constraintId);
    
    dispatch({
      type: 'HIGHLIGHT_CONSTRAINT',
      payload: { constraintId }
    });
  }, [selectedConstraint, dispatch]);

  // Group constraints by type
  const constraintsByType = constraints.reduce((acc, constraint) => {
    if (!acc[constraint.type]) {
      acc[constraint.type] = [];
    }
    acc[constraint.type].push(constraint);
    return acc;
  }, {} as Record<ConstraintType, Constraint[]>);

  // Calculate constraint statistics
  const constraintStats = constraints.reduce((acc, constraint) => {
    acc[constraint.status] = (acc[constraint.status] || 0) + 1;
    return acc;
  }, {} as Record<ConstraintStatus, number>);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Constraint Checker
          </h3>
          <div className="text-sm text-gray-600">
            Total: {constraints.length} constraints
          </div>
        </div>

        {/* Constraint Status Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {constraintStats.satisfied || 0}
            </div>
            <div className="text-sm text-green-700">Satisfied</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {constraintStats.violated || 0}
            </div>
            <div className="text-sm text-red-700">Violated</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {constraintStats.pending || 0}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {constraintStats.checking || 0}
            </div>
            <div className="text-sm text-blue-700">Checking</div>
          </div>
        </div>
      </div>

      {/* Constraints by Type */}
      <div className="space-y-4">
        {Object.entries(constraintsByType).map(([type, typeConstraints]) => (
          <div key={type} className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getConstraintTypeIcon(type as ConstraintType)}</span>
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {type} Constraints
                  </h4>
                </div>
                <span className="text-sm text-gray-600">
                  {typeConstraints.length} constraint{typeConstraints.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {typeConstraints.map((constraint) => (
                <div
                  key={constraint.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    getConstraintStatusColor(constraint.status)
                  } ${
                    selectedConstraint === constraint.id 
                      ? 'ring-2 ring-blue-300 shadow-md' 
                      : 'hover:shadow-sm'
                  }`}
                  onClick={() => handleConstraintClick(constraint.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          getConstraintPriorityColor(constraint.priority)
                        }`}>
                          P{constraint.priority}
                        </div>
                        <div className="font-medium">{constraint.description}</div>
                        <div className="text-sm text-gray-600">
                          {constraint.status.toUpperCase()}
                        </div>
                      </div>
                      
                      {constraint.affectedCells && constraint.affectedCells.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Affects cells: {constraint.affectedCells.map(cell => 
                            `(${cell.row}, ${cell.col})`
                          ).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {constraint.isActive && (
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
                              title="Active constraint"></span>
                      )}
                      <span className="text-xs text-gray-500">
                        #{constraint.checkCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Detailed View */}
                  {selectedConstraint === constraint.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium capitalize">{constraint.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Priority:</span>
                          <span className="ml-2 font-medium">{constraint.priority}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Check Count:</span>
                          <span className="ml-2 font-medium">{constraint.checkCount || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Active:</span>
                          <span className="ml-2 font-medium">
                            {constraint.isActive ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {constraint.metadata && Object.keys(constraint.metadata).length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-600 text-sm">Metadata:</span>
                          <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                            {JSON.stringify(constraint.metadata, null, 2)}
                          </div>
                        </div>
                      )}

                      {constraint.errorMessage && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <span className="text-red-700 text-sm font-medium">Error:</span>
                          <p className="text-red-600 text-sm mt-1">{constraint.errorMessage}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Constraint History */}
      {constraintHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
            <h4 className="font-semibold text-gray-800">Recent Constraint Activity</h4>
          </div>
          <div className="p-4">
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {constraintHistory.slice(-10).reverse().map((constraint, index) => (
                <div key={`${constraint.id}-${index}`} 
                     className="flex items-center space-x-3 text-sm py-1">
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    getConstraintStatusColor(constraint.status)
                  }`}>
                    {constraint.status}
                  </span>
                  <span className="flex-1 truncate">{constraint.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Constraints Message */}
      {constraints.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>No constraints to display</p>
          <p className="text-sm mt-1">Start an algorithm to see constraint checking in action</p>
        </div>
      )}
    </div>
  );
};

export default ConstraintVisualizer;
