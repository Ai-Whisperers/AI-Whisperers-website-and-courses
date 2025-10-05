/**
 * Theme Configuration
 * Manages theme resolution and CSS variable generation
 */

import { colorThemes, type ThemeId, type ThemeColors } from '../tokens/colors'

/**
 * Theme CSS Variable Mapper
 * Maps theme colors to CSS custom properties
 */
export function generateThemeCSSVariables(theme: ThemeColors): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Primary colors (11 shades)
  Object.entries(theme.primary).forEach(([shade, value]) => {
    cssVars[`--color-primary-${shade}`] = value
  })

  // Secondary colors (11 shades)
  Object.entries(theme.secondary).forEach(([shade, value]) => {
    cssVars[`--color-secondary-${shade}`] = value
  })

  // Accent colors (11 shades)
  Object.entries(theme.accent).forEach(([shade, value]) => {
    cssVars[`--color-accent-${shade}`] = value
  })

  // Neutral colors (11 shades)
  Object.entries(theme.neutral).forEach(([shade, value]) => {
    cssVars[`--color-neutral-${shade}`] = value
  })

  // Semantic feedback colors
  cssVars['--color-success'] = theme.success
  cssVars['--color-warning'] = theme.warning
  cssVars['--color-error'] = theme.error

  // Semantic UI colors (mapped from theme)
  // Backgrounds
  cssVars['--color-bg-primary'] = cssVars['--color-neutral-950']
  cssVars['--color-bg-secondary'] = cssVars['--color-neutral-900']
  cssVars['--color-bg-tertiary'] = cssVars['--color-neutral-800']
  cssVars['--color-bg-inverse'] = cssVars['--color-neutral-50']
  cssVars['--color-bg-elevated'] = cssVars['--color-neutral-800']
  cssVars['--color-bg-overlay'] = 'rgba(0, 0, 0, 0.6)'

  // Surfaces
  cssVars['--color-surface-base'] = cssVars['--color-neutral-900']
  cssVars['--color-surface-raised'] = cssVars['--color-neutral-800']
  cssVars['--color-surface-overlay'] = cssVars['--color-neutral-700']
  cssVars['--color-surface-sunken'] = cssVars['--color-neutral-950']

  // Text
  cssVars['--color-text-primary'] = cssVars['--color-neutral-50']
  cssVars['--color-text-secondary'] = cssVars['--color-neutral-300']
  cssVars['--color-text-tertiary'] = cssVars['--color-neutral-400']
  cssVars['--color-text-inverse'] = cssVars['--color-neutral-950']
  cssVars['--color-text-disabled'] = cssVars['--color-neutral-600']
  cssVars['--color-text-link'] = cssVars['--color-primary-400']
  cssVars['--color-text-link-hover'] = cssVars['--color-primary-300']

  // Borders
  cssVars['--color-border-default'] = cssVars['--color-neutral-700']
  cssVars['--color-border-subtle'] = cssVars['--color-neutral-800']
  cssVars['--color-border-strong'] = cssVars['--color-neutral-600']
  cssVars['--color-border-interactive'] = cssVars['--color-primary-500']
  cssVars['--color-border-focus'] = cssVars['--color-primary-400']

  // Interactive states
  cssVars['--color-interactive-default'] = cssVars['--color-primary-500']
  cssVars['--color-interactive-hover'] = cssVars['--color-primary-400']
  cssVars['--color-interactive-active'] = cssVars['--color-primary-600']
  cssVars['--color-interactive-disabled'] = cssVars['--color-neutral-700']

  // Feedback (using semantic colors)
  cssVars['--color-feedback-success'] = cssVars['--color-success']
  cssVars['--color-feedback-warning'] = cssVars['--color-warning']
  cssVars['--color-feedback-error'] = cssVars['--color-error']
  cssVars['--color-feedback-info'] = cssVars['--color-primary-500']

  // Glassmorphism
  cssVars['--color-glass-bg'] = 'rgba(255, 255, 255, 0.05)'
  cssVars['--color-glass-border'] = 'rgba(255, 255, 255, 0.1)'
  cssVars['--color-glass-highlight'] = 'rgba(255, 255, 255, 0.15)'

  return cssVars
}

/**
 * Apply theme to DOM
 * Sets CSS variables on the root element
 */
export function applyThemeToDOM(themeId: ThemeId): void {
  if (typeof document === 'undefined') return

  const theme = colorThemes[themeId]
  const cssVars = generateThemeCSSVariables(theme)

  const root = document.documentElement

  // Apply all CSS variables
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // Store current theme ID as data attribute
  root.setAttribute('data-theme', themeId)
}

/**
 * Get current theme from DOM
 */
export function getCurrentThemeFromDOM(): ThemeId {
  if (typeof document === 'undefined') {
    return colorThemes.blueProfessional.id as ThemeId
  }

  const themeId = document.documentElement.getAttribute('data-theme')
  return (themeId as ThemeId) || (colorThemes.blueProfessional.id as ThemeId)
}

/**
 * Theme Utility Functions
 */
export const themeUtils = {
  /**
   * Get all available themes
   */
  getAllThemes: () => Object.values(colorThemes),

  /**
   * Get theme by ID
   */
  getThemeById: (id: ThemeId) => colorThemes[id],

  /**
   * Get all theme IDs
   */
  getAllThemeIds: () => Object.keys(colorThemes) as ThemeId[],

  /**
   * Check if theme ID is valid
   */
  isValidThemeId: (id: string): id is ThemeId => {
    return id in colorThemes
  },

  /**
   * Generate CSS variables for a theme
   */
  generateCSSVariables: generateThemeCSSVariables,

  /**
   * Apply theme to DOM
   */
  applyTheme: applyThemeToDOM,

  /**
   * Get current theme from DOM
   */
  getCurrentTheme: getCurrentThemeFromDOM,
} as const
