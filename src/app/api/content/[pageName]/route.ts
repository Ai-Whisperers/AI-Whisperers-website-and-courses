import { NextRequest, NextResponse } from 'next/server'
import { getPageContent } from '@/lib/content/server'
import type { Language } from '@/lib/i18n/types'
import { DEFAULT_LANGUAGE } from '@/lib/i18n/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageName: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const language = (searchParams.get('lang') as Language) || DEFAULT_LANGUAGE
    
    // Validate language parameter
    if (!['es', 'gn', 'en'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language parameter' },
        { status: 400 }
      )
    }

    const content = await getPageContent(resolvedParams.pageName, language)
    
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error loading content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}