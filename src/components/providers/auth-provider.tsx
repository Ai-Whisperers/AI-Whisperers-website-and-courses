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

  useEffect(() => {
    // Listen for NextAuth errors
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('next-auth')) {
        console.error('[Auth Provider Error]', event.message)
        setError('Authentication service temporarily unavailable')
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return (
    <SessionProvider
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      // Refetch when window regains focus
      refetchOnWindowFocus={true}
      // Refetch when navigating between pages
      refetchWhenOffline={false}
    >
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center text-sm z-50">
          {error} - Check console for details
        </div>
      )}
      {children}
    </SessionProvider>
  )
}