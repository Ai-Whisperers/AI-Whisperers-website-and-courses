/**
 * Logic Context - Layer 3
 * Routing, Modals, Notifications, Admin, Feature Flags
 */

export { LogicProvider } from './LogicProvider'
export {
  LogicContext,
  useLogicContext,
  useRouting,
  useModals,
  useNotifications,
  useLoading,
  useAdmin,
  useFeatureFlags,
} from './LogicContext'

export type {
  ModalConfig,
  ModalOptions,
  ModalState,
  Notification,
  NotificationType,
  NotificationAction,
  RouteHistory,
  FeatureFlag,
  FeatureFlags,
  LoadingState,
  LogicContextState,
} from './types'

export { DEFAULT_FEATURE_FLAGS } from './types'
