// Custom Hook: useCourses
// Handles course data fetching and state management

'use client'

import { useState, useEffect } from 'react'
import { Course, Difficulty } from '@/domain/entities/course'

interface UseCoursesOptions {
  published?: boolean
  featured?: boolean
  difficulty?: Difficulty
}

interface UseCoursesReturn {
  courses: Course[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCourses(options: UseCoursesOptions = {}): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.published) params.set('published', 'true')
      if (options.featured) params.set('featured', 'true')
      if (options.difficulty) params.set('difficulty', options.difficulty)

      const response = await fetch(`/api/courses?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`)
      }

      const data = await response.json()
      setCourses(data.courses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [options.published, options.featured, options.difficulty])

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  }
}

// Specialized hooks for common use cases

export function usePublishedCourses(): UseCoursesReturn {
  return useCourses({ published: true })
}

export function useFeaturedCourses(): UseCoursesReturn {
  return useCourses({ featured: true })
}

export function useCoursesByDifficulty(difficulty: Difficulty): UseCoursesReturn {
  return useCourses({ difficulty, published: true })
}