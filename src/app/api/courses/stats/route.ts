// API Route: Course Statistics
// Administrative endpoint for course analytics

import { NextResponse } from 'next/server'
import { CourseService } from '@/lib/services/course.service'
import { createCourseRepository } from '@/lib/repositories'

export async function GET() {
  try {
    const courseService = new CourseService(createCourseRepository())
    const stats = await courseService.getCourseStats()

    return NextResponse.json({
      success: true,
      stats: {
        total: stats.totalCourses,
        published: stats.publishedCourses,
        featured: stats.featuredCourses,
        draft: stats.totalCourses - stats.publishedCourses
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