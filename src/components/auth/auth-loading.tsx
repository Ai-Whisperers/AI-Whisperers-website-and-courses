// Authentication Loading Component
// Better UX for authentication loading states

'use client'

import { useEffect, useState } from 'react'

interface AuthLoadingProps {
  timeout?: number
  onTimeout?: () => void
}

export function AuthLoading({ timeout = 10000, onTimeout }: AuthLoadingProps) {
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  if (timeoutReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="text-yellow-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Authentication Timeout
          </h2>
          <p className="text-gray-600">
            The authentication service is taking longer than expected.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Possible causes:</p>
            <ul className="list-disc list-inside text-left">
              <li>Authentication providers not configured</li>
              <li>Missing environment variables</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative w-16 h-16 mb-6">
        {/* Spinning loader */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Checking Authentication
      </h2>
      <p className="text-gray-600 text-sm">
        Please wait while we verify your session...
      </p>
    </div>
  )
}

// Simplified loading spinner for inline use
export function AuthLoadingSpinner() {
  return (
    <div className="inline-block relative w-4 h-4">
      <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
  )
}
