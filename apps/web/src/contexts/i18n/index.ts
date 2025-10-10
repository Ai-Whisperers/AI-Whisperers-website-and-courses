/**
 * I18n Context - Layer 4
 * Internationalization, Language, Locale, Translations
 */

export { I18nProvider } from './I18nProvider'
export {
  I18nContext,
  useI18nContext,
  useLanguage,
  useTranslation,
  useLocale,
  useFormatters,
} from './I18nContext'

export type {
  I18nContextState,
  LocaleInfo,
  DateFormatOptions,
  CurrencyFormatOptions,
  NumberFormatOptions,
  TranslationParams,
} from './types'

export { LOCALE_INFO, DEFAULT_DATE_FORMATS, DEFAULT_CURRENCIES } from './types'
