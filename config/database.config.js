/**
 * Database Configuration
 * Handles DATABASE_URL context-aware resolution
 *
 * Problem: Prisma needs DATABASE_URL at build time, but actual DB only exists at runtime
 * Solution: Use placeholder for builds, enforce real URL for runtime
 */

const PLACEHOLDER_DB = "postgresql://placeholder:placeholder@placeholder:5432/placeholder?schema=public"

/**
 * Get database URL based on execution context
 *
 * @param {'build' | 'runtime'} context - Execution context
 * @returns {string} Database URL
 * @throws {Error} If runtime context but no real DATABASE_URL
 */
function getDatabaseUrl(context = 'build') {
  const envUrl = process.env.DATABASE_URL

  // Runtime: Must have real URL (for NextAuth, Prisma queries)
  if (context === 'runtime') {
    if (!envUrl || envUrl === PLACEHOLDER_DB) {
      throw new Error(
        'DATABASE_URL is required at runtime. ' +
        'Please set DATABASE_URL environment variable with your PostgreSQL connection string.'
      )
    }
    return envUrl
  }

  // Build: Placeholder is acceptable (for Prisma schema generation only)
  if (context === 'build') {
    return envUrl || PLACEHOLDER_DB
  }

  // Default: Return whatever is set
  return envUrl || PLACEHOLDER_DB
}

/**
 * Check if database is properly configured for runtime
 * @returns {boolean}
 */
function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL
  return !!url && url !== PLACEHOLDER_DB
}

/**
 * Get database strategy based on configuration
 * - 'database' if DATABASE_URL is configured
 * - 'jwt' if no database (for NextAuth session strategy)
 *
 * @returns {'database' | 'jwt'}
 */
function getDatabaseStrategy() {
  return isDatabaseConfigured() ? 'database' : 'jwt'
}

/**
 * Validate DATABASE_URL format (basic check)
 * @param {string} url - Database URL to validate
 * @returns {boolean}
 */
function isValidDatabaseUrl(url) {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Check for postgresql:// prefix
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    return false
  }

  // Check it's not the placeholder
  if (url === PLACEHOLDER_DB) {
    return false
  }

  return true
}

module.exports = {
  getDatabaseUrl,
  isDatabaseConfigured,
  getDatabaseStrategy,
  isValidDatabaseUrl,
  PLACEHOLDER_DB
}
