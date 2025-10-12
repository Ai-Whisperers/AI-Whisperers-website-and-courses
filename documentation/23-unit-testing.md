# 23. Unit Testing Guide

> **Document Status:** ✅ Complete
> **Last Updated:** October 12, 2025
> **Codebase Phase:** Phase 6 - Testing Infrastructure
> **Related Docs:** [22-testing-infrastructure.md](./22-testing-infrastructure.md), [24-component-testing.md](./24-component-testing.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Unit Testing Strategy](#2-unit-testing-strategy)
3. [File Structure and Naming](#3-file-structure-and-naming)
4. [Test Anatomy](#4-test-anatomy)
5. [Testing Utilities](#5-testing-utilities)
6. [Testing Zustand Stores](#6-testing-zustand-stores)
7. [Testing API Routes](#7-testing-api-routes)
8. [Mocking Strategies](#8-mocking-strategies)
9. [Test Patterns](#9-test-patterns)
10. [Coverage Targets](#10-coverage-targets)
11. [Best Practices](#11-best-practices)
12. [Common Pitfalls](#12-common-pitfalls)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Overview

### What is Unit Testing?

**Unit testing** is the practice of testing individual units of code (functions, classes, modules) in isolation to ensure they behave as expected. In our codebase, unit tests cover:

- **Utility functions** - Pure functions, helpers, data transformations
- **Zustand stores** - State management logic and computed values
- **API routes** - Next.js API route handlers
- **Business logic** - Domain logic and calculations

### Goals

- ✅ **Fast feedback** - Tests run in milliseconds
- ✅ **Isolation** - Each test is independent
- ✅ **Coverage** - High code coverage (60-80%)
- ✅ **Confidence** - Catch bugs before production
- ✅ **Documentation** - Tests serve as executable documentation

### Test Framework

We use **Jest 29.x** as our primary testing framework with:

```javascript
// Package versions
{
  "jest": "^29.7.0",
  "ts-jest": "^29.2.5",
  "@testing-library/react": "^16.1.0",
  "@testing-library/jest-dom": "^6.6.3",
  "jest-mock-extended": "^4.0.0"
}
```

---

## 2. Unit Testing Strategy

### 2.1 What to Test

#### ✅ High-Value Test Targets

1. **Utility Functions** (80% coverage target)
   - Pure functions
   - Data transformations
   - Validation logic
   - Complex calculations

2. **State Management** (70% coverage target)
   - Zustand stores
   - Store actions
   - Computed values/selectors
   - State transitions

3. **API Routes** (60% coverage target)
   - Request handling
   - Response formatting
   - Error scenarios
   - Rate limiting
   - Query validation

4. **Business Logic** (70% coverage target)
   - Domain models
   - Business rules
   - Calculations
   - Data processing

#### ❌ What NOT to Test

- **External libraries** - Trust their tests
- **Type definitions** - TypeScript handles this
- **Simple getters/setters** - No logic to test
- **Configuration files** - Static data
- **Mock data** - No behavior to verify

### 2.2 Coverage Targets

Our codebase uses **tiered coverage thresholds** based on complexity:

```javascript
// apps/web/jest.config.js
coverageThreshold: {
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
}
```

**Rationale:**
- **Utils (80%)** - Pure functions, easy to test, high value
- **Lib (70%)** - Business logic, medium complexity
- **API routes (60%)** - Integration-heavy, harder to test
- **Components (50%)** - UI testing covered separately

---

## 3. File Structure and Naming

### 3.1 Test File Location

Tests live in `__tests__` directories next to the code they test:

```
src/
├── utils/
│   ├── storage.ts                    # Source file
│   └── __tests__/
│       └── storage.test.ts           # Test file
├── lib/
│   ├── auth/
│   │   ├── auth.config.ts
│   │   └── __tests__/
│   │       └── auth.config.test.ts
│   └── rate-limit.ts
└── app/
    └── api/
        └── courses/
            ├── route.ts
            └── __tests__/
                └── route.test.ts
```

### 3.2 Naming Conventions

#### Test Files

```
[source-filename].test.ts          # TypeScript
[source-filename].test.tsx         # React components
```

**Examples:**
```
storage.ts          → storage.test.ts
rate-limit.ts       → rate-limit.test.ts
route.ts            → route.test.ts
store.ts            → store.test.ts
```

#### Test Descriptions

```typescript
// Pattern: describe(component/function) → describe(feature) → it(scenario)

describe('storage.ts', () => {
  describe('getStorageItem', () => {
    it('should return default value when item does not exist', () => {
      // Test implementation
    })
  })
})
```

---

## 4. Test Anatomy

### 4.1 Basic Test Structure

Every test follows the **AAA pattern**: **Arrange**, **Act**, **Assert**.

```typescript
// apps/web/src/utils/__tests__/storage.test.ts

describe('getStorageItem', () => {
  it('should retrieve and parse stored item', () => {
    // ========================================
    // ARRANGE - Set up test data
    // ========================================
    const testData = { userId: '123', token: 'abc' }
    localStorage.setItem('aiw_security_test', JSON.stringify(testData))

    // ========================================
    // ACT - Execute the function
    // ========================================
    const result = getStorageItem('SECURITY', 'test', {})

    // ========================================
    // ASSERT - Verify the outcome
    // ========================================
    expect(result).toEqual(testData)
  })
})
```

### 4.2 Test Setup and Teardown

Use Jest lifecycle hooks for setup and cleanup:

```typescript
describe('storage.ts', () => {
  // ========================================
  // BEFORE EACH TEST
  // ========================================
  beforeEach(() => {
    // Reset state before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  // ========================================
  // AFTER EACH TEST
  // ========================================
  afterEach(() => {
    // Clean up resources
  })

  // ========================================
  // BEFORE ALL TESTS
  // ========================================
  beforeAll(() => {
    // One-time setup
  })

  // ========================================
  // AFTER ALL TESTS
  // ========================================
  afterAll(() => {
    // One-time cleanup
  })

  // Tests go here...
})
```

### 4.3 Test Organization

Group related tests with nested `describe` blocks:

```typescript
describe('storage.ts', () => {
  describe('getStorageItem', () => {
    it('should return default value when item does not exist', () => {})
    it('should retrieve and parse stored item', () => {})
    it('should return default value on parse error', () => {})
    it('should handle different namespaces correctly', () => {})
  })

  describe('setStorageItem', () => {
    it('should store item with correct namespace key', () => {})
    it('should store primitive values correctly', () => {})
    it('should return false on storage error', () => {})
  })

  describe('removeStorageItem', () => {
    it('should remove item from storage', () => {})
  })
})
```

---

## 5. Testing Utilities

Utility functions are the easiest to test because they're **pure functions** - same input always produces same output.

### 5.1 Example: Storage Utility Tests

**Source file:** `apps/web/src/utils/storage.ts` (unified localStorage management)

**Test file:** `apps/web/src/utils/__tests__/storage.test.ts` (463 lines)

#### Test Coverage

```typescript
/**
 * Storage Utility Tests
 * Testing unified localStorage management with SSR safety
 * Target: 80% coverage
 */

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
  onStorageChange,
} from '../storage'

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  // ========================================
  // ENVIRONMENT DETECTION
  // ========================================
  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true)
    })

    it('should return true when window and localStorage exist', () => {
      expect(typeof window).toBe('object')
      expect(typeof localStorage).toBe('object')
      expect(isBrowser()).toBe(true)
    })
  })

  // ========================================
  // CONSTANTS
  // ========================================
  describe('STORAGE_KEYS', () => {
    it('should have correct namespace prefixes', () => {
      expect(STORAGE_KEYS.SECURITY).toBe('aiw_security')
      expect(STORAGE_KEYS.PRESENTATION).toBe('aiw_presentation')
      expect(STORAGE_KEYS.LOGIC).toBe('aiw_logic')
      expect(STORAGE_KEYS.I18N).toBe('aiw_i18n')
    })
  })

  // ========================================
  // READ OPERATIONS
  // ========================================
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

    it('should handle different namespaces correctly', () => {
      const securityData = { token: 'security-token' }
      const presentationData = { theme: 'dark' }

      localStorage.setItem('aiw_security_auth', JSON.stringify(securityData))
      localStorage.setItem('aiw_presentation_theme', JSON.stringify(presentationData))

      expect(getStorageItem('SECURITY', 'auth', {})).toEqual(securityData)
      expect(getStorageItem('PRESENTATION', 'theme', {})).toEqual(presentationData)
    })

    it('should decompress compressed data', () => {
      const testData = { large: 'data'.repeat(100) }
      setStorageItem('SECURITY', 'test', testData, true)

      const result = getStorageItem('SECURITY', 'test', {}, true)
      expect(result).toEqual(testData)
    })
  })

  // ========================================
  // WRITE OPERATIONS
  // ========================================
  describe('setStorageItem', () => {
    it('should store item with correct namespace key', () => {
      const testData = { test: 'data' }
      const result = setStorageItem('PRESENTATION', 'theme', testData)

      expect(result).toBe(true)
      const stored = localStorage.getItem('aiw_presentation_theme')
      expect(stored).toBe(JSON.stringify(testData))
    })

    it('should store primitive values correctly', () => {
      setStorageItem('LOGIC', 'count', 42)
      expect(getStorageItem('LOGIC', 'count', 0)).toBe(42)

      setStorageItem('LOGIC', 'active', true)
      expect(getStorageItem('LOGIC', 'active', false)).toBe(true)

      setStorageItem('LOGIC', 'name', 'test')
      expect(getStorageItem('LOGIC', 'name', '')).toBe('test')
    })

    it('should store complex nested objects', () => {
      const complex = {
        user: {
          id: '123',
          profile: {
            name: 'Test',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
      }

      setStorageItem('SECURITY', 'user', complex)
      expect(getStorageItem('SECURITY', 'user', {})).toEqual(complex)
    })

    it('should compress data when requested', () => {
      const testData = { large: 'data'.repeat(1000) }
      setStorageItem('SECURITY', 'test', testData, true)

      const stored = localStorage.getItem('aiw_security_test')
      // Compressed data should be shorter than JSON
      expect(stored!.length).toBeLessThan(JSON.stringify(testData).length)
    })

    it('should return false on storage error', () => {
      // Mock localStorage.setItem to throw (e.g., quota exceeded)
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError')
      })

      const result = setStorageItem('SECURITY', 'test', { data: true })
      expect(result).toBe(false)

      // Restore original
      Storage.prototype.setItem = originalSetItem
    })
  })

  // ========================================
  // DELETE OPERATIONS
  // ========================================
  describe('removeStorageItem', () => {
    it('should remove item from storage', () => {
      localStorage.setItem('aiw_logic_test', 'data')

      const result = removeStorageItem('LOGIC', 'test')

      expect(result).toBe(true)
      expect(localStorage.getItem('aiw_logic_test')).toBeNull()
    })

    it('should not affect other keys', () => {
      localStorage.setItem('aiw_security_key1', 'value1')
      localStorage.setItem('aiw_security_key2', 'value2')

      removeStorageItem('SECURITY', 'key1')

      expect(localStorage.getItem('aiw_security_key1')).toBeNull()
      expect(localStorage.getItem('aiw_security_key2')).toBe('value2')
    })
  })

  // ========================================
  // CLEAR NAMESPACE
  // ========================================
  describe('clearNamespace', () => {
    it('should clear all items in namespace', () => {
      localStorage.setItem('aiw_security_token', 'abc')
      localStorage.setItem('aiw_security_user', 'xyz')
      localStorage.setItem('aiw_presentation_theme', 'dark')

      const result = clearNamespace('SECURITY')

      expect(result).toBe(true)
      expect(localStorage.getItem('aiw_security_token')).toBeNull()
      expect(localStorage.getItem('aiw_security_user')).toBeNull()
      // Other namespaces should not be affected
      expect(localStorage.getItem('aiw_presentation_theme')).toBe('dark')
    })

    it('should clear multiple keys in same namespace', () => {
      for (let i = 0; i < 5; i++) {
        localStorage.setItem(`aiw_logic_item${i}`, `value${i}`)
      }

      clearNamespace('LOGIC')

      for (let i = 0; i < 5; i++) {
        expect(localStorage.getItem(`aiw_logic_item${i}`)).toBeNull()
      }
    })
  })

  // ========================================
  // ENCRYPTION
  // ========================================
  describe('encryptData / decryptData', () => {
    it('should encrypt data to base64', () => {
      const original = 'sensitive-data'
      const encrypted = encryptData(original)

      expect(encrypted).not.toBe(original)
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/) // Base64 pattern
    })

    it('should decrypt data from base64', () => {
      const original = 'sensitive-data'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })

    it('should handle special characters', () => {
      const original = 'Test123!@#$%^&*()_+-=[]{}|;:,.<>?'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })

    it('should return input on decryption error', () => {
      const invalidEncrypted = 'not-valid-base64!!!'
      const result = decryptData(invalidEncrypted)

      expect(result).toBe(invalidEncrypted)
    })
  })

  // ========================================
  // ENCRYPTED STORAGE
  // ========================================
  describe('getEncryptedItem / setEncryptedItem', () => {
    it('should store and retrieve encrypted data', () => {
      const sensitiveData = { password: 'secret123', apiKey: 'key456' }

      const setResult = setEncryptedItem('SECURITY', 'credentials', sensitiveData)
      expect(setResult).toBe(true)

      const retrieved = getEncryptedItem('SECURITY', 'credentials', {})
      expect(retrieved).toEqual(sensitiveData)
    })

    it('should actually encrypt data in storage', () => {
      const sensitiveData = { password: 'secret123' }

      setEncryptedItem('SECURITY', 'credentials', sensitiveData)

      // Check raw storage - should NOT contain plaintext
      const raw = localStorage.getItem('aiw_security_credentials')
      expect(raw).not.toContain('secret123')
      expect(raw).not.toContain('password')
    })

    it('should return default value if encrypted item does not exist', () => {
      const result = getEncryptedItem('SECURITY', 'nonexistent', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should handle complex objects', () => {
      const complex = {
        user: {
          id: '123',
          secrets: {
            password: 'pass123',
            token: 'token456',
          },
        },
      }

      setEncryptedItem('SECURITY', 'user', complex)
      expect(getEncryptedItem('SECURITY', 'user', {})).toEqual(complex)
    })
  })

  // ========================================
  // CROSS-TAB SYNCHRONIZATION
  // ========================================
  describe('onStorageChange', () => {
    it('should create unsubscribe function', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      expect(typeof unsubscribe).toBe('function')

      unsubscribe()
    })

    it('should listen to storage events for correct namespace', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: 'aiw_security_token',
        newValue: JSON.stringify({ token: 'new-value' }),
        oldValue: JSON.stringify({ token: 'old-value' }),
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(callback).toHaveBeenCalledWith('token', { token: 'new-value' })

      unsubscribe()
    })

    it('should ignore events from other namespaces', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      // Event from different namespace
      const event = new StorageEvent('storage', {
        key: 'aiw_presentation_theme',
        newValue: JSON.stringify('dark'),
        oldValue: JSON.stringify('light'),
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      unsubscribe()
    })

    it('should unsubscribe correctly', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      unsubscribe()

      // Dispatch event after unsubscribe
      const event = new StorageEvent('storage', {
        key: 'aiw_security_token',
        newValue: JSON.stringify('value'),
      })

      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // EDGE CASES
  // ========================================
  describe('edge cases and error handling', () => {
    it('should handle null values', () => {
      setStorageItem('LOGIC', 'nullable', null)
      expect(getStorageItem('LOGIC', 'nullable', 'default')).toBe(null)
    })

    it('should handle undefined default values', () => {
      const result = getStorageItem('LOGIC', 'nonexistent', undefined)
      expect(result).toBe(undefined)
    })

    it('should handle arrays', () => {
      const array = [1, 2, 3, 'four', { five: 5 }]
      setStorageItem('LOGIC', 'array', array)
      expect(getStorageItem('LOGIC', 'array', [])).toEqual(array)
    })

    it('should handle Date objects', () => {
      const date = new Date('2025-01-01')
      setStorageItem('LOGIC', 'date', date)

      const retrieved = getStorageItem('LOGIC', 'date', null)
      expect(new Date(retrieved as any).getTime()).toBe(date.getTime())
    })

    it('should handle very large objects', () => {
      const large = {
        data: 'x'.repeat(10000),
        nested: {
          more: 'y'.repeat(10000),
        },
      }

      setStorageItem('LOGIC', 'large', large, true) // Use compression
      const retrieved = getStorageItem('LOGIC', 'large', {}, true)

      expect(retrieved).toEqual(large)
    })
  })
})
```

**Key Testing Patterns:**

1. **Default values** - Test fallback behavior
2. **Error handling** - Test with invalid data
3. **Edge cases** - Test null, undefined, empty strings
4. **Data types** - Test primitives, objects, arrays, dates
5. **Namespaces** - Test isolation between namespaces
6. **Encryption** - Verify data is actually encrypted
7. **Events** - Test cross-tab synchronization

---

## 6. Testing Zustand Stores

Zustand stores contain state management logic. We test actions, computed values, and selectors.

### 6.1 Store Test Utilities

**File:** `packages/state-core/__tests__/utils/store-utils.ts` (99 lines)

```typescript
/**
 * Zustand Store Test Utilities
 * Helpers for testing Zustand stores
 */

import { act } from '@testing-library/react'
import type { StoreApi, UseBoundStore } from 'zustand'

/**
 * Reset Zustand store to initial state
 * Calls the store's reset() method if available
 */
export function resetStore<T extends { reset?: () => void }>(
  useStore: UseBoundStore<StoreApi<T>>
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
 * Useful for assertions without subscribing
 */
export function getStoreState<T>(useStore: UseBoundStore<StoreApi<T>>): T {
  return useStore.getState()
}

/**
 * Update store state directly (for testing only)
 * WARNING: Only use in tests to set up specific scenarios
 */
export function setStoreState<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  partialState: Partial<T>
) {
  act(() => {
    useStore.setState(partialState as any)
  })
}

/**
 * Wait for store state to match condition
 * Useful for async operations in stores
 */
export async function waitForStoreState<T>(
  useStore: UseBoundStore<StoreApi<T>>,
  predicate: (state: T) => boolean,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe()
      reject(new Error(`Timeout waiting for store state after ${timeout}ms`))
    }, timeout)

    const unsubscribe = useStore.subscribe((state) => {
      if (predicate(state)) {
        clearTimeout(timeoutId)
        unsubscribe()
        resolve(state)
      }
    })

    // Check initial state
    const initialState = useStore.getState()
    if (predicate(initialState)) {
      clearTimeout(timeoutId)
      unsubscribe()
      resolve(initialState)
    }
  })
}
```

### 6.2 Example: Courses Store Tests

**Source file:** `packages/state-core/courses/src/store.ts`

**Test file:** `packages/state-core/courses/__tests__/store.test.ts` (630 lines)

```typescript
/**
 * Courses Store Tests
 * Testing Zustand store for course management
 * Target: 70% coverage
 */

import { renderHook, act } from '@testing-library/react'
import {
  useCoursesStore,
  useSelectedCourse,
  useEnrolledCourses,
  useCoursesLoading,
  useCoursesError,
  useFeaturedCourses,
  usePublishedCourses,
  useIsEnrolled,
} from '../src/store'
import { resetStore } from '../../__tests__/utils/store-utils'

// ========================================
// MOCK DATA
// ========================================
const mockCourse1 = {
  id: '1',
  title: 'Introduction to AI',
  slug: 'intro-ai',
  description: 'Learn AI basics',
  difficulty: 'BEGINNER' as const,
  duration: 600,
  price: 99.99,
  instructor: 'John Doe',
  imageUrl: '/courses/intro-ai.jpg',
  published: true,
  featured: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

const mockEnrollment1 = {
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: '1',
  status: 'ACTIVE' as const,
  progress: 25,
  enrolledAt: new Date('2025-01-10'),
  completedAt: null,
}

describe('useCoursesStore', () => {
  beforeEach(() => {
    resetStore(useCoursesStore)
  })

  // ========================================
  // INITIAL STATE
  // ========================================
  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCoursesStore())

      expect(result.current.courses).toEqual([])
      expect(result.current.enrollments).toEqual([])
      expect(result.current.selectedCourseId).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  // ========================================
  // ACTIONS - SET COURSES
  // ========================================
  describe('setCourses', () => {
    it('should set courses', () => {
      const { result } = renderHook(() => useCoursesStore())
      const courses = [mockCourse1]

      act(() => {
        result.current.setCourses(courses)
      })

      expect(result.current.courses).toEqual(courses)
    })

    it('should replace existing courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.setCourses([]) // Clear
      })

      expect(result.current.courses).toEqual([])
      expect(result.current.courses).toHaveLength(0)
    })
  })

  // ========================================
  // ACTIONS - ENROLLMENTS
  // ========================================
  describe('addEnrollment', () => {
    it('should add enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
      })

      expect(result.current.enrollments).toContainEqual(mockEnrollment1)
      expect(result.current.enrollments).toHaveLength(1)
    })

    it('should add multiple enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())
      const enrollment2 = { ...mockEnrollment1, id: 'enrollment-2', courseId: '2' }

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.addEnrollment(enrollment2)
      })

      expect(result.current.enrollments).toHaveLength(2)
    })
  })

  describe('updateEnrollment', () => {
    it('should update enrollment progress', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('enrollment-1', { progress: 50 })
      })

      const updated = result.current.enrollments.find(
        (e) => e.id === 'enrollment-1'
      )
      expect(updated?.progress).toBe(50)
    })

    it('should update enrollment status', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('enrollment-1', {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
        })
      })

      const updated = result.current.enrollments.find(
        (e) => e.id === 'enrollment-1'
      )
      expect(updated?.status).toBe('COMPLETED')
      expect(updated?.progress).toBe(100)
      expect(updated?.completedAt).toBeInstanceOf(Date)
    })

    it('should not update non-existent enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.updateEnrollment('nonexistent', { progress: 50 })
      })

      expect(result.current.enrollments).toHaveLength(1)
      expect(result.current.enrollments[0].progress).toBe(25) // Unchanged
    })
  })

  describe('removeEnrollment', () => {
    it('should remove enrollment', () => {
      const { result } = renderHook(() => useCoursesStore())
      const enrollment2 = { ...mockEnrollment1, id: 'enrollment-2' }

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.addEnrollment(enrollment2)
        result.current.removeEnrollment('enrollment-1')
      })

      expect(result.current.enrollments).toHaveLength(1)
      expect(result.current.enrollments).not.toContainEqual(mockEnrollment1)
    })

    it('should do nothing if enrollment does not exist', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.addEnrollment(mockEnrollment1)
        result.current.removeEnrollment('nonexistent')
      })

      expect(result.current.enrollments).toHaveLength(1)
    })
  })

  // ========================================
  // ACTIONS - SELECTION
  // ========================================
  describe('selectCourse', () => {
    it('should select a course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.selectCourse('course-1')
      })

      expect(result.current.selectedCourseId).toBe('course-1')
    })

    it('should allow deselecting a course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.selectCourse('course-1')
        result.current.selectCourse(null)
      })

      expect(result.current.selectedCourseId).toBeNull()
    })
  })

  // ========================================
  // ACTIONS - LOADING/ERROR
  // ========================================
  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setError('Failed to load courses')
      })

      expect(result.current.error).toBe('Failed to load courses')
    })

    it('should clear error', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setError('Error')
        result.current.setError(null)
      })

      expect(result.current.error).toBeNull()
    })
  })

  // ========================================
  // COMPUTED VALUES
  // ========================================
  describe('selectedCourse computed', () => {
    it('should return selected course', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.selectCourse('1')
      })

      const selected = result.current.selectedCourse()
      expect(selected).toEqual(mockCourse1)
    })

    it('should return null if no course selected', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
      })

      expect(result.current.selectedCourse()).toBeNull()
    })

    it('should return null if selected course does not exist', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.selectCourse('nonexistent')
      })

      expect(result.current.selectedCourse()).toBeNull()
    })
  })

  describe('enrolledCourses computed', () => {
    it('should return courses user is enrolled in (ACTIVE)', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.setEnrollments([mockEnrollment1])
      })

      const enrolled = result.current.enrolledCourses()
      expect(enrolled).toHaveLength(1)
      expect(enrolled[0].id).toBe('1')
    })

    it('should return empty array if no enrollments', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
      })

      expect(result.current.enrolledCourses()).toEqual([])
    })
  })

  describe('isEnrolled computed', () => {
    it('should return true if user is enrolled (ACTIVE)', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1])
      })

      expect(result.current.isEnrolled('1')).toBe(true)
    })

    it('should return false if user is not enrolled', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setEnrollments([mockEnrollment1])
      })

      expect(result.current.isEnrolled('nonexistent')).toBe(false)
    })
  })

  describe('featuredCourses computed', () => {
    it('should return published and featured courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
      })

      const featured = result.current.featuredCourses()
      expect(featured).toHaveLength(1)
      expect(featured[0].id).toBe('1')
    })

    it('should return empty array if no featured courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([{ ...mockCourse1, featured: false }])
      })

      expect(result.current.featuredCourses()).toEqual([])
    })
  })

  describe('publishedCourses computed', () => {
    it('should return only published courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
      })

      const published = result.current.publishedCourses()
      expect(published).toHaveLength(1)
    })

    it('should return empty array if no published courses', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([{ ...mockCourse1, published: false }])
      })

      expect(result.current.publishedCourses()).toEqual([])
    })
  })

  // ========================================
  // RESET
  // ========================================
  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useCoursesStore())

      act(() => {
        result.current.setCourses([mockCourse1])
        result.current.setEnrollments([mockEnrollment1])
        result.current.selectCourse('1')
        result.current.setLoading(true)
        result.current.setError('Test error')
        result.current.reset()
      })

      expect(result.current.courses).toEqual([])
      expect(result.current.enrollments).toEqual([])
      expect(result.current.selectedCourseId).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  // ========================================
  // SELECTOR HOOKS
  // ========================================
  describe('selector hooks', () => {
    it('useSelectedCourse should return selected course', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1])
        useCoursesStore.getState().selectCourse('1')
      })

      const { result } = renderHook(() => useSelectedCourse())
      expect(result.current).toEqual(mockCourse1)
    })

    it('useEnrolledCourses should return enrolled courses', () => {
      act(() => {
        useCoursesStore.getState().setCourses([mockCourse1])
        useCoursesStore.getState().setEnrollments([mockEnrollment1])
      })

      const { result } = renderHook(() => useEnrolledCourses())
      expect(result.current).toHaveLength(1)
      expect(result.current[0].id).toBe('1')
    })

    it('useCoursesLoading should return loading state', () => {
      act(() => {
        useCoursesStore.getState().setLoading(true)
      })

      const { result } = renderHook(() => useCoursesLoading())
      expect(result.current).toBe(true)
    })

    it('useCoursesError should return error state', () => {
      act(() => {
        useCoursesStore.getState().setError('Test error')
      })

      const { result } = renderHook(() => useCoursesError())
      expect(result.current).toBe('Test error')
    })
  })
})
```

**Key Store Testing Patterns:**

1. **Initial state** - Verify defaults
2. **Actions** - Test state mutations
3. **Computed values** - Test derived state
4. **Selector hooks** - Test individual selectors
5. **Reset** - Test cleanup functionality
6. **Edge cases** - Test with empty arrays, null values
7. **Use `act()`** - Wrap state changes for React

---

## 7. Testing API Routes

API route tests verify request handling, validation, rate limiting, and error scenarios.

### 7.1 Example: Courses API Route Tests

**Source file:** `apps/web/src/app/api/courses/route.ts` (89 lines)

**Test file:** `apps/web/src/app/api/courses/__tests__/route.test.ts` (290 lines)

```typescript
/**
 * Courses API Route Tests
 * Tests the courses endpoint with rate limiting and query validation
 * Target: 60% coverage for API routes
 */

import { GET } from '../route'
import { NextRequest } from 'next/server'

// ========================================
// MOCK DEPENDENCIES
// ========================================

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    apiError: jest.fn(),
  },
}))

// Mock rate limiter
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn((identifier, preset) => ({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 60000,
  })),
  getIdentifier: jest.fn(() => 'test-identifier'),
  RateLimitPresets: {
    GENEROUS: 'generous',
  },
}))

// Mock courses data
jest.mock('@/lib/data/mock-courses', () => ({
  getMockCoursesAsPlainObjects: jest.fn((options = {}) => {
    const mockCourses = [
      {
        id: 'course-1',
        title: 'Introduction to AI',
        slug: 'intro-to-ai',
        description: 'Learn AI basics',
        published: true,
        featured: true,
        difficulty: 'beginner',
        topics: ['ai', 'ml'],
        duration: '10 hours',
        enrollmentCount: 100,
      },
      {
        id: 'course-2',
        title: 'Advanced Machine Learning',
        slug: 'advanced-ml',
        description: 'Deep dive into ML',
        published: true,
        featured: false,
        difficulty: 'advanced',
        topics: ['ml', 'deep-learning'],
        duration: '20 hours',
        enrollmentCount: 50,
      },
      {
        id: 'course-3',
        title: 'Data Science Fundamentals',
        slug: 'data-science',
        description: 'Learn data science',
        published: false,
        featured: false,
        difficulty: 'intermediate',
        topics: ['data-science', 'python'],
        duration: '15 hours',
        enrollmentCount: 25,
      },
    ]

    let filtered = mockCourses

    // Apply filters
    if (options.published !== undefined) {
      filtered = filtered.filter((c) => c.published === options.published)
    }
    if (options.featured !== undefined) {
      filtered = filtered.filter((c) => c.featured === options.featured)
    }
    if (options.difficulty) {
      const difficultyLower = options.difficulty.toLowerCase()
      filtered = filtered.filter((c) => c.difficulty === difficultyLower)
    }

    // Apply pagination
    const { limit = 100, offset = 0 } = options
    return filtered.slice(offset, offset + limit)
  }),
}))

describe('/api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ========================================
  // SUCCESS SCENARIOS
  // ========================================
  describe('GET', () => {
    it('should return all courses without filters', async () => {
      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(3)
      expect(data.count).toBe(3)
      expect(data.total).toBe(3)
      expect(data.limit).toBe(100)
      expect(data.offset).toBe(0)
    })

    it('should filter by published status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?published=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(2)
      expect(data.courses.every((c: any) => c.published === true)).toBe(true)
    })

    it('should filter by featured status', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?featured=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].featured).toBe(true)
    })

    it('should filter by difficulty', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?difficulty=BEGINNER'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].difficulty).toBe('beginner')
    })

    it('should apply pagination with limit and offset', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?limit=2&offset=1'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.limit).toBe(2)
      expect(data.offset).toBe(1)
      expect(data.count).toBe(2)
    })

    it('should combine multiple filters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?published=true&featured=true'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].published).toBe(true)
      expect(data.courses[0].featured).toBe(true)
    })

    it('should include rate limit headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('99')
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })
  })

  // ========================================
  // ERROR SCENARIOS
  // ========================================
  describe('error handling', () => {
    it('should return 429 when rate limit exceeded', async () => {
      const { rateLimit } = require('@/lib/rate-limit')
      rateLimit.mockReturnValueOnce({
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Too many requests')
      expect(data.message).toContain('Rate limit exceeded')
    })

    it('should return 400 for invalid query parameters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?difficulty=invalid'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
      expect(data.details).toBeDefined()
    })

    it('should return 400 for invalid limit parameter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?limit=abc'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
    })

    it('should return 400 for invalid offset parameter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/courses?offset=-1'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid query parameters')
    })

    it('should return 500 on internal error', async () => {
      const { getMockCoursesAsPlainObjects } = require('@/lib/data/mock-courses')
      getMockCoursesAsPlainObjects.mockImplementationOnce(() => {
        throw new Error('Database connection failed')
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch courses')
      expect(data.message).toBe('Database connection failed')
    })

    it('should handle unknown errors', async () => {
      const { getMockCoursesAsPlainObjects } = require('@/lib/data/mock-courses')
      getMockCoursesAsPlainObjects.mockImplementationOnce(() => {
        throw 'Unknown error' // Non-Error object
      })

      const request = new NextRequest('http://localhost:3000/api/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch courses')
      expect(data.message).toBe('Unknown error')
    })
  })
})
```

**Key API Route Testing Patterns:**

1. **Success scenarios** - Test valid requests
2. **Query parameters** - Test filtering and pagination
3. **Rate limiting** - Test limit enforcement
4. **Validation** - Test invalid inputs
5. **Error handling** - Test error responses
6. **Headers** - Test rate limit headers
7. **Mock dependencies** - Mock external services

---

## 8. Mocking Strategies

### 8.1 Jest Setup File

Our Jest setup file provides comprehensive mocking for Next.js and browser APIs.

**File:** `apps/web/jest.setup.js` (347 lines)

#### Next.js Mocks

```javascript
// Mock NextResponse for API route tests
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextResponse: class NextResponse extends global.Response {
      constructor(body, init) {
        super(body, init)
      }

      static json(data, init = {}) {
        const response = new NextResponse(JSON.stringify(data), {
          ...init,
          headers: {
            'content-type': 'application/json',
            ...(init.headers || {}),
          },
        })
        return response
      }

      static redirect(url, status = 307) {
        return new NextResponse(null, {
          status,
          headers: {
            Location: url,
          },
        })
      }
    },
    NextRequest: class NextRequest extends global.Request {
      constructor(input, init) {
        super(input, init)
        const url = new URL(typeof input === 'string' ? input : input.url)
        this.nextUrl = {
          href: url.href,
          origin: url.origin,
          protocol: url.protocol,
          pathname: url.pathname,
          search: url.search,
          searchParams: url.searchParams,
          hash: url.hash,
        }
        this.url = url.href
        this.cookies = new Map()
        this.geo = {}
        this.ip = '127.0.0.1'
      }
    },
  }
})

// Mock Next.js Navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})
```

#### Browser API Mocks

```javascript
// Mock localStorage
const localStorageMock = (() => {
  let store = {}

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    key: jest.fn((index) => {
      const keys = Object.keys(store)
      return keys[index] || null
    }),
    get length() {
      return Object.keys(store).length
    },
  }
})()

global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage = jest.fn()
  close = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

#### Environment Variables

```javascript
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret-minimum-32-characters-long-for-testing'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NODE_ENV = 'test'
```

### 8.2 Database Mocks

**File:** `packages/database/__tests__/utils/db-utils.ts` (130 lines)

```typescript
/**
 * Database Test Utilities
 * Mock Prisma client and utilities for database testing
 */

import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Create deep mock of Prisma Client
export type MockPrisma = DeepMockProxy<PrismaClient>

// Global Prisma mock (singleton)
export const prismaMock = mockDeep<PrismaClient>()

/**
 * Reset database mock before each test
 */
export function resetDatabase() {
  mockReset(prismaMock)
}

// ========================================
// Mock Data Factories
// ========================================

/**
 * Create mock user data
 */
export const createMockUser = (overrides?: Partial<any>) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  emailVerified: null,
  image: null,
  role: 'STUDENT',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock admin user data
 */
export const createMockAdmin = (overrides?: Partial<any>) => ({
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  emailVerified: null,
  image: null,
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock course data
 */
export const createMockCourse = (overrides?: Partial<any>) => ({
  id: 'test-course-id',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test course description',
  content: 'Test course content',
  price: 99.99,
  published: true,
  featured: false,
  imageUrl: '/courses/test-course.jpg',
  instructorId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock enrollment data
 */
export const createMockEnrollment = (overrides?: Partial<any>) => ({
  id: 'test-enrollment-id',
  userId: 'test-user-id',
  courseId: 'test-course-id',
  progress: 0,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})
```

**Usage in tests:**

```typescript
import { prismaMock, createMockUser, resetDatabase } from '@/test-utils/db-utils'

describe('User API', () => {
  beforeEach(() => {
    resetDatabase()
  })

  it('should create a user', async () => {
    const mockUser = createMockUser()
    prismaMock.user.create.mockResolvedValue(mockUser)

    const result = await createUser({ email: 'test@example.com' })

    expect(result).toEqual(mockUser)
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    })
  })
})
```

### 8.3 Inline Mocks

For one-off mocks, use inline mocking:

```typescript
// Mock a module
jest.mock('@/lib/logger', () => ({
  logger: {
    apiError: jest.fn(),
  },
}))

// Mock a function
const mockFunction = jest.fn()
mockFunction.mockReturnValue('mocked value')
mockFunction.mockResolvedValue('async mocked value')

// Spy on existing function
const spy = jest.spyOn(console, 'log')
spy.mockImplementation(() => {})

// Clean up
spy.mockRestore()
```

---

## 9. Test Patterns

### 9.1 AAA Pattern

**Arrange, Act, Assert** - The foundation of every test:

```typescript
it('should calculate total price', () => {
  // ARRANGE - Set up test data
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ]

  // ACT - Execute the function
  const total = calculateTotal(items)

  // ASSERT - Verify the outcome
  expect(total).toBe(35)
})
```

### 9.2 Test Data Builders

Create reusable test data factories:

```typescript
// Test data builder
function createMockCourse(overrides = {}) {
  return {
    id: 'test-course-id',
    title: 'Test Course',
    slug: 'test-course',
    published: true,
    featured: false,
    ...overrides,
  }
}

// Usage
it('should filter featured courses', () => {
  const courses = [
    createMockCourse({ id: '1', featured: true }),
    createMockCourse({ id: '2', featured: false }),
  ]

  const featured = courses.filter((c) => c.featured)

  expect(featured).toHaveLength(1)
})
```

### 9.3 Parameterized Tests

Test multiple scenarios with `test.each()`:

```typescript
describe('validateEmail', () => {
  test.each([
    ['test@example.com', true],
    ['invalid-email', false],
    ['test@', false],
    ['@example.com', false],
    ['', false],
    [null, false],
  ])('should validate %s as %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected)
  })
})
```

### 9.4 Snapshot Testing

Useful for testing complex objects:

```typescript
it('should match snapshot', () => {
  const user = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2025-01-01'),
  }

  expect(user).toMatchSnapshot()
})

// First run: creates snapshot
// Subsequent runs: compares against snapshot
// Update: npm test -- -u
```

### 9.5 Async Testing

Test asynchronous code with `async/await`:

```typescript
// Promise-based
it('should fetch user data', async () => {
  const user = await fetchUser('123')
  expect(user.id).toBe('123')
})

// Callback-based
it('should call callback', (done) => {
  fetchUserCallback('123', (user) => {
    expect(user.id).toBe('123')
    done()
  })
})

// Error handling
it('should throw on invalid id', async () => {
  await expect(fetchUser('invalid')).rejects.toThrow('User not found')
})
```

### 9.6 Testing State Changes

Use `waitFor` for state updates:

```typescript
import { waitFor } from '@testing-library/react'

it('should update loading state', async () => {
  const { result } = renderHook(() => useCoursesStore())

  act(() => {
    result.current.setLoading(true)
  })

  await waitFor(() => {
    expect(result.current.isLoading).toBe(true)
  })
})
```

---

## 10. Coverage Targets

### 10.1 Coverage Thresholds

```javascript
// Root monorepo threshold
module.exports = {
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
```

```javascript
// App-specific tiered thresholds
coverageThreshold: {
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
}
```

### 10.2 Viewing Coverage

```bash
# Run tests with coverage
pnpm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html

# Coverage in terminal
pnpm test -- --coverage --coverageReporters=text
```

### 10.3 Coverage Metrics

- **Lines** - Percentage of executed lines
- **Functions** - Percentage of called functions
- **Branches** - Percentage of executed conditional branches
- **Statements** - Percentage of executed statements

### 10.4 Improving Coverage

Focus on **high-value, low-coverage** files:

```bash
# Find files below threshold
pnpm test -- --coverage --verbose

# Focus on specific file
pnpm test storage.test.ts -- --coverage
```

**Priority order:**
1. Critical business logic
2. Utility functions
3. API routes
4. State management
5. Components (covered in component testing)

---

## 11. Best Practices

### 11.1 Test Naming

✅ **Good:**
```typescript
it('should return default value when item does not exist', () => {})
it('should throw error on invalid email', () => {})
it('should filter courses by difficulty', () => {})
```

❌ **Bad:**
```typescript
it('test1', () => {})
it('works', () => {})
it('test storage', () => {})
```

### 11.2 Test Independence

✅ **Good:**
```typescript
describe('storage', () => {
  beforeEach(() => {
    localStorage.clear() // Reset before EACH test
  })

  it('test 1', () => {})
  it('test 2', () => {})
})
```

❌ **Bad:**
```typescript
describe('storage', () => {
  it('test 1', () => {
    localStorage.setItem('key', 'value')
  })

  it('test 2', () => {
    // Depends on test 1 - BAD!
    const value = localStorage.getItem('key')
  })
})
```

### 11.3 Test One Thing

✅ **Good:**
```typescript
it('should set loading to true', () => {
  store.setLoading(true)
  expect(store.isLoading).toBe(true)
})

it('should set loading to false', () => {
  store.setLoading(false)
  expect(store.isLoading).toBe(false)
})
```

❌ **Bad:**
```typescript
it('should handle loading and error states and data fetching', () => {
  store.setLoading(true)
  expect(store.isLoading).toBe(true)
  store.setError('error')
  expect(store.error).toBe('error')
  store.setData(data)
  expect(store.data).toEqual(data)
})
```

### 11.4 Avoid Over-Mocking

✅ **Good:**
```typescript
// Mock only what's necessary
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(() => ({ success: true })),
}))
```

❌ **Bad:**
```typescript
// Over-mocking - testing implementation details
jest.mock('../storage', () => ({
  getStorageItem: jest.fn(),
  setStorageItem: jest.fn(),
  // ... mocking everything defeats the purpose
}))
```

### 11.5 Test Behavior, Not Implementation

✅ **Good:**
```typescript
it('should store user preferences', () => {
  const prefs = { theme: 'dark', language: 'en' }
  savePreferences(prefs)

  const retrieved = getPreferences()
  expect(retrieved).toEqual(prefs)
})
```

❌ **Bad:**
```typescript
it('should call localStorage.setItem', () => {
  const spy = jest.spyOn(localStorage, 'setItem')
  savePreferences({ theme: 'dark' })
  expect(spy).toHaveBeenCalled() // Testing implementation
})
```

### 11.6 Use Descriptive Assertions

✅ **Good:**
```typescript
expect(response.status).toBe(200)
expect(data.courses).toHaveLength(3)
expect(user.email).toBe('test@example.com')
```

❌ **Bad:**
```typescript
expect(response.status).toBeTruthy() // Too vague
expect(data.courses.length > 0).toBe(true) // Indirect
expect(user).toBeTruthy() // Not specific
```

### 11.7 Clean Up After Tests

```typescript
describe('component', () => {
  let spy: jest.SpyInstance

  beforeEach(() => {
    spy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    spy.mockRestore() // Clean up spy
    jest.clearAllMocks() // Clear all mocks
  })

  afterAll(() => {
    // Clean up global state
  })
})
```

---

## 12. Common Pitfalls

### 12.1 Forgetting to Reset State

❌ **Problem:**
```typescript
describe('store', () => {
  it('test 1', () => {
    store.setState({ count: 5 })
    expect(store.getState().count).toBe(5)
  })

  it('test 2', () => {
    // count is still 5 from previous test!
    expect(store.getState().count).toBe(0) // FAILS
  })
})
```

✅ **Solution:**
```typescript
describe('store', () => {
  beforeEach(() => {
    resetStore(store) // Reset before each test
  })

  it('test 1', () => {
    store.setState({ count: 5 })
    expect(store.getState().count).toBe(5)
  })

  it('test 2', () => {
    expect(store.getState().count).toBe(0) // PASSES
  })
})
```

### 12.2 Not Using `act()` for State Updates

❌ **Problem:**
```typescript
it('should update state', () => {
  const { result } = renderHook(() => useStore())

  result.current.setCount(5) // Missing act()
  // Warning: An update to TestComponent inside a test was not wrapped in act(...)
})
```

✅ **Solution:**
```typescript
it('should update state', () => {
  const { result } = renderHook(() => useStore())

  act(() => {
    result.current.setCount(5)
  })

  expect(result.current.count).toBe(5)
})
```

### 12.3 Testing Implementation Details

❌ **Problem:**
```typescript
it('should call useState', () => {
  const spy = jest.spyOn(React, 'useState')
  render(<Component />)
  expect(spy).toHaveBeenCalled() // Testing React internals
})
```

✅ **Solution:**
```typescript
it('should display count', () => {
  render(<Component />)
  expect(screen.getByText('Count: 0')).toBeInTheDocument()
})
```

### 12.4 Async Timing Issues

❌ **Problem:**
```typescript
it('should load data', () => {
  loadData()
  expect(data).toBeDefined() // Data not loaded yet!
})
```

✅ **Solution:**
```typescript
it('should load data', async () => {
  await loadData()
  expect(data).toBeDefined()
})

// Or with waitFor
it('should load data', async () => {
  loadData()
  await waitFor(() => {
    expect(data).toBeDefined()
  })
})
```

### 12.5 Not Cleaning Up Mocks

❌ **Problem:**
```typescript
describe('tests', () => {
  it('test 1', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // Spy not restored!
  })

  it('test 2', () => {
    // console.log is still mocked!
  })
})
```

✅ **Solution:**
```typescript
describe('tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('test 1', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })
})
```

---

## 13. Troubleshooting

### 13.1 Common Error Messages

#### "Cannot find module '@/...'"

**Cause:** Path alias not configured in Jest

**Solution:** Check `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### "ReferenceError: window is not defined"

**Cause:** Code using browser APIs in SSR/test environment

**Solution:** Check environment:

```typescript
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

Or mock in `jest.setup.js`

#### "act(...) warning"

**Cause:** State update not wrapped in `act()`

**Solution:**

```typescript
act(() => {
  result.current.updateState()
})
```

#### "Jest did not exit one second after the test run"

**Cause:** Open handles (timers, connections)

**Solution:**

```typescript
afterAll(() => {
  jest.clearAllTimers()
  // Close connections
})
```

### 13.2 Debugging Tests

```bash
# Run single test file
pnpm test storage.test.ts

# Run specific test
pnpm test -t "should return default value"

# Run in watch mode
pnpm test --watch

# Debug with Node
node --inspect-brk node_modules/.bin/jest --runInBand storage.test.ts

# Verbose output
pnpm test --verbose

# Show test names only
pnpm test --listTests
```

### 13.3 Performance

```bash
# Measure test duration
pnpm test --verbose --testTimeout=10000

# Run in band (sequential) for debugging
pnpm test --runInBand

# Limit workers
pnpm test --maxWorkers=2
```

---

## Quick Reference

### Running Tests

```bash
# All unit tests
pnpm test

# With coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch

# Single file
pnpm test storage.test.ts

# Specific test
pnpm test -t "should return default value"

# Update snapshots
pnpm test -- -u
```

### Common Matchers

```typescript
// Equality
expect(value).toBe(expected)         // ===
expect(value).toEqual(expected)      // Deep equality
expect(value).toStrictEqual(expected) // Strict deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeGreaterThanOrEqual(3)
expect(value).toBeLessThan(3)
expect(value).toBeLessThanOrEqual(3)
expect(value).toBeCloseTo(3.14, 2) // Floating point

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(array).toEqual(expect.arrayContaining([1, 2]))

// Objects
expect(object).toHaveProperty('key')
expect(object).toHaveProperty('key', value)
expect(object).toMatchObject({ key: value })

// Functions
expect(fn).toThrow()
expect(fn).toThrow('error message')
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledTimes(2)
expect(fn).toHaveBeenCalledWith(arg1, arg2)
```

### Test Lifecycle

```typescript
beforeAll(() => {})     // Once before all tests
beforeEach(() => {})    // Before each test
afterEach(() => {})     // After each test
afterAll(() => {})      // Once after all tests
```

---

## Related Documentation

- [22. Testing Infrastructure](./22-testing-infrastructure.md) - Overall testing strategy
- [24. Component Testing](./24-component-testing.md) - React component testing
- [25. E2E Testing](./25-e2e-testing.md) - Playwright E2E tests
- [26. CI/CD Pipeline](./26-cicd-pipeline.md) - Automated testing

---

**Document Version:** 1.0
**Coverage:** 370+ total tests
**Test Files:** 15+ unit test files
**Maintainer:** AI Whisperers Team
**Next Review:** Phase 7 - Pre-Production
