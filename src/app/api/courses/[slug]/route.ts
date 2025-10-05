// API Route: Individual Course
// RESTful API for specific course details

import { NextRequest, NextResponse } from 'next/server'
import { getMockCourseBySlug, courseToPlainObject } from '@/lib/data/mock-courses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params

  try {
    // Get course from centralized mock data
    const courseEntity = getMockCourseBySlug(resolvedParams.slug)
    const course = courseEntity ? courseToPlainObject(courseEntity) : null
    
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          message: `Course with slug '${resolvedParams.slug}' does not exist`
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      course: course
    })

  } catch (error) {
    console.error(`Failed to fetch course ${resolvedParams.slug}:`, error)
    
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