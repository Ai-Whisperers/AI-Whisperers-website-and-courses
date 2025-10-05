/**
 * Shadow Design Tokens
 * Centralized shadow system for depth and elevation
 */

// Box shadow tokens (elevation levels)
export const boxShadow = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Glassmorphism shadows (for glass effect)
export const glassShadow = {
  sm: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  base: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  md: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  lg: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
} as const

// Elevation shadows (semantic elevation levels)
export const elevation = {
  0: boxShadow.none,
  1: boxShadow.xs,
  2: boxShadow.sm,
  3: boxShadow.base,
  4: boxShadow.md,
  5: boxShadow.lg,
  6: boxShadow.xl,
  7: boxShadow['2xl'],
} as const

// Component-specific shadows
export const componentShadow = {
  button: {
    default: boxShadow.sm,
    hover: boxShadow.md,
    active: boxShadow.xs,
  },
  card: {
    default: boxShadow.base,
    hover: boxShadow.lg,
  },
  modal: boxShadow.xl,
  dropdown: boxShadow.lg,
  tooltip: boxShadow.md,
  navbar: boxShadow.sm,
  popover: boxShadow.lg,
} as const

// Drop shadow tokens (for filters)
export const dropShadow = {
  none: 'drop-shadow(0 0 #0000)',
  sm: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
  base: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
  md: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
  lg: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
  xl: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
  '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
} as const

// Export types
export type BoxShadow = keyof typeof boxShadow
export type GlassShadow = keyof typeof glassShadow
export type Elevation = keyof typeof elevation
export type DropShadow = keyof typeof dropShadow
