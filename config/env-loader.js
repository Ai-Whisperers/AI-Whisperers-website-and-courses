/**
 * Unified Environment Variable Loader
 * Centralizes env loading with priority: .env.local > .env > process.env
 *
 * This fixes the "3-source problem" where env vars were loaded from:
 * - compile-content.js (custom parsing)
 * - Docker ARGs (Dockerfile)
 * - Render dashboard (runtime)
 */

const fs = require('fs')
const path = require('path')

/**
 * Load environment variables with priority order
 * Files are loaded in reverse order, so later files override earlier ones
 *
 * @param {string[]} files - Array of env files to load (in priority order)
 * @returns {Object} Combined environment variables
 */
function loadEnvWithPriority(files = ['.env.local', '.env']) {
  const vars = {}

  // Load files in reverse order (lowest priority first)
  files.slice().reverse().forEach(file => {
    const filePath = path.join(process.cwd(), file)

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')

      content.split('\n').forEach(line => {
        const trimmed = line.trim()

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
          return
        }

        // Parse KEY=VALUE format
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex === -1) {
          return
        }

        const key = trimmed.substring(0, equalIndex).trim()
        const value = trimmed.substring(equalIndex + 1).trim()

        if (key) {
          // Remove surrounding quotes if present
          vars[key] = value.replace(/^["']|["']$/g, '')
        }
      })
    }
  })

  // Return merged object (process.env has lowest priority)
  return { ...process.env, ...vars }
}

/**
 * Load and apply environment variables to process.env
 * Modifies process.env in place
 *
 * @param {string[]} files - Array of env files to load
 */
function loadAndApplyEnv(files = ['.env.local', '.env']) {
  const envVars = loadEnvWithPriority(files)
  Object.assign(process.env, envVars)
}

/**
 * Check if a required environment variable exists
 * @param {string} name - Variable name
 * @param {boolean} throwOnMissing - Throw error if missing
 * @returns {string|undefined}
 */
function requireEnv(name, throwOnMissing = true) {
  const value = process.env[name]

  if (!value && throwOnMissing) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

/**
 * Get environment variable with fallback
 * @param {string} name - Variable name
 * @param {string} fallback - Fallback value
 * @returns {string}
 */
function getEnv(name, fallback = '') {
  return process.env[name] || fallback
}

module.exports = {
  loadEnvWithPriority,
  loadAndApplyEnv,
  requireEnv,
  getEnv
}
