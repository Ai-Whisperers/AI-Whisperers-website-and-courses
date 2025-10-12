# API Schemas & Validation

**Version:** 1.0.0
**Last Updated:** October 12, 2025
**Validation Library:** Zod 3.x
**Type Safety:** Full TypeScript inference

---

## Table of Contents

1. [Overview](#overview)
2. [Zod Validation Schemas](#zod-validation-schemas)
3. [TypeScript Types](#typescript-types)
4. [Validation Patterns](#validation-patterns)
5. [Rate Limiting Configuration](#rate-limiting-configuration)
6. [Error Response Schemas](#error-response-schemas)
7. [Best Practices](#best-practices)

---

## Overview

The AI Whisperers API uses **Zod** for runtime validation and TypeScript type inference. All API inputs are validated before processing, ensuring type safety and data integrity.

**Key Features:**
- ✅ **Type-Safe**: TypeScript types inferred from Zod schemas
- ✅ **Runtime Validation**: Catch invalid inputs before processing
- ✅ **Detailed Errors**: Zod provides structured validation errors
- ✅ **Composable**: Schemas can be composed and reused
- ✅ **Transform**: Convert query parameters (strings → numbers/booleans)

**File:** `apps/web/src/lib/api-schemas.ts` (74 lines)

---

## Zod Validation Schemas

### Course Query Schema

Validates query parameters for `/api/courses` endpoint.

```typescript
import { z } from 'zod'

export const CourseQuerySchema = z.object({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

export type CourseQuery = z.infer<typeof CourseQuerySchema>
```

**Validation Rules:**
- `published`: Optional boolean
- `featured`: Optional boolean
- `difficulty`: Optional enum (4 values)
- `limit`: Optional positive integer, max 100
- `offset`: Optional non-negative integer

**TypeScript Type (Inferred):**
```typescript
type CourseQuery = {
  published?: boolean
  featured?: boolean
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  limit?: number
  offset?: number
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

// Type-safe access
const { published, featured, difficulty, limit, offset } = validation.data
```

**Example Validation:**
```typescript
// ✅ Valid
CourseQuerySchema.parse({
  published: true,
  difficulty: 'BEGINNER',
  limit: 10,
  offset: 0
}) // Success

// ❌ Invalid - difficulty
CourseQuerySchema.parse({
  difficulty: 'INVALID_LEVEL'
})
// ZodError: Invalid enum value. Expected 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

// ❌ Invalid - limit too high
CourseQuerySchema.parse({
  limit: 500
})
// ZodError: Number must be less than or equal to 100
```

---

### Course Slug Schema

Validates course slug parameters for `/api/courses/[slug]` endpoint.

```typescript
export const CourseSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export type CourseSlugParam = z.infer<typeof CourseSlugSchema>
```

**Validation Rules:**
- Minimum length: 1 character
- Maximum length: 100 characters
- Format: Lowercase alphanumeric with hyphens (kebab-case)
- Regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

**Valid Examples:**
```typescript
CourseSlugSchema.parse({ slug: 'ai-foundations' }) // ✅
CourseSlugSchema.parse({ slug: 'machine-learning-101' }) // ✅
CourseSlugSchema.parse({ slug: 'python3' }) // ✅
```

**Invalid Examples:**
```typescript
CourseSlugSchema.parse({ slug: 'AI-Foundations' }) // ❌ Uppercase
CourseSlugSchema.parse({ slug: 'ai_foundations' }) // ❌ Underscore
CourseSlugSchema.parse({ slug: 'ai foundations' }) // ❌ Space
CourseSlugSchema.parse({ slug: '-ai-foundations' }) // ❌ Leading hyphen
CourseSlugSchema.parse({ slug: 'ai-foundations-' }) // ❌ Trailing hyphen
```

---

### Content Page Schema

Validates page name parameters for `/api/content/[pageName]` endpoint.

```typescript
export const ContentPageSchema = z.object({
  pageName: z.enum([
    'homepage',
    'about',
    'contact',
    'services',
    'solutions',
    'faq',
    'privacy',
    'terms',
    'architecture',
  ]),
})

export type ContentPageName = z.infer<typeof ContentPageSchema>
```

**Validation Rules:**
- Must be one of the predefined page names
- No custom page names allowed

**TypeScript Type (Inferred):**
```typescript
type ContentPageName = {
  pageName: 'homepage' | 'about' | 'contact' | 'services' | 'solutions' | 'faq' | 'privacy' | 'terms' | 'architecture'
}
```

**Usage:**
```typescript
const pageValidation = ContentPageSchema.safeParse({ pageName: params.pageName })

if (!pageValidation.success) {
  return NextResponse.json(
    {
      error: 'Invalid page name',
      details: pageValidation.error.format(),
    },
    { status: 400 }
  )
}

const content = await getPageContent(pageValidation.data.pageName, language)
```

**Valid Examples:**
```typescript
ContentPageSchema.parse({ pageName: 'homepage' }) // ✅
ContentPageSchema.parse({ pageName: 'about' }) // ✅
ContentPageSchema.parse({ pageName: 'contact' }) // ✅
```

**Invalid Examples:**
```typescript
ContentPageSchema.parse({ pageName: 'blog' }) // ❌ Not in enum
ContentPageSchema.parse({ pageName: 'custom-page' }) // ❌ Not in enum
```

---

### API Error Schema

Schema for error responses (for documentation/testing).

```typescript
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
```

**TypeScript Type (Inferred):**
```typescript
type ApiError = {
  error: string
  message?: string
  details?: any
}
```

**Example Error Responses:**
```typescript
// Validation error
const validationError: ApiError = {
  error: 'Invalid query parameters',
  details: {
    difficulty: {
      _errors: ['Invalid enum value']
    }
  }
}

// Not found error
const notFoundError: ApiError = {
  error: 'Course not found',
  message: 'Course with slug "nonexistent" does not exist'
}

// Rate limit error
const rateLimitError: ApiError = {
  error: 'Too many requests',
  message: 'Rate limit exceeded. Please try again later.'
}
```

---

## TypeScript Types

### Inferred Types

All TypeScript types are **inferred from Zod schemas** using `z.infer`:

```typescript
// Schema definition
const CourseQuerySchema = z.object({
  published: z.boolean().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
})

// Type inference (automatically generated)
type CourseQuery = z.infer<typeof CourseQuerySchema>
// Equivalent to:
// type CourseQuery = {
//   published?: boolean
//   difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
// }
```

**Benefits:**
- ✅ Single source of truth (schema)
- ✅ Types always match runtime validation
- ✅ No manual type maintenance
- ✅ Compile-time and runtime type safety

### Custom Types

Additional types for API responses:

```typescript
// Course API response
interface CoursesResponse {
  success: true
  courses: Course[]
  count: number
  total: number
  limit: number
  offset: number
}

// Single course response
interface CourseResponse {
  success: true
  course: Course
}

// Error response
interface ErrorResponse {
  success: false
  error: string
  message?: string
  details?: any
}

// Union type for all responses
type ApiResponse<T> = T | ErrorResponse
```

---

## Validation Patterns

### Query Parameter Parsing

**Helper Function:** `parseQueryParams()`

```typescript
/**
 * Parse and validate query parameters
 * Converts string values to appropriate types (boolean, number)
 */
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

**Type Conversion:**
```typescript
// URL query string
?published=true&limit=10&difficulty=BEGINNER

// Converted to
{
  published: true,      // string "true" → boolean true
  limit: 10,            // string "10" → number 10
  difficulty: "BEGINNER" // string stays string
}
```

**Usage in API Routes:**
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
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

  // Type-safe access to validated data
  const { published, featured, difficulty, limit, offset } = validation.data

  // ... use validated data
}
```

---

### Path Parameter Validation

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params

  // Validate slug format
  const slugValidation = CourseSlugSchema.safeParse({ slug: resolvedParams.slug })

  if (!slugValidation.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid course slug',
        details: slugValidation.error.format(),
      },
      { status: 400 }
    )
  }

  // Type-safe access
  const { slug } = slugValidation.data

  // ... fetch course by slug
}
```

---

### Request Body Validation

```typescript
// Schema for POST /api/courses
const CreateCourseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  price: z.number().nonnegative(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  learningObjectives: z.array(z.string()).min(1).max(10),
  prerequisites: z.array(z.string()).max(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = CreateCourseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: validation.error.format(),
        },
        { status: 400 }
      )
    }

    // Type-safe access
    const courseData = validation.data

    // ... create course
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
```

---

## Rate Limiting Configuration

**File:** `apps/web/src/lib/rate-limit.ts` (178 lines)

### Rate Limit Config Schema

```typescript
interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number

  /**
   * Time window in milliseconds
   */
  windowMs: number
}
```

### Rate Limit Presets

```typescript
export const RateLimitPresets = {
  /**
   * Strict: 10 requests per minute
   * Use for: Sensitive operations, admin endpoints
   */
  STRICT: { max: 10, windowMs: 60 * 1000 },

  /**
   * Standard: 30 requests per minute
   * Use for: User-specific operations
   */
  STANDARD: { max: 30, windowMs: 60 * 1000 },

  /**
   * Generous: 100 requests per minute
   * Use for: Public endpoints (default)
   */
  GENEROUS: { max: 100, windowMs: 60 * 1000 },

  /**
   * API: 1000 requests per hour
   * Use for: High-throughput integrations
   */
  API: { max: 1000, windowMs: 60 * 60 * 1000 },
} as const
```

### Rate Limit Result

```typescript
interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean

  /**
   * Remaining requests in current window
   */
  remaining: number

  /**
   * Total limit for the window
   */
  limit: number

  /**
   * Time when the limit will reset (Unix timestamp)
   */
  reset: number
}
```

### Usage

```typescript
import { rateLimit, getIdentifier, RateLimitPresets } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const identifier = getIdentifier(request)
  const rateLimitResult = rateLimit(identifier, RateLimitPresets.GENEROUS)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  // Add rate limit headers to successful response
  const response = NextResponse.json({ ... })
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())

  return response
}
```

---

## Error Response Schemas

### Validation Error

**Structure:**
```typescript
{
  success: false,
  error: string,
  details: {
    [field: string]: {
      _errors: string[]
    }
  }
}
```

**Example:**
```json
{
  "success": false,
  "error": "Invalid query parameters",
  "details": {
    "difficulty": {
      "_errors": [
        "Invalid enum value. Expected 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT', received 'INVALID'"
      ]
    },
    "limit": {
      "_errors": [
        "Number must be less than or equal to 100"
      ]
    }
  }
}
```

---

### Authentication Error

**Structure:**
```typescript
{
  error: string
}
```

**Example:**
```json
{
  "error": "Unauthorized"
}
```

---

### Authorization Error

**Structure:**
```typescript
{
  error: string
}
```

**Example:**
```json
{
  "error": "Forbidden: Admin access required"
}
```

---

### Not Found Error

**Structure:**
```typescript
{
  success: false,
  error: string,
  message: string
}
```

**Example:**
```json
{
  "success": false,
  "error": "Course not found",
  "message": "Course with slug 'nonexistent-course' does not exist"
}
```

---

### Rate Limit Error

**Structure:**
```typescript
{
  error: string,
  message: string,
  retryAfter: number
}
```

**Example:**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696896000000
Retry-After: 45
```

---

### Server Error

**Structure:**
```typescript
{
  success: false,
  error: string,
  message: string
}
```

**Example:**
```json
{
  "success": false,
  "error": "Failed to fetch courses",
  "message": "Database connection failed"
}
```

---

## Best Practices

### 1. Always Validate Inputs

```typescript
// ✅ Good: Validate before processing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const validation = parseQueryParams(searchParams, CourseQuerySchema)

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 })
  }

  const data = validation.data // Type-safe
  // ... process data
}

// ❌ Bad: No validation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit')) // Unsafe
  // ... process data
}
```

---

### 2. Use Type Inference

```typescript
// ✅ Good: Infer types from schemas
const CourseSchema = z.object({ ... })
type Course = z.infer<typeof CourseSchema>

// ❌ Bad: Duplicate types
const CourseSchema = z.object({ ... })
type Course = { ... } // Manual duplication
```

---

### 3. Provide Detailed Errors

```typescript
// ✅ Good: Include validation details
if (!validation.success) {
  return NextResponse.json(
    {
      error: 'Invalid query parameters',
      details: validation.error.format(), // Structured error details
    },
    { status: 400 }
  )
}

// ❌ Bad: Generic error
if (!validation.success) {
  return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}
```

---

### 4. Use safeParse for Validation

```typescript
// ✅ Good: Use safeParse (no exceptions)
const result = schema.safeParse(data)
if (!result.success) {
  // Handle error
  console.error(result.error)
}

// ❌ Bad: Use parse (throws exceptions)
try {
  const data = schema.parse(input) // May throw
} catch (error) {
  // Exception handling
}
```

---

### 5. Compose Schemas

```typescript
// Base schemas
const PaginationSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

const SortSchema = z.object({
  sortBy: z.enum(['title', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Composed schema
const CourseQuerySchema = z.object({
  published: z.boolean().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
}).merge(PaginationSchema).merge(SortSchema)
```

---

### 6. Add Custom Validation

```typescript
const CourseSchema = z.object({
  title: z.string().min(3).max(200),
  price: z.number().nonnegative(),
}).refine(
  (data) => {
    // Custom validation: Free courses must have "Free" in title
    if (data.price === 0 && !data.title.toLowerCase().includes('free')) {
      return false
    }
    return true
  },
  {
    message: 'Free courses must include "Free" in the title',
    path: ['title'],
  }
)
```

---

### 7. Document Schemas

```typescript
/**
 * Course query parameters schema
 *
 * Validates query parameters for GET /api/courses
 *
 * @example
 * ```typescript
 * const validation = parseQueryParams(searchParams, CourseQuerySchema)
 * if (validation.success) {
 *   const { published, difficulty, limit } = validation.data
 * }
 * ```
 */
export const CourseQuerySchema = z.object({
  /** Filter by published status */
  published: z.boolean().optional(),

  /** Filter by difficulty level */
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),

  /** Number of results to return (max: 100) */
  limit: z.number().int().positive().max(100).optional(),

  /** Number of results to skip */
  offset: z.number().int().nonnegative().optional(),
})
```

---

## Summary

The AI Whisperers API schemas provide:

✅ **Runtime Validation**: Zod schemas validate all inputs
✅ **Type Safety**: TypeScript types inferred from schemas
✅ **Detailed Errors**: Structured validation error messages
✅ **Composability**: Schemas can be composed and reused
✅ **Rate Limiting**: Configurable presets for different use cases
✅ **Error Consistency**: Standardized error response formats

**Key Files:**
- Schemas: `apps/web/src/lib/api-schemas.ts` (74 lines)
- Rate Limiting: `apps/web/src/lib/rate-limit.ts` (178 lines)
- Validation Helper: `parseQueryParams()` function

**Related Documentation:**
- [06-api-overview.md](./06-api-overview.md) - API architecture
- [07-api-routes.md](./07-api-routes.md) - Endpoint reference
- [32-security-patterns.md](./32-security-patterns.md) - Security validation

---

*Last Updated: October 12, 2025 - Complete schema validation and type safety documentation.*
