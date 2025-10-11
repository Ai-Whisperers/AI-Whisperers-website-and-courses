/**
 * User Dashboard API Route Tests
 * Tests authenticated user dashboard endpoint
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock NextAuth
jest.mock('@/lib/auth/auth.config', () => ({
  auth: jest.fn(),
}))

describe('/api/user/dashboard', () => {
  const { auth } = require('@/lib/auth/auth.config')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET - authenticated requests', () => {
    it('should return dashboard data for authenticated user', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/avatar.jpg',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/avatar.jpg',
        },
        stats: {
          coursesEnrolled: 0,
          hoursLearned: 0,
          achievements: 0,
          currentStreak: 0,
        },
        recentActivity: [],
        enrolledCourses: [],
        upcomingLessons: [],
      })
    })

    it('should include all required dashboard sections', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('user')
      expect(data).toHaveProperty('stats')
      expect(data).toHaveProperty('recentActivity')
      expect(data).toHaveProperty('enrolledCourses')
      expect(data).toHaveProperty('upcomingLessons')
    })

    it('should include correct stats structure', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(data.stats).toEqual({
        coursesEnrolled: 0,
        hoursLearned: 0,
        achievements: 0,
        currentStreak: 0,
      })
    })

    it('should handle user without image', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          image: undefined,
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.image).toBeUndefined()
    })
  })

  describe('GET - unauthenticated requests', () => {
    it('should return 401 when user is not authenticated', async () => {
      auth.mockResolvedValueOnce(null)

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
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

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({
        error: 'Unauthorized',
      })
    })

    it('should return 401 when session is undefined', async () => {
      auth.mockResolvedValueOnce(undefined)

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('GET - error handling', () => {
    it('should return 500 on internal error', async () => {
      auth.mockRejectedValueOnce(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
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

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Dashboard API] Error:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle auth throwing non-Error', async () => {
      auth.mockRejectedValueOnce('Auth failed')

      const request = new NextRequest('http://localhost:3000/api/user/dashboard')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
