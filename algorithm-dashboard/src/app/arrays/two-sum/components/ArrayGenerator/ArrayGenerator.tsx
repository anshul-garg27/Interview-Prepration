// src/app/arrays/two-sum/components/ArrayGenerator/ArrayGenerator.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Dice6 } from 'lucide-react'
import { useTwoSumAlgorithm } from '../../hooks/useTwoSumAlgorithm'
import { AnimatedBackground } from './AnimatedBackground'
import { PresetChallenges } from './PresetChallenges'
import { GeneratorControls } from './GeneratorControls'
import { CurrentTestCase } from './CurrentTestCase'

export function ArrayGenerator() {
  const { 
    array, 
    target, 
    generateRandomArray, 
    setArray, 
    setTarget, 
    runAlgorithm 
  } = useTwoSumAlgorithm()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/60 to-pink-800/60 rounded-3xl p-8 border-2 border-purple-400/40 backdrop-blur-lg shadow-2xl overflow-hidden relative"
    >
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GeneratorControls 
            onGenerateArray={generateRandomArray}
            onSetArray={setArray}
            onSetTarget={setTarget}
          />
          
          <PresetChallenges
            onArrayChange={setArray}
            onTargetChange={setTarget}
          />
        </div>

        <CurrentTestCase
          array={array}
          target={target}
          onVisualize={runAlgorithm}
        />
      </div>
    </motion.div>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-3xl font-bold text-purple-300 flex items-center">
        🎲 Array Generator Magic
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="ml-3 text-4xl"
        >
          🎰
        </motion.div>
      </h4>
      <div className="bg-purple-900/50 rounded-full px-6 py-3 border border-purple-400/30">
        <span className="text-purple-300 font-mono text-lg font-bold">
          Smart Test Cases
        </span>
      </div>
    </div>
  )
}
