import { getPageContent } from '@/lib/content/server'
import { TermsPage } from '@/components/pages/TermsPage'
import { StructuredData } from '@/components/SEO/StructuredData'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('terms')
  
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: 'https://aiparaguay.com/terms',
      siteName: 'AI Paraguay',
      type: 'website',
      images: [
        {
          url: 'https://aiparaguay.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AI Paraguay Terms of Service'
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
      canonical: 'https://aiparaguay.com/terms'
    }
  }
}

export default async function Terms() {
  const content = await getPageContent('terms')
  
  return (
    <>
      <StructuredData pageType="legal" pageData={{ type: 'terms' }} />
      <TermsPage content={content} />
    </>
  )
}