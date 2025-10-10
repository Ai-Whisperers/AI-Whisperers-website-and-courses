/**
 * useEnrollments Hook
 * PHASE 2: State Management Migration
 *
 * React Query hook for fetching user enrollments that syncs with Zustand store
 */

import { useQuery } from '@tanstack/react-query'
import { useCoursesStore } from '../../courses/src/store'
import { queryKeys } from '../../query/src/client'

interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  progress: number
  enrolledAt: Date
  completedAt?: Date | null
}

interface EnrollmentsResponse {
  enrollments: Enrollment[]
}

export function useEnrollments() {
  const { setEnrollments, setLoading, setError } = useCoursesStore()

  return useQuery({
    queryKey: queryKeys.user.enrollments,
    queryFn: async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/user/courses/enrolled')

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch enrollments')
        }

        const data: EnrollmentsResponse = await res.json()

        // Sync with Zustand store
        setEnrollments(data.enrollments)

        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        setError(errorMessage)
        throw error
      } finally {
        setLoading(false)
      }
    },
  })
}
