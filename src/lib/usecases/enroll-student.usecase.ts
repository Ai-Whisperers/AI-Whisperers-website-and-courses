// Use Case: Enroll Student in Course
// Application layer orchestrating business logic for course enrollment

import { CourseRepository } from '../../domain/interfaces/course-repository'
import { UserRepository } from '../../domain/interfaces/user-repository'
import { PaymentService, PaymentRequest, PaymentResult } from '../../domain/interfaces/payment-service'
import { EmailService } from '../../domain/interfaces/email-service'
import { CourseId } from '../../domain/value-objects/course-id'
import { UserId } from '../../domain/value-objects/user-id'
import { Money } from '../../domain/value-objects/money'
import {
  CourseNotFoundError,
  UserNotFoundError,
  CourseNotPublishedError,
  UserNotVerifiedError,
  AlreadyEnrolledError,
  PaymentProcessingError
} from '../../domain/errors/domain-errors'

export interface EnrollStudentRequest {
  userId: string
  courseId: string
  paymentMethod?: string
}

export interface EnrollStudentResult {
  success: boolean
  enrollmentId?: string
  paymentId?: string
  error?: string
  redirectUrl?: string
}

export class EnrollStudentUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: UserRepository,
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService
  ) {}

  async execute(request: EnrollStudentRequest): Promise<EnrollStudentResult> {
    try {
      // 1. Validate user exists and is verified
      const userId = UserId.fromString(request.userId)
      const user = await this.userRepository.findById(userId)
      
      if (!user) {
        throw new UserNotFoundError(request.userId)
      }

      if (!user.canAccessCourse()) {
        throw new UserNotVerifiedError()
      }

      // 2. Validate course exists and is available
      const courseId = CourseId.fromString(request.courseId)
      const course = await this.courseRepository.findById(courseId)
      
      if (!course) {
        throw new CourseNotFoundError(request.courseId)
      }

      if (!course.canEnroll()) {
        throw new CourseNotPublishedError(course.title)
      }

      // 3. Check if user is already enrolled
      // TODO: Implement enrollment check once enrollment repository is created

      // 4. Process payment if course is not free
      let paymentResult: PaymentResult | undefined
      
      if (!course.isFree()) {
        const paymentRequest: PaymentRequest = {
          userId,
          courseId,
          amount: course.price,
          paymentMethod: request.paymentMethod
        }

        paymentResult = await this.paymentService.processPayment(paymentRequest)
        
        if (!paymentResult.success) {
          throw new PaymentProcessingError(paymentResult.error || 'Payment failed')
        }
      }

      // 5. Create enrollment record
      // TODO: Implement enrollment creation once enrollment repository is created
      const enrollmentId = crypto.randomUUID()

      // 6. Send confirmation email
      try {
        await this.emailService.sendEnrollmentConfirmation(user, course)
      } catch (emailError) {
        // Log email error but don't fail the enrollment
        console.error('Failed to send enrollment confirmation email:', emailError)
      }

      // 7. Return success result
      return {
        success: true,
        enrollmentId,
        paymentId: paymentResult?.paymentId,
        redirectUrl: paymentResult?.redirectUrl
      }

    } catch (error) {
      console.error('Enrollment failed:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}