'use client'

import { useState, useEffect } from 'react'
import type { PageContent, ContentResult } from '@/types/content'

/**
 * Hook for loading page content on the client side
 * Note: For production, consider using server-side loading instead
 */
export function usePageContent(pageName: string): ContentResult<PageContent> {
  const [result, setResult] = useState<ContentResult<PageContent>>({
    data: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    const loadContent = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true, error: null }))
        
        // In a real implementation, you'd fetch from an API endpoint
        // that uses the ContentLoader on the server side
        const response = await fetch(`/api/content/pages/${pageName}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`)
        }
        
        const content = await response.json() as PageContent
        
        setResult({
          data: content,
          error: null,
          loading: false
        })
      } catch (error) {
        setResult({
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        })
      }
    }

    loadContent()
  }, [pageName])

  return result
}

/**
 * Hook for loading component content
 */
export function useComponentContent<T>(componentName: string): ContentResult<T> {
  const [result, setResult] = useState<ContentResult<T>>({
    data: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    const loadContent = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true, error: null }))
        
        const response = await fetch(`/api/content/components/${componentName}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`)
        }
        
        const content = await response.json() as T
        
        setResult({
          data: content,
          error: null,
          loading: false
        })
      } catch (error) {
        setResult({
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        })
      }
    }

    loadContent()
  }, [componentName])

  return result
}