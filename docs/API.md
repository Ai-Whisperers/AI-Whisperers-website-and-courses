# AI Whisperers - API Documentation

## 📋 API Overview

The AI Whisperers platform provides a comprehensive REST API following RESTful principles and clean architecture patterns. All endpoints return JSON responses and implement proper HTTP status codes and error handling.

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication
Most endpoints require authentication using NextAuth.js session cookies. Protected endpoints will return `401 Unauthorized` if not authenticated.

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message",
  "pagination": {} // For paginated responses
}
```

### Error Format
Error responses follow this structure:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {} // Optional error details
}
```

## 🔐 Authentication Endpoints

### NextAuth.js Integration

Authentication is handled by NextAuth.js at `/api/auth/*`. The following endpoints are automatically available:

- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin/:provider` - Sign in with provider
- `GET /api/auth/signout` - Sign out
- `POST /api/auth/signout` - Sign out (POST)
- `GET /api/auth/callback/:provider` - OAuth callback

### Session Response
```json
{
  "user": {
    "id": "clx1x2x3x4x5x6x7x8x9x0",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://example.com/avatar.jpg",
    "role": "STUDENT",
    "emailVerified": "2024-01-01T00:00:00.000Z"
  },
  "expires": "2024-02-01T00:00:00.000Z"
}
```

## 📚 Course Management API

### Get All Courses

**Endpoint**: `GET /api/courses`

**Description**: Retrieve a list of all courses with optional filtering.

**Query Parameters**:
- `published` (boolean): Filter by published status
- `featured` (boolean): Get only featured courses
- `difficulty` (string): Filter by difficulty level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)

**Example Request**:
```bash
GET /api/courses?published=true&difficulty=BEGINNER
```

**Success Response** (200):
```json
{
  "success": true,
  "courses": [
    {
      "id": "clx1x2x3x4x5x6x7x8x9x0",
      "title": "AI Foundations",
      "description": "Learn the fundamentals of artificial intelligence",
      "slug": "ai-foundations",
      "price": {
        "amount": 29900,
        "currency": "USD",
        "formatted": "$299.00"
      },
      "duration": {
        "minutes": 720,
        "formatted": "12 hours"
      },
      "difficulty": "BEGINNER",
      "difficultyLevel": "Beginner Friendly",
      "published": true,
      "featured": true,
      "learningObjectives": [
        "Understand AI concepts and terminology",
        "Learn about machine learning basics",
        "Explore AI applications in various industries"
      ],
      "prerequisites": [
        "Basic computer literacy",
        "High school mathematics"
      ],
      "canEnroll": true,
      "isFree": false,
      "isAdvanced": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Response** (500):
```json
{
  "success": false,
  "error": "Failed to fetch courses",
  "message": "Database connection error"
}
```

### Get Course by Slug

**Endpoint**: `GET /api/courses/[slug]`

**Description**: Retrieve detailed information about a specific course by its slug.

**Path Parameters**:
- `slug` (string): The course slug (e.g., "ai-foundations")

**Example Request**:
```bash
GET /api/courses/ai-foundations
```

**Success Response** (200):
```json
{
  "success": true,
  "course": {
    "id": "clx1x2x3x4x5x6x7x8x9x0",
    "title": "AI Foundations",
    "description": "Comprehensive introduction to artificial intelligence...",
    "slug": "ai-foundations",
    "price": {
      "amount": 29900,
      "currency": "USD",
      "formatted": "$299.00"
    },
    "duration": {
      "minutes": 720,
      "formatted": "12 hours"
    },
    "difficulty": "BEGINNER",
    "difficultyLevel": "Beginner Friendly",
    "published": true,
    "featured": true,
    "learningObjectives": [
      "Understand AI concepts and terminology",
      "Learn about machine learning basics"
    ],
    "prerequisites": [
      "Basic computer literacy"
    ],
    "modules": [
      {
        "id": "mod_1",
        "title": "Introduction to AI",
        "description": "Overview of artificial intelligence",
        "order": 1,
        "duration": 180,
        "lessons": [
          {
            "id": "lesson_1",
            "title": "What is AI?",
            "description": "Definition and history of AI",
            "order": 1,
            "duration": 45,
            "lessonType": "TEXT"
          }
        ]
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Course not found",
  "message": "No course found with slug 'invalid-slug'"
}
```

### Get Course Statistics

**Endpoint**: `GET /api/courses/stats`

**Description**: Get aggregated statistics about courses.

**Success Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalCourses": 4,
    "publishedCourses": 4,
    "totalDuration": 3930,
    "averageDuration": 982.5,
    "difficultyBreakdown": {
      "BEGINNER": 1,
      "INTERMEDIATE": 1,
      "ADVANCED": 1,
      "EXPERT": 1
    },
    "totalValue": 399600,
    "averagePrice": 99900
  }
}
```

## 🎓 User Enrollment API (Future Implementation)

### Enroll in Course

**Endpoint**: `POST /api/enrollments`
**Authentication**: Required

**Request Body**:
```json
{
  "courseId": "clx1x2x3x4x5x6x7x8x9x0",
  "paymentMethod": "paypal",
  "paymentId": "PAYPAL-TRANSACTION-ID"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "enrollment": {
    "id": "enr_1x2x3x4x5x6x7x8x9x0",
    "userId": "user_1x2x3x4x5x6x7x8x9x0",
    "courseId": "clx1x2x3x4x5x6x7x8x9x0",
    "status": "ACTIVE",
    "enrolledAt": "2024-01-15T00:00:00.000Z",
    "progressPercentage": 0,
    "course": {
      "title": "AI Foundations",
      "slug": "ai-foundations"
    }
  },
  "message": "Successfully enrolled in course"
}
```

### Get User Enrollments

**Endpoint**: `GET /api/enrollments`
**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "enrollments": [
    {
      "id": "enr_1x2x3x4x5x6x7x8x9x0",
      "courseId": "clx1x2x3x4x5x6x7x8x9x0",
      "status": "ACTIVE",
      "enrolledAt": "2024-01-15T00:00:00.000Z",
      "progressPercentage": 45,
      "lastAccessedAt": "2024-01-20T10:30:00.000Z",
      "course": {
        "title": "AI Foundations",
        "slug": "ai-foundations",
        "difficulty": "BEGINNER"
      }
    }
  ],
  "count": 1
}
```

## 📈 Progress Tracking API (Future Implementation)

### Update Lesson Progress

**Endpoint**: `POST /api/progress`
**Authentication**: Required

**Request Body**:
```json
{
  "lessonId": "lesson_1x2x3x4x5x6x7x8x9x0",
  "completed": true,
  "timeSpent": 300
}
```

**Success Response** (200):
```json
{
  "success": true,
  "progress": {
    "id": "prog_1x2x3x4x5x6x7x8x9x0",
    "lessonId": "lesson_1x2x3x4x5x6x7x8x9x0",
    "completed": true,
    "completedAt": "2024-01-20T15:30:00.000Z",
    "timeSpent": 300
  },
  "courseProgress": {
    "courseId": "clx1x2x3x4x5x6x7x8x9x0",
    "completedLessons": 5,
    "totalLessons": 12,
    "progressPercentage": 42
  }
}
```

### Get User Progress

**Endpoint**: `GET /api/progress`
**Authentication**: Required

**Query Parameters**:
- `courseId` (string, optional): Filter by specific course

**Success Response** (200):
```json
{
  "success": true,
  "progress": [
    {
      "courseId": "clx1x2x3x4x5x6x7x8x9x0",
      "courseTitle": "AI Foundations",
      "progressPercentage": 42,
      "completedLessons": 5,
      "totalLessons": 12,
      "timeSpent": 1800,
      "lastAccessedAt": "2024-01-20T15:30:00.000Z",
      "lessons": [
        {
          "lessonId": "lesson_1",
          "lessonTitle": "What is AI?",
          "completed": true,
          "completedAt": "2024-01-18T10:00:00.000Z",
          "timeSpent": 300
        }
      ]
    }
  ]
}
```

## 🛒 Payment API (Future Implementation)

### Create Payment Intent

**Endpoint**: `POST /api/payments/create-intent`
**Authentication**: Required

**Request Body**:
```json
{
  "courseId": "clx1x2x3x4x5x6x7x8x9x0",
  "paymentMethod": "paypal"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pay_1x2x3x4x5x6x7x8x9x0",
    "clientSecret": "pi_1x2x3x4x5x6x7x8x9x0_secret_xyz",
    "amount": 29900,
    "currency": "USD",
    "status": "requires_payment_method"
  }
}
```

### Verify Payment

**Endpoint**: `POST /api/payments/verify`
**Authentication**: Required

**Request Body**:
```json
{
  "paymentId": "PAYPAL-PAYMENT-ID",
  "paymentMethod": "paypal"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "payment": {
    "id": "pay_1x2x3x4x5x6x7x8x9x0",
    "status": "COMPLETED",
    "amount": 29900,
    "currency": "USD",
    "processedAt": "2024-01-20T16:00:00.000Z"
  },
  "message": "Payment verified successfully"
}
```

## 📧 Content Management API

### Get Dynamic Content

**Endpoint**: `GET /api/content/[pageName]`

**Description**: Retrieve dynamic content for pages (testimonials, FAQ, etc.)

**Path Parameters**:
- `pageName` (string): The page identifier (e.g., "testimonials", "faq")

**Success Response** (200):
```json
{
  "success": true,
  "content": {
    "pageId": "testimonials",
    "data": [
      {
        "id": "testimonial_1",
        "name": "Sarah Johnson",
        "role": "Data Scientist",
        "company": "Tech Corp",
        "content": "This course transformed my understanding of AI...",
        "rating": 5,
        "avatar": "/images/testimonials/sarah.jpg"
      }
    ],
    "lastUpdated": "2024-01-20T12:00:00.000Z"
  }
}
```

## 👥 User Management API (Admin Only)

### Get All Users

**Endpoint**: `GET /api/admin/users`
**Authentication**: Required (Admin role)

**Query Parameters**:
- `role` (string, optional): Filter by user role
- `limit` (number, optional): Limit results (default: 20)
- `offset` (number, optional): Offset for pagination (default: 0)

**Success Response** (200):
```json
{
  "success": true,
  "users": [
    {
      "id": "user_1x2x3x4x5x6x7x8x9x0",
      "email": "student@example.com",
      "name": "John Student",
      "role": "STUDENT",
      "emailVerified": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "enrollmentCount": 2,
      "lastActive": "2024-01-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## 📊 Analytics API (Admin Only)

### Get Course Analytics

**Endpoint**: `GET /api/admin/analytics/courses`
**Authentication**: Required (Admin role)

**Success Response** (200):
```json
{
  "success": true,
  "analytics": {
    "totalEnrollments": 1250,
    "activeStudents": 850,
    "courseCompletionRate": 78.5,
    "averageProgressPerCourse": 65.2,
    "topCourses": [
      {
        "courseId": "clx1x2x3x4x5x6x7x8x9x0",
        "title": "AI Foundations",
        "enrollments": 450,
        "completionRate": 82.3,
        "averageRating": 4.8
      }
    ],
    "revenueByMonth": [
      {
        "month": "2024-01",
        "revenue": 125000,
        "enrollments": 125
      }
    ]
  }
}
```

## 🚨 Error Codes Reference

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate enrollment)
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

### Custom Error Types

```json
{
  "VALIDATION_ERROR": "Request validation failed",
  "AUTHENTICATION_ERROR": "Authentication required or invalid",
  "AUTHORIZATION_ERROR": "Insufficient permissions",
  "RESOURCE_NOT_FOUND": "Requested resource not found",
  "DUPLICATE_RESOURCE": "Resource already exists",
  "PAYMENT_ERROR": "Payment processing failed",
  "EXTERNAL_SERVICE_ERROR": "External service unavailable"
}
```

## 📝 Rate Limiting

### Default Limits
- **Authenticated users**: 100 requests per minute
- **Anonymous users**: 20 requests per minute
- **Admin endpoints**: 200 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## 🧪 Testing Endpoints

### Health Check

**Endpoint**: `GET /api/health`

**Success Response** (200):
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-20T16:00:00.000Z",
  "services": {
    "database": "connected",
    "authentication": "active",
    "external_apis": "operational"
  }
}
```

## 📋 API Versioning

### Current Version
- **Version**: v1 (implicit, no version prefix required)
- **Compatibility**: Backward compatible changes only

### Future Versioning
When breaking changes are needed, versioning will be implemented:
- **URL-based**: `/api/v2/courses`
- **Header-based**: `Accept: application/vnd.aiwhisperers.v2+json`

## 🔍 Request/Response Examples

### CURL Examples

**Get all published courses:**
```bash
curl -X GET "https://your-domain.com/api/courses?published=true" \
  -H "Accept: application/json"
```

**Get course by slug:**
```bash
curl -X GET "https://your-domain.com/api/courses/ai-foundations" \
  -H "Accept: application/json"
```

**Create enrollment (authenticated):**
```bash
curl -X POST "https://your-domain.com/api/enrollments" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "courseId": "clx1x2x3x4x5x6x7x8x9x0",
    "paymentMethod": "paypal",
    "paymentId": "PAYPAL-TRANSACTION-ID"
  }'
```

### JavaScript SDK Example

```typescript
// Course API client
class CourseAPI {
  private baseUrl = '/api'
  
  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${this.baseUrl}/courses?${params}`)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message)
    }
    
    return data.courses
  }
  
  async getCourseBySlug(slug: string): Promise<Course> {
    const response = await fetch(`${this.baseUrl}/courses/${slug}`)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message)
    }
    
    return data.course
  }
}
```

---

*This API documentation is automatically updated with code changes and reflects the current implementation. For real-time API testing, use the built-in development tools or Postman collection.*