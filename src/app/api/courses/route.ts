// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import { Difficulty } from '@/domain/entities/course'
import { CourseQuerySchema, parseQueryParams } from '@/lib/api-schemas'

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

    // Mock course data for initial deployment
    const mockCourses = [
      {
        id: 'course-1',
        title: 'AI Foundations',
        description: 'Learn the fundamentals of artificial intelligence with hands-on projects.',
        slug: 'ai-foundations',
        price: { amount: 29900, currency: 'USD', formatted: '$299.00' },
        duration: { minutes: 720, formatted: '12 hours' },
        difficulty: 'BEGINNER',
        difficultyLevel: 'Beginner Friendly',
        published: true,
        featured: true,
        learningObjectives: ['Understand AI concepts', 'Learn ML basics'],
        prerequisites: ['Basic computer literacy'],
        canEnroll: true,
        isFree: false,
        isAdvanced: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'course-2',
        title: 'Applied AI',
        description: 'Build practical AI applications using modern tools and APIs.',
        slug: 'applied-ai',
        price: { amount: 59900, currency: 'USD', formatted: '$599.00' },
        duration: { minutes: 900, formatted: '15 hours' },
        difficulty: 'INTERMEDIATE',
        difficultyLevel: 'Intermediate Level', 
        published: true,
        featured: true,
        learningObjectives: ['Build AI applications', 'Deploy AI solutions'],
        prerequisites: ['Basic programming knowledge'],
        canEnroll: true,
        isFree: false,
        isAdvanced: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ]

    // Filter courses based on validated query parameters
    let filteredCourses = mockCourses

    if (published !== undefined) {
      filteredCourses = filteredCourses.filter(course => course.published === published)
    }
    if (featured !== undefined) {
      filteredCourses = filteredCourses.filter(course => course.featured === featured)
    }
    if (difficulty) {
      filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty)
    }

    // Apply pagination
    const paginatedCourses = filteredCourses.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      courses: paginatedCourses,
      count: paginatedCourses.length,
      total: filteredCourses.length,
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