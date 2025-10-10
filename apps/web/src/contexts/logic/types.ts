/**
 * Logic Context Types
 * Layer 3: Routing, Modals, Notifications, Admin, Feature Flags
 */

// Modal types
export interface ModalConfig {
  id: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  options?: ModalOptions
}

export interface ModalOptions {
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  position?: 'center' | 'top' | 'bottom'
}

export interface ModalState extends ModalConfig {
  isOpen: boolean
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number // in milliseconds, undefined = persistent
  action?: NotificationAction
}

export interface NotificationAction {
  label: string
  onClick: () => void
}

// Routing types
export interface RouteHistory {
  path: string
  timestamp: number
}

// Feature flags
export type FeatureFlag =
  | 'beta_features'
  | 'new_dashboard'
  | 'advanced_analytics'
  | 'ai_assistant'
  | 'experimental_ui'

export type FeatureFlags = Record<FeatureFlag, boolean>

// Loading state types
export interface LoadingState {
  id: string
  message?: string
}

// Logic Context State
export interface LogicContextState {
  // Routing
  currentRoute: string
  navigationHistory: RouteHistory[]
  canGoBack: boolean

  // Modals
  modals: ModalState[]
  activeModals: ModalState[]

  // Notifications
  notifications: Notification[]

  // Global loading
  loadingStates: LoadingState[]
  isGlobalLoading: boolean

  // Admin & Testing
  isAdminMode: boolean
  isTestMode: boolean
  featureFlags: FeatureFlags

  // Actions - Routing
  navigate: (path: string) => void
  goBack: () => void
  clearHistory: () => void

  // Actions - Modals
  openModal: (config: Omit<ModalConfig, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void

  // Actions - Notifications
  showNotification: (notification: Omit<Notification, 'id'>) => string
  dismissNotification: (id: string) => void
  clearNotifications: () => void

  // Actions - Loading
  startLoading: (id: string, message?: string) => void
  stopLoading: (id: string) => void
  clearLoading: () => void

  // Actions - Admin & Features
  toggleAdminMode: () => void
  toggleTestMode: () => void
  setFeatureFlag: (flag: FeatureFlag, enabled: boolean) => void
  isFeatureEnabled: (flag: FeatureFlag) => boolean
}

// Default feature flags
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  beta_features: false,
  new_dashboard: false,
  advanced_analytics: false,
  ai_assistant: false,
  experimental_ui: false,
}
