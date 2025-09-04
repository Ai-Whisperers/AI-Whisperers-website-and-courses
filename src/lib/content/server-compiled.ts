/**
 * Build-time Content Loading System
 * Uses pre-compiled content modules instead of runtime file system access
 * This ensures deployment compatibility and better performance
 */

import type { PageContent } from '@/types/content'
import type { Language } from '@/lib/i18n/types'
import { getCompiledPageContent } from './compiled'
import { getFallbackPageContent } from './compiled/fallback'

/**
 * Load page content using pre-compiled content modules
 * This replaces runtime file system access with build-time compilation
 */
export async function getPageContent(pageName: string, language?: Language): Promise<PageContent> {
  try {
    // Try to get pre-compiled content
    const content = getCompiledPageContent(pageName)
    
    if (content) {
      // Validate that the content has required structure
      if (isValidPageContent(content)) {
        console.log(`✅ Loaded compiled content for: ${pageName}`)
        return content
      } else {
        console.warn(`⚠️  Compiled content for ${pageName} failed validation, using fallback`)
        return getFallbackPageContent(pageName)
      }
    }
    
    // Content not found, use fallback
    console.warn(`⚠️  No compiled content found for ${pageName}, using fallback`)
    return getFallbackPageContent(pageName)
    
  } catch (error) {
    console.error(`❌ Error loading compiled content for ${pageName}:`, error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    
    // Always return fallback to prevent crashes
    return getFallbackPageContent(pageName)
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