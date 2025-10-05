/**
 * I18n Context Types
 * Layer 4: Internationalization, Language, Locale, Translations
 */

import type { Language } from '@/lib/i18n/types'

// Locale information
export interface LocaleInfo {
  code: string // BCP 47 locale code (e.g., 'en-US', 'es-ES')
  name: string // Display name
  nativeName: string // Native display name
  direction: 'ltr' | 'rtl'
}

// Date formatting options
export interface DateFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
  hour12?: boolean
}

// Currency formatting options
export interface CurrencyFormatOptions {
  currency: string // ISO 4217 currency code
  display?: 'symbol' | 'code' | 'name'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

// Number formatting options
export interface NumberFormatOptions {
  style?: 'decimal' | 'percent'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

// Translation parameters
export type TranslationParams = Record<string, string | number>

// I18n Context State
export interface I18nContextState {
  // Language
  currentLanguage: Language
  supportedLanguages: Language[]
  isLoading: boolean

  // Localization
  locale: LocaleInfo
  textDirection: 'ltr' | 'rtl'

  // Actions
  setLanguage: (lang: Language) => void

  // Formatting utilities
  formatDate: (date: Date, options?: DateFormatOptions) => string
  formatCurrency: (amount: number, options?: CurrencyFormatOptions) => string
  formatNumber: (value: number, options?: NumberFormatOptions) => string

  // Translation (if using runtime translations)
  translate: (key: string, params?: TranslationParams) => string
  t: (key: string, params?: TranslationParams) => string // Shorthand alias
}

// Locale information by language
export const LOCALE_INFO: Record<Language, LocaleInfo> = {
  en: {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  es: {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
  },
}

// Default date format options by language
export const DEFAULT_DATE_FORMATS: Record<Language, DateFormatOptions> = {
  en: {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  },
  es: {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
  },
}

// Default currency by language
export const DEFAULT_CURRENCIES: Record<Language, string> = {
  en: 'USD',
  es: 'EUR',
}
