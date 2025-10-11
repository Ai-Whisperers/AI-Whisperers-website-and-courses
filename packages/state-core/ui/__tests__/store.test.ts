/**
 * UI Store Tests
 * Testing Zustand store for UI preferences
 * Target: 70% coverage
 */

import { renderHook, act } from '@testing-library/react'
import {
  useUIStore,
  useTheme,
  useSidebarOpen,
  useSidebarCollapsed,
  useActiveModal,
  useNotificationsEnabled,
  useAnimationsEnabled,
  useCompactMode,
} from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

describe('useUIStore', () => {
  beforeEach(() => {
    resetStore(useUIStore)
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.theme).toBe('system')
      expect(result.current.sidebarOpen).toBe(true)
      expect(result.current.sidebarCollapsed).toBe(false)
      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
      expect(result.current.notificationsEnabled).toBe(true)
      expect(result.current.notificationPosition).toBe('top-right')
      expect(result.current.animationsEnabled).toBe(true)
      expect(result.current.compactMode).toBe(false)
    })
  })

  describe('theme actions', () => {
    it('should set theme', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
    })

    it('should toggle theme from light to dark', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setTheme('light')
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
    })

    it('should toggle theme from dark to light', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setTheme('dark')
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('light')
    })

    it('should handle all theme values', () => {
      const { result } = renderHook(() => useUIStore())

      const themes = ['light', 'dark', 'system'] as const
      themes.forEach((theme) => {
        act(() => {
          result.current.setTheme(theme)
        })
        expect(result.current.theme).toBe(theme)
      })
    })
  })

  describe('sidebar actions', () => {
    it('should set sidebar open state', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSidebarOpen(false)
      })

      expect(result.current.sidebarOpen).toBe(false)
    })

    it('should toggle sidebar', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(false)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(true)
    })

    it('should set sidebar collapsed state', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSidebarCollapsed(true)
      })

      expect(result.current.sidebarCollapsed).toBe(true)
    })

    it('should toggle sidebar collapsed', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.toggleSidebarCollapsed()
      })

      expect(result.current.sidebarCollapsed).toBe(true)

      act(() => {
        result.current.toggleSidebarCollapsed()
      })

      expect(result.current.sidebarCollapsed).toBe(false)
    })
  })

  describe('modal actions', () => {
    it('should open a modal', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('login')
      })

      expect(result.current.modalStack).toEqual(['login'])
      expect(result.current.activeModal).toBe('login')
    })

    it('should stack multiple modals', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal1')
        result.current.openModal('modal2')
        result.current.openModal('modal3')
      })

      expect(result.current.modalStack).toEqual(['modal1', 'modal2', 'modal3'])
      expect(result.current.activeModal).toBe('modal3')
    })

    it('should close the top modal', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal1')
        result.current.openModal('modal2')
        result.current.closeModal()
      })

      expect(result.current.modalStack).toEqual(['modal1'])
      expect(result.current.activeModal).toBe('modal1')
    })

    it('should set activeModal to null when closing last modal', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal1')
        result.current.closeModal()
      })

      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
    })

    it('should handle closeModal when no modals open', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.closeModal()
      })

      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
    })

    it('should close all modals', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal1')
        result.current.openModal('modal2')
        result.current.openModal('modal3')
        result.current.closeAllModals()
      })

      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
    })

    it('should handle closeAllModals when no modals open', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.closeAllModals()
      })

      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
    })
  })

  describe('notification actions', () => {
    it('should set notifications enabled', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setNotificationsEnabled(false)
      })

      expect(result.current.notificationsEnabled).toBe(false)
    })

    it('should set notification position', () => {
      const { result } = renderHook(() => useUIStore())

      const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const

      positions.forEach((position) => {
        act(() => {
          result.current.setNotificationPosition(position)
        })
        expect(result.current.notificationPosition).toBe(position)
      })
    })
  })

  describe('preference actions', () => {
    it('should set animations enabled', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setAnimationsEnabled(false)
      })

      expect(result.current.animationsEnabled).toBe(false)
    })

    it('should set compact mode', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setCompactMode(true)
      })

      expect(result.current.compactMode).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setTheme('dark')
        result.current.setSidebarOpen(false)
        result.current.setSidebarCollapsed(true)
        result.current.openModal('test-modal')
        result.current.setNotificationsEnabled(false)
        result.current.setNotificationPosition('bottom-left')
        result.current.setAnimationsEnabled(false)
        result.current.setCompactMode(true)
        result.current.reset()
      })

      expect(result.current.theme).toBe('system')
      expect(result.current.sidebarOpen).toBe(true)
      expect(result.current.sidebarCollapsed).toBe(false)
      expect(result.current.modalStack).toEqual([])
      expect(result.current.activeModal).toBeNull()
      expect(result.current.notificationsEnabled).toBe(true)
      expect(result.current.notificationPosition).toBe('top-right')
      expect(result.current.animationsEnabled).toBe(true)
      expect(result.current.compactMode).toBe(false)
    })
  })

  describe('selector hooks', () => {
    it('useTheme should return theme', () => {
      act(() => {
        useUIStore.getState().setTheme('dark')
      })

      const { result } = renderHook(() => useTheme())
      expect(result.current).toBe('dark')
    })

    it('useSidebarOpen should return sidebar open state', () => {
      act(() => {
        useUIStore.getState().setSidebarOpen(false)
      })

      const { result } = renderHook(() => useSidebarOpen())
      expect(result.current).toBe(false)
    })

    it('useSidebarCollapsed should return sidebar collapsed state', () => {
      act(() => {
        useUIStore.getState().setSidebarCollapsed(true)
      })

      const { result } = renderHook(() => useSidebarCollapsed())
      expect(result.current).toBe(true)
    })

    it('useActiveModal should return active modal', () => {
      act(() => {
        useUIStore.getState().openModal('test-modal')
      })

      const { result } = renderHook(() => useActiveModal())
      expect(result.current).toBe('test-modal')
    })

    it('useNotificationsEnabled should return notifications state', () => {
      act(() => {
        useUIStore.getState().setNotificationsEnabled(false)
      })

      const { result } = renderHook(() => useNotificationsEnabled())
      expect(result.current).toBe(false)
    })

    it('useAnimationsEnabled should return animations state', () => {
      act(() => {
        useUIStore.getState().setAnimationsEnabled(false)
      })

      const { result } = renderHook(() => useAnimationsEnabled())
      expect(result.current).toBe(false)
    })

    it('useCompactMode should return compact mode state', () => {
      act(() => {
        useUIStore.getState().setCompactMode(true)
      })

      const { result } = renderHook(() => useCompactMode())
      expect(result.current).toBe(true)
    })
  })

  describe('complex workflows', () => {
    it('should handle complete UI customization flow', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        // User customizes all settings
        result.current.setTheme('dark')
        result.current.setSidebarCollapsed(true)
        result.current.setNotificationPosition('bottom-right')
        result.current.setAnimationsEnabled(false)
        result.current.setCompactMode(true)
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.sidebarCollapsed).toBe(true)
      expect(result.current.notificationPosition).toBe('bottom-right')
      expect(result.current.animationsEnabled).toBe(false)
      expect(result.current.compactMode).toBe(true)
    })

    it('should handle modal workflow', () => {
      const { result } = renderHook(() => useUIStore())

      // Open multiple modals in sequence
      act(() => {
        result.current.openModal('login')
      })
      expect(result.current.activeModal).toBe('login')

      act(() => {
        result.current.openModal('signup')
      })
      expect(result.current.activeModal).toBe('signup')
      expect(result.current.modalStack).toHaveLength(2)

      // Close one modal
      act(() => {
        result.current.closeModal()
      })
      expect(result.current.activeModal).toBe('login')

      // Close remaining modal
      act(() => {
        result.current.closeModal()
      })
      expect(result.current.activeModal).toBeNull()
      expect(result.current.modalStack).toHaveLength(0)
    })
  })
})
