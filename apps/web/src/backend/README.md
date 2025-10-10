# 🔧 Backend Code

**Purpose:** Server-side Node.js code that runs in Next.js API routes.

---

## Directory Structure

```
backend/
├── services/        # Business logic layer
├── controllers/     # API controllers (thin layer)
├── repositories/    # Data access layer (Prisma)
├── middleware/      # Server middleware
├── validators/      # Input validation (Zod)
└── utils/           # Backend utilities
```

---

## Layer Architecture

```
API Route
    ↓
Controller (thin - request/response handling)
    ↓
Service (business logic)
    ↓
Repository (data access)
    ↓
Database (Prisma)
```

---

## Import Rules

### ✅ CAN Import From:
- `@aiwhisperers/database` - Prisma client
- `@/shared/*` - Shared types, constants, utils
- Server-only packages (NodeMailer, etc.)

### ❌ CANNOT Import From:
- `@/frontend/*` - Frontend code
- `react`, `react-dom` - React packages

---

## Examples

### Service (Business Logic)
```typescript
// backend/services/course.service.ts
import { CourseRepository } from '@/backend/repositories/course.repository'
import { Course } from '@/shared/types/course.types'

export class CourseService {
  async getCourses(): Promise<Course[]> {
    return await CourseRepository.findAll()
  }

  async enrollUser(userId: string, courseId: string) {
    // Business logic: check prerequisites, quotas, etc.
    // ...
    return await CourseRepository.createEnrollment(userId, courseId)
  }
}
```

### Controller (API Layer)
```typescript
// backend/controllers/course.controller.ts
import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/backend/services/course.service'

export class CourseController {
  static async getCourses(req: NextRequest) {
    try {
      const courses = await CourseService.getCourses()
      return NextResponse.json({ courses })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }
  }
}
```

### Repository (Data Access)
```typescript
// backend/repositories/course.repository.ts
import { prisma } from '@aiwhisperers/database'

export class CourseRepository {
  static async findAll() {
    return await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  }
}
```

### API Route (Thin Handler)
```typescript
// app/api/courses/route.ts
import { CourseController } from '@/backend/controllers/course.controller'

export async function GET(req: NextRequest) {
  return await CourseController.getCourses(req)
}
```

---

**Migration Status:** ✅ Structure created, extracting logic from API routes gradually
