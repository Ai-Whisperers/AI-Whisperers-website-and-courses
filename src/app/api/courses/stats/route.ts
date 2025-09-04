// API Route: Course Statistics
// Administrative endpoint for course analytics

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock statistics for initial deployment
    // TODO: Replace with actual database queries after successful deployment
    const mockStats = {
      totalCourses: 4,
      publishedCourses: 4,
      featuredCourses: 2,
      draftCourses: 0
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: mockStats.totalCourses,
        published: mockStats.publishedCourses,
        featured: mockStats.featuredCourses,
        draft: mockStats.draftCourses
      }
    })

  } catch (error) {
    console.error('Failed to fetch course stats:', error)
    
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