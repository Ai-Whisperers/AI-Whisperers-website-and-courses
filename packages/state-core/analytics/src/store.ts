/**
 * Analytics Zustand Store
 * PHASE 2: State Management Migration
 *
 * This store manages all analytics-related state including:
 * - Page views and visits
 * - User interactions
 * - Course engagement metrics
 * - Session tracking
 *
 * Uses Zustand with devtools middleware (no persistence for analytics)
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PageView {
  path: string
  timestamp: number
  referrer?: string
  duration?: number
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'form_submit' | 'video_play' | 'course_enroll'
  element?: string
  data?: Record<string, any>
  timestamp: number
}

interface CourseEngagement {
  courseId: string
  lessonsViewed: number
  timeSpent: number // in seconds
  lastAccessed: number
  completionRate: number
}

interface AnalyticsState {
  // Session
  sessionId: string | null
  sessionStartTime: number | null

  // Page views
  pageViews: PageView[]
  currentPage: string | null

  // Interactions
  interactions: UserInteraction[]

  // Course engagement
  courseEngagements: Record<string, CourseEngagement>

  // Statistics (computed)
  totalPageViews: () => number
  totalInteractions: () => number
  averageSessionDuration: () => number
  mostViewedPages: () => Array<{ path: string; count: number }>
  getCourseEngagement: (courseId: string) => CourseEngagement | null

  // Actions - Session
  startSession: () => void
  endSession: () => void

  // Actions - Page views
  trackPageView: (path: string, referrer?: string) => void
  updatePageDuration: (path: string, duration: number) => void
  setCurrentPage: (path: string | null) => void

  // Actions - Interactions
  trackInteraction: (interaction: Omit<UserInteraction, 'timestamp'>) => void

  // Actions - Course engagement
  updateCourseEngagement: (courseId: string, updates: Partial<CourseEngagement>) => void
  incrementLessonsViewed: (courseId: string) => void
  addCourseTime: (courseId: string, seconds: number) => void

  // Reset
  reset: () => void
}

const initialState = {
  sessionId: null,
  sessionStartTime: null,
  pageViews: [],
  currentPage: null,
  interactions: [],
  courseEngagements: {},
}

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Computed statistics
      totalPageViews: () => {
        const state = get()
        return state.pageViews.length
      },

      totalInteractions: () => {
        const state = get()
        return state.interactions.length
      },

      averageSessionDuration: () => {
        const state = get()
        if (!state.sessionStartTime) return 0
        return (Date.now() - state.sessionStartTime) / 1000 // in seconds
      },

      mostViewedPages: () => {
        const state = get()
        const pageCounts = state.pageViews.reduce(
          (acc, pv) => {
            acc[pv.path] = (acc[pv.path] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )
        return Object.entries(pageCounts)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      },

      getCourseEngagement: (courseId: string) => {
        const state = get()
        return state.courseEngagements[courseId] || null
      },

      // Session actions
      startSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        set({
          sessionId,
          sessionStartTime: Date.now(),
        })
      },

      endSession: () => {
        set({
          sessionId: null,
          sessionStartTime: null,
        })
      },

      // Page view actions
      trackPageView: (path, referrer) => {
        set((state) => ({
          pageViews: [
            ...state.pageViews,
            {
              path,
              timestamp: Date.now(),
              referrer,
            },
          ],
          currentPage: path,
        }))
      },

      updatePageDuration: (path, duration) => {
        set((state) => ({
          pageViews: state.pageViews.map((pv) =>
            pv.path === path && !pv.duration ? { ...pv, duration } : pv
          ),
        }))
      },

      setCurrentPage: (currentPage) => set({ currentPage }),

      // Interaction actions
      trackInteraction: (interaction) => {
        set((state) => ({
          interactions: [
            ...state.interactions,
            {
              ...interaction,
              timestamp: Date.now(),
            },
          ],
        }))
      },

      // Course engagement actions
      updateCourseEngagement: (courseId, updates) => {
        set((state) => ({
          courseEngagements: {
            ...state.courseEngagements,
            [courseId]: {
              ...state.courseEngagements[courseId],
              ...updates,
              lastAccessed: Date.now(),
            } as CourseEngagement,
          },
        }))
      },

      incrementLessonsViewed: (courseId) => {
        set((state) => {
          const current = state.courseEngagements[courseId]
          return {
            courseEngagements: {
              ...state.courseEngagements,
              [courseId]: {
                courseId,
                lessonsViewed: (current?.lessonsViewed || 0) + 1,
                timeSpent: current?.timeSpent || 0,
                lastAccessed: Date.now(),
                completionRate: current?.completionRate || 0,
              },
            },
          }
        })
      },

      addCourseTime: (courseId, seconds) => {
        set((state) => {
          const current = state.courseEngagements[courseId]
          return {
            courseEngagements: {
              ...state.courseEngagements,
              [courseId]: {
                courseId,
                lessonsViewed: current?.lessonsViewed || 0,
                timeSpent: (current?.timeSpent || 0) + seconds,
                lastAccessed: Date.now(),
                completionRate: current?.completionRate || 0,
              },
            },
          }
        })
      },

      // Reset
      reset: () => set(initialState),
    }),
    { name: 'AnalyticsStore' }
  )
)

// Selector hooks for optimized re-renders
export const useCurrentPage = () => useAnalyticsStore((s) => s.currentPage)
export const useTotalPageViews = () => useAnalyticsStore((s) => s.totalPageViews())
export const useTotalInteractions = () => useAnalyticsStore((s) => s.totalInteractions())
export const useSessionDuration = () => useAnalyticsStore((s) => s.averageSessionDuration())
export const useMostViewedPages = () => useAnalyticsStore((s) => s.mostViewedPages())
export const useCourseEngagement = (courseId: string) =>
  useAnalyticsStore((s) => s.getCourseEngagement(courseId))
