// Domain Errors
// Custom error types for business logic violations

export abstract class DomainError extends Error {
  abstract readonly code: string
  
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// Course-related errors
export class CourseNotFoundError extends DomainError {
  readonly code = 'COURSE_NOT_FOUND'
  
  constructor(identifier: string) {
    super(`Course not found: ${identifier}`)
  }
}

export class CourseAlreadyExistsError extends DomainError {
  readonly code = 'COURSE_ALREADY_EXISTS'
  
  constructor(slug: string) {
    super(`Course with slug '${slug}' already exists`)
  }
}

export class CourseNotPublishedError extends DomainError {
  readonly code = 'COURSE_NOT_PUBLISHED'
  
  constructor(courseTitle: string) {
    super(`Course '${courseTitle}' is not published and cannot be enrolled`)
  }
}

// User-related errors
export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND'
  
  constructor(identifier: string) {
    super(`User not found: ${identifier}`)
  }
}

export class UserAlreadyExistsError extends DomainError {
  readonly code = 'USER_ALREADY_EXISTS'
  
  constructor(email: string) {
    super(`User with email '${email}' already exists`)
  }
}

export class UserNotVerifiedError extends DomainError {
  readonly code = 'USER_NOT_VERIFIED'
  
  constructor() {
    super('User email must be verified to perform this action')
  }
}

export class InsufficientPermissionsError extends DomainError {
  readonly code = 'INSUFFICIENT_PERMISSIONS'
  
  constructor(action: string, requiredRole: string) {
    super(`Insufficient permissions to ${action}. Required role: ${requiredRole}`)
  }
}

// Enrollment-related errors
export class AlreadyEnrolledError extends DomainError {
  readonly code = 'ALREADY_ENROLLED'
  
  constructor(courseTitle: string) {
    super(`User is already enrolled in course '${courseTitle}'`)
  }
}

export class EnrollmentNotFoundError extends DomainError {
  readonly code = 'ENROLLMENT_NOT_FOUND'
  
  constructor(userId: string, courseId: string) {
    super(`Enrollment not found for user ${userId} in course ${courseId}`)
  }
}

// Payment-related errors
export class PaymentProcessingError extends DomainError {
  readonly code = 'PAYMENT_PROCESSING_ERROR'
  
  constructor(reason: string) {
    super(`Payment processing failed: ${reason}`)
  }
}

export class PaymentVerificationError extends DomainError {
  readonly code = 'PAYMENT_VERIFICATION_ERROR'
  
  constructor(paymentId: string) {
    super(`Payment verification failed for payment ${paymentId}`)
  }
}

export class InsufficientFundsError extends DomainError {
  readonly code = 'INSUFFICIENT_FUNDS'
  
  constructor() {
    super('Insufficient funds to complete the payment')
  }
}

// Validation errors
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
  readonly field: string
  
  constructor(field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`)
    this.field = field
  }
}

// Infrastructure errors
export class ExternalServiceError extends DomainError {
  readonly code = 'EXTERNAL_SERVICE_ERROR'
  readonly service: string
  
  constructor(service: string, message: string) {
    super(`External service error from ${service}: ${message}`)
    this.service = service
  }
}

export class DatabaseError extends DomainError {
  readonly code = 'DATABASE_ERROR'
  
  constructor(operation: string, details?: string) {
    super(`Database error during ${operation}${details ? `: ${details}` : ''}`)
  }
}