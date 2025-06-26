// 🎨 WORLD-CLASS DESIGN SYSTEM
// Complete design tokens and component library
// Global standard for algorithm visualization interfaces

export const WORLD_CLASS_DESIGN = {
  // 🌈 COLOR PALETTE - Inspired by Apple, Netflix, Figma
  colors: {
    // Primary Brand Colors
    primary: {
      accent: '#5856D6',      // Purple - creativity & intelligence
      success: '#00D4AA',     // Mint green - calm success
      progress: '#007AFF',    // Apple blue - trust & progress
      warning: '#FF9500',     // Orange - friendly warning
      error: '#FF3B30',       // Gentle red - not aggressive
      info: '#64D2FF'         // Cyan - information
    },

    // Neutral Grays
    neutral: {
      50: '#F2F2F7',   // Lightest
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',  // Base neutral
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#2C2C2E',  // Surface
      950: '#1C1C1E'   // Elevated surface
    },

    // Backgrounds
    background: {
      primary: '#000000',     // Pure black - cinema
      secondary: '#1C1C1E',   // Rich black
      tertiary: '#2C2C2E',    // Elevated
      glass: '#FFFFFF10',     // Glass morphism
      gradient: {
        primary: 'linear-gradient(135deg, #5856D6, #007AFF)',
        success: 'linear-gradient(135deg, #00D4AA, #007AFF)',
        warm: 'linear-gradient(135deg, #FF9500, #FF3B30)'
      }
    },

    // Text Colors
    text: {
      primary: '#FFFFFF',     // High contrast
      secondary: '#AEAEB2',   // Medium contrast
      tertiary: '#636366',    // Low contrast
      inverse: '#000000'      // On light backgrounds
    },

    // Semantic Colors
    semantic: {
      algorithmComplexity: {
        constant: '#00D4AA',   // O(1) - Green
        logarithmic: '#007AFF', // O(log n) - Blue
        linear: '#FF9500',     // O(n) - Orange
        quadratic: '#FF3B30',  // O(n²) - Red
        exponential: '#5856D6' // O(2^n) - Purple
      },
      
      patternTypes: {
        twoPointers: '#007AFF',
        backtracking: '#5856D6',
        dynamicProgramming: '#00D4AA',
        graphs: '#FF9500',
        sorting: '#FF3B30',
        searching: '#64D2FF'
      }
    }
  },

  // 📝 TYPOGRAPHY SYSTEM
  typography: {
    fontFamily: {
      display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      mono: '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace'
    },

    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '4rem',     // 64px
      '7xl': '5rem'      // 80px
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
  },

  // 📐 SPACING SYSTEM - Golden Ratio Based
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    
    // Golden ratio values
    golden: {
      sm: '1rem',        // 16px
      md: '1.618rem',    // 26px
      lg: '2.618rem',    // 42px
      xl: '4.236rem',    // 68px
      '2xl': '6.854rem'  // 110px
    }
  },

  // 🔄 BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '0.25rem',     // 4px
    base: '0.375rem',  // 6px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px'
  },

  // 🌟 SHADOWS - Cinematic Depth
  shadows: {
    // Subtle shadows
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    
    // Standard shadows
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    
    // Dramatic shadows
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Glass morphism
    glass: '0 8px 32px 0 rgba(255, 255, 255, 0.1)',
    
    // Colored glows
    glow: {
      accent: '0 0 20px rgba(88, 86, 214, 0.4)',
      success: '0 0 20px rgba(0, 212, 170, 0.4)',
      progress: '0 0 20px rgba(0, 122, 255, 0.4)',
      warning: '0 0 20px rgba(255, 149, 0, 0.4)',
      error: '0 0 20px rgba(255, 59, 48, 0.4)'
    }
  },

  // 🎬 ANIMATION PRESETS
  animation: {
    // Timing functions
    easing: {
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
      snappy: 'cubic-bezier(0.4, 0, 1, 1)'
    },

    // Durations
    duration: {
      fastest: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slowest: '700ms'
    },

    // Framer Motion variants
    variants: {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      
      slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
      },
      
      scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
      },
      
      slideInFromLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
      },
      
      slideInFromRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      }
    }
  },

  // 📱 BREAKPOINTS
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // 🎯 Z-INDEX SCALE
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800'
  }
};

// 🎨 COMPONENT STYLE GENERATORS
export const generateComponentStyles = {
  // Button styles
  button: (variant: 'primary' | 'secondary' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => ({
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: WORLD_CLASS_DESIGN.spacing[2],
      fontFamily: WORLD_CLASS_DESIGN.typography.fontFamily.text,
      fontWeight: WORLD_CLASS_DESIGN.typography.fontWeight.semibold,
      borderRadius: WORLD_CLASS_DESIGN.borderRadius.lg,
      border: '1px solid',
      cursor: 'pointer',
      transition: 'all 200ms ease',
      outline: 'none',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    
    variants: {
      primary: {
        backgroundColor: WORLD_CLASS_DESIGN.colors.primary.accent,
        borderColor: WORLD_CLASS_DESIGN.colors.primary.accent,
        color: WORLD_CLASS_DESIGN.colors.text.primary,
        boxShadow: WORLD_CLASS_DESIGN.shadows.glow.accent
      },
      secondary: {
        backgroundColor: WORLD_CLASS_DESIGN.colors.neutral[900],
        borderColor: WORLD_CLASS_DESIGN.colors.neutral[700],
        color: WORLD_CLASS_DESIGN.colors.text.primary,
        boxShadow: WORLD_CLASS_DESIGN.shadows.glass
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: WORLD_CLASS_DESIGN.colors.text.secondary,
        boxShadow: 'none'
      }
    },
    
    sizes: {
      sm: {
        padding: `${WORLD_CLASS_DESIGN.spacing[2]} ${WORLD_CLASS_DESIGN.spacing[4]}`,
        fontSize: WORLD_CLASS_DESIGN.typography.fontSize.sm
      },
      md: {
        padding: `${WORLD_CLASS_DESIGN.spacing[3]} ${WORLD_CLASS_DESIGN.spacing[6]}`,
        fontSize: WORLD_CLASS_DESIGN.typography.fontSize.base
      },
      lg: {
        padding: `${WORLD_CLASS_DESIGN.spacing[4]} ${WORLD_CLASS_DESIGN.spacing[8]}`,
        fontSize: WORLD_CLASS_DESIGN.typography.fontSize.lg
      }
    }
  }),

  // Card styles
  card: (elevated: boolean = false, glass: boolean = false) => ({
    borderRadius: WORLD_CLASS_DESIGN.borderRadius.xl,
    padding: WORLD_CLASS_DESIGN.spacing.golden.md,
    backgroundColor: glass ? 
      WORLD_CLASS_DESIGN.colors.background.glass :
      elevated ? 
        WORLD_CLASS_DESIGN.colors.neutral[950] :
        WORLD_CLASS_DESIGN.colors.neutral[900],
    border: `1px solid ${WORLD_CLASS_DESIGN.colors.neutral[800]}`,
    boxShadow: glass ? 
      WORLD_CLASS_DESIGN.shadows.glass :
      elevated ?
        WORLD_CLASS_DESIGN.shadows.xl :
        WORLD_CLASS_DESIGN.shadows.lg,
    backdropFilter: glass ? 'blur(20px)' : 'none'
  }),

  // Input styles
  input: () => ({
    padding: `${WORLD_CLASS_DESIGN.spacing[3]} ${WORLD_CLASS_DESIGN.spacing[4]}`,
    borderRadius: WORLD_CLASS_DESIGN.borderRadius.lg,
    border: `1px solid ${WORLD_CLASS_DESIGN.colors.neutral[700]}`,
    backgroundColor: WORLD_CLASS_DESIGN.colors.neutral[900],
    color: WORLD_CLASS_DESIGN.colors.text.primary,
    fontSize: WORLD_CLASS_DESIGN.typography.fontSize.base,
    fontFamily: WORLD_CLASS_DESIGN.typography.fontFamily.text,
    outline: 'none',
    transition: 'all 200ms ease',
    
    ':focus': {
      borderColor: WORLD_CLASS_DESIGN.colors.primary.accent,
      boxShadow: WORLD_CLASS_DESIGN.shadows.glow.accent
    }
  })
};

// 🎨 UTILITY FUNCTIONS
export const designUtils = {
  // Generate glass morphism effect
  glassMorphism: (opacity: number = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(255, 255, 255, ${opacity * 2})`
  }),

  // Generate gradient backgrounds
  gradient: (direction: string = '135deg', colors: string[]) => 
    `linear-gradient(${direction}, ${colors.join(', ')})`,

  // Generate responsive values
  responsive: (values: Record<string, any>) => {
    const breakpoints = WORLD_CLASS_DESIGN.breakpoints;
    return Object.entries(values).reduce((acc, [key, value]) => {
      if (key in breakpoints) {
        acc[`@media (min-width: ${breakpoints[key as keyof typeof breakpoints]})`] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  },

  // Generate hover states
  hover: (styles: Record<string, any>) => ({
    '&:hover': styles
  }),

  // Generate focus states  
  focus: (styles: Record<string, any>) => ({
    '&:focus': styles
  }),

  // Generate active states
  active: (styles: Record<string, any>) => ({
    '&:active': styles
  })
};

export default WORLD_CLASS_DESIGN;
