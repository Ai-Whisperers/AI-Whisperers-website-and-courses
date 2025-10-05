/**
 * Presentation Context
 * Layer 2: Global context for UI, themes, styling, and accessibility
 */

'use client'

import { createContext, useContext } from 'react'
import type { PresentationContextState } from './types'

export const PresentationContext = createContext<PresentationContextState | undefined>(undefined)

export function usePresentationContext(): PresentationContextState {
  const context = useContext(PresentationContext)

  if (context === undefined) {
    throw new Error('usePresentationContext must be used within a PresentationProvider')
  }

  return context
}

// Convenience hooks
export function useTheme() {
  const { currentTheme, themeMode, isDarkMode, setTheme, setThemeMode, toggleDarkMode } = usePresentationContext()
  return { currentTheme, themeMode, isDarkMode, setTheme, setThemeMode, toggleDarkMode }
}

export function useUIPreferences() {
  const {
    preferences,
    setFontSize,
    setContrastMode,
    setAnimationSpeed,
    updateLayoutPreferences,
    updateAccessibilityPreferences,
    updatePreferences,
    resetPreferences,
  } = usePresentationContext()

  return {
    preferences,
    setFontSize,
    setContrastMode,
    setAnimationSpeed,
    updateLayoutPreferences,
    updateAccessibilityPreferences,
    updatePreferences,
    resetPreferences,
  }
}

export function useAccessibility() {
  const { preferences, updateAccessibilityPreferences } = usePresentationContext()
  return {
    accessibility: preferences.accessibility,
    updateAccessibility: updateAccessibilityPreferences,
  }
}
