/**
 * Presentation Provider
 * Layer 2B: User UI Preferences and Accessibility
 * NOTE: Theme management moved to DesignSystemContext (Layer 2A)
 * PRIVATE DATA - User-specific preferences (requires GDPR compliance)
 */

'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { PresentationContext } from './PresentationContext'
import type {
  PresentationContextState,
  FontSize,
  ContrastMode,
  AnimationSpeed,
  LayoutPreferences,
  AccessibilityPreferences,
  UIPreferences,
} from './types'
import { DEFAULT_UI_PREFERENCES, FONT_SIZE_MAP, ANIMATION_SPEED_MAP } from './types'
import { getStorageItem, setStorageItem } from '@/utils/storage'

interface PresentationProviderProps {
  children: ReactNode
}

export function PresentationProvider({ children }: PresentationProviderProps) {
  // State: User UI Preferences
  const [preferences, setPreferences] = useState<UIPreferences>(DEFAULT_UI_PREFERENCES)

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = getStorageItem('PRESENTATION', 'preferences', DEFAULT_UI_PREFERENCES)
    setPreferences(savedPreferences)
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

  // Apply preferences whenever they change
  useEffect(() => {
    applyPreferencesToDOM(preferences)
  }, [preferences, applyPreferencesToDOM])

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
    preferences,
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
