# AI Whisperers - Architecture Documentation

## 🏗️ Architectural Principles

The AI Whisperers platform implements a **Hexagonal Architecture** (Ports and Adapters) for the backend combined with **Clean Architecture** principles for the frontend. This architectural approach ensures maintainability, testability, and scalability.

### Core Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Single Responsibility**: Each component has one reason to change
4. **Open/Closed Principle**: Open for extension, closed for modification
5. **Interface Segregation**: Clients shouldn't depend on interfaces they don't use

## 🎯 Hexagonal Architecture (Backend)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   HEXAGONAL ARCHITECTURE                │
├─────────────────────────────────────────────────────────┤
│  Infrastructure Layer    │    Application Core          │
│  ┌─────────────────────┐  │  ┌─────────────────────────┐│
│  │ • REST API Routes   │  │  │ • Domain Entities       ││
│  │ • Database Repos    │◄─┼─►│ • Use Cases             ││
│  │ • Email Services    │  │  │ • Business Logic        ││
│  │ • Payment Adapters  │  │  │ • Domain Services       ││
│  │ • External APIs     │  │  │ • Interfaces (Ports)    ││
│  └─────────────────────┘  │  └─────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Domain Layer (Core)
**Location**: `src/domain/`
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects without identity
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Interfaces**: Contracts for external dependencies (ports)
- **Events**: Domain events for decoupled communication
- **Errors**: Domain-specific error types

#### 2. Application Layer (Use Cases)
**Location**: `src/lib/usecases/`
- **Use Cases**: Application-specific business rules
- **Application Services**: Orchestration of domain objects
- **DTOs**: Data Transfer Objects for layer boundaries
- **Interfaces**: Application service contracts

#### 3. Infrastructure Layer (Adapters)
**Location**: `src/infrastructure/`
- **Database**: Prisma repositories implementing domain interfaces
- **External Services**: API clients for third-party services
- **Email**: Email service implementations
- **Storage**: File storage implementations

#### 4. Presentation Layer (API Routes)
**Location**: `src/app/api/`
- **REST Controllers**: HTTP request/response handling
- **Middleware**: Authentication, validation, error handling
- **Serialization**: Domain objects to/from JSON

## 🎨 Clean Architecture (Frontend)

### Frontend Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                  CLEAN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│ Presentation Layer (React Components)                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • Pages        • Components    • Hooks             │ │
│ └─────────────────────────────────────────────────────┘ │
│ Application Layer (Business Logic)                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • Custom Hooks  • State Management  • Services     │ │
│ └─────────────────────────────────────────────────────┘ │
│ Infrastructure Layer (External Dependencies)            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ • API Clients   • Storage       • Third-party APIs │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### SOLID Principles Implementation

#### Single Responsibility Principle (SRP)
```typescript
// ❌ Bad - Multiple responsibilities
class CourseComponent {
  renderCourse() { /* UI logic */ }
  fetchCourseData() { /* Data fetching */ }
  validatePayment() { /* Payment logic */ }
}

// ✅ Good - Single responsibility
class CourseDisplay {
  render(course: Course) { /* Only UI rendering */ }
}

class CourseService {
  fetchCourse(id: CourseId): Promise<Course> { /* Only data fetching */ }
}
```

#### Open/Closed Principle (OCP)
```typescript
// Base interface for extensibility
interface CourseContentProvider {
  getContent(moduleId: ModuleId): Promise<ModuleContent>
}

// Extensions without modification
class VideoContentProvider implements CourseContentProvider {
  getContent(moduleId: ModuleId): Promise<VideoContent> { /* */ }
}

class InteractiveContentProvider implements CourseContentProvider {
  getContent(moduleId: ModuleId): Promise<InteractiveContent> { /* */ }
}
```

#### Dependency Inversion Principle (DIP)
```typescript
// ❌ Bad - Depend on concretions
class CourseService {
  private database = new PostgreSQLDatabase() // Direct dependency
}

// ✅ Good - Depend on abstractions
class CourseService {
  constructor(private repository: CourseRepository) {} // Abstraction
}
```

## 🗂️ Directory Structure

### Source Code Organization

```
src/
├── app/                   # Next.js App Router (Presentation Layer)
│   ├── api/              # REST API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── courses/      # Course management API
│   │   └── content/      # Content serving API
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── courses/          # Course catalog and details
│   ├── auth/            # Authentication pages
│   └── globals.css      # Global styles
│
├── components/           # Reusable UI Components
│   ├── ui/              # Base components (Button, Card, etc.)
│   ├── course/          # Course-specific components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Nav, Footer)
│   └── providers/       # Context providers
│
├── domain/              # Domain Layer (Business Logic)
│   ├── entities/        # Core business entities
│   │   ├── course.ts    # Course entity with business rules
│   │   └── user.ts      # User entity
│   ├── value-objects/   # Domain value objects
│   │   ├── course-id.ts # Unique course identifier
│   │   ├── money.ts     # Money value object
│   │   └── duration.ts  # Duration value object
│   ├── interfaces/      # Domain interfaces (ports)
│   │   ├── course-repository.ts
│   │   ├── payment-service.ts
│   │   └── email-service.ts
│   ├── events/          # Domain events
│   └── errors/          # Domain-specific errors
│
├── infrastructure/      # Infrastructure Layer
│   ├── database/        # Database implementations
│   │   ├── prisma-client.ts
│   │   ├── prisma-course-repository.ts
│   │   └── prisma-user-repository.ts
│   ├── external/        # External service clients
│   ├── email/           # Email service implementations
│   └── storage/         # File storage implementations
│
├── lib/                 # Application Layer
│   ├── usecases/        # Application use cases
│   │   └── enroll-student.usecase.ts
│   ├── services/        # Application services
│   │   └── course.service.ts
│   ├── repositories/    # Repository implementations
│   ├── auth/           # Authentication configuration
│   ├── i18n/           # Internationalization
│   └── utils.ts        # Shared utilities
│
├── hooks/              # Custom React hooks
│   ├── use-courses.ts  # Course data management
│   └── use-auth.ts     # Authentication hooks
│
└── types/              # TypeScript type definitions
    ├── api.ts          # API response types
    ├── course.ts       # Course-related types
    └── user.ts         # User-related types
```

## 🔄 Data Flow Architecture

### Request Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ API Route   │───▶│  Use Case   │───▶│   Domain    │
│  (Browser)  │    │(Controller) │    │ (Service)   │    │  (Entity)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                   │                   │                   │
       │                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Response   │◄───│   JSON      │◄───│ Repository  │◄───│  Database   │
│   (UI)      │    │Serializer   │    │ (Adapter)   │    │ (Postgres)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Example: Course Enrollment Flow

1. **Presentation Layer**: User clicks "Enroll" button
2. **API Route**: `/api/enrollments` receives POST request
3. **Use Case**: `EnrollStudentUseCase` orchestrates the business logic
4. **Domain Layer**: Validates business rules (course availability, user eligibility)
5. **Infrastructure**: Processes payment, saves enrollment, sends email
6. **Response**: Returns enrollment confirmation to client

## 🎭 Domain Model

### Core Entities

#### Course Entity
```typescript
class Course {
  private readonly _id: CourseId
  private _title: string
  private _price: Money
  private _duration: Duration
  
  constructor(props: CourseProps) {
    this.validateBusinessRules(props)
    // Initialize properties
  }
  
  // Business logic methods
  canEnroll(): boolean {
    return this._published && this._price.isValid()
  }
  
  calculateDiscount(percentage: number): Money {
    return this._price.applyDiscount(percentage)
  }
}
```

#### Value Objects
```typescript
// Money value object - immutable and self-validating
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    this.validate()
  }
  
  formatUSD(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount / 100)
  }
  
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency
  }
}
```

### Repository Pattern

#### Interface Definition
```typescript
interface CourseRepository {
  findById(id: CourseId): Promise<Course>
  findAll(): Promise<Course[]>
  save(course: Course): Promise<void>
  delete(id: CourseId): Promise<void>
}
```

#### Implementation
```typescript
class PrismaCourseRepository implements CourseRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: CourseId): Promise<Course> {
    const courseData = await this.prisma.course.findUnique({
      where: { id: id.value }
    })
    
    if (!courseData) {
      throw new CourseNotFoundError(id)
    }
    
    return this.toDomainEntity(courseData)
  }
  
  private toDomainEntity(data: any): Course {
    return new Course({
      id: new CourseId(data.id),
      title: data.title,
      price: new Money(data.price),
      // ... other mappings
    })
  }
}
```

## 🔌 Integration Patterns

### Event-Driven Architecture

```typescript
// Domain events for loose coupling
export class StudentEnrolledEvent implements DomainEvent {
  constructor(
    public readonly studentId: UserId,
    public readonly courseId: CourseId,
    public readonly enrolledAt: Date
  ) {}
}

// Event handling
export class SendWelcomeEmailHandler {
  handle(event: StudentEnrolledEvent): Promise<void> {
    // Send welcome email without tight coupling
  }
}
```

### Dependency Injection

```typescript
// Service composition at application boundaries
export function createCourseService(): CourseService {
  const courseRepository = new PrismaCourseRepository(prisma)
  const emailService = new ConvertKitEmailService()
  const paymentService = new PayPalPaymentService()
  
  return new CourseService(courseRepository, emailService, paymentService)
}
```

## 🔒 Security Architecture

### Authentication & Authorization

1. **Multi-Provider Authentication**: Google, GitHub, Email
2. **Role-Based Access Control**: Student, Instructor, Admin
3. **Session Management**: Database sessions with NextAuth.js
4. **API Protection**: JWT validation on protected routes

### Security Measures

- **HTTPS Enforcement**: All production traffic encrypted
- **CSRF Protection**: Built-in NextAuth.js protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in escape mechanisms

## 📊 Performance Architecture

### Optimization Strategies

1. **Database Optimization**
   - Prisma query optimization
   - Database indexing on frequently queried fields
   - Connection pooling for scalability

2. **Frontend Performance**
   - Next.js static generation where possible
   - Component code splitting
   - Image optimization with Next.js Image component
   - Lazy loading for non-critical components

3. **API Performance**
   - Response caching for static content
   - Database query optimization
   - Proper HTTP caching headers

### Monitoring & Observability

- **Error Tracking**: Sentry integration for production errors
- **Performance Monitoring**: Core Web Vitals tracking
- **Database Monitoring**: Query performance analysis
- **User Analytics**: Privacy-compliant usage tracking

## 🧪 Testing Architecture

### Testing Strategy by Layer

1. **Unit Tests**: Domain entities and value objects
2. **Integration Tests**: Repository implementations and use cases
3. **API Tests**: HTTP endpoint testing
4. **Component Tests**: React component behavior
5. **E2E Tests**: Full user workflow testing

### Test Organization

```
__tests__/
├── domain/              # Domain layer unit tests
│   ├── entities/
│   └── value-objects/
├── lib/                # Application layer tests
│   ├── usecases/
│   └── services/
├── integration/        # Integration tests
└── e2e/               # End-to-end tests
```

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Render.com    │    │   PostgreSQL    │    │   External      │
│   Web Service   │────│    Database     │    │   Services      │
│                 │    │                 │    │                 │
│ • Next.js App   │    │ • Course Data   │    │ • Email API     │
│ • API Routes    │    │ • User Data     │    │ • Payment API   │
│ • Static Assets │    │ • Session Data  │    │ • AI Services   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Scalability Considerations

- **Horizontal Scaling**: Stateless application design
- **Database Scaling**: Read replicas for high-traffic queries
- **CDN Integration**: Static asset distribution
- **Load Balancing**: Multiple application instances

## 📈 Future Architecture Considerations

### Microservices Evolution

As the platform grows, consider extracting:
- **Course Service**: Course management and content
- **User Service**: Authentication and user management  
- **Payment Service**: Payment processing and billing
- **Notification Service**: Email and push notifications

### Event Sourcing

For audit trails and complex business workflows:
- **Event Store**: Immutable event log
- **Projections**: Read models from events
- **Replay Capability**: System state reconstruction

---

*This architecture documentation reflects the current implementation and provides guidance for future evolution. The hexagonal architecture ensures the system remains maintainable and testable as it scales.*