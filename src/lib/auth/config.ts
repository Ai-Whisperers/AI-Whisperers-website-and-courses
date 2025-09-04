// Authentication Configuration
// NextAuth.js configuration following security best practices

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'

export const authOptions: NextAuthOptions = {
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