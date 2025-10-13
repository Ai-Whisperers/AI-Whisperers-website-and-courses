// API Route: Individual Course
// RESTful API for specific course details

import { NextRequest, NextResponse } from 'next/server'
import { courseToPlainObject } from '@/lib/data/mock-courses'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db/prisma'
import { createPrismaCourseRepository } from '@/lib/repositories/prisma-course-repository'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params

  try {
    // Get course from database using repository
    const repository = createPrismaCourseRepository(prisma)
    const courseEntity = await repository.findBySlug(resolvedParams.slug)

    if (!courseEntity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          message: `Course with slug '${resolvedParams.slug}' does not exist`
        },
        { status: 404 }
      )
    }

    // Convert to plain object for API response
    const course = courseToPlainObject(courseEntity)

    return NextResponse.json({
      success: true,
      course: course
    })

  } catch (error) {
    logger.apiError(`/api/courses/${resolvedParams.slug}`, error, { slug: resolvedParams.slug })

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}