/**
 * Test Utilities
 * Custom render function with all providers for consistent testing
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

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

// Mock admin session
export const mockAdminSession = {
  user: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  expires: '2025-12-31',
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null
  locale?: 'en' | 'es'
}

/**
 * All Providers Wrapper
 * Wraps components with all necessary providers for testing
 */
function AllTheProviders({
  children,
  session = null,
  locale = 'en',
}: {
  children: React.ReactNode
  session?: typeof mockSession | null
  locale?: 'en' | 'es'
}) {
  // For now, just return children
  // TODO: Add SecurityProvider, I18nProvider when ready
  return <>{children}</>
}

/**
 * Custom render function with providers
 * Use this instead of @testing-library/react's render
 */
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

// Export custom render as default render
export { renderWithProviders as render }
