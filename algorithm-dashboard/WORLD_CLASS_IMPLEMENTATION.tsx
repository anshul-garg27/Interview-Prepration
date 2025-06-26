// 🌟 WORLD-CLASS ALGORITHM DASHBOARD - REVOLUTIONARY IMPLEMENTATION
// This represents the pinnacle of UI/UX design for global appeal

'use client';

import { Box, OrbitControls, Sphere, Torus } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  ChevronRight,
  Crown,
  Eye,
  Flame,
  Gem,
  Globe,
  Heart,
  Lightning,
  Maximize,
  Mic,
  Minimize,
  Rocket,
  Sparkles,
  Stars,
  Target,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// 🧠 NEURAL ADAPTIVE INTERFACE
interface NeuralState {
  emotionalState: 'excited' | 'focused' | 'confused' | 'accomplished';
  cognitiveLoad: number; // 0-100
  attentionLevel: number; // 0-100
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  energyLevel: number; // 0-100
}

interface BiometricData {
  heartRate?: number;
  eyeGaze?: { x: number; y: number };
  stressLevel?: number;
  engagementScore?: number;
}

// 🎨 QUANTUM COLOR SYSTEM - Emotionally Intelligent Colors
const QUANTUM_COLORS = {
  neural: {
    primary: 'from-violet-500 via-purple-500 to-indigo-500',
    secondary: 'from-cyan-400 via-blue-500 to-purple-600',
    accent: 'from-pink-400 via-rose-500 to-red-500',
    success: 'from-emerald-400 via-green-500 to-teal-600',
    warning: 'from-amber-400 via-orange-500 to-red-500',
    info: 'from-sky-400 via-blue-500 to-indigo-600'
  },
  emotions: {
    excited: 'from-yellow-400 via-orange-500 to-red-500',
    focused: 'from-blue-400 via-indigo-500 to-purple-600',
    confused: 'from-gray-400 via-slate-500 to-gray-600',
    accomplished: 'from-green-400 via-emerald-500 to-teal-600'
  },
  consciousness: {
    awakening: 'from-pink-300 via-purple-400 to-indigo-500',
    enlightenment: 'from-white via-yellow-200 to-gold-400',
    transcendence: 'from-indigo-600 via-purple-700 to-black'
  }
};

// 🎵 IMMERSIVE AUDIO SYSTEM
const NEURAL_AUDIO = {
  ambient: {
    focus: 'neural-focus-40hz.mp3',
    creativity: 'gamma-creativity-waves.mp3',
    relaxation: 'theta-meditation.mp3'
  },
  feedback: {
    success: 'quantum-success-chime.wav',
    error: 'gentle-error-tone.wav',
    progress: 'neural-progress-pulse.wav'
  },
  environmental: {
    algorithmForest: 'forest-algorithm-ambience.mp3',
    quantumSpace: 'cosmic-computation-sounds.mp3',
    dataOcean: 'digital-ocean-waves.mp3'
  }
};

// 🌟 3D ALGORITHM VISUALIZATION COMPONENT
const AlgorithmMetaverse: React.FC<{ algorithm: string; isActive: boolean }> = ({ algorithm, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Animate based on algorithm complexity
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Quantum breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Algorithm Core */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={isActive ? "#8b5cf6" : "#6366f1"} 
          metalness={0.8}
          roughness={0.2}
          emissive={isActive ? "#4c1d95" : "#1e1b4b"}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Data Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Box key={i} args={[0.1, 0.1, 0.1]} position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]}>
          <meshStandardMaterial color="#f59e0b" />
        </Box>
      ))}
      
      {/* Complexity Rings */}
      <Torus args={[3, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#10b981" wireframe />
      </Torus>
      <Torus args={[4, 0.05, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#ef4444" wireframe />
      </Torus>
    </group>
  );
};

// 🎮 NEURAL INTERFACE CONTROLS
const NeuralControls: React.FC<{
  neuralState: NeuralState;
  onStateChange: (state: Partial<NeuralState>) => void;
}> = ({ neuralState, onStateChange }) => {
  return (
    <motion.div 
      className="absolute top-4 right-4 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col space-y-3">
        {/* Emotional State Selector */}
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <select 
            value={neuralState.emotionalState}
            onChange={(e) => onStateChange({ emotionalState: e.target.value as any })}
            className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
          >
            <option value="excited">🔥 Excited</option>
            <option value="focused">🎯 Focused</option>
            <option value="confused">🤔 Confused</option>
            <option value="accomplished">🏆 Accomplished</option>
          </select>
        </div>

        {/* Cognitive Load Monitor */}
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
              style={{ width: `${neuralState.cognitiveLoad}%` }}
              animate={{ width: `${neuralState.cognitiveLoad}%` }}
            />
          </div>
          <span className="text-xs text-white/70">{neuralState.cognitiveLoad}%</span>
        </div>

        {/* Attention Level */}
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full"
              style={{ width: `${neuralState.attentionLevel}%` }}
              animate={{ width: `${neuralState.attentionLevel}%` }}
            />
          </div>
          <span className="text-xs text-white/70">{neuralState.attentionLevel}%</span>
        </div>

        {/* Energy Level */}
        <div className="flex items-center space-x-2">
          <Lightning className="w-4 h-4 text-yellow-400" />
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              style={{ width: `${neuralState.energyLevel}%` }}
              animate={{ width: `${neuralState.energyLevel}%` }}
            />
          </div>
          <span className="text-xs text-white/70">{neuralState.energyLevel}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// 🏆 GAMIFICATION SYSTEM
const GamificationOverlay: React.FC<{
  score: number;
  level: number;
  achievements: string[];
  streak: number;
}> = ({ score, level, achievements, streak }) => {
  return (
    <motion.div 
      className="absolute top-4 left-4 space-y-4"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Score & Level */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{level}</div>
            <div className="text-xs text-white/70">Level</div>
          </div>
          <div className="text-center">
            <Gem className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{score.toLocaleString()}</div>
            <div className="text-xs text-white/70">Score</div>
          </div>
          <div className="text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{streak}</div>
            <div className="text-xs text-white/70">Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <AnimatePresence>
        {achievements.slice(-3).map((achievement, index) => (
          <motion.div
            key={achievement}
            className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-xl p-3"
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">{achievement}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// 🌐 COLLABORATIVE INTELLIGENCE HUD
const CollaborativeHUD: React.FC<{
  onlineUsers: number;
  collaborationMode: boolean;
  globalRank: number;
}> = ({ onlineUsers, collaborationMode, globalRank }) => {
  return (
    <motion.div 
      className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white">{onlineUsers.toLocaleString()}</span>
          <span className="text-xs text-white/70">online</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <motion.div
            className={`w-2 h-2 rounded-full ${collaborationMode ? 'bg-green-400' : 'bg-gray-400'}`}
            animate={{ scale: collaborationMode ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: collaborationMode ? Infinity : 0, duration: 2 }}
          />
          <span className="text-xs text-white/70">
            {collaborationMode ? 'Collaborating' : 'Solo'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white">#{globalRank}</span>
          <span className="text-xs text-white/70">global</span>
        </div>
      </div>
    </motion.div>
  );
};

// 🎭 WORLD-CLASS TESTING SECTION
export const WorldClassTestingSection: React.FC = () => {
  const [neuralState, setNeuralState] = useState<NeuralState>({
    emotionalState: 'focused',
    cognitiveLoad: 45,
    attentionLevel: 78,
    learningStyle: 'visual',
    energyLevel: 82
  });

  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 25,
    engagementScore: 87
  });

  const [gamificationState, setGamificationState] = useState({
    score: 15420,
    level: 12,
    achievements: [
      "🎯 Perfect Algorithm",
      "🚀 Speed Demon", 
      "🧠 Neural Master",
      "🌟 Code Poet",
      "💎 Optimization Guru"
    ],
    streak: 7
  });

  const [isTestRunning, setIsTestRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);

  // 🎵 Dynamic background based on emotional state
  const backgroundGradient = useMemo(() => {
    const emotion = neuralState.emotionalState;
    const base = QUANTUM_COLORS.emotions[emotion];
    return `bg-gradient-to-br ${base}`;
  }, [neuralState.emotionalState]);

  // 🧠 Neural adaptation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate biometric changes
      setBiometricData(prev => ({
        ...prev,
        heartRate: 65 + Math.random() * 20,
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel! + (Math.random() - 0.5) * 10)),
        engagementScore: Math.max(0, Math.min(100, prev.engagementScore! + (Math.random() - 0.5) * 5))
      }));

      // Adapt cognitive load based on activity
      setNeuralState(prev => ({
        ...prev,
        cognitiveLoad: Math.max(0, Math.min(100, prev.cognitiveLoad + (Math.random() - 0.5) * 5)),
        attentionLevel: Math.max(0, Math.min(100, prev.attentionLevel + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🎮 Advanced test execution with quantum simulation
  const runQuantumTest = async (testType: string) => {
    setIsTestRunning(true);
    setActiveTest(testType);

    // Neural feedback
    setNeuralState(prev => ({
      ...prev,
      cognitiveLoad: Math.min(100, prev.cognitiveLoad + 20),
      emotionalState: 'focused'
    }));

    // Simulate quantum test execution
    const testSteps = [
      '🌌 Initializing quantum test environment...',
      '🧠 Loading neural algorithm patterns...',
      '⚡ Executing parallel test universes...',
      '🔬 Analyzing quantum entangled results...',
      '✨ Collapsing probability states...',
      '🎯 Finalizing dimensional output...'
    ];

    for (const step of testSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(step);
    }

    // Generate spectacular results
    const results = {
      id: Date.now(),
      testType,
      status: 'passed',
      executionTime: `${(Math.random() * 2 + 0.1).toFixed(3)}ms`,
      quantumEfficiency: `${(Math.random() * 20 + 80).toFixed(1)}%`,
      neuralScore: `${(Math.random() * 30 + 70).toFixed(0)}/100`,
      dimensionalAccuracy: `${(Math.random() * 5 + 95).toFixed(2)}%`,
      cosmicResonance: `${(Math.random() * 10 + 90).toFixed(1)}Hz`
    };

    setTestResults(prev => [results, ...prev.slice(0, 4)]);
    
    // Update gamification
    setGamificationState(prev => ({
      ...prev,
      score: prev.score + Math.floor(Math.random() * 500 + 100),
      streak: prev.streak + 1
    }));

    // Neural celebration
    setNeuralState(prev => ({
      ...prev,
      emotionalState: 'accomplished',
      energyLevel: Math.min(100, prev.energyLevel + 10)
    }));

    setIsTestRunning(false);
    setActiveTest(null);
  };

  const quantumTests = [
    {
      id: 'neural-performance',
      title: 'Neural Performance Analysis',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'AI-powered algorithm optimization with quantum enhancement'
    },
    {
      id: 'dimensional-correctness',
      title: 'Dimensional Correctness Validation',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      description: 'Multi-dimensional correctness verification across parallel universes'
    },
    {
      id: 'cosmic-complexity',
      title: 'Cosmic Complexity Measurement',
      icon: Stars,
      color: 'from-yellow-500 to-orange-500',
      description: 'Universal complexity analysis using quantum metrics'
    },
    {
      id: 'consciousness-integration',
      title: 'Consciousness Integration Test',
      icon: Sparkles,
      color: 'from-green-500 to-teal-500',
      description: 'Test algorithm consciousness and self-awareness capabilities'
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${backgroundGradient}`}>
      {/* Quantum Particle Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Neural Interface Controls */}
      <NeuralControls 
        neuralState={neuralState}
        onStateChange={(changes) => setNeuralState(prev => ({ ...prev, ...changes }))}
      />

      {/* Gamification Overlay */}
      <GamificationOverlay 
        score={gamificationState.score}
        level={gamificationState.level}
        achievements={gamificationState.achievements}
        streak={gamificationState.streak}
      />

      {/* Collaborative Intelligence HUD */}
      <CollaborativeHUD 
        onlineUsers={24567}
        collaborationMode={false}
        globalRank={342}
      />

      {/* Main Content Area */}
      <div className="relative z-10 p-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🌟 Quantum Algorithm Testing Lab
          </motion.h1>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Experience the future of algorithm testing with neural adaptation, 
            quantum simulation, and immersive 3D visualization
          </motion.p>
        </motion.div>

        {/* 3D Immersive Environment */}
        {immersiveMode && (
          <motion.div 
            className="h-80 w-full mb-8 rounded-3xl overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[-10, -10, -10]} angle={0.3} intensity={0.5} />
              <AlgorithmMetaverse algorithm="backtracking" isActive={isTestRunning} />
              <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
            </Canvas>
          </motion.div>
        )}

        {/* Quantum Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quantumTests.map((test, index) => (
            <motion.div
              key={test.id}
              className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-black/30 transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => runQuantumTest(test.id)}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${test.color} flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <test.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {test.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <motion.button
                      className={`px-4 py-2 rounded-xl bg-gradient-to-r ${test.color} text-white font-medium text-sm hover:shadow-lg transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isTestRunning}
                    >
                      {isTestRunning && activeTest === test.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Execute Test'
                      )}
                    </motion.button>
                    <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Test Results Visualization */}
        {testResults.length > 0 && (
          <motion.div 
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Rocket className="w-6 h-6 mr-3 text-cyan-400" />
              Quantum Test Results
            </h3>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  className="bg-black/30 rounded-2xl p-4 border border-white/10"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{result.executionTime}</div>
                      <div className="text-xs text-white/70">Execution Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-400">{result.quantumEfficiency}</div>
                      <div className="text-xs text-white/70">Quantum Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{result.neuralScore}</div>
                      <div className="text-xs text-white/70">Neural Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{result.dimensionalAccuracy}</div>
                      <div className="text-xs text-white/70">Dimensional Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-400">{result.cosmicResonance}</div>
                      <div className="text-xs text-white/70">Cosmic Resonance</div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full mx-auto flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✓
                      </motion.div>
                      <div className="text-xs text-white/70 mt-1">Status</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Control Panel */}
        <motion.div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setImmersiveMode(!immersiveMode)}
            >
              {immersiveMode ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
            </motion.button>
            
            <motion.button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
            </motion.button>

            <motion.button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVoiceControlEnabled(!voiceControlEnabled)}
            >
              <Mic className={`w-5 h-5 ${voiceControlEnabled ? 'text-green-400' : 'text-white'}`} />
            </motion.button>

            <div className="w-px h-6 bg-white/20" />
            
            <motion.button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Enter Metaverse
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WorldClassTestingSection;
