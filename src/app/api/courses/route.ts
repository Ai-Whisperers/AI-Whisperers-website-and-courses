// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import { Difficulty } from '@/domain/entities/course'
import { CourseQuerySchema, parseQueryParams } from '@/lib/api-schemas'
import { getMockCoursesAsPlainObjects } from '@/lib/data/mock-courses'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate query parameters
    const validation = parseQueryParams(searchParams, CourseQuerySchema)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.format(),
        },
        { status: 400 }
      )
    }

    const { published, featured, difficulty, limit = 100, offset = 0 } = validation.data

    // Get courses from centralized mock data with filtering and pagination
    const allCourses = getMockCoursesAsPlainObjects({ published, featured, difficulty })
    const paginatedCourses = getMockCoursesAsPlainObjects({
      published,
      featured,
      difficulty,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      courses: paginatedCourses,
      count: paginatedCourses.length,
      total: allCourses.length,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Failed to fetch courses:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}