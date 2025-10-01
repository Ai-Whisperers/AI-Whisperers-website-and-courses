// Database Cleanup Script
// Drops all tables from the database to prepare for LMS schema

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('⚠️  WARNING: This will drop ALL tables from the database!')
  console.log('📦 Backup location: local-reports/migration/\n')

  try {
    // Get all table names
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `

    console.log(`📊 Found ${tables.length} tables to drop:\n`)
    tables.forEach(t => console.log(`  - ${t.tablename}`))
    console.log('')

    // Drop all tables in CASCADE mode (handles foreign keys)
    console.log('🔄 Dropping tables...\n')

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`)
      console.log(`✅ Dropped: ${table.tablename}`)
    }

    console.log('\n✅ All tables dropped successfully!')
    console.log('🎯 Database is now clean and ready for LMS schema')

  } catch (error) {
    console.error('❌ Failed to drop tables:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
