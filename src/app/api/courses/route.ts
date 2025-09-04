// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/lib/services/course.service'
import { createCourseRepository } from '@/lib/repositories'
import { Difficulty } from '@/domain/entities/course'

export async function GET(request: NextRequest) {
  try {
    const courseService = new CourseService(createCourseRepository())
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const difficulty = searchParams.get('difficulty') as Difficulty | null

    let courses

    if (featured) {
      courses = await courseService.getFeaturedCourses()
    } else if (difficulty) {
      courses = await courseService.getCoursesByDifficulty(difficulty)
    } else if (published) {
      courses = await courseService.getPublishedCourses()
    } else {
      courses = await courseService.getAllCourses()
    }

    // Transform domain entities to JSON-serializable format
    const coursesData = courses.map(course => ({
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
    }))

    return NextResponse.json({
      success: true,
      courses: coursesData,
      count: coursesData.length
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