# API Routes Reference

**Version:** 1.0.0
**Last Updated:** October 12, 2025
**Total Endpoints:** 12 routes
**Base URL:** `https://aiwhisperers.com/api` (Production) | `http://localhost:3000/api` (Development)

---

## Table of Contents

1. [Public Endpoints](#public-endpoints)
2. [Protected Endpoints](#protected-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Authentication Endpoints](#authentication-endpoints)
5. [System Endpoints](#system-endpoints)

---

## Public Endpoints

Accessible without authentication.

### GET /api/health

Health check endpoint for monitoring application status.

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/health
```

#### Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T10:30:00.000Z",
  "services": {
    "application": "running",
    "api": "operational"
  },
  "version": "0.1.0",
  "environment": "production"
}
```

#### Response (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "error": "Database connection failed",
  "timestamp": "2025-10-12T10:30:00.000Z",
  "services": {
    "application": "running",
    "api": "operational"
  }
}
```

#### Example

```bash
curl https://aiwhisperers.com/api/health
```

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/health')
const health = await response.json()
console.log(health.status) // "healthy"
```

---

### GET /api/courses

Retrieve list of courses with filtering and pagination.

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/courses?published=true&difficulty=BEGINNER&limit=10&offset=0
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `published` | boolean | No | - | Filter by published status |
| `featured` | boolean | No | - | Filter by featured status |
| `difficulty` | enum | No | - | Filter by difficulty (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT) |
| `limit` | number | No | 100 | Number of results to return (max: 100) |
| `offset` | number | No | 0 | Number of results to skip |

#### Response (200 OK)

```json
{
  "success": true,
  "courses": [
    {
      "id": "clxy123abc",
      "title": "AI Foundations",
      "description": "Learn the fundamentals of artificial intelligence",
      "slug": "ai-foundations",
      "price": 49.99,
      "currency": "USD",
      "durationHours": 10,
      "difficulty": "BEGINNER",
      "published": true,
      "featured": true,
      "learningObjectives": [
        "Understand AI concepts",
        "Build ML models"
      ],
      "prerequisites": [],
      "thumbnailUrl": "https://...",
      "instructorId": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  ],
  "count": 10,
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

#### Response (400 Bad Request)

```json
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

#### Response (429 Too Many Requests)

```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

#### Example

```bash
# Get all published courses
curl "https://aiwhisperers.com/api/courses?published=true"

# Get beginner courses with pagination
curl "https://aiwhisperers.com/api/courses?difficulty=BEGINNER&limit=10&offset=0"

# Get featured courses
curl "https://aiwhisperers.com/api/courses?featured=true&published=true"
```

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/courses?published=true&limit=10')
const data = await response.json()

if (data.success) {
  console.log(`Showing ${data.count} of ${data.total} courses`)
  data.courses.forEach(course => {
    console.log(`${course.title} - ${course.difficulty}`)
  })
}
```

---

### GET /api/courses/[slug]

Retrieve specific course by slug.

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/courses/ai-foundations
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Course URL slug (e.g., "ai-foundations") |

#### Response (200 OK)

```json
{
  "success": true,
  "course": {
    "id": "clxy123abc",
    "title": "AI Foundations",
    "description": "Learn the fundamentals of artificial intelligence and machine learning",
    "slug": "ai-foundations",
    "price": 49.99,
    "currency": "USD",
    "durationHours": 10,
    "difficulty": "BEGINNER",
    "published": true,
    "featured": true,
    "learningObjectives": [
      "Understand core AI concepts",
      "Build basic ML models",
      "Apply AI to real problems"
    ],
    "prerequisites": [],
    "thumbnailUrl": "https://...",
    "videoUrl": "https://...",
    "instructorId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z"
  }
}
```

#### Response (404 Not Found)

```json
{
  "success": false,
  "error": "Course not found",
  "message": "Course with slug 'nonexistent-course' does not exist"
}
```

#### Example

```bash
curl https://aiwhisperers.com/api/courses/ai-foundations
```

```javascript
// JavaScript/TypeScript
async function getCourseBySlug(slug: string) {
  const response = await fetch(`/api/courses/${slug}`)
  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message || 'Course not found')
  }

  return data.course
}

const course = await getCourseBySlug('ai-foundations')
console.log(course.title) // "AI Foundations"
```

---

### GET /api/courses/stats

Retrieve course statistics and metrics.

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/courses/stats
```

#### Response (200 OK)

```json
{
  "success": true,
  "stats": {
    "totalCourses": 25,
    "publishedCourses": 20,
    "featuredCourses": 5,
    "byDifficulty": {
      "BEGINNER": 8,
      "INTERMEDIATE": 7,
      "ADVANCED": 4,
      "EXPERT": 1
    },
    "averagePrice": 89.99,
    "totalDurationHours": 250
  }
}
```

#### Example

```bash
curl https://aiwhisperers.com/api/courses/stats
```

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/courses/stats')
const { stats } = await response.json()

console.log(`Total courses: ${stats.totalCourses}`)
console.log(`Beginner courses: ${stats.byDifficulty.BEGINNER}`)
```

---

### GET /api/content/[pageName]

Retrieve compiled page content with multi-language support.

**Authentication:** None required
**Rate Limit:** 100 requests/minute
**Cache:** 1 hour (max-age), 24 hours (stale-while-revalidate)

#### Request

```http
GET /api/content/homepage?lang=en
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageName` | enum | Yes | Page name (homepage, about, contact, services, solutions, faq, privacy, terms, architecture) |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lang` | enum | No | en | Language code (en, es) |

#### Response (200 OK)

```json
{
  "meta": {
    "title": "AI Whisperers - Master AI with World-Class Education",
    "description": "Comprehensive AI courses from beginner to expert",
    "keywords": ["AI courses", "artificial intelligence", "machine learning"],
    "language": "en"
  },
  "hero": {
    "headline": "Master AI with World-Class Education",
    "subheadline": "Transform your career with comprehensive AI courses",
    "description": "Learn artificial intelligence through hands-on projects...",
    "primaryCta": {
      "text": "Start Learning Today",
      "href": "/courses",
      "variant": "default"
    },
    "benefits": [...]
  },
  "features": [...],
  "stats": {...},
  "contact": {...},
  "footer": {...}
}
```

#### Response (400 Bad Request)

```json
{
  "error": "Invalid page name",
  "details": {
    "pageName": {
      "_errors": ["Invalid enum value"]
    }
  }
}
```

#### Response Headers

```http
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

#### Example

```bash
# Get homepage content in English
curl "https://aiwhisperers.com/api/content/homepage?lang=en"

# Get about page in Spanish
curl "https://aiwhisperers.com/api/content/about?lang=es"
```

```javascript
// JavaScript/TypeScript
async function getPageContent(pageName: string, lang: 'en' | 'es' = 'en') {
  const response = await fetch(`/api/content/${pageName}?lang=${lang}`)
  return await response.json()
}

const homepage = await getPageContent('homepage', 'en')
console.log(homepage.meta.title)
```

---

## Protected Endpoints

Require authentication (NextAuth session).

### GET /api/user/dashboard

Retrieve user dashboard overview with stats and recent activity.

**Authentication:** Required (any authenticated user)
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/user/dashboard
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK)

```json
{
  "user": {
    "id": "clxy456def",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://..."
  },
  "stats": {
    "coursesEnrolled": 3,
    "hoursLearned": 15.5,
    "achievements": 5,
    "currentStreak": 7
  },
  "recentActivity": [
    {
      "type": "lesson_completed",
      "courseTitle": "AI Foundations",
      "lessonTitle": "Introduction to Machine Learning",
      "timestamp": "2025-10-12T09:00:00.000Z"
    }
  ],
  "enrolledCourses": [
    {
      "id": "clxy123abc",
      "title": "AI Foundations",
      "progress": 45,
      "lastAccessed": "2025-10-12T09:00:00.000Z"
    }
  ],
  "upcomingLessons": [
    {
      "courseTitle": "AI Foundations",
      "lessonTitle": "Neural Networks Basics",
      "scheduledFor": "2025-10-13T10:00:00.000Z"
    }
  ]
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

#### Example

```bash
# With session cookie
curl -H "Cookie: next-auth.session-token=<token>" \
     https://aiwhisperers.com/api/user/dashboard
```

```javascript
// JavaScript/TypeScript (client-side with NextAuth)
import { useSession } from 'next-auth/react'

function Dashboard() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetch('/api/user/dashboard')
        .then(res => res.json())
        .then(data => console.log(data))
    }
  }, [session])
}
```

---

### GET /api/user/achievements

Retrieve user achievements and badges.

**Authentication:** Required (any authenticated user)
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/user/achievements
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK)

```json
{
  "achievements": [
    {
      "id": "first-course",
      "title": "First Steps",
      "description": "Enrolled in your first course",
      "icon": "trophy",
      "unlockedAt": "2025-10-01T00:00:00.000Z"
    },
    {
      "id": "week-streak",
      "title": "Week Warrior",
      "description": "Maintained a 7-day learning streak",
      "icon": "fire",
      "unlockedAt": "2025-10-08T00:00:00.000Z"
    }
  ],
  "totalAchievements": 2,
  "points": 150
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

---

### GET /api/user/progress

Retrieve user's course progress across all enrolled courses.

**Authentication:** Required (any authenticated user)
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/user/progress
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK)

```json
{
  "progress": [
    {
      "courseId": "clxy123abc",
      "courseTitle": "AI Foundations",
      "completedLessons": 9,
      "totalLessons": 20,
      "progressPercent": 45,
      "lastAccessedAt": "2025-10-12T09:00:00.000Z",
      "startedAt": "2025-10-01T00:00:00.000Z",
      "completedAt": null
    },
    {
      "courseId": "clxy789ghi",
      "courseTitle": "Applied Machine Learning",
      "completedLessons": 15,
      "totalLessons": 15,
      "progressPercent": 100,
      "lastAccessedAt": "2025-10-10T15:00:00.000Z",
      "startedAt": "2025-09-15T00:00:00.000Z",
      "completedAt": "2025-10-10T15:00:00.000Z"
    }
  ],
  "overallProgress": {
    "totalCoursesEnrolled": 3,
    "completedCourses": 1,
    "inProgressCourses": 2,
    "totalHoursLearned": 15.5
  }
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

---

### GET /api/user/courses/enrolled

Retrieve list of courses the user is enrolled in.

**Authentication:** Required (any authenticated user)
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/user/courses/enrolled
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK)

```json
{
  "courses": [
    {
      "id": "clxy123abc",
      "title": "AI Foundations",
      "slug": "ai-foundations",
      "thumbnailUrl": "https://...",
      "difficulty": "BEGINNER",
      "enrolledAt": "2025-10-01T00:00:00.000Z",
      "progress": 45,
      "lastAccessedAt": "2025-10-12T09:00:00.000Z"
    },
    {
      "id": "clxy456def",
      "title": "Deep Learning Fundamentals",
      "slug": "deep-learning-fundamentals",
      "thumbnailUrl": "https://...",
      "difficulty": "INTERMEDIATE",
      "enrolledAt": "2025-09-15T00:00:00.000Z",
      "progress": 30,
      "lastAccessedAt": "2025-10-11T14:00:00.000Z"
    }
  ],
  "total": 2
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

#### Example

```javascript
// JavaScript/TypeScript
async function getEnrolledCourses() {
  const response = await fetch('/api/user/courses/enrolled')

  if (response.status === 401) {
    throw new Error('Not authenticated')
  }

  const data = await response.json()
  return data.courses
}

const courses = await getEnrolledCourses()
console.log(`Enrolled in ${courses.length} courses`)
```

---

## Admin Endpoints

Require authentication AND admin/instructor role.

### GET /api/admin/stats

Retrieve platform statistics and metrics for administrators.

**Authentication:** Required (admin or instructor role)
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/admin/stats
Cookie: next-auth.session-token=<admin-session-token>
```

#### Response (200 OK)

```json
{
  "totalUsers": 1250,
  "activeCourses": 25,
  "totalRevenue": 45678.90,
  "completionRate": 67.5,
  "newUsersThisMonth": 185,
  "activeSubscriptions": 890
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

#### Response (403 Forbidden)

```json
{
  "error": "Forbidden: Admin access required"
}
```

#### Example

```javascript
// JavaScript/TypeScript
async function getAdminStats() {
  const response = await fetch('/api/admin/stats')

  if (response.status === 401) {
    throw new Error('Not authenticated')
  }

  if (response.status === 403) {
    throw new Error('Admin access required')
  }

  return await response.json()
}

const stats = await getAdminStats()
console.log(`Total users: ${stats.totalUsers}`)
console.log(`Revenue: $${stats.totalRevenue}`)
```

---

## Authentication Endpoints

Handled by NextAuth.js.

### POST /api/auth/signin/[provider]

Initiate OAuth sign-in flow with provider (Google or GitHub).

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
POST /api/auth/signin/google
Content-Type: application/json

{
  "callbackUrl": "/dashboard"
}
```

#### Providers

- `google` - Google OAuth 2.0
- `github` - GitHub OAuth

#### Flow

```
1. POST /api/auth/signin/google
   └─> Redirect to Google OAuth consent screen

2. User grants permissions
   └─> Google redirects to /api/auth/callback/google

3. NextAuth exchanges code for tokens
   └─> Creates/updates user in database
   └─> Creates session record
   └─> Sets session cookie

4. Redirect to callbackUrl (default: /)
```

#### Example

```javascript
// JavaScript/TypeScript (client-side)
import { signIn } from 'next-auth/react'

function SignInButton() {
  return (
    <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
      Sign in with Google
    </button>
  )
}
```

---

### POST /api/auth/signout

Sign out the current user.

**Authentication:** Required
**Rate Limit:** 100 requests/minute

#### Request

```http
POST /api/auth/signout
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK)

Redirects to homepage or specified `callbackUrl`.

#### Example

```javascript
// JavaScript/TypeScript (client-side)
import { signOut } from 'next-auth/react'

function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </button>
  )
}
```

---

### GET /api/auth/session

Retrieve current session information.

**Authentication:** Optional
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/auth/session
Cookie: next-auth.session-token=<session-token>
```

#### Response (200 OK) - Authenticated

```json
{
  "user": {
    "id": "clxy456def",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "role": "STUDENT",
    "emailVerified": "2025-10-01T00:00:00.000Z"
  },
  "expires": "2025-11-12T00:00:00.000Z"
}
```

#### Response (200 OK) - Not Authenticated

```json
{}
```

#### Example

```javascript
// JavaScript/TypeScript (client-side)
import { useSession } from 'next-auth/react'

function ProfileComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Please sign in</div>

  return <div>Welcome, {session.user.name}!</div>
}
```

---

## System Endpoints

Internal system endpoints for monitoring and visualization.

### GET /api/architecture

Retrieve system architecture visualization data.

**Authentication:** None required
**Rate Limit:** 100 requests/minute

#### Request

```http
GET /api/architecture
```

#### Response (200 OK)

```json
{
  "nodes": [
    {
      "id": "user-api",
      "label": "User API",
      "type": "api",
      "layer": "application"
    },
    {
      "id": "course-service",
      "label": "Course Service",
      "type": "service",
      "layer": "domain"
    }
  ],
  "edges": [
    {
      "source": "user-api",
      "target": "course-service",
      "type": "dependency"
    }
  ],
  "layers": ["presentation", "application", "domain", "infrastructure"],
  "metadata": {
    "totalComponents": 150,
    "totalDependencies": 200,
    "circularDependencies": 0,
    "architectureGrade": "A+"
  }
}
```

#### Example

```bash
curl https://aiwhisperers.com/api/architecture
```

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/architecture')
const architecture = await response.json()

console.log(`Total components: ${architecture.metadata.totalComponents}`)
console.log(`Architecture grade: ${architecture.metadata.architectureGrade}`)
```

---

## Summary

### Endpoint Overview

| Endpoint | Method | Auth | Role | Rate Limit | Cache |
|----------|--------|------|------|------------|-------|
| `/api/health` | GET | No | - | 100/min | No |
| `/api/courses` | GET | No | - | 100/min | 5 min |
| `/api/courses/:slug` | GET | No | - | 100/min | 1 hour |
| `/api/courses/stats` | GET | No | - | 100/min | 5 min |
| `/api/content/:pageName` | GET | No | - | 100/min | 1 hour |
| `/api/user/dashboard` | GET | Yes | Any | 100/min | No |
| `/api/user/achievements` | GET | Yes | Any | 100/min | No |
| `/api/user/progress` | GET | Yes | Any | 100/min | No |
| `/api/user/courses/enrolled` | GET | Yes | Any | 100/min | No |
| `/api/admin/stats` | GET | Yes | Admin/Instructor | 100/min | No |
| `/api/auth/signin/:provider` | POST | No | - | 100/min | No |
| `/api/auth/signout` | POST | Yes | Any | 100/min | No |
| `/api/auth/session` | GET | Optional | - | 100/min | No |
| `/api/architecture` | GET | No | - | 100/min | No |

### Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Common Headers

**Request:**
```http
Cookie: next-auth.session-token=<session-token>
Accept: application/json
Content-Type: application/json
Accept-Language: en,es
```

**Response:**
```http
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696896000000
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

---

**Related Documentation:**
- [06-api-overview.md](./06-api-overview.md) - API architecture and design
- [08-api-schemas.md](./08-api-schemas.md) - Validation schemas
- [31-nextauth-config.md](./31-nextauth-config.md) - Authentication configuration
- [38-rate-limiting.md](./38-rate-limiting.md) - Rate limiting details

---

*Last Updated: October 12, 2025 - Complete reference for all 12 API endpoints with examples.*
