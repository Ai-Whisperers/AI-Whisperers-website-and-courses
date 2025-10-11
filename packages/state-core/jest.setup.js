// Jest setup for state-core package
require('@testing-library/jest-dom')

// Mock localStorage for Zustand persist
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
  }
})()

global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Suppress Zustand devtools warnings in tests
const originalWarn = console.warn
global.console = {
  ...console,
  warn: jest.fn(),
}

// Restore after tests
afterAll(() => {
  console.warn = originalWarn
})
