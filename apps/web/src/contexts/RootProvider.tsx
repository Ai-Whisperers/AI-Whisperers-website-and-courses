/**
 * Root Provider
 * Combines all global context layers in proper nesting order
 *
 * ✅ PHASE 2: Added React Query for server state management
 *
 * Nesting hierarchy (outermost to innermost):
 * 1. SecurityProvider (Layer 0) - Authentication, users, payments, permissions
 * 2. QueryClientProvider (Infrastructure) - React Query for server state
 * 3. LogicProvider (Layer 1) - Routing, modals, notifications, admin features
 * 4. DesignSystemProvider (Layer 2A) - Design tokens, themes (PUBLIC DATA)
 * 5. PresentationProvider (Layer 2B) - User UI preferences (PRIVATE DATA)
 * 6. I18nProvider (Layer 3) - Language, locale, translations
 */

'use client'

import React, { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@aiwhisperers/state-core'
import { SecurityProvider } from './security'
import { LogicProvider } from './logic'
import { DesignSystemProvider } from './design-system'
import { PresentationProvider } from './presentation'
import { I18nProvider } from './i18n'

interface RootProviderProps {
  children: ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <LogicProvider>
          <DesignSystemProvider>
            <PresentationProvider>
              <I18nProvider>
                {children}
              </I18nProvider>
            </PresentationProvider>
          </DesignSystemProvider>
        </LogicProvider>
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </SecurityProvider>
  )
}

/**
 * Why this nesting order?
 *
 * 1. SecurityProvider (Layer 0 - Outermost)
 *    - Must initialize first to determine user authentication
 *    - Controls access to entire application
 *    - Other contexts may depend on user state
 *
 * 2. QueryClientProvider (Infrastructure - Added in Phase 2)
 *    - Provides React Query for server state management
 *    - Placed after Security to access auth context for API calls
 *    - Framework-level infrastructure, not domain state
 *    - Includes DevTools for development debugging
 *
 * 3. LogicProvider (Layer 1)
 *    - Depends on security state (admin mode, protected routes)
 *    - Independent of UI presentation
 *    - Controls application behavior
 *
 * 4. DesignSystemProvider (Layer 2A - NEW)
 *    - PUBLIC DATA: Static design tokens and themes
 *    - Independent of user state (cacheable, versionable)
 *    - Enables multi-tenancy and white-labeling
 *    - Provides foundation for UI preferences
 *
 * 5. PresentationProvider (Layer 2B - Refactored)
 *    - PRIVATE DATA: User-specific UI preferences
 *    - May depend on user preferences from Security
 *    - Consumes design tokens from DesignSystemProvider
 *    - GDPR-compliant user data
 *
 * 6. I18nProvider (Layer 3 - Innermost)
 *    - Most isolated concern
 *    - May depend on user language preference from Security
 *    - Least dependencies on other contexts
 *
 * Benefits of Layer 2A/2B separation:
 * - Security: Clear data classification (public vs. private)
 * - Performance: Static tokens can be cached/optimized separately
 * - Multi-tenancy: Tenant-specific themes without user data mixing
 * - Versioning: Design system can be versioned independently
 * - Developer Experience: Type-safe token autocomplete
 */
