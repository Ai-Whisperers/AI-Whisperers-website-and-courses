/**
 * NextAuth v5 API Route
 * PHASE 0.6B: Migrated from v4 to v5
 *
 * Key change: Use handlers from NextAuth() instead of creating handler manually
 *
 * Migration notes:
 * - v4: Used NextAuth(authOptions) and exported as { handler as GET, handler as POST }
 * - v5: Import handlers directly from auth.config and export as { GET, POST }
 */

import { handlers } from '@/lib/auth/auth.config'

/**
 * V5 CHANGE: Export handlers directly (no need to wrap in NextAuth())
 *
 * The handlers object contains { GET, POST } methods that handle all
 * authentication routes:
 * - GET: Sign in page, callback, session, providers, csrf
 * - POST: Sign in, callback, signout
 */
export const { GET, POST } = handlers
