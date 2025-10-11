/** @type {import('jest').Config} */
module.exports = {
  // Monorepo project configuration
  projects: [
    '<rootDir>/apps/web',
    '<rootDir>/packages/state-core',
    '<rootDir>/packages/database',
  ],

  // Coverage output directory
  coverageDirectory: '<rootDir>/coverage',

  // Collect coverage from all source files
  collectCoverageFrom: [
    'apps/*/src/**/*.{ts,tsx}',
    'packages/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/lib/content/compiled/**', // Exclude compiled content
  ],

  // Global coverage thresholds (60% target)
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Test timeout
  testTimeout: 10000,
}
