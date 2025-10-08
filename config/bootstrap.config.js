/**
 * Unified Bootstrap Contract
 * Single source of truth for environment detection and config orchestration
 *
 * This centralizes all config layer decisions to eliminate mismatches:
 * - Turbopack vs Webpack selection
 * - Build vs Runtime DATABASE_URL
 * - Env var loading priority
 * - Build script variations
 */

const { getDatabaseUrl, getDatabaseStrategy } = require('./database.config')
const { loadEnvWithPriority } = require('./env-loader')

// Detect execution environment
const ENV_CONTEXT = process.env.NODE_ENV || 'development'
const IS_DOCKER = process.env.DOCKER_BUILD === 'true'
const IS_RENDER = process.env.RENDER === 'true'
const IS_CI = process.env.CI === 'true'

/**
 * Unified Bootstrap Configuration
 */
const bootstrapConfig = {
  // ==========================================
  // Environment Detection
  // ==========================================
  context: {
    env: ENV_CONTEXT,
    isLocal: ENV_CONTEXT === 'development' && !IS_DOCKER && !IS_CI,
    isDocker: IS_DOCKER,
    isRender: IS_RENDER,
    isCI: IS_CI,
    isProd: ENV_CONTEXT === 'production',
    isDev: ENV_CONTEXT === 'development'
  },

  // ==========================================
  // Build Tool Selection
  // Enterprise Strategy: Webpack-only for stability and security
  // ==========================================
  buildTool: {
    // Always use Webpack (enterprise-grade, mature, stable)
    // Turbopack is experimental and causes parsing errors
    dev: 'webpack',

    // Always use Webpack for builds (most stable, has all configs)
    build: 'webpack',

    // Check if webpack config is needed
    get requiresWebpackConfig() {
      return true // Always true since we use Webpack exclusively
    },

    // Check if turbopack config is needed
    get requiresTurbopackConfig() {
      return false // Turbopack disabled for stability
    }
  },

  // ==========================================
  // Database Strategy
  // Fixes: Build-time placeholder vs Runtime real URL
  // ==========================================
  database: {
    // Get URL for build context (allows placeholder)
    get buildUrl() {
      return getDatabaseUrl('build')
    },

    // Get URL for runtime context (requires real URL)
    get runtimeUrl() {
      return getDatabaseUrl('runtime')
    },

    // Get session strategy (database or jwt)
    get strategy() {
      return getDatabaseStrategy()
    }
  },

  // ==========================================
  // Environment Variable Loading
  // Fixes: 3-source problem (.env.local, Docker ARGs, Render)
  // ==========================================
  env: {
    // Priority order (highest to lowest)
    priority: [
      '.env.local',   // Highest: Local development overrides
      '.env',         // Medium: Shared defaults
      // process.env   // Lowest: System/Docker/Render (implicit)
    ],

    // Load all env vars with priority
    load() {
      return loadEnvWithPriority(this.priority)
    }
  },

  // ==========================================
  // Content Compilation
  // ==========================================
  content: {
    // Skip compilation in Docker (done during build stage)
    get shouldCompile() {
      return !IS_DOCKER
    },

    inputDir: 'src/content/pages',
    outputDir: 'src/lib/content/compiled'
  },

  // ==========================================
  // Build Scripts
  // Fixes: build vs build:docker inconsistency
  // ==========================================
  scripts: {
    // Dev server command (Webpack-only)
    getDev() {
      return 'next dev' // Always Webpack, no --turbopack flag
    },

    // Build command (adapts to context)
    getBuild() {
      const steps = []

      // npm install only if not in Docker (Docker does it in deps stage)
      if (!IS_DOCKER) {
        steps.push('npm install')
      }

      // Always compile content
      steps.push('node scripts/compile-content.js')

      // Always generate Prisma client
      steps.push('npx prisma generate')

      // Always build Next.js
      steps.push('next build')

      return steps.join(' && ')
    },

    // Content compilation (standalone)
    getCompileContent() {
      return 'node scripts/compile-content.js'
    }
  },

  // ==========================================
  // Feature Flags
  // ==========================================
  features: {
    // Use Webpack exclusively (Turbopack disabled)
    get useTurbopack() {
      return false // Disabled for enterprise stability
    },

    // Use database sessions (vs JWT)
    get useDatabaseSessions() {
      return bootstrapConfig.database.strategy === 'database'
    },

    // Enable hot reload
    get enableHotReload() {
      return bootstrapConfig.context.isLocal
    }
  },

  // ==========================================
  // Validation
  // ==========================================
  validate() {
    const errors = []

    // Check Node environment
    if (!['development', 'production', 'test'].includes(ENV_CONTEXT)) {
      errors.push(`Invalid NODE_ENV: ${ENV_CONTEXT}`)
    }

    // Check database in production
    if (this.context.isProd && this.database.strategy === 'jwt') {
      console.warn('⚠️  WARNING: Production mode with JWT sessions (no database)')
    }

    if (errors.length > 0) {
      throw new Error(`Bootstrap validation failed:\n${errors.join('\n')}`)
    }

    return true
  },

  // ==========================================
  // Debug Info
  // ==========================================
  getDebugInfo() {
    return {
      context: this.context,
      buildTool: {
        dev: this.buildTool.dev,
        build: this.buildTool.build
      },
      database: {
        strategy: this.database.strategy,
        configured: this.database.strategy === 'database'
      },
      features: this.features,
      scripts: {
        dev: this.scripts.getDev(),
        build: this.scripts.getBuild()
      }
    }
  }
}

// Validate on load (only in non-production to avoid startup issues)
if (ENV_CONTEXT !== 'production') {
  try {
    bootstrapConfig.validate()
  } catch (error) {
    console.error('Bootstrap validation error:', error.message)
  }
}

module.exports = bootstrapConfig
