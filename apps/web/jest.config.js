const nextJest = require('next/jest')

// Create Jest config with Next.js support
const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  displayName: 'web',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module resolution
  moduleNameMapper: {
    // Path aliases matching tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@aiwhisperers/database$': '<rootDir>/../../packages/database/src',
    '^@aiwhisperers/state-core/(.*)$': '<rootDir>/../../packages/state-core/$1/src',
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Exclude patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
  ],

  // Collect coverage from source files
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/lib/content/compiled/**', // Exclude compiled content
    '!src/app/layout.tsx', // Exclude Next.js root layout
  ],

  // Coverage thresholds per directory
  coverageThreshold: {
    // Utilities: 80% coverage (highest priority)
    './src/utils/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Lib utilities: 70% coverage
    './src/lib/**/*.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // API routes: 60% coverage
    './src/app/api/**/*.ts': {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    // Components: 50% coverage
    './src/components/**/*.tsx': {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}

// Export config with Next.js transformations
module.exports = createJestConfig(customJestConfig)
