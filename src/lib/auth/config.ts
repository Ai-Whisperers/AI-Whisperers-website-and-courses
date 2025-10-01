// Authentication Configuration
// NextAuth.js configuration following security best practices

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

// Environment variable validation
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}

// Build providers array dynamically based on available environment variables
function buildProviders() {
  const providers = []
  
  try {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(GoogleProvider({
        clientId: validateEnvVar('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
        clientSecret: validateEnvVar('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET),
      }))
    }
  } catch (error) {
    console.warn('Google OAuth not configured:', error)
  }
  
  try {
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      providers.push(GitHubProvider({
        clientId: validateEnvVar('GITHUB_CLIENT_ID', process.env.GITHUB_CLIENT_ID),
        clientSecret: validateEnvVar('GITHUB_CLIENT_SECRET', process.env.GITHUB_CLIENT_SECRET),
      }))
    }
  } catch (error) {
    console.warn('GitHub OAuth not configured:', error)
  }
  
  // EmailProvider requires a database adapter and is not compatible with JWT-only strategy
  // Removed to maintain database-free architecture
  // To enable email authentication, implement a database adapter first
  // See: https://next-auth.js.org/adapters/overview
  
  return providers
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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

  // Add logger for better debugging
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth Warning]', code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth Debug]', code, metadata)
      }
    },
  },

  callbacks: {
    async session({ session, user }) {
      // With database sessions, user comes from the database adapter
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = (user as any).role || 'STUDENT'
        session.user.emailVerified = user.emailVerified
      }
      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in - user will be created/updated in database automatically
      return true
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log('New user signed up:', user.email)
        // You could emit a domain event here for new user registration
      }
    },
    
    async signOut({ session, token }) {
      console.log('User signed out:', session?.user?.email)
    },
  },

  debug: process.env.NODE_ENV === 'development',
}