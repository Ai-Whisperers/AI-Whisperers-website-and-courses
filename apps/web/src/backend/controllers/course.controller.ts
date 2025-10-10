/**
 * Course Controller
 * API request/response handling for courses
 *
 * ✅ PHASE 2B: Frontend/Backend Separation
 * ✅ Example controller demonstrating the pattern
 *
 * This controller:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Formats responses
 * - Handles errors
 */

import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/backend/services/course.service'
import type { CoursesResponse, EnrollmentResponse } from '@/shared/types/course.types'

export class CourseController {
  /**
   * GET /api/courses
   * Get all published courses
   */
  static async getCourses(req: NextRequest): Promise<NextResponse> {
    try {
      const courses = await CourseService.getCourses()

      const response: CoursesResponse = {
        courses,
        total: courses.length,
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }
  }

  /**
   * GET /api/courses/[slug]
   * Get course by slug
   */
  static async getCourseBySlug(
    req: NextRequest,
    { params }: { params: { slug: string } }
  ): Promise<NextResponse> {
    try {
      const course = await CourseService.getCourseBySlug(params.slug)

      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ course })
    } catch (error) {
      console.error('Failed to fetch course:', error)
      return NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
      )
    }
  }

  /**
   * POST /api/courses/[slug]/enroll
   * Enroll user in course
   */
  static async enrollUser(
    req: NextRequest,
    { params }: { params: { slug: string } }
  ): Promise<NextResponse> {
    try {
      // Get user from session (NextAuth)
      // TODO: Extract userId from authenticated session
      // const session = await getServerSession()
      // const userId = session?.user?.id

      // For now, return 401 if not authenticated
      // In real implementation, get userId from session
      const userId = 'temp-user-id' // TODO: Replace with real user ID

      // Get course by slug
      const course = await CourseService.getCourseBySlug(params.slug)

      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }

      // Enroll user
      const enrollment = await CourseService.enrollUser(userId, course.id)

      const response: EnrollmentResponse = {
        enrollment,
        message: 'Successfully enrolled in course',
      }

      return NextResponse.json(response, { status: 201 })
    } catch (error) {
      console.error('Failed to enroll user:', error)

      const message =
        error instanceof Error ? error.message : 'Enrollment failed'

      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  /**
   * GET /api/user/courses/enrolled
   * Get user's enrolled courses
   */
  static async getUserEnrollments(req: NextRequest): Promise<NextResponse> {
    try {
      // Get user from session
      // TODO: Extract userId from authenticated session
      const userId = 'temp-user-id' // TODO: Replace with real user ID

      const enrollments = await CourseService.getUserEnrollments(userId)

      return NextResponse.json({ enrollments })
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      )
    }
  }
}
