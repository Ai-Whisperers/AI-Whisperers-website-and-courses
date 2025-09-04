import { getPageContent } from '@/lib/content/server'
import { DynamicHomepage } from '@/components/pages/DynamicHomepage'
import { StructuredData } from '@/components/SEO/StructuredData'
import type { Metadata } from 'next'

// Generate metadata from content
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('homepage')
  
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords.join(', '),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      locale: content.meta.language,
      url: 'https://aiparaguay.com',
      siteName: 'AI Paraguay',
      type: 'website',
      images: [
        {
          url: 'https://aiparaguay.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AI Paraguay - AI Consultancy & Training'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
      images: ['https://aiparaguay.com/og-image.png']
    },
    alternates: {
      canonical: 'https://aiparaguay.com',
      languages: {
        [content.meta.language]: '/',
      },
    },
  }
}

export default async function HomePage() {
  // Load content from YAML file (default language for SSR)
  const content = await getPageContent('homepage')
  
  return (
    <>
      <StructuredData pageType="homepage" />
      <DynamicHomepage content={content} />
    </>
  )
}