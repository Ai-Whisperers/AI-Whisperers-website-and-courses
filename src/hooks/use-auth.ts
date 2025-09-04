// Custom Hook: useAuth
// Authentication state management

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/domain/entities/user'

// Extended NextAuth user type with our custom properties
declare module 'next-auth' {
  interface User {
    id: string
    role?: UserRole
    emailVerified?: Date
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserRole
      emailVerified?: Date
    }
  }
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  emailVerified?: Date
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = session?.user && session.user.id && session.user.email ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? undefined,
    role: session.user.role ?? UserRole.STUDENT,
    emailVerified: session.user.emailVerified,
  } as AuthUser : null

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  const login = async (provider?: string, callbackUrl?: string) => {
    await signIn(provider, { callbackUrl })
  }

  const logout = async (callbackUrl?: string) => {
    await signOut({ callbackUrl })
  }

  const requireAuth = (redirectTo = '/auth/signin') => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    }
  }

  const requireRole = (requiredRole: UserRole, redirectTo = '/') => {
    if (user && user.role !== requiredRole && user.role !== UserRole.ADMIN) {
      router.push(redirectTo)
    }
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role || user.role === UserRole.ADMIN
  }

  const canAccessCourse = (): boolean => {
    return isAuthenticated && !!user?.emailVerified
  }

  const canManageCourses = (): boolean => {
    return hasRole(UserRole.INSTRUCTOR) || hasRole(UserRole.ADMIN)
  }

  const canAccessAdmin = (): boolean => {
    return hasRole(UserRole.ADMIN)
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
    requireRole,
    hasRole,
    canAccessCourse,
    canManageCourses,
    canAccessAdmin,
  }
}