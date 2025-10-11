/** @type {import('jest').Config} */
module.exports = {
  displayName: 'state-core',
  testEnvironment: 'jsdom', // Need jsdom for React hooks
  roots: ['<rootDir>'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Transform TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },

  // Collect coverage from source files
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],

  // Coverage thresholds (70% for state stores)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Setup file for React Testing Library
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
