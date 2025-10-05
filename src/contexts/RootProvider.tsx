/**
 * Root Provider
 * Combines all 4 global context layers in proper nesting order
 *
 * Nesting hierarchy (outermost to innermost):
 * 1. SecurityProvider - Authentication, users, payments, permissions
 * 2. LogicProvider - Routing, modals, notifications, admin features
 * 3. PresentationProvider - UI, themes, styling, accessibility
 * 4. I18nProvider - Language, locale, translations
 */

'use client'

import React, { ReactNode } from 'react'
import { SecurityProvider } from './security'
import { LogicProvider } from './logic'
import { PresentationProvider } from './presentation'
import { I18nProvider } from './i18n'

interface RootProviderProps {
  children: ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <SecurityProvider>
      <LogicProvider>
        <PresentationProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </PresentationProvider>
      </LogicProvider>
    </SecurityProvider>
  )
}

/**
 * Why this nesting order?
 *
 * 1. SecurityProvider (Outermost)
 *    - Must initialize first to determine user authentication
 *    - Controls access to entire application
 *    - Other contexts may depend on user state
 *
 * 2. LogicProvider
 *    - Depends on security state (admin mode, protected routes)
 *    - Independent of UI presentation
 *    - Controls application behavior
 *
 * 3. PresentationProvider
 *    - May depend on user preferences from Security
 *    - May depend on feature flags from Logic
 *    - Independent of language
 *
 * 4. I18nProvider (Innermost)
 *    - Most isolated concern
 *    - May depend on user language preference from Security
 *    - Least dependencies on other contexts
 */
