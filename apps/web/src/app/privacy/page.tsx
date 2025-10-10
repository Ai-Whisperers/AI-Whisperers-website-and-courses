import { getPageContent } from '@/lib/content/server'
import { PrivacyPage } from '@/components/pages/PrivacyPage'
import { StructuredData } from '@/components/SEO/StructuredData'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('privacy')
  
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: 'https://aiparaguay.com/privacy',
      siteName: 'AI Paraguay',
      type: 'website',
      images: [
        {
          url: 'https://aiparaguay.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AI Paraguay Privacy Policy'
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
      canonical: 'https://aiparaguay.com/privacy'
    }
  }
}

export default async function Privacy() {
  const content = await getPageContent('privacy')
  
  return (
    <>
      <StructuredData pageType="legal" pageData={{ type: 'privacy' }} />
      <PrivacyPage content={content} />
    </>
  )
}