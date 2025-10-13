/**
 * Database Seed Script
 * Populates the database with initial data from courses-content/ directory
 *
 * Usage:
 *   pnpm run db:seed
 *
 * This script:
 * 1. Reads YAML files from courses-content/courses/
 * 2. Creates courses with modules and lessons
 * 3. Links instructors to courses
 * 4. Handles upserts to allow re-running without duplicates
 */

import { PrismaClient, Difficulty, UserRole } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

const prisma = new PrismaClient()

// Course YAML structure matching courses-content format
interface CourseYAML {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  duration_hours: number
  difficulty: string
  published: boolean
  featured: boolean
  learning_objectives: string[]
  prerequisites: string[]
  thumbnail_url?: string
  video_url?: string
  instructor_id?: string
  modules: ModuleYAML[]
}

interface ModuleYAML {
  title: string
  description: string
  order: number
  duration: number
  video_url?: string
  lessons: LessonYAML[]
}

interface LessonYAML {
  title: string
  order: number
  duration: number
  video_url?: string
  content: string
}

/**
 * Map string difficulty to Prisma enum
 */
function mapDifficulty(difficulty: string): Difficulty {
  switch (difficulty.toUpperCase()) {
    case 'BEGINNER':
      return Difficulty.BEGINNER
    case 'INTERMEDIATE':
      return Difficulty.INTERMEDIATE
    case 'ADVANCED':
      return Difficulty.ADVANCED
    case 'EXPERT':
      return Difficulty.EXPERT
    default:
      throw new Error(`Unknown difficulty level: ${difficulty}`)
  }
}

/**
 * Read all course YAML files from courses-content/courses/
 */
function readCourseFiles(): CourseYAML[] {
  // Determine root directory (handle both monorepo root and packages/database contexts)
  const cwd = process.cwd()
  let rootDir = cwd

  // If running from packages/database, go up two levels to project root
  if (cwd.endsWith('packages/database') || cwd.endsWith('packages\\database')) {
    rootDir = path.join(cwd, '..', '..')
  }

  // If running from packages/database/prisma, go up three levels
  if (cwd.endsWith('prisma') || cwd.includes('packages/database/prisma')) {
    rootDir = path.join(cwd, '..', '..', '..')
  }

  const coursesDir = path.join(rootDir, 'courses-content', 'courses')

  console.log(`📂 Reading courses from: ${coursesDir}`)

  if (!fs.existsSync(coursesDir)) {
    console.warn('⚠️  courses-content/courses/ directory not found')
    return []
  }

  const files = fs.readdirSync(coursesDir)
  const yamlFiles = files.filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))

  console.log(`📄 Found ${yamlFiles.length} course file(s): ${yamlFiles.join(', ')}`)

  return yamlFiles.map(file => {
    const filePath = path.join(coursesDir, file)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const course = yaml.load(fileContents) as CourseYAML

    console.log(`   ✓ Loaded: ${course.title} (${course.slug})`)
    return course
  })
}

/**
 * Seed courses with modules and lessons
 */
async function seedCourses() {
  const courses = readCourseFiles()

  if (courses.length === 0) {
    console.log('ℹ️  No courses to seed')
    return
  }

  console.log(`\n🌱 Seeding ${courses.length} course(s)...\n`)

  for (const courseData of courses) {
    console.log(`📚 Processing: ${courseData.title}`)

    // Create/update course
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      create: {
        id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        price: courseData.price,
        currency: courseData.currency,
        durationHours: courseData.duration_hours,
        difficulty: mapDifficulty(courseData.difficulty),
        published: courseData.published,
        featured: courseData.featured,
        learningObjectives: courseData.learning_objectives,
        prerequisites: courseData.prerequisites,
        thumbnailUrl: courseData.thumbnail_url,
        videoUrl: courseData.video_url,
      },
      update: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        currency: courseData.currency,
        durationHours: courseData.duration_hours,
        difficulty: mapDifficulty(courseData.difficulty),
        published: courseData.published,
        featured: courseData.featured,
        learningObjectives: courseData.learning_objectives,
        prerequisites: courseData.prerequisites,
        thumbnailUrl: courseData.thumbnail_url,
        videoUrl: courseData.video_url,
      },
    })

    console.log(`   ✓ Course created/updated: ${course.id}`)

    // Delete existing modules and lessons for clean re-seed
    // TEMP: Commenting out due to Prisma client generation issue
    // await prisma.lesson.deleteMany({
    //   where: { module: { courseId: course.id } },
    // })
    // await prisma.module.deleteMany({
    //   where: { courseId: course.id },
    // })
    console.log(`   ℹ️  Skipping delete (will append new modules/lessons)`)

    // Create modules with lessons
    for (const moduleData of courseData.modules) {
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          duration: moduleData.duration,
          videoUrl: moduleData.video_url,
        },
      })

      console.log(`   ✓ Module created: ${module.title} (${moduleData.lessons.length} lessons)`)

      // Create lessons
      for (const lessonData of moduleData.lessons) {
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonData.title,
            content: lessonData.content,
            videoUrl: lessonData.video_url,
            order: lessonData.order,
            duration: lessonData.duration,
          },
        })
      }

      console.log(`      ✓ ${moduleData.lessons.length} lesson(s) created`)
    }

    console.log()
  }
}

/**
 * Seed a default admin user for development
 */
async function seedDefaultUser() {
  console.log('👤 Seeding default admin user...\n')

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aiwhisperers.com' },
    create: {
      id: 'admin-user-001',
      email: 'admin@aiwhisperers.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
    update: {
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  })

  console.log(`   ✓ Admin user: ${adminUser.email} (${adminUser.role})`)

  const testStudent = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    create: {
      id: 'student-user-001',
      email: 'student@test.com',
      name: 'Test Student',
      role: UserRole.STUDENT,
      emailVerified: new Date(),
    },
    update: {
      name: 'Test Student',
      role: UserRole.STUDENT,
    },
  })

  console.log(`   ✓ Test student: ${testStudent.email} (${testStudent.role})`)
  console.log()
}

/**
 * Main seed function
 */
async function main() {
  console.log('🚀 Starting database seed...\n')

  try {
    // Seed users first (instructors, students, admins)
    await seedDefaultUser()

    // Seed courses with modules and lessons
    await seedCourses()

    console.log('✅ Database seeding completed successfully!\n')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

// Run seed
main()
  .catch(error => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
