// Domain Entity: User
// Core business entity representing a platform user

import { UserId } from '../value-objects/user-id'

export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export interface UserProps {
  id: UserId
  email: string
  name?: string
  role: UserRole
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export class User {
  private readonly _id: UserId
  private _email: string
  private _name?: string
  private _role: UserRole
  private _emailVerified?: Date
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: UserProps) {
    this.validateEmail(props.email)
    
    this._id = props.id
    this._email = props.email.toLowerCase().trim()
    this._name = props.name?.trim()
    this._role = props.role
    this._emailVerified = props.emailVerified
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // Getters
  get id(): UserId {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get name(): string | undefined {
    return this._name
  }

  get role(): UserRole {
    return this._role
  }

  get emailVerified(): Date | undefined {
    return this._emailVerified
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  // Business Logic Methods
  isStudent(): boolean {
    return this._role === UserRole.STUDENT
  }

  isInstructor(): boolean {
    return this._role === UserRole.INSTRUCTOR
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN
  }

  canAccessCourse(): boolean {
    return this.isEmailVerified()
  }

  canManageCourses(): boolean {
    return this.isInstructor() || this.isAdmin()
  }

  canAccessAdmin(): boolean {
    return this.isAdmin()
  }

  isEmailVerified(): boolean {
    return this._emailVerified !== undefined
  }

  getDisplayName(): string {
    return this._name || this._email.split('@')[0]
  }

  getRoleDisplayName(): string {
    switch (this._role) {
      case UserRole.STUDENT:
        return 'Student'
      case UserRole.INSTRUCTOR:
        return 'Instructor'
      case UserRole.ADMIN:
        return 'Administrator'
      default:
        return 'User'
    }
  }

  // Update Methods
  updateName(name: string): void {
    if (name && name.trim().length === 0) {
      this._name = undefined
    } else {
      this._name = name?.trim()
    }
    this.updateTimestamp()
  }

  updateEmail(email: string): void {
    this.validateEmail(email)
    this._email = email.toLowerCase().trim()
    // Reset email verification when email changes
    this._emailVerified = undefined
    this.updateTimestamp()
  }

  verifyEmail(): void {
    this._emailVerified = new Date()
    this.updateTimestamp()
  }

  promoteToInstructor(): void {
    if (this._role === UserRole.ADMIN) {
      throw new Error('Cannot change admin role')
    }
    this._role = UserRole.INSTRUCTOR
    this.updateTimestamp()
  }

  promoteToAdmin(): void {
    this._role = UserRole.ADMIN
    this.updateTimestamp()
  }

  demoteToStudent(): void {
    if (this._role === UserRole.ADMIN) {
      throw new Error('Cannot demote admin role')
    }
    this._role = UserRole.STUDENT
    this.updateTimestamp()
  }

  // Private Validation Methods
  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty')
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  // Equality
  equals(other: User): boolean {
    return this._id.equals(other._id)
  }
}