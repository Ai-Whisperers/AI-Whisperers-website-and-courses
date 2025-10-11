/**
 * Courses API Route Tests
 * Tests the courses endpoint with rate limiting and query validation
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/lib/logger', () => ({
  logger: {
    apiError: jest.fn(),
  },
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn((identifier, preset) => ({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 60000,
  })),
  getIdentifier: jest.fn(() => 'test-identifier'),
  RateLimitPresets: {
    GENEROUS: 'generous',
  },
}))

jest.mock('@/lib/data/mock-courses', () => ({
  getMockCoursesAsPlainObjects: jest.fn((options = {}) => {
    const mockCourses = [
      {
        id: 'course-1',
        title: 'Introduction to AI',
        slug: 'intro-to-ai',
        description: 'Learn AI basics',
        published: true,
        featured: true,
        difficulty: 'beginner',
        topics: ['ai', 'ml'],
        duration: '10 hours',
        enrollmentCount: 100,
      },
      {
        id: 'course-2',
        title: 'Advanced Machine Learning',
        slug: 'advanced-ml',
        description: 'Deep dive into ML',
        published: true,
        featured: false,
        difficulty: 'advanced',
        topics: ['ml', 'deep-learning'],
        duration: '20 hours',
        enrollmentCount: 50,
      },
      {
        id: 'course-3',
        title: 'Data Science Fundamentals',
        slug: 'data-science',
        description: 'Learn data science',
        published: false,
        featured: false,
        difficulty: 'intermediate',
        topics: ['data-science', 'python'],
        duration: '15 hours',
        enrollmentCount: 25,
      },
    ]

    let filtered = mockCourses

    // Apply filters
    if (options.published !== undefined) {
      filtered = filtered.filter((c) => c.published === options.published)
    }
    if (options.featured !== undefined) {
      filtered = filtered.filter((c) => c.featured === options.featured)
    }
    if (options.difficulty) {
      // Convert uppercase to lowercase for comparison
      const difficultyLower = options.difficulty.toLowerCase()
      filtered = filtered.filter((c) => c.difficulty === difficultyLower)
    }

    // Apply pagination
    const { limit = 100, offset = 0 } = options
    return filtered.slice(offset, offset + limit)
  }),
}))

describe('/api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return all courses without filters', async () => {
      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(3)
      expect(data.count).toBe(3)
      expect(data.total).toBe(3)
      expect(data.limit).toBe(100)
      expect(data.offset).toBe(0)
    })

    it('should filter by published status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?published=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(2)
      expect(data.courses.every((c: any) => c.published === true)).toBe(true)
    })

    it('should filter by featured status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?featured=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].featured).toBe(true)
    })

    it('should filter by difficulty', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?difficulty=BEGINNER'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].difficulty).toBe('beginner')
    })

    it('should apply pagination with limit and offset', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?limit=2&offset=1'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.limit).toBe(2)
      expect(data.offset).toBe(1)
      expect(data.count).toBe(2) // Should return 2 courses
    })

    it('should combine multiple filters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?published=true&featured=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].published).toBe(true)
      expect(data.courses[0].featured).toBe(true)
    })

    it('should include rate limit headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('99')
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })

    it('should return 429 when rate limit exceeded', async () => {
      const { rateLimit } = require('@/lib/rate-limit')
      rateLimit.mockReturnValueOnce({
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Too many requests')
      expect(data.message).toContain('Rate limit exceeded')
    })

    it('should return 400 for invalid query parameters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?difficulty=invalid'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
      expect(data.details).toBeDefined()
    })

    it('should return 400 for invalid limit parameter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?limit=abc'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
    })

    it('should return 400 for invalid offset parameter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?offset=-1'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
    })

    it('should return 500 on internal error', async () => {
      const { getMockCoursesAsPlainObjects } = require('@/lib/data/mock-courses')
      getMockCoursesAsPlainObjects.mockImplementationOnce(() => {
        throw new Error('Database connection failed')
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch courses')
      expect(data.message).toBe('Database connection failed')
    })

    it('should handle unknown errors', async () => {
      const { getMockCoursesAsPlainObjects } = require('@/lib/data/mock-courses')
      getMockCoursesAsPlainObjects.mockImplementationOnce(() => {
        throw 'Unknown error' // Non-Error object
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch courses')
      expect(data.message).toBe('Unknown error')
    })
  })
})
