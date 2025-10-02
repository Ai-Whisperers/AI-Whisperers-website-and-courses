import { getPageContent } from '@/lib/content/server'
import { SolutionsPage } from '@/components/pages/SolutionsPage'
import type { Metadata } from 'next'

// Generate metadata from content
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('solutions')

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
        [content.meta.language]: '/solutions',
      },
    },
  }
}

export default async function SolutionsPageRoute() {
  // Load content from YAML file
  const content = await getPageContent('solutions')

  return <SolutionsPage content={content} />
}
