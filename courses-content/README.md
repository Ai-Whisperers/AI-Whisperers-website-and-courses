# Courses Content Directory

**Purpose:** Dev-friendly course content management for database seeding and content updates.

This directory contains structured course content in YAML format, making it easy to:
- Manage course data without directly editing database
- Version control course content
- Seed database with initial courses
- Update course content through simple YAML edits

## Directory Structure

```
courses-content/
├── courses/           # Course definitions (YAML files)
│   ├── ai-foundations.yml
│   ├── applied-ai.yml
│   ├── ai-web-development.yml
│   └── enterprise-ai.yml
│
├── instructors/       # Instructor profiles
│   └── team.yml
│
├── media/            # Media metadata and URLs
│   └── course-thumbnails.yml
│
└── README.md         # This file
```

## Course YAML Format

Each course is defined in a YAML file with the following structure:

```yaml
# courses/ai-foundations.yml
id: "course-1"  # Optional: for consistent seeding
title: "AI Foundations: From Zero to Hero"
slug: "ai-foundations"
description: "Complete introduction to artificial intelligence..."

# Pricing
price: 299
currency: "USD"

# Course Details
duration_hours: 720
difficulty: "BEGINNER"  # BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
published: true
featured: true

# Learning Content
learning_objectives:
  - "Understand core AI concepts and terminology"
  - "Build your first machine learning model"
  - "Master data preprocessing techniques"

prerequisites:
  - "Basic programming knowledge (Python recommended)"
  - "High school mathematics"

# Media
thumbnail_url: "/images/courses/ai-foundations-thumb.jpg"
video_url: "https://vimeo.com/..."

# Instructor
instructor_id: "instructor-1"

# Modules
modules:
  - title: "Introduction to AI"
    description: "Overview of artificial intelligence and its applications"
    order: 1
    duration: 120  # minutes
    lessons:
      - title: "What is AI?"
        content: "Artificial Intelligence (AI) is..."
        video_url: "https://vimeo.com/..."
        order: 1
        duration: 30

      - title: "History of AI"
        content: "AI has evolved through several phases..."
        video_url: "https://vimeo.com/..."
        order: 2
        duration: 45

  - title: "Machine Learning Basics"
    description: "Introduction to machine learning concepts"
    order: 2
    duration: 180
    lessons:
      - title: "Types of Machine Learning"
        content: "There are three main types..."
        video_url: "https://vimeo.com/..."
        order: 1
        duration: 40
```

## Instructor YAML Format

```yaml
# instructors/team.yml
- id: "instructor-1"
  name: "Dr. AI Expertise Team"
  title: "AI Research Scientists & Engineers"
  bio: "Our team of AI experts brings decades..."
  avatar: "/instructors/team.jpg"
  linkedin: "https://linkedin.com/company/ai-whisperers"
```

## Usage

### Seed Database

Run the seed script to populate the database with course content:

```bash
pnpm run db:seed
```

This will:
1. Parse all YAML files in courses-content/
2. Validate course data structure
3. Insert/update courses in the database
4. Create course modules and lessons
5. Link instructors to courses

### Update Courses

1. Edit the YAML file for the course you want to update
2. Run `pnpm run db:seed` to sync changes to database
3. Changes are applied based on course slug (upsert operation)

### Add New Course

1. Create a new YAML file in `courses-content/courses/`
2. Follow the format above
3. Run `pnpm run db:seed`

## Benefits

✅ **Version Control:** Course content tracked in git
✅ **Easy Editing:** YAML is human-readable and easy to edit
✅ **Consistent Seeding:** Same content across dev/staging/production
✅ **Type Safety:** Schema validation before database insertion
✅ **Rollback:** Git history allows reverting content changes
✅ **Collaboration:** Multiple team members can edit content
✅ **Migration-Friendly:** Seed data separate from schema migrations

## Future Enhancements

- [ ] Add course images/media management
- [ ] Support for course prerequisites (course dependencies)
- [ ] Quiz/assessment definitions
- [ ] Certificate templates
- [ ] Course categories/tags
- [ ] Instructor assignments
- [ ] Pricing tiers and discounts
- [ ] Course bundles

---

**Last Updated:** October 12, 2025
**Maintained By:** AI Whisperers Team
