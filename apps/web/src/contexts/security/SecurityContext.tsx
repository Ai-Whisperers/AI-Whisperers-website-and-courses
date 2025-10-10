/**
 * Security Context
 * Layer 1: Global context for authentication, users, payments, and permissions
 */

'use client'

import { createContext, useContext } from 'react'
import type { SecurityContextState } from './types'

export const SecurityContext = createContext<SecurityContextState | undefined>(undefined)

export function useSecurityContext(): SecurityContextState {
  const context = useContext(SecurityContext)

  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider')
  }

  return context
}

// Convenience hooks
export function useAuth() {
  const { user, session, isAuthenticated, isLoading, login, logout, signup } = useSecurityContext()
  return { user, session, isAuthenticated, isLoading, login, logout, signup }
}

export function useUser() {
  const { user, isLoading, updateProfile } = useSecurityContext()
  return { user, isLoading, updateProfile }
}

export function useSubscription() {
  const { subscription, updateSubscription, cancelSubscription } = useSecurityContext()
  return { subscription, updateSubscription, cancelSubscription }
}

export function usePayments() {
  const { paymentMethods, processPayment } = useSecurityContext()
  return { paymentMethods, processPayment }
}

export function usePermissions() {
  const { roles, permissions, hasPermission, hasRole, hasAnyRole } = useSecurityContext()
  return { roles, permissions, hasPermission, hasRole, hasAnyRole }
}
