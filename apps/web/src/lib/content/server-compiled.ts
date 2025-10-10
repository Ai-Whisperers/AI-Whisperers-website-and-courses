/**
 * Build-time Content Loading System
 * Uses pre-compiled content modules instead of runtime file system access
 * This ensures deployment compatibility and better performance
 *
 * Now supports multi-language content loading!
 */

import type { PageContent } from '@/types/content'
import type { Language } from '@/lib/i18n/types'
import { i18nConfig } from '@/lib/i18n/config'
import { getCompiledPageContent, getCompiledPageContentWithLang } from './compiled'
import { getFallbackPageContent } from './compiled/fallback'

/**
 * Localized content structure for client-side language switching
 */
export interface LocalizedContent<T = PageContent> {
  en: T
  es: T
}

/**
 * Load page content using pre-compiled content modules
 * NOW USES LANGUAGE PARAMETER! 🎉
 *
 * @param pageName - Base page name (e.g., 'homepage', 'about')
 * @param language - Language code (defaults to 'en')
 * @returns PageContent for the specified language with fallback to English
 */
export async function getPageContent(
  pageName: string,
  language: Language = i18nConfig.defaultLanguage
): Promise<PageContent> {
  try {
    // Use NEW language-aware function from compiled index
    const content = getCompiledPageContentWithLang(pageName, language)

    if (content) {
      // Validate that the content has required structure
      if (isValidPageContent(content)) {
        console.log(`✅ Loaded compiled content for: ${pageName}-${language}`)
        return content
      } else {
        console.warn(`⚠️  Compiled content for ${pageName}-${language} failed validation, using fallback`)
        return getFallbackPageContent(pageName)
      }
    }

    // Content not found, use fallback
    console.warn(`⚠️  No compiled content found for ${pageName}-${language}, using fallback`)
    return getFallbackPageContent(pageName)

  } catch (error) {
    console.error(`❌ Error loading compiled content for ${pageName}-${language}:`, error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))

    // Always return fallback to prevent crashes
    return getFallbackPageContent(pageName)
  }
}

/**
 * Load page content in ALL supported languages for client-side switching
 * This is the RECOMMENDED method for pages that need language switching
 *
 * @param pageName - Base page name (e.g., 'homepage')
 * @returns Object with content in all supported languages
 *
 * @example
 * ```tsx
 * // In page.tsx (server component)
 * const localizedContent = await getLocalizedPageContent('homepage')
 *
 * // Pass to client component
 * <DynamicHomepage localizedContent={localizedContent} />
 * ```
 */
export async function getLocalizedPageContent(
  pageName: string
): Promise<LocalizedContent<PageContent>> {
  try {
    const [en, es] = await Promise.all([
      getPageContent(pageName, 'en'),
      getPageContent(pageName, 'es')
    ])

    return { en, es }
  } catch (error) {
    console.error(`❌ Error loading localized content for ${pageName}:`, error)

    // Return fallback for both languages
    const fallback = getFallbackPageContent(pageName)
    return { en: fallback, es: fallback }
  }
}

/**
 * Type-safe validation for page content structure
 */
function isValidPageContent(content: unknown): content is PageContent {
  if (!content || typeof content !== 'object') {
    return false
  }
  
  const contentObj = content as Record<string, any>
  
  // Check for minimum required structure
  if (!contentObj.meta || typeof contentObj.meta !== 'object') {
    return false
  }
  
  // Meta object should have at least title and description
  const meta = contentObj.meta as Record<string, any>
  if (typeof meta.title !== 'string' || typeof meta.description !== 'string') {
    return false
  }
  
  return true
}

/**
 * Get all available pages from compiled content
 */
export async function getAllPagesContent(): Promise<Record<string, PageContent>> {
  try {
    // Import the content map from compiled content
    const { contentMap } = await import('./compiled')
    return contentMap
  } catch (error) {
    console.error('❌ Failed to load compiled content map:', error)
    return {}
  }
}

/**
 * Load component content (simplified - can be enhanced later if needed)
 */
export async function getComponentContent<T>(componentName: string): Promise<T | null> {
  console.warn(`⚠️  Component content loading not implemented for: ${componentName}`)
  return null
}