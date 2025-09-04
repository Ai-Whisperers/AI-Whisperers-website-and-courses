// API Route: Individual Course
// RESTful API for specific course details

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Mock course data for initial deployment
    // TODO: Replace with actual database queries after successful deployment
    const mockCourses: Record<string, any> = {
      'ai-foundations': {
        id: 'course-1',
        title: 'AI Foundations',
        description: 'Learn the fundamentals of artificial intelligence with hands-on projects and real-world applications. Perfect for beginners with no prior AI experience.',
        slug: 'ai-foundations',
        price: {
          amount: 29900,
          currency: 'USD',
          formatted: '$299.00'
        },
        duration: {
          minutes: 720,
          formatted: '12 hours'
        },
        difficulty: 'BEGINNER',
        difficultyLevel: 'Beginner Friendly',
        published: true,
        featured: true,
        learningObjectives: [
          'Understand AI concepts and terminology',
          'Learn about machine learning basics',
          'Explore AI applications in various industries',
          'Build your first AI project'
        ],
        prerequisites: [
          'Basic computer literacy',
          'High school mathematics',
          'No programming experience required'
        ],
        canEnroll: true,
        isFree: false,
        isAdvanced: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      'applied-ai': {
        id: 'course-2',
        title: 'Applied AI',
        description: 'Build practical AI applications using modern tools and APIs. Learn to integrate AI into real-world projects.',
        slug: 'applied-ai',
        price: {
          amount: 59900,
          currency: 'USD',
          formatted: '$599.00'
        },
        duration: {
          minutes: 900,
          formatted: '15 hours'
        },
        difficulty: 'INTERMEDIATE',
        difficultyLevel: 'Intermediate Level',
        published: true,
        featured: true,
        learningObjectives: [
          'Build AI applications with APIs',
          'Integrate AI into existing systems',
          'Deploy AI solutions to production',
          'Work with popular AI frameworks'
        ],
        prerequisites: [
          'Basic programming knowledge',
          'Completion of AI Foundations course',
          'Understanding of web development basics'
        ],
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