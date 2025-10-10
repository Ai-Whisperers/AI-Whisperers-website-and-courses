// Domain Interface: PaymentService
// Port defining the contract for payment processing

import { Money } from '../value-objects/money'
import { UserId } from '../value-objects/user-id'
import { CourseId } from '../value-objects/course-id'

export interface PaymentRequest {
  userId: UserId
  courseId: CourseId
  amount: Money
  paymentMethod?: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  paymentId?: string
  error?: string
  redirectUrl?: string
}

export interface PaymentVerification {
  verified: boolean
  amount: Money
  transactionId: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  processedAt?: Date
}

export interface PaymentService {
  // Core payment operations
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  verifyPayment(paymentId: string): Promise<PaymentVerification>
  refundPayment(paymentId: string, reason?: string): Promise<PaymentResult>
  
  // Payment method management
  getSupportedMethods(): Promise<string[]>
  getPaymentUrl(request: PaymentRequest): Promise<string>
}