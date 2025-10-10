// Domain Interface: EmailService
// Port defining the contract for email notifications

import { User } from '../entities/user'
import { Course } from '../entities/course'

export interface EmailTemplate {
  to: string
  subject: string
  htmlContent?: string
  textContent?: string
  templateId?: string
  templateData?: Record<string, any>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface EmailService {
  // Core email operations
  sendEmail(template: EmailTemplate): Promise<EmailResult>
  sendBulkEmail(templates: EmailTemplate[]): Promise<EmailResult[]>
  
  // Course-related emails
  sendEnrollmentConfirmation(user: User, course: Course): Promise<EmailResult>
  sendCourseCompletion(user: User, course: Course): Promise<EmailResult>
  sendCourseReminder(user: User, course: Course): Promise<EmailResult>
  
  // Authentication emails
  sendEmailVerification(user: User, verificationUrl: string): Promise<EmailResult>
  sendPasswordReset(user: User, resetUrl: string): Promise<EmailResult>
  
  // Administrative emails
  sendWelcomeEmail(user: User): Promise<EmailResult>
  sendReceiptEmail(user: User, course: Course, amount: string): Promise<EmailResult>
}