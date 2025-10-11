# 🧪 Phase 6: Testing Infrastructure Implementation Plan

**Version:** 1.0.0
**Created:** 2025-10-11
**Status:** 📋 Planning Complete - Ready for Implementation
**Goal:** Achieve 60% overall test coverage with comprehensive testing infrastructure

---

## 📋 Executive Summary

### Current State
- **Jest**: Installed (`^29.7.0`) but not configured
- **Playwright**: Installed (`^1.49.0`) for E2E testing
- **Test Files**: 0 (starting from scratch)
- **Coverage**: 0% (no tests exist)
- **Scripts**: Exist in package.json but non-functional

### Target State
- **Overall Coverage**: 60%
- **Utilities**: 80% coverage (highest priority)
- **State Stores**: 70% coverage (Zustand stores)
- **API Routes**: 60% coverage (integration tests)
- **Components**: 50% coverage (React components)
- **E2E**: Critical user flows covered

### Scope
This phase implements a **comprehensive testing infrastructure** for the AI Whisperers platform with:
- ✅ Jest configuration for monorepo
- ✅ React Testing Library for component tests
- ✅ Mock Service Worker (MSW) for API mocking
- ✅ Zustand store testing utilities
- ✅ Playwright E2E test framework
- ✅ Coverage reporting and CI integration
- ✅ Test utilities and helpers

---

## 🎯 Testing Strategy

### 4-Tier Testing Pyramid

```
          ┌─────────────┐
          │    E2E      │  5% - Critical user flows
          │  Playwright │
          └─────────────┘
        ┌───────────────┐
        │  Integration  │  15% - API routes, full flows
        │   API Tests   │
        └───────────────┘
      ┌───────────────────┐
      │   Component Tests │  30% - React components, hooks
      │  React Testing    │
      └───────────────────┘
    ┌─────────────────────────┐
    │      Unit Tests         │  50% - Utilities, pure functions
    │   Jest + TypeScript     │
    └─────────────────────────┘
```

### Coverage Targets

| Category | Target | Priority | Files to Test | Rationale |
|----------|--------|----------|---------------|-----------|
| **Utilities** | 80% | P0 | `utils/storage.ts`, `lib/utils.ts`, `config/*.ts` | Business logic, pure functions - highest ROI |
| **State Stores** | 70% | P0 | `packages/state-core/**/*.ts` | Critical state management, Zustand stores |
| **API Routes** | 60% | P1 | `app/api/**/route.ts` (12 routes) | Backend logic, data access |
| **Hooks** | 65% | P1 | Custom React hooks (courses, auth, etc.) | React state integration |
| **Components** | 50% | P2 | UI components (focus on critical paths) | Visual elements, user interactions |
| **E2E** | N/A | P0 | Auth flow, course enrollment, payment | Full user journeys |

---

## 📦 Phase 6 Tasks Breakdown

### **Task 6.1: Jest Configuration Setup** ⏱️ 2 hours

**Goal:** Configure Jest for monorepo with TypeScript, coverage, and proper module resolution

**Files to Create:**
1. `jest.config.js` (root - monorepo orchestration)
2. `apps/web/jest.config.js` (web app configuration)
3. `packages/state-core/jest.config.js` (state package configuration)
4. `packages/database/jest.config.js` (database package configuration)
5. `jest.setup.js` (global test setup)

**Root Jest Configuration** (`jest.config.js`):
```javascript
/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/apps/web',
    '<rootDir>/packages/state-core',
    '<rootDir>/packages/database',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/*/src/**/*.{ts,tsx}',
    'packages/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
```

**Web App Configuration** (`apps/web/jest.config.js`):
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  displayName: 'web',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@aiwhisperers/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/lib/content/compiled/**',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
  ],
  coverageThresholds: {
    './src/utils/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/**/*.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/app/api/**/*.ts': {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    './src/components/**/*.tsx': {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Jest Setup File** (`apps/web/jest.setup.js`):
```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
global.sessionStorage = localStorageMock

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(public name: string) {}
  postMessage = jest.fn()
  close = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()
}

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}
```

**State Core Configuration** (`packages/state-core/jest.config.js`):
```javascript
/** @type {import('jest').Config} */
module.exports = {
  displayName: 'state-core',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

---

### **Task 6.2: Install Testing Dependencies** ⏱️ 1 hour

**Goal:** Install all required testing libraries and dev dependencies

**Dependencies to Install:**

```bash
# Root dependencies
pnpm add -D -w \
  @testing-library/react@^16.1.0 \
  @testing-library/jest-dom@^6.6.3 \
  @testing-library/user-event@^14.5.2 \
  @types/jest@^29.5.14 \
  jest-environment-jsdom@^29.7.0 \
  ts-jest@^29.2.5

# API mocking
pnpm add -D -w msw@^2.7.2

# Coverage reporting
pnpm add -D -w @jest/reporters@^29.7.0

# Zustand testing utilities
pnpm add -D -w @testing-library/react-hooks@^8.0.1

# E2E testing (already installed, but add helpers)
pnpm add -D -w @axe-core/playwright@^4.10.2
```

**Package Breakdown:**
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM testing
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - Browser environment for Jest
- `ts-jest` - TypeScript support for Jest
- `msw` - Mock Service Worker for API mocking
- `@axe-core/playwright` - Accessibility testing in E2E

---

### **Task 6.3: Create Test Utilities** ⏱️ 3 hours

**Goal:** Build reusable test utilities and helpers for consistent testing

**Files to Create:**

**1. Test Render Utility** (`apps/web/src/__tests__/utils/test-utils.tsx`):
```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { SecurityProvider } from '@/contexts/security/SecurityProvider'
import { I18nProvider } from '@/contexts/i18n/I18nProvider'

// Mock session for authenticated tests
export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'STUDENT' as const,
  },
  expires: '2025-12-31',
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null
  locale?: 'en' | 'es'
}

function AllTheProviders({
  children,
  session = null,
  locale = 'en',
}: {
  children: React.ReactNode
  session?: typeof mockSession | null
  locale?: 'en' | 'es'
}) {
  return (
    <SecurityProvider initialSession={session}>
      <I18nProvider initialLocale={locale}>
        {children}
      </I18nProvider>
    </SecurityProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { session, locale, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders session={session} locale={locale}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { renderWithProviders as render }
```

**2. Mock API Handlers** (`apps/web/src/__tests__/mocks/handlers.ts`):
```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // Courses API
  http.get('/api/courses', () => {
    return HttpResponse.json({
      courses: [
        {
          id: '1',
          title: 'Test Course',
          slug: 'test-course',
          description: 'A test course',
          price: 99.99,
          published: true,
        },
      ],
    })
  }),

  // User dashboard
  http.get('/api/user/dashboard', () => {
    return HttpResponse.json({
      enrollments: [],
      achievements: [],
      progress: {},
    })
  }),

  // Auth session
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
      },
    })
  }),
]
```

**3. MSW Server Setup** (`apps/web/src/__tests__/mocks/server.ts`):
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Setup and teardown
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

**4. Zustand Test Utilities** (`packages/state-core/__tests__/utils/store-utils.ts`):
```typescript
import { act } from '@testing-library/react'
import type { StoreApi, UseBoundStore } from 'zustand'

/**
 * Reset Zustand store to initial state
 */
export function resetStore<T>(
  useStore: UseBoundStore<StoreApi<T & { reset?: () => void }>>
) {
  act(() => {
    const state = useStore.getState()
    if (state.reset) {
      state.reset()
    }
  })
}

/**
 * Get current store state (non-reactive)
 */
export function getStoreState<T>(useStore: UseBoundStore<StoreApi<T>>): T {
  return useStore.getState()
}

/**
 * Update store state directly (for testing only)
 */
export function setStoreState<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  partialState: Partial<T>
) {
  act(() => {
    useStore.setState(partialState as any)
  })
}
```

**5. Database Test Utilities** (`packages/database/__tests__/utils/db-utils.ts`):
```typescript
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

export type MockPrisma = DeepMockProxy<PrismaClient>

export const prismaMock = mockDeep<PrismaClient>()

export function resetDatabase() {
  mockReset(prismaMock)
}

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'STUDENT',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock course data
export const mockCourse = {
  id: 'test-course-id',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test course description',
  price: 99.99,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

---

### **Task 6.4: Write Utility Tests** ⏱️ 8 hours

**Goal:** Achieve 80% coverage for utility functions (highest ROI)

**Priority 1 - Critical Utilities** (4 hours):

**1. Storage Utility Tests** (`apps/web/src/utils/__tests__/storage.test.ts`):
```typescript
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearNamespace,
  encryptData,
  decryptData,
  getEncryptedItem,
  setEncryptedItem,
  isBrowser,
  STORAGE_KEYS,
} from '../storage'

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true)
    })
  })

  describe('getStorageItem', () => {
    it('should return default value when item does not exist', () => {
      const result = getStorageItem('SECURITY', 'test', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should retrieve and parse stored item', () => {
      const testData = { userId: '123', token: 'abc' }
      localStorage.setItem('aiw_security_test', JSON.stringify(testData))

      const result = getStorageItem('SECURITY', 'test', {})
      expect(result).toEqual(testData)
    })

    it('should return default value on parse error', () => {
      localStorage.setItem('aiw_security_test', 'invalid-json')

      const result = getStorageItem('SECURITY', 'test', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should decompress compressed data', () => {
      const testData = { large: 'data'.repeat(1000) }
      setStorageItem('SECURITY', 'test', testData, true)

      const result = getStorageItem('SECURITY', 'test', {}, true)
      expect(result).toEqual(testData)
    })
  })

  describe('setStorageItem', () => {
    it('should store item with correct namespace key', () => {
      const testData = { test: 'data' }
      setStorageItem('PRESENTATION', 'theme', testData)

      const stored = localStorage.getItem('aiw_presentation_theme')
      expect(stored).toBe(JSON.stringify(testData))
    })

    it('should compress data when requested', () => {
      const testData = { large: 'data'.repeat(1000) }
      setStorageItem('SECURITY', 'test', testData, true)

      const stored = localStorage.getItem('aiw_security_test')
      // Compressed data should be shorter
      expect(stored!.length).toBeLessThan(JSON.stringify(testData).length)
    })

    it('should return false on error', () => {
      // Mock localStorage.setItem to throw
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded')
      })

      const result = setStorageItem('SECURITY', 'test', { data: true })
      expect(result).toBe(false)
    })
  })

  describe('removeStorageItem', () => {
    it('should remove item from storage', () => {
      localStorage.setItem('aiw_logic_test', 'data')

      removeStorageItem('LOGIC', 'test')

      expect(localStorage.getItem('aiw_logic_test')).toBeNull()
    })
  })

  describe('clearNamespace', () => {
    it('should clear all items in namespace', () => {
      localStorage.setItem('aiw_security_token', 'abc')
      localStorage.setItem('aiw_security_user', 'xyz')
      localStorage.setItem('aiw_presentation_theme', 'dark')

      clearNamespace('SECURITY')

      expect(localStorage.getItem('aiw_security_token')).toBeNull()
      expect(localStorage.getItem('aiw_security_user')).toBeNull()
      expect(localStorage.getItem('aiw_presentation_theme')).toBe('dark')
    })
  })

  describe('encryptData / decryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const original = 'sensitive-data'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(encrypted).not.toBe(original)
      expect(decrypted).toBe(original)
    })

    it('should handle decryption errors gracefully', () => {
      const invalidEncrypted = 'not-base64!!!'
      const result = decryptData(invalidEncrypted)

      expect(result).toBe(invalidEncrypted) // Returns input on error
    })
  })

  describe('getEncryptedItem / setEncryptedItem', () => {
    it('should store and retrieve encrypted data', () => {
      const sensitiveData = { password: 'secret123' }

      setEncryptedItem('SECURITY', 'credentials', sensitiveData)
      const retrieved = getEncryptedItem('SECURITY', 'credentials', {})

      expect(retrieved).toEqual(sensitiveData)

      // Verify it's actually encrypted in storage
      const raw = localStorage.getItem('aiw_security_credentials')
      expect(raw).not.toContain('secret123')
    })
  })
})
```

**Test Coverage Report for storage.ts:**
- ✅ **90% coverage expected** (all functions covered)
- ✅ **Edge cases**: Empty data, parse errors, quota exceeded
- ✅ **Compression**: LZ-string integration
- ✅ **Encryption**: Base64 encoding/decoding
- ✅ **SSR safety**: Browser checks

**2. Config Validation Tests** (`apps/web/src/config/__tests__/env.test.ts`):
```typescript
import { env } from '../env'

describe('env.ts', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should validate required environment variables', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test'
    process.env.NEXTAUTH_SECRET = 'a'.repeat(32)
    process.env.NEXTAUTH_URL = 'http://localhost:3000'

    expect(() => require('../env').env).not.toThrow()
  })

  it('should throw on missing DATABASE_URL', () => {
    delete process.env.DATABASE_URL

    expect(() => require('../env').env).toThrow()
  })

  it('should throw on short NEXTAUTH_SECRET', () => {
    process.env.NEXTAUTH_SECRET = 'short'

    expect(() => require('../env').env).toThrow(/at least 32 characters/)
  })

  it('should use default values for optional fields', () => {
    const config = require('../env').env

    expect(config.NODE_ENV).toBe('development')
    expect(config.NEXT_PUBLIC_ENABLE_COURSES).toBe(true)
  })
})
```

**Priority 2 - Lib Utilities** (4 hours):

**3. Utils Tests** (`apps/web/src/lib/__tests__/utils.test.ts`):
```typescript
import { cn, formatDate, formatCurrency, slugify } from '../utils'

describe('utils.ts', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
    })

    it('should handle conditional classes', () => {
      expect(cn('btn', { 'btn-primary': true, 'btn-disabled': false }))
        .toBe('btn btn-primary')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15')
      expect(formatDate(date, 'en')).toBe('January 15, 2025')
    })

    it('should format date in Spanish', () => {
      const date = new Date('2025-01-15')
      expect(formatDate(date, 'es')).toBe('15 de enero de 2025')
    })
  })

  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(99.99, 'USD', 'en')).toBe('$99.99')
    })

    it('should format EUR currency', () => {
      expect(formatCurrency(99.99, 'EUR', 'es')).toBe('99,99 €')
    })
  })

  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(slugify('Café & Résumé')).toBe('cafe-resume')
    })

    it('should remove multiple dashes', () => {
      expect(slugify('Hello   World  !')).toBe('hello-world')
    })
  })
})
```

---

### **Task 6.5: Write State Store Tests** ⏱️ 6 hours

**Goal:** Achieve 70% coverage for Zustand stores

**1. Courses Store Tests** (`packages/state-core/courses/__tests__/store.test.ts`):
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCoursesStore, useSelectedCourse, useEnrolledCourses } from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

describe('courses store', () => {
  beforeEach(() => {
    resetStore(useCoursesStore)
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useCoursesStore())

    expect(result.current.courses).toEqual([])
    expect(result.current.enrollments).toEqual([])
    expect(result.current.selectedCourseId).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set courses', () => {
    const { result } = renderHook(() => useCoursesStore())
    const mockCourses = [
      { id: '1', title: 'Course 1', slug: 'course-1' },
      { id: '2', title: 'Course 2', slug: 'course-2' },
    ]

    act(() => {
      result.current.setCourses(mockCourses)
    })

    expect(result.current.courses).toEqual(mockCourses)
  })

  it('should select course', () => {
    const { result } = renderHook(() => useCoursesStore())

    act(() => {
      result.current.selectCourse('course-1')
    })

    expect(result.current.selectedCourseId).toBe('course-1')
  })

  it('should compute selected course', () => {
    const { result } = renderHook(() => useSelectedCourse())
    const mockCourses = [
      { id: '1', title: 'Course 1', slug: 'course-1' },
    ]

    act(() => {
      useCoursesStore.getState().setCourses(mockCourses)
      useCoursesStore.getState().selectCourse('1')
    })

    expect(result.current).toEqual(mockCourses[0])
  })

  it('should add enrollment', () => {
    const { result } = renderHook(() => useCoursesStore())
    const mockEnrollment = {
      id: 'enrollment-1',
      userId: 'user-1',
      courseId: 'course-1',
    }

    act(() => {
      result.current.addEnrollment(mockEnrollment)
    })

    expect(result.current.enrollments).toContainEqual(mockEnrollment)
  })

  it('should compute enrolled courses', () => {
    const { result } = renderHook(() => useEnrolledCourses())
    const mockCourses = [
      { id: '1', title: 'Course 1' },
      { id: '2', title: 'Course 2' },
    ]
    const mockEnrollments = [
      { id: 'e1', userId: 'user-1', courseId: '1' },
    ]

    act(() => {
      useCoursesStore.getState().setCourses(mockCourses)
      useCoursesStore.getState().setEnrollments(mockEnrollments)
    })

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should reset store', () => {
    const { result } = renderHook(() => useCoursesStore())

    act(() => {
      result.current.setCourses([{ id: '1', title: 'Course 1' }])
      result.current.setLoading(true)
      result.current.setError('Test error')
      result.current.reset()
    })

    expect(result.current.courses).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useCoursesStore())
    const mockCourses = [{ id: '1', title: 'Course 1' }]

    act(() => {
      result.current.setCourses(mockCourses)
    })

    // Check localStorage was called (mocked in jest.setup.js)
    expect(localStorage.setItem).toHaveBeenCalled()
  })
})
```

**2. UI Store Tests** (`packages/state-core/ui/__tests__/store.test.ts`):
```typescript
import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

describe('ui store', () => {
  beforeEach(() => {
    resetStore(useUIStore)
  })

  it('should toggle theme', () => {
    const { result } = renderHook(() => useUIStore())

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })

  it('should set language', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setLanguage('es')
    })

    expect(result.current.language).toBe('es')
  })

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore())

    expect(result.current.sidebarOpen).toBe(false)

    act(() => {
      result.current.toggleSidebar()
    })

    expect(result.current.sidebarOpen).toBe(true)
  })
})
```

---

### **Task 6.6: Write API Integration Tests** ⏱️ 8 hours

**Goal:** Achieve 60% coverage for API routes (12 routes)

**Priority Routes** (Focus on high-traffic, business-critical endpoints):

**1. Health Check API Test** (`apps/web/src/app/api/health/__tests__/route.test.ts`):
```typescript
import { GET } from '../route'

describe('/api/health', () => {
  it('should return 200 with ok status', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })
})
```

**2. Courses API Tests** (`apps/web/src/app/api/courses/__tests__/route.test.ts`):
```typescript
import { GET, POST } from '../route'
import { prismaMock, mockCourse } from '@/__tests__/utils/db-utils'

jest.mock('@/lib/db/prisma', () => ({
  prisma: prismaMock,
}))

describe('/api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return all published courses', async () => {
      prismaMock.course.findMany.mockResolvedValue([mockCourse])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0]).toEqual(mockCourse)
    })

    it('should only return published courses', async () => {
      const request = new Request('http://localhost:3000/api/courses')

      await GET(request)

      expect(prismaMock.course.findMany).toHaveBeenCalledWith({
        where: { published: true },
        include: expect.any(Object),
      })
    })

    it('should handle database errors', async () => {
      prismaMock.course.findMany.mockRejectedValue(
        new Error('Database connection failed')
      )

      const response = await GET()

      expect(response.status).toBe(500)
    })
  })

  describe('POST', () => {
    it('should create new course (admin only)', async () => {
      const courseData = {
        title: 'New Course',
        slug: 'new-course',
        description: 'Course description',
        price: 99.99,
      }

      prismaMock.course.create.mockResolvedValue({
        ...mockCourse,
        ...courseData,
      })

      const request = new Request('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.course.title).toBe('New Course')
    })

    it('should require authentication', async () => {
      const request = new Request('http://localhost:3000/api/courses', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
      })

      const response = await POST(request)

      expect(response.status).toBe(401)
    })
  })
})
```

**3. User Dashboard API Tests** (`apps/web/src/app/api/user/dashboard/__tests__/route.test.ts`):
```typescript
import { GET } from '../route'
import { prismaMock, mockUser } from '@/__tests__/utils/db-utils'
import { getServerSession } from 'next-auth'

jest.mock('next-auth')
jest.mock('@/lib/db/prisma', () => ({
  prisma: prismaMock,
}))

describe('/api/user/dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user dashboard data', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    })

    prismaMock.enrollment.findMany.mockResolvedValue([])
    prismaMock.achievement.findMany.mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('enrollments')
    expect(data).toHaveProperty('achievements')
    expect(data).toHaveProperty('progress')
  })

  it('should require authentication', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const response = await GET()

    expect(response.status).toBe(401)
  })
})
```

---

### **Task 6.7: Write Component Tests** ⏱️ 6 hours

**Goal:** Achieve 50% coverage for React components (focus on critical UI)

**1. Button Component Test** (`apps/web/src/components/ui/__tests__/button.test.tsx`):
```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByText('Click me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Button onClick={handleClick} disabled>Click me</Button>)

    await user.click(screen.getByText('Click me'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)

    expect(container.firstChild).toHaveClass('bg-destructive')
  })
})
```

**2. Course Card Component Test** (`apps/web/src/components/courses/__tests__/CourseCard.test.tsx`):
```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { CourseCard } from '../CourseCard'

const mockCourse = {
  id: '1',
  title: 'Introduction to AI',
  slug: 'intro-ai',
  description: 'Learn AI basics',
  price: 99.99,
  imageUrl: '/course.jpg',
  published: true,
}

describe('CourseCard', () => {
  it('should render course information', () => {
    render(<CourseCard course={mockCourse} />)

    expect(screen.getByText('Introduction to AI')).toBeInTheDocument()
    expect(screen.getByText('Learn AI basics')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('should render course image', () => {
    render(<CourseCard course={mockCourse} />)

    const image = screen.getByAltText('Introduction to AI')
    expect(image).toBeInTheDocument()
  })

  it('should link to course page', () => {
    render(<CourseCard course={mockCourse} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/courses/intro-ai')
  })
})
```

---

### **Task 6.8: Set Up Playwright E2E Tests** ⏱️ 8 hours

**Goal:** Cover critical user flows with E2E tests

**1. Playwright Configuration** (`playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'pnpm dev:web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**2. Authentication Flow E2E Test** (`e2e/auth.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/auth/signup')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="name"]', 'Test User')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome, Test User')).toBeVisible()
  })

  test('should allow user to sign in', async ({ page }) => {
    await page.goto('/auth/signin')

    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'password123')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    await page.click('button[type="submit"]')

    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })
})
```

**3. Course Enrollment E2E Test** (`e2e/courses.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'

test.describe('Course Enrollment', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/auth/signin')
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should browse and enroll in a course', async ({ page }) => {
    await page.goto('/courses')

    // Find course card
    const courseCard = page.getByText('Introduction to AI').first()
    await expect(courseCard).toBeVisible()

    // Click on course
    await courseCard.click()

    // Should be on course detail page
    await expect(page).toHaveURL(/\/courses\/.+/)

    // Enroll in course
    await page.click('button:has-text("Enroll Now")')

    // Should see success message
    await expect(page.getByText('Successfully enrolled')).toBeVisible()

    // Navigate to dashboard
    await page.goto('/dashboard')

    // Course should appear in enrolled courses
    await expect(page.getByText('Introduction to AI')).toBeVisible()
  })

  test('should prevent duplicate enrollment', async ({ page }) => {
    // Already enrolled from previous test
    await page.goto('/courses/intro-ai')

    // Enroll button should be disabled or show "Already Enrolled"
    const enrollButton = page.getByText(/Enroll|Already Enrolled/)
    await expect(enrollButton).toBeDisabled()
  })
})
```

**4. Accessibility E2E Test** (`e2e/accessibility.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('should have no accessibility violations on homepage', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)

    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })

  test('should have no violations on courses page', async ({ page }) => {
    await page.goto('/courses')
    await injectAxe(page)

    await checkA11y(page)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation
    await page.keyboard.press('Tab')

    // First focusable element should be highlighted
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON']).toContain(focused)

    // Press Enter on focused element
    await page.keyboard.press('Enter')

    // Should navigate somewhere
    await page.waitForLoadState('networkidle')
  })
})
```

---

### **Task 6.9: Configure Coverage Reporting** ⏱️ 2 hours

**Goal:** Set up comprehensive coverage reporting and CI integration

**1. Update Root Scripts** (`package.json`):
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "pnpm test:ci && pnpm test:e2e"
  }
}
```

**2. GitHub Actions Workflow** (`.github/workflows/test.yml`):
```yaml
name: Tests

on:
  push:
    branches: [main, refactor/enterprise]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true

  e2e-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.x

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build:web

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          NEXTAUTH_SECRET: test-secret-minimum-32-characters-long
          NEXTAUTH_URL: http://localhost:3000

      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**3. Coverage Badge** (`README.md` addition):
```markdown
[![Test Coverage](https://codecov.io/gh/ai-whisperers/platform/branch/main/graph/badge.svg)](https://codecov.io/gh/ai-whisperers/platform)
[![Tests](https://github.com/ai-whisperers/platform/actions/workflows/test.yml/badge.svg)](https://github.com/ai-whisperers/platform/actions/workflows/test.yml)
```

---

### **Task 6.10: Update Documentation** ⏱️ 2 hours

**Goal:** Document testing infrastructure and mark Phase 6 complete

**Files to Update:**

**1. Create Testing Guide** (`docs/TESTING.md`):
```markdown
# 🧪 Testing Guide

## Overview
Comprehensive testing strategy with 60% overall coverage.

## Running Tests

### Unit & Integration Tests
```bash
# Run all tests
pnpm test

# Watch mode (development)
pnpm test:watch

# With coverage
pnpm test:coverage

# CI mode
pnpm test:ci
```

### E2E Tests
```bash
# Run E2E tests
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug
```

## Writing Tests

### Unit Tests
```typescript
// apps/web/src/utils/__tests__/example.test.ts
import { myUtilFunction } from '../example'

describe('myUtilFunction', () => {
  it('should do something', () => {
    expect(myUtilFunction('input')).toBe('output')
  })
})
```

### Component Tests
```typescript
// apps/web/src/components/__tests__/Example.test.tsx
import { render, screen } from '@/__tests__/utils/test-utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### API Route Tests
```typescript
// apps/web/src/app/api/example/__tests__/route.test.ts
import { GET } from '../route'

describe('/api/example', () => {
  it('should return data', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })
})
```

### E2E Tests
```typescript
// e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('should work end-to-end', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/AI Whisperers/)
})
```

## Coverage Targets

| Category | Target | Status |
|----------|--------|--------|
| Overall | 60% | ✅ |
| Utilities | 80% | ✅ |
| State Stores | 70% | ✅ |
| API Routes | 60% | ✅ |
| Components | 50% | ✅ |

## Test Utilities

### Custom Render
```typescript
import { render } from '@/__tests__/utils/test-utils'

// Automatically wraps with providers
render(<MyComponent />, {
  session: mockSession, // Optional authenticated session
  locale: 'es', // Optional language
})
```

### Store Testing
```typescript
import { resetStore } from '@/__tests__/utils/store-utils'

beforeEach(() => {
  resetStore(useMyStore)
})
```

### API Mocking
```typescript
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'

// Override handler for specific test
server.use(
  http.get('/api/example', () => {
    return HttpResponse.json({ data: 'custom' })
  })
)
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` and `refactor/enterprise`
- Every pull request
- Pre-deployment verification

## Troubleshooting

### Tests Failing Locally
1. Clear cache: `pnpm test --clearCache`
2. Reinstall dependencies: `pnpm install`
3. Check Node version: `node --version` (should be 22.x)

### E2E Tests Timeout
1. Increase timeout in `playwright.config.ts`
2. Check server is running: `curl http://localhost:3000/api/health`
3. Run in debug mode: `pnpm test:e2e:debug`

### Coverage Not Accurate
1. Delete coverage folder: `rm -rf coverage`
2. Run fresh: `pnpm test:coverage`
```

**2. Update Refactor Plan** (`local-reports/refactor-plan.md`):
```markdown
### Phase 6: Testing ✅ COMPLETE
- [x] Jest configuration created (monorepo-aware)
- [x] Testing dependencies installed (RTL, MSW, Playwright helpers)
- [x] Test utilities and helpers created
- [x] Utility function tests written (80% coverage achieved)
- [x] Zustand store tests written (70% coverage achieved)
- [x] API route integration tests written (60% coverage achieved)
- [x] React component tests written (50% coverage achieved)
- [x] Playwright E2E tests set up (auth, enrollment, a11y)
- [x] Coverage reporting configured (Codecov integration)
- [x] CI/CD workflows created (GitHub Actions)
- [x] Documentation updated (TESTING.md)
- [x] Overall 60% coverage target achieved ✅
```

---

## 📊 Success Criteria

### ✅ Phase 6 Complete When:

1. **Coverage Targets Met**:
   - ✅ Overall: 60%+
   - ✅ Utilities: 80%+
   - ✅ State Stores: 70%+
   - ✅ API Routes: 60%+
   - ✅ Components: 50%+

2. **Infrastructure Complete**:
   - ✅ Jest configured and working
   - ✅ Playwright configured and working
   - ✅ All test utilities created
   - ✅ CI/CD pipelines passing

3. **Documentation Complete**:
   - ✅ TESTING.md created
   - ✅ Refactor plan updated
   - ✅ All test files have clear descriptions

4. **Quality Gates**:
   - ✅ All tests passing in CI
   - ✅ No flaky tests
   - ✅ Coverage reports uploaded to Codecov
   - ✅ E2E tests cover critical flows

---

## 🚀 Implementation Timeline

| Task | Duration | Priority | Dependencies |
|------|----------|----------|--------------|
| 6.1 Jest Configuration | 2h | P0 | None |
| 6.2 Install Dependencies | 1h | P0 | 6.1 |
| 6.3 Create Test Utilities | 3h | P0 | 6.2 |
| 6.4 Write Utility Tests | 8h | P0 | 6.3 |
| 6.5 Write Store Tests | 6h | P0 | 6.3 |
| 6.6 Write API Tests | 8h | P1 | 6.3 |
| 6.7 Write Component Tests | 6h | P2 | 6.3 |
| 6.8 E2E Tests Setup | 8h | P0 | 6.3 |
| 6.9 Coverage Reporting | 2h | P1 | 6.4-6.8 |
| 6.10 Documentation | 2h | P1 | 6.9 |

**Total Estimated Time:** 46 hours (~6 days)

---

## 🔄 Next Steps After Phase 6

Once Phase 6 is complete:
1. ✅ Verify all coverage targets met
2. ✅ Run full test suite in CI
3. ✅ Review test quality and flakiness
4. ✅ Proceed to **Phase 7: Deployment** (progressive rollout to production)

---

**Last Updated:** 2025-10-11
**Version:** 1.0.0
**Status:** 📋 Ready for Implementation
