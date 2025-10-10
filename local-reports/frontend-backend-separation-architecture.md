# 🏗️ Frontend/Backend Separation Architecture

**Date:** October 10, 2025
**Phase:** 2B - Architecture Refinement
**Goal:** Clear frontend/backend separation in apps/web for future scalability

---

## 🎯 Objective

Create a clear separation between **frontend** and **backend** concerns within the Next.js hybrid monolith (`apps/web`), ensuring a clean migration path to microservices when needed (Phase 7+).

---

## 📊 Current State Analysis

### Current Structure (Mixed Concerns)
```
apps/web/src/
├── app/              # Next.js App Router (pages + API routes mixed)
├── components/       # Frontend: React components
├── hooks/            # Frontend: Custom React hooks
├── contexts/         # Frontend: React contexts
├── lib/              # Mixed: Both frontend and backend utilities
├── domain/           # Domain logic (unclear frontend/backend)
├── infrastructure/   # Infrastructure (unclear frontend/backend)
├── config/           # Configuration (mixed)
├── utils/            # Utilities (mixed)
├── types/            # TypeScript types (shared)
├── content/          # Content (YAML source)
└── generated/        # Generated content (TypeScript)
```

**Problems:**
- ❌ Frontend and backend code intermingled
- ❌ Unclear what code can be used where (client vs server)
- ❌ Difficult to enforce server-only imports
- ❌ Hard to extract backend to separate service later
- ❌ No clear business logic layer

---

## 🎯 Target Architecture

### New Structure (Clear Separation)
```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router (HYBRID)
│   │   ├── (frontend)/        # 🎨 Frontend routes (pages, layouts)
│   │   │   ├── (marketing)/   # Public pages
│   │   │   ├── (platform)/    # Protected platform pages
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── dashboard/     # User dashboard
│   │   │   └── courses/       # Course pages
│   │   │
│   │   └── api/               # 🔧 Backend API routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── courses/       # Course CRUD endpoints
│   │       ├── user/          # User management endpoints
│   │       ├── admin/         # Admin endpoints
│   │       ├── webhooks/      # Payment webhooks
│   │       └── health/        # Health check endpoint
│   │
│   ├── frontend/              # 🎨 FRONTEND CODE (Client-side)
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── course/       # Course-specific components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── admin/        # Admin components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── interactive/  # Interactive components
│   │   │   └── pages/        # Page-level components
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── api/          # API data fetching hooks (React Query)
│   │   │   ├── state/        # State management hooks (Zustand)
│   │   │   └── utils/        # Utility hooks
│   │   │
│   │   ├── contexts/          # React Context providers
│   │   │   ├── security/     # Auth context (preserved)
│   │   │   ├── i18n/         # i18n context (preserved)
│   │   │   ├── logic/        # Logic context
│   │   │   ├── design-system/ # Design tokens context
│   │   │   └── presentation/ # UI preferences context
│   │   │
│   │   ├── styles/            # CSS and styling
│   │   │   ├── globals.css
│   │   │   └── themes/
│   │   │
│   │   └── utils/             # Frontend utilities
│   │       ├── formatting.ts
│   │       ├── validators.ts
│   │       └── helpers.ts
│   │
│   ├── backend/               # 🔧 BACKEND CODE (Server-side)
│   │   ├── services/          # Business logic services
│   │   │   ├── course.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── enrollment.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── analytics.service.ts
│   │   │
│   │   ├── controllers/       # API controllers (thin layer)
│   │   │   ├── course.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── auth.controller.ts
│   │   │
│   │   ├── middleware/        # Server middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── cors.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── validators/        # Input validation (Zod)
│   │   │   ├── course.validator.ts
│   │   │   ├── user.validator.ts
│   │   │   └── common.validator.ts
│   │   │
│   │   ├── repositories/      # Data access layer
│   │   │   ├── course.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── enrollment.repository.ts
│   │   │
│   │   └── utils/             # Backend utilities
│   │       ├── logger.ts
│   │       ├── encryption.ts
│   │       └── pagination.ts
│   │
│   ├── shared/                # ⚡ SHARED CODE (Both frontend & backend)
│   │   ├── types/             # TypeScript types
│   │   │   ├── api.types.ts
│   │   │   ├── domain.types.ts
│   │   │   └── database.types.ts
│   │   │
│   │   ├── constants/         # Constants
│   │   │   ├── routes.ts
│   │   │   ├── config.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── utils/             # Shared utilities
│   │   │   ├── date.utils.ts
│   │   │   ├── string.utils.ts
│   │   │   └── math.utils.ts
│   │   │
│   │   └── config/            # Configuration
│   │       ├── env.ts         # Environment validation
│   │       └── feature-flags.ts
│   │
│   ├── content/               # Content source (YAML)
│   └── generated/             # Generated content (TypeScript)
│
├── public/                    # Static assets
└── middleware.ts              # Next.js middleware (edge)
```

---

## 🎯 Separation Rules

### Frontend Code (`src/frontend/`)
**CAN:**
- ✅ Import from `@aiwhisperers/state-core`
- ✅ Import from `src/shared/`
- ✅ Import from `src/generated/` (compiled content)
- ✅ Make API calls to `src/app/api/`
- ✅ Use React, Next.js client features

**CANNOT:**
- ❌ Import from `src/backend/`
- ❌ Import from `@aiwhisperers/database` directly
- ❌ Use server-only packages (Prisma, server utils)

### Backend Code (`src/backend/`)
**CAN:**
- ✅ Import from `@aiwhisperers/database`
- ✅ Import from `src/shared/`
- ✅ Use server-only packages (Prisma, NodeMailer, etc.)
- ✅ Access environment variables
- ✅ Perform database operations

**CANNOT:**
- ❌ Import from `src/frontend/`
- ❌ Import React, React hooks
- ❌ Use browser APIs

### Shared Code (`src/shared/`)
**CAN:**
- ✅ Be imported by both frontend and backend
- ✅ Contain pure TypeScript (no React, no server-only code)
- ✅ Types, constants, utilities, validation schemas

**CANNOT:**
- ❌ Import from `src/frontend/` or `src/backend/`
- ❌ Use browser APIs or server-only APIs
- ❌ Depend on React or Prisma

---

## 📦 Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Client-Side)                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Presentation Layer                                   │  │
│  │  - Components, Pages, Layouts                         │  │
│  │  - React hooks, Context providers                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕ API Calls                        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│  API ROUTES (Next.js Handlers)                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controller Layer (Thin)                              │  │
│  │  - Request/response handling                          │  │
│  │  - Input validation                                   │  │
│  │  - Error handling                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Server-Side)                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Service Layer (Business Logic)                       │  │
│  │  - Domain logic, rules, workflows                     │  │
│  │  - Orchestration between repositories                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Repository Layer (Data Access)                       │  │
│  │  - Database queries (Prisma)                          │  │
│  │  - Data transformation                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL via Prisma)                           │
│  - Users, Courses, Enrollments, Payments, etc.              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Migration Strategy

### Phase 1: Create New Structure (Non-Breaking)
1. Create new directories: `src/frontend/`, `src/backend/`, `src/shared/`
2. Move shared code first: `types/`, `config/`, `utils/` → `src/shared/`
3. Keep old directories temporarily for backward compatibility

### Phase 2: Move Frontend Code
1. Move `components/` → `src/frontend/components/`
2. Move `hooks/` → `src/frontend/hooks/`
3. Move `contexts/` → `src/frontend/contexts/`
4. Update imports gradually

### Phase 3: Extract Backend Logic
1. Create service layer in `src/backend/services/`
2. Create repository layer in `src/backend/repositories/`
3. Move API route logic to controllers
4. Update API routes to use new structure

### Phase 4: Update All Imports
1. Update all imports to use new paths
2. Configure TypeScript path aliases
3. Remove old directories
4. Verify build succeeds

### Phase 5: Add Import Linting
1. Configure ESLint rules for import restrictions
2. Prevent frontend from importing backend
3. Prevent backend from importing frontend
4. Ensure shared code is truly shared

---

## 🔧 TypeScript Path Aliases

**tsconfig.json** (apps/web):
```json
{
  "compilerOptions": {
    "paths": {
      "@/frontend/*": ["./src/frontend/*"],
      "@/backend/*": ["./src/backend/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"],
      "@/content/*": ["./src/content/*"],
      "@/generated/*": ["./src/generated/*"]
    }
  }
}
```

---

## 📏 ESLint Rules for Import Boundaries

**.eslintrc.js** (apps/web):
```javascript
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/backend/**'],
            message: 'Frontend code cannot import from backend. Use API calls instead.',
            // Only enforce in frontend code
            from: '**/frontend/**',
          },
          {
            group: ['**/frontend/**'],
            message: 'Backend code cannot import from frontend.',
            // Only enforce in backend code
            from: '**/backend/**',
          },
          {
            group: ['@aiwhisperers/database'],
            message: 'Frontend code cannot import database package. Use API calls instead.',
            from: '**/frontend/**',
          },
          {
            group: ['react', 'react-dom'],
            message: 'Backend code cannot import React.',
            from: '**/backend/**',
          },
        ],
      },
    ],
  },
}
```

---

## 🎯 Benefits

### Immediate Benefits
- ✅ Clear code organization
- ✅ Easier onboarding for new developers
- ✅ Enforced separation of concerns
- ✅ Prevent accidental server code in client bundles
- ✅ Type-safe API boundaries

### Future Benefits
- ✅ Easy migration to separate API service (Phase 7+)
- ✅ Can deploy frontend and backend independently
- ✅ Clear testing boundaries (unit vs integration vs E2E)
- ✅ Scalability: Frontend and backend can scale independently
- ✅ Team organization: Frontend and backend teams can work independently

---

## 📊 Example: Course Feature

### Before (Mixed)
```
src/
├── components/course/course-card.tsx         # Frontend
├── lib/courses.ts                            # Backend logic (mixed with utils)
├── app/api/courses/route.ts                  # API route (fat controller)
└── types/course.ts                           # Shared types
```

### After (Separated)
```
src/
├── frontend/
│   ├── components/course/course-card.tsx     # ✅ Frontend component
│   └── hooks/api/useCourses.ts               # ✅ Frontend API hook
│
├── backend/
│   ├── services/course.service.ts            # ✅ Business logic
│   ├── repositories/course.repository.ts     # ✅ Data access
│   ├── controllers/course.controller.ts      # ✅ API controller
│   └── validators/course.validator.ts        # ✅ Input validation
│
├── shared/
│   └── types/course.types.ts                 # ✅ Shared types
│
└── app/api/courses/route.ts                  # ✅ Thin API route (calls controller)
```

---

## 🔄 Implementation Checklist

### Step 1: Create Directory Structure
- [ ] Create `src/frontend/`, `src/backend/`, `src/shared/`
- [ ] Create subdirectories (components, services, etc.)
- [ ] Add index.ts barrel exports

### Step 2: Move Shared Code
- [ ] Move `src/types/` → `src/shared/types/`
- [ ] Move `src/config/` → `src/shared/config/`
- [ ] Move shared utils to `src/shared/utils/`

### Step 3: Move Frontend Code
- [ ] Move `src/components/` → `src/frontend/components/`
- [ ] Move `src/hooks/` → `src/frontend/hooks/`
- [ ] Move `src/contexts/` → `src/frontend/contexts/`

### Step 4: Extract Backend Code
- [ ] Create service layer (`src/backend/services/`)
- [ ] Create repository layer (`src/backend/repositories/`)
- [ ] Create controller layer (`src/backend/controllers/`)
- [ ] Extract business logic from API routes

### Step 5: Update Configuration
- [ ] Update `tsconfig.json` with path aliases
- [ ] Update `.eslintrc.js` with import restrictions
- [ ] Update `next.config.ts` if needed

### Step 6: Update Imports
- [ ] Update all frontend imports
- [ ] Update all backend imports
- [ ] Update all API route imports
- [ ] Verify no circular dependencies

### Step 7: Testing
- [ ] Run type checking
- [ ] Run linting
- [ ] Test all pages
- [ ] Test all API routes
- [ ] Verify build succeeds

### Step 8: Cleanup
- [ ] Remove old directories
- [ ] Update documentation
- [ ] Commit changes

---

## 🚀 Next Steps

1. **Review this architecture** with the team
2. **Create directory structure** (non-breaking)
3. **Start with shared code migration** (safest)
4. **Gradually migrate frontend** (component by component)
5. **Extract backend logic** (API route by API route)
6. **Add linting rules** to enforce boundaries
7. **Update documentation** and onboarding guides

---

**Status:** Ready for implementation
**Estimated Time:** 6-8 hours
**Risk Level:** Low (can be done incrementally)
**Breaking Changes:** None (if done correctly)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
