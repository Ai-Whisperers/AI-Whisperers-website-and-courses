# 🏗️ Backend & Frontend Architecture

**Project:** AI Whisperers Learning Management System
**Framework:** Next.js 15.5.2 (App Router with React Server Components)
**Architecture Pattern:** Hybrid SSR/CSR with API Routes
**Last Updated:** October 7, 2025

---

## 📊 **Architecture Overview**

This project uses **Next.js App Router** with a clear separation between:
- **Backend (Server-side)**: API Routes, Server Components, Business Logic
- **Frontend (Client-side)**: Client Components, State Management, UI
- **Hybrid**: Pages that combine both server and client rendering

### **Rendering Strategy**
- **Server Components (RSC)**: Default for all pages (SEO, performance)
- **Client Components**: Interactive UI, state management (marked with `'use client'`)
- **API Routes**: RESTful endpoints for data operations

---

## 🔧 **Backend Architecture (Server-side)**

### **1. API Routes** (12 endpoints)
Located in `src/app/api/`:

#### **Authentication**
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
  - Google OAuth, GitHub OAuth
  - Database sessions via Prisma adapter

#### **Health & Monitoring**
- `GET /api/health` - Health check endpoint (used by Render)

#### **Architecture & Meta**
- `GET /api/architecture` - Real-time codebase analysis (dev only)

#### **Course Management**
- `GET /api/courses` - List all courses
- `GET /api/courses/[slug]` - Get single course by slug
- `GET /api/courses/stats` - Course statistics

#### **Content Delivery**
- `GET /api/content/[pageName]` - Dynamic page content (i18n-aware)

#### **User Data**
- `GET /api/user/dashboard` - User dashboard data
- `GET /api/user/courses/enrolled` - User's enrolled courses
- `GET /api/user/progress` - Course progress tracking
- `GET /api/user/achievements` - User achievements

#### **Admin**
- `GET /api/admin/stats` - Admin statistics and analytics

### **2. Server Components (RSC)**
All page.tsx files default to Server Components:

```
src/app/
├── page.tsx                    # Homepage (RSC)
├── about/page.tsx             # About page (RSC)
├── courses/page.tsx           # Courses listing (RSC)
├── courses/[slug]/page.tsx    # Course detail (RSC)
├── services/page.tsx          # Services (RSC)
├── solutions/page.tsx         # Solutions (RSC)
├── dashboard/page.tsx         # Dashboard (RSC wrapper → CSC)
├── admin/page.tsx             # Admin (RSC wrapper → CSC)
└── [...other pages]           # All RSC by default
```

**Benefits:**
- SEO-optimized (pre-rendered HTML)
- Zero client-side JavaScript (until hydration)
- Direct database access (via Prisma)
- Secure (API keys, secrets never exposed)

### **3. Backend Business Logic**
Located in `src/lib/`:

#### **Services Layer**
- `services/course.service.ts` - Course CRUD operations
- `repositories/` - Data access patterns

#### **Use Cases (Domain Logic)**
- `usecases/enroll-student.usecase.ts` - Student enrollment flow

#### **Authentication & Security**
- `auth/config.ts` - NextAuth.js configuration
  - Prisma adapter for database sessions
  - Google & GitHub OAuth providers
  - Session callbacks and JWT handling

#### **Database Layer**
- `db/prisma.ts` - Prisma client singleton
  - Connection pooling
  - PostgreSQL database
  - 19 tables (users, courses, enrollments, progress, etc.)

#### **Utilities**
- `logger.ts` - Server-side logging
- `rate-limit.ts` - API rate limiting
- `api-schemas.ts` - Zod validation schemas

### **4. Content Management System**
Build-time compilation (no runtime file I/O):

```
src/content/pages/      # YAML source files
        ↓
scripts/compile-content.js   # Compilation script
        ↓
src/lib/content/compiled/    # TypeScript modules
        ↓
src/lib/content/server-compiled.ts  # Server-side loader
```

**Features:**
- Bilingual (EN/ES)
- Type-safe
- Zero runtime file access
- Environment variable substitution

### **5. Database Schema (Prisma)**
19 tables across 5 domains:

**Authentication (NextAuth.js)**
- `users` - User accounts
- `accounts` - OAuth account linking
- `sessions` - Database sessions
- `verification_tokens` - Email verification

**LMS Core**
- `courses` - Course catalog
- `course_modules` - Course structure
- `lessons` - Lesson content
- `enrollments` - Student enrollments
- `course_progress` - Progress tracking
- `lesson_progress` - Lesson completion

**Assessments**
- `quizzes` - Assessment quizzes
- `questions` - Quiz questions
- `quiz_attempts` - Student attempts

**Commerce**
- `transactions` - Payment records

**Analytics**
- `course_analytics` - Course metrics

**Content**
- `media` - File storage metadata
- `certificates` - Course certificates

---

## 🎨 **Frontend Architecture (Client-side)**

### **1. Client Components**
Components marked with `'use client'`:

#### **Admin Components**
- `components/admin/AdminClient.tsx` - Main admin UI
- `components/admin/AdminLayout.tsx` - Admin layout wrapper

#### **Dashboard Components**
- `components/dashboard/DashboardClient.tsx` - Main dashboard
- `components/dashboard/DashboardLayout.tsx` - Dashboard layout
- `components/dashboard/CoursesEnrolled.tsx` - Enrolled courses widget
- `components/dashboard/RecentActivity.tsx` - Activity feed
- `components/dashboard/StatsCard.tsx` - Statistics cards

#### **Interactive Components**
- `components/interactive/NewsletterSignup.tsx` - Newsletter form
- `components/interactive/PricingCalculator.tsx` - Price calculator
- `components/interactive/TestimonialsCarousel.tsx` - Testimonials slider

#### **Page Components (Static)**
- `components/pages/TermsPage.tsx` - Terms of service
- `components/pages/PrivacyPage.tsx` - Privacy policy
- `components/pages/FAQPage.tsx` - FAQ page

### **2. State Management** (5-Layer Context System)
Nested provider hierarchy in `src/contexts/`:

```typescript
<SecurityProvider>          // Layer 1: Auth, users, payments
  <LogicProvider>           // Layer 2: Routing, modals, notifications
    <DesignSystemProvider>  // Layer 3: Design tokens (public)
      <PresentationProvider> // Layer 4: UI preferences (private)
        <I18nProvider>       // Layer 5: Translations, locale
          {children}
        </I18nProvider>
      </PresentationProvider>
    </DesignSystemProvider>
  </LogicProvider>
</SecurityProvider>
```

**21 Context Files:**
- `RootProvider.tsx` - Main provider orchestrator
- `security/` - Authentication & authorization state
- `logic/` - Application logic state
- `design-system/` - Design tokens provider
- `presentation/` - UI preferences state
- `i18n/` - Internationalization state

**Why This Order?**
1. **Security first** - Controls access to entire app
2. **Logic second** - Depends on security for protected routes
3. **Design third** - Public design tokens (cacheable)
4. **Presentation fourth** - Private UI prefs (uses design tokens)
5. **i18n innermost** - Most isolated concern

### **3. UI Component Library**
Located in `src/components/`:

```
components/
├── ui/                 # Reusable UI primitives
├── layout/            # Layout components (Nav, Footer)
├── course/            # Course-specific components
├── interactive/       # Interactive widgets
├── pages/             # Full page components
├── admin/             # Admin-specific UI
├── dashboard/         # Dashboard widgets
├── auth/              # Auth components
├── content/           # Dynamic content rendering
├── SEO/               # SEO components
└── architecture/      # Architecture visualization
```

### **4. Design System**
Token-based design system in `src/lib/design-system/`:

**Design Tokens**
- `tokens/colors.ts` - Color palette (50-950 scales)
- `tokens/typography.ts` - Font sizes, weights, line heights
- `tokens/spacing.ts` - Spacing scale (0-96)
- `tokens/shadows.ts` - Shadow tokens
- `tokens/borders.ts` - Border radius, widths
- `tokens/transitions.ts` - Animation timing
- `tokens/z-index.ts` - Z-index scale

**Themes**
- `themes/theme-config.ts` - Theme definitions
- `themes/index.ts` - Theme registry

**Integration**
- CSS Variables via `DesignSystemProvider`
- TypeScript autocomplete
- Tailwind CSS configuration

### **5. Client-side Libraries**
Located in `src/lib/`:

**Internationalization**
- `i18n/use-translation.ts` - Client-side translation hook
- `i18n/config.ts` - i18n configuration
- `i18n/types.ts` - i18n type definitions

**Utilities**
- `utils.ts` - Utility functions (cn, etc.)
- `data/mock-courses.ts` - Mock data for development

---

## 🔄 **Hybrid Components (SSR + CSR)**

### **Pattern: RSC Wrapper → Client Component**

Many pages use this pattern:

```typescript
// src/app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  // Server-side data fetching
  const data = await fetch('/api/user/dashboard')

  return (
    <DashboardClient initialData={data} /> // Client Component
  )
}
```

**Examples:**
- `src/app/dashboard/page.tsx` → `DashboardClient.tsx`
- `src/app/admin/page.tsx` → `AdminClient.tsx`
- `src/app/page.tsx` → `DynamicHomepage.tsx`

**Benefits:**
- SEO-friendly (RSC pre-renders)
- Interactive UI (CSC hydrates)
- Data fetching on server (secure)
- State management on client (reactive)

---

## 📁 **Directory Structure**

```
src/
├── app/                      # Next.js App Router
│   ├── api/                 # ✅ BACKEND: API Routes
│   ├── **/page.tsx         # ✅ BACKEND: Server Components (default)
│   ├── layout.tsx          # ✅ BACKEND: Root layout (RSC)
│   └── middleware.ts       # ✅ BACKEND: Edge middleware (i18n)
│
├── components/              # ✅ FRONTEND: UI Components
│   ├── **/*Client.tsx      # Client components (interactive)
│   └── **/page components  # Presentational components
│
├── contexts/                # ✅ FRONTEND: State Management
│   ├── RootProvider.tsx    # Provider orchestrator
│   ├── security/           # Auth state
│   ├── logic/              # App logic state
│   ├── design-system/      # Design tokens
│   ├── presentation/       # UI prefs
│   └── i18n/               # i18n state
│
├── lib/                     # ✅ SHARED: Libraries
│   ├── services/           # BACKEND: Business logic
│   ├── repositories/       # BACKEND: Data access
│   ├── usecases/           # BACKEND: Domain logic
│   ├── auth/               # BACKEND: Auth config
│   ├── db/                 # BACKEND: Prisma client
│   ├── content/            # BACKEND: Content system
│   ├── i18n/               # FRONTEND: i18n utilities
│   ├── design-system/      # FRONTEND: Design tokens
│   ├── utils.ts            # SHARED: Utilities
│   ├── logger.ts           # BACKEND: Logging
│   └── rate-limit.ts       # BACKEND: Rate limiting
│
├── types/                   # ✅ SHARED: TypeScript types
├── content/                 # ✅ BACKEND: YAML content source
└── generated/               # ✅ BACKEND: Prisma client
```

---

## 🔐 **Security Architecture**

### **Backend Security**
- ✅ NextAuth.js database sessions (not JWT in client)
- ✅ Prisma parameterized queries (SQL injection prevention)
- ✅ Rate limiting on API routes
- ✅ CORS headers configured
- ✅ CSP headers (Content Security Policy)
- ✅ Environment variables never exposed to client
- ✅ API key validation

### **Frontend Security**
- ✅ XSS protection (React auto-escaping)
- ✅ CSRF tokens (NextAuth.js built-in)
- ✅ Encrypted localStorage (sensitive data)
- ✅ Secure cookies (httpOnly, sameSite)
- ✅ Auth guards on protected routes
- ✅ No inline scripts (CSP compliant)

---

## 🚀 **Data Flow**

### **User Authentication Flow**
```
1. User clicks "Sign in with Google"
   ↓
2. Frontend → /api/auth/signin (API Route)
   ↓
3. NextAuth.js → Google OAuth
   ↓
4. Google → Callback → /api/auth/callback/google
   ↓
5. NextAuth.js → Prisma → Create/update user in DB
   ↓
6. NextAuth.js → Create session in DB
   ↓
7. NextAuth.js → Set secure cookie
   ↓
8. Frontend → SecurityProvider updates auth state
   ↓
9. UI re-renders with authenticated user
```

### **Course Enrollment Flow**
```
1. User clicks "Enroll" (Client Component)
   ↓
2. POST /api/courses/[slug]/enroll (API Route)
   ↓
3. API validates auth session
   ↓
4. enroll-student.usecase.ts (Domain logic)
   ↓
5. course.service.ts → Prisma transaction
   ↓
6. DB: Create enrollment + Update progress
   ↓
7. API returns updated enrollment data
   ↓
8. Frontend updates SecurityProvider state
   ↓
9. UI shows enrolled status
```

### **Page Rendering Flow (Hybrid)**
```
1. User navigates to /dashboard
   ↓
2. Next.js routes to src/app/dashboard/page.tsx (RSC)
   ↓
3. Server fetches data from /api/user/dashboard
   ↓
4. Server pre-renders HTML with data
   ↓
5. HTML sent to browser (SEO-friendly)
   ↓
6. Browser hydrates <DashboardClient> (CSC)
   ↓
7. Client providers initialize (SecurityProvider, etc.)
   ↓
8. Interactive UI ready
```

---

## 🎯 **API Design Patterns**

### **RESTful Conventions**
```typescript
GET    /api/courses           # List all courses
GET    /api/courses/[slug]    # Get single course
POST   /api/courses           # Create course (admin)
PUT    /api/courses/[slug]    # Update course (admin)
DELETE /api/courses/[slug]    # Delete course (admin)
```

### **Response Format**
```typescript
// Success
{
  data: T,
  success: true
}

// Error
{
  error: string,
  success: false
}
```

### **Authentication Middleware**
```typescript
// Protected routes use NextAuth session
const session = await getServerSession(authOptions)
if (!session) {
  return new Response('Unauthorized', { status: 401 })
}
```

---

## 📊 **Performance Optimizations**

### **Backend**
- ✅ Database connection pooling (Prisma)
- ✅ Build-time content compilation (zero runtime I/O)
- ✅ Standalone output mode (minimal bundle)
- ✅ Image optimization (WebP/AVIF)
- ✅ API rate limiting

### **Frontend**
- ✅ Code splitting (Next.js automatic)
- ✅ Tree shaking (Webpack)
- ✅ Dynamic imports for heavy components
- ✅ CSS-in-JS with zero runtime (Tailwind)
- ✅ Optimized package imports (lucide-react, framer-motion)

### **Hybrid**
- ✅ Server Components for static content (no JS)
- ✅ Client Components only where needed
- ✅ Progressive enhancement
- ✅ Suspense boundaries for data fetching

---

## 🧪 **Testing Strategy**

### **Backend Testing**
- API route unit tests (Jest)
- Integration tests with test database
- Prisma migrations testing
- E2E API tests (Playwright)

### **Frontend Testing**
- Component unit tests (Jest + React Testing Library)
- Integration tests with MSW (Mock Service Worker)
- E2E tests (Playwright)
- Visual regression tests

---

## 📈 **Scalability Considerations**

### **Backend**
- Horizontal scaling (Render autoscaling)
- Database read replicas (Prisma supports)
- Redis caching layer (future)
- CDN for static assets

### **Frontend**
- Edge caching (Render CDN)
- Service worker (future)
- Client-side caching (React Query - future)

---

## 🔄 **Migration Path**

### **From Current to Future**
1. **API Layer** → tRPC (type-safe API)
2. **State Management** → Zustand (simpler than Context)
3. **Data Fetching** → React Query (server state)
4. **Forms** → React Hook Form + Zod
5. **Real-time** → WebSockets (Socket.io)

---

**Last Updated:** October 7, 2025
**Architecture Version:** 2.0 (Hybrid SSR/CSR)
**Maintained By:** AI Whisperers Development Team
