/**
 * Presentation Context Types
 * Layer 2: UI, Themes, Styling, Accessibility
 */

import type { ColorTheme } from '@/lib/themes/colorThemes'

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto'

// Font size preferences
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'

// Contrast mode
export type ContrastMode = 'normal' | 'high' | 'extra-high'

// Animation preferences
export type AnimationSpeed = 'none' | 'reduced' | 'normal' | 'fast'

// Layout preferences
export interface LayoutPreferences {
  sidebarCollapsed: boolean
  compactMode: boolean
  showBreadcrumbs: boolean
  gridDensity: 'comfortable' | 'compact' | 'spacious'
}

// Accessibility preferences
export interface AccessibilityPreferences {
  reduceMotion: boolean
  highContrast: boolean
  screenReaderMode: boolean
  keyboardNavigationHints: boolean
  focusIndicatorStyle: 'default' | 'enhanced'
}

// UI Preferences (all user customizations)
export interface UIPreferences {
  fontSize: FontSize
  contrastMode: ContrastMode
  animationSpeed: AnimationSpeed
  layout: LayoutPreferences
  accessibility: AccessibilityPreferences
}

// Presentation Context State
export interface PresentationContextState {
  // Theme
  currentTheme: ColorTheme
  themeMode: ThemeMode
  isDarkMode: boolean
  availableThemes: Record<string, ColorTheme>

  // Preferences
  preferences: UIPreferences

  // Actions - Theme
  setTheme: (themeId: string) => void
  setThemeMode: (mode: ThemeMode) => void
  toggleDarkMode: () => void

  // Actions - Preferences
  setFontSize: (size: FontSize) => void
  setContrastMode: (mode: ContrastMode) => void
  setAnimationSpeed: (speed: AnimationSpeed) => void
  updateLayoutPreferences: (layout: Partial<LayoutPreferences>) => void
  updateAccessibilityPreferences: (a11y: Partial<AccessibilityPreferences>) => void
  updatePreferences: (prefs: Partial<UIPreferences>) => void
  resetPreferences: () => void
}

// Default preferences
export const DEFAULT_UI_PREFERENCES: UIPreferences = {
  fontSize: 'medium',
  contrastMode: 'normal',
  animationSpeed: 'normal',
  layout: {
    sidebarCollapsed: false,
    compactMode: false,
    showBreadcrumbs: true,
    gridDensity: 'comfortable',
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    screenReaderMode: false,
    keyboardNavigationHints: false,
    focusIndicatorStyle: 'default',
  },
}

// CSS variable mappings for font sizes
export const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
  'extra-large': '20px',
}

// CSS variable mappings for animation speeds
export const ANIMATION_SPEED_MAP: Record<AnimationSpeed, string> = {
  none: '0s',
  reduced: '0.15s',
  normal: '0.3s',
  fast: '0.15s',
}
