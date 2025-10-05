/**
 * I18n Context
 * Layer 4: Global context for internationalization and localization
 */

'use client'

import { createContext, useContext } from 'react'
import type { I18nContextState } from './types'

export const I18nContext = createContext<I18nContextState | undefined>(undefined)

export function useI18nContext(): I18nContextState {
  const context = useContext(I18nContext)

  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider')
  }

  return context
}

// Convenience hooks
export function useLanguage() {
  const { currentLanguage, supportedLanguages, setLanguage, isLoading } = useI18nContext()
  return { language: currentLanguage, supportedLanguages, setLanguage, isLoading }
}

export function useTranslation() {
  const { translate, t } = useI18nContext()
  return { translate, t }
}

export function useLocale() {
  const { locale, textDirection } = useI18nContext()
  return { locale, textDirection }
}

export function useFormatters() {
  const { formatDate, formatCurrency, formatNumber } = useI18nContext()
  return { formatDate, formatCurrency, formatNumber }
}
