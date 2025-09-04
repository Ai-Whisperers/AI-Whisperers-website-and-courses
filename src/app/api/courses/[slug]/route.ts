// API Route: Individual Course
// RESTful API for specific course details

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Mock course data for initial deployment
    const mockCourses: Record<string, any> = {
      'ai-foundations': {
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
      }
    }
    
    const course = mockCourses[params.slug]
    
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          message: `Course with slug '${params.slug}' does not exist`
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      course: course
    })

  } catch (error) {
    console.error(`Failed to fetch course ${params.slug}:`, error)
    
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