/**
 * Update n8n course with learning objectives and prerequisites
 */

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Updating n8n course with learning objectives and prerequisites...\n');

  const learningObjectives = [
    'Master n8n fundamentals including triggers, nodes, and workflow design',
    'Build production-ready automation workflows for real business scenarios',
    'Create AI-powered agents with tool calling capabilities',
    'Deploy and maintain self-hosted n8n instances using Docker',
    'Implement advanced data transformations and API integrations',
    'Design scalable automation solutions for e-commerce, marketing, and customer support'
  ];

  const prerequisites = [
    'Basic understanding of web applications and APIs',
    'Familiarity with JSON data format',
    'Access to n8n.io account (free tier available)',
    'Willingness to learn through hands-on projects'
  ];

  const course = await prisma.course.update({
    where: { slug: 'n8n-automation-mastery' },
    data: {
      learningObjectives,
      prerequisites,
    },
  });

  console.log(`✅ Updated course: ${course.title}`);
  console.log(`  • Learning Objectives: ${learningObjectives.length}`);
  console.log(`  • Prerequisites: ${prerequisites.length}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
