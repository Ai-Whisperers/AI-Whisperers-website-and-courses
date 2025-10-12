# State Management Architecture - 5-Layer System

**Document Version:** 1.0.0
**Last Updated:** October 12, 2025
**Status:** Complete
**Related Docs:** [System Architecture](./01-system-architecture.md), [Global State System](./13-global-state.md)

---

## Table of Contents

1. [Overview](#overview)
2. [5-Layer Hierarchy](#5-layer-hierarchy)
3. [Layer 0: Security Context](#layer-0-security-context)
4. [Layer 1: Logic Context](#layer-1-logic-context)
5. [Layer 2A: DesignSystem Context](#layer-2a-designsystem-context)
6. [Layer 2B: Presentation Context](#layer-2b-presentation-context)
7. [Layer 3: i18n Context](#layer-3-i18n-context)
8. [RootProvider](#rootprovider)
9. [Zustand Stores](#zustand-stores)
10. [Storage Strategy](#storage-strategy)
11. [Best Practices](#best-practices)

---

## Overview

The AI Whisperers platform implements an **enterprise 5-layer global state architecture** that separates concerns into distinct, hierarchical layers. This pattern ensures clean data flow, type safety, and SSR compatibility.

### Key Characteristics

- **5 Layers**: Security → Logic → DesignSystem → Presentation → i18n
- **Provider Hierarchy**: Nested providers with clear dependencies
- **Type-Safe Hooks**: Custom hooks for each concern
- **SSR-Compatible**: Server-side rendering safe
- **Cross-Tab Sync**: State synchronized across browser tabs
- **Encrypted Storage**: Sensitive data encrypted in localStorage

### Why 5 Layers?

**Problem**: Traditional global state mixes concerns (auth + UI + i18n + business logic)

**Solution**: Separate state by concern with clear dependencies

```
Layer 0 (Security) ──► Controls access to everything
     ↓ depends on
Layer 1 (Logic) ──► Business logic, routing, modals
     ↓ depends on
Layer 2A (DesignSystem) ──► PUBLIC design tokens
     ↓ parallel with
Layer 2B (Presentation) ──► PRIVATE UI preferences
     ↓ depends on
Layer 3 (i18n) ──► Most isolated, translations
```

---

## 5-Layer Hierarchy

### Provider Nesting Order (CRITICAL)

**This order must be maintained for the system to function correctly:**

```tsx
<SecurityProvider>          // Layer 0: Outermost - controls access
  <LogicProvider>           // Layer 1: Business logic
    <DesignSystemProvider>  // Layer 2A: Design tokens (PUBLIC)
      <PresentationProvider> // Layer 2B: UI preferences (PRIVATE)
        <I18nProvider>      // Layer 3: Innermost - translations
          {children}
        </I18nProvider>
      </PresentationProvider>
    </DesignSystemProvider>
  </LogicProvider>
</SecurityProvider>
```

**File**: `apps/web/src/contexts/RootProvider.tsx`

```typescript
import { SecurityProvider } from './security'
import { LogicProvider } from './logic'
import { DesignSystemProvider } from './design-system'
import { PresentationProvider } from './presentation'
import { I18nProvider } from './i18n'

export function RootProvider({ children }: { children: React.ReactNode }) {
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
```

### Why This Order?

1. **SecurityProvider First**: Must be outermost to control access to entire app
2. **LogicProvider Second**: Depends on security for admin/protected routes
3. **DesignSystemProvider (2A)**: PUBLIC tokens (cacheable, versionable)
4. **PresentationProvider (2B)**: PRIVATE UI prefs (uses design tokens)
5. **I18nProvider Last**: Most isolated, no dependencies on others

### Layer 2A vs 2B Split

**Layer 2A (DesignSystem)** - PUBLIC
- Design tokens (colors, typography, spacing)
- Theme configurations
- Cacheable, versionable
- Multi-tenant safe

**Layer 2B (Presentation)** - PRIVATE
- User UI preferences
- Accessibility settings
- User-specific data
- GDPR-compliant separation

**Benefits**:
- Security: Clear data classification (public vs. private)
- Performance: Static tokens cached separately
- Multi-tenancy: Tenant themes without user data mixing
- Versioning: Design system versioned independently

---

## Layer 0: Security Context

**Location**: `apps/web/src/contexts/security/`
**Responsibility**: Authentication, users, payments, permissions

### State Structure

```typescript
interface SecurityState {
  // Authentication
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  session: Session | null

  // Permissions
  permissions: Permission[]
  roles: Role[]

  // Payment (future)
  subscriptionStatus: 'active' | 'inactive' | 'trial'
  paymentMethods: PaymentMethod[]
}
```

### Hooks Provided

```typescript
// Authentication hooks
export const useAuth = () => useSecurityContext()
export const useUser = () => useSecurityContext().user
export const useSession = () => useSecurityContext().session

// Permission hooks
export const usePermissions = () => useSecurityContext().permissions
export const useHasPermission = (permission: string) => boolean
export const useHasRole = (role: string) => boolean

// Payment hooks (future)
export const useSubscription = () => useSecurityContext().subscriptionStatus
export const usePaymentMethods = () => useSecurityContext().paymentMethods
```

### Usage Example

```tsx
'use client'
import { useAuth, useUser, useHasRole } from '@/contexts/security'

export function UserProfile() {
  const { isAuthenticated, isLoading } = useAuth()
  const user = useUser()
  const isAdmin = useHasRole('admin')

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {isAdmin && <AdminControls />}
    </div>
  )
}
```

### Files

- `SecurityContext.tsx` - Context definition and provider
- `SecurityProvider.tsx` - Provider implementation
- `index.ts` - Public exports
- `types.ts` - TypeScript types

**See**: [Security Context](./14-security-context.md) for complete documentation

---

## Layer 1: Logic Context

**Location**: `apps/web/src/contexts/logic/`
**Responsibility**: Routing, modals, notifications, admin features

### State Structure

```typescript
interface LogicState {
  // Routing
  currentRoute: string
  previousRoute: string | null
  routeHistory: string[]

  // Modal management
  modals: Modal[]
  openModal: (modal: Modal) => void
  closeModal: (modalId: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void

  // Admin features
  adminMode: boolean
  featureFlags: Record<string, boolean>
}
```

### Hooks Provided

```typescript
// Routing hooks
export const useRouting = () => useLogicContext()
export const useCurrentRoute = () => useLogicContext().currentRoute

// Modal hooks
export const useModals = () => useLogicContext().modals
export const useOpenModal = () => useLogicContext().openModal
export const useCloseModal = () => useLogicContext().closeModal

// Notification hooks
export const useNotifications = () => useLogicContext().notifications
export const useAddNotification = () => useLogicContext().addNotification

// Admin hooks
export const useAdminMode = () => useLogicContext().adminMode
export const useFeatureFlag = (flag: string) => boolean
```

### Usage Example

```tsx
'use client'
import { useOpenModal, useAddNotification } from '@/contexts/logic'

export function EnrollButton({ courseId }: { courseId: string }) {
  const openModal = useOpenModal()
  const addNotification = useAddNotification()

  const handleEnroll = () => {
    openModal({
      id: 'enroll-modal',
      type: 'enrollment',
      props: { courseId }
    })

    addNotification({
      id: crypto.randomUUID(),
      type: 'info',
      message: 'Opening enrollment modal...'
    })
  }

  return <button onClick={handleEnroll}>Enroll Now</button>
}
```

**See**: [Logic Context](./15-logic-context.md) for complete documentation

---

## Layer 2A: DesignSystem Context

**Location**: `apps/web/src/contexts/design-system/`
**Responsibility**: Design tokens, themes (PUBLIC data)

### State Structure

```typescript
interface DesignSystemState {
  // Design Tokens
  colors: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  shadows: ShadowTokens
  borders: BorderTokens
  transitions: TransitionTokens
  zIndex: ZIndexTokens

  // Theme
  currentTheme: Theme
  availableThemes: Theme[]
  setTheme: (themeId: string) => void

  // Version
  version: string
}
```

### Design Tokens Example

```typescript
// apps/web/src/lib/design-system/tokens/colors.ts
export const colorTokens = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const
```

### Hooks Provided

```typescript
// Token access hooks
export const useDesignTokens = () => useDesignSystemContext()
export const useColors = () => useDesignSystemContext().colors
export const useTypography = () => useDesignSystemContext().typography

// Theme hooks
export const useTheme = () => useDesignSystemContext().currentTheme
export const useSetTheme = () => useDesignSystemContext().setTheme
export const useAvailableThemes = () => useDesignSystemContext().availableThemes
```

### Usage Example

```tsx
'use client'
import { useColors, useTypography } from '@/contexts/design-system'

export function StyledCard() {
  const colors = useColors()
  const typography = useTypography()

  return (
    <div style={{
      backgroundColor: colors.primary[50],
      color: colors.primary[900],
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.sans,
      padding: '1rem',
      borderRadius: '0.5rem',
    }}>
      Card content
    </div>
  )
}
```

**See**: [Design System Context](./16-design-system-context.md) for complete documentation

---

## Layer 2B: Presentation Context

**Location**: `apps/web/src/contexts/presentation/`
**Responsibility**: UI preferences, accessibility (PRIVATE user data)

### State Structure

```typescript
interface PresentationState {
  // Theme mode (user preference)
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void

  // UI preferences
  sidebarCollapsed: boolean
  compactMode: boolean
  animationsEnabled: boolean

  // Accessibility
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
}
```

### Hooks Provided

```typescript
// Theme mode hooks
export const useThemeMode = () => usePresentationContext().themeMode
export const useSetThemeMode = () => usePresentationContext().setThemeMode

// UI preference hooks
export const useSidebarCollapsed = () => usePresentationContext().sidebarCollapsed
export const useCompactMode = () => usePresentationContext().compactMode
export const useAnimationsEnabled = () => usePresentationContext().animationsEnabled

// Accessibility hooks
export const useReducedMotion = () => usePresentationContext().reducedMotion
export const useHighContrast = () => usePresentationContext().highContrast
export const useFontSize = () => usePresentationContext().fontSize
```

### Usage Example

```tsx
'use client'
import { useThemeMode, useAnimationsEnabled } from '@/contexts/presentation'
import { motion } from 'framer-motion'

export function AnimatedCard() {
  const themeMode = useThemeMode()
  const animationsEnabled = useAnimationsEnabled()

  const isDark = themeMode === 'dark'

  return (
    <motion.div
      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
      className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
    >
      Card content
    </motion.div>
  )
}
```

**See**: [Presentation Context](./17-presentation-context.md) for complete documentation

---

## Layer 3: i18n Context

**Location**: `apps/web/src/contexts/i18n/`
**Responsibility**: Language, locale, translations, formatting

### State Structure

```typescript
interface I18nState {
  // Language
  language: 'en' | 'es'
  setLanguage: (lang: 'en' | 'es') => void
  availableLanguages: Language[]

  // Locale
  locale: string
  direction: 'ltr' | 'rtl'

  // Formatters
  formatDate: (date: Date) => string
  formatCurrency: (amount: number, currency: string) => string
  formatNumber: (num: number) => string
  formatRelativeTime: (date: Date) => string

  // Translation function
  t: (key: string, params?: Record<string, any>) => string
}
```

### Hooks Provided

```typescript
// Language hooks
export const useLanguage = () => useI18nContext().language
export const useSetLanguage = () => useI18nContext().setLanguage
export const useAvailableLanguages = () => useI18nContext().availableLanguages

// Locale hooks
export const useLocale = () => useI18nContext().locale
export const useDirection = () => useI18nContext().direction

// Formatter hooks
export const useFormatters = () => ({
  formatDate: useI18nContext().formatDate,
  formatCurrency: useI18nContext().formatCurrency,
  formatNumber: useI18nContext().formatNumber,
  formatRelativeTime: useI18nContext().formatRelativeTime,
})

// Translation hook
export const useTranslation = () => useI18nContext().t
```

### Usage Example

```tsx
'use client'
import { useLanguage, useFormatters, useTranslation } from '@/contexts/i18n'

export function CoursePrice({ price, date }: { price: number, date: Date }) {
  const language = useLanguage()
  const { formatCurrency, formatDate } = useFormatters()
  const t = useTranslation()

  return (
    <div>
      <p>{t('course.price')}: {formatCurrency(price, 'USD')}</p>
      <p>{t('course.publishedOn')}: {formatDate(date)}</p>
      <p>{t('course.currentLanguage')}: {language}</p>
    </div>
  )
}
```

**See**: [i18n Context](./18-i18n-context.md) for complete documentation

---

## RootProvider

**File**: `apps/web/src/contexts/RootProvider.tsx`

The `RootProvider` combines all 5 layers in the correct order and provides the complete global state system to the app.

### Implementation

```typescript
'use client'
import { ReactNode } from 'react'
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
```

### Usage in App

**File**: `apps/web/src/app/layout.tsx`

```tsx
import { RootProvider } from '@/contexts/RootProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
```

---

## Zustand Stores

In addition to the 5-layer context system, we use **Zustand** for client-side state that doesn't need server-side rendering or cross-tab synchronization.

### Store Locations

```
packages/state-core/
├── courses/         # Courses and enrollment state
├── ui/              # UI-specific state (modals, sidebar)
└── analytics/       # Analytics and tracking
```

### Courses Store

**File**: `packages/state-core/courses/src/store.ts`

```typescript
import { create } from 'zustand'

interface CoursesState {
  courses: Course[]
  selectedCourseId: string | null
  enrollments: Enrollment[]

  // Actions
  setCourses: (courses: Course[]) => void
  selectCourse: (id: string) => void
  addEnrollment: (enrollment: Enrollment) => void

  // Computed
  selectedCourse: () => Course | null
  enrolledCourses: () => Course[]
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  selectedCourseId: null,
  enrollments: [],

  setCourses: (courses) => set({ courses }),
  selectCourse: (id) => set({ selectedCourseId: id }),
  addEnrollment: (enrollment) => set((state) => ({
    enrollments: [...state.enrollments, enrollment]
  })),

  selectedCourse: () => {
    const { courses, selectedCourseId } = get()
    return courses.find(c => c.id === selectedCourseId) || null
  },

  enrolledCourses: () => {
    const { courses, enrollments } = get()
    return courses.filter(c =>
      enrollments.some(e => e.courseId === c.id)
    )
  },
}))
```

**See**: [Courses Store](./19-courses-store.md) for complete documentation

---

## Storage Strategy

### Unified Storage Utility

**File**: `apps/web/src/utils/storage.ts`

SSR-safe localStorage wrapper with encryption for sensitive data.

```typescript
interface StorageOptions {
  encrypt?: boolean
  ttl?: number // Time to live in milliseconds
}

export const storage = {
  setItem<T>(key: string, value: T, options?: StorageOptions): void {
    if (typeof window === 'undefined') return

    const data = {
      value,
      timestamp: Date.now(),
      ttl: options?.ttl,
    }

    const serialized = JSON.stringify(data)
    const stored = options?.encrypt ? encrypt(serialized) : serialized

    localStorage.setItem(key, stored)

    // Broadcast to other tabs
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('storage-sync')
      channel.postMessage({ key, value, action: 'set' })
    }
  },

  getItem<T>(key: string, encrypted = false): T | null {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
      const decrypted = encrypted ? decrypt(stored) : stored
      const data = JSON.parse(decrypted)

      // Check TTL
      if (data.ttl && Date.now() - data.timestamp > data.ttl) {
        this.removeItem(key)
        return null
      }

      return data.value as T
    } catch {
      return null
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)

    // Broadcast to other tabs
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('storage-sync')
      channel.postMessage({ key, action: 'remove' })
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }
}
```

**See**: [Storage Utility](./36-storage-utility.md) for complete documentation

---

## Best Practices

### 1. Always Use Hooks

**Good**:
```tsx
const user = useUser()
const isAdmin = useHasRole('admin')
```

**Bad**:
```tsx
const context = useSecurityContext()
const user = context.user
```

### 2. Colocate State with Usage

Keep state as close as possible to where it's used. Don't lift state unnecessarily.

### 3. Use Zustand for Client-Only State

If state doesn't need SSR or cross-tab sync, use Zustand stores instead of Context.

### 4. Maintain Provider Order

Never change the order of providers in `RootProvider.tsx`. The hierarchy is critical.

### 5. Type Everything

Use TypeScript types for all state, hooks, and functions.

```typescript
// Good
export const useUser = (): User | null => useSecurityContext().user

// Bad
export const useUser = () => useSecurityContext().user
```

### 6. Document State Changes

Add comments explaining why state updates happen.

```typescript
// Update user after profile edit
const updateUser = (user: User) => {
  setState({ user })
  storage.setItem('user', user, { encrypt: true })
}
```

### 7. Test State Logic

Write tests for state updates and computed values.

```typescript
describe('useCoursesStore', () => {
  it('should add enrollment correctly', () => {
    const { result } = renderHook(() => useCoursesStore())

    act(() => {
      result.current.addEnrollment(mockEnrollment)
    })

    expect(result.current.enrollments).toContain(mockEnrollment)
  })
})
```

---

## Related Documentation

- **System**: [System Architecture](./01-system-architecture.md) - High-level system overview
- **Contexts**: [Security](./14-security-context.md), [Logic](./15-logic-context.md), [DesignSystem](./16-design-system-context.md), [Presentation](./17-presentation-context.md), [i18n](./18-i18n-context.md)
- **Stores**: [Courses](./19-courses-store.md), [UI](./20-ui-store.md), [Analytics](./21-analytics-store.md)
- **Utils**: [Storage Utility](./36-storage-utility.md)

---

*Last Updated: October 12, 2025 | State Management Version: 1.0.0*
