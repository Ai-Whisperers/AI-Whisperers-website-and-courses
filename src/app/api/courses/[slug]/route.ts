// API Route: Individual Course
// RESTful API for specific course details

import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/lib/services/course.service'
import { createCourseRepository } from '@/lib/repositories'
import { CourseNotFoundError } from '@/domain/errors/domain-errors'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const courseService = new CourseService(createCourseRepository())
    const course = await courseService.getCourseBySlug(params.slug)

    // Transform domain entity to JSON-serializable format
    const courseData = {
      id: course.id.value,
      title: course.title,
      description: course.description,
      slug: course.slug,
      price: {
        amount: course.price.amount,
        currency: course.price.currency,
        formatted: course.price.formatUSD()
      },
      duration: {
        minutes: course.duration.minutes,
        formatted: course.duration.formatHumanReadable()
      },
      difficulty: course.difficulty,
      difficultyLevel: course.getDifficultyLevel(),
      published: course.published,
      featured: course.featured,
      learningObjectives: course.learningObjectives,
      prerequisites: course.prerequisites,
      canEnroll: course.canEnroll(),
      isFree: course.isFree(),
      isAdvanced: course.isAdvanced(),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }

    return NextResponse.json({
      success: true,
      course: courseData
    })

  } catch (error) {
    console.error(`Failed to fetch course ${params.slug}:`, error)
    
    if (error instanceof CourseNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          message: `Course with slug '${params.slug}' does not exist`
        },
        { status: 404 }
      )
    }

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