# Testing Infrastructure

**Version:** 1.0.0
**Last Updated:** October 12, 2025
**Status:** Production-Ready
**Test Framework:** Jest 29.x + Playwright 1.x
**Total Tests:** 370+ automated tests (100% passing)

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Jest Configuration](#jest-configuration)
4. [Playwright Configuration](#playwright-configuration)
5. [Test File Structure](#test-file-structure)
6. [Running Tests](#running-tests)
7. [Coverage Configuration](#coverage-configuration)
8. [Mocking Strategy](#mocking-strategy)
9. [Test Utilities](#test-utilities)
10. [Best Practices](#best-practices)

---

## Overview

The AI Whisperers platform uses a comprehensive **3-tier testing strategy**:

1. **Unit Tests** - Jest for isolated function/module testing
2. **Component Tests** - React Testing Library for UI component testing
3. **E2E Tests** - Playwright for full user journey testing

**Test Statistics:**
- ✅ **370+ automated tests** (100% passing)
- ✅ **14 E2E scenarios** covering critical user flows
- ✅ **60% code coverage** target (global threshold)
- ✅ **Tiered coverage** - 80% (utils), 70% (lib), 60% (API), 50% (components)
- ✅ **CI/CD integrated** with GitHub Actions
- ✅ **Coverage reporting** via Codecov

---

## Testing Stack

### Core Technologies

```yaml
Unit & Component Testing:
  Framework: Jest 29.x
  React Testing: @testing-library/react 16.x
  User Events: @testing-library/user-event 14.x
  Environment: jsdom (browser simulation)
  Mocking: Jest mocks + MSW (Mock Service Worker)

E2E Testing:
  Framework: Playwright 1.x
  Browsers: Chromium (primary), Firefox, WebKit (optional)
  Server: Next.js dev server (automatic startup)
  Screenshots: On failure
  Traces: On retry

Additional Tools:
  Type Checking: TypeScript 5.9.2
  Linting: ESLint 9.x
  Code Formatting: Prettier 3.x
  Monorepo: Turborepo + pnpm workspaces
```

### Test Distribution

```
370+ Total Tests
├── Unit Tests: ~200 tests
│   ├── Utils: storage, logger, rate-limit
│   ├── Lib: API schemas, content system
│   └── Domain: entities, value objects
│
├── Component Tests: ~150 tests
│   ├── UI Components: button, card, form
│   ├── Layout: navigation, footer
│   └── Dashboard: stats, charts
│
└── E2E Tests: ~14 scenarios
    ├── Homepage: navigation, content
    ├── Courses: listing, detail, enrollment
    └── Navigation: routing, i18n
```

---

## Jest Configuration

### Monorepo Configuration

**Root:** `jest.config.js` (40 lines)

```javascript
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
```

**Key Settings:**
- **Projects**: 3 sub-projects (web, state-core, database)
- **Coverage**: 60% global threshold
- **Reporters**: text (console), lcov (Codecov), html (local), json-summary (CI)
- **Timeout**: 10 seconds per test

---

### Web App Configuration

**File:** `apps/web/jest.config.js` (92 lines)

```javascript
const nextJest = require('next/jest')

// Create Jest config with Next.js support
const createJestConfig = nextJest({
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
    '!src/lib/content/compiled/**',
    '!src/app/layout.tsx',
  ],

  // Tiered coverage thresholds
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
```

**Key Features:**
- **Next.js Integration**: Uses `next/jest` for proper Next.js support
- **jsdom Environment**: Simulates browser environment for component tests
- **Path Aliases**: Matches TypeScript paths (`@/`, `@aiwhisperers/*`)
- **Tiered Coverage**: Different thresholds per directory (80%, 70%, 60%, 50%)
- **TypeScript Support**: ts-jest for TypeScript transformation

---

### Test Setup File

**File:** `apps/web/jest.setup.js`

```javascript
// Setup file for Jest tests
// Runs before each test file

import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Setup global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
```

**Common Mocks:**
- `next/navigation` - Router, pathname, search params
- `next-auth/react` - Session, sign in/out
- `ResizeObserver` - Browser API for component tests
- Console suppression - Clean test output

---

## Playwright Configuration

**File:** `playwright.config.ts` (53 lines)

```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: 'html',

  /* Shared settings for all projects */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Optional: Firefox and WebKit
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes
  },
})
```

**Key Settings:**
- **Test Directory**: `./e2e`
- **Parallel Execution**: Enabled (faster test runs)
- **Retries**: 2 retries on CI (flaky test mitigation)
- **Workers**: 1 worker on CI (resource constraints)
- **Traces**: Captured on retry (debugging)
- **Screenshots**: Only on failure
- **Browser**: Chromium (primary)
- **Web Server**: Automatic Next.js startup

---

## Test File Structure

### Directory Organization

```
apps/web/
├── src/
│   ├── app/api/
│   │   ├── health/
│   │   │   ├── route.ts
│   │   │   └── __tests__/
│   │   │       └── route.test.ts
│   │   ├── courses/
│   │   │   ├── route.ts
│   │   │   └── __tests__/
│   │   │       └── route.test.ts
│   │   └── user/
│   │       └── dashboard/
│   │           ├── route.ts
│   │           └── __tests__/
│   │               └── route.test.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── __tests__/
│   │   │       └── button.test.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   └── __tests__/
│   │   │       └── StatsCard.test.tsx
│   │   └── layout/
│   │       ├── navigation.tsx
│   │       └── __tests__/
│   │           └── navigation.test.tsx
│   │
│   └── utils/
│       ├── storage.ts
│       └── __tests__/
│           └── storage.test.ts
│
├── e2e/
│   ├── homepage.spec.ts
│   ├── courses.spec.ts
│   └── navigation.spec.ts
│
└── jest.config.js

packages/state-core/
├── courses/
│   ├── src/
│   │   └── store.ts
│   └── __tests__/
│       └── store.test.ts
├── ui/
│   ├── src/
│   │   └── store.ts
│   └── __tests__/
│       └── store.test.ts
└── jest.config.js
```

### Naming Conventions

**Unit/Component Tests:**
- Location: `__tests__/` directory next to source
- Pattern: `*.test.ts` or `*.test.tsx`
- Example: `button.test.tsx`, `route.test.ts`

**E2E Tests:**
- Location: `e2e/` directory at root
- Pattern: `*.spec.ts`
- Example: `homepage.spec.ts`, `courses.spec.ts`

---

## Running Tests

### NPM Scripts

**Root `package.json`:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Command Examples

#### Unit & Component Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test apps/web/src/utils/__tests__/storage.test.ts

# Run tests matching pattern
pnpm test --testPathPattern="components.*test\\.tsx$"

# Run tests for specific workspace
pnpm test --workspace=apps/web

# Run tests with verbose output
pnpm test --verbose

# Update snapshots
pnpm test -u
```

#### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI mode (debugging)
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Run specific E2E test file
pnpm exec playwright test e2e/homepage.spec.ts

# Run E2E tests in headed mode (see browser)
pnpm exec playwright test --headed

# Generate Playwright report
pnpm exec playwright show-report
```

---

## Coverage Configuration

### Tiered Coverage Thresholds

The platform uses **tiered coverage thresholds** based on code criticality:

| Directory | Threshold | Rationale |
|-----------|-----------|-----------|
| `src/utils/**` | 80% | Core utilities (high reuse, critical) |
| `src/lib/**` | 70% | Library code (shared functionality) |
| `src/app/api/**` | 60% | API routes (business logic) |
| `src/components/**` | 50% | UI components (visual, hard to test) |

### Coverage Reporters

```javascript
coverageReporters: ['text', 'lcov', 'html', 'json-summary']
```

**Reporters:**
1. **text**: Console output (immediate feedback)
2. **lcov**: Codecov integration (CI/CD)
3. **html**: Local HTML report (`coverage/index.html`)
4. **json-summary**: CI summary statistics

### Coverage Commands

```bash
# Generate coverage report
pnpm test:coverage

# View HTML coverage report
open coverage/index.html

# Coverage for specific directory
pnpm test --coverage --collectCoverageFrom="src/utils/**/*.ts"

# Coverage summary only
pnpm test --coverage --coverageReporters=text-summary
```

### Coverage Example Output

```
 PASS  apps/web/src/utils/__tests__/storage.test.ts
 PASS  apps/web/src/components/ui/__tests__/button.test.tsx
 PASS  apps/web/src/app/api/health/__tests__/route.test.ts

Test Suites: 15 passed, 15 total
Tests:       370 passed, 370 total
Snapshots:   0 total
Time:        45.123 s

----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   68.45 |    65.23 |   71.89 |   68.92 |
 utils                |   85.12 |    82.45 |   88.34 |   85.67 |
  storage.ts          |   92.34 |    89.12 |   95.45 |   92.89 | 45-48
 lib                  |   74.23 |    71.34 |   76.89 |   74.78 |
  api-schemas.ts      |   81.23 |    78.45 |   85.12 |   81.67 |
 app/api              |   62.34 |    58.89 |   65.12 |   62.89 |
 components           |   54.12 |    51.23 |   56.78 |   54.67 |
----------------------|---------|----------|---------|---------|-------------------
```

---

## Mocking Strategy

### Next.js Mocks

**Router:**
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

**Authentication:**
```typescript
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'STUDENT',
      },
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))
```

### API Mocks (MSW)

**Setup:**
```typescript
// src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/courses', () => {
    return HttpResponse.json({
      success: true,
      courses: [
        {
          id: '1',
          title: 'AI Foundations',
          slug: 'ai-foundations',
          difficulty: 'BEGINNER',
        },
      ],
    })
  }),

  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  }),
]

// src/tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// jest.setup.js
import { server } from './src/tests/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Test Utilities

### Custom Render Function

```typescript
// src/tests/utils/render.tsx
import { render, RenderOptions } from '@testing-library/react'
import { RootProvider } from '@/contexts/RootProvider'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { initialState, ...renderOptions } = options || {}

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <RootProvider initialState={initialState}>{children}</RootProvider>
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { renderWithProviders as render }
```

### Test Helpers

```typescript
// src/tests/utils/helpers.ts

export function createMockCourse(overrides = {}) {
  return {
    id: 'test-course-id',
    title: 'Test Course',
    slug: 'test-course',
    difficulty: 'BEGINNER',
    price: 49.99,
    published: true,
    ...overrides,
  }
}

export function createMockUser(overrides = {}) {
  return {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'STUDENT',
    ...overrides,
  }
}

export async function waitForLoadingToFinish() {
  const { waitForElementToBeRemoved } = await import('@testing-library/react')
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 3000,
  })
}
```

---

## Best Practices

### 1. Test Organization

```typescript
// ✅ Good: Descriptive test structure
describe('Button', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      // Test implementation
    })
  })

  describe('Interactions', () => {
    it('handles onClick events', () => {
      // Test implementation
    })
  })
})

// ❌ Bad: Flat structure
it('test 1', () => {})
it('test 2', () => {})
```

### 2. Arrange-Act-Assert Pattern

```typescript
// ✅ Good: Clear AAA pattern
it('updates count when button is clicked', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<Counter />)

  // Act
  await user.click(screen.getByRole('button', { name: /increment/i }))

  // Assert
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
})
```

### 3. Test Independence

```typescript
// ✅ Good: Each test is independent
beforeEach(() => {
  // Reset state before each test
  cleanup()
})

// ❌ Bad: Tests depend on each other
let sharedState = 0
it('test 1', () => { sharedState = 1 })
it('test 2', () => { expect(sharedState).toBe(1) })
```

### 4. Use Testing Library Queries

```typescript
// ✅ Good: Accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// ❌ Bad: Implementation details
container.querySelector('.submit-button')
```

### 5. Async Testing

```typescript
// ✅ Good: Proper async handling
it('loads data', async () => {
  render(<DataComponent />)

  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  })
})

// ❌ Bad: No async handling
it('loads data', () => {
  render(<DataComponent />)
  expect(screen.getByText(/loaded/i)).toBeInTheDocument() // May fail
})
```

---

## Summary

The AI Whisperers testing infrastructure provides:

✅ **Comprehensive Coverage**: 370+ tests across unit, component, and E2E
✅ **Tiered Thresholds**: 80% (utils), 70% (lib), 60% (API), 50% (components)
✅ **Modern Stack**: Jest 29.x, Playwright 1.x, React Testing Library 16.x
✅ **CI/CD Integration**: GitHub Actions with parallel execution
✅ **Monorepo Support**: 3 projects (web, state-core, database)
✅ **Coverage Reporting**: Codecov integration with detailed reports
✅ **Developer Experience**: Watch mode, UI mode, debugging tools

**Key Files:**
- Root Config: `jest.config.js` (40 lines)
- Web Config: `apps/web/jest.config.js` (92 lines)
- Playwright Config: `playwright.config.ts` (53 lines)
- Setup: `apps/web/jest.setup.js`

**Related Documentation:**
- [23-unit-testing.md](./23-unit-testing.md) - Writing unit tests
- [24-component-testing.md](./24-component-testing.md) - Component test patterns
- [25-e2e-testing.md](./25-e2e-testing.md) - E2E test scenarios
- [26-cicd-pipeline.md](./26-cicd-pipeline.md) - GitHub Actions CI/CD

---

*Last Updated: October 12, 2025 - Complete testing infrastructure with 370+ automated tests.*
