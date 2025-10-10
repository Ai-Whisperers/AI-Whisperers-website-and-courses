# ⚡ Shared Code

**Purpose:** Code that can be safely imported by BOTH frontend and backend.

---

## Directory Structure

```
shared/
├── types/           # TypeScript types and interfaces
├── constants/       # Constants (routes, config, errors)
├── utils/           # Pure utility functions
└── config/          # Configuration (env validation, feature flags)
```

---

## Rules for Shared Code

### ✅ MUST BE:
- Pure TypeScript (no React, no server-only code)
- Isomorphic (works in both browser and Node.js)
- Framework-agnostic

### ❌ CANNOT:
- Import from `@/frontend/*` or `@/backend/*`
- Use browser APIs (window, document, localStorage)
- Use server-only APIs (fs, path, process.env directly)
- Depend on React or Prisma

---

## Examples

### Types
```typescript
// shared/types/course.types.ts
export interface Course {
  id: string
  title: string
  slug: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  price: number
}

export interface CreateCourseDto {
  title: string
  slug: string
  description: string
}
```

### Constants
```typescript
// shared/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (slug: string) => `/courses/${slug}`,
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const

export const API_ROUTES = {
  COURSES: '/api/courses',
  USER_COURSES: '/api/user/courses',
} as const
```

### Utils
```typescript
// shared/utils/date.utils.ts
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
```

### Config
```typescript
// shared/config/env.ts
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export type Env = z.infer<typeof envSchema>
```

---

## Validation

Use ESLint rules to enforce:
- Shared code cannot import frontend/backend
- Shared code must be pure TypeScript

---

**Migration Status:** ✅ Structure created, moving shared code gradually
