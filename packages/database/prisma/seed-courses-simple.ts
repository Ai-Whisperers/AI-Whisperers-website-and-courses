/**
 * Simple Course Content Seed Script
 * Populates n8n Automation course with actual module and lesson content
 */

// Load environment variables FIRST
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper to load YAML
function loadYAML(filePath: string): any {
  const fullPath = path.join(process.cwd(), '../../', filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContent);
}

async function main() {
  console.log('🌱 Seeding n8n Automation course...\n');

  // Get instructor
  const instructor = await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' } });
  if (!instructor) throw new Error('No instructor found! Run seed-basic.ts first');

  // Load course data
  const courseData = loadYAML('courses-content/raw-content/n8n-automation/course.yml');

  // Create course
  const course = await prisma.course.upsert({
    where: { slug: 'n8n-automation-mastery' },
    update: {},
    create: {
      title: courseData.title,
      slug: 'n8n-automation-mastery',
      description: courseData.description,
      difficulty: 'INTERMEDIATE',
      price: 499,
      currency: 'USD',
      durationHours: 6,
      published: true,
      featured: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      instructorId: instructor.id,
    },
  });
  console.log(`✓ Course: ${course.title}\n`);

  // Module data with YAML file paths
  const modules = [
    { order: 1, file: '01-n8n-basics.yml', title: 'The n8n Basics', duration: 90 },
    { order: 2, file: '02-foundational-concepts.yml', title: 'Foundational Concepts', duration: 60 },
    { order: 3, file: '03-ai-agents.yml', title: 'AI Agent Workflows', duration: 60 },
    { order: 4, file: '04-self-hosting.yml', title: 'Self-Hosting n8n', duration: 75 },
    { order: 5, file: '05-business-projects.yml', title: 'Real Business Projects', duration: 150 },
  ];

  for (const modData of modules) {
    // Load module YAML
    const moduleYAML = loadYAML(`courses-content/raw-content/n8n-automation/modules/${modData.file}`);

    // Check if module exists
    let module = await prisma.courseModule.findFirst({
      where: { courseId: course.id, order: modData.order },
    });

    if (!module) {
      module = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: moduleYAML.title || modData.title,
          description: moduleYAML.overview || moduleYAML.description || '',
          order: modData.order,
          duration: modData.duration,
        },
      });
    }

    console.log(`✓ Module ${modData.order}: ${module.title}`);

    // Create lessons from YAML
    if (moduleYAML.lessons && Array.isArray(moduleYAML.lessons)) {
      for (let i = 0; i < moduleYAML.lessons.length; i++) {
        const lessonData = moduleYAML.lessons[i];

        // Check if lesson exists
        let lesson = await prisma.lesson.findFirst({
          where: { moduleId: module.id, order: i + 1 },
        });

        if (!lesson) {
          lesson = await prisma.lesson.create({
            data: {
              moduleId: module.id,
              title: lessonData.title,
              content: lessonData.content || `# ${lessonData.title}\n\nContent coming soon.`,
              order: i + 1,
              duration: 15, // Default 15 minutes
            },
          });
        }

        console.log(`  └─ Lesson ${i + 1}: ${lesson.title}`);
      }
    }

    console.log('');
  }

  // Stats
  const totalModules = await prisma.courseModule.count({ where: { courseId: course.id } });
  const totalLessons = await prisma.lesson.count({
    where: { module: { courseId: course.id } },
  });

  console.log('✅ Seeding complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`  • Modules: ${totalModules}`);
  console.log(`  • Lessons: ${totalLessons}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
