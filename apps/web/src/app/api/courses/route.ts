// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import type { Difficulty } from '@/domain/entities/course'
import { CourseQuerySchema, parseQueryParams } from '@/lib/api-schemas'
import { getMockCoursesAsPlainObjects } from '@/lib/data/mock-courses'
import { logger } from '@/lib/logger'
import { rateLimit, getIdentifier, RateLimitPresets } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = getIdentifier(request)
    const rateLimitResult = rateLimit(identifier, RateLimitPresets.GENEROUS)

    // Add rate limit headers to response
    const headers = {
      'X-RateLimit-Limit': rateLimitResult.limit.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
    }

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers,
        }
      )
    }

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
    const allCourses = getMockCoursesAsPlainObjects({ published, featured, difficulty: difficulty as Difficulty | undefined })
    const paginatedCourses = getMockCoursesAsPlainObjects({
      published,
      featured,
      difficulty: difficulty as Difficulty | undefined,
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
    }, {
      headers,
    })

  } catch (error) {
    logger.apiError('/api/courses', error)

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