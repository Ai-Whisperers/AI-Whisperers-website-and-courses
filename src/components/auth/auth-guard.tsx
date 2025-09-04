// Authentication Guard Component
// Protects routes based on authentication and authorization rules

'use client'

import { useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/domain/entities/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireRole?: UserRole
  requireEmailVerified?: boolean
  fallback?: ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  requireEmailVerified = false,
  fallback
}: AuthGuardProps) {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    hasRole, 
    canAccessCourse, 
    requireAuth: redirectToAuth,
    login 
  } = useAuth()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      redirectToAuth()
    }
  }, [isLoading, requireAuth, isAuthenticated, redirectToAuth])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to access this content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role requirement
  if (requireRole && user && !hasRole(requireRole)) {
    return fallback || (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Required role: {requireRole}
            </p>
            <p className="text-sm text-muted-foreground">
              Your role: {user.role}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check email verification requirement
  if (requireEmailVerified && user && !canAccessCourse()) {
    return fallback || (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to access this content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We've sent a verification email to {user.email}. Please check your inbox and click the verification link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}