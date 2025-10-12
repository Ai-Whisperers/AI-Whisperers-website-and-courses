# 24. Component Testing Guide

> **Document Status:** ✅ Complete
> **Last Updated:** October 12, 2025
> **Codebase Phase:** Phase 6 - Testing Infrastructure
> **Related Docs:** [22-testing-infrastructure.md](./22-testing-infrastructure.md), [23-unit-testing.md](./23-unit-testing.md), [25-e2e-testing.md](./25-e2e-testing.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Component Testing Strategy](#2-component-testing-strategy)
3. [React Testing Library](#3-react-testing-library)
4. [Testing UI Components](#4-testing-ui-components)
5. [Testing Components with Context](#5-testing-components-with-context)
6. [Testing User Interactions](#6-testing-user-interactions)
7. [Testing Conditional Rendering](#7-testing-conditional-rendering)
8. [Testing Forms](#8-testing-forms)
9. [Testing Async Components](#9-testing-async-components)
10. [Mocking Strategies](#10-mocking-strategies)
11. [Accessibility Testing](#11-accessibility-testing)
12. [Snapshot Testing](#12-snapshot-testing)
13. [Best Practices](#13-best-practices)
14. [Common Pitfalls](#14-common-pitfalls)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Overview

### What is Component Testing?

**Component testing** verifies that React components render correctly, handle user interactions, and integrate properly with context and state. Unlike unit tests (which test isolated logic), component tests verify the **behavior** and **user experience** of UI components.

### Goals

- ✅ **User-centric** - Test from the user's perspective
- ✅ **Integration** - Test components with their dependencies
- ✅ **Behavior** - Focus on what users see and do
- ✅ **Accessibility** - Ensure components are accessible
- ✅ **Confidence** - Catch UI bugs before production

### Testing Framework

We use **React Testing Library** with Jest:

```javascript
// Package versions
{
  "@testing-library/react": "^16.1.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/user-event": "^14.5.2",
  "jest": "^29.7.0"
}
```

### Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you."
> — Kent C. Dodds, creator of React Testing Library

**Key principles:**
1. Test behavior, not implementation
2. Query by accessible roles and labels
3. Interact like a real user
4. Avoid testing internal state

---

## 2. Component Testing Strategy

### 2.1 What to Test

#### ✅ High-Value Test Targets

1. **Rendering**
   - Component appears with correct content
   - Props affect output correctly
   - Conditional rendering works
   - Dynamic content displays properly

2. **User Interactions**
   - Click handlers fire
   - Form inputs update
   - Keyboard navigation works
   - Focus management

3. **Accessibility**
   - ARIA roles and labels
   - Keyboard accessibility
   - Screen reader compatibility
   - Focus indicators

4. **Integration**
   - Components work with context
   - Props pass correctly to children
   - Event handlers bubble properly

#### ❌ What NOT to Test

- **Internal state** - Test behavior, not implementation
- **CSS styles** - Test presence of classes, not specific styles
- **Third-party components** - Trust their tests
- **Component lifecycle** - Implementation detail

### 2.2 Coverage Target

```javascript
// apps/web/jest.config.js
coverageThreshold: {
  './src/components/**/*.tsx': {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

**Why 50%?**
- Components include complex UI logic
- Visual testing complements component tests
- E2E tests provide additional coverage

---

## 3. React Testing Library

### 3.1 Core Concepts

#### Queries

React Testing Library provides queries to find elements:

```typescript
import { render, screen } from '@testing-library/react'

// ========================================
// PREFERRED: Query by accessible roles/labels
// ========================================
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email address')
screen.getByPlaceholderText('Enter your email')
screen.getByText(/welcome/i)

// ========================================
// BACKUP: Query by test ID (last resort)
// ========================================
screen.getByTestId('submit-button')

// ========================================
// Query Variants
// ========================================
getBy...    // Throws if not found
queryBy...  // Returns null if not found
findBy...   // Async, waits for element
getAllBy... // Returns array, throws if empty
queryAllBy...// Returns empty array if not found
findAllBy...// Async array
```

#### Priority Order

```typescript
// 1. Accessible to everyone (preferred)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Password')
screen.getByPlaceholderText('Search')
screen.getByText('Welcome')

// 2. Semantic queries
screen.getByAltText('Product image')
screen.getByTitle('Close')

// 3. Test IDs (last resort)
screen.getByTestId('custom-element')
```

### 3.2 User Event

Use `@testing-library/user-event` for realistic user interactions:

```typescript
import userEvent from '@testing-library/user-event'

it('handles user interactions', async () => {
  const user = userEvent.setup()

  // Click
  await user.click(screen.getByRole('button'))

  // Type
  await user.type(screen.getByLabelText('Email'), 'test@example.com')

  // Keyboard
  await user.keyboard('{Enter}')
  await user.keyboard('{Tab}')

  // Select
  await user.selectOptions(screen.getByRole('combobox'), 'option1')

  // Hover
  await user.hover(screen.getByRole('button'))

  // Upload file
  await user.upload(screen.getByLabelText('Upload'), file)
})
```

### 3.3 Async Utilities

Wait for async operations:

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

// Wait for element to appear
const element = await screen.findByText('Loaded')

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading'))
```

---

## 4. Testing UI Components

### 4.1 Simple Component: Button

**Source file:** `apps/web/src/components/ui/button.tsx`

**Test file:** `apps/web/src/components/ui/__tests__/button.test.tsx` (182 lines)

```typescript
/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  // ========================================
  // RENDERING
  // ========================================
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('renders with default variant', () => {
      render(<Button>Default Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  // ========================================
  // VARIANTS
  // ========================================
  describe('Variants', () => {
    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('border-input')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary')
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  // ========================================
  // SIZES
  // ========================================
  describe('Sizes', () => {
    it('renders with default size', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('px-4')
    })

    it('renders with small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('px-3')
    })

    it('renders with large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
      expect(button).toHaveClass('px-8')
    })

    it('renders with icon size', () => {
      render(<Button size="icon">🔔</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('w-10')
    })
  })

  // ========================================
  // INTERACTIONS
  // ========================================
  describe('Interactions', () => {
    it('handles onClick events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger onClick when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none')
      expect(button).toHaveClass('disabled:opacity-50')
    })
  })

  // ========================================
  // HTML ATTRIBUTES
  // ========================================
  describe('HTML Attributes', () => {
    it('forwards additional HTML attributes', () => {
      render(
        <Button type="submit" data-testid="submit-button" aria-label="Submit form">
          Submit
        </Button>
      )
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Button</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.textContent).toBe('Button')
    })
  })

  // ========================================
  // ACCESSIBILITY
  // ========================================
  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('has focus-visible ring styles', () => {
      render(<Button>Focus me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
    })
  })

  // ========================================
  // VARIANT COMBINATIONS
  // ========================================
  describe('Variant Combinations', () => {
    it('combines variant and size correctly', () => {
      render(<Button variant="outline" size="lg">Large Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('h-11')
      expect(button).toHaveClass('px-8')
    })

    it('combines variant with custom className', () => {
      render(<Button variant="ghost" className="w-full">Full Width Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
      expect(button).toHaveClass('w-full')
    })
  })
})
```

**Key Testing Patterns:**

1. **Rendering** - Verify component appears with correct content
2. **Variants** - Test all visual variants render correctly
3. **Sizes** - Test all size options apply correct classes
4. **Interactions** - Test click handlers and disabled state
5. **HTML attributes** - Test props are forwarded correctly
6. **Accessibility** - Test ARIA roles and labels
7. **Combinations** - Test multiple props work together

### 4.2 Complex Component: CourseCard

**Source file:** `apps/web/src/components/course/course-card.tsx`

**Test file:** `apps/web/src/components/course/__tests__/course-card.test.tsx` (323 lines)

```typescript
/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CourseCard } from '../course-card'
import type { CourseCardProps } from '../course-card'

// ========================================
// MOCK NEXT.JS LINK
// ========================================
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// ========================================
// MOCK UTILITY FUNCTIONS
// ========================================
jest.mock('@/lib/utils', () => ({
  formatCurrency: (amount: number, currency: string) => `${currency} ${amount}`,
  formatDuration: (minutes: number) => `${minutes} minutes`,
  truncateText: (text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

describe('CourseCard', () => {
  // ========================================
  // MOCK DATA
  // ========================================
  const mockCourse: CourseCardProps['course'] = {
    id: { value: 'course-123' },
    title: 'Introduction to TypeScript',
    description: 'Learn the fundamentals of TypeScript and how to use it effectively in your projects.',
    slug: 'intro-to-typescript',
    price: {
      amount: 49.99,
      currency: 'USD',
      formatted: '$49.99',
    },
    duration: {
      minutes: 180,
      formatted: '3 hours',
    },
    difficulty: 'beginner',
    published: true,
    featured: false,
    learningObjectives: [
      'Understand TypeScript basics',
      'Use TypeScript with React',
      'Configure TypeScript projects',
    ],
    prerequisites: ['Basic JavaScript knowledge'],
    difficultyLevel: 'Beginner',
  }

  // ========================================
  // BASIC RENDERING
  // ========================================
  describe('Basic Rendering', () => {
    it('renders course title', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Introduction to TypeScript')).toBeInTheDocument()
    })

    it('renders course description', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText(/Learn the fundamentals of TypeScript/)).toBeInTheDocument()
    })

    it('renders difficulty badge', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Beginner')).toBeInTheDocument()
    })

    it('renders duration', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('3 hours')).toBeInTheDocument()
    })

    it('renders formatted price', () => {
      render(<CourseCard course={mockCourse} />)
      const prices = screen.getAllByText(/\$49\.99/)
      expect(prices.length).toBeGreaterThan(0)
    })
  })

  // ========================================
  // CONDITIONAL RENDERING
  // ========================================
  describe('Featured Badge', () => {
    it('shows featured badge when course is featured', () => {
      const featuredCourse = { ...mockCourse, featured: true }
      render(<CourseCard course={featuredCourse} />)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('does not show featured badge when course is not featured', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })
  })

  // ========================================
  // DYNAMIC STYLING
  // ========================================
  describe('Difficulty Colors', () => {
    it('applies beginner color', () => {
      const { container } = render(<CourseCard course={mockCourse} />)
      const badge = screen.getByText('Beginner').closest('div')
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })

    it('applies intermediate color', () => {
      const intermediateCourse = {
        ...mockCourse,
        difficulty: 'intermediate',
        difficultyLevel: 'Intermediate'
      }
      const { container } = render(<CourseCard course={intermediateCourse} />)
      const badge = screen.getByText('Intermediate').closest('div')
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })

    it('applies advanced color', () => {
      const advancedCourse = {
        ...mockCourse,
        difficulty: 'advanced',
        difficultyLevel: 'Advanced'
      }
      render(<CourseCard course={advancedCourse} />)
      const badge = screen.getByText('Advanced').closest('div')
      expect(badge).toHaveClass('bg-orange-100')
      expect(badge).toHaveClass('text-orange-800')
    })

    it('applies default color for unknown difficulty', () => {
      const unknownCourse = {
        ...mockCourse,
        difficulty: 'unknown',
        difficultyLevel: 'Unknown'
      }
      render(<CourseCard course={unknownCourse} />)
      const badge = screen.getByText('Unknown').closest('div')
      expect(badge).toHaveClass('bg-gray-100')
      expect(badge).toHaveClass('text-gray-800')
    })
  })

  // ========================================
  // PRICE DISPLAY
  // ========================================
  describe('Price Display', () => {
    it('displays formatted price for paid courses', () => {
      render(<CourseCard course={mockCourse} />)
      const prices = screen.getAllByText(/\$49\.99/)
      expect(prices.length).toBeGreaterThan(0)
    })

    it('displays "Free" for free courses', () => {
      const freeCourse = {
        ...mockCourse,
        price: { amount: 0, currency: 'USD', formatted: '$0.00' },
      }
      render(<CourseCard course={freeCourse} />)
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })

  // ========================================
  // LEARNING OBJECTIVES
  // ========================================
  describe('Learning Objectives', () => {
    it('renders learning objectives section', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText("What you'll learn:")).toBeInTheDocument()
    })

    it('displays first 3 learning objectives', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Understand TypeScript basics')).toBeInTheDocument()
      expect(screen.getByText('Use TypeScript with React')).toBeInTheDocument()
      expect(screen.getByText('Configure TypeScript projects')).toBeInTheDocument()
    })

    it('shows count of additional objectives when more than 3', () => {
      const courseWithMany = {
        ...mockCourse,
        learningObjectives: [
          'Objective 1',
          'Objective 2',
          'Objective 3',
          'Objective 4',
          'Objective 5',
        ],
      }
      render(<CourseCard course={courseWithMany} />)
      expect(screen.getByText('+2 more objectives')).toBeInTheDocument()
    })

    it('does not show objectives section when empty', () => {
      const courseWithoutObjectives = {
        ...mockCourse,
        learningObjectives: [],
      }
      render(<CourseCard course={courseWithoutObjectives} />)
      expect(screen.queryByText("What you'll learn:")).not.toBeInTheDocument()
    })
  })

  // ========================================
  // USER INTERACTIONS
  // ========================================
  describe('Enroll Button', () => {
    it('renders enroll button by default for published courses', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByRole('button', { name: /Enroll for \$49\.99/i })).toBeInTheDocument()
    })

    it('shows "Enroll Free" for free courses', () => {
      const freeCourse = {
        ...mockCourse,
        price: { amount: 0, currency: 'USD', formatted: '$0.00' },
      }
      render(<CourseCard course={freeCourse} />)
      expect(screen.getByRole('button', { name: /Enroll Free/i })).toBeInTheDocument()
    })

    it('does not show enroll button when showEnrollButton is false', () => {
      render(<CourseCard course={mockCourse} showEnrollButton={false} />)
      expect(screen.queryByRole('button', { name: /Enroll/i })).not.toBeInTheDocument()
    })

    it('does not show enroll button for unpublished courses', () => {
      const unpublishedCourse = { ...mockCourse, published: false }
      render(<CourseCard course={unpublishedCourse} />)
      expect(screen.queryByRole('button', { name: /Enroll/i })).not.toBeInTheDocument()
    })

    it('calls onEnroll with course ID when clicked', async () => {
      const handleEnroll = jest.fn()
      const user = userEvent.setup()

      render(<CourseCard course={mockCourse} onEnroll={handleEnroll} />)
      const enrollButton = screen.getByRole('button', { name: /Enroll for/i })

      await user.click(enrollButton)
      expect(handleEnroll).toHaveBeenCalledTimes(1)
      expect(handleEnroll).toHaveBeenCalledWith('course-123')
    })
  })

  // ========================================
  // LINKS
  // ========================================
  describe('Links', () => {
    it('title links to course page', () => {
      render(<CourseCard course={mockCourse} />)
      const titleLink = screen.getByRole('link', { name: 'Introduction to TypeScript' })
      expect(titleLink).toHaveAttribute('href', '/courses/intro-to-typescript')
    })

    it('view details button links to course page', () => {
      render(<CourseCard course={mockCourse} />)
      const detailsLink = screen.getByRole('link', { name: /View Details/i })
      expect(detailsLink).toHaveAttribute('href', '/courses/intro-to-typescript')
    })
  })

  // ========================================
  // EDGE CASES
  // ========================================
  describe('Edge Cases', () => {
    it('handles very long course title', () => {
      const longTitleCourse = {
        ...mockCourse,
        title: 'This is a very long course title that should be truncated or handled appropriately by the component to maintain proper layout and readability',
      }
      render(<CourseCard course={longTitleCourse} />)
      expect(screen.getByText(/This is a very long course title/)).toBeInTheDocument()
    })

    it('handles very long description', () => {
      const longDescCourse = {
        ...mockCourse,
        description: 'A'.repeat(200),
      }
      render(<CourseCard course={longDescCourse} />)
      // Should truncate to 150 chars plus "..."
      expect(screen.getByText(/A+\.\.\./)).toBeInTheDocument()
    })

    it('handles empty prerequisites array', () => {
      const courseWithoutPrereqs = {
        ...mockCourse,
        prerequisites: [],
      }
      render(<CourseCard course={courseWithoutPrereqs} />)
      expect(screen.getByText('Introduction to TypeScript')).toBeInTheDocument()
    })
  })
})
```

**Key Testing Patterns:**

1. **Mock data** - Create reusable test data
2. **Conditional rendering** - Test features that appear/hide based on props
3. **Dynamic styling** - Test classes change based on state
4. **User interactions** - Test event handlers with userEvent
5. **Links** - Verify navigation targets
6. **Edge cases** - Test with extreme inputs

---

## 5. Testing Components with Context

Components often rely on React Context for state, authentication, and configuration. We must provide context in tests.

### 5.1 Example: Navigation Component

**Source file:** `apps/web/src/components/layout/navigation.tsx`

**Test file:** `apps/web/src/components/layout/__tests__/navigation.test.tsx` (411 lines)

```typescript
/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '../navigation'

// ========================================
// MOCK NEXT.JS ROUTER
// ========================================
const mockPathname = '/'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

// ========================================
// MOCK SECURITY CONTEXT
// ========================================
const mockLogout = jest.fn()
const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  canAccessAdmin: jest.fn(() => false),
}

jest.mock('@/contexts/security', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    isAuthenticated: true,
    logout: mockLogout,
  })),
}))

// ========================================
// MOCK I18N
// ========================================
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.services': 'Services',
    'nav.dashboard': 'Dashboard',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
  }
  return translations[key] || key
}

jest.mock('@/lib/i18n/use-translation', () => ({
  useTranslation: () => ({ t: mockT }),
}))

// ========================================
// MOCK LOCALIZED ROUTES
// ========================================
const mockRoutes = {
  public: {
    home: '/',
    courses: '/courses',
    services: '/services',
  },
  auth: {
    signin: '/auth/signin',
  },
  protected: {
    dashboard: '/dashboard',
  },
  admin: {
    dashboard: '/admin',
  },
}

jest.mock('@/hooks/useLocalizedRoutes', () => ({
  useLocalizedRoutes: () => ({ routes: mockRoutes }),
}))

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUser.canAccessAdmin = jest.fn(() => false)
  })

  // ========================================
  // BASIC RENDERING
  // ========================================
  describe('Basic Rendering', () => {
    it('renders navigation header', () => {
      render(<Navigation />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('renders logo with brain icon', () => {
      render(<Navigation />)
      expect(screen.getByTestId('brain-icon')).toBeInTheDocument()
    })

    it('renders "AI Whisperers" branding', () => {
      render(<Navigation />)
      expect(screen.getByText('AI Whisperers')).toBeInTheDocument()
    })

    it('logo links to home page', () => {
      render(<Navigation />)
      const logo = screen.getByText('AI Whisperers').closest('a')
      expect(logo).toHaveAttribute('href', '/')
    })
  })

  // ========================================
  // AUTHENTICATION STATE
  // ========================================
  describe('Authenticated State', () => {
    it('shows dashboard link when authenticated', () => {
      render(<Navigation />)
      const dashboardLinks = screen.getAllByText('Dashboard')
      expect(dashboardLinks.length).toBeGreaterThan(0)
    })

    it('shows sign out button when authenticated', () => {
      render(<Navigation />)
      const signOutButtons = screen.getAllByText('Sign Out')
      expect(signOutButtons.length).toBeGreaterThan(0)
    })

    it('calls logout when sign out is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const signOutButton = screen.getAllByText('Sign Out')[0]
      await user.click(signOutButton)

      expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it('does not show sign in button when authenticated', () => {
      render(<Navigation />)
      const signInLinks = screen.queryAllByText('Sign In')
      expect(signInLinks.length).toBeLessThan(2)
    })
  })

  // ========================================
  // UNAUTHENTICATED STATE
  // ========================================
  describe('Unauthenticated State', () => {
    beforeEach(() => {
      const { useAuth } = require('@/contexts/security')
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      })
    })

    it('shows sign in button when not authenticated', () => {
      render(<Navigation />)
      const signInButtons = screen.getAllByText('Sign In')
      expect(signInButtons.length).toBeGreaterThan(0)
    })

    it('does not show dashboard link when not authenticated', () => {
      render(<Navigation />)
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    })

    it('does not show sign out button when not authenticated', () => {
      render(<Navigation />)
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
    })
  })

  // ========================================
  // ADMIN ACCESS
  // ========================================
  describe('Admin Access', () => {
    beforeEach(() => {
      mockUser.canAccessAdmin = jest.fn(() => true)
      const { useAuth } = require('@/contexts/security')
      useAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: mockLogout,
      })
    })

    it('shows admin link when user can access admin', () => {
      render(<Navigation />)
      const adminLinks = screen.queryAllByText('Admin')
      expect(adminLinks.length).toBeGreaterThan(0)
    })

    it('admin link has correct href', () => {
      render(<Navigation />)
      const adminLinks = screen.queryAllByText('Admin')
      if (adminLinks.length > 0) {
        const adminLink = adminLinks[0].closest('a')
        expect(adminLink).toHaveAttribute('href', '/admin')
      }
    })
  })

  // ========================================
  // MOBILE MENU
  // ========================================
  describe('Mobile Menu', () => {
    it('renders mobile menu toggle button', () => {
      const { container } = render(<Navigation />)
      const mobileMenuButton = screen.getAllByRole('button').find(btn => {
        return btn.querySelector('svg') && btn.className.includes('md:hidden')
      })
      expect(mobileMenuButton).toBeInTheDocument()
    })

    it('opens mobile menu when button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const menuButtons = screen.getAllByRole('button')
      const mobileMenuButton = menuButtons.find(btn =>
        btn.querySelector('svg')
      )

      if (mobileMenuButton) {
        await user.click(mobileMenuButton)

        // Mobile menu should now be visible
        const mobileNav = document.querySelector('.md\\:hidden.border-t')
        expect(mobileNav).toBeInTheDocument()
      }
    })
  })

  // ========================================
  // ACCESSIBILITY
  // ========================================
  describe('Accessibility', () => {
    it('uses semantic header element', () => {
      render(<Navigation />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('uses semantic nav element', () => {
      render(<Navigation />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('all links are keyboard accessible', () => {
      render(<Navigation />)
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toBeInTheDocument()
      })
    })
  })
})
```

**Key Testing Patterns:**

1. **Mock context** - Provide mock implementations of context hooks
2. **Authentication states** - Test with authenticated/unauthenticated users
3. **Role-based access** - Test admin vs. regular user views
4. **State variations** - Test different context state combinations
5. **Event handlers** - Test context methods are called correctly

### 5.2 Creating a Test Wrapper

For complex context needs, create a test wrapper:

```typescript
// test-utils/wrappers.tsx
import React from 'react'
import { RootProvider } from '@/contexts/RootProvider'

export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      {children}
    </RootProvider>
  )
}

// Usage in tests
import { render } from '@testing-library/react'
import { TestWrapper } from '@/test-utils/wrappers'

it('renders with context', () => {
  render(
    <TestWrapper>
      <MyComponent />
    </TestWrapper>
  )
})

// Or create custom render
import { render as rtlRender, RenderOptions } from '@testing-library/react'

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: TestWrapper, ...options })
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
```

---

## 6. Testing User Interactions

### 6.1 Click Events

```typescript
it('handles click events', async () => {
  const handleClick = jest.fn()
  const user = userEvent.setup()

  render(<Button onClick={handleClick}>Click me</Button>)

  await user.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 6.2 Form Inputs

```typescript
it('handles text input', async () => {
  const handleChange = jest.fn()
  const user = userEvent.setup()

  render(<input onChange={handleChange} />)

  await user.type(screen.getByRole('textbox'), 'Hello')

  expect(handleChange).toHaveBeenCalled()
  expect(screen.getByRole('textbox')).toHaveValue('Hello')
})
```

### 6.3 Keyboard Navigation

```typescript
it('navigates with keyboard', async () => {
  const user = userEvent.setup()

  render(
    <>
      <button>First</button>
      <button>Second</button>
    </>
  )

  await user.tab()
  expect(screen.getByText('First')).toHaveFocus()

  await user.tab()
  expect(screen.getByText('Second')).toHaveFocus()
})
```

### 6.4 Select and Dropdown

```typescript
it('selects option from dropdown', async () => {
  const user = userEvent.setup()

  render(
    <select>
      <option value="">Select</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  )

  await user.selectOptions(screen.getByRole('combobox'), '1')

  expect(screen.getByRole('combobox')).toHaveValue('1')
})
```

### 6.5 Hover and Focus

```typescript
it('shows tooltip on hover', async () => {
  const user = userEvent.setup()

  render(
    <div>
      <button data-tooltip="Help text">Hover me</button>
    </div>
  )

  await user.hover(screen.getByRole('button'))

  await waitFor(() => {
    expect(screen.getByText('Help text')).toBeVisible()
  })
})
```

---

## 7. Testing Conditional Rendering

### 7.1 Boolean Props

```typescript
describe('Featured Badge', () => {
  it('shows badge when featured is true', () => {
    render(<CourseCard course={{ ...mockCourse, featured: true }} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('hides badge when featured is false', () => {
    render(<CourseCard course={{ ...mockCourse, featured: false }} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })
})
```

### 7.2 Loading States

```typescript
describe('Loading State', () => {
  it('shows loading spinner when loading', () => {
    render(<DataComponent isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows data when not loading', () => {
    render(<DataComponent isLoading={false} data={mockData} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText(mockData.title)).toBeInTheDocument()
  })
})
```

### 7.3 Error States

```typescript
describe('Error State', () => {
  it('shows error message when error exists', () => {
    render(<DataComponent error="Failed to load" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })

  it('shows retry button on error', async () => {
    const handleRetry = jest.fn()
    const user = userEvent.setup()

    render(<DataComponent error="Failed" onRetry={handleRetry} />)

    await user.click(screen.getByRole('button', { name: /retry/i }))
    expect(handleRetry).toHaveBeenCalled()
  })
})
```

---

## 8. Testing Forms

### 8.1 Form Submission

```typescript
describe('Login Form', () => {
  it('submits form with user credentials', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault())
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(handleSubmit).toHaveBeenCalled()
  })
})
```

### 8.2 Form Validation

```typescript
describe('Form Validation', () => {
  it('shows error for invalid email', async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    await user.type(screen.getByLabelText('Email'), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument()
  })

  it('shows error for empty required field', async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
  })
})
```

### 8.3 Form State

```typescript
describe('Form State', () => {
  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')

    expect(submitButton).toBeEnabled()
  })
})
```

---

## 9. Testing Async Components

### 9.1 Loading Data

```typescript
describe('CourseList', () => {
  it('shows loading state initially', () => {
    render(<CourseList />)
    expect(screen.getByText('Loading courses...')).toBeInTheDocument()
  })

  it('shows courses after loading', async () => {
    render(<CourseList />)

    // Wait for courses to appear
    const course = await screen.findByText('Introduction to TypeScript')
    expect(course).toBeInTheDocument()

    // Loading should be gone
    expect(screen.queryByText('Loading courses...')).not.toBeInTheDocument()
  })
})
```

### 9.2 Error Handling

```typescript
describe('Async Error Handling', () => {
  it('shows error message when fetch fails', async () => {
    // Mock fetch to fail
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed'))

    render(<CourseList />)

    const errorMessage = await screen.findByText(/failed to load courses/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
```

### 9.3 Waiting for Elements

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

it('waits for element to appear', async () => {
  render(<AsyncComponent />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})

it('waits for loading to disappear', async () => {
  render(<AsyncComponent />)

  await waitForElementToBeRemoved(() => screen.queryByText('Loading'))

  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

---

## 10. Mocking Strategies

### 10.1 Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

### 10.2 Next.js Link

```typescript
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})
```

### 10.3 Icons and Assets

```typescript
jest.mock('lucide-react', () => ({
  Brain: ({ className }: { className?: string }) => (
    <span data-testid="brain-icon" className={className} />
  ),
  Menu: () => <span data-testid="menu-icon" />,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))
```

### 10.4 Context and Hooks

```typescript
const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
}

jest.mock('@/contexts/security', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    isAuthenticated: true,
    logout: jest.fn(),
  })),
}))
```

### 10.5 Utility Functions

```typescript
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  formatCurrency: (amount: number) => `$${amount}`,
  formatDate: (date: Date) => date.toISOString(),
}))
```

---

## 11. Accessibility Testing

### 11.1 Semantic HTML

```typescript
describe('Accessibility', () => {
  it('uses semantic header', () => {
    render(<Navigation />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('uses semantic nav', () => {
    render(<Navigation />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('uses button role', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### 11.2 ARIA Labels

```typescript
describe('ARIA Labels', () => {
  it('has aria-label on close button', () => {
    render(<Modal><CloseButton /></Modal>)
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
  })

  it('has aria-labelledby for modal', () => {
    render(<Modal title="Confirm Action" />)
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-labelledby')
  })
})
```

### 11.3 Keyboard Navigation

```typescript
describe('Keyboard Accessibility', () => {
  it('can navigate menu with keyboard', async () => {
    const user = userEvent.setup()

    render(<Dropdown />)

    // Open with Enter
    await user.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toBeVisible()

    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus()

    // Close with Escape
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
```

### 11.4 Focus Management

```typescript
describe('Focus Management', () => {
  it('focuses first input on mount', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Email')).toHaveFocus()
  })

  it('returns focus after modal closes', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <>
        <button>Open Modal</button>
        <Modal isOpen={false} />
      </>
    )

    const openButton = screen.getByRole('button', { name: /open modal/i })
    await user.click(openButton)

    rerender(
      <>
        <button>Open Modal</button>
        <Modal isOpen={true} />
      </>
    )

    await user.click(screen.getByLabelText('Close'))

    expect(openButton).toHaveFocus()
  })
})
```

---

## 12. Snapshot Testing

### 12.1 When to Use Snapshots

✅ **Good use cases:**
- Static components with no logic
- Error messages
- Loading states
- Icon libraries

❌ **Bad use cases:**
- Components with dynamic data
- Components with dates/timestamps
- Large component trees
- Implementation-heavy components

### 12.2 Snapshot Example

```typescript
describe('Button Snapshots', () => {
  it('matches snapshot for default variant', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']

    variants.forEach(variant => {
      const { container } = render(<Button variant={variant as any}>Button</Button>)
      expect(container.firstChild).toMatchSnapshot(`button-${variant}`)
    })
  })
})
```

### 12.3 Updating Snapshots

```bash
# Review changes, then update
pnpm test -- -u

# Update specific file
pnpm test button.test.tsx -- -u
```

---

## 13. Best Practices

### 13.1 Query Priority

✅ **Preferred:**
```typescript
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Search')
screen.getByText('Welcome')
```

❌ **Avoid:**
```typescript
container.querySelector('.submit-button')
screen.getByTestId('submit') // Use only as last resort
```

### 13.2 User-Centric Tests

✅ **Good:**
```typescript
it('allows user to sign in', async () => {
  const user = userEvent.setup()

  render(<LoginForm />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Password'), 'password')
  await user.click(screen.getByRole('button', { name: /sign in/i }))

  expect(await screen.findByText('Welcome back!')).toBeInTheDocument()
})
```

❌ **Bad:**
```typescript
it('calls loginUser function', () => {
  const mockLogin = jest.fn()
  render(<LoginForm onLogin={mockLogin} />)

  // Directly calling internal function - testing implementation
  instance.loginUser('test@example.com', 'password')

  expect(mockLogin).toHaveBeenCalled()
})
```

### 13.3 Async Best Practices

✅ **Good:**
```typescript
it('loads data', async () => {
  render(<DataComponent />)

  // Use findBy for async
  const heading = await screen.findByRole('heading')
  expect(heading).toHaveTextContent('Loaded Data')
})
```

❌ **Bad:**
```typescript
it('loads data', () => {
  render(<DataComponent />)

  // Synchronous query - will fail if data loads async
  expect(screen.getByRole('heading')).toHaveTextContent('Loaded Data')
})
```

### 13.4 Cleanup

```typescript
describe('Component', () => {
  afterEach(() => {
    // React Testing Library auto-cleans, but clean up custom things
    jest.clearAllMocks()
    // Clear timers if used
    jest.clearAllTimers()
  })
})
```

---

## 14. Common Pitfalls

### 14.1 Not Using `act()`

❌ **Problem:**
```typescript
it('updates state', () => {
  const { result } = renderHook(() => useState(0))

  result.current[1](5) // Missing act()!
  // Warning: An update to TestComponent inside a test was not wrapped in act(...)
})
```

✅ **Solution:**
```typescript
it('updates state', () => {
  const { result } = renderHook(() => useState(0))

  act(() => {
    result.current[1](5)
  })

  expect(result.current[0]).toBe(5)
})
```

### 14.2 Testing Implementation Details

❌ **Problem:**
```typescript
it('has correct state', () => {
  const { result } = renderHook(() => useMyHook())
  expect(result.current.internalState).toBe('value') // Testing internals!
})
```

✅ **Solution:**
```typescript
it('displays correct output', () => {
  render(<MyComponent />)
  expect(screen.getByText('Expected Output')).toBeInTheDocument()
})
```

### 14.3 Not Waiting for Async

❌ **Problem:**
```typescript
it('shows data', () => {
  render(<AsyncComponent />)
  expect(screen.getByText('Data')).toBeInTheDocument() // Fails - data not loaded yet!
})
```

✅ **Solution:**
```typescript
it('shows data', async () => {
  render(<AsyncComponent />)
  expect(await screen.findByText('Data')).toBeInTheDocument()
})
```

### 14.4 Querying Incorrectly

❌ **Problem:**
```typescript
// Element might not exist yet
const button = screen.getByRole('button') // Throws immediately!
```

✅ **Solution:**
```typescript
// Check if element exists
const button = screen.queryByRole('button') // Returns null if not found

// Or wait for it
const button = await screen.findByRole('button') // Waits for element
```

---

## 15. Troubleshooting

### 15.1 "Unable to find role"

**Error:**
```
Unable to find an accessible element with the role "button"
```

**Solutions:**
1. Check the component actually renders
2. Verify the role is correct (use `screen.debug()`)
3. Check if element is hidden (`display: none`, `aria-hidden`)
4. Use `screen.logTestingPlaygroundURL()` to get queries

**Debug:**
```typescript
screen.debug() // Print entire DOM
screen.logTestingPlaygroundURL() // Get query suggestions
```

### 15.2 "Found multiple elements"

**Error:**
```
Found multiple elements with the role "button"
```

**Solution:**
```typescript
// Be more specific
screen.getByRole('button', { name: /submit/i })

// Or get all and filter
const buttons = screen.getAllByRole('button')
const submitButton = buttons.find(btn => btn.textContent === 'Submit')
```

### 15.3 "Test was not wrapped in act(...)"

**Error:**
```
Warning: An update to Component inside a test was not wrapped in act(...)
```

**Solutions:**
1. Use `await` with userEvent: `await user.click()`
2. Use `await` with async queries: `await screen.findBy...()`
3. Wrap state updates in `act()`: `act(() => { setState(value) })`

### 15.4 Mocking Issues

**Problem:** Mock not applying

**Solution:**
```typescript
// Place mocks BEFORE imports
jest.mock('next/link', () => ...)

import { MyComponent } from './MyComponent' // This will use the mock
```

---

## Quick Reference

### Common Queries

```typescript
// By Role (preferred)
screen.getByRole('button')
screen.getByRole('textbox')
screen.getByRole('heading', { level: 1 })

// By Label
screen.getByLabelText('Email')

// By Text
screen.getByText('Welcome')
screen.getByText(/welcome/i) // Case insensitive regex

// By Placeholder
screen.getByPlaceholderText('Search...')

// By Test ID (last resort)
screen.getByTestId('custom-element')
```

### User Interactions

```typescript
const user = userEvent.setup()

await user.click(element)
await user.dblClick(element)
await user.type(input, 'text')
await user.clear(input)
await user.selectOptions(select, 'value')
await user.hover(element)
await user.tab()
await user.keyboard('{Enter}')
```

### Assertions

```typescript
// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// Content
expect(element).toHaveTextContent('text')
expect(element).toContainHTML('<span>text</span>')

// Attributes
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')

// Form
expect(input).toHaveValue('value')
expect(input).toBeDisabled()
expect(checkbox).toBeChecked()

// Focus
expect(element).toHaveFocus()
```

### Running Tests

```bash
# All component tests
pnpm test

# Watch mode
pnpm test -- --watch

# Single file
pnpm test button.test.tsx

# Coverage
pnpm test -- --coverage

# Debug
pnpm test -- --no-coverage --verbose
```

---

## Related Documentation

- [22. Testing Infrastructure](./22-testing-infrastructure.md) - Overall testing setup
- [23. Unit Testing](./23-unit-testing.md) - Unit testing guide
- [25. E2E Testing](./25-e2e-testing.md) - Playwright E2E tests
- [26. CI/CD Pipeline](./26-cicd-pipeline.md) - Automated testing

---

**Document Version:** 1.0
**Test Count:** 6 component test files, 100+ component tests
**Coverage Target:** 50% for components
**Maintainer:** AI Whisperers Team
**Next Review:** Phase 7 - Pre-Production
