// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import type { Difficulty } from '@/domain/entities/course'
import { CourseQuerySchema, parseQueryParams } from '@/lib/api-schemas'
import { courseToPlainObject } from '@/lib/data/mock-courses'
import { logger } from '@/lib/logger'
import { rateLimit, getIdentifier, RateLimitPresets } from '@/lib/rate-limit'
import { prisma } from '@/lib/db/prisma'
import { createPrismaCourseRepository } from '@/lib/repositories/prisma-course-repository'

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

    // Get courses from database using repository
    const repository = createPrismaCourseRepository(prisma)

    let courses;
    if (featured) {
      courses = await repository.findFeatured()
    } else if (published) {
      courses = await repository.findPublished()
    } else if (difficulty) {
      courses = await repository.findByDifficulty(difficulty)
    } else {
      courses = await repository.findAll()
    }

    // Convert to plain objects for API response
    const allCoursesPlain = courses.map(courseToPlainObject)

    // Apply pagination
    const paginatedCourses = allCoursesPlain.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      courses: paginatedCourses,
      count: paginatedCourses.length,
      total: allCoursesPlain.length,
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