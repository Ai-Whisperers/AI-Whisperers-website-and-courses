/**
 * Centralized Mock Course Data
 * Single source of truth for all course data during development
 * TODO: Replace with real database calls in production
 */

import { Course, Difficulty } from '@/domain/entities/course'
import { CourseId } from '@/domain/value-objects/course-id'
import { Money } from '@/domain/value-objects/money'
import { Duration } from '@/domain/value-objects/duration'

// ============================================================================
// Domain Entities (Single Source of Truth)
// ============================================================================

export const MOCK_COURSES: Course[] = [
  new Course({
    id: new CourseId('course-1'),
    title: 'AI Foundations',
    description: 'Learn the fundamentals of artificial intelligence with hands-on projects.',
    slug: 'ai-foundations',
    price: new Money(29900, 'USD'),
    duration: new Duration(720, 'minutes'),
    difficulty: Difficulty.BEGINNER,
    published: true,
    featured: true,
    learningObjectives: [
      'Understand AI concepts',
      'Learn ML basics',
      'Build basic AI models',
      'Apply AI in real-world scenarios'
    ],
    prerequisites: ['Basic computer literacy', 'Basic programming knowledge'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  }),
  new Course({
    id: new CourseId('course-2'),
    title: 'Applied AI',
    description: 'Build practical AI applications using modern tools and APIs.',
    slug: 'applied-ai',
    price: new Money(59900, 'USD'),
    duration: new Duration(900, 'minutes'),
    difficulty: Difficulty.INTERMEDIATE,
    published: true,
    featured: true,
    learningObjectives: [
      'Build AI applications',
      'Use modern AI APIs',
      'Deploy AI solutions',
      'Integrate AI with existing systems'
    ],
    prerequisites: ['Completed AI Foundations', 'Python knowledge', 'Understanding of REST APIs'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  }),
]

// ============================================================================
// Plain Object Types for APIs and Client Components
// ============================================================================

export interface PlainCourse {
  id: string
  title: string
  description: string
  slug: string
  price: {
    amount: number
    currency: string
    formatted: string
  }
  duration: {
    minutes: number
    formatted: string
  }
  difficulty: string
  difficultyLevel: string
  published: boolean
  featured: boolean
  learningObjectives: string[]
  prerequisites: string[]
  canEnroll: boolean
  isFree: boolean
  isAdvanced: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlainCourseForClient {
  id: { value: string }
  title: string
  description: string
  slug: string
  price: {
    amount: number
    currency: string
    formatted: string
  }
  duration: {
    minutes: number
    formatted: string
  }
  difficulty: string
  difficultyLevel: string
  published: boolean
  featured: boolean
  learningObjectives: string[]
  prerequisites: string[]
}

export interface PlainCourseWithMethods {
  title: string
  description: string
  slug: string
  price: {
    amount: number
    formatted: string
  }
  duration: {
    formatted: string
    minutes: number
  }
  difficulty: string
  published: boolean
  featured: boolean
  learningObjectives: string[]
  prerequisites: string[]
  canEnroll: () => boolean
  getDifficultyLevel: () => string
  isFree: () => boolean
}

// ============================================================================
// Conversion Utilities
// ============================================================================

/**
 * Convert Course entity to plain object for API responses
 */
export function courseToPlainObject(course: Course): PlainCourse {
  return {
    id: course.id.value,
    title: course.title,
    description: course.description,
    slug: course.slug,
    price: {
      amount: course.price.amount,
      currency: course.price.currency,
      formatted: course.price.formatUSD(),
    },
    duration: {
      minutes: course.duration.minutes,
      formatted: course.duration.formatHumanReadable(),
    },
    difficulty: course.difficulty,
    difficultyLevel: course.getDifficultyLevel(),
    published: course.published,
    featured: course.featured,
    learningObjectives: course.learningObjectives,
    prerequisites: course.prerequisites,
    canEnroll: course.canEnroll(),
    isFree: course.isFree(),
    isAdvanced: course.isAdvanced(),
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  }
}

/**
 * Convert Course entity to plain object for client components (Next.js serialization)
 */
export function courseToClientObject(course: Course): PlainCourseForClient {
  return {
    id: { value: course.id.value },
    title: course.title,
    description: course.description,
    slug: course.slug,
    price: {
      amount: course.price.amount,
      currency: course.price.currency,
      formatted: course.price.formatUSD(),
    },
    duration: {
      minutes: course.duration.minutes,
      formatted: course.duration.formatHumanReadable(),
    },
    difficulty: course.difficulty,
    difficultyLevel: course.getDifficultyLevel(),
    published: course.published,
    featured: course.featured,
    learningObjectives: course.learningObjectives,
    prerequisites: course.prerequisites,
  }
}

/**
 * Convert Course entity to plain object with methods (for SSR pages)
 */
export function courseToPlainObjectWithMethods(course: Course): PlainCourseWithMethods {
  return {
    title: course.title,
    description: course.description,
    slug: course.slug,
    price: {
      amount: course.price.amount,
      formatted: course.price.formatUSD(),
    },
    duration: {
      formatted: course.duration.formatHumanReadable(),
      minutes: course.duration.minutes,
    },
    difficulty: course.difficulty,
    published: course.published,
    featured: course.featured,
    learningObjectives: course.learningObjectives,
    prerequisites: course.prerequisites,
    canEnroll: () => course.canEnroll(),
    getDifficultyLevel: () => course.getDifficultyLevel(),
    isFree: () => course.isFree(),
  }
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all courses with optional filtering
 */
export function getMockCourses(filters?: {
  published?: boolean
  featured?: boolean
  difficulty?: Difficulty
  limit?: number
  offset?: number
}): Course[] {
  let filtered = [...MOCK_COURSES]

  if (filters?.published !== undefined) {
    filtered = filtered.filter(c => c.published === filters.published)
  }

  if (filters?.featured !== undefined) {
    filtered = filtered.filter(c => c.featured === filters.featured)
  }

  if (filters?.difficulty) {
    filtered = filtered.filter(c => c.difficulty === filters.difficulty)
  }

  // Apply pagination
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset ?? 0
    const limit = filters.limit ?? filtered.length
    filtered = filtered.slice(offset, offset + limit)
  }

  return filtered
}

/**
 * Get course by slug
 */
export function getMockCourseBySlug(slug: string): Course | null {
  return MOCK_COURSES.find(c => c.slug === slug) ?? null
}

/**
 * Get course by ID
 */
export function getMockCourseById(id: string): Course | null {
  return MOCK_COURSES.find(c => c.id.value === id) ?? null
}

/**
 * Get all courses as plain objects for API
 */
export function getMockCoursesAsPlainObjects(filters?: {
  published?: boolean
  featured?: boolean
  difficulty?: Difficulty
  limit?: number
  offset?: number
}): PlainCourse[] {
  return getMockCourses(filters).map(courseToPlainObject)
}

/**
 * Get all courses as client objects (for Next.js Server Components)
 */
export function getMockCoursesAsClientObjects(filters?: {
  published?: boolean
  featured?: boolean
  difficulty?: Difficulty
}): PlainCourseForClient[] {
  return getMockCourses(filters).map(courseToClientObject)
}

/**
 * Get course stats
 */
export function getMockCourseStats() {
  return {
    total: MOCK_COURSES.length,
    published: MOCK_COURSES.filter(c => c.published).length,
    featured: MOCK_COURSES.filter(c => c.featured).length,
    byDifficulty: {
      beginner: MOCK_COURSES.filter(c => c.difficulty === Difficulty.BEGINNER).length,
      intermediate: MOCK_COURSES.filter(c => c.difficulty === Difficulty.INTERMEDIATE).length,
      advanced: MOCK_COURSES.filter(c => c.difficulty === Difficulty.ADVANCED).length,
      expert: MOCK_COURSES.filter(c => c.difficulty === Difficulty.EXPERT).length,
    },
  }
}
