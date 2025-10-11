/**
 * Admin Stats API Route Tests
 * Tests authenticated admin/instructor-only endpoint
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock NextAuth
jest.mock('@/lib/auth/auth.config', () => ({
  auth: jest.fn(),
}))

describe('/api/admin/stats', () => {
  const { auth } = require('@/lib/auth/auth.config')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET - authorized requests', () => {
    it('should return stats for admin user', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'admin-123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        totalUsers: 0,
        activeCourses: 0,
        totalRevenue: 0,
        completionRate: 0,
        newUsersThisMonth: 0,
        activeSubscriptions: 0,
      })
    })

    it('should return stats for instructor user', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'instructor-123',
          name: 'Instructor User',
          email: 'instructor@example.com',
          role: 'instructor',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        totalUsers: 0,
        activeCourses: 0,
        totalRevenue: 0,
        completionRate: 0,
        newUsersThisMonth: 0,
        activeSubscriptions: 0,
      })
    })

    it('should include all required stats fields', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'admin-123',
          role: 'admin',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('totalUsers')
      expect(data).toHaveProperty('activeCourses')
      expect(data).toHaveProperty('totalRevenue')
      expect(data).toHaveProperty('completionRate')
      expect(data).toHaveProperty('newUsersThisMonth')
      expect(data).toHaveProperty('activeSubscriptions')
    })
  })

  describe('GET - unauthorized requests', () => {
    it('should return 401 when user is not authenticated', async () => {
      auth.mockResolvedValueOnce(null)

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
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

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 for regular user without admin role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        error: 'Forbidden: Admin access required',
      })
    })

    it('should return 403 when user has no role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'User Without Role',
          email: 'user@example.com',
          role: undefined,
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })

    it('should return 403 when user has null role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          name: 'User With Null Role',
          email: 'user@example.com',
          role: null,
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })

    it('should return 403 for student role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'student-123',
          role: 'student',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })

    it('should return 403 for moderator role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'mod-123',
          role: 'moderator',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })
  })

  describe('GET - error handling', () => {
    it('should return 500 on internal error', async () => {
      auth.mockRejectedValueOnce(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
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

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Admin Stats API] Error:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle auth throwing non-Error', async () => {
      auth.mockRejectedValueOnce('Auth failed')

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('GET - role validation edge cases', () => {
    it('should be case-sensitive for role checking', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          role: 'ADMIN', // Uppercase - should fail
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })

    it('should handle empty string role', async () => {
      auth.mockResolvedValueOnce({
        user: {
          id: 'user-123',
          role: '',
        },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Forbidden: Admin access required')
    })
  })
})
