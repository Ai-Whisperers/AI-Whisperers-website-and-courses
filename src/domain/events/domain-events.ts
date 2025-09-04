// Domain Events
// Events that represent important business occurrences

import { UserId } from '../value-objects/user-id'
import { CourseId } from '../value-objects/course-id'

export interface DomainEvent {
  readonly eventId: string
  readonly eventType: string
  readonly aggregateId: string
  readonly occurredAt: Date
  readonly version: number
  readonly payload: Record<string, any>
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string
  readonly eventType: string
  readonly aggregateId: string
  readonly occurredAt: Date
  readonly version: number
  readonly payload: Record<string, any>

  constructor(
    eventType: string,
    aggregateId: string,
    payload: Record<string, any>,
    version: number = 1
  ) {
    this.eventId = crypto.randomUUID()
    this.eventType = eventType
    this.aggregateId = aggregateId
    this.occurredAt = new Date()
    this.version = version
    this.payload = payload
  }
}

// User-related events
export class UserRegisteredEvent extends BaseDomainEvent {
  constructor(userId: UserId, email: string, role: string) {
    super('UserRegistered', userId.value, {
      email,
      role,
    })
  }
}

export class UserEmailVerifiedEvent extends BaseDomainEvent {
  constructor(userId: UserId) {
    super('UserEmailVerified', userId.value, {})
  }
}

export class UserRoleChangedEvent extends BaseDomainEvent {
  constructor(userId: UserId, oldRole: string, newRole: string) {
    super('UserRoleChanged', userId.value, {
      oldRole,
      newRole,
    })
  }
}

// Course-related events
export class CourseCreatedEvent extends BaseDomainEvent {
  constructor(courseId: CourseId, title: string, slug: string, price: number) {
    super('CourseCreated', courseId.value, {
      title,
      slug,
      price,
    })
  }
}

export class CoursePublishedEvent extends BaseDomainEvent {
  constructor(courseId: CourseId, title: string) {
    super('CoursePublished', courseId.value, {
      title,
    })
  }
}

export class CourseUnpublishedEvent extends BaseDomainEvent {
  constructor(courseId: CourseId, title: string) {
    super('CourseUnpublished', courseId.value, {
      title,
    })
  }
}

export class CoursePriceUpdatedEvent extends BaseDomainEvent {
  constructor(courseId: CourseId, oldPrice: number, newPrice: number) {
    super('CoursePriceUpdated', courseId.value, {
      oldPrice,
      newPrice,
    })
  }
}

// Enrollment-related events
export class StudentEnrolledEvent extends BaseDomainEvent {
  constructor(
    userId: UserId, 
    courseId: CourseId, 
    courseTitle: string,
    enrollmentId: string,
    paymentAmount?: number
  ) {
    super('StudentEnrolled', enrollmentId, {
      userId: userId.value,
      courseId: courseId.value,
      courseTitle,
      paymentAmount,
    })
  }
}

export class CourseCompletedEvent extends BaseDomainEvent {
  constructor(
    userId: UserId,
    courseId: CourseId,
    courseTitle: string,
    completionDate: Date,
    finalScore?: number
  ) {
    super('CourseCompleted', `${userId.value}-${courseId.value}`, {
      userId: userId.value,
      courseId: courseId.value,
      courseTitle,
      completionDate,
      finalScore,
    })
  }
}

export class LessonCompletedEvent extends BaseDomainEvent {
  constructor(
    userId: UserId,
    courseId: CourseId,
    lessonId: string,
    lessonTitle: string,
    timeSpent: number
  ) {
    super('LessonCompleted', `${userId.value}-${lessonId}`, {
      userId: userId.value,
      courseId: courseId.value,
      lessonId,
      lessonTitle,
      timeSpent,
    })
  }
}

// Payment-related events
export class PaymentInitiatedEvent extends BaseDomainEvent {
  constructor(
    paymentId: string,
    userId: UserId,
    courseId: CourseId,
    amount: number,
    currency: string
  ) {
    super('PaymentInitiated', paymentId, {
      userId: userId.value,
      courseId: courseId.value,
      amount,
      currency,
    })
  }
}

export class PaymentCompletedEvent extends BaseDomainEvent {
  constructor(
    paymentId: string,
    userId: UserId,
    courseId: CourseId,
    amount: number,
    transactionId: string
  ) {
    super('PaymentCompleted', paymentId, {
      userId: userId.value,
      courseId: courseId.value,
      amount,
      transactionId,
    })
  }
}

export class PaymentFailedEvent extends BaseDomainEvent {
  constructor(
    paymentId: string,
    userId: UserId,
    courseId: CourseId,
    amount: number,
    reason: string
  ) {
    super('PaymentFailed', paymentId, {
      userId: userId.value,
      courseId: courseId.value,
      amount,
      reason,
    })
  }
}

// Certificate-related events
export class CertificateIssuedEvent extends BaseDomainEvent {
  constructor(
    certificateId: string,
    userId: UserId,
    courseId: CourseId,
    courseTitle: string,
    certificateNumber: string
  ) {
    super('CertificateIssued', certificateId, {
      userId: userId.value,
      courseId: courseId.value,
      courseTitle,
      certificateNumber,
    })
  }
}