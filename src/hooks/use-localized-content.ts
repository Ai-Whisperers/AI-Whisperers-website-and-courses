'use client'

/**
 * Client-side Content Localization Hook
 *
 * This hook enables automatic content switching when the user changes language.
 * It works with the server-side getLocalizedPageContent() function.
 *
 * @module hooks/use-localized-content
 */

import { useMemo } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import type { PageContent } from '@/types/content'
import type { LocalizedContent } from '@/lib/content/server-compiled'

/**
 * Switch content based on current language selection
 *
 * This hook subscribes to language changes from LanguageContext
 * and automatically returns the correct language version of content.
 *
 * @param localizedContent - Content object with 'en' and 'es' properties
 * @returns PageContent in the currently selected language
 *
 * @example
 * ```tsx
 * // Server Component (page.tsx)
 * export default async function HomePage() {
 *   const localizedContent = await getLocalizedPageContent('homepage')
 *   return <DynamicHomepage localizedContent={localizedContent} />
 * }
 *
 * // Client Component (DynamicHomepage.tsx)
 * 'use client'
 * export function DynamicHomepage({ localizedContent }: Props) {
 *   // Content automatically switches when language changes!
 *   const content = useLocalizedContent(localizedContent)
 *
 *   return (
 *     <div>
 *       <h1>{content.hero.headline}</h1>
 *       <p>{content.hero.subheadline}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLocalizedContent(
  localizedContent: LocalizedContent<PageContent>
): PageContent {
  const { language, isLoading } = useLanguage()

  // Memoize content selection to avoid unnecessary re-renders
  const content = useMemo(() => {
    // While language preference is loading, show English
    if (isLoading) {
      return localizedContent.en
    }

    // Return content for selected language with fallback to English
    return localizedContent[language] || localizedContent.en
  }, [language, isLoading, localizedContent])

  return content
}

/**
 * Generic version for any localized data (not just PageContent)
 *
 * Useful for localized arrays, objects, or custom data structures
 *
 * @param localizedData - Object with 'en' and 'es' properties
 * @returns Data in the currently selected language
 *
 * @example
 * ```tsx
 * const messages = {
 *   en: ['Hello', 'Welcome'],
 *   es: ['Hola', 'Bienvenido']
 * }
 * const currentMessages = useLocalizedData(messages)
 * // Automatically switches when language changes
 * ```
 */
export function useLocalizedData<T>(
  localizedData: LocalizedContent<T>
): T {
  const { language, isLoading } = useLanguage()

  return useMemo(() => {
    if (isLoading) {
      return localizedData.en
    }

    return localizedData[language] || localizedData.en
  }, [language, isLoading, localizedData])
}

/**
 * Get current language code
 * Convenience wrapper around useLanguage()
 *
 * @returns Current language code ('en' | 'es')
 *
 * @example
 * ```tsx
 * const lang = useCurrentLanguage()
 * const formattedDate = formatDate(date, lang)
 * ```
 */
export function useCurrentLanguage() {
  const { language } = useLanguage()
  return language
}

/**
 * Check if a specific language is currently active
 *
 * @param targetLang - Language to check
 * @returns True if targetLang is the current language
 *
 * @example
 * ```tsx
 * const isSpanish = useIsLanguage('es')
 * if (isSpanish) {
 *   // Show Spanish-specific content
 * }
 * ```
 */
export function useIsLanguage(targetLang: 'en' | 'es'): boolean {
  const { language } = useLanguage()
  return language === targetLang
}
