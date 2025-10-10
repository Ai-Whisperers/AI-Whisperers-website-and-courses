/**
 * Design System Tokens
 * Central export for all design tokens
 */

// Re-export all token modules
export * from './colors'
export * from './typography'
export * from './spacing'
export * from './shadows'
export * from './borders'
export * from './transitions'
export * from './z-index'

// Convenience exports for common patterns
import { colorThemes, defaultThemeId, semanticColors, type ThemeId, type ThemeColors } from './colors'
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textPresets,
  fontSizeMultipliers,
  type FontSizePreference
} from './typography'
import {
  spacing,
  semanticSpacing,
  componentSpacing,
  containerWidth,
  breakpoints
} from './spacing'
import { boxShadow, glassShadow, elevation, componentShadow } from './shadows'
import { borderRadius, borderWidth, componentBorderRadius } from './borders'
import {
  transitionDuration,
  transitionTimingFunction,
  transitionPresets,
  componentTransitions,
  animationSpeedMultipliers,
  type AnimationSpeed
} from './transitions'
import { zIndex, componentZIndex } from './z-index'

/**
 * Complete Design Token System
 * Organized by category for easy access
 */
export const designTokens = {
  // Colors
  colors: {
    themes: colorThemes,
    defaultTheme: defaultThemeId,
    semantic: semanticColors,
  },

  // Typography
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    presets: textPresets,
    sizeMultipliers: fontSizeMultipliers,
  },

  // Spacing
  spacing: {
    base: spacing,
    semantic: semanticSpacing,
    component: componentSpacing,
    container: containerWidth,
    breakpoints,
  },

  // Shadows
  shadows: {
    box: boxShadow,
    glass: glassShadow,
    elevation,
    component: componentShadow,
  },

  // Borders
  borders: {
    radius: borderRadius,
    width: borderWidth,
    component: componentBorderRadius,
  },

  // Transitions
  transitions: {
    duration: transitionDuration,
    timingFunction: transitionTimingFunction,
    presets: transitionPresets,
    component: componentTransitions,
    speedMultipliers: animationSpeedMultipliers,
  },

  // Z-Index
  zIndex: {
    layers: zIndex,
    component: componentZIndex,
  },
} as const

/**
 * Token Version
 * Increment when making breaking changes to token structure
 */
export const DESIGN_TOKEN_VERSION = '1.0.0'

/**
 * Token Metadata
 */
export const tokenMetadata = {
  version: DESIGN_TOKEN_VERSION,
  lastUpdated: new Date().toISOString(),
  categories: [
    'colors',
    'typography',
    'spacing',
    'shadows',
    'borders',
    'transitions',
    'z-index'
  ],
} as const
