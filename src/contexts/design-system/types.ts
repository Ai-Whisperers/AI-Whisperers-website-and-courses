/**
 * Design System Context Types
 * Type definitions for the Design System Context
 */

import type { ThemeId } from '@/lib/design-system/tokens/colors'
import type { designTokens } from '@/lib/design-system/tokens'

/**
 * Design System State
 * Contains all static design tokens and current theme
 */
export interface DesignSystemState {
  /**
   * Current active theme ID
   */
  currentThemeId: ThemeId

  /**
   * Complete design token system
   */
  tokens: typeof designTokens

  /**
   * Design system version
   */
  version: string
}

/**
 * Design System Actions
 * Functions to interact with the design system
 */
export interface DesignSystemActions {
  /**
   * Change the current theme
   */
  setTheme: (themeId: ThemeId) => void

  /**
   * Get theme by ID
   */
  getTheme: (themeId: ThemeId) => ReturnType<typeof designTokens.colors.themes[ThemeId]>

  /**
   * Get all available themes
   */
  getAllThemes: () => Array<{
    id: string
    name: string
    description: string
  }>
}

/**
 * Complete Design System Context
 */
export interface DesignSystemContext extends DesignSystemState, DesignSystemActions {}
