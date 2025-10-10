/**
 * Course Domain Types
 * Shared between frontend and backend
 *
 * ✅ PHASE 2B: Frontend/Backend Separation
 */

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number // in minutes
  price: number
  instructor: string
  imageUrl?: string | null
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  progress: number // 0-100
  enrolledAt: Date
  completedAt?: Date | null
}

// DTOs (Data Transfer Objects)
export interface CreateCourseDto {
  title: string
  slug: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  price: number
  instructor: string
  imageUrl?: string
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  published?: boolean
  featured?: boolean
}

export interface EnrollCourseDto {
  courseId: string
}

// API Response Types
export interface CoursesResponse {
  courses: Course[]
  total: number
  page?: number
  limit?: number
}

export interface EnrollmentResponse {
  enrollment: Enrollment
  message: string
}
