// ConceptSection.tsx - Deep Concept Understanding Section
'use client'

import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { ComplexityIndicator } from '../../../../components/ComplexityIndicator'

export function ConceptSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Enhanced Concept Overview Card */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Brain className="w-7 h-7 mr-3 text-pink-400" />
          🌟 The Ultimate Two Sum Challenge
        </h3>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-400/30">
            <h4 className="text-xl font-bold text-yellow-400 mb-4">🎯 Gateway to Algorithmic Mastery</h4>
            <p className="text-blue-200 leading-relaxed mb-4">
              Two Sum isn't just a coding problem - it's the <strong className="text-yellow-300">gateway to understanding fundamental algorithmic thinking</strong>. 
              This problem teaches you how to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-green-300">
                  <span className="mr-2">💡</span>
                  <span>Trade space for time efficiency</span>
                </div>
                <div className="flex items-center text-green-300">
                  <span className="mr-2">🏗️</span>
                  <span>Choose the right data structure</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-green-300">
                  <span className="mr-2">🛡️</span>
                  <span>Handle edge cases professionally</span>
                </div>
                <div className="flex items-center text-green-300">
                  <span className="mr-2">🚀</span>
                  <span>Think about multiple solution approaches</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Complete Problem Variations */}
          <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border border-emerald-400/30">
            <h4 className="text-xl font-bold text-emerald-400 mb-4">📚 Complete Problem Variations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-300 mb-2">1. Classic Two Sum (Unsorted)</h5>
                  <div className="text-sm text-gray-300">
                    <div className="font-mono bg-gray-800 p-2 rounded text-xs">
                      Input: [2,7,11,15], target=9<br/>
                      Output: [0,1]
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-300 mb-2">2. Two Sum II (Sorted)</h5>
                  <div className="text-sm text-gray-300">
                    <div className="font-mono bg-gray-800 p-2 rounded text-xs">
                      Input: [2,7,11,15], target=9<br/>
                      Output: [1,2] (1-indexed)
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-300 mb-2">3. Return Values</h5>
                  <div className="text-sm text-gray-300">
                    <div className="font-mono bg-gray-800 p-2 rounded text-xs">
                      Input: [2,7,11,15], target=9<br/>
                      Output: [2,7] (actual numbers)
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-yellow-300 mb-2">4. Count Pairs</h5>
                  <div className="text-sm text-gray-300">
                    <div className="font-mono bg-gray-800 p-2 rounded text-xs">
                      Input: [1,2,3,2,1], target=3<br/>
                      Output: 2 (count of pairs)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="font-bold text-pink-400 mb-3 text-lg">🔑 Core Insights</h4>
              <ul className="list-disc list-inside space-y-2 text-blue-200">
                <li>✔️ Hash maps provide O(1) lookup for unsorted arrays</li>
                <li>✔️ Two pointers work optimally on sorted arrays</li>
                <li>✔️ Trade-off: O(n) space vs O(1) space</li>
                <li>✔️ Understanding complements: target - current = needed</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h4 className="font-bold text-pink-400 mb-3 text-lg">📈 Visual Representation</h4>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <svg viewBox="0 0 400 120" className="w-full h-24">
                  {/* Array visualization */}
                  {[2, 7, 11, 15].map((num, index) => (
                    <g key={index}>
                      <rect
                        x={index * 90 + 20}
                        y={40}
                        width={60}
                        height={40}
                        fill={index === 0 ? "#10b981" : index === 3 ? "#ef4444" : "#6b7280"}
                        rx={8}
                      />
                      <text
                        x={index * 90 + 50}
                        y={65}
                        textAnchor="middle"
                        fill="white"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        {num}
                      </text>
                      {/* Pointer arrows */}
                      {index === 0 && (
                        <polygon
                          points={`${index * 90 + 50},30 ${index * 90 + 45},20 ${index * 90 + 55},20`}
                          fill="#10b981"
                        />
                      )}
                      {index === 3 && (
                        <polygon
                          points={`${index * 90 + 50},30 ${index * 90 + 45},20 ${index * 90 + 55},20`}
                          fill="#ef4444"
                        />
                      )}
                    </g>
                  ))}
                  {/* Labels */}
                  <text x="50" y="15" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">LEFT</text>
                  <text x="320" y="15" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">RIGHT</text>
                  <text x="200" y="105" textAnchor="middle" fill="#60a5fa" fontSize="14">2 + 15 = 17 &gt; 9 (move right left)</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Deep Dive */}
      <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🔍 Concept Deep Dive</h3>
        <div className="space-y-4">
          <p className="text-blue-200 leading-relaxed">
            At its core, the Two Sum problem is about finding a pair of numbers in a sorted array that add up to a given target. 
            The beauty of this problem lies in its simplicity and the elegance of the Two Pointers technique.
          </p>
          
          <div className="bg-black/30 p-4 rounded-lg">
            <h4 className="font-bold text-purple-400 mb-3">✨ Why Two Pointers Work:</h4>
            <p className="text-purple-200 leading-relaxed">
              The Two Pointers pattern is effective here because:
            </p>
            <ul className="list-disc list-inside space-y-2 text-purple-200">
              <li>• It reduces the need for nested loops, optimizing performance.</li>
              <li>• It leverages the sorted nature of the array for efficient searching.</li>
              <li>• It provides a systematic way to explore potential solutions.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Concept Exploration */}
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Brain className="w-7 h-7 mr-3 text-blue-400" />
          🎓 Interactive Concept Exploration
        </h3>
        
        <div className="space-y-6">
          <p className="text-blue-200 leading-relaxed">
            Ready to see the concepts in action? Use the interactive visualization above in the 
            &quot;Interactive Demo&quot; tab to experiment with the Two Pointers technique. 
            Modify the array, set your target, and watch how the pointers move!
          </p>
          
          {/* Mini Interactive Example */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-bold text-purple-400 mb-4">🔬 Quick Concept Test</h4>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-white mb-3">Given array: [1, 3, 5, 7, 9] and target: 8</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-blue-300 text-sm mb-1">Step 1:</p>
                    <p className="text-white">Left=0, Right=4</p>
                    <p className="text-blue-200 text-sm mb-2">1 + 9 = 10 &gt; 8</p>
                    <p className="text-orange-300 text-sm">Move right ←</p>
                  </div>
                  <div className="bg-green-900/50 p-3 rounded-lg">
                    <p className="text-green-300 text-sm mb-1">Step 2:</p>
                    <p className="text-white">Left=0, Right=3</p>
                    <p className="text-green-200 text-sm mb-2">1 + 7 = 8 = 8</p>
                    <p className="text-yellow-300 text-sm">🎉 Found!</p>
                  </div>
                  <div className="bg-purple-900/50 p-3 rounded-lg">
                    <p className="text-purple-300 text-sm mb-1">Result:</p>
                    <p className="text-white">Indices: [0, 3]</p>
                    <p className="text-purple-200 text-sm">Values: 1, 7</p>
                    <p className="text-yellow-300 text-sm">Time: O(n)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg p-4 border border-indigo-400/30">
                <p className="text-indigo-200 text-center">
                  💡 <strong>Key Insight:</strong> The sorted array property lets us eliminate half the possibilities 
                  with each pointer movement, making this incredibly efficient!
                </p>
              </div>
            </div>
          </div>
          
          {/* Learning Path */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">🎯 Master the Pattern in 3 Steps</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-900/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <p className="text-white font-semibold">Understand the Logic</p>
                  <p className="text-blue-200 text-sm">Learn why pointer movements work in sorted arrays</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-900/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <p className="text-white font-semibold">Practice with Visualization</p>
                  <p className="text-green-200 text-sm">Use the interactive demo to see each step</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-900/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <p className="text-white font-semibold">Apply to Similar Problems</p>
                  <p className="text-purple-200 text-sm">Extend to Three Sum, Container With Most Water</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Algorithm Complexity Analysis */}
      {/* <ComplexityIndicator
        timeComplexity="O(n)"
        spaceComplexity="O(1)"
        bestCase="O(1)"
        averageCase="O(n)"
        worstCase="O(n)"
        isInteractive={true}
        showDetails={true}
      /> */}
    </motion.div>
  )
}
