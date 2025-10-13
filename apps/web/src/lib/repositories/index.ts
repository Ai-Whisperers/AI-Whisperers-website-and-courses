/**
 * Repository Index
 * Centralized exports for all repository implementations
 *
 * This module exports factory functions for creating repository instances
 * that connect the domain layer to the database through Prisma ORM.
 */

// Course Repository
export {
  PrismaCourseRepository,
  createPrismaCourseRepository,
} from './prisma-course-repository'

// User Repository
export {
  PrismaUserRepository,
  createPrismaUserRepository,
} from './prisma-user-repository'

// Re-export repository interfaces for convenience
export type { CourseRepository } from '@/domain/interfaces/course-repository'
export type { UserRepository } from '@/domain/interfaces/user-repository'
