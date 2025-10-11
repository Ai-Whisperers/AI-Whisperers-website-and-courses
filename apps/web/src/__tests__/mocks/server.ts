/**
 * MSW Server Setup
 * Set up Mock Service Worker for API mocking in tests
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Create MSW server with handlers
export const server = setupServer(...handlers)

// Setup and teardown hooks
beforeAll(() => {
  // Start server before all tests
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  })
})

afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers()
})

afterAll(() => {
  // Clean up after all tests
  server.close()
})
