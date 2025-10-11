/**
 * Health API Route Tests
 * Tests the health check endpoint
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextResponse } from 'next/server'

describe('/api/health', () => {
  describe('GET', () => {
    it('should return healthy status with all required fields', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        services: {
          application: 'running',
          api: 'operational',
        },
        version: '0.1.0',
        environment: 'test',
      })
    })

    it('should return ISO timestamp format', async () => {
      const response = await GET()
      const data = await response.json()

      // Verify timestamp is valid ISO 8601 format
      const timestamp = new Date(data.timestamp)
      expect(timestamp.toISOString()).toBe(data.timestamp)
    })

    it('should return consistent structure on multiple calls', async () => {
      const response1 = await GET()
      const data1 = await response1.json()

      const response2 = await GET()
      const data2 = await response2.json()

      // Same structure
      expect(Object.keys(data1).sort()).toEqual(Object.keys(data2).sort())
      expect(data1.status).toBe(data2.status)
      expect(data1.services).toEqual(data2.services)
      expect(data1.version).toBe(data2.version)
      expect(data1.environment).toBe(data2.environment)
    })

    it('should handle error scenarios gracefully', async () => {
      // Mock NextResponse.json to throw error on first call
      const originalJson = NextResponse.json
      let callCount = 0

      jest.spyOn(NextResponse, 'json').mockImplementation((data: any, options?: any) => {
        callCount++
        if (callCount === 1) {
          throw new Error('Simulated error')
        }
        return originalJson(data, options)
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.error).toBe('Simulated error')
      expect(data.timestamp).toBeDefined()
      expect(data.services).toEqual({
        application: 'running',
        api: 'operational',
      })

      // Restore original
      jest.restoreAllMocks()
    })

    it('should include all service statuses', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.services).toHaveProperty('application')
      expect(data.services).toHaveProperty('api')
      expect(data.services.application).toBe('running')
      expect(data.services.api).toBe('operational')
    })

    it('should reflect NODE_ENV from environment', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.environment).toBe(process.env.NODE_ENV)
    })

    it('should return valid JSON on successful health check', async () => {
      const response = await GET()
      const data = await response.json()

      // Verify JSON structure
      expect(typeof data).toBe('object')
      expect(data.status).toBe('healthy')
      expect(typeof data.timestamp).toBe('string')
      expect(typeof data.services).toBe('object')
      expect(typeof data.version).toBe('string')
      expect(typeof data.environment).toBe('string')
    })

    it('should use 200 status code for healthy response', async () => {
      const response = await GET()

      expect(response.status).toBe(200)
      expect(response.status).not.toBe(503)
    })
  })
})
