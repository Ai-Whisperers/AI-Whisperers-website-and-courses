// Authentication Configuration
// NextAuth.js configuration following security best practices

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'

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
  
  try {
    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM) {
      providers.push(EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }))
    }
  } catch (error) {
    console.warn('Email provider not configured:', error)
  }
  
  return providers
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || 'STUDENT'
        session.user.emailVerified = token.emailVerified as Date
      }
      return session
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = 'STUDENT' // Default role since we don't have database
        token.emailVerified = new Date() // Assume email is verified for OAuth providers
      }
      return token
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in
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