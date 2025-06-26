'use client';

import { BacktrackingProvider } from './context/BacktrackingContext';

export default function BacktrackingDashboard() {
  return (
    <BacktrackingProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Backtracking Algorithm Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Testing basic setup - context and provider working correctly.
          </p>
        </div>
      </div>
    </BacktrackingProvider>
  );
}
