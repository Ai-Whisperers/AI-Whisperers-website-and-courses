import { NextRequest, NextResponse } from 'next/server'
import { getPageContent } from '@/lib/content/server'
import type { Language } from '@/lib/i18n/types'
import { DEFAULT_LANGUAGE } from '@/lib/i18n/types'
import { ContentPageSchema } from '@/lib/api-schemas'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const resolvedParams = await params

    // Validate page name
    const pageValidation = ContentPageSchema.safeParse({ pageName: resolvedParams.pageName })

    if (!pageValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid page name',
          details: pageValidation.error.format(),
        },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const language = (searchParams.get('lang') as Language) || DEFAULT_LANGUAGE

    // Validate language parameter
    if (!['es', 'en'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language parameter. Supported languages: en, es' },
        { status: 400 }
      )
    }

    const content = await getPageContent(pageValidation.data.pageName, language)
    
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    logger.apiError('/api/content/[pageName]', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}