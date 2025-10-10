# 🎨 Frontend Code

**Purpose:** Client-side React code that runs in the browser.

---

## Directory Structure

```
frontend/
├── components/      # React components
├── hooks/           # Custom React hooks
├── contexts/        # React Context providers
├── styles/          # CSS and styling
└── utils/           # Frontend utilities
```

---

## Import Rules

### ✅ CAN Import From:
- `@aiwhisperers/state-core` - State management (Zustand, React Query)
- `@/shared/*` - Shared types, constants, utils
- `@/generated/*` - Compiled content

### ❌ CANNOT Import From:
- `@/backend/*` - Backend code (use API calls instead)
- `@aiwhisperers/database` - Database package (server-only)

---

## Examples

### Component
```typescript
import { useCourses } from '@aiwhisperers/state-core'

export function CourseList() {
  const { data, isLoading } = useCourses()
  // ...
}
```

### API Hook
```typescript
import { useQuery } from '@tanstack/react-query'
import { Course } from '@/shared/types/course.types'

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses')
      return res.json()
    },
  })
}
```

---

**Migration Status:** ✅ Structure created, migrating components gradually
