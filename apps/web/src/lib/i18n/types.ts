export type Language = 'en' | 'es'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
  flag: string
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  }
}

export const DEFAULT_LANGUAGE: Language = 'en'