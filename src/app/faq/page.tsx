import { getPageContent } from '@/lib/content/server'
import { FAQPage } from '@/components/pages/FAQPage'
import { StructuredData } from '@/components/SEO/StructuredData'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('faq')
  
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: 'https://aiparaguay.com/faq',
      siteName: 'AI Paraguay',
      type: 'website',
      images: [
        {
          url: 'https://aiparaguay.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'AI Paraguay FAQ - Frequently Asked Questions'
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
      canonical: 'https://aiparaguay.com/faq'
    }
  }
}

export default async function FAQ() {
  const content = await getPageContent('faq')
  
  return (
    <>
      <StructuredData pageType="faq" />
      <FAQPage content={content} />
    </>
  )
}