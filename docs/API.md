# AI Whisperers - API Documentation (Database-Free)

## 📋 API Overview (Updated)

The AI Whisperers platform provides a **simplified REST API** optimized for stateless operation without database dependencies. All endpoints use mock data and in-memory operations, making the system highly reliable and deployment-friendly.

### Base URLs
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-app-name.onrender.com/api`

### Authentication
Authentication is handled via **NextAuth.js JWT tokens**. Protected endpoints validate JWT tokens without database lookups.

### Response Format Standards

**Success Response**:
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human readable error message"
}
```

## 🔍 API Endpoints

### Health Check API

#### `GET /api/health`
**Purpose**: Application health monitoring and status verification

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-04T12:00:00.000Z",
  "services": {
    "application": "running",
    "api": "operational"
  },
  "version": "0.1.0",
  "environment": "production"
}
```

**Status Codes**:
- `200`: Application healthy
- `503`: Application unhealthy

**Usage**:
```bash
curl https://your-app.onrender.com/api/health
```

**Implementation**: `src/app/api/health/route.ts`

### Course API

#### `GET /api/courses`
**Purpose**: Get list of available courses

**Response**:
```json
{
  "success": true,
  "courses": [
    {
      "id": "course-1", 
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
      "published": true,
      "featured": true
    }
  ]
}
```

**Implementation**: `src/app/api/courses/route.ts`

#### `GET /api/courses/[slug]`
**Purpose**: Get specific course details by slug

**Parameters**:
- `slug` (path): Course slug identifier (e.g., "ai-foundations")

**Response (Success)**:
```json
{
  "success": true,
  "course": {
    "id": "course-1",
    "title": "AI Foundations", 
    "description": "Learn the fundamentals of artificial intelligence with hands-on projects.",
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
      "Understand AI concepts",
      "Learn ML basics"
    ],
    "prerequisites": [
      "Basic computer literacy"
    ],
    "canEnroll": true,
    "isFree": false,
    "isAdvanced": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "error": "Course not found",
  "message": "Course with slug 'invalid-slug' does not exist"
}
```

**Status Codes**:
- `200`: Course found and returned
- `404`: Course not found
- `500`: Server error

**Usage**:
```bash
curl https://your-app.onrender.com/api/courses/ai-foundations
```

**Implementation**: `src/app/api/courses/[slug]/route.ts`

#### `GET /api/courses/stats`
**Purpose**: Get course statistics and metrics

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalCourses": 4,
    "publishedCourses": 4,
    "totalDuration": "65+ hours",
    "averagePrice": "$749",
    "difficulties": {
      "BEGINNER": 1,
      "INTERMEDIATE": 2, 
      "ADVANCED": 1,
      "EXPERT": 0
    }
  }
}
```

**Implementation**: `src/app/api/courses/stats/route.ts`

### Content API

#### `GET /api/content/[pageName]`
**Purpose**: Get compiled page content for dynamic loading

**Parameters**:
- `pageName` (path): Page content name (e.g., "homepage", "about")
- `language` (query, optional): Language code (default: "en")

**Response (Success)**:
```json
{
  "success": true,
  "content": {
    "meta": {
      "title": "Homepage - AI Whisperers",
      "description": "Master AI with world-class education",
      "keywords": ["AI courses", "artificial intelligence"],
      "language": "en"
    },
    "hero": {
      "title": "Master AI with World-Class Education",
      "subtitle": "Transform your career with comprehensive AI courses",
      "description": "Learn artificial intelligence through hands-on projects"
    },
    // ... complete page content structure
  }
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "error": "Content not found", 
  "message": "No content found for page: invalid-page"
}
```

**Usage**:
```bash
curl https://your-app.onrender.com/api/content/homepage
curl https://your-app.onrender.com/api/content/servicios?language=es
```

**Implementation**: `src/app/api/content/[pageName]/route.ts`

### Authentication API

#### `POST /api/auth/*`
**Purpose**: NextAuth.js authentication endpoints

**Endpoints**:
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out 
- `/api/auth/session` - Get current session
- `/api/auth/providers` - Get available providers
- `/api/auth/callback/*` - OAuth callbacks

**Authentication Flow**:
```
1. User visits /auth/signin
2. Selects provider (Google, GitHub, Email)  
3. Redirected to provider for authentication
4. Provider redirects to /api/auth/callback/[provider]
5. JWT token created and stored in session cookie
6. User redirected to application with authenticated session
```

**Session Response**:
```json
{
  "user": {
    "id": "user-123",
    "name": "John Doe", 
    "email": "john@example.com",
    "role": "STUDENT",
    "emailVerified": "2025-09-04T12:00:00.000Z"
  },
  "expires": "2025-10-04T12:00:00.000Z"
}
```

**Implementation**: `src/app/api/auth/[...nextauth]/route.ts`

## 🛠️ API Implementation Details

### Mock Data System

**Course Data**: All course endpoints use predefined mock data
**Location**: Defined inline in API route files
**Benefits**:
- **Reliability**: No database connection failures
- **Performance**: Instant response times
- **Development**: Easy to modify and test

**Mock Course Example**:
```typescript
const mockCourses: Record<string, any> = {
  'ai-foundations': {
    id: 'course-1',
    title: 'AI Foundations',
    // ... complete course object
  }
}
```

### Content Loading Integration

**Content API** integrates with build-time compiled content:
```typescript
// Uses pre-compiled content modules
import { getCompiledPageContent } from '@/lib/content/compiled'

export async function GET(request, { params }) {
  const content = getCompiledPageContent(params.pageName)
  return NextResponse.json({ success: true, content })
}
```

### Error Handling Pattern

**Consistent Error Handling** across all endpoints:

```typescript
try {
  // API logic
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error('API Error:', error)
  return NextResponse.json(
    { 
      success: false, 
      error: 'Internal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    },
    { status: 500 }
  )
}
```

## 🔒 Security Implementation

### API Security Features

1. **Environment Validation**: Safe environment variable access
2. **Input Validation**: Basic input sanitization 
3. **Error Handling**: Secure error messages without information leakage
4. **CORS Configuration**: Proper cross-origin request handling
5. **Security Headers**: Comprehensive security headers via Next.js config

### Authentication Security

**JWT Token Security**:
- **Signing**: Secure JWT signing with NEXTAUTH_SECRET
- **Expiration**: Configurable token expiration
- **Stateless**: No server-side session storage required
- **Provider Security**: OAuth provider validation

**Session Management**:
```typescript
// Session structure (JWT payload)
{
  user: {
    id: string,
    email: string,
    name?: string,
    role: UserRole,
    emailVerified?: Date
  },
  expires: string
}
```

### Input Validation

**Basic Validation Patterns**:
```typescript
// Language validation example
const language = searchParams.get('language')
const validLanguages = ['en', 'es', 'gn'] 
const selectedLanguage = validLanguages.includes(language) ? language : 'en'
```

**Recommendations for Enhancement**:
- Add Zod schema validation for request bodies
- Implement rate limiting for API endpoints
- Add request logging for monitoring

## 📊 API Performance

### Response Times (Expected)

- **Health Check**: <50ms
- **Course List**: <100ms (mock data)
- **Course Details**: <50ms (mock data lookup)
- **Content API**: <100ms (static import)
- **Authentication**: <200ms (JWT processing)

### Caching Strategy

**Static Content**: Compiled content cached in memory after first import
**Mock Data**: In-memory objects, no caching needed
**Authentication**: JWT tokens cached in browser cookies

### Monitoring

**Health Check Integration**: Use `/api/health` for:
- Uptime monitoring
- Performance tracking
- Deployment verification
- Service health dashboards

## 🧪 API Testing

### Manual Testing

**Health Check**:
```bash
curl -i https://your-app.onrender.com/api/health
# Expected: 200 OK with JSON health status
```

**Course List**:
```bash
curl -i https://your-app.onrender.com/api/courses
# Expected: 200 OK with courses array
```

**Course Details**:
```bash  
curl -i https://your-app.onrender.com/api/courses/ai-foundations
# Expected: 200 OK with course object

curl -i https://your-app.onrender.com/api/courses/invalid-slug
# Expected: 404 Not Found
```

**Content API**:
```bash
curl -i https://your-app.onrender.com/api/content/homepage
# Expected: 200 OK with page content

curl -i https://your-app.onrender.com/api/content/servicios
# Expected: 200 OK with Spanish content
```

### Automated Testing

**Test Command**: `npm test`
**Test Files**: `src/__tests__/api/` (to be created)

**Test Coverage Recommendations**:
- API endpoint response validation
- Error handling verification  
- Authentication flow testing
- Content compilation testing

## 🔮 Future API Enhancements

### Planned Improvements

1. **Request Validation**: Zod schema validation for all inputs
2. **Rate Limiting**: API rate limiting for production use
3. **Logging**: Structured logging for monitoring and debugging
4. **Caching**: Advanced caching strategies for performance
5. **Versioning**: API versioning for backward compatibility

### Optional Persistence Layer

**Future Database Integration** (when needed):
- Current mock data can be easily replaced with database queries
- API structure designed to accommodate persistence layer
- Domain entities ready for database integration
- Repository pattern prepared for data layer addition

### Advanced Features (Future)

1. **User Progress Tracking**: API for course progress (requires persistence)
2. **Payment Processing**: Stripe/PayPal integration endpoints
3. **Email Notifications**: Course enrollment and completion emails
4. **Analytics API**: Usage statistics and learning analytics
5. **Admin API**: Course management and user administration

---

## 📚 API Development Guidelines

### Adding New Endpoints

1. **Create Route File**: Add `src/app/api/endpoint/route.ts`
2. **Export HTTP Methods**: Export GET, POST, etc. as needed
3. **Use Consistent Patterns**: Follow existing error handling patterns
4. **Add Documentation**: Document endpoint in this file
5. **Test Functionality**: Verify with manual and automated tests

### Modifying Existing Endpoints

1. **Preserve Compatibility**: Maintain existing response structures
2. **Add Validation**: Enhance input validation as needed
3. **Error Handling**: Ensure proper error responses
4. **Update Documentation**: Keep this API doc current
5. **Test Changes**: Verify all existing functionality still works

### Best Practices

1. **TypeScript**: Use proper TypeScript types for all parameters
2. **Error Handling**: Always use try/catch with proper error responses
3. **Validation**: Validate inputs before processing
4. **Consistency**: Follow established patterns for new endpoints
5. **Security**: Validate environment variables and user inputs

---

## 🔗 Related Documentation

- **Authentication**: [Authentication System Documentation](./AUTHENTICATION.md)
- **Content System**: [Content System Documentation](./CONTENT_SYSTEM.md)
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)
- **Development**: [Development Workflow](./DEVELOPMENT_WORKFLOW.md)

*This API documentation reflects the current database-free architecture as of September 4, 2025, with mock data endpoints and build-time content integration.*