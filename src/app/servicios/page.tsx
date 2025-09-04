import { getPageContent } from '@/lib/content/server'
import { ServicesPage } from '@/components/pages/ServicesPage'
import type { Metadata } from 'next'

// Generate metadata from content
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('services')
  
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
        [content.meta.language]: '/servicios',
      },
    },
  }
}

export default async function ServicesPageRoute() {
  // Load content from YAML file
  const content = await getPageContent('services')
  
  return <ServicesPage content={content} />
}