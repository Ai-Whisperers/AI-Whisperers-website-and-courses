/**
 * useCourses Hook
 * PHASE 2: State Management Migration
 *
 * React Query hook for fetching courses that syncs with Zustand store
 */

import { useQuery } from '@tanstack/react-query'
import { useCoursesStore } from '../../courses/src/store'
import { queryKeys } from '../../query/src/client'

interface Course {
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

interface CoursesResponse {
  courses: Course[]
  total: number
}

export function useCourses() {
  const { setCourses, setLoading, setError } = useCoursesStore()

  return useQuery({
    queryKey: queryKeys.courses.lists(),
    queryFn: async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/courses')

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch courses')
        }

        const data: CoursesResponse = await res.json()

        // Sync with Zustand store
        setCourses(data.courses)

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
