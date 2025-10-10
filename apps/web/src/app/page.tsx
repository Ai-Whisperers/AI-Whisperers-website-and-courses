import { getLocalizedPageContent } from '@/lib/content/server-compiled'
import { DynamicHomepage } from '@/components/pages/DynamicHomepage'
import { StructuredData } from '@/components/SEO/StructuredData'
import type { Metadata } from 'next'

// Generate metadata from content (defaults to English for SEO)
export async function generateMetadata(): Promise<Metadata> {
  const localizedContent = await getLocalizedPageContent('homepage')
  const content = localizedContent.en // Use English for default SEO metadata

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
        en: '/',
        es: '/',
      },
    },
  }
}

export default async function HomePage() {
  // Load both EN and ES content at build time
  const localizedContent = await getLocalizedPageContent('homepage')

  return (
    <>
      <StructuredData pageType="homepage" />
      <DynamicHomepage localizedContent={localizedContent} />
    </>
  )
}