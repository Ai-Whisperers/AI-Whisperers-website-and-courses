/**
 * useEnrollCourse Hook
 * PHASE 2: State Management Migration
 *
 * React Query mutation hook for enrolling in a course
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCoursesStore } from '../../courses/src/store'
import { queryKeys } from '../../query/src/client'

interface EnrollmentData {
  id: string
  userId: string
  courseId: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  progress: number
  enrolledAt: Date
  completedAt?: Date | null
}

interface EnrollResponse {
  enrollment: EnrollmentData
  message: string
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()
  const { addEnrollment } = useCoursesStore()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({
          error: 'Enrollment failed',
        }))
        throw new Error(error.error || error.message || 'Enrollment failed')
      }

      return res.json() as Promise<EnrollResponse>
    },
    onSuccess: (data) => {
      // Add enrollment to Zustand store
      addEnrollment(data.enrollment)

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.enrollments })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.dashboard() })
    },
  })
}
