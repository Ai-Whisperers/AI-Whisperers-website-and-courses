/**
 * Logic Context
 * Layer 3: Global context for routing, modals, notifications, admin features
 */

'use client'

import { createContext, useContext } from 'react'
import type { LogicContextState } from './types'

export const LogicContext = createContext<LogicContextState | undefined>(undefined)

export function useLogicContext(): LogicContextState {
  const context = useContext(LogicContext)

  if (context === undefined) {
    throw new Error('useLogicContext must be used within a LogicProvider')
  }

  return context
}

// Convenience hooks
export function useRouting() {
  const { currentRoute, navigationHistory, canGoBack, navigate, goBack, clearHistory } = useLogicContext()
  return { currentRoute, navigationHistory, canGoBack, navigate, goBack, clearHistory }
}

export function useModals() {
  const { modals, activeModals, openModal, closeModal, closeAllModals } = useLogicContext()
  return { modals, activeModals, openModal, closeModal, closeAllModals }
}

export function useNotifications() {
  const { notifications, showNotification, dismissNotification, clearNotifications } = useLogicContext()
  return { notifications, showNotification, dismissNotification, clearNotifications }
}

export function useLoading() {
  const { loadingStates, isGlobalLoading, startLoading, stopLoading, clearLoading } = useLogicContext()
  return { loadingStates, isGlobalLoading, startLoading, stopLoading, clearLoading }
}

export function useAdmin() {
  const { isAdminMode, toggleAdminMode } = useLogicContext()
  return { isAdminMode, toggleAdminMode }
}

export function useFeatureFlags() {
  const { featureFlags, setFeatureFlag, isFeatureEnabled } = useLogicContext()
  return { featureFlags, setFeatureFlag, isFeatureEnabled }
}
