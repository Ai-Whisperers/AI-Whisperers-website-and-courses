/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting for API routes
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number

  /**
   * Time window in milliseconds
   */
  windowMs: number

  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean

  /**
   * Remaining requests in current window
   */
  remaining: number

  /**
   * Total limit for the window
   */
  limit: number

  /**
   * Time when the limit will reset (Unix timestamp)
   */
  reset: number
}

/**
 * Check if a request is within rate limits
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)

  // Clean up expired entry
  if (entry && entry.resetTime <= now) {
    entry = undefined
    rateLimitStore.delete(key)
  }

  // Create new entry if needed
  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment request count
  entry.count++

  // Check if limit exceeded
  const success = entry.count <= config.max
  const remaining = Math.max(0, config.max - entry.count)

  return {
    success,
    remaining,
    limit: config.max,
    reset: entry.resetTime,
  }
}

/**
 * Get identifier from request (IP address or custom)
 */
export function getIdentifier(
  request: Request,
  customIdentifier?: string
): string {
  if (customIdentifier) {
    return customIdentifier
  }

  // Try to get IP from headers (common in proxied environments)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  return 'anonymous'
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Clean up expired entries (should be called periodically)
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now()
  let cleaned = 0

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key)
      cleaned++
    }
  }

  return cleaned
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict: 10 requests per minute
   */
  STRICT: { max: 10, windowMs: 60 * 1000 },

  /**
   * Standard: 30 requests per minute
   */
  STANDARD: { max: 30, windowMs: 60 * 1000 },

  /**
   * Generous: 100 requests per minute
   */
  GENEROUS: { max: 100, windowMs: 60 * 1000 },

  /**
   * API: 1000 requests per hour
   */
  API: { max: 1000, windowMs: 60 * 60 * 1000 },
} as const

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanupExpiredEntries()
  }, 5 * 60 * 1000)
}
