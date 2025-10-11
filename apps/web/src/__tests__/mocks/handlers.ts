/**
 * MSW (Mock Service Worker) Request Handlers
 * Define mock API responses for testing
 */

import { http, HttpResponse } from 'msw'

export const handlers = [
  // Health check endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Courses API
  http.get('/api/courses', () => {
    return HttpResponse.json({
      courses: [
        {
          id: '1',
          title: 'Introduction to AI',
          slug: 'intro-ai',
          description: 'Learn the basics of Artificial Intelligence',
          price: 99.99,
          published: true,
          imageUrl: '/courses/intro-ai.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Advanced Machine Learning',
          slug: 'advanced-ml',
          description: 'Deep dive into machine learning algorithms',
          price: 149.99,
          published: true,
          imageUrl: '/courses/advanced-ml.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })
  }),

  // Single course by slug
  http.get('/api/courses/:slug', ({ params }) => {
    const { slug } = params

    return HttpResponse.json({
      course: {
        id: '1',
        title: 'Introduction to AI',
        slug,
        description: 'Learn the basics of Artificial Intelligence',
        price: 99.99,
        published: true,
        imageUrl: '/courses/intro-ai.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  }),

  // User dashboard
  http.get('/api/user/dashboard', () => {
    return HttpResponse.json({
      enrollments: [
        {
          id: 'enrollment-1',
          courseId: '1',
          userId: 'test-user-id',
          progress: 25,
          enrolledAt: new Date().toISOString(),
        },
      ],
      achievements: [
        {
          id: 'achievement-1',
          title: 'First Course',
          description: 'Enrolled in your first course',
          earnedAt: new Date().toISOString(),
        },
      ],
      progress: {
        totalCourses: 2,
        completedCourses: 0,
        inProgressCourses: 1,
      },
    })
  }),

  // User enrollments
  http.get('/api/user/courses/enrolled', () => {
    return HttpResponse.json({
      enrollments: [
        {
          id: 'enrollment-1',
          courseId: '1',
          userId: 'test-user-id',
          progress: 25,
          enrolledAt: new Date().toISOString(),
          course: {
            id: '1',
            title: 'Introduction to AI',
            slug: 'intro-ai',
          },
        },
      ],
    })
  }),

  // Auth session
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
      },
    })
  }),

  // Admin stats
  http.get('/api/admin/stats', () => {
    return HttpResponse.json({
      users: {
        total: 150,
        active: 120,
        new: 15,
      },
      courses: {
        total: 10,
        published: 8,
        draft: 2,
      },
      revenue: {
        total: 15000,
        monthly: 3500,
      },
    })
  }),
]

// Error handlers for testing error states
export const errorHandlers = [
  http.get('/api/courses', () => {
    return HttpResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }),

  http.get('/api/user/dashboard', () => {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }),
]
