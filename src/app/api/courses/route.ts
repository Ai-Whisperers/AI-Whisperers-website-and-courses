// API Route: Courses
// RESTful API for course management following clean architecture

import { NextRequest, NextResponse } from 'next/server'
import { Difficulty } from '@/domain/entities/course'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const difficulty = searchParams.get('difficulty') as Difficulty | null

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

    // Filter courses based on query parameters
    let filteredCourses = mockCourses

    if (published) {
      filteredCourses = filteredCourses.filter(course => course.published)
    }
    if (featured) {
      filteredCourses = filteredCourses.filter(course => course.featured)
    }
    if (difficulty) {
      filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty)
    }

    return NextResponse.json({
      success: true,
      courses: filteredCourses,
      count: filteredCourses.length
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