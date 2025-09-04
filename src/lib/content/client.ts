import type { PageContent } from '@/types/content'
import type { Language } from '@/lib/i18n/types'

/**
 * Client-side content loading utilities
 * These functions run in the browser and fetch content via API routes
 */

/**
 * Load page content for Client Components
 */
export async function getPageContent(pageName: string, language: Language): Promise<PageContent> {
  try {
    const response = await fetch(`/api/content/${pageName}?lang=${language}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }

    const content = await response.json()
    return content
  } catch (error) {
    console.error(`Failed to load page content for ${pageName} (${language}):`, error)
    throw error
  }
}

/**
 * Cache for content to avoid repeated API calls
 */
const contentCache = new Map<string, PageContent>()

/**
 * Load page content with caching
 */
export async function getCachedPageContent(pageName: string, language: Language): Promise<PageContent> {
  const cacheKey = `${pageName}-${language}`
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!
  }

  const content = await getPageContent(pageName, language)
  contentCache.set(cacheKey, content)
  
  return content
}

/**
 * Clear content cache (useful when language changes)
 */
export function clearContentCache() {
  contentCache.clear()
}