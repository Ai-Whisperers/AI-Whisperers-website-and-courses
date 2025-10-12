# Hexagonal Architecture - Ports & Adapters Pattern

**Document Version:** 1.0.0
**Last Updated:** October 12, 2025
**Status:** Complete
**Related Docs:** [System Architecture](./01-system-architecture.md), [Domain Entities](./40-domain-entities.md), [Use Cases](./42-use-cases.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Hexagonal Architecture Principles](#hexagonal-architecture-principles)
3. [Domain Layer](#domain-layer)
4. [Ports (Interfaces)](#ports-interfaces)
5. [Adapters (Infrastructure)](#adapters-infrastructure)
6. [Application Layer](#application-layer)
7. [Dependency Flow](#dependency-flow)
8. [Testing Strategy](#testing-strategy)
9. [Benefits & Trade-offs](#benefits--trade-offs)
10. [Migration Guide](#migration-guide)

---

## Overview

The AI Whisperers platform implements **Hexagonal Architecture** (also known as Ports & Adapters pattern) to achieve a clean separation between business logic and infrastructure concerns.

### What is Hexagonal Architecture?

Hexagonal Architecture is a design pattern that:
- **Isolates** business logic from external concerns
- **Defines** clear boundaries using interfaces (ports)
- **Implements** external concerns through adapters
- **Enables** easy testing and technology swapping

### Visual Representation

```
                    ┌─────────────────────────────────┐
                    │     External World (UI/DB)      │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │        ADAPTERS                 │
                    │  (Infrastructure Layer)         │
                    │  - Prisma DB Adapter            │
                    │  - NextAuth Adapter             │
                    │  - API Route Handlers           │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │          PORTS                  │
                    │       (Interfaces)              │
                    │  - CourseRepository             │
                    │  - UserRepository               │
                    │  - PaymentService               │
                    └────────────┬────────────────────┘
                                 │
        ┌────────────────────────▼──────────────────────────┐
        │               HEXAGON (CORE)                      │
        │                                                   │
        │    ┌──────────────────────────────────────┐     │
        │    │         DOMAIN LAYER                 │     │
        │    │   - Entities (Course, User)          │     │
        │    │   - Value Objects (Money, CourseId)  │     │
        │    │   - Domain Errors                    │     │
        │    │   - Business Rules                   │     │
        │    └──────────────────────────────────────┘     │
        │                                                   │
        │    ┌──────────────────────────────────────┐     │
        │    │      APPLICATION LAYER               │     │
        │    │   - Use Cases                        │     │
        │    │   - Services                         │     │
        │    │   - DTOs                             │     │
        │    └──────────────────────────────────────┘     │
        │                                                   │
        └───────────────────────────────────────────────────┘
```

### Current Implementation Status

**✅ Fully Implemented:**
- Domain Entities (Course, User)
- Value Objects (CourseId, UserId, Money, Duration)
- Repository Interfaces (CourseRepository, UserRepository)
- Service Interfaces (PaymentService, EmailService)
- Domain Errors (12+ custom error types)
- Use Cases (EnrollStudentUseCase)
- Application Services (CourseService)

**🔶 Partially Implemented:**
- Infrastructure Adapters (Prisma client exists, formal adapters pending)
- Enrollment entity (planned)
- Achievement entity (planned)

---

## Hexagonal Architecture Principles

### Principle 1: Business Logic Independence

**Rule**: Domain logic MUST NOT depend on infrastructure

```typescript
// ✅ GOOD: Domain entity with no infrastructure dependencies
export class Course {
  private readonly _id: CourseId
  private _title: string
  private _price: Money

  // Pure business logic
  canEnroll(): boolean {
    return this._published
  }

  isFree(): boolean {
    return this._price.amount === 0
  }
}

// ❌ BAD: Domain entity depending on database
import { prisma } from '@/lib/db/prisma' // Don't do this!

export class Course {
  async save() {
    await prisma.course.create({ ... }) // Infrastructure leak!
  }
}
```

### Principle 2: Dependency Inversion

**Rule**: High-level modules define interfaces; low-level modules implement them

```typescript
// High-level module (Domain) defines the port
export interface CourseRepository {
  findById(id: CourseId): Promise<Course | null>
  save(course: Course): Promise<void>
}

// Low-level module (Infrastructure) implements the adapter
export class PrismaCourseRepository implements CourseRepository {
  async findById(id: CourseId): Promise<Course | null> {
    const data = await prisma.course.findUnique({
      where: { id: id.value }
    })
    return data ? this.toDomain(data) : null
  }
}
```

### Principle 3: Ports Define Contracts

**Rule**: Ports (interfaces) define what the application needs, not how to get it

```typescript
// Port: What the application needs
export interface PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  refundPayment(paymentId: string): Promise<void>
}

// Adapter: How to do it with Stripe
export class StripePaymentService implements PaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Stripe-specific implementation
  }
}

// Adapter: How to do it with PayPal (alternative)
export class PayPalPaymentService implements PaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // PayPal-specific implementation
  }
}
```

### Principle 4: Testability

**Rule**: Business logic can be tested without infrastructure

```typescript
// Test with mock repository
describe('EnrollStudentUseCase', () => {
  it('should enroll student in free course', async () => {
    // Mock repository (no real database needed)
    const mockCourseRepo: CourseRepository = {
      findById: jest.fn().mockResolvedValue(mockCourse),
      save: jest.fn()
    }

    const useCase = new EnrollStudentUseCase(mockCourseRepo, ...)
    const result = await useCase.execute({ userId, courseId })

    expect(result.success).toBe(true)
  })
})
```

---

## Domain Layer

The **Domain Layer** is the heart of the hexagon. It contains pure business logic with ZERO infrastructure dependencies.

### Directory Structure

```
apps/web/src/domain/
├── entities/              # Business entities
│   ├── course.ts         # Course entity (238 lines)
│   └── user.ts           # User entity (182 lines)
├── value-objects/        # Immutable value types
│   ├── course-id.ts      # CourseId value object
│   ├── user-id.ts        # UserId value object
│   ├── money.ts          # Money value object
│   └── duration.ts       # Duration value object
├── interfaces/           # Ports (contracts)
│   ├── course-repository.ts
│   ├── user-repository.ts
│   ├── payment-service.ts
│   └── email-service.ts
├── errors/               # Domain-specific errors
│   └── domain-errors.ts  # 12+ error types
└── events/               # Domain events (future)
    └── domain-events.ts
```

### Entities

Entities are objects with **identity** and **business logic**.

#### Course Entity

**File**: `apps/web/src/domain/entities/course.ts` (238 lines)

**Purpose**: Represents an educational course with business rules

**Key Characteristics**:
- Immutable ID (`CourseId`)
- Private fields with getters (encapsulation)
- Business logic methods
- Validation in constructor and setters
- No infrastructure dependencies

**Complete Implementation**:

```typescript
import { CourseId } from '../value-objects/course-id'
import { Money } from '../value-objects/money'
import { Duration } from '../value-objects/duration'

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface CourseProps {
  id: CourseId
  title: string
  description: string
  slug: string
  price: Money
  duration: Duration
  difficulty: Difficulty
  published: boolean
  featured?: boolean
  learningObjectives: string[]
  prerequisites: string[]
  createdAt: Date
  updatedAt: Date
}

export class Course {
  private readonly _id: CourseId
  private _title: string
  private _description: string
  private _slug: string
  private _price: Money
  private _duration: Duration
  private _difficulty: Difficulty
  private _published: boolean
  private _featured: boolean
  private _learningObjectives: string[]
  private _prerequisites: string[]
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: CourseProps) {
    this.validateTitle(props.title)
    this.validateSlug(props.slug)
    this.validateLearningObjectives(props.learningObjectives)

    this._id = props.id
    this._title = props.title
    this._description = props.description
    this._slug = props.slug
    this._price = props.price
    this._duration = props.duration
    this._difficulty = props.difficulty
    this._published = props.published
    this._featured = props.featured ?? false
    this._learningObjectives = [...props.learningObjectives]
    this._prerequisites = [...props.prerequisites]
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // Getters (read-only access to private fields)
  get id(): CourseId { return this._id }
  get title(): string { return this._title }
  get description(): string { return this._description }
  get slug(): string { return this._slug }
  get price(): Money { return this._price }
  get duration(): Duration { return this._duration }
  get difficulty(): Difficulty { return this._difficulty }
  get published(): boolean { return this._published }
  get featured(): boolean { return this._featured }
  get learningObjectives(): readonly string[] {
    return [...this._learningObjectives]
  }
  get prerequisites(): readonly string[] {
    return [...this._prerequisites]
  }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }

  // Business Logic Methods (PURE - no side effects)
  canEnroll(): boolean {
    return this._published
  }

  isFree(): boolean {
    return this._price.amount === 0
  }

  isAdvanced(): boolean {
    return this._difficulty === Difficulty.ADVANCED ||
           this._difficulty === Difficulty.EXPERT
  }

  getDifficultyLevel(): string {
    switch (this._difficulty) {
      case Difficulty.BEGINNER: return 'Beginner Friendly'
      case Difficulty.INTERMEDIATE: return 'Intermediate Level'
      case Difficulty.ADVANCED: return 'Advanced Level'
      case Difficulty.EXPERT: return 'Expert Level'
      default: return 'Unknown Level'
    }
  }

  // Update Methods (with validation and timestamp update)
  updateTitle(title: string): void {
    this.validateTitle(title)
    this._title = title
    this.updateTimestamp()
  }

  updateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error('Course description cannot be empty')
    }
    this._description = description.trim()
    this.updateTimestamp()
  }

  updatePrice(price: Money): void {
    this._price = price
    this.updateTimestamp()
  }

  publish(): void {
    this._published = true
    this.updateTimestamp()
  }

  unpublish(): void {
    this._published = false
    this.updateTimestamp()
  }

  setFeatured(featured: boolean): void {
    this._featured = featured
    this.updateTimestamp()
  }

  addLearningObjective(objective: string): void {
    if (!objective || objective.trim().length === 0) {
      throw new Error('Learning objective cannot be empty')
    }
    if (this._learningObjectives.includes(objective.trim())) {
      throw new Error('Learning objective already exists')
    }
    this._learningObjectives.push(objective.trim())
    this.updateTimestamp()
  }

  removeLearningObjective(objective: string): void {
    const index = this._learningObjectives.indexOf(objective)
    if (index === -1) {
      throw new Error('Learning objective not found')
    }
    this._learningObjectives.splice(index, 1)
    this.updateTimestamp()
  }

  // Private Validation Methods
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Course title cannot be empty')
    }
    if (title.length > 200) {
      throw new Error('Course title cannot exceed 200 characters')
    }
  }

  private validateSlug(slug: string): void {
    if (!slug || slug.trim().length === 0) {
      throw new Error('Course slug cannot be empty')
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error('Course slug must contain only lowercase letters, numbers, and hyphens')
    }
  }

  private validateLearningObjectives(objectives: string[]): void {
    if (!objectives || objectives.length === 0) {
      throw new Error('Course must have at least one learning objective')
    }
    if (objectives.length > 10) {
      throw new Error('Course cannot have more than 10 learning objectives')
    }
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  // Equality (based on ID)
  equals(other: Course): boolean {
    return this._id.equals(other._id)
  }
}
```

**Key Design Decisions**:
1. **Immutable ID**: `_id` is `readonly` - cannot be changed after creation
2. **Private Fields**: All fields are private with public getters
3. **Defensive Copying**: Arrays are copied in getters to prevent external modification
4. **Validation**: All inputs are validated in constructor and update methods
5. **Business Rules**: Methods like `canEnroll()`, `isFree()` encapsulate business logic
6. **No Infrastructure**: Zero dependencies on database, HTTP, or external services

#### User Entity

**File**: `apps/web/src/domain/entities/user.ts` (182 lines)

**Purpose**: Represents a platform user with roles and permissions

```typescript
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
  get id(): UserId { return this._id }
  get email(): string { return this._email }
  get name(): string | undefined { return this._name }
  get role(): UserRole { return this._role }
  get emailVerified(): Date | undefined { return this._emailVerified }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }

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
      case UserRole.STUDENT: return 'Student'
      case UserRole.INSTRUCTOR: return 'Instructor'
      case UserRole.ADMIN: return 'Administrator'
      default: return 'User'
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

  // Private Validation
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
```

**Business Rules Encapsulated**:
- Email validation
- Role hierarchy (admin > instructor > student)
- Email verification required for course access
- Role-based permissions

### Value Objects

Value Objects are **immutable types** defined by their attributes, not identity.

#### CourseId Value Object

**File**: `apps/web/src/domain/value-objects/course-id.ts` (29 lines)

```typescript
export class CourseId {
  private readonly _value: string

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CourseId cannot be empty')
    }
    this._value = value.trim()
  }

  get value(): string {
    return this._value
  }

  equals(other: CourseId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  static fromString(value: string): CourseId {
    return new CourseId(value)
  }
}
```

**Why Use Value Objects?**
- **Type Safety**: Can't accidentally pass `string` where `CourseId` is expected
- **Validation**: Validation happens once in constructor
- **Immutability**: Value cannot be changed after creation
- **Equality**: Proper equality comparison based on value

#### Money Value Object

**File**: `apps/web/src/domain/value-objects/money.ts` (65 lines)

```typescript
export class Money {
  private readonly _amount: number // Amount in cents
  private readonly _currency: string

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative')
    }
    if (!currency || currency.trim().length === 0) {
      throw new Error('Currency cannot be empty')
    }

    this._amount = Math.round(amount) // Ensure integer cents
    this._currency = currency.toUpperCase()
  }

  get amount(): number {
    return this._amount
  }

  get currency(): string {
    return this._currency
  }

  get dollars(): number {
    return this._amount / 100
  }

  equals(other: Money): boolean {
    return this._amount === other._amount &&
           this._currency === other._currency
  }

  // Domain Operations
  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error(
        `Cannot add different currencies: ${this._currency} and ${other._currency}`
      )
    }
    return new Money(this._amount + other._amount, this._currency)
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative')
    }
    return new Money(this._amount * factor, this._currency)
  }

  formatUSD(): string {
    return `$${(this._amount / 100).toFixed(2)}`
  }

  toString(): string {
    return `${this._amount / 100} ${this._currency}`
  }

  // Factory Methods
  static fromDollars(dollars: number, currency: string = 'USD'): Money {
    return new Money(Math.round(dollars * 100), currency)
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency)
  }
}
```

**Key Features**:
- Stores amount in cents (integer) to avoid floating-point errors
- Currency validation and normalization
- Mathematical operations that return new `Money` instances
- Prevents adding different currencies
- Factory methods for common use cases

### Domain Errors

**File**: `apps/web/src/domain/errors/domain-errors.ts` (146 lines)

**Purpose**: Custom error types for business rule violations

```typescript
export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    // Maintains proper stack trace
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

// Payment-related errors
export class PaymentProcessingError extends DomainError {
  readonly code = 'PAYMENT_PROCESSING_ERROR'

  constructor(reason: string) {
    super(`Payment processing failed: ${reason}`)
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
export class DatabaseError extends DomainError {
  readonly code = 'DATABASE_ERROR'

  constructor(operation: string, details?: string) {
    super(`Database error during ${operation}${details ? `: ${details}` : ''}`)
  }
}
```

**Benefits**:
- Type-safe error handling
- Consistent error codes for API responses
- Clear error messages for debugging
- Proper stack traces
- Extendable hierarchy

---

## Ports (Interfaces)

**Ports** are interfaces that define contracts between the domain and infrastructure.

### Repository Ports

#### CourseRepository Port

**File**: `apps/web/src/domain/interfaces/course-repository.ts` (24 lines)

```typescript
import { Course } from '../entities/course'
import { CourseId } from '../value-objects/course-id'

export interface CourseRepository {
  // Query methods
  findById(id: CourseId): Promise<Course | null>
  findBySlug(slug: string): Promise<Course | null>
  findAll(): Promise<Course[]>
  findPublished(): Promise<Course[]>
  findFeatured(): Promise<Course[]>
  findByDifficulty(difficulty: string): Promise<Course[]>

  // Command methods
  save(course: Course): Promise<void>
  delete(id: CourseId): Promise<void>

  // Utility methods
  existsBySlug(slug: string): Promise<boolean>
  count(): Promise<number>
  countPublished(): Promise<number>
}
```

**Key Characteristics**:
- Returns **domain entities**, not database models
- Uses **value objects** (CourseId) instead of primitives
- **Technology agnostic** - no mention of SQL, Prisma, etc.
- **Async operations** - allows for various implementations
- Organized by **CQRS pattern** (queries vs. commands)

#### UserRepository Port

**File**: `apps/web/src/domain/interfaces/user-repository.ts`

```typescript
import { User } from '../entities/user'
import { UserId } from '../value-objects/user-id'

export interface UserRepository {
  // Query methods
  findById(id: UserId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findByRole(role: string): Promise<User[]>

  // Command methods
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>

  // Utility methods
  existsByEmail(email: string): Promise<boolean>
  count(): Promise<number>
}
```

### Service Ports

#### PaymentService Port

**File**: `apps/web/src/domain/interfaces/payment-service.ts`

```typescript
import { UserId } from '../value-objects/user-id'
import { CourseId } from '../value-objects/course-id'
import { Money } from '../value-objects/money'

export interface PaymentRequest {
  userId: UserId
  courseId: CourseId
  amount: Money
  paymentMethod?: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string
  redirectUrl?: string
}

export interface PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  verifyPayment(paymentId: string): Promise<boolean>
  refundPayment(paymentId: string): Promise<void>
  getPaymentStatus(paymentId: string): Promise<string>
}
```

**Why Separate Interface?**
- Payment processing could use Stripe, PayPal, or any other provider
- Easy to switch implementations
- Easy to mock for testing
- Domain doesn't care about payment provider details

#### EmailService Port

**File**: `apps/web/src/domain/interfaces/email-service.ts`

```typescript
import { User } from '../entities/user'
import { Course } from '../entities/course'

export interface EmailService {
  sendEnrollmentConfirmation(user: User, course: Course): Promise<void>
  sendWelcomeEmail(user: User): Promise<void>
  sendPasswordReset(user: User, resetToken: string): Promise<void>
  sendCourseCompletionCertificate(user: User, course: Course): Promise<void>
}
```

---

## Adapters (Infrastructure)

**Adapters** are concrete implementations of ports that connect to external systems.

### Repository Adapters

#### Prisma Course Repository Adapter (Concept)

**Status**: Not yet implemented as separate class, but pattern is clear

**Future Implementation**:

```typescript
// apps/web/src/infrastructure/repositories/prisma-course-repository.ts
import { CourseRepository } from '../../domain/interfaces/course-repository'
import { Course, Difficulty } from '../../domain/entities/course'
import { CourseId } from '../../domain/value-objects/course-id'
import { Money } from '../../domain/value-objects/money'
import { Duration } from '../../domain/value-objects/duration'
import { prisma } from '@/lib/db/prisma'
import { Course as PrismaCourse } from '@prisma/client'

export class PrismaCourseRepository implements CourseRepository {

  async findById(id: CourseId): Promise<Course | null> {
    const data = await prisma.course.findUnique({
      where: { id: id.value }
    })

    return data ? this.toDomain(data) : null
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const data = await prisma.course.findUnique({
      where: { slug }
    })

    return data ? this.toDomain(data) : null
  }

  async findAll(): Promise<Course[]> {
    const data = await prisma.course.findMany()
    return data.map(this.toDomain)
  }

  async findPublished(): Promise<Course[]> {
    const data = await prisma.course.findMany({
      where: { published: true }
    })
    return data.map(this.toDomain)
  }

  async save(course: Course): Promise<void> {
    await prisma.course.upsert({
      where: { id: course.id.value },
      create: this.toPrisma(course),
      update: this.toPrisma(course)
    })
  }

  async delete(id: CourseId): Promise<void> {
    await prisma.course.delete({
      where: { id: id.value }
    })
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await prisma.course.count({
      where: { slug }
    })
    return count > 0
  }

  async count(): Promise<number> {
    return await prisma.course.count()
  }

  // Mapping: Prisma Model → Domain Entity
  private toDomain(data: PrismaCourse): Course {
    return new Course({
      id: CourseId.fromString(data.id),
      title: data.title,
      description: data.description,
      slug: data.slug,
      price: Money.fromDollars(data.price),
      duration: Duration.fromMinutes(data.duration),
      difficulty: data.difficulty as Difficulty,
      published: data.published,
      featured: data.featured,
      learningObjectives: data.learningObjectives as string[],
      prerequisites: data.prerequisites as string[],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  // Mapping: Domain Entity → Prisma Model
  private toPrisma(course: Course): any {
    return {
      id: course.id.value,
      title: course.title,
      description: course.description,
      slug: course.slug,
      price: course.price.dollars,
      duration: course.duration.minutes,
      difficulty: course.difficulty,
      published: course.published,
      featured: course.featured,
      learningObjectives: course.learningObjectives,
      prerequisites: course.prerequisites,
      updatedAt: new Date()
    }
  }
}
```

**Key Adapter Responsibilities**:
1. **Implements Port**: Fulfills `CourseRepository` contract
2. **Technology Binding**: Uses Prisma client for database access
3. **Mapping**: Converts between Prisma models and domain entities
4. **Error Handling**: Catches database errors and throws domain errors

### Service Adapters

#### Stripe Payment Adapter (Concept)

```typescript
// apps/web/src/infrastructure/services/stripe-payment-service.ts
import Stripe from 'stripe'
import { PaymentService, PaymentRequest, PaymentResult } from '../../domain/interfaces/payment-service'
import { PaymentProcessingError } from '../../domain/errors/domain-errors'

export class StripePaymentService implements PaymentService {
  private stripe: Stripe

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16'
    })
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: request.amount.amount, // Amount in cents
        currency: request.amount.currency.toLowerCase(),
        metadata: {
          userId: request.userId.value,
          courseId: request.courseId.value
        }
      })

      return {
        success: true,
        paymentId: paymentIntent.id,
        redirectUrl: paymentIntent.client_secret
          ? `https://checkout.stripe.com/pay/${paymentIntent.client_secret}`
          : undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      }
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId)
    return paymentIntent.status === 'succeeded'
  }

  async refundPayment(paymentId: string): Promise<void> {
    await this.stripe.refunds.create({
      payment_intent: paymentId
    })
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId)
    return paymentIntent.status
  }
}
```

---

## Application Layer

The **Application Layer** orchestrates domain entities and coordinates infrastructure through ports.

### Use Cases

Use cases represent **application-specific business workflows**.

#### EnrollStudentUseCase

**File**: `apps/web/src/lib/usecases/enroll-student.usecase.ts` (118 lines)

**Purpose**: Orchestrates the complete student enrollment workflow

```typescript
import { CourseRepository } from '../../domain/interfaces/course-repository'
import { UserRepository } from '../../domain/interfaces/user-repository'
import { PaymentService, PaymentRequest, PaymentResult } from '../../domain/interfaces/payment-service'
import { EmailService } from '../../domain/interfaces/email-service'
import { CourseId } from '../../domain/value-objects/course-id'
import { UserId } from '../../domain/value-objects/user-id'
import {
  CourseNotFoundError,
  UserNotFoundError,
  CourseNotPublishedError,
  UserNotVerifiedError,
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

      // 3. Process payment if course is not free
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

      // 4. Create enrollment record
      const enrollmentId = crypto.randomUUID()

      // 5. Send confirmation email
      try {
        await this.emailService.sendEnrollmentConfirmation(user, course)
      } catch (emailError) {
        // Log but don't fail the enrollment
        console.error('Failed to send enrollment confirmation email:', emailError)
      }

      // 6. Return success result
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
```

**Use Case Pattern**:
1. **Single Responsibility**: One use case = one workflow
2. **Dependency Injection**: Receives ports (interfaces) via constructor
3. **Orchestration**: Coordinates domain entities and infrastructure
4. **Error Handling**: Catches and translates errors
5. **Transaction Boundary**: Defines what happens in one transaction

### Application Services

Application services provide **reusable business operations**.

#### CourseService

**File**: `apps/web/src/lib/services/course.service.ts` (194 lines)

**Purpose**: Provides course-related business operations

```typescript
import { CourseRepository } from '../../domain/interfaces/course-repository'
import { Course, Difficulty } from '../../domain/entities/course'
import { CourseId } from '../../domain/value-objects/course-id'
import { Money } from '../../domain/value-objects/money'
import { Duration } from '../../domain/value-objects/duration'
import { CourseNotFoundError, CourseAlreadyExistsError } from '../../domain/errors/domain-errors'

export interface CreateCourseRequest {
  title: string
  description: string
  slug: string
  price: number
  duration: number
  difficulty: Difficulty
  learningObjectives: string[]
  prerequisites: string[]
}

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepository.findAll()
  }

  async getPublishedCourses(): Promise<Course[]> {
    return await this.courseRepository.findPublished()
  }

  async getCourseById(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      throw new CourseNotFoundError(id)
    }

    return course
  }

  async createCourse(request: CreateCourseRequest): Promise<Course> {
    // Check if slug already exists
    const slugExists = await this.courseRepository.existsBySlug(request.slug)
    if (slugExists) {
      throw new CourseAlreadyExistsError(request.slug)
    }

    // Create new course entity
    const course = new Course({
      id: CourseId.fromString(crypto.randomUUID()),
      title: request.title,
      description: request.description,
      slug: request.slug,
      price: Money.fromDollars(request.price),
      duration: Duration.fromMinutes(request.duration),
      difficulty: request.difficulty,
      published: false, // New courses start unpublished
      featured: false,
      learningObjectives: request.learningObjectives,
      prerequisites: request.prerequisites,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this.courseRepository.save(course)
    return course
  }

  async publishCourse(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      throw new CourseNotFoundError(id)
    }

    course.publish()
    await this.courseRepository.save(course)
    return course
  }

  async getCourseStats(): Promise<{
    totalCourses: number
    publishedCourses: number
    featuredCourses: number
  }> {
    const [totalCourses, publishedCourses, featuredCourses] = await Promise.all([
      this.courseRepository.count(),
      this.courseRepository.countPublished(),
      this.courseRepository.findFeatured().then(courses => courses.length)
    ])

    return { totalCourses, publishedCourses, featuredCourses }
  }
}
```

**Service vs. Use Case**:
- **Service**: Reusable operations (CRUD, queries)
- **Use Case**: Complete workflow (enrollment, checkout)
- **Service**: Can be used by multiple use cases
- **Use Case**: Typically called once per user action

---

## Dependency Flow

### Correct Dependency Direction

```
┌────────────────────────────────────────────────┐
│         INFRASTRUCTURE (Adapters)              │
│  - PrismaCourseRepository                      │
│  - StripePaymentService                        │
│  - API Route Handlers                          │
└───────────────┬────────────────────────────────┘
                │ implements
                ▼
┌────────────────────────────────────────────────┐
│            PORTS (Interfaces)                  │
│  - CourseRepository                            │
│  - PaymentService                              │
└───────────────┬────────────────────────────────┘
                │ depends on
                ▼
┌────────────────────────────────────────────────┐
│        DOMAIN (Core Business Logic)            │
│  - Course, User (entities)                     │
│  - Money, CourseId (value objects)             │
│  - Domain Errors                               │
└────────────────────────────────────────────────┘
```

### Dependency Injection Example

```typescript
// ❌ BAD: Direct dependency on infrastructure
export class EnrollStudentUseCase {
  async execute(request: EnrollStudentRequest) {
    // Hardcoded dependency - can't swap or test!
    const courseRepo = new PrismaCourseRepository()
    const course = await courseRepo.findById(...)
  }
}

// ✅ GOOD: Dependency injection via constructor
export class EnrollStudentUseCase {
  constructor(
    private readonly courseRepository: CourseRepository, // Interface!
    private readonly paymentService: PaymentService      // Interface!
  ) {}

  async execute(request: EnrollStudentRequest) {
    // Use injected dependency
    const course = await this.courseRepository.findById(...)
  }
}

// Usage in API route
const courseRepo = new PrismaCourseRepository()
const paymentService = new StripePaymentService(apiKey)
const useCase = new EnrollStudentUseCase(courseRepo, paymentService)

const result = await useCase.execute({ userId, courseId })
```

---

## Testing Strategy

### Testing the Hexagon

#### Unit Testing Domain Entities

```typescript
// No mocks needed - pure business logic!
describe('Course Entity', () => {
  it('should not allow enrollment in unpublished course', () => {
    const course = new Course({
      ...courseProps,
      published: false
    })

    expect(course.canEnroll()).toBe(false)
  })

  it('should identify free courses correctly', () => {
    const freeCourse = new Course({
      ...courseProps,
      price: Money.zero()
    })

    expect(freeCourse.isFree()).toBe(true)
  })

  it('should validate title length', () => {
    expect(() => {
      new Course({
        ...courseProps,
        title: 'a'.repeat(201) // Exceeds 200 char limit
      })
    }).toThrow('Course title cannot exceed 200 characters')
  })
})
```

#### Testing Use Cases with Mocks

```typescript
describe('EnrollStudentUseCase', () => {
  let useCase: EnrollStudentUseCase
  let mockCourseRepo: jest.Mocked<CourseRepository>
  let mockUserRepo: jest.Mocked<UserRepository>
  let mockPaymentService: jest.Mocked<PaymentService>
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    // Create mock implementations
    mockCourseRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      // ... other methods
    }

    mockUserRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      // ... other methods
    }

    mockPaymentService = {
      processPayment: jest.fn(),
      verifyPayment: jest.fn(),
      // ... other methods
    }

    mockEmailService = {
      sendEnrollmentConfirmation: jest.fn(),
      // ... other methods
    }

    // Inject mocks into use case
    useCase = new EnrollStudentUseCase(
      mockCourseRepo,
      mockUserRepo,
      mockPaymentService,
      mockEmailService
    )
  })

  it('should enroll student in free course successfully', async () => {
    // Arrange
    const mockUser = new User({ ...userProps, emailVerified: new Date() })
    const mockCourse = new Course({ ...courseProps, published: true, price: Money.zero() })

    mockUserRepo.findById.mockResolvedValue(mockUser)
    mockCourseRepo.findById.mockResolvedValue(mockCourse)

    // Act
    const result = await useCase.execute({
      userId: 'user-123',
      courseId: 'course-456'
    })

    // Assert
    expect(result.success).toBe(true)
    expect(result.enrollmentId).toBeDefined()
    expect(mockPaymentService.processPayment).not.toHaveBeenCalled() // Free course!
    expect(mockEmailService.sendEnrollmentConfirmation).toHaveBeenCalledWith(mockUser, mockCourse)
  })

  it('should fail enrollment if user email not verified', async () => {
    // Arrange
    const unverifiedUser = new User({ ...userProps, emailVerified: undefined })
    const mockCourse = new Course({ ...courseProps, published: true })

    mockUserRepo.findById.mockResolvedValue(unverifiedUser)
    mockCourseRepo.findById.mockResolvedValue(mockCourse)

    // Act
    const result = await useCase.execute({
      userId: 'user-123',
      courseId: 'course-456'
    })

    // Assert
    expect(result.success).toBe(false)
    expect(result.error).toContain('email must be verified')
  })

  it('should process payment for paid courses', async () => {
    // Arrange
    const mockUser = new User({ ...userProps, emailVerified: new Date() })
    const paidCourse = new Course({
      ...courseProps,
      published: true,
      price: Money.fromDollars(99)
    })

    mockUserRepo.findById.mockResolvedValue(mockUser)
    mockCourseRepo.findById.mockResolvedValue(paidCourse)
    mockPaymentService.processPayment.mockResolvedValue({
      success: true,
      paymentId: 'pay-123'
    })

    // Act
    const result = await useCase.execute({
      userId: 'user-123',
      courseId: 'course-456',
      paymentMethod: 'card'
    })

    // Assert
    expect(result.success).toBe(true)
    expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(UserId),
        courseId: expect.any(CourseId),
        amount: paidCourse.price
      })
    )
    expect(result.paymentId).toBe('pay-123')
  })
})
```

#### Integration Testing with Real Adapters

```typescript
describe('PrismaCourseRepository (Integration)', () => {
  let repository: PrismaCourseRepository

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase()
    repository = new PrismaCourseRepository()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  it('should save and retrieve course', async () => {
    // Arrange
    const course = new Course({
      id: CourseId.fromString('test-course-1'),
      title: 'Test Course',
      // ... other props
    })

    // Act
    await repository.save(course)
    const retrieved = await repository.findById(course.id)

    // Assert
    expect(retrieved).toBeDefined()
    expect(retrieved?.title).toBe('Test Course')
    expect(retrieved?.equals(course)).toBe(true)
  })
})
```

---

## Benefits & Trade-offs

### Benefits of Hexagonal Architecture

1. **Technology Independence**
   - Can swap databases (Prisma → TypeORM → Sequelize)
   - Can change frameworks (Next.js → Express → Fastify)
   - Business logic remains unchanged

2. **Testability**
   - Domain logic tested without infrastructure
   - Easy to mock adapters
   - Fast unit tests (no database needed)

3. **Maintainability**
   - Clear boundaries and responsibilities
   - Easy to understand codebase structure
   - Changes isolated to specific layers

4. **Flexibility**
   - Multiple adapters for same port (e.g., Stripe + PayPal)
   - Easy to add new features
   - Supports microservices migration

5. **Business Logic Protection**
   - Business rules centralized in domain
   - No framework lock-in
   - Long-term investment protection

### Trade-offs

1. **Initial Complexity**
   - More files and folders
   - Steeper learning curve
   - More boilerplate code

2. **Development Speed**
   - Slower for simple CRUD apps
   - More abstraction layers
   - Requires discipline

3. **Over-engineering Risk**
   - Can be overkill for simple apps
   - May introduce unnecessary complexity
   - Requires team buy-in

4. **Mapping Overhead**
   - Need mappers between layers
   - More code to maintain
   - Potential performance impact

### When to Use Hexagonal Architecture?

**✅ Good Fit**:
- Complex business logic
- Long-term projects
- Team of 3+ developers
- Microservices architecture
- High test coverage requirements
- Frequent technology changes

**❌ Poor Fit**:
- Simple CRUD apps
- Prototypes/MVPs
- Solo developer projects
- Tight deadlines
- No complex business rules

---

## Migration Guide

### Migrating Existing Code to Hexagonal Architecture

#### Step 1: Extract Domain Entities

```typescript
// Before: Database model with business logic
const course = await prisma.course.findUnique({ where: { id } })
if (!course.published) {
  throw new Error('Cannot enroll')
}

// After: Domain entity with business logic
const courseId = CourseId.fromString(id)
const course = await courseRepository.findById(courseId)
if (!course.canEnroll()) {
  throw new CourseNotPublishedError(course.title)
}
```

#### Step 2: Define Ports

```typescript
// Create interface for database operations
export interface CourseRepository {
  findById(id: CourseId): Promise<Course | null>
  save(course: Course): Promise<void>
}
```

#### Step 3: Create Adapters

```typescript
// Implement adapter for Prisma
export class PrismaCourseRepository implements CourseRepository {
  async findById(id: CourseId): Promise<Course | null> {
    const data = await prisma.course.findUnique({
      where: { id: id.value }
    })
    return data ? this.toDomain(data) : null
  }
}
```

#### Step 4: Refactor Services/Use Cases

```typescript
// Inject repository instead of using Prisma directly
export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  async getCourse(id: string): Promise<Course> {
    const courseId = CourseId.fromString(id)
    return await this.repository.findById(courseId)
  }
}
```

---

## Related Documentation

- **Next**: [Database Schema](./04-database-schema.md) - Prisma schema and relationships
- **Domain**: [Domain Entities](./40-domain-entities.md) - Complete entity documentation
- **Application**: [Use Cases](./42-use-cases.md) - Use case patterns and examples
- **Infrastructure**: [Infrastructure Adapters](./43-infrastructure-adapters.md) - Adapter implementations
- **System**: [System Architecture](./01-system-architecture.md) - Overall system design

---

*Last Updated: October 12, 2025 | Hexagonal Architecture Version: 1.0.0 (Phase 6 Complete)*
