import { ContentLoader } from './loader'
import { EnhancedContentLoader } from './enhanced-loader'
import type { PageContent } from '@/types/content'
import type { Language } from '@/lib/i18n/types'

/**
 * Server-side content loading utilities
 * These functions run on the server and can be used in Server Components
 */

/**
 * Load page content for Server Components
 */
export async function getPageContent(pageName: string, language?: Language): Promise<PageContent> {
  try {
    // Use EnhancedContentLoader to support $use references
    return await EnhancedContentLoader.loadPageContent(pageName, language || 'en') as PageContent
  } catch (error) {
    console.error(`Failed to load page content for ${pageName} (${language}):`, error)
    
    // Return fallback content structure to prevent crashes
    return getFallbackPageContent(pageName)
  }
}

/**
 * Load component content for Server Components
 */
export async function getComponentContent<T>(componentName: string): Promise<T | null> {
  try {
    return await ContentLoader.loadComponentContent<T>(componentName)
  } catch (error) {
    console.error(`Failed to load component content for ${componentName}:`, error)
    return null
  }
}

/**
 * Preload all page content for static generation
 */
export async function getAllPagesContent(): Promise<Record<string, PageContent>> {
  try {
    const availablePages = await ContentLoader.getAvailablePages()
    const pagesContent: Record<string, PageContent> = {}

    for (const pageName of availablePages) {
      try {
        pagesContent[pageName] = await ContentLoader.loadPageContent(pageName) as PageContent
      } catch (error) {
        console.error(`Failed to load content for page ${pageName}:`, error)
        pagesContent[pageName] = getFallbackPageContent(pageName)
      }
    }

    return pagesContent
  } catch (error) {
    console.error('Failed to load all pages content:', error)
    return {}
  }
}

/**
 * Generate fallback content to prevent crashes
 */
function getFallbackPageContent(pageName: string): PageContent {
  return {
    meta: {
      title: `${pageName} - AI Paraguay`,
      description: 'AI consultancy services in Paraguay',
      keywords: ['AI', 'Paraguay', 'consultancy'],
      language: 'es'
    },
    navigation: {
      brand: { text: 'AI Paraguay' },
      items: [],
      cta: { text: 'Contacto', variant: 'default' }
    },
    hero: {
      headline: 'Contenido en carga...',
      subheadline: 'Por favor espere',
      description: 'Estamos cargando el contenido de la página.',
      location: 'Paraguay',
      primaryCta: { text: 'Contacto', variant: 'default' },
      secondaryCta: { text: 'Más info', variant: 'outline' },
      benefits: []
    },
    features: {
      differentiators: {
        title: 'Características',
        description: 'Contenido en carga...',
        items: []
      },
      services: {
        title: 'Servicios',
        description: 'Contenido en carga...',
        departments: [],
        goalStatement: 'Contenido en carga...'
      },
      tools: {
        title: 'Herramientas',
        items: []
      }
    },
    stats: {
      title: 'Estadísticas',
      description: 'Contenido en carga...',
      metrics: []
    },
    contact: {
      title: 'Contacto',
      description: 'Ponte en contacto con nosotros',
      primaryCta: { text: 'WhatsApp', variant: 'default' },
      secondaryCta: { text: 'Email', variant: 'outline' },
      info: []
    },
    footer: {
      brand: { text: 'AI Paraguay' },
      copyright: '© 2025 AI Paraguay'
    }
  }
}