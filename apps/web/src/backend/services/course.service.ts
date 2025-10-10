/**
 * Course Service
 * Business logic for course operations
 *
 * ✅ PHASE 2B: Frontend/Backend Separation
 * ✅ Example service demonstrating the pattern
 *
 * This service:
 * - Contains business logic and rules
 * - Orchestrates between repositories
 * - Handles domain-specific operations
 * - Throws domain-specific errors
 */

import { prisma } from '@aiwhisperers/database'
import type {
  Course,
  Enrollment,
  CreateCourseDto,
  UpdateCourseDto,
} from '@/shared/types/course.types'

export class CourseService {
  /**
   * Get all published courses
   */
  static async getCourses(): Promise<Course[]> {
    return await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get course by slug
   */
  static async getCourseBySlug(slug: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { slug },
    })
  }

  /**
   * Get featured courses
   */
  static async getFeaturedCourses(): Promise<Course[]> {
    return await prisma.course.findMany({
      where: {
        published: true,
        featured: true,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Create a new course (Admin only)
   */
  static async createCourse(data: CreateCourseDto): Promise<Course> {
    // Business rule: Ensure slug is unique
    const existing = await prisma.course.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new Error('Course with this slug already exists')
    }

    return await prisma.course.create({
      data: {
        ...data,
        published: false, // Default to unpublished
        featured: false,
      },
    })
  }

  /**
   * Update course (Admin only)
   */
  static async updateCourse(
    id: string,
    data: UpdateCourseDto
  ): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete course (Admin only)
   */
  static async deleteCourse(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id },
    })
  }

  /**
   * Enroll user in course
   */
  static async enrollUser(
    userId: string,
    courseId: string
  ): Promise<Enrollment> {
    // Business rule: Check if user is already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
      },
    })

    if (existing) {
      throw new Error('User is already enrolled in this course')
    }

    // Business rule: Verify course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new Error('Course not found')
    }

    if (!course.published) {
      throw new Error('Course is not available for enrollment')
    }

    // Create enrollment
    return await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ACTIVE',
        progress: 0,
        enrolledAt: new Date(),
      },
    })
  }

  /**
   * Get user enrollments
   */
  static async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return await prisma.enrollment.findMany({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })
  }

  /**
   * Update enrollment progress
   */
  static async updateProgress(
    enrollmentId: string,
    progress: number
  ): Promise<Enrollment> {
    // Business rule: Progress must be between 0-100
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const updates: any = { progress }

    // Business rule: Auto-complete when progress reaches 100%
    if (progress === 100) {
      updates.status = 'COMPLETED'
      updates.completedAt = new Date()
    }

    return await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updates,
    })
  }
}
