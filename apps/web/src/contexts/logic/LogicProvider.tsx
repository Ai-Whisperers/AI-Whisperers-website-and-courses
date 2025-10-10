/**
 * Logic Provider
 * Layer 3: Routing, Modals, Notifications, Admin, Feature Flags
 */

'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogicContext } from './LogicContext'
import type {
  LogicContextState,
  ModalConfig,
  ModalState,
  Notification,
  RouteHistory,
  LoadingState,
  FeatureFlag,
  FeatureFlags,
} from './types'
import { DEFAULT_FEATURE_FLAGS } from './types'
import { getStorageItem, setStorageItem } from '@/utils/storage'

interface LogicProviderProps {
  children: ReactNode
}

export function LogicProvider({ children }: LogicProviderProps) {
  const pathname = usePathname()

  // State
  const [navigationHistory, setNavigationHistory] = useState<RouteHistory[]>([])
  const [modals, setModals] = useState<ModalState[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([])
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS)

  // Load saved state on mount
  useEffect(() => {
    const savedAdminMode = getStorageItem('LOGIC', 'adminMode', false)
    const savedTestMode = getStorageItem('LOGIC', 'testMode', false)
    const savedFeatureFlags = getStorageItem('LOGIC', 'featureFlags', DEFAULT_FEATURE_FLAGS)

    setIsAdminMode(savedAdminMode)
    setIsTestMode(savedTestMode)
    setFeatureFlags(savedFeatureFlags)
  }, [])

  // Track route changes
  useEffect(() => {
    if (pathname) {
      setNavigationHistory(prev => [
        ...prev,
        { path: pathname, timestamp: Date.now() },
      ])
    }
  }, [pathname])

  // Routing actions
  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      setNavigationHistory(prev => [
        ...prev,
        { path, timestamp: Date.now() },
      ])
    }
  }, [])

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && navigationHistory.length > 1) {
      window.history.back()
      setNavigationHistory(prev => prev.slice(0, -1))
    }
  }, [navigationHistory])

  const clearHistory = useCallback(() => {
    setNavigationHistory([{ path: pathname || '/', timestamp: Date.now() }])
  }, [pathname])

  // Modal actions
  const openModal = useCallback((config: Omit<ModalConfig, 'id'>): string => {
    const id = `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newModal: ModalState = {
      ...config,
      id,
      isOpen: true,
    }
    setModals(prev => [...prev, newModal])
    return id
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.map(modal =>
      modal.id === id ? { ...modal, isOpen: false } : modal
    ))

    // Remove modal after animation
    setTimeout(() => {
      setModals(prev => prev.filter(modal => modal.id !== id))
    }, 300)
  }, [])

  const closeAllModals = useCallback(() => {
    setModals(prev => prev.map(modal => ({ ...modal, isOpen: false })))

    setTimeout(() => {
      setModals([])
    }, 300)
  }, [])

  // Notification actions
  const showNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      ...notification,
      id,
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-dismiss if duration is set
    if (notification.duration) {
      setTimeout(() => {
        dismissNotification(id)
      }, notification.duration)
    }

    return id
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Loading actions
  const startLoading = useCallback((id: string, message?: string) => {
    setLoadingStates(prev => [
      ...prev.filter(state => state.id !== id),
      { id, message },
    ])
  }, [])

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id))
  }, [])

  const clearLoading = useCallback(() => {
    setLoadingStates([])
  }, [])

  // Admin & Feature actions
  const toggleAdminMode = useCallback(() => {
    setIsAdminMode(prev => {
      const newValue = !prev
      setStorageItem('LOGIC', 'adminMode', newValue)
      return newValue
    })
  }, [])

  const toggleTestMode = useCallback(() => {
    setIsTestMode(prev => {
      const newValue = !prev
      setStorageItem('LOGIC', 'testMode', newValue)
      return newValue
    })
  }, [])

  const setFeatureFlag = useCallback((flag: FeatureFlag, enabled: boolean) => {
    setFeatureFlags(prev => {
      const updated = { ...prev, [flag]: enabled }
      setStorageItem('LOGIC', 'featureFlags', updated)
      return updated
    })
  }, [])

  const isFeatureEnabled = useCallback((flag: FeatureFlag): boolean => {
    return featureFlags[flag] || false
  }, [featureFlags])

  const value: LogicContextState = {
    currentRoute: pathname || '/',
    navigationHistory,
    canGoBack: navigationHistory.length > 1,
    modals,
    activeModals: modals.filter(m => m.isOpen),
    notifications,
    loadingStates,
    isGlobalLoading: loadingStates.length > 0,
    isAdminMode,
    isTestMode,
    featureFlags,
    navigate,
    goBack,
    clearHistory,
    openModal,
    closeModal,
    closeAllModals,
    showNotification,
    dismissNotification,
    clearNotifications,
    startLoading,
    stopLoading,
    clearLoading,
    toggleAdminMode,
    toggleTestMode,
    setFeatureFlag,
    isFeatureEnabled,
  }

  return (
    <LogicContext.Provider value={value}>
      {children}
    </LogicContext.Provider>
  )
}
