'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { getCachedPageContent } from '@/lib/content/client'
import type { PageContent } from '@/types/content'

interface DynamicPageWrapperProps {
  pageName: string
  initialContent: PageContent
  children: (content: PageContent) => React.ReactNode
}

export function DynamicPageWrapper({ pageName, initialContent, children }: DynamicPageWrapperProps) {
  const { language, isLoading: languageLoading } = useLanguage()
  const [content, setContent] = useState<PageContent>(initialContent)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  useEffect(() => {
    if (languageLoading) return

    // If the current content language matches the selected language, no need to reload
    if (content.meta.language === language) return

    setIsLoadingContent(true)

    getCachedPageContent(pageName, language)
      .then(newContent => {
        setContent(newContent)
      })
      .catch(error => {
        console.error('Failed to load content for language:', language, error)
        // Keep current content if loading fails
      })
      .finally(() => {
        setIsLoadingContent(false)
      })
  }, [language, languageLoading, pageName, content.meta.language])

  // Show loading state while language is being determined or content is loading
  if (languageLoading || isLoadingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henyhẽhína tetepy... / Cargando contenido... / Loading content...</p>
        </div>
      </div>
    )
  }

  return <>{children(content)}</>
}