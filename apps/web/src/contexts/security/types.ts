/**
 * Security Context Types
 * Layer 1: Authentication, Users, Payments, Permissions
 */

import { Session } from 'next-auth'

// User types
export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  emailVerified?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials extends LoginCredentials {
  name: string
}

export type AuthProvider = 'credentials' | 'google' | 'github' | 'magic-link'

// Subscription & Payment types
export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank_transfer'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface PaymentData {
  amount: number
  currency: string
  paymentMethodId: string
  description?: string
}

// Permission & Role types
export type Role = 'user' | 'admin' | 'instructor' | 'support'

export type Permission =
  | 'courses:read'
  | 'courses:write'
  | 'courses:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'payments:read'
  | 'payments:write'
  | 'admin:access'

export interface RolePermissions {
  user: Permission[]
  admin: Permission[]
  instructor: Permission[]
  support: Permission[]
}

// Profile update types
export interface ProfileData {
  name?: string
  email?: string
  image?: string
  bio?: string
  preferences?: Record<string, any>
}

// Security Context State
export interface SecurityContextState {
  // Authentication
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Subscriptions & Payments
  subscription: Subscription | null
  paymentMethods: PaymentMethod[]

  // Permissions & Roles
  roles: Role[]
  permissions: Permission[]

  // Actions
  login: (credentials: LoginCredentials, provider?: AuthProvider) => Promise<void>
  logout: () => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  updateProfile: (data: ProfileData) => Promise<void>

  // Payment actions
  processPayment: (data: PaymentData) => Promise<void>
  updateSubscription: (plan: SubscriptionPlan) => Promise<void>
  cancelSubscription: () => Promise<void>

  // Permission checks
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
}

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  user: ['courses:read'],
  instructor: ['courses:read', 'courses:write', 'users:read'],
  support: ['courses:read', 'users:read', 'payments:read'],
  admin: [
    'courses:read', 'courses:write', 'courses:delete',
    'users:read', 'users:write', 'users:delete',
    'payments:read', 'payments:write',
    'admin:access'
  ],
}
