/**
 * Seed Script: Agentic AI Design Patterns Course
 * Manually populate "Master ALL 21 Agentic AI Design Patterns" course
 */

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Agentic AI Design Patterns course...\n');

  // Get instructor
  const instructor = await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' } });
  if (!instructor) throw new Error('No instructor found! Run seed-basic.ts first');

  // Course data
  const courseData = {
    title: 'Master ALL 21 Agentic AI Design Patterns',
    slug: 'agentic-ai-design-patterns',
    description: `Master the architectural patterns that separate professionals from beginners in AI agent development. This comprehensive course covers all 21 agentic AI design patterns from the groundbreaking 400-page book by a Google engineer.

By the end of this course, you'll be able to architect complex multi-agent systems, implement production-ready agentic workflows, and optimize cost, performance, and reliability of AI systems.

Learn the patterns used by companies like OpenAI, Anthropic, and Google to build cutting-edge AI agents. From foundation patterns like prompt chaining and routing, to advanced techniques like multi-agent collaboration and the Model Context Protocol (MCP).`,
    difficulty: 'ADVANCED',
    price: 999,
    currency: 'USD',
    durationHours: 50,
    published: true,
    featured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    instructorId: instructor.id,
    learningObjectives: [
      'Identify the appropriate design pattern for any AI agent problem',
      'Architect complex multi-agent systems using pattern combinations',
      'Implement production-ready agentic workflows',
      'Optimize cost, performance, and reliability of AI systems',
      'Debug and troubleshoot agentic system failures',
      'Scale AI agent deployments to enterprise levels',
      'Evaluate quality, safety, and compliance requirements',
      'Master all 21 industry-standard agentic patterns'
    ],
    prerequisites: [
      'Basic understanding of Large Language Models (LLMs)',
      'Familiarity with API concepts and REST APIs',
      'Basic programming knowledge (Python or JavaScript)',
      'Understanding of software design patterns (helpful but not required)',
      'OpenAI or Anthropic API access'
    ]
  };

  // Create or update course
  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    update: courseData,
    create: courseData
  });

  console.log(`✓ Course: ${course.title}\n`);

  // Module and lesson data
  const modules = [
    {
      order: 1,
      title: 'Foundation Patterns',
      description: 'Core building blocks for all agentic systems. Master prompt chaining, routing, parallelization, and reflection - the patterns used in 80%+ of production AI agents.',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Pattern 1: Prompt Chaining', order: 1, duration: 150 },
        { title: 'Pattern 2: Routing', order: 2, duration: 150 },
        { title: 'Pattern 3: Parallelization', order: 3, duration: 150 },
        { title: 'Pattern 4: Reflection', order: 4, duration: 150 }
      ]
    },
    {
      order: 2,
      title: 'Integration Patterns',
      description: 'Connecting agents to the world. Learn tool use, planning, and multi-agent collaboration to build agents that can interact with external systems and work together.',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Pattern 5: Tool Use', order: 1, duration: 180 },
        { title: 'Pattern 6: Planning', order: 2, duration: 150 },
        { title: 'Pattern 7: Multi-Agent Collaboration', order: 3, duration: 150 }
      ]
    },
    {
      order: 3,
      title: 'Data & Memory Patterns',
      description: 'Making agents remember and learn. Implement memory management, learning & adaptation, and RAG (Retrieval Augmented Generation) for context-aware AI.',
      duration: 540, // 9 hours
      lessons: [
        { title: 'Pattern 8: Memory Management', order: 1, duration: 180 },
        { title: 'Pattern 9: Learning & Adaptation', order: 2, duration: 180 },
        { title: 'Pattern 10: Retrieval (RAG)', order: 3, duration: 180 }
      ]
    },
    {
      order: 4,
      title: 'Control & Monitoring Patterns',
      description: 'Keeping agents on track. Master goal setting, exception handling, human-in-the-loop, and evaluation to build reliable production systems.',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Pattern 11: Goal Setting & Monitoring', order: 1, duration: 150 },
        { title: 'Pattern 12: Exception Handling & Recovery', order: 2, duration: 150 },
        { title: 'Pattern 13: Human-in-the-Loop', order: 3, duration: 150 },
        { title: 'Pattern 14: Evaluation & Monitoring', order: 4, duration: 150 }
      ]
    },
    {
      order: 5,
      title: 'Advanced Communication Patterns',
      description: 'Agent-to-agent interactions and optimization. Learn inter-agent communication, resource-aware optimization, and advanced reasoning techniques.',
      duration: 420, // 7 hours
      lessons: [
        { title: 'Pattern 15: Inter-Agent Communication', order: 1, duration: 150 },
        { title: 'Pattern 16: Resource-Aware Optimization', order: 2, duration: 135 },
        { title: 'Pattern 17: Reasoning Techniques', order: 3, duration: 135 }
      ]
    },
    {
      order: 6,
      title: 'Safety & Optimization Patterns',
      description: 'Production readiness and security. Implement guardrails, prioritization, exploration & discovery, and the Model Context Protocol (MCP) for enterprise AI.',
      duration: 360, // 6 hours
      lessons: [
        { title: 'Pattern 18: Guardrails & Safety', order: 1, duration: 90 },
        { title: 'Pattern 19: Prioritization', order: 2, duration: 90 },
        { title: 'Pattern 20: Exploration & Discovery', order: 3, duration: 90 },
        { title: 'Pattern 21: MCP (Model Context Protocol)', order: 4, duration: 90 }
      ]
    }
  ];

  // Create modules and lessons
  for (const modData of modules) {
    console.log(`\n📖 Module ${modData.order}: ${modData.title}`);

    // Check if module exists
    let module = await prisma.courseModule.findFirst({
      where: {
        courseId: course.id,
        order: modData.order
      }
    });

    if (!module) {
      module = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: modData.title,
          description: modData.description,
          order: modData.order,
          duration: modData.duration
        }
      });
    } else {
      // Update existing module
      module = await prisma.courseModule.update({
        where: { id: module.id },
        data: {
          title: modData.title,
          description: modData.description,
          duration: modData.duration
        }
      });
    }

    console.log(`  ✓ ${module.title} (${modData.duration} min)`);

    // Create lessons
    for (const lessonData of modData.lessons) {
      let lesson = await prisma.lesson.findFirst({
        where: {
          moduleId: module.id,
          order: lessonData.order
        }
      });

      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonData.title,
            content: `# ${lessonData.title}\n\n## Overview\n\nThis lesson covers ${lessonData.title} - one of the 21 essential agentic AI design patterns.\n\n## What You'll Learn\n\n- Core concepts and principles\n- When and how to apply this pattern\n- Real-world applications and use cases\n- Implementation examples in Python and JavaScript\n- Common pitfalls and best practices\n\n## Coming Soon\n\nDetailed content for this pattern is being finalized. Check back soon!`,
            order: lessonData.order,
            duration: lessonData.duration
          }
        });
      }

      console.log(`    └─ ${lessonData.order}. ${lesson.title} (${lessonData.duration} min)`);
    }
  }

  // Stats
  const totalModules = await prisma.courseModule.count({
    where: { courseId: course.id }
  });

  const totalLessons = await prisma.lesson.count({
    where: { module: { courseId: course.id } }
  });

  console.log('\n✅ Seeding complete!\n');
  console.log('📊 Statistics:');
  console.log(`  • Course: ${course.title}`);
  console.log(`  • Modules: ${totalModules}`);
  console.log(`  • Lessons: ${totalLessons}`);
  console.log(`  • Duration: ${course.durationHours} hours`);
  console.log(`  • Price: $${course.price}`);
  console.log(`  • Difficulty: ${course.difficulty}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
