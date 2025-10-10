# 🏗️ Architecture Overview

**AI Whisperers Platform - Enterprise Monorepo**
**Version:** 1.0.0
**Last Updated:** October 10, 2025
**Architecture Pattern:** Hybrid Next.js Monolith with Modular Packages

---

## 🎯 Executive Summary

The AI Whisperers platform is an enterprise-grade Learning Management System (LMS) built on a **Turborepo monorepo** architecture with **Next.js 15** as the core application framework. The architecture prioritizes:

- **Modularity** through workspace packages
- **Scalability** via clean separation of concerns
- **Developer Experience** with optimized tooling
- **Type Safety** with strict TypeScript configuration
- **Performance** through hybrid rendering (SSR/SSG/CSR)

---

## 🏛️ Architecture Principles

### 1. Hybrid Monolith Pattern

We use a **hybrid monolith** approach where Next.js serves both frontend and backend:

```
Next.js 15 Application
├── Frontend: React Server Components + Client Components
├── Backend: API Routes (RESTful endpoints)
└── Database: Prisma ORM → PostgreSQL
```

**Benefits:**
- ✅ Single deployment unit (simpler operations)
- ✅ Shared TypeScript types between frontend/backend
- ✅ Fast development iteration
- ✅ Easy to migrate to microservices later (Phase 7+)

### 2. Workspace Modularity

Code is organized into **reusable packages** that can be shared across applications:

```
packages/
├── @aiwhisperers/database      # Prisma client + schemas
├── @aiwhisperers/state-core    # State management (Zustand + React Query)
├── @aiwhisperers/config        # Shared configurations
└── ... (future packages)
```

**Benefits:**
- ✅ Clear boundaries between domains
- ✅ Easier testing and maintenance
- ✅ Reusable across multiple apps
- ✅ Independent versioning

### 3. Progressive Enhancement

The architecture supports **incremental adoption** of new patterns:

- **Phase 0-6:** Hybrid Next.js Monolith (current state)
- **Phase 7+:** Microservices separation (future evolution)

This allows us to:
- ✅ Deliver value quickly
- ✅ Avoid over-engineering
- ✅ Evolve architecture based on real needs

---

## 📦 Technology Stack

### Core Framework
- **Next.js 15.5.2** - Full-stack React framework with App Router
- **React 19.1.0** - UI library with Server Components
- **TypeScript 5.9.2** - Type-safe development

### Build System
- **Turborepo 2.5.8** - High-performance monorepo build system
- **pnpm 9.15.0** - Fast, disk-efficient package manager
- **Webpack** - Production-grade bundler (Next.js default)

### State Management
- **Zustand 5.0.2** - Lightweight client state management
- **React Query 5.64.2** - Server state management with caching
- **React Context** - Authentication and i18n state

### Database
- **PostgreSQL** - Production database on Render
- **Prisma 6.16.3** - Type-safe ORM with migrations

### Styling
- **Tailwind CSS 3.4.13** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization

### Authentication
- **NextAuth.js v4** - Database session-based authentication

### Deployment
- **Render.com** - Docker-based hosting platform
- **Docker** - Containerized deployments
- **Node.js 22.16.0** - Runtime environment

---

## 🎨 Rendering Strategy

Next.js 15 App Router provides **hybrid rendering** capabilities:

### Server Components (Default)
```typescript
// apps/web/src/app/courses/page.tsx
export default async function CoursesPage() {
  // Data fetching happens on the server
  const courses = await getCourses()
  return <CoursesList courses={courses} />
}
```

**Use Cases:**
- SEO-critical pages (home, courses, blog)
- Static content rendering
- Database queries
- Server-side authentication checks

### Client Components
```typescript
// apps/web/src/components/CourseCard.tsx
'use client'

import { useCoursesStore } from '@aiwhisperers/state-core/courses'

export function CourseCard() {
  const courses = useCoursesStore(s => s.courses)
  return <div>{/* Interactive UI */}</div>
}
```

**Use Cases:**
- Interactive UI components
- Client-side state management
- Browser API usage (localStorage, window, etc.)
- Real-time updates

### API Routes (Backend)
```typescript
// apps/web/src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aiwhisperers/database'

export async function GET(req: NextRequest) {
  const courses = await prisma.course.findMany()
  return NextResponse.json({ courses })
}
```

**Use Cases:**
- RESTful API endpoints
- Database operations
- Third-party API integrations
- Server-side business logic

---

## 🔐 Security Architecture

### Authentication Flow
```
User Request
    ↓
Next.js Middleware (src/middleware.ts)
    ↓ (Check session)
NextAuth.js (Database Sessions)
    ↓ (Verify credentials)
PostgreSQL (User + Session tables)
    ↓
Protected Route or 401 Redirect
```

### Security Features
- ✅ Database session storage (no JWT in cookies)
- ✅ Rate limiting on API routes (100 req/min)
- ✅ Environment variable validation (Zod schemas)
- ✅ TypeScript strict mode enabled
- ✅ ESLint security rules enforced

---

## 📊 Data Flow Architecture

### Server State (React Query)
```
Component Request
    ↓
React Query Hook (useCourses)
    ↓ (Check cache)
Cache Hit? → Return cached data
    ↓ (Cache miss)
API Route (/api/courses)
    ↓
Prisma Query (Database)
    ↓
Update Cache + Zustand Store
    ↓
Component Re-renders
```

### Client State (Zustand)
```
User Interaction
    ↓
Zustand Action (setCourses)
    ↓
Update Store (Immutable)
    ↓
Persist to localStorage (optional)
    ↓
All Subscribers Re-render
```

---

## 🚀 Performance Optimizations

### Build-Time Optimizations
- **Content Compilation:** YAML → TypeScript at build time
- **Tree Shaking:** Remove unused code from bundles
- **Code Splitting:** Automatic route-based splitting
- **Static Generation:** Pre-render pages when possible

### Runtime Optimizations
- **React Query Caching:** 1-minute stale time, 5-minute garbage collection
- **Zustand Devtools:** Development-only (removed in production)
- **Middleware Edge Runtime:** Fast authentication checks
- **PostgreSQL Connection Pooling:** Efficient database connections

---

## 🧪 Testing Strategy

### Testing Pyramid
```
      /\
     /E2E\      ← End-to-end tests (critical flows)
    /────\
   /Integ.\    ← Integration tests (API routes)
  /────────\
 /   Unit   \  ← Unit tests (utilities, stores)
/────────────\
```

**Coverage Targets:**
- Utilities: 80%
- State Stores: 70%
- API Routes: 60%
- Components: 50%
- **Overall: 60%**

---

## 📈 Scalability Path

### Current State (Phase 0-6)
```
Single Next.js Application
├── Frontend (React Components)
├── Backend (API Routes)
└── Database (Prisma + PostgreSQL)
```

### Future Evolution (Phase 7+)
```
Three Separate Services
├── Frontend Service (Next.js SSR/SSG)
├── API Service (Express/Fastify)
└── Database Service (PostgreSQL)
```

**Migration Path:**
1. Extract business logic to dedicated services layer (current)
2. Implement API contracts with shared TypeScript types
3. Deploy API routes as separate service
4. Update frontend to consume external API
5. Maintain backward compatibility during transition

---

## 🛠️ Development Workflow

### Local Development
```bash
# Start all workspace packages
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Testing
pnpm test
```

### Production Build
```bash
# Build all packages
pnpm build

# Build specific app
cd apps/web && pnpm build

# Start production server
pnpm start
```

### Database Management
```bash
# Generate Prisma client
pnpm --filter @aiwhisperers/database generate

# Create migration
pnpm --filter @aiwhisperers/database migrate:dev

# Deploy migration
pnpm --filter @aiwhisperers/database migrate:deploy
```

---

## 📚 Architecture Documentation

- **This Document:** Architecture overview and principles
- **`02-monorepo-structure.md`:** Detailed directory structure
- **`03-state-management.md`:** State management patterns
- **`04-development-workflow.md`:** Developer guide

---

## ✅ Architecture Quality Metrics

| Metric | Target | Current Status |
|--------|--------|----------------|
| TypeScript Errors | 0 | ✅ 0 |
| ESLint Errors | 0 | ✅ 0 |
| Build Time | < 2 min | ✅ ~1.5 min |
| Test Coverage | 60% | 🔄 In Progress (Phase 6) |
| Lighthouse Score | > 90 | 🔄 Pending Audit |
| Security Vulnerabilities | 0 (critical) | ✅ 0 |

---

**Architecture Status:** ✅ Production-Ready
**Last Reviewed:** October 10, 2025
**Next Review:** After Phase 3 completion
