// Database Export Script
// Exports all data from the trading system database to JSON files

import { PrismaClient } from '../src/generated/prisma'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const EXPORT_DIR = path.join(__dirname, '..', 'local-reports', 'migration', 'data')

async function exportTable(tableName: string, data: any[]) {
  const filePath = path.join(EXPORT_DIR, `${tableName}.json`)
  const content = JSON.stringify(data, null, 2)

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Exported ${data.length} records from ${tableName}`)

  // Also create a summary
  return {
    table: tableName,
    recordCount: data.length,
    fileSize: (content.length / 1024).toFixed(2) + ' KB'
  }
}

async function main() {
  console.log('🔄 Starting database export...\n')

  const summary: any[] = []

  try {
    // Export all tables
    console.log('📊 Exporting tables...\n')

    // Assets and related
    summary.push(await exportTable('assets', await prisma.assets.findMany()))
    summary.push(await exportTable('prices', await prisma.prices.findMany()))
    summary.push(await exportTable('allocations', await prisma.allocations.findMany()))
    summary.push(await exportTable('market_cap_data', await prisma.market_cap_data.findMany()))

    // News system
    summary.push(await exportTable('news_articles', await prisma.news_articles.findMany()))
    summary.push(await exportTable('news_sources', await prisma.news_sources.findMany()))
    summary.push(await exportTable('news_entities', await prisma.news_entities.findMany()))
    summary.push(await exportTable('news_sentiment', await prisma.news_sentiment.findMany()))
    summary.push(await exportTable('asset_news', await prisma.asset_news.findMany()))
    summary.push(await exportTable('entity_sentiment_history', await prisma.entity_sentiment_history.findMany()))

    // Trading signals
    summary.push(await exportTable('signals', await prisma.signals.findMany()))
    summary.push(await exportTable('pattern_detections', await prisma.pattern_detections.findMany()))
    summary.push(await exportTable('extreme_events', await prisma.extreme_events.findMany()))
    summary.push(await exportTable('meme_velocity', await prisma.meme_velocity.findMany()))
    summary.push(await exportTable('information_asymmetry', await prisma.information_asymmetry.findMany()))
    summary.push(await exportTable('index_values', await prisma.index_values.findMany()))

    // User and portfolio
    summary.push(await exportTable('users', await prisma.users.findMany()))
    summary.push(await exportTable('portfolios', await prisma.portfolios.findMany()))
    summary.push(await exportTable('risk_metrics', await prisma.risk_metrics.findMany()))
    summary.push(await exportTable('strategy_configs', await prisma.strategy_configs.findMany()))

    // Create export summary
    const summaryContent = {
      exportDate: new Date().toISOString(),
      database: 'aiwhisperers_production',
      totalTables: summary.length,
      totalRecords: summary.reduce((sum, t) => sum + t.recordCount, 0),
      tables: summary
    }

    fs.writeFileSync(
      path.join(EXPORT_DIR, '_EXPORT_SUMMARY.json'),
      JSON.stringify(summaryContent, null, 2)
    )

    console.log('\n✅ Export complete!')
    console.log(`📊 Total tables exported: ${summary.length}`)
    console.log(`📝 Total records: ${summaryContent.totalRecords}`)
    console.log(`📁 Export location: ${EXPORT_DIR}`)

  } catch (error) {
    console.error('❌ Export failed:', error)
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
