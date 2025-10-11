// Jest setup for state-core package
import '@testing-library/jest-dom'

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
global.console = {
  ...console,
  warn: jest.fn(),
}
