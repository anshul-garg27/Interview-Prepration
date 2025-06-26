'use client';

import React, { useEffect, useState } from 'react';
import { BacktrackingProvider } from './context/BacktrackingContext';
import CodeSection from './sections/CodeSection';
import ConceptSection from './sections/ConceptSection';
import PatternSection from './sections/PatternSection';
import PitfallsSection from './sections/PitfallsSection';
import TestingSection from './sections/WorldClassTestingSection';
import VisualizationSection from './sections/VisualizationSection';
import { DashboardSection } from './types/BacktrackingTypes';

interface BacktrackingDashboardProps {
  className?: string;
}

export const BacktrackingDashboard: React.FC<BacktrackingDashboardProps> = ({
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('visualization');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dashboard sections configuration
  const sections: { id: DashboardSection; label: string; icon: string; description: string }[] = [
    {
      id: 'visualization',
      label: 'Visualization',
      icon: '📊',
      description: 'Interactive algorithm visualization and real-time execution'
    },
    {
      id: 'concept',
      label: 'Concepts',
      icon: '📚',
      description: 'Learn fundamental backtracking concepts and principles'
    },
    {
      id: 'patterns',
      label: 'Patterns',
      icon: '🎯',
      description: 'Explore different backtracking algorithm patterns'
    },
    {
      id: 'code',
      label: 'Code',
      icon: '💻',
      description: 'View and understand algorithm implementations'
    },
    {
      id: 'pitfalls',
      label: 'Pitfalls',
      icon: '⚠️',
      description: 'Common mistakes and how to avoid them'
    },
    {
      id: 'testing',
      label: 'Testing',
      icon: '🧪',
      description: 'Test algorithms with custom inputs and edge cases'
    }
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveSection('visualization');
            break;
          case '2':
            e.preventDefault();
            setActiveSection('concept');
            break;
          case '3':
            e.preventDefault();
            setActiveSection('patterns');
            break;
          case '4':
            e.preventDefault();
            setActiveSection('code');
            break;
          case '5':
            e.preventDefault();
            setActiveSection('pitfalls');
            break;
          case '6':
            e.preventDefault();
            setActiveSection('testing');
            break;
          case 'f':
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isFullscreen, sidebarCollapsed]);

  // Render appropriate section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'visualization':
        return <VisualizationSection />;
      case 'concept':
        return <ConceptSection />;
      case 'patterns':
        return <PatternSection />;
      case 'code':
        return <CodeSection />;
      case 'pitfalls':
        return <PitfallsSection />;
      case 'testing':
        return <TestingSection />;
      default:
        return <VisualizationSection />;
    }
  };

  return (
    <BacktrackingProvider>
      <div className={`min-h-screen bg-gray-50 ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">BT</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      Backtracking Algorithm Dashboard
                    </h1>
                    <p className="text-sm text-gray-600">
                      Interactive learning platform for backtracking algorithms
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Keyboard Shortcuts Help */}
                <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
                  <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded">1-6</kbd>
                  <span>Navigate</span>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Toggle Fullscreen (Ctrl+F)"
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  )}
                </button>

                {/* Sidebar Toggle */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Toggle Sidebar (Ctrl+B)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar Navigation */}
          <nav className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}>
            <div className="p-4">
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={sidebarCollapsed ? section.label : undefined}
                  >
                    <span className="text-xl flex-shrink-0">{section.icon}</span>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{section.label}</span>
                          <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            ⌘{index + 1}
                          </kbd>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {section.description}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            {/* {!sidebarCollapsed && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800 font-medium mb-1">
                    💡 Pro Tip
                  </div>
                  <div className="text-xs text-blue-600">
                    Use keyboard shortcuts to navigate quickly between sections!
                  </div>
                </div>
              </div>
            )} */}
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Breadcrumb */}
              <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    <li>
                      <span>Algorithms</span>
                    </li>
                    <li>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span>Backtracking</span>
                    </li>
                    <li>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li className="text-gray-800 font-medium capitalize">
                      {sections.find(s => s.id === activeSection)?.label}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Section Content */}
              <div className="space-y-6">
                {renderSectionContent()}
              </div>
            </div>
          </main>
        </div>

        {/* Global Loading Overlay */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Dashboard Ready</span>
          </div>
        </div>
      </div>
    </BacktrackingProvider>
  );
};

export default BacktrackingDashboard;
