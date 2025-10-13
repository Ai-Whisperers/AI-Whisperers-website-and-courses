import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.findUnique({
    where: { slug: 'n8n-automation-mastery' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { title: true, order: true, duration: true },
          },
        },
      },
    },
  });

  console.log('\n📚 Course Data:\n');
  console.log(`Title: ${course?.title}`);
  console.log(`Slug: ${course?.slug}`);
  console.log(`Price: $${course?.price}`);
  console.log(`Duration: ${course?.durationHours} hours`);
  console.log(`Published: ${course?.published ? 'Yes' : 'No'}`);
  console.log(`Featured: ${course?.featured ? 'Yes' : 'No'}\n`);

  console.log(`📖 Modules (${course?.modules.length}):\n`);
  course?.modules.forEach((module) => {
    console.log(`${module.order}. ${module.title} (${module.duration} min)`);
    module.lessons.forEach((lesson) => {
      console.log(`   ${lesson.order}. ${lesson.title} (${lesson.duration} min)`);
    });
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
