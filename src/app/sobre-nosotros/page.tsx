import { getPageContent } from '@/lib/content/server'
import { AboutPage } from '@/components/pages/AboutPage'
import type { Metadata } from 'next'

// Generate metadata from content
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('about')
  
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords.join(', '),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      locale: content.meta.language,
    },
    alternates: {
      languages: {
        [content.meta.language]: '/sobre-nosotros',
      },
    },
  }
}

export default async function AboutUsPage() {
  // Load content from YAML file (default language for SSR)
  const content = await getPageContent('about')
  
  return <AboutPage content={content} />
}