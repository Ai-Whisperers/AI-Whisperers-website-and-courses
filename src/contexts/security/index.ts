/**
 * Security Context - Layer 1
 * Authentication, Users, Payments, Permissions
 */

export { SecurityProvider } from './SecurityProvider'
export {
  SecurityContext,
  useSecurityContext,
  useAuth,
  useUser,
  useSubscription,
  usePayments,
  usePermissions,
} from './SecurityContext'

export type {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthProvider,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentMethod,
  PaymentData,
  Role,
  Permission,
  RolePermissions,
  ProfileData,
  SecurityContextState,
} from './types'

export { DEFAULT_ROLE_PERMISSIONS } from './types'
