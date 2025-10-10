/**
 * React Query Client Configuration
 * PHASE 2: State Management Migration
 *
 * This module provides a pre-configured QueryClient for server state management.
 * Used across the application for data fetching, caching, and synchronization.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Global QueryClient instance
 *
 * Configuration:
 * - staleTime: 60s (data considered fresh for 1 minute)
 * - gcTime: 5 minutes (cached data kept for 5 minutes after last use)
 * - retry: 1 (retry failed requests once)
 * - refetchOnWindowFocus: false (don't auto-refetch on tab focus)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime in v4)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})

/**
 * Query Keys Factory
 *
 * Centralized query key management for type safety and consistency
 */
export const queryKeys = {
  // Courses
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.courses.lists(), { filters }] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    stats: () => [...queryKeys.courses.all, 'stats'] as const,
  },

  // Enrollments
  enrollments: {
    all: ['enrollments'] as const,
    lists: () => [...queryKeys.enrollments.all, 'list'] as const,
    list: (userId?: string) =>
      [...queryKeys.enrollments.lists(), { userId }] as const,
    details: () => [...queryKeys.enrollments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.enrollments.details(), id] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    dashboard: () => [...queryKeys.user.all, 'dashboard'] as const,
    progress: () => [...queryKeys.user.all, 'progress'] as const,
    achievements: () => [...queryKeys.user.all, 'achievements'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
  },
} as const
