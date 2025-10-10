'use client'

import { generatePageSchema } from '@/lib/schema'

interface StructuredDataProps {
  pageType: string
  pageData?: Record<string, unknown>
}

export function StructuredData({ pageType, pageData }: StructuredDataProps) {
  const schema = generatePageSchema(pageType, pageData)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}