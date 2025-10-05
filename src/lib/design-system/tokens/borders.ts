/**
 * Border Design Tokens
 * Centralized border system for radius, width, and styles
 */

// Border radius tokens
export const borderRadius = {
  none: '0',
  xs: '0.125rem',    // 2px
  sm: '0.25rem',     // 4px
  base: '0.375rem',  // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',    // Circular
} as const

// Border width tokens
export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Border style tokens
export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none',
} as const

// Outline width tokens
export const outlineWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Outline offset tokens
export const outlineOffset = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Component-specific border radius
export const componentBorderRadius = {
  button: {
    sm: borderRadius.sm,
    base: borderRadius.md,
    lg: borderRadius.lg,
    pill: borderRadius.full,
  },
  input: {
    sm: borderRadius.sm,
    base: borderRadius.md,
    lg: borderRadius.lg,
  },
  card: {
    sm: borderRadius.lg,
    base: borderRadius.xl,
    lg: borderRadius['2xl'],
  },
  modal: borderRadius.xl,
  badge: borderRadius.full,
  avatar: borderRadius.full,
  image: {
    sm: borderRadius.sm,
    base: borderRadius.md,
    lg: borderRadius.lg,
    circle: borderRadius.full,
  },
  tooltip: borderRadius.md,
  dropdown: borderRadius.lg,
} as const

// Divide width tokens (for borders between elements)
export const divideWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Ring width tokens (for focus rings)
export const ringWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
  DEFAULT: '3px',
} as const

// Ring offset width tokens
export const ringOffsetWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Export types
export type BorderRadius = keyof typeof borderRadius
export type BorderWidth = keyof typeof borderWidth
export type BorderStyle = keyof typeof borderStyle
export type OutlineWidth = keyof typeof outlineWidth
export type OutlineOffset = keyof typeof outlineOffset
export type DivideWidth = keyof typeof divideWidth
export type RingWidth = keyof typeof ringWidth
export type RingOffsetWidth = keyof typeof ringOffsetWidth
