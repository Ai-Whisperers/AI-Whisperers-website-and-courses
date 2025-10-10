# 🏗️ Apps/Web Architecture

**Phase 2B:** Frontend/Backend Separation
**Date:** October 10, 2025
**Status:** ✅ Foundation Complete - Ready for Gradual Migration

---

## 🎯 Architecture Overview

This application follows a **clear frontend/backend separation pattern** within the Next.js hybrid monolith. This enables:

- 📦 Clear code organization
- 🔒 Enforced boundaries between client and server code
- 🚀 Easy future migration to microservices
- 👥 Team scalability (frontend/backend teams can work independently)

---

## 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router (HYBRID)
│   ├── (frontend)/        # 🎨 Frontend routes (pages, layouts)
│   └── api/               # 🔧 Backend API routes
│
├── frontend/              # 🎨 FRONTEND CODE (Client-side)
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React Context providers
│   ├── styles/            # CSS and styling
│   └── utils/             # Frontend utilities
│
├── backend/               # 🔧 BACKEND CODE (Server-side)
│   ├── services/          # Business logic layer
│   ├── controllers/       # API controllers (thin layer)
│   ├── repositories/      # Data access layer
│   ├── middleware/        # Server middleware
│   ├── validators/        # Input validation (Zod)
│   └── utils/             # Backend utilities
│
├── shared/                # ⚡ SHARED CODE (Both)
│   ├── types/             # TypeScript types
│   ├── constants/         # Constants
│   ├── utils/             # Shared utilities
│   └── config/            # Configuration
│
├── content/               # Content source (YAML)
└── generated/             # Generated content (TypeScript)
```

---

## 🎯 Import Rules

### 🎨 Frontend (`src/frontend/`)

**✅ CAN import:**
- `@aiwhisperers/state-core` - State management
- `@/shared/*` - Shared code
- `@/generated/*` - Compiled content
- React, Next.js client packages

**❌ CANNOT import:**
- `@/backend/*` - Use API calls instead
- `@aiwhisperers/database` - Server-only
- Server-only packages

### 🔧 Backend (`src/backend/`)

**✅ CAN import:**
- `@aiwhisperers/database` - Prisma client
- `@/shared/*` - Shared code
- Server-only packages

**❌ CANNOT import:**
- `@/frontend/*` - Client code
- `react`, `react-dom` - UI frameworks

### ⚡ Shared (`src/shared/`)

**✅ MUST BE:**
- Pure TypeScript
- Isomorphic (works in browser and Node.js)
- Framework-agnostic

**❌ CANNOT import:**
- `@/frontend/*` or `@/backend/*`
- React or server-only packages

---

## 🏛️ Layer Architecture

```
┌─────────────────────────────────────┐
│  FRONTEND (Browser)                 │
│  Components → Hooks → API Calls     │
└─────────────────────────────────────┘
                 ↓ HTTP
┌─────────────────────────────────────┐
│  API ROUTES (Next.js)               │
│  Thin handlers → Controllers        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  BACKEND (Node.js)                  │
│  Controllers → Services →           │
│  Repositories → Database            │
└─────────────────────────────────────┘
```

---

## 📖 Code Examples

### Frontend Component
```typescript
// src/frontend/components/CourseCard.tsx
import { useCourses } from '@aiwhisperers/state-core'

export function CourseCard() {
  const { data, isLoading } = useCourses()
  return <div>{/* ... */}</div>
}
```

### Backend Service
```typescript
// src/backend/services/course.service.ts
import { prisma } from '@aiwhisperers/database'

export class CourseService {
  static async getCourses() {
    return await prisma.course.findMany()
  }
}
```

### Backend Controller
```typescript
// src/backend/controllers/course.controller.ts
import { CourseService } from '@/backend/services/course.service'

export class CourseController {
  static async getCourses(req: NextRequest) {
    const courses = await CourseService.getCourses()
    return NextResponse.json({ courses })
  }
}
```

### API Route (Thin Handler)
```typescript
// src/app/api/courses/route.ts
import { CourseController } from '@/backend/controllers/course.controller'

export async function GET(req: NextRequest) {
  return await CourseController.getCourses(req)
}
```

### Shared Types
```typescript
// src/shared/types/course.types.ts
export interface Course {
  id: string
  title: string
  slug: string
}
```

---

## 🔄 Migration Status

### ✅ Complete
- Directory structure created
- TypeScript path aliases configured
- README files for each layer
- Example service, controller, types
- Architecture documentation

### 🔄 In Progress
- Gradual component migration to `src/frontend/`
- Gradual API route refactoring to use controllers
- ESLint rules for import boundaries

### 📝 TODO
- Migrate all components to `src/frontend/`
- Extract all business logic to `src/backend/services/`
- Add automated tests for layers
- Add import linting enforcement

---

## 📚 Documentation

- **Full Architecture Plan**: `/local-reports/frontend-backend-separation-architecture.md`
- **Frontend Guide**: `src/frontend/README.md`
- **Backend Guide**: `src/backend/README.md`
- **Shared Code Guide**: `src/shared/README.md`

---

## 🚀 Benefits

1. **Clear Organization** - Developers know exactly where code belongs
2. **Enforced Boundaries** - TypeScript and ESLint prevent incorrect imports
3. **Team Scalability** - Frontend and backend teams work independently
4. **Future-Proof** - Easy migration to separate services when needed
5. **Better Testing** - Clear separation enables focused unit/integration tests

---

## ⚙️ TypeScript Configuration

Path aliases configured in `tsconfig.json`:

```typescript
{
  "paths": {
    "@/frontend/*": ["./src/frontend/*"],
    "@/backend/*": ["./src/backend/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}
```

---

**Status:** Foundation Complete ✅
**Next Step:** Gradual migration of existing code to new structure
**Migration Strategy:** Non-breaking, incremental, component-by-component

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
