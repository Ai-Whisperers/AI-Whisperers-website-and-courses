/**
 * Courses Zustand Store
 * PHASE 2: State Management Migration
 *
 * This store manages all course-related state including:
 * - Available courses
 * - User enrollments
 * - Selected course
 * - Loading and error states
 *
 * Uses Zustand with persistence and devtools middleware
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Import types from database package
type Course = {
  id: string
  title: string
  slug: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  price: number
  instructor: string
  imageUrl?: string | null
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

type Enrollment = {
  id: string
  userId: string
  courseId: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  progress: number
  enrolledAt: Date
  completedAt?: Date | null
}

interface CoursesState {
  // State
  courses: Course[]
  enrollments: Enrollment[]
  selectedCourseId: string | null
  isLoading: boolean
  error: string | null

  // Computed getters
  selectedCourse: () => Course | null
  enrolledCourses: () => Course[]
  isEnrolled: (courseId: string) => boolean
  getEnrollmentByCourseId: (courseId: string) => Enrollment | null
  featuredCourses: () => Course[]
  publishedCourses: () => Course[]

  // Actions
  setCourses: (courses: Course[]) => void
  setEnrollments: (enrollments: Enrollment[]) => void
  selectCourse: (courseId: string | null) => void
  addEnrollment: (enrollment: Enrollment) => void
  updateEnrollment: (enrollmentId: string, updates: Partial<Enrollment>) => void
  removeEnrollment: (enrollmentId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  courses: [],
  enrollments: [],
  selectedCourseId: null,
  isLoading: false,
  error: null,
}

export const useCoursesStore = create<CoursesState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Computed getters
        selectedCourse: () => {
          const state = get()
          return state.courses.find((c) => c.id === state.selectedCourseId) || null
        },

        enrolledCourses: () => {
          const state = get()
          const enrolledIds = state.enrollments
            .filter((e) => e.status === 'ACTIVE' || e.status === 'COMPLETED')
            .map((e) => e.courseId)
          return state.courses.filter((c) => enrolledIds.includes(c.id))
        },

        isEnrolled: (courseId: string) => {
          const state = get()
          return state.enrollments.some(
            (e) =>
              e.courseId === courseId &&
              (e.status === 'ACTIVE' || e.status === 'COMPLETED')
          )
        },

        getEnrollmentByCourseId: (courseId: string) => {
          const state = get()
          return (
            state.enrollments.find(
              (e) =>
                e.courseId === courseId &&
                (e.status === 'ACTIVE' || e.status === 'COMPLETED')
            ) || null
          )
        },

        featuredCourses: () => {
          const state = get()
          return state.courses.filter((c) => c.featured && c.published)
        },

        publishedCourses: () => {
          const state = get()
          return state.courses.filter((c) => c.published)
        },

        // Actions
        setCourses: (courses) => set({ courses }),

        setEnrollments: (enrollments) => set({ enrollments }),

        selectCourse: (courseId) => set({ selectedCourseId: courseId }),

        addEnrollment: (enrollment) =>
          set((state) => ({
            enrollments: [...state.enrollments, enrollment],
          })),

        updateEnrollment: (enrollmentId, updates) =>
          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.id === enrollmentId ? { ...e, ...updates } : e
            ),
          })),

        removeEnrollment: (enrollmentId) =>
          set((state) => ({
            enrollments: state.enrollments.filter((e) => e.id !== enrollmentId),
          })),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'courses-storage',
        // Only persist courses and enrollments, not UI state
        partialize: (state) => ({
          courses: state.courses,
          enrollments: state.enrollments,
        }),
      }
    ),
    { name: 'CoursesStore' }
  )
)

// Selector hooks for optimized re-renders
export const useSelectedCourse = () => useCoursesStore((s) => s.selectedCourse())
export const useEnrolledCourses = () => useCoursesStore((s) => s.enrolledCourses())
export const useCoursesLoading = () => useCoursesStore((s) => s.isLoading)
export const useCoursesError = () => useCoursesStore((s) => s.error)
export const useFeaturedCourses = () => useCoursesStore((s) => s.featuredCourses())
export const usePublishedCourses = () => useCoursesStore((s) => s.publishedCourses())
export const useIsEnrolled = (courseId: string) =>
  useCoursesStore((s) => s.isEnrolled(courseId))
