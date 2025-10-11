/**
 * Zustand Store Test Utilities
 * Helpers for testing Zustand stores
 */

import { act } from '@testing-library/react'
import type { StoreApi, UseBoundStore } from 'zustand'

/**
 * Reset Zustand store to initial state
 * Calls the store's reset() method if available
 */
export function resetStore<T extends { reset?: () => void }>(
  useStore: UseBoundStore<StoreApi<T>>
) {
  act(() => {
    const state = useStore.getState()
    if (state.reset) {
      state.reset()
    }
  })
}

/**
 * Get current store state (non-reactive)
 * Useful for assertions without subscribing
 */
export function getStoreState<T>(useStore: UseBoundStore<StoreApi<T>>): T {
  return useStore.getState()
}

/**
 * Update store state directly (for testing only)
 * WARNING: Only use in tests to set up specific scenarios
 */
export function setStoreState<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  partialState: Partial<T>
) {
  act(() => {
    useStore.setState(partialState as any)
  })
}

/**
 * Wait for store state to match condition
 * Useful for async operations in stores
 */
export async function waitForStoreState<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  predicate: (state: T) => boolean,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe()
      reject(new Error(`Timeout waiting for store state after ${timeout}ms`))
    }, timeout)

    const unsubscribe = useStore.subscribe((state) => {
      if (predicate(state)) {
        clearTimeout(timeoutId)
        unsubscribe()
        resolve(state)
      }
    })

    // Check initial state
    const initialState = useStore.getState()
    if (predicate(initialState)) {
      clearTimeout(timeoutId)
      unsubscribe()
      resolve(initialState)
    }
  })
}

/**
 * Create a spy function for store actions
 * Useful for tracking action calls
 */
export function spyOnStoreAction<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  actionName: keyof T
): jest.SpyInstance {
  const originalAction = useStore.getState()[actionName] as any
  const spy = jest.fn((...args: any[]) => {
    return originalAction(...args)
  })

  act(() => {
    useStore.setState({
      [actionName]: spy,
    } as Partial<T> as any)
  })

  return spy
}
