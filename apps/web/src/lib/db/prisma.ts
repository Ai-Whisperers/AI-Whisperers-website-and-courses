/**
 * Prisma Client Export
 *
 * ✅ PHASE 1.5: Migrated to use @aiwhisperers/database package
 *
 * This file now simply re-exports the Prisma client from the monorepo package.
 * The singleton pattern is implemented in @aiwhisperers/database to prevent
 * multiple instances and connection exhaustion.
 */

export { prisma, Prisma } from '@aiwhisperers/database'
export type * from '@aiwhisperers/database'

// Re-export as default for backward compatibility
export { prisma as default } from '@aiwhisperers/database'
