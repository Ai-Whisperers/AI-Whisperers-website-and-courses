#!/usr/bin/env node
/**
 * Render Tunnel CLI
 * Command-line interface for local development tunnel
 *
 * ✅ PHASE 3: Render-Local Data Tunnel
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { config } from 'dotenv'
import { TunnelClient } from '@aiwhisperers/render-tunnel/client'
import type {
  LogLevel,
  WebhookProvider,
  SyncTable,
  CLILogsOptions,
  CLIWebhookOptions,
  CLISyncOptions,
} from '@aiwhisperers/render-tunnel/types'

// Load environment variables
config()

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command()

program
  .name('render-tunnel')
  .description('Render-Local Data Tunnel for dev/prod parity')
  .version('0.1.0')

// ============================================================================
// Connect Command
// ============================================================================

program
  .command('connect')
  .description('Connect to production tunnel server')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .option('-v, --verbose', 'Verbose logging')
  .action(async (options) => {
    const spinner = ora('Connecting to tunnel server...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server,
        secret: options.secret,
        environment: 'development',
      })

      await client.connect()

      spinner.succeed(chalk.green('Connected to tunnel server'))

      // Health check
      const health = await client.healthCheck()
      console.log(chalk.blue('\nServer Health:'))
      console.log(`  Status: ${health.status}`)
      console.log(`  Uptime: ${Math.floor(health.uptime / 1000)}s`)
      console.log(`  Connected Clients: ${health.connectedClients}`)
      console.log(`  Version: ${health.version}`)

      // Keep connection open
      console.log(chalk.yellow('\nConnection established. Press Ctrl+C to disconnect.\n'))

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\nDisconnecting...'))
        client.disconnect()
        process.exit(0)
      })
    } catch (error) {
      spinner.fail(chalk.red('Connection failed'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Logs Command
// ============================================================================

program
  .command('logs')
  .description('Stream production logs to local')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .option('-f, --follow', 'Follow log output', true)
  .option('--filter <level>', 'Filter by log level (debug|info|warn|error|fatal)')
  .option('--service <name>', 'Filter by service name')
  .option('-n, --tail <number>', 'Number of lines to show from the end', '100')
  .action(async (options: CLILogsOptions) => {
    const spinner = ora('Connecting to log stream...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server || process.env.RENDER_EXTERNAL_URL || '',
        secret: options.secret || process.env.RENDER_TUNNEL_SECRET || '',
        environment: 'development',
      })

      await client.connect()
      spinner.succeed(chalk.green('Connected to log stream'))

      console.log(chalk.blue('Streaming logs... (Press Ctrl+C to stop)\n'))

      client.streamLogs({
        follow: options.follow,
        filter: options.filter as LogLevel,
        service: options.service,
        tail: options.tail ? parseInt(options.tail as string) : undefined,
      })

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\nStopping log stream...'))
        client.stopStreamingLogs()
        client.disconnect()
        process.exit(0)
      })
    } catch (error) {
      spinner.fail(chalk.red('Failed to stream logs'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Webhook Command
// ============================================================================

program
  .command('webhook')
  .description('Forward production webhooks to local server')
  .requiredOption('-t, --type <provider>', 'Webhook provider (stripe|paypal|resend|custom)')
  .requiredOption('-p, --port <number>', 'Local server port')
  .option('--path <path>', 'Local webhook path', '/api/webhooks')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .action(async (options: CLIWebhookOptions) => {
    const spinner = ora('Setting up webhook forwarding...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server || process.env.RENDER_EXTERNAL_URL || '',
        secret: options.secret || process.env.RENDER_TUNNEL_SECRET || '',
        environment: 'development',
      })

      await client.connect()
      spinner.succeed(chalk.green('Webhook forwarding active'))

      console.log(chalk.blue(`\nForwarding ${options.type} webhooks to localhost:${options.port}${options.path || '/api/webhooks'}\n`))

      await client.forwardWebhook(
        options.type as WebhookProvider,
        parseInt(options.port.toString()),
        options.path
      )

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\nStopping webhook forwarding...'))
        client.disconnect()
        process.exit(0)
      })
    } catch (error) {
      spinner.fail(chalk.red('Failed to setup webhook forwarding'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Sync Command
// ============================================================================

program
  .command('sync')
  .description('Sync data from production database')
  .requiredOption('--table <name>', 'Table to sync (courses|users|enrollments|payments|content|sessions)')
  .option('--limit <number>', 'Limit number of rows', '100')
  .option('--sanitize', 'Sanitize sensitive data', true)
  .option('-o, --output <file>', 'Output file (JSON)')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .action(async (options: CLISyncOptions) => {
    const spinner = ora(`Syncing ${options.table} data...`).start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server || process.env.RENDER_EXTERNAL_URL || '',
        secret: options.secret || process.env.RENDER_TUNNEL_SECRET || '',
        environment: 'development',
      })

      await client.connect()

      const response = await client.syncData({
        table: options.table as SyncTable,
        limit: options.limit ? parseInt(options.limit.toString()) : undefined,
        sanitize: options.sanitize !== false,
      })

      spinner.succeed(chalk.green(`Synced ${response.count} rows from ${response.table}`))

      if (options.output) {
        const fs = await import('fs/promises')
        await fs.writeFile(options.output, JSON.stringify(response.data, null, 2))
        console.log(chalk.blue(`Data written to ${options.output}`))
      } else {
        console.log(chalk.blue('\nData:'))
        console.log(JSON.stringify(response.data, null, 2))
      }

      client.disconnect()
    } catch (error) {
      spinner.fail(chalk.red('Data sync failed'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Feature Flags Command
// ============================================================================

program
  .command('flags')
  .description('Sync feature flags from production')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .option('-o, --output <file>', 'Output file (JSON)')
  .action(async (options) => {
    const spinner = ora('Syncing feature flags...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server,
        secret: options.secret,
        environment: 'development',
      })

      await client.connect()

      const sync = await client.syncFeatureFlags()

      spinner.succeed(chalk.green(`Synced ${sync.flags.length} feature flags`))

      console.log(chalk.blue('\nFeature Flags:'))
      sync.flags.forEach((flag) => {
        const status = flag.enabled ? chalk.green('✓ ON') : chalk.red('✗ OFF')
        console.log(`  ${status}  ${flag.key}`)
        if (flag.description) {
          console.log(`          ${chalk.gray(flag.description)}`)
        }
      })

      if (options.output) {
        const fs = await import('fs/promises')
        await fs.writeFile(options.output, JSON.stringify(sync.flags, null, 2))
        console.log(chalk.blue(`\nFlags written to ${options.output}`))
      }

      client.disconnect()
    } catch (error) {
      spinner.fail(chalk.red('Feature flag sync failed'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Environment Validation Command
// ============================================================================

program
  .command('validate-env')
  .description('Validate local environment against production')
  .argument('<variables...>', 'Environment variables to validate')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .action(async (variables: string[], options) => {
    const spinner = ora('Validating environment variables...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server,
        secret: options.secret,
        environment: 'development',
      })

      await client.connect()

      const response = await client.validateEnv(variables)

      spinner.succeed(chalk.green('Environment validation complete'))

      // Missing variables
      if (response.missing.length > 0) {
        console.log(chalk.red('\n❌ Missing Variables:'))
        response.missing.forEach((key) => {
          console.log(`  ${chalk.red('✗')} ${key}`)
        })
      } else {
        console.log(chalk.green('\n✓ All variables present'))
      }

      // Warnings
      if (response.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Warnings:'))
        response.warnings.forEach((warning) => {
          console.log(`  ${chalk.yellow('!')} ${warning}`)
        })
      }

      // Mismatched variables
      if (response.mismatched.length > 0) {
        console.log(chalk.yellow('\n⚠️  Mismatched Variables:'))
        response.mismatched.forEach((mismatch) => {
          console.log(`  ${chalk.yellow('!')} ${mismatch.key}`)
          console.log(`      Local:      ${mismatch.local || chalk.gray('(not set)')}`)
          console.log(`      Production: ${mismatch.production || chalk.gray('(not set)')}`)
        })
      }

      client.disconnect()

      // Exit with error if issues found
      if (response.missing.length > 0 || response.mismatched.length > 0) {
        process.exit(1)
      }
    } catch (error) {
      spinner.fail(chalk.red('Environment validation failed'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Health Check Command
// ============================================================================

program
  .command('health')
  .description('Check tunnel server health')
  .option('-s, --server <url>', 'Tunnel server URL', process.env.RENDER_EXTERNAL_URL)
  .option('--secret <secret>', 'Tunnel secret', process.env.RENDER_TUNNEL_SECRET)
  .action(async (options) => {
    const spinner = ora('Checking server health...').start()

    try {
      const client = new TunnelClient({
        serverUrl: options.server,
        secret: options.secret,
        environment: 'development',
      })

      await client.connect()

      const health = await client.healthCheck()

      spinner.succeed(chalk.green(`Server is ${health.status}`))

      console.log(chalk.blue('\nServer Status:'))
      console.log(`  Status:            ${health.status === 'healthy' ? chalk.green(health.status) : chalk.red(health.status)}`)
      console.log(`  Uptime:            ${Math.floor(health.uptime / 1000)}s`)
      console.log(`  Connected Clients: ${health.connectedClients}`)
      console.log(`  Version:           ${health.version}`)
      console.log(`  Environment:       ${health.environment}`)

      console.log(chalk.blue('\nHealth Checks:'))
      console.log(`  Database: ${health.checks.database ? chalk.green('✓') : chalk.red('✗')}`)
      console.log(`  API:      ${health.checks.api ? chalk.green('✓') : chalk.red('✗')}`)
      if (health.checks.redis !== undefined) {
        console.log(`  Redis:    ${health.checks.redis ? chalk.green('✓') : chalk.red('✗')}`)
      }

      client.disconnect()

      if (health.status !== 'healthy') {
        process.exit(1)
      }
    } catch (error) {
      spinner.fail(chalk.red('Health check failed'))
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

// ============================================================================
// Parse CLI
// ============================================================================

program.parse()
