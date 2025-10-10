/**
 * @aiwhisperers/database
 * Prisma Client Singleton Pattern
 *
 * PHASE 1.2: Database package for monorepo
 *
 * This module provides a singleton instance of PrismaClient to be used
 * across the entire monorepo. It prevents multiple instances being created
 * in development (hot reload) and ensures proper connection pooling.
 */

import { PrismaClient } from '@prisma/client'

// Extend global type for development singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client Singleton
 *
 * In development, we store the client in global to prevent creating
 * multiple instances on hot reload. In production, we create a new
 * instance each time (which is fine since there's no hot reload).
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

// Store in global for development hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Re-export everything from Prisma Client for convenience
 *
 * This allows importing types and utilities directly from @aiwhisperers/database:
 * ```ts
 * import { prisma, Prisma, User, Course } from '@aiwhisperers/database'
 * ```
 */
export * from '@prisma/client'
