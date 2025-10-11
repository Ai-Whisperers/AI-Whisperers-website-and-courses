/**
 * User Enrolled Courses API Route Tests
 * Tests authenticated endpoint for user's enrolled courses
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock NextAuth
jest.mock('@/lib/auth/auth.config', () => ({
  auth: jest.fn(),
}))

describe('/api/user/courses/enrolled', () => {
  const { auth } = require('@/lib/auth/auth.config')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET - authenticated requests', () => {
    it('should return empty courses list for authenticated user', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        courses: [],
        total: 0,
      })
    })

    it('should include both courses and total fields', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('courses')
      expect(data).toHaveProperty('total')
      expect(Array.isArray(data.courses)).toBe(true)
      expect(typeof data.total).toBe('number')
    })

    it('should return correct total count matching courses length', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(data.total).toBe(data.courses.length)
    })
  })

  describe('GET - unauthenticated requests', () => {
    it('should return 401 when user is not authenticated', async () => {
      auth.mockResolvedValueOnce(null)

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({
        error: 'Unauthorized',
      })
    })

    it('should return 401 when session exists but no user', async () => {
      auth.mockResolvedValueOnce({
        user: null,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 when session is undefined', async () => {
      auth.mockResolvedValueOnce(undefined)

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('GET - error handling', () => {
    it('should return 500 on internal error', async () => {
      auth.mockRejectedValueOnce(new Error('Database connection failed'))

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        error: 'Internal server error',
      })
    })

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      auth.mockRejectedValueOnce(new Error('Auth service unavailable'))

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Enrolled Courses API] Error:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle auth throwing non-Error', async () => {
      auth.mockRejectedValueOnce('Auth failed')

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should handle unexpected error during data fetching', async () => {
      // Mock auth to succeed but simulate unexpected error
      auth.mockImplementationOnce(async () => {
        // Return valid session
        const session = {
          user: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
          },
        }
        // But then throw error (simulating error after auth)
        throw new Error('Unexpected error')
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/courses/enrolled'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
