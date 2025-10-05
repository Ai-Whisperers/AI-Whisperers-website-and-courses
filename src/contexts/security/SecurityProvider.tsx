/**
 * Security Provider
 * Layer 1: Authentication, Users, Payments, Permissions
 */

'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import { SecurityContext } from './SecurityContext'
import type {
  SecurityContextState,
  User,
  Subscription,
  PaymentMethod,
  Role,
  Permission,
  LoginCredentials,
  SignupCredentials,
  ProfileData,
  PaymentData,
  SubscriptionPlan,
  AuthProvider,
} from './types'
import { getEncryptedItem, setEncryptedItem } from '@/utils/storage'

interface SecurityProviderProps {
  children: ReactNode
}

function SecurityProviderInner({ children }: SecurityProviderProps) {
  const { data: session, status } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [roles, setRoles] = useState<Role[]>(['user'])
  const [permissions, setPermissions] = useState<Permission[]>(['courses:read'])
  const [error, setError] = useState<string | null>(null)

  const isLoading = status === 'loading'
  const isAuthenticated = !!session && !!user

  // Load user data when session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name,
        image: session.user.image,
      })

      // Load cached subscription and payment data
      loadSubscriptionData()
    } else {
      setUser(null)
      setSubscription(null)
      setPaymentMethods([])
      setRoles(['user'])
      setPermissions(['courses:read'])
    }
  }, [session])

  // Load subscription data from storage or API
  const loadSubscriptionData = useCallback(async () => {
    try {
      // Try to load from cache first
      const cachedSubscription = getEncryptedItem<Subscription | null>(
        'SECURITY',
        'subscription',
        null
      )
      if (cachedSubscription) {
        setSubscription(cachedSubscription)
      }

      // TODO: Fetch from API in production
      // const response = await fetch('/api/user/subscription')
      // const data = await response.json()
      // setSubscription(data.subscription)
      // setEncryptedItem('SECURITY', 'subscription', data.subscription)
    } catch (err) {
      console.error('[Security] Failed to load subscription:', err)
    }
  }, [])

  // Login action
  const login = useCallback(
    async (credentials: LoginCredentials, provider: AuthProvider = 'credentials') => {
      try {
        setError(null)

        if (provider === 'credentials') {
          const result = await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
          })

          if (result?.error) {
            setError(result.error)
            throw new Error(result.error)
          }
        } else {
          await signIn(provider, { redirect: false })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        setError(message)
        throw err
      }
    },
    []
  )

  // Logout action
  const logout = useCallback(async () => {
    try {
      setError(null)
      await signOut({ redirect: false })

      // Clear cached data
      setUser(null)
      setSubscription(null)
      setPaymentMethods([])
      setRoles(['user'])
      setPermissions(['courses:read'])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
      throw err
    }
  }, [])

  // Signup action
  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setError(null)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Signup failed')
      }

      // Auto-login after signup
      await login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      throw err
    }
  }, [login])

  // Update profile action
  const updateProfile = useCallback(async (data: ProfileData) => {
    try {
      setError(null)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updated = await response.json()
      setUser(prev => prev ? { ...prev, ...updated } : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed'
      setError(message)
      throw err
    }
  }, [])

  // Process payment action
  const processPayment = useCallback(async (data: PaymentData) => {
    try {
      setError(null)

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      const result = await response.json()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      setError(message)
      throw err
    }
  }, [])

  // Update subscription action
  const updateSubscription = useCallback(async (plan: SubscriptionPlan) => {
    try {
      setError(null)

      const response = await fetch('/api/user/subscription', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      const updated = await response.json()
      setSubscription(updated)
      setEncryptedItem('SECURITY', 'subscription', updated)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Subscription update failed'
      setError(message)
      throw err
    }
  }, [])

  // Cancel subscription action
  const cancelSubscription = useCallback(async () => {
    try {
      setError(null)

      const response = await fetch('/api/user/subscription', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      setSubscription(prev =>
        prev ? { ...prev, cancelAtPeriodEnd: true } : null
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cancellation failed'
      setError(message)
      throw err
    }
  }, [])

  // Permission check helpers
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return permissions.includes(permission)
    },
    [permissions]
  )

  const hasRole = useCallback(
    (role: Role): boolean => {
      return roles.includes(role)
    },
    [roles]
  )

  const hasAnyRole = useCallback(
    (requiredRoles: Role[]): boolean => {
      return requiredRoles.some(role => roles.includes(role))
    },
    [roles]
  )

  const value: SecurityContextState = {
    user,
    session: session || null,
    isAuthenticated,
    isLoading,
    error,
    subscription,
    paymentMethods,
    roles,
    permissions,
    login,
    logout,
    signup,
    updateProfile,
    processPayment,
    updateSubscription,
    cancelSubscription,
    hasPermission,
    hasRole,
    hasAnyRole,
  }

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  )
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  return (
    <SessionProvider
      refetchInterval={15 * 60} // 15 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
      basePath="/api/auth"
    >
      <SecurityProviderInner>{children}</SecurityProviderInner>
    </SessionProvider>
  )
}
