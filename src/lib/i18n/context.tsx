'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Language } from './types'
import { DEFAULT_LANGUAGE, LANGUAGES } from './types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'ai-whisperers-language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language preference on mount
  useEffect(() => {
    // SSR guard: Only access localStorage in browser
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language
      // Derive valid languages dynamically from LANGUAGES config
      const validLanguages = Object.keys(LANGUAGES) as Language[]
      if (saved && validLanguages.includes(saved)) {
        setLanguageState(saved)
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)

    // SSR guard: Only access localStorage in browser
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (error) {
      console.warn('Failed to save language preference:', error)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}