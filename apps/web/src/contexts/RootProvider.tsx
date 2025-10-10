/**
 * Root Provider
 * Combines all 5 global context layers in proper nesting order
 *
 * Nesting hierarchy (outermost to innermost):
 * 1. SecurityProvider (Layer 0) - Authentication, users, payments, permissions
 * 2. LogicProvider (Layer 1) - Routing, modals, notifications, admin features
 * 3. DesignSystemProvider (Layer 2A) - Design tokens, themes (PUBLIC DATA)
 * 4. PresentationProvider (Layer 2B) - User UI preferences (PRIVATE DATA)
 * 5. I18nProvider (Layer 3) - Language, locale, translations
 */

'use client'

import React, { ReactNode } from 'react'
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
      <LogicProvider>
        <DesignSystemProvider>
          <PresentationProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </PresentationProvider>
        </DesignSystemProvider>
      </LogicProvider>
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
 * 2. LogicProvider (Layer 1)
 *    - Depends on security state (admin mode, protected routes)
 *    - Independent of UI presentation
 *    - Controls application behavior
 *
 * 3. DesignSystemProvider (Layer 2A - NEW)
 *    - PUBLIC DATA: Static design tokens and themes
 *    - Independent of user state (cacheable, versionable)
 *    - Enables multi-tenancy and white-labeling
 *    - Provides foundation for UI preferences
 *
 * 4. PresentationProvider (Layer 2B - Refactored)
 *    - PRIVATE DATA: User-specific UI preferences
 *    - May depend on user preferences from Security
 *    - Consumes design tokens from DesignSystemProvider
 *    - GDPR-compliant user data
 *
 * 5. I18nProvider (Layer 3 - Innermost)
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
