/**
 * Environment Variable Validation
 *
 * PHASE 0.3: Enterprise-grade environment variable validation using Zod
 *
 * This validates all environment variables at application startup, ensuring:
 * - All required variables are present
 * - Variables have correct types and formats
 * - Secure defaults are applied where appropriate
 * - App crashes immediately if validation fails (fail-fast principle)
 */

import { z } from 'zod'

const envSchema = z.object({
  // ===================================
  // Database Configuration
  // ===================================
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // ===================================
  // Authentication (NextAuth.js)
  // ===================================
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // OAuth Providers (Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // ===================================
  // Node Environment
  // ===================================
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // ===================================
  // Feature Flags (Public)
  // ===================================
  NEXT_PUBLIC_ENABLE_COURSES: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_STRIPE: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_AI_CHAT: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_PAYPAL: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_CERTIFICATES: z.coerce.boolean().default(true),

  // ===================================
  // Render Tunnel (Dev/Prod Parity)
  // ===================================
  RENDER_TUNNEL_ENABLED: z.coerce.boolean().default(false),
  RENDER_TUNNEL_SECRET: z.string().min(32).optional(),
  RENDER_EXTERNAL_URL: z.string().url().optional(),

  // ===================================
  // Payment Providers
  // ===================================
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // PayPal
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_WEBHOOK_ID: z.string().optional(),

  // ===================================
  // Email Service (Resend)
  // ===================================
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default('noreply@aiwhisperers.com'),

  // ===================================
  // AI Services
  // ===================================
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  // ===================================
  // Monitoring & Analytics
  // ===================================
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),

  // ===================================
  // Rate Limiting & Security
  // ===================================
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000), // 1 minute

  // ===================================
  // Content & Media
  // ===================================
  VIMEO_ACCESS_TOKEN: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
})

/**
 * Validated environment variables
 *
 * Usage:
 * ```ts
 * import { env } from '@/config/env'
 *
 * const dbUrl = env.DATABASE_URL
 * ```
 *
 * Note: This will throw an error if any validation fails, causing the app to crash.
 * This is intentional - it's better to fail fast than run with invalid config.
 */
export const env = envSchema.parse(process.env)

/**
 * TypeScript type for validated environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Check if a feature flag is enabled
 *
 * @param flag - Feature flag name
 * @returns boolean
 */
export function isFeatureEnabled(flag: keyof Pick<Env,
  | 'NEXT_PUBLIC_ENABLE_COURSES'
  | 'NEXT_PUBLIC_ENABLE_STRIPE'
  | 'NEXT_PUBLIC_ENABLE_AI_CHAT'
  | 'NEXT_PUBLIC_ENABLE_PAYPAL'
  | 'NEXT_PUBLIC_ENABLE_CERTIFICATES'
>): boolean {
  return env[flag] === true
}

/**
 * Check if running in production
 */
export const isProd = env.NODE_ENV === 'production'

/**
 * Check if running in development
 */
export const isDev = env.NODE_ENV === 'development'

/**
 * Check if running in test mode
 */
export const isTest = env.NODE_ENV === 'test'

/**
 * Check if Render Tunnel is enabled
 */
export const isTunnelEnabled = env.RENDER_TUNNEL_ENABLED === true

/**
 * Get external site URL (works in both dev and prod)
 */
export const siteUrl = isProd
  ? (env.RENDER_EXTERNAL_URL || 'https://ai-whisperers-website-and-courses.onrender.com')
  : 'http://localhost:3000'
