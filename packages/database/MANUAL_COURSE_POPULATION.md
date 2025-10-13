# Manual Course Population Guide

This guide explains how to manually populate course content into the AI Whisperers platform database.

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Manual Population Methods](#manual-population-methods)
4. [SQL Examples](#sql-examples)
5. [Admin Panel Workflow](#admin-panel-workflow)

---

## Overview

The database has been set up with the core schema and demo users. Course content should be added manually to ensure proper curation and quality control.

### Current Database State

✅ Schema created with all tables and indexes
✅ Demo users seeded (Admin, Instructor, Students)
❌ **Courses - Empty (ready for manual population)**
❌ **Modules - Empty**
❌ **Lessons - Empty**
❌ **Quizzes - Empty**

---

## Database Schema

### Core Course Tables

```
courses/
├── id (String, CUID)
├── title (String)
├── slug (String, unique)
├── description (String)
├── difficulty (BEGINNER | INTERMEDIATE | ADVANCED | EXPERT)
├── price (Decimal)
├── currency (String, default: "USD")
├── duration (Int, minutes)
├── published (Boolean, default: false)
├── featured (Boolean, default: false)
├── thumbnailUrl (String, optional)
├── instructorId (String, FK to users)
├── categoryId (String, optional, FK to categories)
└── modules[] (one-to-many)
    └── lessons[] (one-to-many)
        └── quizzes[] (one-to-many)
```

---

## Manual Population Methods

### Method 1: SQL Scripts (Recommended for bulk import)

Create SQL scripts to insert course data directly into the database.

**Advantages:**
- Fast bulk insertion
- Version controlled
- Repeatable
- Good for initial data load

**Disadvantages:**
- Requires SQL knowledge
- Manual ID management
- No validation

### Method 2: Admin Panel (Recommended for ongoing management)

Use the Next.js admin interface to create courses through the UI.

**Advantages:**
- User-friendly
- Built-in validation
- Visual feedback
- Automatic ID generation

**Disadvantages:**
- Slower for bulk operations
- Requires UI to be built

### Method 3: Prisma Scripts

Write TypeScript scripts using Prisma Client to populate data.

**Advantages:**
- Type-safe
- Programmatic control
- Can include business logic
- Easy to test

**Disadvantages:**
- Requires coding
- Need to compile/run

---

## SQL Examples

### Example 1: Create a Course

```sql
-- Insert a course
INSERT INTO courses (
  id,
  title,
  slug,
  description,
  difficulty,
  price,
  currency,
  duration,
  published,
  featured,
  "thumbnailUrl",
  "instructorId",
  "createdAt",
  "updatedAt"
) VALUES (
  'course_n8n_automation',
  'n8n Automation Mastery',
  'n8n-automation-mastery',
  'Master workflow automation with n8n from beginner to advanced',
  'INTERMEDIATE',
  499.00,
  'USD',
  1200,
  true,
  true,
  'https://example.com/thumbnails/n8n.jpg',
  (SELECT id FROM users WHERE role = 'INSTRUCTOR' LIMIT 1),
  NOW(),
  NOW()
);
```

### Example 2: Create Modules for a Course

```sql
-- Insert modules
INSERT INTO modules (
  id,
  title,
  slug,
  description,
  "order",
  "courseId",
  "createdAt",
  "updatedAt"
) VALUES
  (
    'mod_01_foundations',
    'Module 1: Foundations',
    'foundations',
    'Introduction to n8n and workflow automation concepts',
    1,
    'course_n8n_automation',
    NOW(),
    NOW()
  ),
  (
    'mod_02_core_concepts',
    'Module 2: Core Concepts',
    'core-concepts',
    'Understanding nodes, workflows, and data flow',
    2,
    'course_n8n_automation',
    NOW(),
    NOW()
  );
```

### Example 3: Create Lessons for a Module

```sql
-- Insert lessons
INSERT INTO lessons (
  id,
  title,
  slug,
  description,
  content,
  "videoUrl",
  duration,
  "order",
  "moduleId",
  "createdAt",
  "updatedAt"
) VALUES
  (
    'lesson_01_01',
    'What is n8n?',
    'what-is-n8n',
    'Introduction to n8n and its capabilities',
    '# What is n8n?\n\nn8n is a powerful workflow automation tool...',
    'https://vimeo.com/video/123456',
    15,
    1,
    'mod_01_foundations',
    NOW(),
    NOW()
  ),
  (
    'lesson_01_02',
    'Installing n8n',
    'installing-n8n',
    'Step-by-step guide to installing n8n',
    '# Installing n8n\n\nThere are several ways to install n8n...',
    'https://vimeo.com/video/123457',
    20,
    2,
    'mod_01_foundations',
    NOW(),
    NOW()
  );
```

### Example 4: Create a Quiz

```sql
-- Insert a quiz
INSERT INTO quizzes (
  id,
  title,
  description,
  "passingScore",
  "order",
  "lessonId",
  "createdAt",
  "updatedAt"
) VALUES (
  'quiz_01_01',
  'Foundations Quiz',
  'Test your knowledge of n8n fundamentals',
  80,
  1,
  'lesson_01_02',
  NOW(),
  NOW()
);

-- Insert quiz questions
INSERT INTO quiz_questions (
  id,
  question,
  options,
  "correctAnswer",
  explanation,
  "order",
  "quizId",
  "createdAt",
  "updatedAt"
) VALUES
  (
    'q_01',
    'What is n8n?',
    ARRAY['A workflow automation tool', 'A database', 'A web server', 'A programming language'],
    0,  -- Index of correct answer (A workflow automation tool)
    'n8n is a workflow automation tool that connects various apps and services',
    1,
    'quiz_01_01',
    NOW(),
    NOW()
  ),
  (
    'q_02',
    'Which installation method is recommended for beginners?',
    ARRAY['Docker', 'NPM', 'Source code', 'Kubernetes'],
    0,  -- Docker
    'Docker provides the easiest setup for beginners with minimal configuration',
    2,
    'quiz_01_01',
    NOW(),
    NOW()
  );
```

---

## Admin Panel Workflow

### Prerequisites

1. **Login as Admin:**
   ```bash
   # Login via OAuth (Google/GitHub)
   # Then update your role:
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Access Admin Panel:**
   - Navigate to: `http://localhost:3000/admin`
   - Or: `http://localhost:3000/admin/courses`

### Step-by-Step Course Creation

#### 1. Create a Course

1. Navigate to `/admin/courses`
2. Click "Create New Course"
3. Fill in course details:
   - Title: "n8n Automation Mastery"
   - Slug: "n8n-automation-mastery" (auto-generated)
   - Description: Full course description
   - Difficulty: INTERMEDIATE
   - Price: 499.00
   - Currency: USD
   - Duration: 1200 minutes
   - Thumbnail URL (optional)
4. Save course

#### 2. Create Modules

1. Click on the created course
2. Navigate to "Modules" tab
3. Click "Add Module"
4. Fill in module details:
   - Title
   - Slug (auto-generated)
   - Description
   - Order (1, 2, 3, etc.)
5. Save module

#### 3. Create Lessons

1. Click on a module
2. Navigate to "Lessons" tab
3. Click "Add Lesson"
4. Fill in lesson details:
   - Title
   - Slug (auto-generated)
   - Description
   - Content (Markdown editor)
   - Video URL (Vimeo/YouTube)
   - Duration (minutes)
   - Order
5. Save lesson

#### 4. Create Quizzes

1. Click on a lesson
2. Navigate to "Quizzes" tab
3. Click "Add Quiz"
4. Fill in quiz details:
   - Title
   - Description
   - Passing Score (percentage)
   - Questions (add multiple)
5. Save quiz

---

## Content Migration from YAML

If you have existing course content in YAML format (like `courses-content/content.yml`), you can:

### Option 1: Manual Migration

1. Open the YAML file
2. Extract course structure
3. Create courses, modules, lessons via Admin Panel
4. Copy content from YAML to Admin form fields

### Option 2: Create a Migration Script

Create a custom script to parse YAML and insert into database:

```typescript
// scripts/migrate-yaml-to-db.ts
import { PrismaClient } from '@prisma/client';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function migrateYamlToDb() {
  // 1. Read YAML file
  const yamlContent = fs.readFileSync('courses-content/content.yml', 'utf8');
  const courses = yaml.load(yamlContent);

  // 2. Parse and insert courses
  for (const courseData of courses.courses) {
    // Create course
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        // ... other fields
      },
    });

    // 3. Create modules
    for (const moduleData of courseData.modules) {
      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          courseId: course.id,
          // ... other fields
        },
      });

      // 4. Create lessons
      // ... (similar pattern)
    }
  }
}

migrateYamlToDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Database Connection

### Local Development

```bash
# Use the .env file in packages/database/
DATABASE_URL="postgresql://aiwhisperers_admin:XonWwW9oMinvs4bxAWXI6TSYjbuZNY3z@dpg-d2sfso7diees738r970g-a.oregon-postgres.render.com/aiwhisperers_production"
```

### Using Prisma Studio (Visual Database Editor)

```bash
cd packages/database
pnpm studio
# Opens at http://localhost:5555
```

Prisma Studio provides a visual interface to:
- View all tables
- Insert/Edit/Delete records
- See relationships
- No SQL required

---

## Best Practices

### 1. Course Creation Order

Always create in this order to maintain referential integrity:
1. **Categories** (if using)
2. **Instructor Users**
3. **Courses**
4. **Modules**
5. **Lessons**
6. **Quizzes & Questions**

### 2. Slug Generation

- Use lowercase
- Separate words with hyphens
- Keep it short and descriptive
- Example: `n8n-automation-mastery`

### 3. Content Guidelines

- **Descriptions:** Clear, concise, SEO-friendly
- **Duration:** In minutes, realistic estimates
- **Pricing:** Use decimal format (e.g., 499.00, not 499)
- **Video URLs:** Use embed URLs, not watch URLs

### 4. Publishing Workflow

1. Create course with `published = false`
2. Add all modules and lessons
3. Review content
4. Set `published = true` when ready
5. Set `featured = true` for homepage display

---

## Verification Queries

### Check Course Count

```sql
SELECT COUNT(*) FROM courses;
```

### View Course Hierarchy

```sql
SELECT
  c.title AS course,
  m.title AS module,
  l.title AS lesson
FROM courses c
LEFT JOIN modules m ON m."courseId" = c.id
LEFT JOIN lessons l ON l."moduleId" = m.id
ORDER BY c.title, m."order", l."order";
```

### Check Published Courses

```sql
SELECT title, slug, published, featured
FROM courses
WHERE published = true
ORDER BY "createdAt" DESC;
```

---

## Troubleshooting

### Issue: Cannot create course

**Cause:** No instructor user exists

**Solution:**
```sql
-- Create an instructor user first
UPDATE users SET role = 'INSTRUCTOR' WHERE email = 'instructor@aiwhisperers.com';
```

### Issue: Foreign key constraint error

**Cause:** Referenced ID doesn't exist

**Solution:** Ensure parent records exist before creating child records:
1. Course must exist before Module
2. Module must exist before Lesson
3. Lesson must exist before Quiz

### Issue: Unique constraint violation

**Cause:** Slug or email already exists

**Solution:** Use unique slugs for each course/module/lesson

---

## Next Steps

1. ✅ Database schema created
2. ✅ Demo users seeded
3. ⏳ **Populate courses manually** (you are here)
4. ⏳ Configure OAuth providers
5. ⏳ Deploy to production

For questions or issues, consult the [Prisma Documentation](https://www.prisma.io/docs) or the main project README.
