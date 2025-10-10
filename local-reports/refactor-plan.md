# 🚀 AI Whisperers Platform - Enterprise Refactor Plan

**Version:** 1.3.0
**Created:** 2025-10-09
**Last Updated:** 2025-10-10 (Corrected premature Phase 7 implementation)
**Scope:** 7 Major Phases (Sequential Implementation)
**Developer:** Solo (AI-Assisted)
**Status:** ✅ Phase 0-2 Complete | ⚠️ Cleanup Required | 🔄 Phase 3 Ready to Start

---

## 🎯 Quick Status Overview

```
Phase 0: Foundation        ✅ COMPLETE (Security fixes, env validation, rate limiting)
Phase 1: Turborepo         ✅ COMPLETE (Monorepo structure, packages, configs)
Phase 2: State Management  ✅ COMPLETE (Zustand + React Query + Context)
Phase 3: Render Tunnel     ⏳ NEXT (Dev/prod parity system)
Phase 4: Features          ⏸️ PENDING (Stripe, video, certificates, email, admin, AI)
Phase 5: Docker Compose    ⏸️ PENDING (Environment parity)
Phase 6: Testing           ⏸️ PENDING (60% coverage target)
Phase 7: Deployment        ⏸️ PENDING (Progressive rollout to production)
```

---

## ⚠️ IMPORTANT: Premature Implementation Error

### What Happened
During Phase 2, we **prematurely implemented Phase 7+ microservices architecture** by creating:
- ❌ `apps/web/src/frontend/` (microservices pattern)
- ❌ `apps/web/src/backend/` (microservices pattern)
- ❌ `apps/web/src/shared/` (microservices pattern)
- ❌ `apps/web/src/ARCHITECTURE.md` (premature documentation)
- ❌ `local-reports/frontend-backend-separation-architecture.md` (premature documentation)
- ❌ `local-reports/phase-2b-component-migration-plan.md` (incorrect plan)

### Why This Is Wrong
The refactor plan shows **two distinct architecture phases**:

**Phases 0-6 (Current):** Hybrid Next.js Monolith
```
apps/web/src/
├── app/          # Next.js App Router (Frontend + API Routes = Backend)
├── components/   # React components
├── hooks/        # React hooks
├── contexts/     # React Context providers
├── lib/          # Utilities and business logic
├── types/        # TypeScript types
└── ...
```

**Phase 7+ (Future):** Separate Microservices
```
apps/
├── web/          # Frontend Service (Next.js SSR/SSG)
└── api/          # Backend Service (Express/Fastify)
```

The frontend/backend/shared folders inside `apps/web/src/` belong to **Phase 7+**, not to our current hybrid monolith phase.

### How to Fix
1. ✅ Remove `apps/web/src/frontend/`, `backend/`, `shared/` directories
2. ✅ Remove premature architecture documentation files
3. ✅ Keep existing structure: `components/`, `hooks/`, `contexts/`, `lib/`, `types/`
4. ✅ Continue with **Phase 3: Render-Local Tunnel**
5. ✅ Implement microservices separation **only in Phase 7+**

### Resolution Status
- [x] Premature directories removed (frontend/, backend/, shared/)
- [x] Premature documentation removed (ARCHITECTURE.md, etc.)
- [x] Git cleanup committed (917ff95)
- [x] Ready to proceed with Phase 3 ✅

---

## 📋 Executive Summary

**Mission**: Transform the AI Whisperers LMS from a monolithic Next.js app into an enterprise-grade, modular platform with proper backend/frontend separation, state management, and production-development parity.

**Current State**:
- ✅ Deployed on Render (Docker)
- ✅ PostgreSQL database operational
- ⚠️ 156+ issues (8 critical, 23 high priority)
- ⚠️ TypeScript/ESLint checks disabled in builds
- ⚠️ No environment variable validation
- ⚠️ Security vulnerabilities in dependencies

**Target State**:
- ✅ Turborepo monorepo with modular packages
- ✅ Hybrid state management (Context + Zustand + React Query)
- ✅ Render-Local Data Tunnel for dev/prod parity
- ✅ Docker Compose matching production exactly
- ✅ 60% test coverage
- ✅ Feature flag system for progressive rollout
- ✅ All critical issues resolved

---

## 🎯 Architecture Evolution

### Phase 1: Hybrid Monolith (Current → Phase 6 Complete)
```
Next.js 15 (App Router)
├── Frontend (React Server Components + Client Components)
├── Backend (API Routes)
└── Database (Prisma + PostgreSQL on Render)
```

### Phase 2: Microservices (Phase 7+, Future Evolution)
```
3 Services on Render:
1. Frontend Service (Next.js SSR/SSG)
2. API Service (Express/Fastify)
3. Database Service (PostgreSQL)
```

---

## 📦 Target Monorepo Structure

```
ai-whisperers-platform/
├── apps/
│   ├── web/                    # Next.js 15 (Hybrid SSR/CSR)
│   │   ├── src/
│   │   │   ├── app/           # App Router (pages + API routes)
│   │   │   ├── components/    # UI components
│   │   │   └── hooks/         # Custom React hooks
│   │   ├── public/            # Static assets
│   │   ├── next.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── api/                    # Future: Standalone API (Phase 2)
│       └── src/
│           ├── routes/
│           ├── middleware/
│           └── services/
│
├── packages/
│   ├── database/              # Prisma client + schemas
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── index.ts       # Export Prisma client
│   │   │   └── migrations/    # Migration utilities
│   │   └── package.json
│   │
│   ├── state-core/            # State management
│   │   ├── auth/              # Auth domain (React Context)
│   │   ├── i18n/              # i18n domain (React Context)
│   │   ├── courses/           # Course domain (Zustand)
│   │   ├── ui/                # UI preferences (Zustand)
│   │   ├── analytics/         # Analytics (Zustand)
│   │   └── query/             # React Query config
│   │
│   ├── ui-components/         # Shared UI library
│   │   ├── primitives/        # Button, Input, Card, etc.
│   │   ├── compositions/      # Modal, Dialog, Drawer, etc.
│   │   └── design-tokens/     # Colors, typography, spacing
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── validation/        # Zod schemas
│   │   │   ├── env.ts         # Environment validation
│   │   │   ├── api.ts         # API request/response schemas
│   │   │   └── forms.ts       # Form validation schemas
│   │   ├── logger/            # Pino logger
│   │   ├── security/          # Rate limiting, CSRF, sanitization
│   │   └── errors/            # Custom error classes
│   │
│   ├── config/                # Shared configs
│   │   ├── eslint-config/
│   │   ├── tsconfig/
│   │   ├── tailwind-config/
│   │   └── prettier-config/
│   │
│   ├── payments/              # Payment integrations
│   │   ├── stripe/
│   │   └── paypal/
│   │
│   ├── email/                 # Email service
│   │   ├── resend/
│   │   └── templates/
│   │
│   └── render-tunnel/         # 🆕 Render-Local Data Tunnel
│       ├── server/            # Production endpoint (runs on Render)
│       ├── client/            # Local dev client
│       ├── cli/               # CLI tool for tunnel operations
│       └── types/             # Shared TypeScript types
│
├── tools/
│   └── compile-content/       # YAML→TypeScript compiler
│
├── docker/
│   ├── Dockerfile.web         # Production web service
│   ├── Dockerfile.api         # Future API service
│   └── docker-compose.yml     # Local development environment
│
├── .env.development           # Development environment variables
├── .env.production            # Production environment variables (git-ignored)
├── .env.example               # Template with all required variables
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # PNPM workspace configuration
├── package.json               # Root package.json
├── tsconfig.json              # Root TypeScript config
└── README.md                  # Project documentation
```

---

## 🌉 Render-Local Data Tunnel

### Purpose
Bidirectional communication channel between production (Render) and local development environments.

### Features
- **Log Streaming**: View production logs in real-time from local terminal
- **Webhook Forwarding**: Test Stripe/PayPal webhooks locally
- **Data Sync**: Pull sanitized production data to local database
- **Feature Flag Sync**: Coordinate feature flags between environments
- **Config Validation**: Ensure environment variables match between environments
- **Performance Monitoring**: Watch production metrics from local dashboard

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION (Render)                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Server (Port 3000)                          │  │
│  │  ├── HTTP Server                                     │  │
│  │  ├── Socket.IO Server (/render-tunnel)              │  │
│  │  └── Tunnel REST API (/api/tunnel/*)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕ WebSocket + HTTPS                 │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│  LOCAL DEVELOPMENT                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tunnel Client (packages/render-tunnel/client)       │  │
│  │  ├── Socket.IO Client                                │  │
│  │  ├── CLI Tool (npx render-tunnel)                    │  │
│  │  └── Dev Dashboard (localhost:3001/tunnel)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### CLI Commands
```bash
# Connect to production tunnel
npx render-tunnel connect

# Stream production logs
npx render-tunnel logs --follow --filter error

# Forward webhooks to local
npx render-tunnel webhook --type stripe --port 3000

# Sync data from production
npx render-tunnel sync --table courses --limit 50

# Sync feature flags
npx render-tunnel flags --watch

# Validate environment parity
npx render-tunnel validate-env
```

---

## 📅 Phase-by-Phase Implementation

### **PHASE 0: Preparation & Critical Fixes** (Foundation)

**Scope:** 5 sequential steps
**Goals**:
- Create rollback safety nets
- Fix critical security vulnerabilities
- Re-enable build quality checks
- Set up environment variable validation

**Tasks**:

#### 0.1 Create Safety Net
```bash
# Tag current stable version
git tag pre-refactor-v0.1.0

# Create refactor branch
git checkout -b refactor/monorepo-migration

# Create staging environment on Render
# (via Render dashboard - duplicate production service)
```

#### 0.2 Fix Critical Security Issues 🔴 BLOCKING

**File**: `next.config.ts`
```typescript
// Remove these dangerous overrides
eslint: {
  ignoreDuringBuilds: false,  // ✅ Re-enable
},
typescript: {
  ignoreBuildErrors: false,   // ✅ Re-enable
},
```

**File**: `package.json`
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

#### 0.3 Environment Variable Validation

**Create**: `src/config/env.ts`
```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_COURSES: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_STRIPE: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_AI_CHAT: z.coerce.boolean().default(false),

  // Render Tunnel
  RENDER_TUNNEL_ENABLED: z.coerce.boolean().default(false),
  RENDER_TUNNEL_SECRET: z.string().min(32).optional(),
  RENDER_EXTERNAL_URL: z.string().url().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // AI
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
```

**Update**: `src/app/layout.tsx`
```typescript
import { env } from '@/config/env' // ✅ Validates on app startup

export default function RootLayout({ children }) {
  // If env validation fails, app crashes immediately (good!)
  // ...
}
```

#### 0.4 Update Dependencies (Fix Vulnerabilities)

```bash
# Check for vulnerabilities
npm audit

# Fix non-breaking vulnerabilities
npm audit fix

# Fix breaking vulnerabilities (test thoroughly)
npm audit fix --force

# Specific updates needed (based on issues.md)
npm install next-auth@5.0.0-beta.23  # Fix cookie vulnerability
npm install ai@5.0.62                # Fix XSS vulnerability
```

#### 0.5 Add Rate Limiting

**Create**: `src/lib/rate-limit.ts`
```typescript
const buckets = new Map<string, { ts: number; count: number }>()

export function rateLimit(
  ip: string,
  windowMs: number = 10_000,
  limit: number = 10
): boolean {
  const now = Date.now()
  const bucket = buckets.get(ip) ?? { ts: now, count: 0 }

  if (now - bucket.ts > windowMs) {
    bucket.ts = now
    bucket.count = 0
  }

  bucket.count++
  buckets.set(ip, bucket)

  return bucket.count <= limit
}
```

**Update**: `src/middleware.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'

  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!rateLimit(ip, 60_000, 100)) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
  }

  // ... existing middleware logic (i18n, etc.)
}
```

---

### **PHASE 1: Turborepo Setup** (Monorepo Migration)

**Scope:** 4 major steps with multiple substeps
**Goals**:
- Initialize Turborepo monorepo
- Create package structure
- Migrate Prisma to package
- Set up shared configs

**Tasks**:

#### 1.1 Initialize Turborepo

```bash
# Install Turborepo globally
npm install -g turbo

# Create workspace structure
mkdir -p apps packages tools docker

# Initialize pnpm (faster than npm for monorepos)
npm install -g pnpm
pnpm init
```

**Create**: `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

**Update**: Root `package.json`
```json
{
  "name": "ai-whisperers-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "tools/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "5.9.2",
    "@types/node": "20.19.12"
  },
  "packageManager": "pnpm@9.15.0"
}
```

**Create**: `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env", ".env.development", ".env.production"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 1.2 Create Packages

**Create**: `packages/database/package.json`
```json
{
  "name": "@aiwhisperers/database",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.16.3"
  },
  "devDependencies": {
    "prisma": "^6.16.3"
  }
}
```

**Move**: `prisma/schema.prisma` → `packages/database/prisma/schema.prisma`

**Update**: `packages/database/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  // ✅ Remove custom output path - use default
  // output   = "../src/generated/prisma" // REMOVED
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... rest of schema stays the same
```

**Create**: `packages/database/src/index.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Re-export everything from Prisma Client
export * from '@prisma/client'
```

#### 1.3 Migrate Next.js App to `apps/web`

```bash
# Create apps/web directory
mkdir -p apps/web

# Move Next.js files
mv src apps/web/
mv public apps/web/
mv next.config.ts apps/web/
mv tailwind.config.js apps/web/
mv postcss.config.mjs apps/web/
```

**Create**: `apps/web/package.json`
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.5.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@aiwhisperers/database": "workspace:*",
    "@aiwhisperers/state-core": "workspace:*",
    "@aiwhisperers/ui-components": "workspace:*",
    "next-auth": "^5.0.0-beta.23",
    "tailwindcss": "^3.4.13",
    "typescript": "5.9.2"
  }
}
```

**Update**: `apps/web/src/lib/db/prisma.ts`
```typescript
// ✅ Import from monorepo package
export { prisma } from '@aiwhisperers/database'
```

#### 1.4 Create Shared Config Packages

**Create**: `packages/config/typescript/tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Create**: `packages/config/eslint/index.js`
```javascript
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

---

### **PHASE 2: State Management Migration** (Context → Zustand + React Query)

**Scope:** 3 major steps (Auth/i18n preserved, Domain state migrated)
**Goals**:
- Keep React Context for auth & i18n
- Migrate domain state to Zustand
- Add React Query for server state
- Remove legacy context providers

**Tasks**:

#### 2.1 Create State Core Package

**Create**: `packages/state-core/package.json`
```json
{
  "name": "@aiwhisperers/state-core",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zustand": "^5.0.2",
    "@tanstack/react-query": "^5.64.2",
    "react": "19.1.0"
  }
}
```

#### 2.2 Migrate Courses to Zustand

**Create**: `packages/state-core/courses/src/store.ts`
```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Course, Enrollment } from '@aiwhisperers/database'

interface CoursesState {
  // State
  courses: Course[]
  enrollments: Enrollment[]
  selectedCourseId: string | null
  isLoading: boolean
  error: string | null

  // Computed
  selectedCourse: () => Course | null
  enrolledCourses: () => Course[]

  // Actions
  setCourses: (courses: Course[]) => void
  setEnrollments: (enrollments: Enrollment[]) => void
  selectCourse: (courseId: string | null) => void
  addEnrollment: (enrollment: Enrollment) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  courses: [],
  enrollments: [],
  selectedCourseId: null,
  isLoading: false,
  error: null,
}

export const useCoursesStore = create<CoursesState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Computed getters
        selectedCourse: () => {
          const state = get()
          return state.courses.find(c => c.id === state.selectedCourseId) || null
        },

        enrolledCourses: () => {
          const state = get()
          const enrolledIds = state.enrollments.map(e => e.courseId)
          return state.courses.filter(c => enrolledIds.includes(c.id))
        },

        // Actions
        setCourses: (courses) => set({ courses }),

        setEnrollments: (enrollments) => set({ enrollments }),

        selectCourse: (courseId) => set({ selectedCourseId: courseId }),

        addEnrollment: (enrollment) => set((state) => ({
          enrollments: [...state.enrollments, enrollment]
        })),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'courses-storage',
        partialize: (state) => ({
          courses: state.courses,
          enrollments: state.enrollments,
        }),
      }
    ),
    { name: 'CoursesStore' }
  )
)

// Selector hooks (optimized re-renders)
export const useSelectedCourse = () => useCoursesStore((s) => s.selectedCourse())
export const useEnrolledCourses = () => useCoursesStore((s) => s.enrolledCourses())
export const useCoursesLoading = () => useCoursesStore((s) => s.isLoading)
export const useCoursesError = () => useCoursesStore((s) => s.error)
```

#### 2.3 Add React Query

**Create**: `packages/state-core/query/src/client.ts`
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

**Create**: `apps/web/src/hooks/api/useCourses.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCoursesStore } from '@aiwhisperers/state-core/courses'

export function useCourses() {
  const { setCourses, setLoading, setError } = useCoursesStore()

  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Failed to fetch courses')
        const data = await res.json()
        setCourses(data.courses)
        return data.courses
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        throw error
      } finally {
        setLoading(false)
      }
    },
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()
  const { addEnrollment } = useCoursesStore()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Enrollment failed')
      }
      return res.json()
    },
    onSuccess: (data) => {
      addEnrollment(data.enrollment)
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['user', 'enrollments'] })
    },
  })
}
```

**Update**: `apps/web/src/app/layout.tsx`
```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@aiwhisperers/state-core/query'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          <SecurityProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </SecurityProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

---

### **PHASE 3: Render-Local Tunnel** (Dev/Prod Parity System)

**Scope:** 4 major components (Server, Client, CLI, API)
**Goals**:
- Implement WebSocket-based tunnel server (production)
- Create tunnel client (local development)
- Build CLI tool for tunnel operations
- Add REST API endpoints for data sync

**Tasks**: See detailed implementation in plan above (Render-Local Data Tunnel Architecture section)

---

### **PHASE 4: Feature Implementation** (Core LMS Features)

**Scope:** 6 features in priority order
**Priority Order**:
1. Stripe Payment Gateway ✅
2. Video Player (Vimeo/YouTube) ✅
3. Certificate Generation ✅
4. Email Notifications ✅
5. Admin Analytics Dashboard ✅
6. AI Chatbot ✅

**Implementation**: See detailed feature implementations in plan above

---

### **PHASE 5: Docker Compose Parity** (Environment Isolation)

**Scope:** 3 major configuration updates
**Goals**:
- Update docker-compose.yml to match production exactly
- Add PostgreSQL service for local database
- Add Redis for caching and rate limiting
- Create development and production profiles

**Implementation**: See detailed Docker Compose configuration in plan above

---

### **PHASE 6: Testing** (Quality Assurance)

**Scope:** 4 testing levels (Unit, Integration, E2E, Coverage)
**Goals**:
- Achieve 60% test coverage
- Unit tests for utilities and stores
- Integration tests for API routes
- E2E tests for critical user flows

**Coverage Target**:
- Utilities: 80%
- State stores: 70%
- API routes: 60%
- Components: 50%
- **Overall: 60%**

**Implementation**: See detailed testing strategy in plan above

---

### **PHASE 7: Deployment** (Production Rollout)

**Scope:** 6-step progressive deployment
**Goals**:
- Deploy to staging on Render
- Run QA and performance testing
- Deploy to production with feature flags
- Monitor for errors and rollback if needed

**Progressive Rollout Strategy**:
1. **Step 1**: Deploy to staging environment
2. **Step 2**: Run comprehensive smoke tests
3. **Step 3**: Enable feature flags at 10% rollout
4. **Step 4**: Monitor metrics and verify stability
5. **Step 5**: Gradually increase rollout (10% → 25% → 50% → 100%)
6. **Step 6**: Execute database migration during low-traffic window (≤1 hour downtime allowed)

**Rollback Procedure**: See detailed rollback procedures in plan above

---

## 📊 Success Metrics

### Code Quality
- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors (warnings allowed)
- ✅ 60% test coverage
- ✅ All 156 issues resolved (critical + high priority)

### Performance
- ✅ < 1 second page load time (homepage)
- ✅ < 2 seconds time to interactive
- ✅ Lighthouse score > 90 (performance)

### Security
- ✅ No dependency vulnerabilities (critical or high)
- ✅ CSP headers properly configured
- ✅ Rate limiting on all API routes
- ✅ Environment variables validated on startup

### Developer Experience
- ✅ < 30 seconds for `pnpm dev` startup
- ✅ < 2 minutes for production build
- ✅ Docker Compose parity with production
- ✅ Render tunnel operational

### Business Metrics
- ✅ Stripe payments functional (test mode)
- ✅ Course enrollment flow complete
- ✅ Email notifications sending
- ✅ Admin dashboard displaying real-time stats

---

## 🛡️ Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data loss during migration | **HIGH** | LOW | Automated backups before migration, test on staging first, verify data integrity |
| State management bugs | MEDIUM | MEDIUM | Feature flags for gradual rollout, extensive testing, keep old system running in parallel |
| Render tunnel security breach | **HIGH** | LOW | Token-based authentication, rate limiting, audit logs, IP whitelisting |
| Docker complexity overwhelm | LOW | MEDIUM | Comprehensive documentation, pre-built scripts, video tutorials |
| Scope creep or extended timeline | MEDIUM | MEDIUM | Phased approach allows early stopping, MVP mindset, cut non-critical features, use feature flags |
| Breaking changes in dependencies | MEDIUM | LOW | Lock file committed, test updates on staging first, rollback plan ready |
| Performance regression | MEDIUM | MEDIUM | Lighthouse CI, performance budgets, load testing before deployment |

---

## 📝 Checklist

### Phase 0: Foundation (Critical Fixes) ✅ COMPLETE
- [x] Git tag `pre-refactor-v0.1.0` created
- [x] Branch `refactor/enterprise` created
- [x] TypeScript/ESLint re-enabled in builds
- [x] Environment variable validation added
- [x] Dependency vulnerabilities fixed (5 → 0)
- [x] Rate limiting implemented (100 req/min)

### Phase 1: Monorepo Setup ✅ COMPLETE
- [x] Turborepo initialized (v2.5.8)
- [x] Package structure created (apps, packages, tools)
- [x] Prisma migrated to packages/database
- [x] Next.js app moved to apps/web
- [x] Shared configs set up (4 packages: typescript, eslint, prettier, tailwind)
- [x] Build verification successful (727 packages installed)

### Phase 2: State Management ✅ COMPLETE
- [x] Zustand stores created (courses, UI, analytics)
- [x] React Query integrated
- [x] Custom API hooks created (useCourses, useEnrollments, useEnrollCourse)
- [x] Context providers preserved (auth, i18n maintained)
- [x] DevTools configured (Zustand + React Query)
- [x] Package created (`@aiwhisperers/state-core`)
- [x] Zero TypeScript errors introduced

### Phase 3: Render Tunnel
- [ ] Tunnel server implemented (production)
- [ ] Tunnel client implemented (local)
- [ ] CLI tool built
- [ ] REST API endpoints added
- [ ] Documentation written
- [ ] Testing completed

### Phase 4: Features
- [ ] Stripe integration complete
- [ ] Video player integrated
- [ ] Certificate generation working
- [ ] Email notifications sending
- [ ] Admin dashboard functional
- [ ] AI chatbot implemented

### Phase 5: Docker & Environment
- [ ] Docker Compose updated
- [ ] PostgreSQL service added
- [ ] Redis service added
- [ ] Development profile configured
- [ ] Production profile configured

### Phase 6: Testing
- [ ] Unit tests written (80% coverage utilities)
- [ ] Integration tests added (60% coverage API)
- [ ] E2E tests running (critical flows)
- [ ] Overall 60% coverage achieved
- [ ] All tests passing

### Phase 7: Deployment
- [ ] Staging deployed
- [ ] QA completed
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Production deployed (progressive rollout)
- [ ] Feature flags enabled
- [ ] Monitoring configured
- [ ] Rollback procedure tested
- [ ] Post-launch support plan ready

---

## 📚 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **API**: See `docs/API.md`
- **Database**: See `docs/DATABASE.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **Render Tunnel**: See `packages/render-tunnel/README.md`
- **Contributing**: See `CONTRIBUTING.md`

---

## 🔗 Resources

- **Turborepo Docs**: https://turbo.build/repo/docs
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **React Query Docs**: https://tanstack.com/query/latest
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js 15 Docs**: https://nextjs.org/docs

---

**Last Updated**: 2025-10-09
**Version**: 1.0.0
**Status**: ✅ Approved - In Progress
