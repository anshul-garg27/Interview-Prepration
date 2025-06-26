// 🎨 DEFINITIVE WORLD-CLASS ALGORITHM PATTERN VISUALIZATION
// Ultra-sophisticated, globally appealing, pattern-focused design
// "Visual Poetry in Code" - The Global Standard for Algorithm Learning

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Crown,
  Gem,
  Globe,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Target
} from 'lucide-react';
import React, { useState } from 'react';

// 🎨 WORLD-CLASS DESIGN TOKENS
const DESIGN_TOKENS = {
  colors: {
    // Global Appeal Color Psychology
    success: '#00D4AA',    // Calm mint - universal success
    progress: '#007AFF',   // Trust blue - Apple's iconic
    error: '#FF3B30',      // Gentle red - not aggressive  
    warning: '#FF9500',    // Warm orange - friendly
    neutral: '#8E8E93',    // Sophisticated gray
    background: '#000000', // Pure black - premium cinema
    surface: '#1C1C1E',    // Rich elevated black
    surfaceElevated: '#2C2C2E', // Depth layer
    accent: '#5856D6',     // Purple - creativity & intelligence
    white: '#FFFFFF',
    text: {
      primary: '#FFFFFF',
      secondary: '#AEAEB2',
      tertiary: '#636366'
    }
  },
  
  typography: {
    // Geometric elegance - readable globally
    fontFamily: {
      display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SF Mono", Consolas, Monaco, monospace'
    },
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '4rem'     // 64px
    }
  },
  
  spacing: {
    // Golden ratio based spacing
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.618rem',  // 26px (golden ratio)
    xl: '2.618rem',  // 42px (golden ratio)
    '2xl': '4.236rem', // 68px (golden ratio)
    '3xl': '6.854rem'  // 110px (golden ratio)
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },
  
  shadows: {
    // Cinematic depth - subtle and beautiful
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glass: '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
    glow: '0 0 20px rgba(88, 86, 214, 0.3)'
  }
};

// 🎬 CINEMATIC ANIMATION PRESETS
const ANIMATIONS = {
  // Physics-based natural motion
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 300
  },
  
  // Smooth easing for elegance
  easeOut: {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.4
  },
  
  // Quick micro-interactions
  micro: {
    type: "tween",
    ease: "easeOut",
    duration: 0.15
  },
  
  // Dramatic entrances
  entrance: {
    type: "spring",
    damping: 20,
    stiffness: 150,
    mass: 1
  }
};

// 🌟 PATTERN VISUALIZATION DEFINITIONS
interface AlgorithmPattern {
  id: string;
  name: string;
  description: string;
  visualMetaphor: string;
  color: string;
  icon: React.ComponentType;
  complexity: {
    time: string;
    space: string;
  };
  examples: string[];
  visualization: {
    type: 'flow' | 'tree' | 'graph' | 'sequence' | 'matrix';
    style: 'dance' | 'build' | 'explore' | 'flow' | 'pulse';
  };
}

const ALGORITHM_PATTERNS: AlgorithmPattern[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    description: 'Synchronized exploration from opposite ends',
    visualMetaphor: 'A graceful dance of two spirits converging',
    color: DESIGN_TOKENS.colors.progress,
    icon: Target,
    complexity: { time: 'O(n)', space: 'O(1)' },
    examples: ['Two Sum Sorted', 'Valid Palindrome', 'Container With Most Water'],
    visualization: { type: 'sequence', style: 'dance' }
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    description: 'Intelligent exploration with strategic retreats',
    visualMetaphor: 'A wise explorer mapping uncharted territories',
    color: DESIGN_TOKENS.colors.accent,
    icon: Brain,
    complexity: { time: 'O(2^n)', space: 'O(n)' },
    examples: ['N-Queens', 'Sudoku Solver', 'Word Search'],
    visualization: { type: 'tree', style: 'explore' }
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Building solutions from optimal substructures',
    visualMetaphor: 'Architect crafting with crystalline building blocks',
    color: DESIGN_TOKENS.colors.success,
    icon: Gem,
    complexity: { time: 'O(n²)', space: 'O(n)' },
    examples: ['Fibonacci', 'Longest Common Subsequence', 'Knapsack'],
    visualization: { type: 'matrix', style: 'build' }
  },
  {
    id: 'graphs',
    name: 'Graph Traversal',
    description: 'Navigating networks of connected relationships',
    visualMetaphor: 'Neural pathways lighting up with understanding',
    color: DESIGN_TOKENS.colors.warning,
    icon: Globe,
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    examples: ['DFS', 'BFS', 'Shortest Path'],
    visualization: { type: 'graph', style: 'pulse' }
  }
];

// 🎨 WORLD-CLASS UI COMPONENTS

// Cinematic Glass Button
interface CinematicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  glowEffect?: boolean;
}

const CinematicButton: React.FC<CinematicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  glowEffect = false
}) => {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DESIGN_TOKENS.spacing.sm,
    fontFamily: DESIGN_TOKENS.typography.fontFamily.text,
    fontWeight: '600',
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    border: '1px solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease'
  };

  const variants = {
    primary: {
      backgroundColor: DESIGN_TOKENS.colors.accent,
      borderColor: DESIGN_TOKENS.colors.accent,
      color: DESIGN_TOKENS.colors.white,
      boxShadow: glowEffect ? DESIGN_TOKENS.shadows.glow : DESIGN_TOKENS.shadows.md
    },
    secondary: {
      backgroundColor: DESIGN_TOKENS.colors.surface,
      borderColor: DESIGN_TOKENS.colors.neutral,
      color: DESIGN_TOKENS.colors.text.primary,
      boxShadow: DESIGN_TOKENS.shadows.glass
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: DESIGN_TOKENS.colors.text.secondary,
      boxShadow: 'none'
    }
  };

  const sizes = {
    sm: {
      padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
      fontSize: DESIGN_TOKENS.typography.scale.sm
    },
    md: {
      padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
      fontSize: DESIGN_TOKENS.typography.scale.base
    },
    lg: {
      padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.xl}`,
      fontSize: DESIGN_TOKENS.typography.scale.lg
    }
  };

  return (
    <motion.button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        opacity: disabled ? 0.5 : 1
      }}
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: glowEffect ? 
          `0 0 30px ${DESIGN_TOKENS.colors.accent}40` : 
          DESIGN_TOKENS.shadows.lg
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={ANIMATIONS.micro}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
        </motion.div>
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
      )}
      {children}
    </motion.button>
  );
};

// Glass Morphism Card
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glowEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  glowEffect = false 
}) => {
  const cardStyles = {
    background: `linear-gradient(145deg, ${DESIGN_TOKENS.colors.surface}80, ${DESIGN_TOKENS.colors.surfaceElevated}40)`,
    backdropFilter: 'blur(20px)',
    borderRadius: DESIGN_TOKENS.borderRadius.xl,
    border: `1px solid ${DESIGN_TOKENS.colors.neutral}20`,
    padding: DESIGN_TOKENS.spacing.xl,
    boxShadow: glowEffect ? DESIGN_TOKENS.shadows.glow : DESIGN_TOKENS.shadows.glass
  };

  return (
    <motion.div
      style={cardStyles}
      className={className}
      whileHover={hoverable ? { 
        scale: 1.02,
        boxShadow: DESIGN_TOKENS.shadows.xl
      } : {}}
      transition={ANIMATIONS.spring}
    >
      {children}
    </motion.div>
  );
};

// Pattern Visualization Component
interface PatternVisualizerProps {
  pattern: AlgorithmPattern;
  isActive: boolean;
  onActivate: () => void;
}

const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  pattern,
  isActive,
  onActivate
}) => {
  const Icon = pattern.icon;
  
  return (
    <motion.div
      layout
      onClick={onActivate}
      style={{
        cursor: 'pointer',
        position: 'relative'
      }}
      whileHover={{ scale: 1.05 }}
      transition={ANIMATIONS.spring}
    >
      <GlassCard hoverable glowEffect={isActive}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: DESIGN_TOKENS.spacing.lg,
          minHeight: '200px'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: DESIGN_TOKENS.spacing.md 
          }}>
            <motion.div
              style={{
                padding: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.lg,
                backgroundColor: `${pattern.color}20`,
                border: `1px solid ${pattern.color}40`
              }}
              animate={isActive ? { 
                boxShadow: `0 0 20px ${pattern.color}40`,
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                boxShadow: { duration: 0.3 },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Icon 
                size={24} 
                style={{ color: pattern.color }}
              />
            </motion.div>
            
            <div>
              <h3 style={{
                fontFamily: DESIGN_TOKENS.typography.fontFamily.display,
                fontSize: DESIGN_TOKENS.typography.scale.xl,
                fontWeight: '700',
                color: DESIGN_TOKENS.colors.text.primary,
                margin: 0
              }}>
                {pattern.name}
              </h3>
              <p style={{
                fontFamily: DESIGN_TOKENS.typography.fontFamily.text,
                fontSize: DESIGN_TOKENS.typography.scale.sm,
                color: DESIGN_TOKENS.colors.text.secondary,
                margin: 0,
                marginTop: DESIGN_TOKENS.spacing.xs
              }}>
                {pattern.description}
              </p>
            </div>
          </div>

          {/* Visual Metaphor */}
          <div style={{
            padding: DESIGN_TOKENS.spacing.lg,
            borderRadius: DESIGN_TOKENS.borderRadius.md,
            backgroundColor: `${pattern.color}10`,
            border: `1px solid ${pattern.color}20`
          }}>
            <p style={{
              fontFamily: DESIGN_TOKENS.typography.fontFamily.text,
              fontSize: DESIGN_TOKENS.typography.scale.base,
              color: DESIGN_TOKENS.colors.text.secondary,
              fontStyle: 'italic',
              margin: 0,
              textAlign: 'center'
            }}>
              "{pattern.visualMetaphor}"
            </p>
          </div>

          {/* Complexity Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: DESIGN_TOKENS.spacing.md
          }}>
            <div>
              <span style={{
                fontSize: DESIGN_TOKENS.typography.scale.xs,
                color: DESIGN_TOKENS.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '600'
              }}>
                Time
              </span>
              <p style={{
                fontFamily: DESIGN_TOKENS.typography.fontFamily.mono,
                fontSize: DESIGN_TOKENS.typography.scale.sm,
                color: DESIGN_TOKENS.colors.text.primary,
                margin: 0
              }}>
                {pattern.complexity.time}
              </p>
            </div>
            <div>
              <span style={{
                fontSize: DESIGN_TOKENS.typography.scale.xs,
                color: DESIGN_TOKENS.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '600'
              }}>
                Space
              </span>
              <p style={{
                fontFamily: DESIGN_TOKENS.typography.fontFamily.mono,
                fontSize: DESIGN_TOKENS.typography.scale.sm,
                color: DESIGN_TOKENS.colors.text.primary,
                margin: 0
              }}>
                {pattern.complexity.space}
              </p>
            </div>
          </div>
        </div>

        {/* Active Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: DESIGN_TOKENS.spacing.md,
                right: DESIGN_TOKENS.spacing.md,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: pattern.color,
                boxShadow: `0 0 10px ${pattern.color}80`
              }}
            />
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

// Main World-Class Implementation
const WorldClassAlgorithmDashboard: React.FC = () => {
  const [activePattern, setActivePattern] = useState<string>('two-pointers');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentPattern = ALGORITHM_PATTERNS.find(p => p.id === activePattern);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: DESIGN_TOKENS.colors.background,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, ${DESIGN_TOKENS.colors.accent}15 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, ${DESIGN_TOKENS.colors.progress}15 0%, transparent 50%)
      `,
      padding: DESIGN_TOKENS.spacing.xl,
      fontFamily: DESIGN_TOKENS.typography.fontFamily.text
    }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ANIMATIONS.entrance}
        style={{
          textAlign: 'center',
          marginBottom: DESIGN_TOKENS.spacing['3xl']
        }}
      >
        <motion.div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing.md,
            marginBottom: DESIGN_TOKENS.spacing.lg
          }}
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crown 
            size={32} 
            style={{ color: DESIGN_TOKENS.colors.accent }}
          />
          <h1 style={{
            fontFamily: DESIGN_TOKENS.typography.fontFamily.display,
            fontSize: DESIGN_TOKENS.typography.scale['5xl'],
            fontWeight: '800',
            background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.text.primary}, ${DESIGN_TOKENS.colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Algorithm Pattern Mastery
          </h1>
          <Crown 
            size={32} 
            style={{ color: DESIGN_TOKENS.colors.accent }}
          />
        </motion.div>
        
        <p style={{
          fontFamily: DESIGN_TOKENS.typography.fontFamily.text,
          fontSize: DESIGN_TOKENS.typography.scale.xl,
          color: DESIGN_TOKENS.colors.text.secondary,
          margin: 0,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Discover the visual poetry hidden within algorithmic patterns
        </p>
      </motion.header>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ANIMATIONS.entrance, delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: DESIGN_TOKENS.spacing.lg,
          marginBottom: DESIGN_TOKENS.spacing['2xl']
        }}
      >
        <CinematicButton
          icon={isPlaying ? Pause : Play}
          variant="primary"
          glowEffect
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'} Visualization
        </CinematicButton>
        
        <CinematicButton
          icon={Square}
          variant="secondary"
          onClick={() => setIsPlaying(false)}
        >
          Stop
        </CinematicButton>
        
        <CinematicButton
          icon={RotateCcw}
          variant="ghost"
          onClick={() => {
            setIsPlaying(false);
            // Reset visualization
          }}
        >
          Reset
        </CinematicButton>
      </motion.div>

      {/* Pattern Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...ANIMATIONS.entrance, delay: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: DESIGN_TOKENS.spacing.xl,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {ALGORITHM_PATTERNS.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              ...ANIMATIONS.entrance, 
              delay: 0.6 + (index * 0.1)
            }}
          >
            <PatternVisualizer
              pattern={pattern}
              isActive={activePattern === pattern.id}
              onActivate={() => setActivePattern(pattern.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Active Pattern Detail */}
      <AnimatePresence mode="wait">
        {currentPattern && (
          <motion.div
            key={currentPattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={ANIMATIONS.easeOut}
            style={{
              marginTop: DESIGN_TOKENS.spacing['2xl'],
              maxWidth: '800px',
              margin: `${DESIGN_TOKENS.spacing['2xl']} auto 0`
            }}
          >
            <GlassCard>
              <div style={{
                textAlign: 'center',
                padding: DESIGN_TOKENS.spacing.lg
              }}>
                <h2 style={{
                  fontFamily: DESIGN_TOKENS.typography.fontFamily.display,
                  fontSize: DESIGN_TOKENS.typography.scale['3xl'],
                  fontWeight: '700',
                  color: currentPattern.color,
                  margin: 0,
                  marginBottom: DESIGN_TOKENS.spacing.lg
                }}>
                  {currentPattern.name} Visualization
                </h2>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: DESIGN_TOKENS.spacing.sm,
                  justifyContent: 'center',
                  marginTop: DESIGN_TOKENS.spacing.lg
                }}>
                  {currentPattern.examples.map((example, index) => (
                    <motion.span
                      key={example}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        ...ANIMATIONS.spring, 
                        delay: index * 0.1 
                      }}
                      style={{
                        padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
                        backgroundColor: `${currentPattern.color}20`,
                        border: `1px solid ${currentPattern.color}40`,
                        borderRadius: DESIGN_TOKENS.borderRadius.full,
                        fontSize: DESIGN_TOKENS.typography.scale.sm,
                        color: DESIGN_TOKENS.colors.text.primary,
                        fontFamily: DESIGN_TOKENS.typography.fontFamily.mono
                      }}
                    >
                      {example}
                    </motion.span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...ANIMATIONS.entrance, delay: 1 }}
        style={{
          textAlign: 'center',
          marginTop: DESIGN_TOKENS.spacing['3xl'],
          paddingTop: DESIGN_TOKENS.spacing.xl,
          borderTop: `1px solid ${DESIGN_TOKENS.colors.neutral}20`
        }}
      >
        <p style={{
          fontFamily: DESIGN_TOKENS.typography.fontFamily.text,
          fontSize: DESIGN_TOKENS.typography.scale.sm,
          color: DESIGN_TOKENS.colors.text.tertiary,
          margin: 0
        }}>
          Crafted with ❤️ for algorithm enthusiasts worldwide
        </p>
      </motion.footer>
    </div>
  );
};

export default WorldClassAlgorithmDashboard;
