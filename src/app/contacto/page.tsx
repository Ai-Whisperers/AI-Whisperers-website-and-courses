import { getPageContent } from '@/lib/content/server'
import { ContactPage } from '@/components/pages/ContactPage'
import type { Metadata } from 'next'

// Generate metadata from content
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('contact')
  
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
        [content.meta.language]: '/contacto',
      },
    },
  }
}

export default async function ContactPageRoute() {
  // Load content from YAML file
  const content = await getPageContent('contact')
  
  return <ContactPage content={content} />
}