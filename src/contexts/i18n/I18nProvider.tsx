/**
 * I18n Provider
 * Layer 4: Internationalization, Language, Locale, Translations
 */

'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { I18nContext } from './I18nContext'
import type {
  I18nContextState,
  LocaleInfo,
  DateFormatOptions,
  CurrencyFormatOptions,
  NumberFormatOptions,
  TranslationParams,
} from './types'
import { LOCALE_INFO, DEFAULT_DATE_FORMATS, DEFAULT_CURRENCIES } from './types'
import { Language, LANGUAGES } from '@/lib/i18n/types'
import { i18nConfig } from '@/lib/i18n/config'
import { getStorageItem, setStorageItem } from '@/utils/storage'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(i18nConfig.defaultLanguage)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = getStorageItem('I18N', 'language', i18nConfig.defaultLanguage)

    // Validate language
    const validLanguages = Object.keys(LANGUAGES) as Language[]
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setCurrentLanguageState(savedLanguage)
    }

    setIsLoading(false)
  }, [])

  // Set language with persistence
  const setLanguage = useCallback((lang: Language) => {
    const validLanguages = Object.keys(LANGUAGES) as Language[]

    if (!validLanguages.includes(lang)) {
      console.warn(`[I18n] Invalid language: ${lang}`)
      return
    }

    setCurrentLanguageState(lang)
    setStorageItem('I18N', 'language', lang)

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [])

  // Get locale info for current language
  const locale: LocaleInfo = (LOCALE_INFO as any)[currentLanguage] || LOCALE_INFO['en']
  const textDirection = locale.direction

  // Format date using current locale
  const formatDate = useCallback(
    (date: Date, options?: DateFormatOptions): string => {
      const defaultOptions = (DEFAULT_DATE_FORMATS as any)[currentLanguage] || DEFAULT_DATE_FORMATS['en']
      const formatOptions = { ...defaultOptions, ...options }

      try {
        return new Intl.DateTimeFormat(locale.code, formatOptions).format(date)
      } catch (error) {
        console.error('[I18n] Date formatting error:', error)
        return date.toLocaleDateString()
      }
    },
    [currentLanguage, locale]
  )

  // Format currency using current locale
  const formatCurrency = useCallback(
    (amount: number, options?: CurrencyFormatOptions): string => {
      const defaultCurrency = (DEFAULT_CURRENCIES as any)[currentLanguage] || DEFAULT_CURRENCIES['en']
      const currency = options?.currency || defaultCurrency

      const formatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        currencyDisplay: options?.display || 'symbol',
        minimumFractionDigits: options?.minimumFractionDigits,
        maximumFractionDigits: options?.maximumFractionDigits,
      }

      try {
        return new Intl.NumberFormat(locale.code, formatOptions).format(amount)
      } catch (error) {
        console.error('[I18n] Currency formatting error:', error)
        return `${currency} ${amount.toFixed(2)}`
      }
    },
    [currentLanguage, locale]
  )

  // Format number using current locale
  const formatNumber = useCallback(
    (value: number, options?: NumberFormatOptions): string => {
      const formatOptions: Intl.NumberFormatOptions = {
        style: options?.style || 'decimal',
        minimumFractionDigits: options?.minimumFractionDigits,
        maximumFractionDigits: options?.maximumFractionDigits,
      }

      try {
        return new Intl.NumberFormat(locale.code, formatOptions).format(value)
      } catch (error) {
        console.error('[I18n] Number formatting error:', error)
        return value.toString()
      }
    },
    [locale]
  )

  // Translation function (placeholder - for future runtime translations)
  const translate = useCallback(
    (key: string, params?: TranslationParams): string => {
      // TODO: Implement runtime translation lookup
      // For now, return the key as-is since we use compile-time translations
      let translation = key

      // Replace parameters if provided
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{{${param}}}`, String(value))
        })
      }

      return translation
    },
    []
  )

  const value: I18nContextState = {
    currentLanguage,
    supportedLanguages: Object.keys(LANGUAGES) as Language[],
    isLoading,
    locale,
    textDirection,
    setLanguage,
    formatDate,
    formatCurrency,
    formatNumber,
    translate,
    t: translate, // Alias
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
