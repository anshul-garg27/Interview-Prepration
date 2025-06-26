'use client';

import React, { useState } from 'react';
import { BacktrackingProvider } from './context/BacktrackingContext';
import { DashboardSection } from './types/BacktrackingTypes';

// Test imports one by one
// import CodeSection from './sections/CodeSection';
// import ConceptSection from './sections/ConceptSection';
// import PatternSection from './sections/PatternSection';
// import PitfallsSection from './sections/PitfallsSection';
// import TestingSection from './sections/TestingSection';
import VisualizationSection from './sections/VisualizationSection';

interface BacktrackingDashboardProps {
  className?: string;
}

export const BacktrackingDashboard: React.FC<BacktrackingDashboardProps> = ({
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('visualization');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Render appropriate section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'visualization':
        return <VisualizationSection />;
      // case 'concept':
      //   return <ConceptSection />;
      // case 'patterns':
      //   return <PatternSection />;
      // case 'code':
      //   return <CodeSection />;
      // case 'pitfalls':
      //   return <PitfallsSection />;
      // case 'testing':
      //   return <TestingSection />;
      default:
        return <VisualizationSection />;
    }
  };

  return (
    <BacktrackingProvider>
      <div className={`min-h-screen bg-gray-50 ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Navigation Sidebar */}
        <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              {!sidebarCollapsed && (
                <h1 className="text-xl font-bold text-gray-800">Backtracking</h1>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <div className="w-4 h-4 border-2 border-gray-600 rounded"></div>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {[
                { id: 'visualization', label: 'Visualization', icon: '📊', shortcut: '1' },
                { id: 'concept', label: 'Concepts', icon: '🧠', shortcut: '2' },
                { id: 'patterns', label: 'Patterns', icon: '🔄', shortcut: '3' },
                { id: 'code', label: 'Code', icon: '💻', shortcut: '4' },
                { id: 'pitfalls', label: 'Pitfalls', icon: '⚠️', shortcut: '5' },
                { id: 'testing', label: 'Testing', icon: '🧪', shortcut: '6' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as DashboardSection)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      <span className="ml-auto text-xs text-gray-400">{item.shortcut}</span>
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeSection.replace('-', ' ')}
                </h2>
                <p className="text-gray-600">
                  Interactive backtracking algorithm exploration
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <div className="w-5 h-5 border-2 border-gray-600"></div>
                </button>
              </div>
            </div>

            {/* Section Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </BacktrackingProvider>
  );
};

export default BacktrackingDashboard;
