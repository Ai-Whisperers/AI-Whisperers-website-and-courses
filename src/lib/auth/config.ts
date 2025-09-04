// Authentication Configuration
// NextAuth.js configuration following security best practices

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/infrastructure/database/prisma-client'
import { User, UserRole } from '@/domain/entities/user'
import { UserId } from '@/domain/value-objects/user-id'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  session: {
    strategy: 'database',
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = (user as any).role || UserRole.STUDENT
        session.user.emailVerified = user.emailVerified
      }
      return session
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