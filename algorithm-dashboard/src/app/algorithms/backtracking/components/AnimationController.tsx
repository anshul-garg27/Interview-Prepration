'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBacktracking } from '../context/BacktrackingContext';
import { AnimationSpeed } from '../types/BacktrackingTypes';

interface AnimationControllerProps {
  className?: string;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  className = ''
}) => {
  const { state, dispatch } = useBacktracking();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<AnimationSpeed>('normal');
  const [autoReplay, setAutoReplay] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation speed configurations
  const speedConfigs: Record<AnimationSpeed, { label: string; interval: number; multiplier: number }> = {
    'slow': { label: 'Slow (0.5x)', interval: 2000, multiplier: 0.5 },
    'normal': { label: 'Normal (1x)', interval: 1000, multiplier: 1 },
    'fast': { label: 'Fast (2x)', interval: 500, multiplier: 2 },
    'very-fast': { label: 'Very Fast (4x)', interval: 250, multiplier: 4 }
  };

  // Get animation frames from algorithm execution history
  useEffect(() => {
    if (state.executionHistory && state.executionHistory.length > 0) {
      setTotalFrames(state.executionHistory.length);
      setCurrentFrame(Math.min(currentFrame, state.executionHistory.length - 1));
    }
  }, [state.executionHistory, currentFrame]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isPlaying || currentFrame >= totalFrames - 1) {
      if (currentFrame >= totalFrames - 1 && autoReplay) {
        setCurrentFrame(0);
        return;
      }
      setIsPlaying(false);
      return;
    }

    const nextFrame = currentFrame + 1;
    setCurrentFrame(nextFrame);

    // Update visualization state to show current frame
    if (state.executionHistory && state.executionHistory[nextFrame]) {
      dispatch({
        type: 'UPDATE_VISUALIZATION_STATE',
        payload: {
          currentStep: nextFrame,
          currentState: state.executionHistory[nextFrame]
        }
      });
    }

    // Schedule next frame
    timeoutRef.current = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, speedConfigs[playbackSpeed].interval);
  }, [isPlaying, currentFrame, totalFrames, autoReplay, playbackSpeed, state.executionHistory, dispatch]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Control functions
  const handlePlay = useCallback(() => {
    if (totalFrames === 0) return;
    setIsPlaying(true);
    dispatch({ type: 'SET_ANIMATION_PLAYING', payload: { isPlaying: true } });
  }, [totalFrames, dispatch]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    dispatch({ type: 'SET_ANIMATION_PLAYING', payload: { isPlaying: false } });
  }, [dispatch]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame(0);
    dispatch({ type: 'SET_ANIMATION_PLAYING', payload: { isPlaying: false } });
    dispatch({
      type: 'UPDATE_VISUALIZATION_STATE',
      payload: {
        currentStep: 0,
        currentState: state.executionHistory?.[0] || null
      }
    });
  }, [dispatch, state.executionHistory]);

  const handleStepForward = useCallback(() => {
    if (currentFrame < totalFrames - 1) {
      const nextFrame = currentFrame + 1;
      setCurrentFrame(nextFrame);
      
      if (state.executionHistory && state.executionHistory[nextFrame]) {
        dispatch({
          type: 'UPDATE_VISUALIZATION_STATE',
          payload: {
            currentStep: nextFrame,
            currentState: state.executionHistory[nextFrame]
          }
        });
      }
    }
  }, [currentFrame, totalFrames, state.executionHistory, dispatch]);

  const handleStepBackward = useCallback(() => {
    if (currentFrame > 0) {
      const prevFrame = currentFrame - 1;
      setCurrentFrame(prevFrame);
      
      if (state.executionHistory && state.executionHistory[prevFrame]) {
        dispatch({
          type: 'UPDATE_VISUALIZATION_STATE',
          payload: {
            currentStep: prevFrame,
            currentState: state.executionHistory[prevFrame]
          }
        });
      }
    }
  }, [currentFrame, state.executionHistory, dispatch]);

  const handleFrameSeek = useCallback((frame: number) => {
    const clampedFrame = Math.max(0, Math.min(frame, totalFrames - 1));
    setCurrentFrame(clampedFrame);
    
    if (state.executionHistory && state.executionHistory[clampedFrame]) {
      dispatch({
        type: 'UPDATE_VISUALIZATION_STATE',
        payload: {
          currentStep: clampedFrame,
          currentState: state.executionHistory[clampedFrame]
        }
      });
    }
  }, [totalFrames, state.executionHistory, dispatch]);

  const handleSpeedChange = useCallback((speed: AnimationSpeed) => {
    setPlaybackSpeed(speed);
    dispatch({
      type: 'UPDATE_ANIMATION_CONFIG',
      payload: { speed }
    });
  }, [dispatch]);

  // Get current frame information
  const getCurrentFrameInfo = () => {
    if (!state.executionHistory || !state.executionHistory[currentFrame]) {
      return null;
    }
    
    const frameData = state.executionHistory[currentFrame];
    return {
      step: currentFrame + 1,
      action: frameData.action || 'Unknown',
      recursionDepth: frameData.recursionDepth || 0,
      description: frameData.description || 'Algorithm step'
    };
  };

  const frameInfo = getCurrentFrameInfo();
  const progress = totalFrames > 0 ? (currentFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Animation Controller</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentFrame + 1} of {totalFrames}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => handleFrameSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            disabled={totalFrames === 0}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <button
          onClick={handleStop}
          disabled={totalFrames === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Stop and Reset"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <rect x="6" y="6" width="8" height="8" />
          </svg>
        </button>

        <button
          onClick={handleStepBackward}
          disabled={currentFrame === 0 || totalFrames === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Step Backward"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {isPlaying ? (
          <button
            onClick={handlePause}
            className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="Pause"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 3.5A1.5 1.5 0 017 2h6a1.5 1.5 0 011.5 1.5v13A1.5 1.5 0 0113 18H7a1.5 1.5 0 01-1.5-1.5v-13z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handlePlay}
            disabled={totalFrames === 0 || currentFrame >= totalFrames - 1}
            className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Play"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
        )}

        <button
          onClick={handleStepForward}
          disabled={currentFrame >= totalFrames - 1 || totalFrames === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Step Forward"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>
      </div>

      {/* Speed and Options */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Speed:</label>
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(e.target.value as AnimationSpeed)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(speedConfigs).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoReplay"
            checked={autoReplay}
            onChange={(e) => setAutoReplay(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="autoReplay" className="text-sm text-gray-700">
            Auto Replay
          </label>
        </div>
      </div>

      {/* Current Frame Information */}
      {frameInfo && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Current Step Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Step:</span>
              <span className="ml-2 font-medium">{frameInfo.step}</span>
            </div>
            <div>
              <span className="text-gray-600">Action:</span>
              <span className="ml-2 font-medium">{frameInfo.action}</span>
            </div>
            <div>
              <span className="text-gray-600">Recursion Depth:</span>
              <span className="ml-2 font-medium">{frameInfo.recursionDepth}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Description:</span>
              <p className="mt-1 text-gray-800">{frameInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Animation Data Message */}
      {totalFrames === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎬</div>
          <p>No animation data available</p>
          <p className="text-sm mt-1">Run an algorithm to see step-by-step animation</p>
        </div>
      )}

      {/* Animation Statistics */}
      {totalFrames > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-blue-600">{totalFrames}</div>
              <div className="text-gray-600">Total Steps</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {speedConfigs[playbackSpeed].multiplier}x
              </div>
              <div className="text-gray-600">Speed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Math.round((totalFrames - currentFrame - 1) * speedConfigs[playbackSpeed].interval / 1000)}s
              </div>
              <div className="text-gray-600">Remaining</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationController;
