/**
 * Spacing Design Tokens
 * Centralized spacing system for margins, padding, gaps
 * Using 4px base unit (0.25rem) for consistency
 */

// Base spacing scale (4px base unit)
export const spacing = {
  0: '0',           // 0px
  px: '1px',        // 1px
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

// Semantic spacing tokens (named by purpose)
export const semanticSpacing = {
  // Component internal spacing
  component: {
    '2xs': spacing[1],      // 4px
    xs: spacing[2],       // 8px
    sm: spacing[3],       // 12px
    base: spacing[4],     // 16px
    md: spacing[6],       // 24px
    lg: spacing[8],       // 32px
    xl: spacing[12],      // 48px
    '2xl': spacing[16],   // 64px
  },

  // Layout spacing (sections, containers)
  layout: {
    xs: spacing[4],       // 16px
    sm: spacing[6],       // 24px
    base: spacing[8],     // 32px
    md: spacing[12],      // 48px
    lg: spacing[16],      // 64px
    xl: spacing[24],      // 96px
    '2xl': spacing[32],   // 128px
    '3xl': spacing[48],   // 192px
    '4xl': spacing[64],   // 256px
  },

  // Stack spacing (vertical rhythm)
  stack: {
    '2xs': spacing[1],      // 4px
    xs: spacing[2],       // 8px
    sm: spacing[4],       // 16px
    base: spacing[6],     // 24px
    md: spacing[8],       // 32px
    lg: spacing[12],      // 48px
    xl: spacing[16],      // 64px
    '2xl': spacing[24],   // 96px
  },

  // Inline spacing (horizontal rhythm)
  inline: {
    '2xs': spacing[1],      // 4px
    xs: spacing[2],       // 8px
    sm: spacing[3],       // 12px
    base: spacing[4],     // 16px
    md: spacing[6],       // 24px
    lg: spacing[8],       // 32px
    xl: spacing[12],      // 48px
  },

  // Inset spacing (padding)
  inset: {
    xs: spacing[2],       // 8px
    sm: spacing[3],       // 12px
    base: spacing[4],     // 16px
    md: spacing[6],       // 24px
    lg: spacing[8],       // 32px
    xl: spacing[12],      // 48px
    '2xl': spacing[16],   // 64px
  },

  // Section spacing (page layout)
  section: {
    xs: spacing[8],       // 32px
    sm: spacing[12],      // 48px
    base: spacing[16],    // 64px
    md: spacing[24],      // 96px
    lg: spacing[32],      // 128px
    xl: spacing[48],      // 192px
    '2xl': spacing[64],   // 256px
  },
} as const

// Component-specific spacing presets
export const componentSpacing = {
  button: {
    paddingX: {
      sm: spacing[3],     // 12px
      base: spacing[4],   // 16px
      lg: spacing[6],     // 24px
      xl: spacing[8],     // 32px
    },
    paddingY: {
      sm: spacing[2],     // 8px
      base: spacing[2.5], // 10px
      lg: spacing[3],     // 12px
      xl: spacing[4],     // 16px
    },
    gap: spacing[2],      // 8px (icon + text gap)
  },

  card: {
    padding: {
      sm: spacing[4],     // 16px
      base: spacing[6],   // 24px
      lg: spacing[8],     // 32px
    },
    gap: spacing[4],      // 16px (internal gaps)
  },

  input: {
    paddingX: {
      sm: spacing[3],     // 12px
      base: spacing[4],   // 16px
      lg: spacing[5],     // 20px
    },
    paddingY: {
      sm: spacing[2],     // 8px
      base: spacing[2.5], // 10px
      lg: spacing[3],     // 12px
    },
  },

  modal: {
    padding: {
      header: spacing[6],  // 24px
      body: spacing[6],    // 24px
      footer: spacing[6],  // 24px
    },
    gap: spacing[4],       // 16px (between sections)
  },

  form: {
    fieldGap: spacing[4],   // 16px (between form fields)
    labelGap: spacing[2],   // 8px (label to input)
    sectionGap: spacing[8], // 32px (between form sections)
  },

  nav: {
    itemGap: spacing[2],    // 8px (between nav items)
    groupGap: spacing[6],   // 24px (between nav groups)
    padding: spacing[4],    // 16px (nav item padding)
  },

  list: {
    itemGap: spacing[2],    // 8px (between list items)
    indent: spacing[6],     // 24px (nested list indent)
    padding: spacing[3],    // 12px (list item padding)
  },

  grid: {
    gap: {
      sm: spacing[4],       // 16px
      base: spacing[6],     // 24px
      lg: spacing[8],       // 32px
      xl: spacing[12],      // 48px
    },
  },

  container: {
    paddingX: {
      sm: spacing[4],       // 16px (mobile)
      base: spacing[6],     // 24px (tablet)
      lg: spacing[8],       // 32px (desktop)
      xl: spacing[12],      // 48px (wide desktop)
    },
    paddingY: {
      sm: spacing[6],       // 24px (mobile)
      base: spacing[8],     // 32px (tablet)
      lg: spacing[12],      // 48px (desktop)
      xl: spacing[16],      // 64px (wide desktop)
    },
  },
} as const

// Container max-width tokens
export const containerWidth = {
  xs: '20rem',     // 320px
  sm: '24rem',     // 384px
  md: '28rem',     // 448px
  lg: '32rem',     // 512px
  xl: '36rem',     // 576px
  '2xl': '42rem',  // 672px
  '3xl': '48rem',  // 768px
  '4xl': '56rem',  // 896px
  '5xl': '64rem',  // 1024px
  '6xl': '72rem',  // 1152px
  '7xl': '80rem',  // 1280px
  full: '100%',
} as const

// Screen breakpoint tokens
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Export types
export type Spacing = keyof typeof spacing
export type SemanticSpacingCategory = keyof typeof semanticSpacing
export type ContainerWidth = keyof typeof containerWidth
export type Breakpoint = keyof typeof breakpoints
