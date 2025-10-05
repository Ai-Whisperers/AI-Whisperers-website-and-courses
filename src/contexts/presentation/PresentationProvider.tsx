/**
 * Presentation Provider
 * Layer 2: UI, Themes, Styling, Accessibility
 */

'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { PresentationContext } from './PresentationContext'
import type {
  PresentationContextState,
  ThemeMode,
  FontSize,
  ContrastMode,
  AnimationSpeed,
  LayoutPreferences,
  AccessibilityPreferences,
  UIPreferences,
} from './types'
import { DEFAULT_UI_PREFERENCES, FONT_SIZE_MAP, ANIMATION_SPEED_MAP } from './types'
import { COLOR_THEMES, ColorTheme } from '@/lib/themes/colorThemes'
import { getStorageItem, setStorageItem } from '@/utils/storage'

interface PresentationProviderProps {
  children: ReactNode
}

export function PresentationProvider({ children }: PresentationProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState<string>('blueProfessional')
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [preferences, setPreferences] = useState<UIPreferences>(DEFAULT_UI_PREFERENCES)

  // Load saved preferences on mount
  useEffect(() => {
    const savedThemeId = getStorageItem('PRESENTATION', 'themeId', 'blueProfessional')
    const savedThemeMode = getStorageItem('PRESENTATION', 'themeMode', 'auto')
    const savedPreferences = getStorageItem('PRESENTATION', 'preferences', DEFAULT_UI_PREFERENCES)

    setCurrentThemeId(savedThemeId)
    setThemeModeState(savedThemeMode)
    setPreferences(savedPreferences)

    // Determine dark mode based on theme mode
    updateDarkMode(savedThemeMode)
  }, [])

  // Update dark mode based on theme mode
  const updateDarkMode = useCallback((mode: ThemeMode) => {
    if (mode === 'dark') {
      setIsDarkMode(true)
    } else if (mode === 'light') {
      setIsDarkMode(false)
    } else {
      // Auto mode: check system preference
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(prefersDark)
      }
    }
  }, [])

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themeMode !== 'auto' || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // Apply theme to document
  const applyThemeToDOM = useCallback((theme: ColorTheme) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Apply color theme CSS variables
    Object.entries(theme.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })
    Object.entries(theme.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value)
    })
    Object.entries(theme.accent).forEach(([key, value]) => {
      root.style.setProperty(`--color-accent-${key}`, value)
    })
    Object.entries(theme.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value)
    })
    Object.entries(theme.success).forEach(([key, value]) => {
      root.style.setProperty(`--color-success-${key}`, value)
    })
    Object.entries(theme.warning).forEach(([key, value]) => {
      root.style.setProperty(`--color-warning-${key}`, value)
    })
    Object.entries(theme.error).forEach(([key, value]) => {
      root.style.setProperty(`--color-error-${key}`, value)
    })
  }, [])

  // Apply preferences to document
  const applyPreferencesToDOM = useCallback((prefs: UIPreferences) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Apply font size
    root.style.setProperty('--font-size-base', FONT_SIZE_MAP[prefs.fontSize])

    // Apply animation speed
    root.style.setProperty('--animation-duration', ANIMATION_SPEED_MAP[prefs.animationSpeed])

    // Apply reduce motion
    if (prefs.accessibility.reduceMotion) {
      root.style.setProperty('--animation-duration', '0s')
    }

    // Apply high contrast
    if (prefs.accessibility.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Apply compact mode
    if (prefs.layout.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
  }, [])

  // Apply current theme whenever it changes
  useEffect(() => {
    const theme = COLOR_THEMES[currentThemeId as keyof typeof COLOR_THEMES]
    if (theme) {
      applyThemeToDOM(theme)
    }
  }, [currentThemeId, applyThemeToDOM])

  // Apply preferences whenever they change
  useEffect(() => {
    applyPreferencesToDOM(preferences)
  }, [preferences, applyPreferencesToDOM])

  // Apply dark mode class
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Theme actions
  const setTheme = useCallback((themeId: string) => {
    if (COLOR_THEMES[themeId as keyof typeof COLOR_THEMES]) {
      setCurrentThemeId(themeId)
      setStorageItem('PRESENTATION', 'themeId', themeId)
    }
  }, [])

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    setStorageItem('PRESENTATION', 'themeMode', mode)
    updateDarkMode(mode)
  }, [updateDarkMode])

  const toggleDarkMode = useCallback(() => {
    const newMode: ThemeMode = isDarkMode ? 'light' : 'dark'
    setThemeMode(newMode)
  }, [isDarkMode, setThemeMode])

  // Preference actions
  const setFontSize = useCallback((size: FontSize) => {
    setPreferences(prev => {
      const updated = { ...prev, fontSize: size }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const setContrastMode = useCallback((mode: ContrastMode) => {
    setPreferences(prev => {
      const updated = { ...prev, contrastMode: mode }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const setAnimationSpeed = useCallback((speed: AnimationSpeed) => {
    setPreferences(prev => {
      const updated = { ...prev, animationSpeed: speed }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const updateLayoutPreferences = useCallback((layout: Partial<LayoutPreferences>) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        layout: { ...prev.layout, ...layout },
      }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const updateAccessibilityPreferences = useCallback((a11y: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        accessibility: { ...prev.accessibility, ...a11y },
      }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const updatePreferences = useCallback((prefs: Partial<UIPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs }
      setStorageItem('PRESENTATION', 'preferences', updated)
      return updated
    })
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_UI_PREFERENCES)
    setStorageItem('PRESENTATION', 'preferences', DEFAULT_UI_PREFERENCES)
  }, [])

  const value: PresentationContextState = {
    currentTheme: COLOR_THEMES[currentThemeId as keyof typeof COLOR_THEMES],
    themeMode,
    isDarkMode,
    availableThemes: COLOR_THEMES,
    preferences,
    setTheme,
    setThemeMode,
    toggleDarkMode,
    setFontSize,
    setContrastMode,
    setAnimationSpeed,
    updateLayoutPreferences,
    updateAccessibilityPreferences,
    updatePreferences,
    resetPreferences,
  }

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  )
}
