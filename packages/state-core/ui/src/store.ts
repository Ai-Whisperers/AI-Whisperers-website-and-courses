/**
 * UI Preferences Zustand Store
 * PHASE 2: State Management Migration
 *
 * This store manages all UI-related state including:
 * - Theme preferences
 * - Sidebar state
 * - Modal states
 * - Notification preferences
 * - Layout preferences
 *
 * Uses Zustand with persistence and devtools middleware
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system'

  // Layout
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // Modals
  modalStack: string[]
  activeModal: string | null

  // Notifications
  notificationsEnabled: boolean
  notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  // Preferences
  animationsEnabled: boolean
  compactMode: boolean

  // Actions - Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void

  // Actions - Sidebar
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void

  // Actions - Modals
  openModal: (modalId: string) => void
  closeModal: () => void
  closeAllModals: () => void

  // Actions - Notifications
  setNotificationsEnabled: (enabled: boolean) => void
  setNotificationPosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void

  // Actions - Preferences
  setAnimationsEnabled: (enabled: boolean) => void
  setCompactMode: (enabled: boolean) => void

  // Reset
  reset: () => void
}

const initialState = {
  theme: 'system' as const,
  sidebarOpen: true,
  sidebarCollapsed: false,
  modalStack: [],
  activeModal: null,
  notificationsEnabled: true,
  notificationPosition: 'top-right' as const,
  animationsEnabled: true,
  compactMode: false,
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Theme actions
        setTheme: (theme) => set({ theme }),

        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),

        // Sidebar actions
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

        toggleSidebarCollapsed: () =>
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),

        // Modal actions
        openModal: (modalId) =>
          set((state) => ({
            modalStack: [...state.modalStack, modalId],
            activeModal: modalId,
          })),

        closeModal: () =>
          set((state) => {
            const newStack = state.modalStack.slice(0, -1)
            return {
              modalStack: newStack,
              activeModal: newStack[newStack.length - 1] || null,
            }
          }),

        closeAllModals: () =>
          set({
            modalStack: [],
            activeModal: null,
          }),

        // Notification actions
        setNotificationsEnabled: (notificationsEnabled) =>
          set({ notificationsEnabled }),

        setNotificationPosition: (notificationPosition) =>
          set({ notificationPosition }),

        // Preference actions
        setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),

        setCompactMode: (compactMode) => set({ compactMode }),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'ui-storage',
        // Persist all UI preferences
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          notificationsEnabled: state.notificationsEnabled,
          notificationPosition: state.notificationPosition,
          animationsEnabled: state.animationsEnabled,
          compactMode: state.compactMode,
        }),
      }
    ),
    { name: 'UIStore' }
  )
)

// Selector hooks for optimized re-renders
export const useTheme = () => useUIStore((s) => s.theme)
export const useSidebarOpen = () => useUIStore((s) => s.sidebarOpen)
export const useSidebarCollapsed = () => useUIStore((s) => s.sidebarCollapsed)
export const useActiveModal = () => useUIStore((s) => s.activeModal)
export const useNotificationsEnabled = () => useUIStore((s) => s.notificationsEnabled)
export const useAnimationsEnabled = () => useUIStore((s) => s.animationsEnabled)
export const useCompactMode = () => useUIStore((s) => s.compactMode)
