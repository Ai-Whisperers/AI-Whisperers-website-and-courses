/**
 * Analytics Store Tests
 * Testing Zustand store for analytics tracking
 * Target: 70% coverage
 */

import { renderHook, act } from '@testing-library/react'
import {
  useAnalyticsStore,
  useCurrentPage,
  useTotalPageViews,
  useTotalInteractions,
  useSessionDuration,
  useMostViewedPages,
  useCourseEngagement,
} from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

describe('useAnalyticsStore', () => {
  beforeEach(() => {
    resetStore(useAnalyticsStore)
    // Reset Date.now mock
    jest.spyOn(Date, 'now').mockRestore()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      expect(result.current.sessionId).toBeNull()
      expect(result.current.sessionStartTime).toBeNull()
      expect(result.current.pageViews).toEqual([])
      expect(result.current.currentPage).toBeNull()
      expect(result.current.interactions).toEqual([])
      expect(result.current.courseEngagements).toEqual({})
    })
  })

  describe('session actions', () => {
    it('should start a session', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const mockNow = 1609459200000 // 2021-01-01 00:00:00

      jest.spyOn(Date, 'now').mockReturnValue(mockNow)

      act(() => {
        result.current.startSession()
      })

      expect(result.current.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/)
      expect(result.current.sessionStartTime).toBe(mockNow)
    })

    it('should generate unique session IDs', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.startSession()
      })
      const firstId = result.current.sessionId

      act(() => {
        result.current.endSession()
        result.current.startSession()
      })
      const secondId = result.current.sessionId

      expect(firstId).not.toBe(secondId)
    })

    it('should end a session', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.startSession()
        result.current.endSession()
      })

      expect(result.current.sessionId).toBeNull()
      expect(result.current.sessionStartTime).toBeNull()
    })
  })

  describe('page view actions', () => {
    it('should track page view', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const mockNow = 1609459200000

      jest.spyOn(Date, 'now').mockReturnValue(mockNow)

      act(() => {
        result.current.trackPageView('/courses', '/')
      })

      expect(result.current.pageViews).toHaveLength(1)
      expect(result.current.pageViews[0]).toEqual({
        path: '/courses',
        timestamp: mockNow,
        referrer: '/',
      })
      expect(result.current.currentPage).toBe('/courses')
    })

    it('should track multiple page views', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackPageView('/', undefined)
        result.current.trackPageView('/courses', '/')
        result.current.trackPageView('/courses/intro-ai', '/courses')
      })

      expect(result.current.pageViews).toHaveLength(3)
      expect(result.current.currentPage).toBe('/courses/intro-ai')
    })

    it('should update page duration', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackPageView('/courses', '/')
        result.current.updatePageDuration('/courses', 45)
      })

      expect(result.current.pageViews[0].duration).toBe(45)
    })

    it('should only update duration for first matching page without duration', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackPageView('/courses', '/')
        result.current.trackPageView('/courses', '/about')
        result.current.updatePageDuration('/courses', 45)
      })

      expect(result.current.pageViews[0].duration).toBe(45)
      expect(result.current.pageViews[1].duration).toBeUndefined()
    })

    it('should set current page', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.setCurrentPage('/about')
      })

      expect(result.current.currentPage).toBe('/about')
    })
  })

  describe('interaction actions', () => {
    it('should track interaction', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const mockNow = 1609459200000

      jest.spyOn(Date, 'now').mockReturnValue(mockNow)

      act(() => {
        result.current.trackInteraction({
          type: 'click',
          element: 'enroll-button',
          data: { courseId: '1' },
        })
      })

      expect(result.current.interactions).toHaveLength(1)
      expect(result.current.interactions[0]).toEqual({
        type: 'click',
        element: 'enroll-button',
        data: { courseId: '1' },
        timestamp: mockNow,
      })
    })

    it('should track multiple interactions', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackInteraction({ type: 'click', element: 'button-1' })
        result.current.trackInteraction({ type: 'scroll' })
        result.current.trackInteraction({ type: 'form_submit', element: 'contact-form' })
      })

      expect(result.current.interactions).toHaveLength(3)
    })

    it('should track different interaction types', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      const types = ['click', 'scroll', 'form_submit', 'video_play', 'course_enroll'] as const

      act(() => {
        types.forEach((type) => {
          result.current.trackInteraction({ type })
        })
      })

      expect(result.current.interactions).toHaveLength(5)
      types.forEach((type, index) => {
        expect(result.current.interactions[index].type).toBe(type)
      })
    })
  })

  describe('course engagement actions', () => {
    it('should update course engagement', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const mockNow = 1609459200000

      jest.spyOn(Date, 'now').mockReturnValue(mockNow)

      act(() => {
        result.current.updateCourseEngagement('course-1', {
          courseId: 'course-1',
          lessonsViewed: 5,
          timeSpent: 300,
          completionRate: 50,
        })
      })

      expect(result.current.courseEngagements['course-1']).toEqual({
        courseId: 'course-1',
        lessonsViewed: 5,
        timeSpent: 300,
        completionRate: 50,
        lastAccessed: mockNow,
      })
    })

    it('should increment lessons viewed', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.incrementLessonsViewed('course-1')
        result.current.incrementLessonsViewed('course-1')
        result.current.incrementLessonsViewed('course-1')
      })

      expect(result.current.courseEngagements['course-1'].lessonsViewed).toBe(3)
    })

    it('should add course time', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.addCourseTime('course-1', 60)
        result.current.addCourseTime('course-1', 120)
        result.current.addCourseTime('course-1', 30)
      })

      expect(result.current.courseEngagements['course-1'].timeSpent).toBe(210)
    })

    it('should track multiple courses', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.incrementLessonsViewed('course-1')
        result.current.incrementLessonsViewed('course-2')
        result.current.addCourseTime('course-1', 100)
        result.current.addCourseTime('course-2', 200)
      })

      expect(result.current.courseEngagements['course-1'].lessonsViewed).toBe(1)
      expect(result.current.courseEngagements['course-1'].timeSpent).toBe(100)
      expect(result.current.courseEngagements['course-2'].lessonsViewed).toBe(1)
      expect(result.current.courseEngagements['course-2'].timeSpent).toBe(200)
    })

    it('should update lastAccessed when modifying engagement', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const mockNow1 = 1609459200000
      const mockNow2 = 1609459300000

      jest.spyOn(Date, 'now').mockReturnValue(mockNow1)

      act(() => {
        result.current.incrementLessonsViewed('course-1')
      })

      expect(result.current.courseEngagements['course-1'].lastAccessed).toBe(mockNow1)

      jest.spyOn(Date, 'now').mockReturnValue(mockNow2)

      act(() => {
        result.current.addCourseTime('course-1', 60)
      })

      expect(result.current.courseEngagements['course-1'].lastAccessed).toBe(mockNow2)
    })
  })

  describe('computed statistics', () => {
    it('totalPageViews should return count', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackPageView('/', undefined)
        result.current.trackPageView('/courses', '/')
        result.current.trackPageView('/about', '/')
      })

      expect(result.current.totalPageViews()).toBe(3)
    })

    it('totalInteractions should return count', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackInteraction({ type: 'click' })
        result.current.trackInteraction({ type: 'scroll' })
      })

      expect(result.current.totalInteractions()).toBe(2)
    })

    it('averageSessionDuration should return 0 if no session', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      expect(result.current.averageSessionDuration()).toBe(0)
    })

    it('averageSessionDuration should return duration in seconds', () => {
      const { result } = renderHook(() => useAnalyticsStore())
      const startTime = 1609459200000 // 2021-01-01 00:00:00
      const currentTime = 1609459260000 // 60 seconds later

      jest.spyOn(Date, 'now').mockReturnValue(startTime)

      act(() => {
        result.current.startSession()
      })

      jest.spyOn(Date, 'now').mockReturnValue(currentTime)

      expect(result.current.averageSessionDuration()).toBe(60)
    })

    it('mostViewedPages should return top pages', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.trackPageView('/courses', undefined)
        result.current.trackPageView('/courses', '/')
        result.current.trackPageView('/courses', '/about')
        result.current.trackPageView('/about', '/')
        result.current.trackPageView('/about', '/courses')
        result.current.trackPageView('/', undefined)
      })

      const mostViewed = result.current.mostViewedPages()

      expect(mostViewed).toHaveLength(3)
      expect(mostViewed[0]).toEqual({ path: '/courses', count: 3 })
      expect(mostViewed[1]).toEqual({ path: '/about', count: 2 })
      expect(mostViewed[2]).toEqual({ path: '/', count: 1 })
    })

    it('mostViewedPages should limit to top 10', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        // Track 15 different pages
        for (let i = 0; i < 15; i++) {
          result.current.trackPageView(`/page-${i}`, undefined)
        }
      })

      expect(result.current.mostViewedPages()).toHaveLength(10)
    })

    it('getCourseEngagement should return engagement', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.incrementLessonsViewed('course-1')
      })

      const engagement = result.current.getCourseEngagement('course-1')
      expect(engagement).not.toBeNull()
      expect(engagement?.courseId).toBe('course-1')
    })

    it('getCourseEngagement should return null if not found', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      expect(result.current.getCourseEngagement('nonexistent')).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        result.current.startSession()
        result.current.trackPageView('/courses', '/')
        result.current.trackInteraction({ type: 'click' })
        result.current.incrementLessonsViewed('course-1')
        result.current.reset()
      })

      expect(result.current.sessionId).toBeNull()
      expect(result.current.sessionStartTime).toBeNull()
      expect(result.current.pageViews).toEqual([])
      expect(result.current.currentPage).toBeNull()
      expect(result.current.interactions).toEqual([])
      expect(result.current.courseEngagements).toEqual({})
    })
  })

  describe('selector hooks', () => {
    it('useCurrentPage should return current page', () => {
      act(() => {
        useAnalyticsStore.getState().setCurrentPage('/courses')
      })

      const { result } = renderHook(() => useCurrentPage())
      expect(result.current).toBe('/courses')
    })

    it('useTotalPageViews should return count', () => {
      act(() => {
        useAnalyticsStore.getState().trackPageView('/', undefined)
        useAnalyticsStore.getState().trackPageView('/courses', '/')
      })

      const { result } = renderHook(() => useTotalPageViews())
      expect(result.current).toBe(2)
    })

    it('useTotalInteractions should return count', () => {
      act(() => {
        useAnalyticsStore.getState().trackInteraction({ type: 'click' })
        useAnalyticsStore.getState().trackInteraction({ type: 'scroll' })
      })

      const { result } = renderHook(() => useTotalInteractions())
      expect(result.current).toBe(2)
    })

    it('useSessionDuration should return duration', () => {
      const startTime = 1609459200000
      const currentTime = 1609459260000

      jest.spyOn(Date, 'now').mockReturnValue(startTime)

      act(() => {
        useAnalyticsStore.getState().startSession()
      })

      jest.spyOn(Date, 'now').mockReturnValue(currentTime)

      const { result } = renderHook(() => useSessionDuration())
      expect(result.current).toBe(60)
    })

    it('useMostViewedPages should return top pages', () => {
      act(() => {
        useAnalyticsStore.getState().trackPageView('/courses', undefined)
        useAnalyticsStore.getState().trackPageView('/courses', '/')
      })

      const { result } = renderHook(() => useMostViewedPages())
      expect(result.current[0]).toEqual({ path: '/courses', count: 2 })
    })

    it('useCourseEngagement should return engagement for course', () => {
      act(() => {
        useAnalyticsStore.getState().incrementLessonsViewed('course-1')
      })

      const { result } = renderHook(() => useCourseEngagement('course-1'))
      expect(result.current).not.toBeNull()
      expect(result.current?.courseId).toBe('course-1')
    })
  })

  describe('complex workflows', () => {
    it('should track complete user session', () => {
      const { result } = renderHook(() => useAnalyticsStore())

      act(() => {
        // Start session
        result.current.startSession()

        // Navigate pages
        result.current.trackPageView('/', undefined)
        result.current.trackPageView('/courses', '/')
        result.current.trackPageView('/courses/intro-ai', '/courses')

        // User interactions
        result.current.trackInteraction({ type: 'click', element: 'enroll-button' })
        result.current.trackInteraction({ type: 'course_enroll', data: { courseId: 'intro-ai' } })

        // Course engagement
        result.current.updateCourseEngagement('intro-ai', {
          courseId: 'intro-ai',
          lessonsViewed: 0,
          timeSpent: 0,
          completionRate: 0,
        })
        result.current.incrementLessonsViewed('intro-ai')
        result.current.addCourseTime('intro-ai', 300)
      })

      expect(result.current.sessionId).not.toBeNull()
      expect(result.current.pageViews).toHaveLength(3)
      expect(result.current.interactions).toHaveLength(2)
      expect(result.current.courseEngagements['intro-ai']).toBeDefined()
      expect(result.current.courseEngagements['intro-ai'].lessonsViewed).toBe(1)
      expect(result.current.courseEngagements['intro-ai'].timeSpent).toBe(300)
    })
  })
})
