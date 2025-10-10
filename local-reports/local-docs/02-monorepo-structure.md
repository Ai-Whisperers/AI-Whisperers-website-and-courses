# 📦 Monorepo Structure

**AI Whisperers Platform - Workspace Organization**
**Version:** 1.0.0
**Last Updated:** October 10, 2025

---

## 🌳 Directory Structure

```
ai-whisperers-platform/
├── apps/
│   └── web/                          # Main Next.js application
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   │   ├── (public)/         # Public routes (no auth)
│       │   │   ├── (protected)/      # Protected routes (auth required)
│       │   │   ├── api/              # API routes (backend)
│       │   │   ├── layout.tsx        # Root layout
│       │   │   └── page.tsx          # Home page
│       │   │
│       │   ├── components/           # React components
│       │   │   ├── admin/           # Admin UI components
│       │   │   ├── architecture/    # Architecture visualization
│       │   │   ├── auth/            # Authentication UI
│       │   │   ├── course/          # Course components
│       │   │   ├── dashboard/       # Dashboard components
│       │   │   ├── interactive/     # Interactive elements
│       │   │   ├── layout/          # Layout components
│       │   │   ├── pages/           # Page-level components
│       │   │   ├── sections/        # Page sections
│       │   │   ├── SEO/             # SEO components
│       │   │   └── ui/              # Base UI components
│       │   │
│       │   ├── contexts/            # React Context providers
│       │   │   ├── security/        # Auth context (SSR-compatible)
│       │   │   ├── i18n/            # i18n context (SSR-compatible)
│       │   │   ├── logic/           # App logic context
│       │   │   ├── design-system/   # Design tokens (public)
│       │   │   ├── presentation/    # UI preferences (private)
│       │   │   └── RootProvider.tsx # Combined provider
│       │   │
│       │   ├── hooks/               # Custom React hooks
│       │   │   ├── use-auth.ts
│       │   │   ├── use-localized-content.ts
│       │   │   └── useLocalizedRoutes.ts
│       │   │
│       │   ├── lib/                 # Utilities and business logic
│       │   │   ├── auth/            # Authentication utilities
│       │   │   ├── content/         # Content management
│       │   │   ├── db/              # Database helpers
│       │   │   ├── i18n/            # Internationalization
│       │   │   ├── architecture/    # Architecture analysis
│       │   │   └── rate-limit.ts    # Rate limiting
│       │   │
│       │   ├── types/               # TypeScript type definitions
│       │   │   └── content.ts       # Content types
│       │   │
│       │   ├── utils/               # General utilities
│       │   │   └── storage.ts       # SSR-safe storage
│       │   │
│       │   ├── config/              # Configuration files
│       │   │   ├── env.ts           # Environment validation
│       │   │   └── routes.ts        # Route definitions
│       │   │
│       │   ├── content/             # Content source (YAML)
│       │   │   ├── courses/
│       │   │   ├── blog/
│       │   │   └── translations/
│       │   │
│       │   ├── generated/           # Compiled content (TS)
│       │   │   └── content/
│       │   │
│       │   ├── domain/              # Domain logic
│       │   ├── infrastructure/      # Infrastructure code
│       │   └── middleware.ts        # Next.js middleware
│       │
│       ├── public/                  # Static assets
│       │   ├── images/
│       │   ├── fonts/
│       │   └── favicon.ico
│       │
│       ├── next.config.ts           # Next.js configuration
│       ├── tailwind.config.js       # Tailwind configuration
│       ├── postcss.config.mjs       # PostCSS configuration
│       ├── tsconfig.json            # TypeScript configuration
│       └── package.json             # App dependencies
│
├── packages/
│   ├── database/                    # Prisma database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   └── migrations/          # Database migrations
│   │   ├── src/
│   │   │   └── index.ts             # Prisma client export
│   │   └── package.json
│   │
│   ├── state-core/                  # State management package
│   │   ├── courses/                 # Course domain store (Zustand)
│   │   │   └── src/
│   │   │       └── store.ts
│   │   ├── ui/                      # UI preferences store (Zustand)
│   │   │   └── src/
│   │   │       └── store.ts
│   │   ├── analytics/               # Analytics store (Zustand)
│   │   │   └── src/
│   │   │       └── store.ts
│   │   ├── query/                   # React Query configuration
│   │   │   └── src/
│   │   │       └── client.ts
│   │   ├── hooks/                   # Shared hooks (React Query)
│   │   │   └── src/
│   │   │       └── useCourses.ts
│   │   └── package.json
│   │
│   └── config/                      # Shared configurations
│       ├── typescript/
│       │   └── tsconfig.base.json
│       ├── eslint/
│       │   └── index.js
│       ├── prettier/
│       │   └── index.js
│       └── tailwind/
│           └── index.js
│
├── tools/
│   └── compile-content/             # YAML→TypeScript compiler
│       └── index.js
│
├── docker/
│   ├── Dockerfile.web               # Production web service
│   └── docker-compose.yml           # Local development
│
├── local-reports/                   # Development reports
│   ├── local-docs/                  # Current architecture docs
│   ├── legacy/                      # Historical documentation
│   └── refactor-plan.md             # Refactoring roadmap
│
├── .env.development                 # Dev environment variables
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── turbo.json                       # Turborepo configuration
├── pnpm-workspace.yaml              # PNPM workspace config
├── package.json                     # Root package.json
├── tsconfig.json                    # Root TypeScript config
└── README.md                        # Project documentation
```

---

## 📱 Apps Directory

### `apps/web/`

The main Next.js 15 application serving both frontend and backend.

**Key Directories:**

#### `src/app/` - Next.js App Router
- **Purpose:** Route-based file system
- **Pattern:** Server Components by default
- **Contains:** Pages, layouts, API routes, route groups

#### `src/components/` - React Components
- **Purpose:** Reusable UI components
- **Organization:** Feature-based directories
- **Naming:** PascalCase for components, kebab-case for files

#### `src/contexts/` - React Context Providers
- **Purpose:** Global state management with React Context
- **Pattern:** 5-Layer provider hierarchy
- **Layers:**
  1. Security (auth, users, payments)
  2. Logic (routing, modals, notifications)
  3. Design System (public design tokens)
  4. Presentation (private UI preferences)
  5. i18n (language, translations)

#### `src/hooks/` - Custom React Hooks
- **Purpose:** Reusable component logic
- **Naming:** Must start with `use` prefix
- **Examples:** `useAuth`, `useLocalizedContent`

#### `src/lib/` - Utilities and Business Logic
- **Purpose:** Server-side utilities and helpers
- **Contains:** Auth, content management, database helpers
- **Pattern:** Export named functions

#### `src/types/` - TypeScript Types
- **Purpose:** Shared type definitions
- **Organization:** Domain-based type files
- **Pattern:** Interfaces for data structures

#### `src/config/` - Configuration
- **Purpose:** Application configuration
- **Contains:** Environment validation, route definitions
- **Pattern:** Export constants and schemas

#### `src/content/` - Content Source
- **Purpose:** YAML-based content management
- **Build:** Compiled to TypeScript at build time
- **Tool:** `tools/compile-content/`

---

## 📦 Packages Directory

### `packages/database/`

**Purpose:** Centralized database access layer

**Structure:**
```
database/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── migrations/        # Version-controlled migrations
├── src/
│   └── index.ts           # Prisma client singleton
└── package.json
```

**Usage:**
```typescript
import { prisma } from '@aiwhisperers/database'

const courses = await prisma.course.findMany()
```

**Features:**
- ✅ Singleton Prisma client (prevents multiple instances)
- ✅ Global connection pooling
- ✅ Type-safe database queries
- ✅ Automatic type generation

---

### `packages/state-core/`

**Purpose:** Unified state management package

**Structure:**
```
state-core/
├── courses/               # Course domain (Zustand)
├── ui/                    # UI preferences (Zustand)
├── analytics/             # Analytics (Zustand)
├── query/                 # React Query config
├── hooks/                 # Shared hooks
└── package.json
```

**State Management Strategy:**

#### Zustand Stores (Client State)
```typescript
import { useCoursesStore } from '@aiwhisperers/state-core/courses'

function Component() {
  const courses = useCoursesStore(s => s.courses)
  const setCourses = useCoursesStore(s => s.setCourses)
}
```

**Use Cases:**
- ✅ UI state (sidebar open/closed, theme)
- ✅ Client-side data that doesn't need server sync
- ✅ User preferences
- ✅ Analytics tracking

#### React Query (Server State)
```typescript
import { useCourses } from '@aiwhisperers/state-core/hooks'

function Component() {
  const { data, isLoading } = useCourses()
}
```

**Use Cases:**
- ✅ Server data fetching
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates

#### React Context (Auth & i18n)
```typescript
import { useAuth } from '@/hooks/use-auth'

function Component() {
  const { user, signIn, signOut } = useAuth()
}
```

**Use Cases:**
- ✅ Authentication state
- ✅ Internationalization
- ✅ SSR-compatible state

---

### `packages/config/`

**Purpose:** Shared configuration across workspace

**Structure:**
```
config/
├── typescript/
│   └── tsconfig.base.json   # Base TypeScript config
├── eslint/
│   └── index.js             # ESLint rules
├── prettier/
│   └── index.js             # Prettier config
└── tailwind/
    └── index.js             # Tailwind config
```

**Benefits:**
- ✅ Consistent code style
- ✅ Centralized configuration
- ✅ Easy updates across workspace
- ✅ Reduced duplication

---

## 🔧 Workspace Configuration

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

Defines which directories are part of the workspace.

### `turbo.json`

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

Configures parallel task execution and caching.

---

## 🎯 Path Aliases

### Apps/Web TypeScript Paths

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/contexts/*": ["./src/contexts/*"],
    "@/utils/*": ["./src/utils/*"],
    "@/types/*": ["./src/types/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/config/*": ["./src/config/*"],
    "@/app/*": ["./src/app/*"]
  }
}
```

**Usage:**
```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
```

---

## 📝 Naming Conventions

### Files and Directories
- **Components:** PascalCase (`CourseCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Directories:** kebab-case (`course-management/`)
- **Constants:** UPPER_SNAKE_CASE (`API_ROUTES.ts`)

### TypeScript
- **Interfaces:** PascalCase with `I` prefix optional (`Course` or `ICourse`)
- **Types:** PascalCase (`CourseType`)
- **Enums:** PascalCase with UPPER_CASE values (`Status.ACTIVE`)

### React
- **Components:** PascalCase function components
- **Hooks:** camelCase with `use` prefix (`useAuth`)
- **Context:** PascalCase with `Provider` suffix (`AuthProvider`)

---

## 🚀 Workspace Commands

### Development
```bash
# Start all apps and packages in dev mode
pnpm dev

# Start specific app
pnpm --filter web dev

# Start specific package
pnpm --filter @aiwhisperers/database generate
```

### Building
```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm --filter web build

# Build all packages (no apps)
pnpm --filter "./packages/**" build
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter web test

# Run tests in watch mode
pnpm test:watch
```

### Linting & Type Checking
```bash
# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix
```

---

## 📦 Package Dependencies

### Internal Dependencies (Workspace)
```json
{
  "dependencies": {
    "@aiwhisperers/database": "workspace:*",
    "@aiwhisperers/state-core": "workspace:*"
  }
}
```

The `workspace:*` protocol ensures packages always use the local workspace version.

### External Dependencies
Managed through root `package.json` or individual package `package.json` files.

---

## 🔄 Migration Notes

### Adding a New Package

1. Create directory in `packages/`
2. Initialize with `package.json`
3. Add to workspace imports in apps
4. Run `pnpm install` to link

```bash
mkdir -p packages/my-package/src
cd packages/my-package
pnpm init
```

### Adding a New App

1. Create directory in `apps/`
2. Initialize with Next.js or framework
3. Add workspace dependencies
4. Update `turbo.json` pipeline

---

## 📚 Next Steps

- See `03-state-management.md` for state patterns
- See `04-development-workflow.md` for development guide
- See `refactor-plan.md` for future roadmap

---

**Last Updated:** October 10, 2025
**Architecture Version:** 1.0.0
