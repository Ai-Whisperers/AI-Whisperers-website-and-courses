'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/i18n'
// Removed client-side content loading - now uses server-side compiled content
import type { PageContent } from '@/types/content'

interface DynamicPageWrapperProps {
  pageName: string
  initialContent: PageContent
  children: (content: PageContent) => React.ReactNode
}

export function DynamicPageWrapper({ pageName, initialContent, children }: DynamicPageWrapperProps) {
  const { language, isLoading: languageLoading } = useLanguage()
  // Note: Content is now server-side compiled and provided via props
  // Language switching would require page navigation to different routes

  // Show loading state while language is being determined
  if (languageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henyhẽhína tetepy... / Cargando contenido... / Loading content...</p>
        </div>
      </div>
    )
  }

  return <>{children(initialContent)}</>
}