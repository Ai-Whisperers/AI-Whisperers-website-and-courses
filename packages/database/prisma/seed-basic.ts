/**
 * Basic Database Seed Script
 *
 * This script seeds only essential data:
 * - Demo users with different roles (for testing)
 *
 * Note: This uses NextAuth OAuth authentication.
 * Users will need to login via Google or GitHub OAuth.
 * Course content should be added manually through the admin panel.
 */

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting basic database seed...\n');

  // ==========================================================================
  // Demo Users (OAuth-based authentication)
  // ==========================================================================
  console.log('👥 Creating demo users...');

  const users = [
    {
      name: 'Admin User',
      email: 'admin@aiwhisperers.com',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      image: 'https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff',
    },
    {
      name: 'Instructor User',
      email: 'instructor@aiwhisperers.com',
      role: UserRole.INSTRUCTOR,
      emailVerified: new Date(),
      image: 'https://ui-avatars.com/api/?name=Instructor+User&background=10b981&color=fff',
    },
    {
      name: 'Student User',
      email: 'student@aiwhisperers.com',
      role: UserRole.STUDENT,
      emailVerified: new Date(),
      image: 'https://ui-avatars.com/api/?name=Student+User&background=8b5cf6&color=fff',
    },
    {
      name: 'Test Student',
      email: 'test@example.com',
      role: UserRole.STUDENT,
      emailVerified: new Date(),
      image: 'https://ui-avatars.com/api/?name=Test+Student&background=f59e0b&color=fff',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        role: userData.role, // Update role if user already exists
      },
      create: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        emailVerified: userData.emailVerified,
        image: userData.image,
      },
    });

    console.log(`  ✓ ${user.role}: ${user.email}`);
  }

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n✅ Basic seed completed successfully!\n');
  console.log('📝 Next steps:');
  console.log('  1. Configure OAuth providers (Google/GitHub) in .env file');
  console.log('  2. Login with one of the OAuth providers');
  console.log('  3. Manually update your user role to ADMIN in the database if needed');
  console.log('  4. Add courses through the admin panel at /admin/courses\n');

  console.log('🔐 Demo Users Created (OAuth login required):');
  console.log('  Admin: admin@aiwhisperers.com');
  console.log('  Instructor: instructor@aiwhisperers.com');
  console.log('  Student: student@aiwhisperers.com');
  console.log('  Test: test@example.com\n');

  console.log('💡 To assign admin role to your OAuth account:');
  console.log('  1. Login via OAuth (Google/GitHub)');
  console.log('  2. Run: UPDATE users SET role = \'ADMIN\' WHERE email = \'your-email@example.com\';\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
