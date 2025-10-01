// Authentication Provider
// NextAuth session provider wrapper with error handling

'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Listen for NextAuth errors
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('next-auth')) {
        console.error('[Auth Provider Error]', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        })
        setError('Authentication service temporarily unavailable')
      }
    }

    // Listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('next-auth') ||
          event.reason?.message?.includes('prisma') ||
          event.reason?.message?.includes('session')) {
        console.error('[Auth Provider Rejection]', {
          reason: event.reason,
          promise: event.promise
        })
        setError('Database connection issue - authentication unavailable')
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return (
    <SessionProvider
      // Reduce refetch interval to avoid overwhelming database
      refetchInterval={15 * 60} // 15 minutes instead of 5
      // Only refetch when window regains focus after being away
      refetchOnWindowFocus={true}
      // Don't refetch when offline
      refetchWhenOffline={false}
      // Set base path for API routes
      basePath="/api/auth"
    >
      {error && !dismissed && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-3 text-center text-sm z-50 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="flex-1">{error} - Check console for details</span>
            <button
              onClick={() => setDismissed(true)}
              className="ml-4 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs font-semibold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {children}
    </SessionProvider>
  )
}