# API Architecture & Overview

**Version:** 1.0.0
**Last Updated:** October 12, 2025
**Status:** Production-Ready
**API Version:** v1 (Implicit)

---

## Table of Contents

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [RESTful Design Principles](#restful-design-principles)
4. [Authentication](#authentication)
5. [Rate Limiting](#rate-limiting)
6. [Middleware](#middleware)
7. [Error Handling](#error-handling)
8. [Security Patterns](#security-patterns)
9. [Caching Strategy](#caching-strategy)
10. [API Response Format](#api-response-format)

---

## Overview

The AI Whisperers platform provides a **RESTful API** built on Next.js 15 App Router with comprehensive authentication, rate limiting, and validation. The API follows clean architecture principles with clear separation between routes, business logic, and data access.

**Key Features:**
- ✅ **RESTful Design**: Standard HTTP methods and status codes
- ✅ **Type-Safe Validation**: Zod schemas for all inputs
- ✅ **Rate Limiting**: In-memory rate limiting with 4 presets
- ✅ **Authentication**: NextAuth v5 with Google/GitHub OAuth
- ✅ **Role-Based Access**: STUDENT, INSTRUCTOR, ADMIN roles
- ✅ **Error Handling**: Consistent error responses
- ✅ **Logging**: Structured logging with Winston-style logger
- ✅ **Caching**: HTTP caching headers for static content

**API Endpoints:** 12 routes across 5 domains
- **Public**: `/api/health`, `/api/courses`, `/api/content`
- **Protected**: `/api/user/*` (authentication required)
- **Admin**: `/api/admin/*` (admin/instructor role required)
- **Auth**: `/api/auth/*` (NextAuth.js)
- **System**: `/api/architecture` (system visualization)

---

## API Architecture

### System Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                       API ARCHITECTURE                            │
└──────────────────────────────────────────────────────────────────┘

1. CLIENT REQUEST
   ├─ HTTP Request (GET, POST, PUT, DELETE)
   └─ Headers (Authorization, Content-Type, Accept-Language)

2. MIDDLEWARE LAYER (middleware.ts)
   ├─ Rate Limiting (100 req/min)
   ├─ i18n Routing (EN/ES)
   ├─ Locale Detection
   └─ Response Headers

3. API ROUTE HANDLER (route.ts)
   ├─ Authentication Check (NextAuth v5)
   ├─ Authorization (Role-based)
   ├─ Input Validation (Zod schemas)
   └─ Business Logic

4. APPLICATION LAYER (Use Cases)
   ├─ Domain Logic Orchestration
   ├─ Transaction Management
   └─ Event Dispatching

5. DOMAIN LAYER (Entities & Value Objects)
   ├─ Business Rules
   ├─ Domain Validation
   └─ Invariants

6. INFRASTRUCTURE LAYER (Repositories)
   ├─ Database Access (Prisma)
   ├─ External APIs
   └─ File Storage

7. RESPONSE
   ├─ JSON Formatting
   ├─ Status Code
   ├─ Cache Headers
   └─ Rate Limit Headers
```

### File Structure

```
apps/web/src/
├── app/api/                      # API Routes (Next.js App Router)
│   ├── auth/[...nextauth]/
│   │   └── route.ts              # NextAuth.js handler
│   ├── courses/
│   │   ├── route.ts              # GET /api/courses (list)
│   │   ├── [slug]/route.ts       # GET /api/courses/:slug (detail)
│   │   └── stats/route.ts        # GET /api/courses/stats
│   ├── user/
│   │   ├── dashboard/route.ts    # GET /api/user/dashboard
│   │   ├── achievements/route.ts # GET /api/user/achievements
│   │   ├── progress/route.ts     # GET /api/user/progress
│   │   └── courses/
│   │       └── enrolled/route.ts # GET /api/user/courses/enrolled
│   ├── admin/
│   │   └── stats/route.ts        # GET /api/admin/stats
│   ├── content/
│   │   └── [pageName]/route.ts   # GET /api/content/:pageName
│   ├── architecture/route.ts     # GET /api/architecture
│   └── health/route.ts           # GET /api/health
│
├── lib/
│   ├── auth/
│   │   └── auth.config.ts        # NextAuth v5 configuration
│   ├── api-schemas.ts            # Zod validation schemas
│   ├── rate-limit.ts             # Rate limiting utility
│   ├── logger.ts                 # Logging utility
│   └── db/
│       └── prisma.ts             # Prisma client
│
└── middleware.ts                 # Global middleware (rate limit + i18n)
```

---

## RESTful Design Principles

### HTTP Methods

The API follows standard RESTful conventions:

| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| GET | Retrieve resources | ✅ | ✅ |
| POST | Create resources | ❌ | ❌ |
| PUT | Update/replace resources | ✅ | ❌ |
| PATCH | Partial update | ❌ | ❌ |
| DELETE | Remove resources | ✅ | ❌ |

**Current Implementation:**
- ✅ GET: Used for all read operations
- ⏳ POST: Planned for enrollment, content submission
- ⏳ PUT/PATCH: Planned for course updates, profile updates
- ⏳ DELETE: Planned for enrollment cancellation

### Status Codes

Standard HTTP status codes used consistently:

#### Success (2xx)
- **200 OK**: Successful GET request
- **201 Created**: Resource created successfully (POST)
- **204 No Content**: Successful DELETE with no response body

#### Client Errors (4xx)
- **400 Bad Request**: Invalid input, validation error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded

#### Server Errors (5xx)
- **500 Internal Server Error**: Unexpected server error
- **503 Service Unavailable**: Service temporarily unavailable

### Resource Naming

**Pattern:** `/api/resource` or `/api/resource/id` or `/api/resource/id/subresource`

**Examples:**
```
✅ Good:
GET /api/courses              # List courses
GET /api/courses/ai-101       # Get specific course by slug
GET /api/user/courses/enrolled # User's enrolled courses

❌ Bad:
GET /api/getCourses           # Don't use verbs in URL
GET /api/course              # Use plural nouns
GET /api/courses/get/ai-101  # Don't add action verbs
```

### Query Parameters

Used for filtering, sorting, pagination:

```
GET /api/courses?published=true&difficulty=BEGINNER&limit=10&offset=0
```

**Standard Parameters:**
- `limit`: Number of results to return (default: 100, max: 100)
- `offset`: Number of results to skip (default: 0)
- `published`: Filter by published status (boolean)
- `featured`: Filter by featured status (boolean)
- `difficulty`: Filter by difficulty (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `lang`: Language code (en, es) for localized content

---

## Authentication

### NextAuth v5

**Configuration:** `apps/web/src/lib/auth/auth.config.ts` (152 lines)

The platform uses **NextAuth.js v5** with database sessions for authentication.

#### Key Features

```typescript
// NextAuth v5 Configuration
import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider, GitHubProvider], // Dynamic based on env vars

  session: {
    strategy: 'database',              // Database-backed sessions
    maxAge: 30 * 24 * 60 * 60,        // 30 days
    updateAge: 24 * 60 * 60,           // Update every 24 hours
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    async session({ session, user }) {
      // Add custom properties to session
      session.user.id = user.id
      session.user.role = (user as any).role || 'STUDENT'
      session.user.emailVerified = user.emailVerified
      return session
    },
  },
}

export const { auth, handlers, signIn, signOut } = NextAuth(config)
```

#### OAuth Providers

**Supported:**
- ✅ **Google OAuth 2.0**
- ✅ **GitHub OAuth**

**Configuration (Environment Variables):**
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_random_secret
```

**Providers are dynamically loaded based on available environment variables.**

#### Session Management

**Database Sessions:**
- Sessions stored in `sessions` table (PostgreSQL)
- Session tokens stored in cookies: `next-auth.session-token`
- Automatic session rotation every 24 hours
- Expires after 30 days of inactivity

**Session Structure:**
```typescript
interface Session {
  user: {
    id: string                    // User database ID
    name?: string | null
    email?: string | null
    image?: string | null
    role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
    emailVerified?: Date | null
  }
  expires: string                 // ISO 8601 expiration date
}
```

#### Protected Routes

**Server Components:**
```typescript
import { auth } from '@/lib/auth/auth.config'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // User is authenticated
  const userId = session.user.id
  const userRole = session.user.role

  // ... handle request
}
```

**Client Components:**
```typescript
'use client'
import { useSession } from 'next-auth/react'

export function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <Loading />
  if (status === 'unauthenticated') return <SignIn />

  return <div>Welcome, {session.user.name}!</div>
}
```

#### Role-Based Authorization

**Roles:**
- **STUDENT**: Default role, can enroll in courses
- **INSTRUCTOR**: Can create and manage courses
- **ADMIN**: Full platform access

**Authorization Check:**
```typescript
// Check for admin/instructor role
const session = await auth()

if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const userRole = (session.user as any)?.role
if (userRole !== 'admin' && userRole !== 'instructor') {
  return NextResponse.json(
    { error: 'Forbidden: Admin access required' },
    { status: 403 }
  )
}
```

#### Authentication Flow

```
1. User clicks "Sign in with Google"
   └─> POST /api/auth/signin/google

2. Redirect to Google OAuth consent screen
   └─> User grants permissions

3. Google redirects back with authorization code
   └─> GET /api/auth/callback/google

4. NextAuth exchanges code for tokens
   └─> Creates user in database (if new)
   └─> Creates session record
   └─> Sets session cookie

5. User is authenticated
   └─> All API requests include session cookie
   └─> Server validates session on each request
```

---

## Rate Limiting

### Implementation

**File:** `apps/web/src/lib/rate-limit.ts` (178 lines)

The platform uses **in-memory rate limiting** to prevent API abuse.

#### Rate Limit Configuration

```typescript
export interface RateLimitConfig {
  max: number        // Maximum requests in window
  windowMs: number   // Time window in milliseconds
}

export const RateLimitPresets = {
  STRICT: { max: 10, windowMs: 60 * 1000 },      // 10 req/min
  STANDARD: { max: 30, windowMs: 60 * 1000 },    // 30 req/min
  GENEROUS: { max: 100, windowMs: 60 * 1000 },   // 100 req/min (default)
  API: { max: 1000, windowMs: 60 * 60 * 1000 },  // 1000 req/hour
}
```

#### Middleware Integration

**File:** `apps/web/src/middleware.ts` (207 lines)

Rate limiting is applied globally to all API routes:

```typescript
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apply rate limiting to ALL API routes
  if (pathname.startsWith('/api/')) {
    const identifier = getIdentifier(request)
    const rateLimitResult = rateLimit(identifier, RateLimitPresets.GENEROUS)

    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
    return response
  }

  // ... rest of middleware
}
```

#### Identifier Strategy

Rate limits are applied per IP address:

```typescript
export function getIdentifier(request: Request): string {
  // Try x-forwarded-for header (proxied environments)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Try x-real-ip header
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to generic identifier
  return 'anonymous'
}
```

#### Rate Limit Headers

All API responses include rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696896000000
```

When rate limit is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696896000000

{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

#### Production Considerations

**Current:** In-memory rate limiting (suitable for single instance)

**Production Recommendations:**
- Use Redis for distributed rate limiting across multiple instances
- Implement tiered rate limits based on user roles (higher limits for paid users)
- Add IP whitelist for trusted integrations
- Implement exponential backoff for repeated violations

---

## Middleware

### Global Middleware

**File:** `apps/web/src/middleware.ts` (207 lines)

The middleware handles two primary concerns:

1. **Rate Limiting** for API routes
2. **i18n Routing** for page routes

#### Middleware Flow

```
Request → Middleware
  ├─ Is API route? (/api/*)
  │   ├─ Yes: Apply rate limiting
  │   │   ├─ Check rate limit
  │   │   ├─ Return 429 if exceeded
  │   │   └─ Add rate limit headers
  │   └─ Continue to API handler
  │
  └─ Is page route? (/*, /about, /courses, etc.)
      ├─ Yes: Apply i18n routing
      │   ├─ Detect locale (URL > Cookie > Accept-Language > Default)
      │   ├─ Rewrite URL (/es/courses → /courses with locale header)
      │   ├─ Set locale cookie
      │   └─ Add locale header (x-locale: es)
      └─ Continue to page
```

#### i18n Routing

**Locale Detection Priority:**
1. **URL Path**: `/es/courses` → `es`
2. **Cookie**: `NEXT_LOCALE=es`
3. **Accept-Language Header**: `es-ES,es;q=0.9`
4. **Default**: `en`

**Example:**
```typescript
function getLocale(request: NextRequest): Language {
  // 1. Check URL path
  const pathnameLocale = getLocaleFromPathname(request.nextUrl.pathname)
  if (pathnameLocale) return pathnameLocale

  // 2. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isValidLanguage(cookieLocale)) {
    return cookieLocale
  }

  // 3. Check Accept-Language header
  if (i18nConfig.autoDetect) {
    const browserLocale = getLocaleFromAcceptLanguage(request)
    if (browserLocale) return browserLocale
  }

  // 4. Return default
  return 'en'
}
```

**URL Rewriting:**
```
/es/courses → Rewrite to /courses
              Add header: x-locale: es
              Set cookie: NEXT_LOCALE=es

/courses    → No rewrite
              Add header: x-locale: en (from cookie/default)
```

#### Middleware Matcher

```typescript
export const config = {
  matcher: [
    // Run middleware on all routes except:
    '/((?!api|_next/static|_next/image|images|fonts|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
```

**Skipped Paths:**
- `/api/*` - Handled separately for rate limiting
- `/_next/static/*` - Next.js static assets
- `/_next/image/*` - Next.js image optimization
- `/images/*`, `/fonts/*` - Static files
- `favicon.ico`, `robots.txt`, `sitemap.xml` - Root files

---

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```typescript
interface ApiErrorResponse {
  success?: false
  error: string             // Error type/code
  message?: string          // Human-readable message
  details?: any             // Additional error details (e.g., validation errors)
}
```

### Error Examples

#### 400 Bad Request (Validation Error)

```http
POST /api/courses
Content-Type: application/json

{
  "difficulty": "INVALID_LEVEL"
}
```

Response:
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "Invalid query parameters",
  "details": {
    "difficulty": {
      "_errors": ["Invalid enum value. Expected 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'"]
    }
  }
}
```

#### 401 Unauthorized

```http
GET /api/user/dashboard
```

Response:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Unauthorized"
}
```

#### 403 Forbidden

```http
GET /api/admin/stats
Authorization: Bearer <student-token>
```

Response:
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden: Admin access required"
}
```

#### 404 Not Found

```http
GET /api/courses/nonexistent-course
```

Response:
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "error": "Course not found",
  "message": "Course with slug 'nonexistent-course' does not exist"
}
```

#### 429 Too Many Requests

```http
GET /api/courses
# (101st request in 1 minute)
```

Response:
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696896000000

{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

#### 500 Internal Server Error

```http
GET /api/courses
```

Response:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "success": false,
  "error": "Failed to fetch courses",
  "message": "Database connection failed"
}
```

### Error Handling Pattern

```typescript
export async function GET(request: NextRequest) {
  try {
    // Validate input
    const validation = parseQueryParams(searchParams, CourseQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.format(),
        },
        { status: 400 }
      )
    }

    // Business logic
    const courses = await getCourses(validation.data)

    // Success response
    return NextResponse.json({
      success: true,
      courses,
    })

  } catch (error) {
    // Log error
    logger.apiError('/api/courses', error)

    // Error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

---

## Security Patterns

### Input Validation

All API inputs are validated using **Zod schemas** before processing.

**File:** `apps/web/src/lib/api-schemas.ts` (74 lines)

```typescript
import { z } from 'zod'

// Course query parameters schema
export const CourseQuerySchema = z.object({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

export type CourseQuery = z.infer<typeof CourseQuerySchema>

// Helper to parse and validate query parameters
export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const params: Record<string, any> = {}

  searchParams.forEach((value, key) => {
    // Convert boolean strings
    if (value === 'true') params[key] = true
    else if (value === 'false') params[key] = false
    // Convert numbers
    else if (!isNaN(Number(value))) params[key] = Number(value)
    // Keep as string
    else params[key] = value
  })

  const result = schema.safeParse(params)
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}
```

**Usage:**
```typescript
const { searchParams } = new URL(request.url)
const validation = parseQueryParams(searchParams, CourseQuerySchema)

if (!validation.success) {
  return NextResponse.json(
    {
      error: 'Invalid query parameters',
      details: validation.error.format(),
    },
    { status: 400 }
  )
}

// Type-safe access to validated data
const { published, featured, difficulty, limit, offset } = validation.data
```

### SQL Injection Prevention

**Prisma ORM** provides automatic SQL injection protection:

```typescript
// ✅ Safe: Prisma uses parameterized queries
const courses = await prisma.course.findMany({
  where: { slug: userInput }  // Automatically escaped
})

// ❌ Unsafe: Raw SQL (only use with caution)
const courses = await prisma.$queryRaw`
  SELECT * FROM courses WHERE slug = ${userInput}  // Still safe with Prisma
`
```

### XSS Prevention

**Next.js automatically escapes JSX output**, preventing XSS attacks.

**API responses are JSON** (not HTML), further reducing XSS risk.

### CSRF Protection

**NextAuth.js provides built-in CSRF protection** for authentication endpoints.

**Database sessions** ensure session tokens are validated server-side.

### Rate Limiting

See [Rate Limiting](#rate-limiting) section above.

### HTTPS Enforcement

**Production:** Render.com provides automatic HTTPS with Let's Encrypt certificates.

**Redirect HTTP → HTTPS** enforced by Render.com infrastructure.

---

## Caching Strategy

### HTTP Caching Headers

#### Static Content API

```typescript
// /api/content/[pageName] - Cached for 1 hour, stale-while-revalidate for 24 hours
return NextResponse.json(content, {
  headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  },
})
```

**Explanation:**
- `public`: Response can be cached by CDN and browsers
- `max-age=3600`: Fresh for 1 hour (3600 seconds)
- `stale-while-revalidate=86400`: Serve stale content while revalidating for 24 hours

#### Dynamic API Routes

```typescript
// /api/user/dashboard - No caching (always fresh)
return NextResponse.json(data)  // Default: no caching
```

### Caching Matrix

| Endpoint | Cache | Max Age | Stale-While-Revalidate | Rationale |
|----------|-------|---------|------------------------|-----------|
| `/api/health` | No | 0 | 0 | Always check current status |
| `/api/courses` | Yes | 5 min | 1 hour | Course list changes infrequently |
| `/api/courses/:slug` | Yes | 1 hour | 24 hours | Individual courses rarely change |
| `/api/content/:pageName` | Yes | 1 hour | 24 hours | Static content |
| `/api/user/*` | No | 0 | 0 | User-specific, always fresh |
| `/api/admin/*` | No | 0 | 0 | Admin data, always fresh |

---

## API Response Format

### Success Responses

#### List Response

```json
{
  "success": true,
  "courses": [...],
  "count": 10,
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

#### Single Resource Response

```json
{
  "success": true,
  "course": {
    "id": "clxy123abc",
    "title": "AI Foundations",
    "slug": "ai-foundations",
    "difficulty": "BEGINNER",
    ...
  }
}
```

#### Minimal Response

```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T10:30:00.000Z"
}
```

### Error Responses

See [Error Handling](#error-handling) section above.

### Pagination

**Query Parameters:**
- `limit`: Number of results (default: 100, max: 100)
- `offset`: Number to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "courses": [...],
  "count": 10,       // Number in this response
  "total": 50,       // Total available
  "limit": 10,       // Requested limit
  "offset": 0        // Requested offset
}
```

**Next Page:**
```
/api/courses?limit=10&offset=10
```

---

## Summary

The AI Whisperers API provides:

✅ **RESTful Design**: Standard HTTP methods and resource naming
✅ **Type-Safe Validation**: Zod schemas for all inputs
✅ **Authentication**: NextAuth v5 with Google/GitHub OAuth
✅ **Authorization**: Role-based access control (STUDENT, INSTRUCTOR, ADMIN)
✅ **Rate Limiting**: 100 requests/minute per IP (configurable)
✅ **Error Handling**: Consistent error responses with proper status codes
✅ **Security**: Input validation, SQL injection prevention, CSRF protection
✅ **Caching**: HTTP caching headers for static content
✅ **Logging**: Structured logging for debugging and monitoring

**Key Files:**
- Middleware: `apps/web/src/middleware.ts` (207 lines)
- Auth Config: `apps/web/src/lib/auth/auth.config.ts` (152 lines)
- Rate Limiting: `apps/web/src/lib/rate-limit.ts` (178 lines)
- Validation: `apps/web/src/lib/api-schemas.ts` (74 lines)
- API Routes: `apps/web/src/app/api/**/*.ts` (12 routes)

**Related Documentation:**
- [07-api-routes.md](./07-api-routes.md) - Complete endpoint reference
- [08-api-schemas.md](./08-api-schemas.md) - Validation schemas
- [31-nextauth-config.md](./31-nextauth-config.md) - Authentication deep dive
- [38-rate-limiting.md](./38-rate-limiting.md) - Rate limiting details

---

*Last Updated: October 12, 2025 - Documentation reflects NextAuth v5 migration and production-ready API architecture.*
