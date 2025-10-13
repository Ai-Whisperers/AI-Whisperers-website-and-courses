/**
 * Course Content Seed Script
 *
 * Populates database with curated course content from YAML files:
 * - Reads course-level metadata
 * - Reads module-level content
 * - Creates courses, modules, and lessons with proper relationships
 */

// Load environment variables from .env file FIRST
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

// Now import Prisma and other dependencies
import { PrismaClient } from '@prisma/client';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to load YAML file
function loadYAML(filePath: string): any {
  const fullPath = path.join(process.cwd(), '../../', filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContent);
}

// Helper function to slugify text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🌱 Starting course content population...\n');

  // ==========================================================================
  // Get Instructor User
  // ==========================================================================
  console.log('👤 Finding instructor user...');

  const instructor = await prisma.user.findFirst({
    where: { role: 'INSTRUCTOR' },
  });

  if (!instructor) {
    throw new Error('No instructor user found. Run seed-basic.ts first!');
  }

  console.log(`  ✓ Instructor: ${instructor.email}\n`);

  // ==========================================================================
  // n8n Automation Mastery Course
  // ==========================================================================
  console.log('📚 Creating n8n Automation Mastery course...');

  // Load course-level content
  const courseData = loadYAML('courses-content/raw-content/n8n-automation/course.yml');

  // Create course
  const n8nCourse = await prisma.course.upsert({
    where: { slug: 'n8n-automation-mastery' },
    update: {},
    create: {
      title: courseData.title || 'n8n Automation Mastery',
      slug: 'n8n-automation-mastery',
      description: courseData.description || 'Master n8n workflow automation',
      difficulty: 'INTERMEDIATE',
      price: 499.0,
      currency: 'USD',
      durationHours: 6, // Duration in hours
      published: true,
      featured: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      instructorId: instructor.id,
    },
  });

  console.log(`  ✓ Course created: ${n8nCourse.title}`);

  // ==========================================================================
  // Module 1: The n8n Basics
  // ==========================================================================
  console.log('\n📖 Creating Module 1: The n8n Basics...');

  const module01Data = loadYAML('courses-content/raw-content/n8n-automation/modules/01-n8n-basics.yml');

  // Check if module already exists
  let module01 = await prisma.courseModule.findFirst({
    where: {
      courseId: n8nCourse.id,
      order: 1,
    },
  });

  // Create if doesn't exist
  if (!module01) {
    module01 = await prisma.courseModule.create({
      data: {
        title: module01Data.title || 'The n8n Basics',
        description: module01Data.description || 'Getting Started with n8n Platform',
        order: 1,
        duration: 90, // 6 lessons × 15 min average
        courseId: n8nCourse.id,
      },
    });
  }

  console.log(`  ✓ Module created: ${module01.title}`);

  // Create lessons for Module 1
  console.log('  📝 Creating lessons...');

  let lessonOrder = 1;
  for (const lesson of module01Data.lessons) {
    const lessonRecord = await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module01.id,
          slug: slugify(lesson.title),
        },
      },
      update: {},
      create: {
        title: lesson.title,
        slug: slugify(lesson.title),
        description: lesson.key_concepts?.join(' | ') || '',
        content: lesson.content,
        duration: 15, // Default 15 minutes per lesson
        order: lessonOrder++,
        moduleId: module01.id,
      },
    });

    console.log(`    ✓ ${lessonRecord.title}`);
  }

  // ==========================================================================
  // Module 2: Foundational Concepts
  // ==========================================================================
  console.log('\n📖 Creating Module 2: Foundational Concepts...');

  const module02Data = loadYAML('courses-content/raw-content/n8n-automation/modules/02-foundational-concepts.yml');

  const module02 = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: n8nCourse.id,
        slug: 'foundational-concepts',
      },
    },
    update: {},
    create: {
      title: module02Data.title || 'Foundational Concepts',
      slug: 'foundational-concepts',
      description: module02Data.description || 'Core concepts for workflow building',
      order: 2,
      courseId: n8nCourse.id,
    },
  });

  console.log(`  ✓ Module created: ${module02.title}`);

  // Create lessons for Module 2
  console.log('  📝 Creating lessons...');

  lessonOrder = 1;
  for (const lesson of module02Data.lessons || []) {
    const lessonRecord = await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module02.id,
          slug: slugify(lesson.title),
        },
      },
      update: {},
      create: {
        title: lesson.title,
        slug: slugify(lesson.title),
        description: lesson.key_concepts?.join(' | ') || '',
        content: lesson.content || '# Coming Soon\n\nContent for this lesson is being prepared.',
        duration: 15,
        order: lessonOrder++,
        moduleId: module02.id,
      },
    });

    console.log(`    ✓ ${lessonRecord.title}`);
  }

  // ==========================================================================
  // Module 3: AI Agent Workflows
  // ==========================================================================
  console.log('\n📖 Creating Module 3: AI Agent Workflows...');

  const module03Data = loadYAML('courses-content/raw-content/n8n-automation/modules/03-ai-agents.yml');

  const module03 = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: n8nCourse.id,
        slug: 'ai-agent-workflows',
      },
    },
    update: {},
    create: {
      title: module03Data.title || 'AI Agent Workflows',
      slug: 'ai-agent-workflows',
      description: module03Data.description || 'Building intelligent AI agents',
      order: 3,
      courseId: n8nCourse.id,
    },
  });

  console.log(`  ✓ Module created: ${module03.title}`);

  // Create lessons for Module 3
  console.log('  📝 Creating lessons...');

  lessonOrder = 1;
  for (const lesson of module03Data.lessons || []) {
    const lessonRecord = await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module03.id,
          slug: slugify(lesson.title),
        },
      },
      update: {},
      create: {
        title: lesson.title,
        slug: slugify(lesson.title),
        description: lesson.key_concepts?.join(' | ') || '',
        content: lesson.content || '# Coming Soon\n\nContent for this lesson is being prepared.',
        duration: 20,
        order: lessonOrder++,
        moduleId: module03.id,
      },
    });

    console.log(`    ✓ ${lessonRecord.title}`);
  }

  // ==========================================================================
  // Module 4: Self-Hosting n8n
  // ==========================================================================
  console.log('\n📖 Creating Module 4: Self-Hosting n8n...');

  const module04Data = loadYAML('courses-content/raw-content/n8n-automation/modules/04-self-hosting.yml');

  const module04 = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: n8nCourse.id,
        slug: 'self-hosting-n8n',
      },
    },
    update: {},
    create: {
      title: module04Data.title || 'Self-Hosting n8n',
      slug: 'self-hosting-n8n',
      description: module04Data.description || 'Docker deployment and production setup',
      order: 4,
      courseId: n8nCourse.id,
    },
  });

  console.log(`  ✓ Module created: ${module04.title}`);

  // Create lessons for Module 4
  console.log('  📝 Creating lessons...');

  lessonOrder = 1;
  for (const lesson of module04Data.lessons || []) {
    const lessonRecord = await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module04.id,
          slug: slugify(lesson.title),
        },
      },
      update: {},
      create: {
        title: lesson.title,
        slug: slugify(lesson.title),
        description: lesson.key_concepts?.join(' | ') || '',
        content: lesson.content || '# Coming Soon\n\nContent for this lesson is being prepared.',
        duration: 25,
        order: lessonOrder++,
        moduleId: module04.id,
      },
    });

    console.log(`    ✓ ${lessonRecord.title}`);
  }

  // ==========================================================================
  // Module 5: Real Business Projects
  // ==========================================================================
  console.log('\n📖 Creating Module 5: Real Business Projects...');

  const module05Data = loadYAML('courses-content/raw-content/n8n-automation/modules/05-business-projects.yml');

  const module05 = await prisma.courseModule.upsert({
    where: {
      courseId_slug: {
        courseId: n8nCourse.id,
        slug: 'real-business-projects',
      },
    },
    update: {},
    create: {
      title: module05Data.title || 'Real Business Projects',
      slug: 'real-business-projects',
      description: module05Data.description || 'Production automation systems',
      order: 5,
      courseId: n8nCourse.id,
    },
  });

  console.log(`  ✓ Module created: ${module05.title}`);

  // Create lessons for Module 5
  console.log('  📝 Creating lessons...');

  lessonOrder = 1;
  for (const lesson of module05Data.lessons || []) {
    const lessonRecord = await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: module05.id,
          slug: slugify(lesson.title),
        },
      },
      update: {},
      create: {
        title: lesson.title,
        slug: slugify(lesson.title),
        description: lesson.key_concepts?.join(' | ') || '',
        content: lesson.content || '# Coming Soon\n\nContent for this lesson is being prepared.',
        duration: 30,
        order: lessonOrder++,
        moduleId: module05.id,
      },
    });

    console.log(`    ✓ ${lessonRecord.title}`);
  }

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n✅ Course content population completed successfully!\n');

  // Get statistics
  const totalModules = await prisma.courseModule.count({ where: { courseId: n8nCourse.id } });
  const totalLessons = await prisma.lesson.count({
    where: {
      courseModule: { courseId: n8nCourse.id }
    }
  });

  console.log('📊 Statistics:');
  console.log(`  • Course: ${n8nCourse.title}`);
  console.log(`  • Modules: ${totalModules}`);
  console.log(`  • Lessons: ${totalLessons}`);
  console.log(`  • Instructor: ${instructor.email}\n`);

  console.log('🌐 View your course at:');
  console.log(`  http://localhost:3000/courses/n8n-automation-mastery\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during course population:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
