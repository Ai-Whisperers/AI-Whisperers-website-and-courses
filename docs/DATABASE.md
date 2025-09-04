# AI Whisperers - Database Schema Documentation

## 🗄️ Database Overview

The AI Whisperers platform uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access. The schema is designed following domain-driven design principles with clear entity relationships and proper normalization.

### Database Information
- **Database**: PostgreSQL 14+
- **ORM**: Prisma v6.0.1
- **Connection Pooling**: Built-in Prisma connection pooling
- **Migrations**: Prisma Migrate for schema versioning

## 📊 Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │    │   Enrollment    │    │     Course      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┐│ id (PK)         │┌──►│ id (PK)         │
│ email           │   ││ userId (FK)     ││   │ title           │
│ name            │   ││ courseId (FK)   ││   │ description     │
│ role            │   ││ status          ││   │ slug            │
│ emailVerified   │   ││ enrolledAt      ││   │ price           │
│ createdAt       │   ││ completedAt     ││   │ duration        │
│ updatedAt       │   │└─────────────────┘│   │ difficulty      │
└─────────────────┘   │                  │   │ published       │
         │             │                  │   │ featured        │
         │             │                  │   └─────────────────┘
         │             │                           │
         ▼             │                           ▼
┌─────────────────┐    │                  ┌─────────────────┐
│  UserProgress   │    │                  │     Module      │
├─────────────────┤    │                  ├─────────────────┤
│ id (PK)         │    │                  │ id (PK)         │
│ userId (FK)     │────┘                  │ courseId (FK)   │
│ courseId (FK)   │                       │ title           │
│ moduleId (FK)   │       ┌──────────────►│ description     │
│ lessonId (FK)   │       │               │ order           │
│ completed       │       │               │ duration        │
│ completedAt     │       │               └─────────────────┘
│ timeSpent       │       │                        │
└─────────────────┘       │                        ▼
                          │               ┌─────────────────┐
┌─────────────────┐       │               │     Lesson      │
│   Certificate   │       │               ├─────────────────┤
├─────────────────┤       │               │ id (PK)         │
│ id (PK)         │       │               │ moduleId (FK)   │
│ userId (FK)     │───────┘               │ title           │
│ courseId (FK)   │                       │ description     │
│ issuedAt        │                       │ content         │
│ certificateNum  │                       │ order           │
└─────────────────┘                       │ duration        │
                                          │ lessonType      │
                                          └─────────────────┘
```

## 🏷️ Core Tables

### Users Table

**Purpose**: Store user account information and authentication data

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    role user_role DEFAULT 'STUDENT',
    email_verified TIMESTAMP,
    image VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields**:
- `id`: Unique identifier (CUID)
- `email`: User email address (unique, required)
- `name`: User display name (optional)
- `role`: User role enum (STUDENT, INSTRUCTOR, ADMIN)
- `email_verified`: Email verification timestamp
- `image`: Profile image URL
- `created_at`, `updated_at`: Audit timestamps

**Indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Business Rules**:
- Email must be unique across all users
- Default role is STUDENT
- Email verification required for certain actions
- Audit trail maintained via timestamps

### Courses Table

**Purpose**: Store course information and metadata

```sql
CREATE TABLE courses (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    price INTEGER NOT NULL, -- Price in cents
    duration INTEGER NOT NULL, -- Duration in minutes
    difficulty difficulty_enum NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR,
    meta_description VARCHAR,
    image_url VARCHAR,
    learning_objectives TEXT[], -- Array of learning objectives
    prerequisites TEXT[], -- Array of prerequisites
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields**:
- `id`: Unique course identifier
- `title`: Course title (required, max 200 chars)
- `description`: Detailed course description
- `slug`: URL-friendly course identifier (unique)
- `price`: Course price in cents (e.g., 29900 = $299.00)
- `duration`: Total course duration in minutes
- `difficulty`: Enum (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `published`: Whether course is publicly available
- `featured`: Whether course is featured on homepage
- `learning_objectives`: Array of what students will learn
- `prerequisites`: Array of required prior knowledge

**Indexes**:
```sql
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(published);
CREATE INDEX idx_courses_featured ON courses(featured);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_price ON courses(price);
```

**Business Rules**:
- Slug must be unique and URL-safe
- Price cannot be negative
- Published courses must have complete content
- Featured courses must be published

### Modules Table

**Purpose**: Organize course content into modules

```sql
CREATE TABLE modules (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id VARCHAR NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, "order")
);
```

**Fields**:
- `id`: Unique module identifier
- `course_id`: Reference to parent course
- `title`: Module title
- `description`: Module description
- `order`: Module sequence within course (must be unique per course)
- `duration`: Module duration in minutes
- `published`: Whether module is available to students

**Indexes**:
```sql
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, "order");
CREATE INDEX idx_modules_published ON modules(published);
```

**Business Rules**:
- Modules must belong to a course
- Order must be unique within a course
- Cascade delete when course is deleted

### Lessons Table

**Purpose**: Store individual lesson content within modules

```sql
CREATE TABLE lessons (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id VARCHAR NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- Markdown content
    "order" INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    lesson_type lesson_type_enum DEFAULT 'TEXT',
    video_url VARCHAR,
    resource_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(module_id, "order")
);
```

**Fields**:
- `id`: Unique lesson identifier
- `module_id`: Reference to parent module
- `title`: Lesson title
- `description`: Optional lesson description
- `content`: Lesson content in Markdown format
- `order`: Lesson sequence within module
- `duration`: Estimated completion time in minutes
- `lesson_type`: Enum (TEXT, VIDEO, INTERACTIVE, ASSIGNMENT, QUIZ)
- `video_url`: Optional video resource URL
- `resource_url`: Optional additional resource URL

**Indexes**:
```sql
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, "order");
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
```

## 👥 User Management Tables

### Enrollments Table

**Purpose**: Track student enrollments in courses

```sql
CREATE TABLE enrollments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'ACTIVE',
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

**Fields**:
- `id`: Unique enrollment identifier
- `user_id`: Reference to enrolled user
- `course_id`: Reference to enrolled course
- `status`: Enum (ACTIVE, COMPLETED, SUSPENDED, REFUNDED)
- `enrolled_at`: Enrollment timestamp
- `completed_at`: Course completion timestamp (null if not completed)
- `progress_percentage`: Overall course progress (0-100)
- `last_accessed_at`: Last time user accessed the course

**Indexes**:
```sql
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_enrolled_at ON enrollments(enrolled_at);
```

**Business Rules**:
- One enrollment per user per course
- Progress percentage must be between 0 and 100
- Completed enrollments must have completed_at timestamp

### User Progress Table

**Purpose**: Track detailed progress through course content

```sql
CREATE TABLE user_progress (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR NOT NULL,
    module_id VARCHAR REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id VARCHAR REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- Time in seconds
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id, module_id, lesson_id)
);
```

**Fields**:
- `id`: Unique progress record identifier
- `user_id`: Reference to user
- `course_id`: Reference to course (for efficient querying)
- `module_id`: Reference to module (nullable for course-level progress)
- `lesson_id`: Reference to lesson (nullable for module-level progress)
- `completed`: Whether content is completed
- `completed_at`: Completion timestamp
- `time_spent`: Time spent on content in seconds

**Indexes**:
```sql
CREATE INDEX idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_user_progress_module ON user_progress(module_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);
```

## 🏆 Certification Tables

### Certificates Table

**Purpose**: Store issued course certificates

```sql
CREATE TABLE certificates (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW(),
    certificate_number VARCHAR UNIQUE NOT NULL,
    verification_url VARCHAR
);
```

**Fields**:
- `id`: Unique certificate identifier
- `user_id`: Reference to certificate recipient
- `course_id`: Reference to completed course
- `issued_at`: Certificate issuance date
- `certificate_number`: Unique certificate number for verification
- `verification_url`: URL for certificate verification

**Indexes**:
```sql
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE UNIQUE INDEX idx_certificates_number ON certificates(certificate_number);
```

## 💰 Payment Tables

### Payments Table

**Purpose**: Track payment transactions

```sql
CREATE TABLE payments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR REFERENCES courses(id),
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR DEFAULT 'USD',
    status payment_status DEFAULT 'PENDING',
    provider VARCHAR NOT NULL, -- 'paypal', 'stripe', etc.
    provider_transaction_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);
```

**Fields**:
- `id`: Unique payment identifier
- `user_id`: Reference to paying user
- `course_id`: Reference to purchased course (nullable for other purchases)
- `amount`: Payment amount in cents
- `currency`: Payment currency (default USD)
- `status`: Enum (PENDING, COMPLETED, FAILED, REFUNDED)
- `provider`: Payment processor used
- `provider_transaction_id`: External transaction reference

**Indexes**:
```sql
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

## 🔐 Authentication Tables (NextAuth.js)

### Accounts Table

**Purpose**: Store OAuth account connections

```sql
CREATE TABLE accounts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR NOT NULL,
    provider VARCHAR NOT NULL,
    provider_account_id VARCHAR NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR,
    scope VARCHAR,
    id_token TEXT,
    session_state VARCHAR,
    UNIQUE(provider, provider_account_id)
);
```

### Sessions Table

**Purpose**: Store user session data

```sql
CREATE TABLE sessions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR UNIQUE NOT NULL,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);
```

### Verification Tokens Table

**Purpose**: Store email verification and password reset tokens

```sql
CREATE TABLE verification_tokens (
    identifier VARCHAR NOT NULL,
    token VARCHAR UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    UNIQUE(identifier, token)
);
```

## 📝 Review System Tables

### Course Reviews Table

**Purpose**: Store student course reviews and ratings

```sql
CREATE TABLE course_reviews (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    course_id VARCHAR NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

**Business Rules**:
- Rating must be between 1 and 5 stars
- One review per user per course
- Reviews can be updated

## 🔍 Database Enums

### User Role Enum
```sql
CREATE TYPE user_role AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');
```

### Difficulty Enum
```sql
CREATE TYPE difficulty_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
```

### Enrollment Status Enum
```sql
CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'REFUNDED');
```

### Lesson Type Enum
```sql
CREATE TYPE lesson_type_enum AS ENUM ('TEXT', 'VIDEO', 'INTERACTIVE', 'ASSIGNMENT', 'QUIZ');
```

### Payment Status Enum
```sql
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
```

## 🔧 Database Operations

### Common Queries

**Get course with modules and lessons:**
```sql
SELECT 
    c.*,
    m.id as module_id, m.title as module_title, m.order as module_order,
    l.id as lesson_id, l.title as lesson_title, l.order as lesson_order
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
WHERE c.slug = $1
ORDER BY m.order, l.order;
```

**Get user progress for a course:**
```sql
SELECT 
    up.*,
    l.title as lesson_title,
    m.title as module_title
FROM user_progress up
LEFT JOIN lessons l ON up.lesson_id = l.id
LEFT JOIN modules m ON up.module_id = m.id
WHERE up.user_id = $1 AND up.course_id = $2
ORDER BY m.order, l.order;
```

**Calculate course completion percentage:**
```sql
WITH course_lessons AS (
    SELECT COUNT(*) as total_lessons
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE m.course_id = $1
),
completed_lessons AS (
    SELECT COUNT(*) as completed_count
    FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    JOIN modules m ON l.module_id = m.id
    WHERE up.user_id = $2 
    AND m.course_id = $1 
    AND up.completed = true
)
SELECT 
    ROUND((completed_count::decimal / total_lessons::decimal) * 100, 2) as completion_percentage
FROM course_lessons, completed_lessons;
```

## 🛠️ Database Migrations

### Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Push schema changes without migration (development)
npx prisma db push

# Reset database (development only)
npx prisma migrate reset

# Seed database with initial data
npm run db:seed
```

### Seed Data Script

The database seed script (`prisma/seed.ts`) populates:
- 4 complete courses with modules and lessons
- Sample users with different roles
- Course enrollments and progress data
- Sample reviews and certificates

## 📊 Performance Considerations

### Indexing Strategy

1. **Primary Keys**: All tables use CUID primary keys
2. **Foreign Keys**: Indexed for join performance
3. **Query Patterns**: Indexes on commonly filtered columns
4. **Composite Indexes**: For multi-column queries

### Query Optimization

1. **Pagination**: Use cursor-based pagination for large datasets
2. **N+1 Prevention**: Use Prisma's `include` and `select` carefully
3. **Connection Pooling**: Prisma handles connection pooling automatically
4. **Read Replicas**: Consider for high-traffic scenarios

### Backup Strategy

1. **Automated Backups**: Daily PostgreSQL backups
2. **Point-in-Time Recovery**: WAL archiving enabled
3. **Cross-Region Replication**: For disaster recovery
4. **Migration Rollback**: Version control for schema changes

## 🔒 Security Measures

### Data Protection

1. **Encryption at Rest**: Database-level encryption
2. **Encryption in Transit**: SSL/TLS connections only
3. **Access Control**: Role-based database permissions
4. **Audit Logging**: Track all data modifications

### Privacy Compliance

1. **GDPR**: User data deletion and export capabilities
2. **CCPA**: California Consumer Privacy Act compliance
3. **Data Minimization**: Only collect necessary data
4. **Retention Policies**: Automatic data cleanup

## 📈 Monitoring & Maintenance

### Health Checks

```sql
-- Check database connection
SELECT 1;

-- Monitor table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;

-- Check index usage
SELECT 
    indexrelname as index_name,
    idx_scan as times_used,
    pg_size_pretty(pg_relation_size(indexrelname::regclass)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Maintenance Tasks

1. **VACUUM**: Automated dead tuple cleanup
2. **ANALYZE**: Update query planner statistics
3. **REINDEX**: Rebuild indexes when needed
4. **Log Rotation**: Manage database logs

---

*This database schema supports the complete AI Whisperers educational platform with proper normalization, indexing, and security measures. The design follows domain-driven design principles and supports future scalability.*