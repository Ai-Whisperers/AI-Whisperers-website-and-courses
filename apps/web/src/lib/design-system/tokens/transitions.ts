/**
 * Transition Design Tokens
 * Centralized animation and transition system
 */

// Transition duration tokens
export const transitionDuration = {
  0: '0ms',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const

// Transition timing function tokens (easing)
export const transitionTimingFunction = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Custom easing curves
  easeInSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
  easeOutSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',

  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
  easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',

  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',

  easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',

  // Smooth spring-like animation
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// Transition property tokens
export const transitionProperty = {
  none: 'none',
  all: 'all',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} as const

// Animation duration tokens
export const animationDuration = {
  0: '0ms',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
  2000: '2000ms',
  3000: '3000ms',
} as const

// Animation timing function tokens
export const animationTimingFunction = {
  ...transitionTimingFunction,
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// Semantic transition presets
export const transitionPresets = {
  // Fast interactions
  fast: {
    duration: transitionDuration[150],
    timingFunction: transitionTimingFunction.out,
  },

  // Base interactions (default)
  base: {
    duration: transitionDuration[200],
    timingFunction: transitionTimingFunction.inOut,
  },

  // Slow, smooth interactions
  slow: {
    duration: transitionDuration[300],
    timingFunction: transitionTimingFunction.inOut,
  },

  // Color transitions
  colors: {
    duration: transitionDuration[150],
    timingFunction: transitionTimingFunction.out,
    property: transitionProperty.colors,
  },

  // Transform transitions
  transform: {
    duration: transitionDuration[200],
    timingFunction: transitionTimingFunction.out,
    property: transitionProperty.transform,
  },

  // Opacity fade
  fade: {
    duration: transitionDuration[150],
    timingFunction: transitionTimingFunction.inOut,
    property: transitionProperty.opacity,
  },

  // Smooth spring-like
  spring: {
    duration: transitionDuration[300],
    timingFunction: transitionTimingFunction.spring,
  },
} as const

// Component-specific transitions
export const componentTransitions = {
  button: {
    default: {
      duration: transitionDuration[150],
      timingFunction: transitionTimingFunction.out,
      property: 'background-color, border-color, color, box-shadow',
    },
    hover: {
      duration: transitionDuration[100],
      timingFunction: transitionTimingFunction.out,
    },
  },

  modal: {
    backdrop: {
      duration: transitionDuration[200],
      timingFunction: transitionTimingFunction.inOut,
      property: transitionProperty.opacity,
    },
    content: {
      duration: transitionDuration[300],
      timingFunction: transitionTimingFunction.spring,
      property: 'transform, opacity',
    },
  },

  dropdown: {
    duration: transitionDuration[200],
    timingFunction: transitionTimingFunction.out,
    property: 'transform, opacity',
  },

  tooltip: {
    duration: transitionDuration[150],
    timingFunction: transitionTimingFunction.out,
    property: transitionProperty.opacity,
  },

  toast: {
    duration: transitionDuration[300],
    timingFunction: transitionTimingFunction.spring,
    property: 'transform, opacity',
  },

  tabs: {
    duration: transitionDuration[200],
    timingFunction: transitionTimingFunction.inOut,
    property: transitionProperty.colors,
  },
} as const

// User preference animation speed multipliers
export const animationSpeedMultipliers = {
  none: 0,          // No animations
  reduced: 0.5,     // 50% speed (accessibility)
  normal: 1,        // 100% (default)
  fast: 1.5,        // 150% speed
} as const

export type AnimationSpeed = keyof typeof animationSpeedMultipliers

// Helper to apply animation speed preference
export function applyAnimationSpeed(
  baseDuration: string,
  preference: AnimationSpeed = 'normal'
): string {
  const multiplier = animationSpeedMultipliers[preference]

  if (multiplier === 0) return '0ms'

  // Extract numeric value from duration string
  const match = baseDuration.match(/^(\d+)(.*)$/)
  if (!match) return baseDuration

  const [, value, unit] = match
  const newValue = Math.round(parseFloat(value) / multiplier)

  return `${newValue}${unit}`
}

// Export types
export type TransitionDuration = keyof typeof transitionDuration
export type TransitionTimingFunction = keyof typeof transitionTimingFunction
export type TransitionProperty = keyof typeof transitionProperty
export type AnimationDuration = keyof typeof animationDuration
export type AnimationTimingFunction = keyof typeof animationTimingFunction
export type TransitionPreset = keyof typeof transitionPresets
