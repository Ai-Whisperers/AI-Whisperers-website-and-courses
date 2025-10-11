/**
 * Database Test Utilities
 * Mock Prisma client and utilities for database testing
 */

import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Create deep mock of Prisma Client
export type MockPrisma = DeepMockProxy<PrismaClient>

// Global Prisma mock (singleton)
export const prismaMock = mockDeep<PrismaClient>()

/**
 * Reset database mock before each test
 */
export function resetDatabase() {
  mockReset(prismaMock)
}

// =============================================================================
// Mock Data Factories
// =============================================================================

/**
 * Create mock user data
 */
export const createMockUser = (overrides?: Partial<any>) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  emailVerified: null,
  image: null,
  role: 'STUDENT',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock admin user data
 */
export const createMockAdmin = (overrides?: Partial<any>) => ({
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  emailVerified: null,
  image: null,
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock course data
 */
export const createMockCourse = (overrides?: Partial<any>) => ({
  id: 'test-course-id',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test course description',
  content: 'Test course content',
  price: 99.99,
  published: true,
  featured: false,
  imageUrl: '/courses/test-course.jpg',
  instructorId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock enrollment data
 */
export const createMockEnrollment = (overrides?: Partial<any>) => ({
  id: 'test-enrollment-id',
  userId: 'test-user-id',
  courseId: 'test-course-id',
  progress: 0,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock lesson data
 */
export const createMockLesson = (overrides?: Partial<any>) => ({
  id: 'test-lesson-id',
  title: 'Test Lesson',
  slug: 'test-lesson',
  content: 'Test lesson content',
  order: 1,
  duration: 600, // 10 minutes
  courseId: 'test-course-id',
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock achievement data
 */
export const createMockAchievement = (overrides?: Partial<any>) => ({
  id: 'test-achievement-id',
  title: 'Test Achievement',
  description: 'Test achievement description',
  badgeUrl: '/badges/test-badge.svg',
  points: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// =============================================================================
// Default Mock Data (for backward compatibility)
// =============================================================================

export const mockUser = createMockUser()
export const mockAdmin = createMockAdmin()
export const mockCourse = createMockCourse()
export const mockEnrollment = createMockEnrollment()
export const mockLesson = createMockLesson()
export const mockAchievement = createMockAchievement()
