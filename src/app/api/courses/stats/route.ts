// API Route: Course Statistics
// Administrative endpoint for course analytics

import { NextResponse } from 'next/server'
import { getMockCourseStats } from '@/lib/data/mock-courses'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    // Get stats from centralized mock data
    const stats = getMockCourseStats()

    return NextResponse.json({
      success: true,
      stats: {
        total: stats.total,
        published: stats.published,
        featured: stats.featured,
        draft: stats.total - stats.published,
        byDifficulty: stats.byDifficulty
      }
    })

  } catch (error) {
    logger.apiError('/api/courses/stats', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}