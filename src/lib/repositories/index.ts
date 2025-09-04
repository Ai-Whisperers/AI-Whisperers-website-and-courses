// Repository Index
// Centralized exports for all repository implementations

export { PrismaCourseRepository } from '../../infrastructure/database/prisma-course-repository'
export { PrismaUserRepository } from '../../infrastructure/database/prisma-user-repository'
export { prisma } from '../../infrastructure/database/prisma-client'

// Repository factory functions
export function createCourseRepository() {
  return new PrismaCourseRepository(prisma)
}

export function createUserRepository() {
  return new PrismaUserRepository(prisma)
}