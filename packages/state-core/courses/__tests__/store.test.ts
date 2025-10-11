/**
 * Courses Store Tests
 * Testing Zustand store for course management
 * Target: 70% coverage
 */

import { renderHook, act } from '@testing-library/react'
import {
  useCoursesStore,
  useSelectedCourse,
  useEnrolledCourses,
  useCoursesLoading,
  useCoursesError,
  useFeaturedCourses,
  usePublishedCourses,
  useIsEnrolled,
} from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

// Mock course data
const mockCourse1 = {
  id: '1',
  title: 'Introduction to AI',
  slug: 'intro-ai',
  description: 'Learn AI basics',
  difficulty: 'BEGINNER' as const,
  duration: 600,
  price: 99.99,
  instructor: 'John Doe',
  imageUrl: '/courses/intro-ai.jpg',
  published: true,
  featured: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

const mockCourse2 = {
  id: '2',
  title: 'Advanced ML',
  slug: 'advanced-ml',
  description: 'Deep dive into ML',
  difficulty: 'ADVANCED' as const,
  duration: 1200,
  price: 149.99,
  instructor: 'Jane Smith',
  imageUrl: '/courses/advanced-ml.jpg',
  published: true,
  featured: false,
  createdAt: new Date('2025-01-02'),
  updatedAt: new Date('2025-01-02'),
}

const mockCourse3 = {
  id: '3',
  title: 'Draft Course',
  slug: 'draft-course',
  description: 'Not published yet',
  difficulty: 'INTERMEDIATE' as const,
  duration: 900,
  price: 119.99,
  instructor: 'Bob Wilson',
  imageUrl: null,
  published: false,
  featured: true, // Featured but not published
  createdAt: new Date('2025-01-03'),
  updatedAt: new Date('2025-01-03'),
}

const mockEnrollment1 = {
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: '1',
  status: 'ACTIVE' as const,
  progress: 25,
  enrolledAt: new Date('2025-01-10'),
  completedAt: null,
}

const mockEnrollment2 = {
  id: 'enrollment-2',
  userId: 'user-1',
  courseId: '2',
  status: 'COMPLETED' as const,
  progress: 100,
  enrolledAt: new Date('2025-01-05'),
  completedAt: new Date('2025-01-15'),
}

const mockEnrollment3 = {
  id: 'enrollment-3',
  userId: 'user-1',
  courseId: '3',
  status: 'CANCELLED' as const,
  progress: 10,
  enrolledAt: new Date('2025-01-12'),
  completedAt: null,
}

describe('useCoursesStore', () => {
  beforeEach(() => {
    resetStore(useCoursesStore)
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCoursesStore())

      expect(result.current.courses).toEqual([])
      expect(result.current.enrollments).toEqual([])
      expect(result.current.selectedCourseId).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('setCourses', () => {
    it('should set courses', () => {
      const { result } = renderHook(() => useCoursesStore())
      const courses = [mockCourse1, mockCourse2]

      act(() => {
        result.current.setCourses(courses)
      })

      expect(result.current.courses).toEqual(courses)
    })

    it('should replace existing courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.setCourses([mockCourse2])
      })

      expect(result.current.courses).toEqual([mockCourse2])
      expect(result.current.courses).toHaveLength(1)
    })
  })

  describe('setEnrollments', () => {
    it('should set enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())
      const enrollments = [mockEnrollment1, mockEnrollment2]

      act(() => {
        result.current.setEnrollments(enrollments)
      })

      expect(result.current.enrollments).toEqual(enrollments)
    })
  })

  describe('selectCourse', () => {
    it('should select a course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.selectCourse('course-1')
      })

      expect(result.current.selectedCourseId).toBe('course-1')
    })

    it('should allow deselecting a course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.selectCourse('course-1')
        result.current.selectCourse(null)
      })

      expect(result.current.selectedCourseId).toBeNull()
    })
  })

  describe('addEnrollment', () => {
    it('should add enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
      })

      expect(result.current.enrollments).toContainEqual(mockEnrollment1)
      expect(result.current.enrollments).toHaveLength(1)
    })

    it('should add multiple enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.addEnrollment(mockEnrollment2)
      })

      expect(result.current.enrollments).toHaveLength(2)
      expect(result.current.enrollments).toContainEqual(mockEnrollment1)
      expect(result.current.enrollments).toContainEqual(mockEnrollment2)
    })
  })

  describe('updateEnrollment', () => {
    it('should update enrollment progress', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('enrollment-1', { progress: 50 })
      })

      const updated = result.current.enrollments.find(
        (e) => e.id === 'enrollment-1'
      )
      expect(updated?.progress).toBe(50)
    })

    it('should update enrollment status', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('enrollment-1', {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
        })
      })

      const updated = result.current.enrollments.find(
        (e) => e.id === 'enrollment-1'
      )
      expect(updated?.status).toBe('COMPLETED')
      expect(updated?.progress).toBe(100)
      expect(updated?.completedAt).toBeInstanceOf(Date)
    })

    it('should not update non-existent enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('nonexistent', { progress: 50 })
      })

      expect(result.current.enrollments).toHaveLength(1)
      expect(result.current.enrollments[0].progress).toBe(25) // Unchanged
    })
  })

  describe('removeEnrollment', () => {
    it('should remove enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.addEnrollment(mockEnrollment2)
        result.current.removeEnrollment('enrollment-1')
      })

      expect(result.current.enrollments).toHaveLength(1)
      expect(result.current.enrollments).not.toContainEqual(mockEnrollment1)
      expect(result.current.enrollments).toContainEqual(mockEnrollment2)
    })

    it('should do nothing if enrollment does not exist', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.removeEnrollment('nonexistent')
      })

      expect(result.current.enrollments).toHaveLength(1)
    })
  })

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setError('Failed to load courses')
      })

      expect(result.current.error).toBe('Failed to load courses')
    })

    it('should clear error', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setError('Error')
        result.current.setError(null)
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('selectedCourse computed', () => {
    it('should return selected course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2])
        result.current.selectCourse('1')
      })

      const selected = result.current.selectedCourse()
      expect(selected).toEqual(mockCourse1)
    })

    it('should return null if no course selected', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
      })

      expect(result.current.selectedCourse()).toBeNull()
    })

    it('should return null if selected course does not exist', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.selectCourse('nonexistent')
      })

      expect(result.current.selectedCourse()).toBeNull()
    })
  })

  describe('enrolledCourses computed', () => {
    it('should return courses user is enrolled in (ACTIVE)', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2, mockCourse3])
        result.current.setEnrollments([mockEnrollment1, mockEnrollment3])
      })

      const enrolled = result.current.enrolledCourses()
      expect(enrolled).toHaveLength(1)
      expect(enrolled[0].id).toBe('1')
    })

    it('should include completed courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2])
        result.current.setEnrollments([mockEnrollment1, mockEnrollment2])
      })

      const enrolled = result.current.enrolledCourses()
      expect(enrolled).toHaveLength(2)
    })

    it('should exclude cancelled enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2, mockCourse3])
        result.current.setEnrollments([
          mockEnrollment1,
          mockEnrollment2,
          mockEnrollment3,
        ])
      })

      const enrolled = result.current.enrolledCourses()
      expect(enrolled).toHaveLength(2)
      expect(enrolled.some((c) => c.id === '3')).toBe(false)
    })

    it('should return empty array if no enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2])
      })

      expect(result.current.enrolledCourses()).toEqual([])
    })
  })

  describe('isEnrolled computed', () => {
    it('should return true if user is enrolled (ACTIVE)', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1])
      })

      expect(result.current.isEnrolled('1')).toBe(true)
    })

    it('should return true if course is completed', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment2])
      })

      expect(result.current.isEnrolled('2')).toBe(true)
    })

    it('should return false if enrollment is cancelled', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment3])
      })

      expect(result.current.isEnrolled('3')).toBe(false)
    })

    it('should return false if user is not enrolled', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1])
      })

      expect(result.current.isEnrolled('nonexistent')).toBe(false)
    })
  })

  describe('getEnrollmentByCourseId computed', () => {
    it('should return enrollment for course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1, mockEnrollment2])
      })

      const enrollment = result.current.getEnrollmentByCourseId('1')
      expect(enrollment).toEqual(mockEnrollment1)
    })

    it('should return null if no enrollment found', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1])
      })

      expect(result.current.getEnrollmentByCourseId('nonexistent')).toBeNull()
    })

    it('should not return cancelled enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment3])
      })

      expect(result.current.getEnrollmentByCourseId('3')).toBeNull()
    })
  })

  describe('featuredCourses computed', () => {
    it('should return published and featured courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2, mockCourse3])
      })

      const featured = result.current.featuredCourses()
      expect(featured).toHaveLength(1)
      expect(featured[0].id).toBe('1')
    })

    it('should exclude unpublished courses even if featured', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse3]) // Featured but not published
      })

      expect(result.current.featuredCourses()).toEqual([])
    })

    it('should return empty array if no featured courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse2]) // Not featured
      })

      expect(result.current.featuredCourses()).toEqual([])
    })
  })

  describe('publishedCourses computed', () => {
    it('should return only published courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1, mockCourse2, mockCourse3])
      })

      const published = result.current.publishedCourses()
      expect(published).toHaveLength(2)
      expect(published.some((c) => c.id === '3')).toBe(false)
    })

    it('should return empty array if no published courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse3]) // Not published
      })

      expect(result.current.publishedCourses()).toEqual([])
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.setEnrollments([mockEnrollment1])
        result.current.selectCourse('1')
        result.current.setLoading(true)
        result.current.setError('Test error')
        result.current.reset()
      })

      expect(result.current.courses).toEqual([])
      expect(result.current.enrollments).toEqual([])
      expect(result.current.selectedCourseId).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('selector hooks', () => {
    it('useSelectedCourse should return selected course', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1, mockCourse2])
        useCoursesStore.getState().selectCourse('1')
      })

      const { result } = renderHook(() => useSelectedCourse())
      expect(result.current).toEqual(mockCourse1)
    })

    it('useEnrolledCourses should return enrolled courses', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1, mockCourse2])
        useCoursesStore.getState().setEnrollments([mockEnrollment1])
      })

      const { result } = renderHook(() => useEnrolledCourses())
      expect(result.current).toHaveLength(1)
      expect(result.current[0].id).toBe('1')
    })

    it('useCoursesLoading should return loading state', () => {
      act(() => {
        useCoursesStore.getState().setLoading(true)
      })

      const { result } = renderHook(() => useCoursesLoading())
      expect(result.current).toBe(true)
    })

    it('useCoursesError should return error state', () => {
      act(() => {
        useCoursesStore.getState().setError('Test error')
      })

      const { result } = renderHook(() => useCoursesError())
      expect(result.current).toBe('Test error')
    })

    it('useFeaturedCourses should return featured courses', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1, mockCourse2])
      })

      const { result } = renderHook(() => useFeaturedCourses())
      expect(result.current).toHaveLength(1)
    })

    it('usePublishedCourses should return published courses', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1, mockCourse2, mockCourse3])
      })

      const { result } = renderHook(() => usePublishedCourses())
      expect(result.current).toHaveLength(2)
    })

    it('useIsEnrolled should return enrollment status', () => {
      act(() => {
        useCoursesStore.getState().setEnrollments([mockEnrollment1])
      })

      const { result } = renderHook(() => useIsEnrolled('1'))
      expect(result.current).toBe(true)
    })
  })
})
