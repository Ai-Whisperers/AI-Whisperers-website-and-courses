# @aiwhisperers/state-core

**State Management Package for AI Whisperers Platform**

✅ **PHASE 2: State Management Migration Complete**

This package provides centralized state management for the AI Whisperers platform using Zustand for client state and React Query for server state.

## 📦 What's Inside

### Zustand Stores (Client State)

1. **Courses Store** (`packages/state-core/courses/`)
   - Course catalog and enrollment data
   - Selected course tracking
   - Loading and error states
   - Persistence middleware enabled

2. **UI Store** (`packages/state-core/ui/`)
   - Theme preferences (light/dark/system)
   - Sidebar state
   - Modal management
   - Notification preferences
   - Persistence middleware enabled

3. **Analytics Store** (`packages/state-core/analytics/`)
   - Page view tracking
   - User interaction tracking
   - Course engagement metrics
   - Session management
   - NO persistence (privacy-first)

### React Query (Server State)

4. **Query Client** (`packages/state-core/query/`)
   - Pre-configured QueryClient
   - Query key factory for type safety
   - DevTools integration (development only)

### Custom Hooks

5. **API Hooks** (`packages/state-core/hooks/`)
   - `useCourses()` - Fetch courses with Zustand sync
   - `useEnrollments()` - Fetch user enrollments
   - `useEnrollCourse()` - Enroll in course mutation

## 🚀 Usage

### Import Stores

```typescript
import {
  useCoursesStore,
  useUIStore,
  useAnalyticsStore
} from '@aiwhisperers/state-core'

// In component
const courses = useCoursesStore((s) => s.courses)
const theme = useUIStore((s) => s.theme)
const trackPageView = useAnalyticsStore((s) => s.trackPageView)
```

### Use Selector Hooks (Optimized)

```typescript
import {
  useSelectedCourse,
  useEnrolledCourses,
  useTheme,
  useSidebarOpen
} from '@aiwhisperers/state-core'

// These hooks only re-render when their specific value changes
const selectedCourse = useSelectedCourse()
const enrolledCourses = useEnrolledCourses()
const theme = useTheme()
const sidebarOpen = useSidebarOpen()
```

### Use API Hooks

```typescript
import {
  useCourses,
  useEnrollCourse
} from '@aiwhisperers/state-core'

function CourseCatalog() {
  const { data, isLoading, error } = useCourses()
  const enrollMutation = useEnrollCourse()

  const handleEnroll = (courseId: string) => {
    enrollMutation.mutate(courseId)
  }

  // ...
}
```

## 🏗️ Architecture

### Provider Hierarchy (in RootProvider)

```
<SecurityProvider>
  <QueryClientProvider>         ← React Query for server state
    <LogicProvider>
      <DesignSystemProvider>
        <PresentationProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </PresentationProvider>
      </DesignSystemProvider>
    </LogicProvider>
    <ReactQueryDevtools />       ← Development only
  </QueryClientProvider>
</SecurityProvider>
```

### State Separation Strategy

**Client State (Zustand)**:
- Domain state (courses, enrollments)
- UI preferences (theme, sidebar)
- Analytics tracking
- Optimistic updates

**Server State (React Query)**:
- API data fetching
- Caching and synchronization
- Background refetching
- Mutation management

**Context (Preserved)**:
- Authentication (SecurityProvider)
- Internationalization (I18nProvider)
- SSR-compatible state only

## 🎯 Key Features

### Zustand Features

- ✅ **Persistence**: Courses and UI preferences saved to localStorage
- ✅ **DevTools**: Redux DevTools integration in development
- ✅ **TypeScript**: Full type safety with inference
- ✅ **Selector Hooks**: Optimized re-renders with individual selectors
- ✅ **Computed Values**: Getter functions for derived state

### React Query Features

- ✅ **Smart Caching**: 1-minute stale time, 5-minute garbage collection
- ✅ **Auto Retry**: Failed requests retry once
- ✅ **DevTools**: Visual query inspector in development
- ✅ **Optimistic Updates**: UI updates before server confirmation
- ✅ **Query Keys**: Centralized, type-safe query key factory

## 📊 Store Structure

### Courses Store

```typescript
interface CoursesState {
  // State
  courses: Course[]
  enrollments: Enrollment[]
  selectedCourseId: string | null
  isLoading: boolean
  error: string | null

  // Computed
  selectedCourse: () => Course | null
  enrolledCourses: () => Course[]
  isEnrolled: (courseId: string) => boolean

  // Actions
  setCourses: (courses: Course[]) => void
  selectCourse: (courseId: string | null) => void
  addEnrollment: (enrollment: Enrollment) => void
  // ... more actions
}
```

### UI Store

```typescript
interface UIState {
  // State
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  modalStack: string[]
  notificationsEnabled: boolean

  // Actions
  setTheme: (theme) => void
  toggleTheme: () => void
  openModal: (id: string) => void
  closeModal: () => void
  // ... more actions
}
```

### Analytics Store

```typescript
interface AnalyticsState {
  // State
  sessionId: string | null
  pageViews: PageView[]
  interactions: UserInteraction[]
  courseEngagements: Record<string, CourseEngagement>

  // Actions
  trackPageView: (path: string) => void
  trackInteraction: (interaction) => void
  updateCourseEngagement: (courseId, updates) => void
  // ... more actions
}
```

## 🔧 Configuration

### Query Client Settings

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
}
```

### Persistence Settings

**Courses Store**:
- Persists: `courses`, `enrollments`
- Storage: localStorage
- Key: `courses-storage`

**UI Store**:
- Persists: `theme`, `sidebarCollapsed`, `notificationsEnabled`, etc.
- Storage: localStorage
- Key: `ui-storage`

**Analytics Store**:
- NO persistence (privacy-first)

## 📝 Migration Guide

### Before (Context)

```typescript
import { useContext } from 'react'
import { CoursesContext } from '@/contexts/courses'

const { courses, isLoading } = useContext(CoursesContext)
```

### After (Zustand + React Query)

```typescript
import { useCourses } from '@aiwhisperers/state-core'

const { data, isLoading } = useCourses()
```

### Benefits

- ✅ **Better Performance**: Selective re-renders with Zustand selectors
- ✅ **Server State Caching**: React Query handles caching/revalidation
- ✅ **DevTools**: Visual debugging in development
- ✅ **Type Safety**: Full TypeScript inference
- ✅ **Simplified Code**: Less boilerplate than Context

## 🐛 DevTools

### Zustand DevTools

Open Redux DevTools extension in browser to inspect:
- Current state of all stores
- Action history
- Time-travel debugging

### React Query DevTools

Available in development at bottom of screen:
- Query status (loading, success, error)
- Cache contents
- Refetch queries manually
- View query keys and metadata

## 🧪 Testing

```typescript
import { renderHook } from '@testing-library/react'
import { useCoursesStore } from '@aiwhisperers/state-core'

describe('useCoursesStore', () => {
  it('should add enrollment', () => {
    const { result } = renderHook(() => useCoursesStore())

    const enrollment = { id: '1', courseId: 'course-1', ... }
    result.current.addEnrollment(enrollment)

    expect(result.current.enrollments).toContain(enrollment)
  })
})
```

## 📚 Dependencies

- `zustand` ^5.0.2 - Client state management
- `@tanstack/react-query` ^5.64.2 - Server state management
- `react` 19.1.0 - Peer dependency

## 🔗 Related Packages

- `@aiwhisperers/database` - Prisma client and types
- `@aiwhisperers/config-typescript` - Shared TypeScript config

## 📖 Documentation

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Project Architecture](../../ARCHITECTURE.md)
- [Phase 2 Completion Report](../../local-reports/phase-2-state-management-complete.md)

## 🎯 Future Enhancements

- [ ] Add more domain stores (payments, certificates, etc.)
- [ ] Implement query cache persistence
- [ ] Add analytics aggregation and reporting
- [ ] Create state debugging utilities
- [ ] Add performance monitoring

---

**Version**: 0.1.0
**Created**: October 10, 2025
**Phase**: Phase 2 - State Management Migration
**Status**: ✅ Complete
