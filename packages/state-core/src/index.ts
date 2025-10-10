/**
 * @aiwhisperers/state-core
 * Centralized state management for AI Whisperers platform
 *
 * PHASE 2: State Management Migration
 *
 * This package provides:
 * - Zustand stores for domain state (courses, UI, analytics)
 * - React Query configuration for server state
 * - Optimized selector hooks for performance
 * - DevTools integration for debugging
 */

// Re-export all stores and hooks
export * from '../courses/src'
export * from '../ui/src'
export * from '../analytics/src'
export * from '../query/src'
export * from '../hooks/src'
