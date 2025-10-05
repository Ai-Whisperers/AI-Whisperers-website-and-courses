'use client'

/**
 * Design System Context Provider
 * Layer 2A: Static design tokens and theme management
 * PUBLIC DATA - No user-specific information
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { designTokens, DESIGN_TOKEN_VERSION, type ThemeId } from '@/lib/design-system'
import { themeUtils } from '@/lib/design-system/themes'
import type { DesignSystemContext as IDesignSystemContext } from './types'

// Create context
const DesignSystemContext = createContext<IDesignSystemContext | undefined>(undefined)

/**
 * Design System Provider Props
 */
interface DesignSystemProviderProps {
  children: React.ReactNode
  /**
   * Initial theme ID (optional, defaults to blueProfessional)
   */
  initialThemeId?: ThemeId
  /**
   * Enable server-side rendering support
   */
  enableSSR?: boolean
}

/**
 * Design System Provider Component
 * Provides design tokens and theme management
 */
export function DesignSystemProvider({
  children,
  initialThemeId = 'blueProfessional',
  enableSSR = true,
}: DesignSystemProviderProps) {
  // State: Current theme ID
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(initialThemeId)

  // Effect: Apply theme to DOM when theme changes
  useEffect(() => {
    if (!enableSSR || typeof window !== 'undefined') {
      themeUtils.applyTheme(currentThemeId)
    }
  }, [currentThemeId, enableSSR])

  // Effect: Restore theme from DOM on mount (for SSR hydration)
  useEffect(() => {
    if (enableSSR && typeof window !== 'undefined') {
      const domTheme = themeUtils.getCurrentTheme()
      if (domTheme !== currentThemeId) {
        setCurrentThemeId(domTheme)
      }
    }
  }, [enableSSR, currentThemeId])

  // Action: Set theme
  const setTheme = useCallback((themeId: ThemeId) => {
    if (themeUtils.isValidThemeId(themeId)) {
      setCurrentThemeId(themeId)
    } else {
      console.warn(`[DesignSystem] Invalid theme ID: ${themeId}`)
    }
  }, [])

  // Action: Get theme by ID
  const getTheme = useCallback((themeId: ThemeId) => {
    return themeUtils.getThemeById(themeId)
  }, [])

  // Action: Get all themes
  const getAllThemes = useCallback(() => {
    return themeUtils.getAllThemes().map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
    }))
  }, [])

  // Memoized context value
  const contextValue = useMemo<IDesignSystemContext>(
    () => ({
      // State
      currentThemeId,
      tokens: designTokens,
      version: DESIGN_TOKEN_VERSION,

      // Actions
      setTheme,
      getTheme,
      getAllThemes,
    }),
    [currentThemeId, setTheme, getTheme, getAllThemes]
  )

  return (
    <DesignSystemContext.Provider value={contextValue}>
      {children}
    </DesignSystemContext.Provider>
  )
}

/**
 * Hook: Use Design System
 * Access design tokens and theme management
 */
export function useDesignSystem() {
  const context = useContext(DesignSystemContext)

  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider')
  }

  return context
}

/**
 * Hook: Use Theme
 * Convenience hook for theme management only
 */
export function useTheme() {
  const { currentThemeId, setTheme, getTheme, getAllThemes } = useDesignSystem()

  return {
    themeId: currentThemeId,
    theme: getTheme(currentThemeId),
    setTheme,
    getAllThemes,
  }
}

/**
 * Hook: Use Tokens
 * Convenience hook for accessing design tokens
 */
export function useTokens() {
  const { tokens } = useDesignSystem()
  return tokens
}
