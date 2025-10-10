/**
 * NextAuth v5 Configuration
 * PHASE 0.6B: Migrated from v4 to v5
 *
 * Key changes:
 * - Uses new NextAuth() API
 * - Returns { auth, handlers, signIn, signOut }
 * - Callbacks have new signatures
 *
 * Migration date: 2025-10-09
 * Migrated from: src/lib/auth/config.ts (NextAuth v4)
 */

import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import type { UserRole } from '@/domain/entities/user'

// Extend NextAuth types with our custom properties
declare module 'next-auth' {
  interface User {
    id: string
    role?: UserRole
    emailVerified?: Date | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserRole
      emailVerified?: Date | null
    }
  }
}

/**
 * Build providers array dynamically based on available environment variables
 */
function buildProviders() {
  const providers = []

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    )
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    )
  }

  return providers
}

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: buildProviders(),

  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    /**
     * Session callback - Add custom user properties to session
     * V5 CHANGE: session callback receives { session, user } (no token for database sessions)
     */
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = (user as any).role || 'STUDENT'
        session.user.emailVerified = user.emailVerified
      }
      return session
    },

    /**
     * Sign in callback - Control who can sign in
     * User will be created/updated in database automatically
     */
    async signIn({ user, account, profile }) {
      // Allow all sign ins - user creation handled by adapter
      return true
    },

    /**
     * Redirect callback - Control redirect URLs
     */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    /**
     * Sign in event - Triggered on successful sign in
     */
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log('[NextAuth] New user signed up:', user.email)
        // TODO: Emit domain event for new user registration
      }
    },

    /**
     * Sign out event - Triggered on sign out
     */
    async signOut({ session, token }) {
      console.log('[NextAuth] User signed out:', session?.user?.email)
    },
  },

  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
}

/**
 * NextAuth v5 instance
 *
 * V5 CHANGE: NextAuth() now returns { auth, handlers, signIn, signOut }
 * - auth(): Get session in server components
 * - handlers: { GET, POST } for API routes
 * - signIn(): Programmatic sign in
 * - signOut(): Programmatic sign out
 */
export const { auth, handlers, signIn, signOut } = NextAuth(config)
