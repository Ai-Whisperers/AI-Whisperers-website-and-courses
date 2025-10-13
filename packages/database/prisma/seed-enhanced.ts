/**
 * Enhanced Database Seed Script
 * Populates the database with courses, modules, and detailed lesson content
 *
 * Architecture:
 * - Course structure: courses-content/courses/*.yml
 * - Content orchestrator: courses-content/content.yml
 * - Module content: courses-content/raw-content/{course}/modules/*.yml
 * - Course-level content: courses-content/raw-content/{course}/course.yml
 *
 * Usage:
 *   pnpm run db:seed
 */

import { PrismaClient, Difficulty, UserRole } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

const prisma = new PrismaClient()

// Course YAML structure from courses/
interface CourseStructure {
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
  modules: ModuleStructure[]
}

interface ModuleStructure {
  title: string
  description: string
  order: number
  duration: number
  video_url?: string
  lessons: LessonStructure[]
}

interface LessonStructure {
  title: string
  order: number
  duration: number
  video_url?: string
  content: string
}

// Content orchestrator structure from content.yml
interface ContentOrchestrator {
  registry_version: string
  default_locale: string
  [courseName: string]: any
}

// Module content structure from raw-content/
interface ModuleContent {
  id: string
  module_id: string
  course_id: string
  locale: string
  lessons: LessonContent[]
  [key: string]: any
}

interface LessonContent {
  id: string
  title: string
  duration: number
  content: string
  step_by_step?: Array<{
    step: number
    title?: string
    instruction: string
    details: string
    node_type?: string
  }>
  key_concepts?: string[]
  code_examples?: Array<{
    title?: string
    example?: string
    code?: string
    explanation: string
  }>
  [key: string]: any
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
      console.warn(`⚠️  Unknown difficulty: ${difficulty}, defaulting to BEGINNER`)
      return Difficulty.BEGINNER
  }
}

/**
 * Get root directory (handle monorepo structure)
 */
function getRootDir(): string {
  const cwd = process.cwd()

  // If running from packages/database, go up two levels to project root
  if (cwd.endsWith('packages/database') || cwd.endsWith('packages\\database')) {
    return path.join(cwd, '..', '..')
  }

  // If running from packages/database/prisma, go up three levels
  if (cwd.endsWith('prisma') || cwd.includes('packages/database')) {
    return path.join(cwd, '..', '..', '..')
  }

  return cwd
}

/**
 * Read content orchestrator
 */
function readContentOrchestrator(): ContentOrchestrator | null {
  const rootDir = getRootDir()
  const orchestratorPath = path.join(rootDir, 'courses-content', 'content.yml')

  if (!fs.existsSync(orchestratorPath)) {
    console.warn('⚠️  content.yml orchestrator not found')
    return null
  }

  const content = fs.readFileSync(orchestratorPath, 'utf8')
  return yaml.load(content) as ContentOrchestrator
}

/**
 * Read module content from raw-content/
 */
function readModuleContent(modulePath: string): ModuleContent | null {
  const rootDir = getRootDir()
  const fullPath = path.join(rootDir, 'courses-content', modulePath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Module content not found: ${modulePath}`)
    return null
  }

  const content = fs.readFileSync(fullPath, 'utf8')
  return yaml.load(content) as ModuleContent
}

/**
 * Read all course structure files
 */
function readCourseStructures(): CourseStructure[] {
  const rootDir = getRootDir()
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
    const course = yaml.load(fileContents) as CourseStructure

    console.log(`   ✓ Loaded structure: ${course.title} (${course.slug})`)
    return course
  })
}

/**
 * Merge lesson structure with detailed content
 */
function mergeLessonContent(
  structureLesson: LessonStructure,
  contentLesson: LessonContent | undefined
): { title: string; content: string; duration: number; videoUrl?: string; order: number } {
  if (!contentLesson) {
    // Fallback to structure-only lesson
    return {
      title: structureLesson.title,
      content: structureLesson.content,
      duration: structureLesson.duration,
      videoUrl: structureLesson.video_url,
      order: structureLesson.order,
    }
  }

  // Merge detailed content
  let detailedContent = contentLesson.content || ''

  // Append step-by-step instructions if available
  if (contentLesson.step_by_step && contentLesson.step_by_step.length > 0) {
    detailedContent += '\n\n## Step-by-Step Instructions\n\n'
    contentLesson.step_by_step.forEach(step => {
      detailedContent += `### Step ${step.step}${step.title ? `: ${step.title}` : ''}\n\n`
      detailedContent += `**${step.instruction}**\n\n`
      detailedContent += `${step.details}\n\n`
      if (step.node_type) {
        detailedContent += `*Node Type: ${step.node_type}*\n\n`
      }
    })
  }

  // Append key concepts
  if (contentLesson.key_concepts && contentLesson.key_concepts.length > 0) {
    detailedContent += '\n\n## Key Concepts\n\n'
    contentLesson.key_concepts.forEach(concept => {
      detailedContent += `- ${concept}\n`
    })
  }

  // Append code examples
  if (contentLesson.code_examples && contentLesson.code_examples.length > 0) {
    detailedContent += '\n\n## Code Examples\n\n'
    contentLesson.code_examples.forEach(example => {
      if (example.title) {
        detailedContent += `### ${example.title}\n\n`
      }
      if (example.code || example.example) {
        detailedContent += '```\n' + (example.code || example.example) + '\n```\n\n'
      }
      detailedContent += `${example.explanation}\n\n`
    })
  }

  return {
    title: contentLesson.title || structureLesson.title,
    content: detailedContent.trim(),
    duration: contentLesson.duration || structureLesson.duration,
    videoUrl: structureLesson.video_url,
    order: structureLesson.order,
  }
}

/**
 * Seed courses with enhanced content
 */
async function seedCoursesEnhanced() {
  const courseStructures = readCourseStructures()
  const contentOrchestrator = readContentOrchestrator()

  if (courseStructures.length === 0) {
    console.log('ℹ️  No courses to seed')
    return
  }

  console.log(`\n🌱 Seeding ${courseStructures.length} course(s) with detailed content...\n`)

  for (const courseData of courseStructures) {
    console.log(`📚 Processing: ${courseData.title}`)

    // Determine course slug for content lookup (e.g., "n8n-automation")
    const courseSlug = courseData.slug

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
    // Note: Deleting in reverse order (lessons first, then modules)
    const existingModules = await prisma.module.findMany({
      where: { courseId: course.id },
      include: { lessons: true },
    })

    for (const mod of existingModules) {
      // Delete lessons in this module
      for (const lesson of mod.lessons) {
        await prisma.lesson.delete({ where: { id: lesson.id } })
      }
      // Then delete the module
      await prisma.module.delete({ where: { id: mod.id } })
    }

    // Get content orchestrator entry for this course
    const courseContentConfig = contentOrchestrator?.[courseSlug]

    // Create modules with lessons
    for (let moduleIndex = 0; moduleIndex < courseData.modules.length; moduleIndex++) {
      const moduleData = courseData.modules[moduleIndex]

      // Try to load detailed module content
      let moduleContent: ModuleContent | null = null
      if (courseContentConfig?.modules) {
        const moduleKey = Object.keys(courseContentConfig.modules)[moduleIndex]
        if (moduleKey) {
          const modulePath = courseContentConfig.modules[moduleKey]?.path
          if (modulePath) {
            moduleContent = readModuleContent(modulePath)
          }
        }
      }

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

      console.log(`   ✓ Module ${moduleData.order}: ${module.title}`)

      // Create lessons with merged content
      for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
        const lessonData = moduleData.lessons[lessonIndex]
        const contentLesson = moduleContent?.lessons?.[lessonIndex]

        const mergedLesson = mergeLessonContent(lessonData, contentLesson)

        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: mergedLesson.title,
            content: mergedLesson.content,
            videoUrl: mergedLesson.videoUrl,
            order: mergedLesson.order,
            duration: mergedLesson.duration,
          },
        })

        const contentStatus = contentLesson ? '✓ detailed' : '○ basic'
        console.log(`      ${contentStatus} Lesson ${lessonData.order}: ${mergedLesson.title}`)
      }

      console.log(`      ✓ ${moduleData.lessons.length} lesson(s) created`)
    }

    console.log()
  }
}

/**
 * Seed default users
 */
async function seedDefaultUsers() {
  console.log('👤 Seeding default users...\n')

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
  console.log('🚀 Starting enhanced database seed...\n')
  console.log('📖 Architecture:')
  console.log('   • Course structure: courses-content/courses/*.yml')
  console.log('   • Content orchestrator: courses-content/content.yml')
  console.log('   • Module content: courses-content/raw-content/*/modules/*.yml\n')

  try {
    // Seed users first
    await seedDefaultUsers()

    // Seed courses with enhanced content
    await seedCoursesEnhanced()

    console.log('✅ Enhanced database seeding completed successfully!\n')
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
