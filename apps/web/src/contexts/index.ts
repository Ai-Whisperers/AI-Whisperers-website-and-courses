/**
 * Global Contexts - 4-Layer Architecture
 * Enterprise-grade separation of concerns
 */

// Root Provider (exports all layers)
export { RootProvider } from './RootProvider'

// Layer 1: Security Context
export * from './security'

// Layer 2: Presentation Context
export * from './presentation'

// Layer 3: Logic Context
export * from './logic'

// Layer 4: I18n Context
export * from './i18n'
