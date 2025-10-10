# 🔄 State Management Architecture

**AI Whisperers Platform - State Management Guide**
**Version:** 1.0.0
**Last Updated:** October 10, 2025

---

## 🎯 State Management Strategy

The platform uses a **hybrid state management approach** with three complementary solutions:

```
┌─────────────────────────────────────────────────────────┐
│  React Context                                          │
│  ✅ Auth, i18n (SSR-compatible)                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Zustand                                                │
│  ✅ Client state (UI preferences, analytics)            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  React Query                                            │
│  ✅ Server state (API data, caching)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 State Decision Matrix

| State Type | Solution | Why | Example |
|------------|----------|-----|---------|
| **Authentication** | React Context | SSR-compatible, needs to be available everywhere | User session, login status |
| **Internationalization** | React Context | SSR-compatible, affects rendering | Language, locale, translations |
| **UI Preferences** | Zustand | Client-only, needs persistence | Theme, sidebar state, modal state |
| **Analytics** | Zustand | Client-only, no persistence needed | Page views, interactions |
| **Server Data** | React Query | Automatic caching, background sync | Courses, enrollments, user data |
| **Form State** | Local State | Component-specific | Form inputs, validation errors |

---

## 🎨 React Context (Auth & i18n)

### Provider Hierarchy

```typescript
// apps/web/src/contexts/RootProvider.tsx
export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityProvider>          {/* Layer 0: Auth */}
        <LogicProvider>           {/* Layer 1: App logic */}
          <DesignSystemProvider>  {/* Layer 2A: Design tokens (public) */}
            <PresentationProvider> {/* Layer 2B: UI preferences (private) */}
              <I18nProvider>       {/* Layer 3: i18n */}
                {children}
              </I18nProvider>
            </PresentationProvider>
          </DesignSystemProvider>
        </LogicProvider>
      </SecurityProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```

### Why This Order?

1. **QueryClientProvider** (outermost) - Provides React Query to all components
2. **SecurityProvider** - Controls access to the entire app
3. **LogicProvider** - Depends on security for protected routes
4. **DesignSystemProvider** - Public design tokens (cacheable)
5. **PresentationProvider** - Private UI preferences (user-specific)
6. **I18nProvider** (innermost) - Most isolated, affects rendering

### Usage Example

```typescript
// components/Header.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { useI18n } from '@/hooks/use-i18n'

export function Header() {
  const { user, signOut } = useAuth()
  const { t, language, setLanguage } = useI18n()

  return (
    <header>
      <h1>{t('nav.home')}</h1>
      {user && <button onClick={signOut}>{t('auth.signOut')}</button>}
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </header>
  )
}
```

**Benefits:**
- ✅ SSR-compatible (works with Server Components)
- ✅ Global availability
- ✅ Type-safe with custom hooks
- ✅ No prop drilling

---

## ⚡ Zustand (Client State)

### Store Architecture

```
packages/state-core/
├── courses/src/store.ts       # Course domain state
├── ui/src/store.ts            # UI preferences
└── analytics/src/store.ts     # Analytics tracking
```

### Example: Courses Store

```typescript
// packages/state-core/courses/src/store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

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

  // Actions
  setCourses: (courses: Course[]) => void
  setEnrollments: (enrollments: Enrollment[]) => void
  selectCourse: (courseId: string | null) => void
  addEnrollment: (enrollment: Enrollment) => void
  reset: () => void
}

export const useCoursesStore = create<CoursesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        courses: [],
        enrollments: [],
        selectedCourseId: null,
        isLoading: false,
        error: null,

        // Computed getters
        selectedCourse: () => {
          const state = get()
          return state.courses.find(c => c.id === state.selectedCourseId) || null
        },

        enrolledCourses: () => {
          const state = get()
          const enrolledIds = state.enrollments.map(e => e.courseId)
          return state.courses.filter(c => enrolledIds.includes(c.id))
        },

        // Actions
        setCourses: (courses) => set({ courses }),
        setEnrollments: (enrollments) => set({ enrollments }),
        selectCourse: (courseId) => set({ selectedCourseId: courseId }),
        addEnrollment: (enrollment) => set((state) => ({
          enrollments: [...state.enrollments, enrollment]
        })),
        reset: () => set({
          courses: [],
          enrollments: [],
          selectedCourseId: null,
          isLoading: false,
          error: null,
        }),
      }),
      {
        name: 'courses-storage',  // localStorage key
        partialize: (state) => ({
          // Only persist these fields
          courses: state.courses,
          enrollments: state.enrollments,
        }),
      }
    ),
    { name: 'CoursesStore' }  // DevTools name
  )
)

// Selector hooks (performance optimization)
export const useSelectedCourse = () => useCoursesStore((s) => s.selectedCourse())
export const useEnrolledCourses = () => useCoursesStore((s) => s.enrolledCourses())
```

### Usage Example

```typescript
// components/CourseCard.tsx
'use client'

import { useCoursesStore, useSelectedCourse } from '@aiwhisperers/state-core/courses'

export function CourseCard({ courseId }: { courseId: string }) {
  // Option 1: Use selector hooks (recommended for performance)
  const selectedCourse = useSelectedCourse()

  // Option 2: Use store directly with selectors
  const courses = useCoursesStore(s => s.courses)
  const selectCourse = useCoursesStore(s => s.selectCourse)

  // Option 3: Destructure entire store (avoid - causes unnecessary re-renders)
  // const { courses, selectCourse } = useCoursesStore()  ❌ Don't do this

  return (
    <div onClick={() => selectCourse(courseId)}>
      {/* Course UI */}
    </div>
  )
}
```

**Benefits:**
- ✅ Minimal boilerplate
- ✅ TypeScript support out of the box
- ✅ DevTools for debugging
- ✅ Automatic persistence to localStorage
- ✅ Optimized re-renders with selectors

---

## 🔥 React Query (Server State)

### Configuration

```typescript
// packages/state-core/query/src/client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,         // Data is fresh for 1 minute
      gcTime: 5 * 60 * 1000,        // Cache for 5 minutes (formerly cacheTime)
      retry: 1,                      // Retry failed requests once
      refetchOnWindowFocus: false,   // Don't refetch on window focus
    },
    mutations: {
      retry: 0,  // Don't retry mutations
    },
  },
})
```

### Custom Hooks

```typescript
// packages/state-core/hooks/src/useCourses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCoursesStore } from '@aiwhisperers/state-core/courses'

export function useCourses() {
  const { setCourses, setLoading, setError } = useCoursesStore()

  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Failed to fetch courses')
        const data = await res.json()

        // Sync to Zustand store
        setCourses(data.courses)

        return data.courses
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        throw error
      } finally {
        setLoading(false)
      }
    },
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()
  const { addEnrollment } = useCoursesStore()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Enrollment failed')
      }
      return res.json()
    },
    onSuccess: (data) => {
      // Update Zustand store
      addEnrollment(data.enrollment)

      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['user', 'enrollments'] })
    },
  })
}
```

### Usage Example

```typescript
// components/CoursesList.tsx
'use client'

import { useCourses, useEnrollCourse } from '@aiwhisperers/state-core/hooks'

export function CoursesList() {
  const { data: courses, isLoading, error } = useCourses()
  const enrollMutation = useEnrollCourse()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <button
            onClick={() => enrollMutation.mutate(course.id)}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
          </button>
        </div>
      ))}
    </div>
  )
}
```

**Benefits:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Request deduplication
- ✅ DevTools for debugging

---

## 🔄 Zustand + React Query Integration

The platform uses **both together** for optimal state management:

```typescript
// React Query fetches and caches
const { data } = useCourses()  // Fetches from API

// Zustand stores for local access
const courses = useCoursesStore(s => s.courses)  // Local store

// Custom hook syncs both
export function useCourses() {
  const { setCourses } = useCoursesStore()

  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const data = await fetchCourses()
      setCourses(data)  // ✅ Sync to Zustand
      return data
    },
  })
}
```

**Why Both?**
- **React Query:** Server data, caching, refetching
- **Zustand:** Local state, computed values, persistence

---

## 🧪 DevTools

### Zustand DevTools (Development Only)

```typescript
import { devtools } from 'zustand/middleware'

export const useStore = create<State>()(
  devtools(
    (set) => ({ /* ... */ }),
    { name: 'MyStore' }  // Shows up in Redux DevTools
  )
)
```

**Access:**
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. See all Zustand stores

### React Query DevTools

```typescript
// apps/web/src/contexts/RootProvider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function RootProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

**Access:**
- Look for floating React Query icon in bottom-right corner
- Click to open panel
- See all queries, mutations, cache

---

## 📝 Best Practices

### 1. Use Selectors with Zustand

```typescript
// ❌ Bad - Re-renders on any store change
const { courses, enrollments, selectedCourse } = useCoursesStore()

// ✅ Good - Re-renders only when `courses` changes
const courses = useCoursesStore(s => s.courses)
```

### 2. Keep React Query Keys Consistent

```typescript
// ✅ Good - Organized hierarchy
const courseKeys = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', id] as const,
  enrollments: (userId: string) => ['courses', 'enrollments', userId] as const,
}
```

### 3. Handle Loading and Error States

```typescript
// ✅ Always handle these three states
const { data, isLoading, error } = useCourses()

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <CoursesList courses={data} />
```

### 4. Use Optimistic Updates for Mutations

```typescript
const enrollMutation = useMutation({
  mutationFn: enrollInCourse,
  onMutate: async (courseId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['courses'] })

    // Snapshot current value
    const previousCourses = queryClient.getQueryData(['courses'])

    // Optimistically update
    queryClient.setQueryData(['courses'], (old) => [...old, newCourse])

    return { previousCourses }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['courses'], context.previousCourses)
  },
  onSettled: () => {
    // Refetch to ensure sync
    queryClient.invalidateQueries({ queryKey: ['courses'] })
  },
})
```

### 5. Persist Only What's Needed

```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'courses-storage',
    partialize: (state) => ({
      // ✅ Only persist these
      courses: state.courses,
      enrollments: state.enrollments,
      // ❌ Don't persist temporary state
      // isLoading: state.isLoading,
      // error: state.error,
    }),
  }
)
```

---

## 🚀 Performance Tips

1. **Use Selector Hooks** - Prevent unnecessary re-renders
2. **Debounce User Input** - When triggering queries
3. **Use Query Stale Time** - Reduce unnecessary refetches
4. **Lazy Load Queries** - Use `enabled: false` for conditional fetching
5. **Paginate Large Lists** - Use `useInfiniteQuery` for pagination

---

## 📚 Next Steps

- See `01-architecture-overview.md` for overall architecture
- See `02-monorepo-structure.md` for code organization
- See `04-development-workflow.md` for development guide

---

**Last Updated:** October 10, 2025
**Architecture Version:** 1.0.0
