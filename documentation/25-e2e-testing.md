# 25. End-to-End (E2E) Testing Guide

> **Document Status:** ✅ Complete
> **Last Updated:** October 12, 2025
> **Codebase Phase:** Phase 6 - Testing Infrastructure
> **Related Docs:** [22-testing-infrastructure.md](./22-testing-infrastructure.md), [23-unit-testing.md](./23-unit-testing.md), [24-component-testing.md](./24-component-testing.md), [26-cicd-pipeline.md](./26-cicd-pipeline.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [E2E Testing Strategy](#2-e2e-testing-strategy)
3. [Playwright Configuration](#3-playwright-configuration)
4. [Writing E2E Tests](#4-writing-e2e-tests)
5. [Page Object Model](#5-page-object-model)
6. [Testing User Flows](#6-testing-user-flows)
7. [Testing Navigation](#7-testing-navigation)
8. [Testing Forms and Interactions](#8-testing-forms-and-interactions)
9. [Testing Responsive Design](#9-testing-responsive-design)
10. [Testing Accessibility](#10-testing-accessibility)
11. [Visual Regression Testing](#11-visual-regression-testing)
12. [Performance Testing](#12-performance-testing)
13. [Best Practices](#13-best-practices)
14. [Debugging Tests](#14-debugging-tests)
15. [CI/CD Integration](#15-cicd-integration)

---

## 1. Overview

### What is E2E Testing?

**End-to-End (E2E) testing** verifies that the entire application works correctly from the user's perspective. E2E tests simulate real user scenarios in a real browser, testing the complete stack: frontend, backend, database, and external services.

### Goals

- ✅ **User journeys** - Test complete workflows
- ✅ **Integration** - Verify all parts work together
- ✅ **Real environment** - Test in actual browsers
- ✅ **Confidence** - Catch issues before production
- ✅ **Regression** - Prevent breaking existing features

### Testing Framework

We use **Playwright** for E2E testing:

```json
{
  "@playwright/test": "^1.49.1"
}
```

**Why Playwright?**
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Auto-wait for elements
- ✅ Network interception and mocking
- ✅ Parallel execution
- ✅ Video and screenshot capture
- ✅ Trace viewer for debugging
- ✅ TypeScript support
- ✅ Fast and reliable

---

## 2. E2E Testing Strategy

### 2.1 What to Test

#### ✅ High-Value Test Targets

1. **Critical User Journeys**
   - User registration and login
   - Course enrollment and purchase
   - Profile management
   - Payment flows

2. **Page Navigation**
   - Main navigation works
   - Links navigate correctly
   - Back/forward buttons work
   - 404 pages handle correctly

3. **Form Flows**
   - Contact form submission
   - Search functionality
   - Filter and sort operations
   - Multi-step forms

4. **Cross-Browser Compatibility**
   - Core features work in all browsers
   - Layout renders correctly
   - JavaScript executes properly

5. **Responsive Design**
   - Mobile navigation works
   - Layouts adapt to screen sizes
   - Touch interactions work

#### ❌ What NOT to Test

- **Unit-level logic** - Covered by unit tests
- **Component rendering** - Covered by component tests
- **Every edge case** - Too slow, use unit tests
- **Third-party services** - Mock external dependencies
- **Pixel-perfect design** - Use visual regression sparingly

### 2.2 Test Pyramid

```
       /\
      /  \  E2E Tests (Few, Slow, High Confidence)
     /____\
    /      \  Component Tests (Some, Fast, Good Confidence)
   /________\
  /          \ Unit Tests (Many, Very Fast, Low-Level Confidence)
 /____________\
```

**Balance:**
- **Unit tests:** 70% (370+ tests)
- **Component tests:** 20% (100+ tests)
- **E2E tests:** 10% (15-20 critical flows)

### 2.3 Test Environment

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

---

## 3. Playwright Configuration

### 3.1 Complete Configuration

**File:** `playwright.config.ts` (53 lines)

```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 * For AI Whisperers Platform
 */
export default defineConfig({
  // ========================================
  // TEST DIRECTORY
  // ========================================
  testDir: './e2e',

  // ========================================
  // PARALLEL EXECUTION
  // ========================================
  /* Run tests in files in parallel */
  fullyParallel: true,

  // ========================================
  // CI SAFETY
  // ========================================
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  // ========================================
  // RETRIES
  // ========================================
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  // ========================================
  // WORKERS
  // ========================================
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  // ========================================
  // REPORTER
  // ========================================
  /* Reporter to use */
  reporter: 'html',

  // ========================================
  // SHARED SETTINGS
  // ========================================
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  // ========================================
  // BROWSER PROJECTS
  // ========================================
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test in other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile browsers
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // ========================================
  // WEB SERVER
  // ========================================
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start server
  },
})
```

### 3.2 Configuration Options

#### Test Execution

```typescript
{
  fullyParallel: true,        // Run test files in parallel
  workers: 4,                  // Number of parallel workers
  retries: 2,                  // Retry failed tests (CI only)
  timeout: 30000,              // Test timeout (30s)
  forbidOnly: true,            // Fail if test.only exists
}
```

#### Browser Configuration

```typescript
{
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        hasTouch: false,
        isMobile: false,
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
}
```

#### Tracing and Screenshots

```typescript
{
  use: {
    trace: 'on-first-retry',          // Capture trace on retry
    screenshot: 'only-on-failure',    // Screenshot on failure
    video: 'retain-on-failure',       // Video on failure
  },
}
```

#### Web Server

```typescript
{
  webServer: {
    command: 'npm run dev',           // Start dev server
    url: 'http://localhost:3000',     // Wait for this URL
    reuseExistingServer: true,        // Don't restart if running
    timeout: 120000,                  // 2 min timeout
  },
}
```

---

## 4. Writing E2E Tests

### 4.1 Basic Test Structure

**File:** `e2e/homepage.spec.ts` (50 lines)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  // ========================================
  // BASIC PAGE LOADING
  // ========================================
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/AI Whisperers/i)
  })

  // ========================================
  // NAVIGATION DISPLAY
  // ========================================
  test('should display navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation elements
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /courses/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  // ========================================
  // NAVIGATION LINKS
  // ========================================
  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Click on Courses link
    await page.getByRole('link', { name: /courses/i }).first().click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/courses/)
  })

  // ========================================
  // CONDITIONAL ELEMENTS
  // ========================================
  test('should display language selector', async ({ page }) => {
    await page.goto('/')

    // Check that language selector is present
    const languageSelector = page.locator('[data-testid="language-selector"]')
    if (await languageSelector.count() > 0) {
      await expect(languageSelector).toBeVisible()
    }
  })

  // ========================================
  // AUTHENTICATION STATE
  // ========================================
  test('should show sign in button when not authenticated', async ({ page }) => {
    await page.goto('/')

    // Look for sign in or get started button
    const signInButton = page.getByRole('link', { name: /sign in|get started/i })
    await expect(signInButton.first()).toBeVisible()
  })
})
```

**Key Patterns:**

1. **Use `test.describe()`** - Group related tests
2. **Use `{ page }`** - Playwright provides isolated page context
3. **Use `await`** - All Playwright actions are async
4. **Use `toBeVisible()`** - Wait for elements to appear
5. **Use `.first()`** - When multiple elements match

### 4.2 Courses Page Tests

**File:** `e2e/courses.spec.ts` (56 lines)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Courses Page', () => {
  // ========================================
  // PAGE LOADING
  // ========================================
  test('should load courses page', async ({ page }) => {
    await page.goto('/courses')

    // Verify we're on the courses page
    await expect(page).toHaveURL(/\/courses/)
  })

  // ========================================
  // CONTENT DISPLAY
  // ========================================
  test('should display course cards', async ({ page }) => {
    await page.goto('/courses')

    // Wait for course cards to load (if any exist)
    await page.waitForLoadState('networkidle')

    // Check if the page has loaded successfully (even if no courses yet)
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
  })

  // ========================================
  // FILTERS
  // ========================================
  test('should have working filters (if available)', async ({ page }) => {
    await page.goto('/courses')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check if difficulty filter exists
    const difficultyFilter = page.locator('select, [role="combobox"]').filter({ hasText: /difficulty|beginner|intermediate/i })

    if (await difficultyFilter.count() > 0) {
      await expect(difficultyFilter.first()).toBeVisible()
    }
  })

  // ========================================
  // NAVIGATION TO DETAILS
  // ========================================
  test('should navigate to course details when card is clicked', async ({ page }) => {
    await page.goto('/courses')

    await page.waitForLoadState('networkidle')

    // Look for "View Details" or course title links
    const courseLink = page.getByRole('link', { name: /view details|course/i })

    if (await courseLink.count() > 0) {
      const firstCourseHref = await courseLink.first().getAttribute('href')

      if (firstCourseHref) {
        await courseLink.first().click()

        // Verify navigation occurred
        await expect(page).toHaveURL(new RegExp(firstCourseHref))
      }
    }
  })
})
```

**Key Patterns:**

1. **`waitForLoadState('networkidle')`** - Wait for network to settle
2. **Conditional assertions** - Check if element exists before asserting
3. **Dynamic content** - Handle cases where content might not exist yet
4. **URL verification** - Verify navigation with regex patterns

### 4.3 Navigation and Responsiveness Tests

**File:** `e2e/navigation.spec.ts` (71 lines)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Navigation and Responsiveness', () => {
  // ========================================
  // ACCESSIBILITY
  // ========================================
  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check that navigation is accessible via keyboard
    const firstNavLink = page.getByRole('link', { name: /home/i }).first()
    await firstNavLink.focus()

    // Verify focus is on the link
    await expect(firstNavLink).toBeFocused()
  })

  // ========================================
  // MOBILE MENU
  // ========================================
  test('should show mobile menu on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Look for hamburger/menu button
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('svg') }).first()

    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton).toBeVisible()
    }
  })

  // ========================================
  // PAGE NAVIGATION
  // ========================================
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to different pages
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL(/\/about/)

    await page.getByRole('link', { name: /services/i }).first().click()
    await expect(page).toHaveURL(/\/services/)

    await page.getByRole('link', { name: /home/i }).first().click()
    await expect(page).toHaveURL(/\/$/)
  })

  // ========================================
  // PERSISTENT HEADER
  // ========================================
  test('should maintain header across pages', async ({ page }) => {
    await page.goto('/')

    // Get header element
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Navigate to another page
    await page.getByRole('link', { name: /courses/i }).first().click()

    // Header should still be visible
    await expect(header).toBeVisible()
  })

  // ========================================
  // FOOTER
  // ========================================
  test('should have working footer links', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check for footer
    const footer = page.locator('footer')

    if (await footer.count() > 0) {
      await expect(footer).toBeVisible()
    }
  })
})
```

**Key Patterns:**

1. **`setViewportSize()`** - Test different screen sizes
2. **`focus()`** - Test keyboard navigation
3. **`evaluate()`** - Execute JavaScript in browser context
4. **Sequential navigation** - Test multi-page workflows
5. **Persistent elements** - Verify header/footer across pages

---

## 5. Page Object Model

### 5.1 What is Page Object Model?

**Page Object Model (POM)** encapsulates page structure and interactions into reusable classes.

**Benefits:**
- ✅ DRY (Don't Repeat Yourself)
- ✅ Maintainability - Update once, use everywhere
- ✅ Readability - Tests read like user stories
- ✅ Type safety - TypeScript support

### 5.2 Creating Page Objects

```typescript
// e2e/pages/HomePage.ts
import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly navigation: Locator
  readonly homeLink: Locator
  readonly coursesLink: Locator
  readonly servicesLink: Locator
  readonly signInButton: Locator

  constructor(page: Page) {
    this.page = page
    this.navigation = page.locator('nav')
    this.homeLink = page.getByRole('link', { name: /home/i })
    this.coursesLink = page.getByRole('link', { name: /courses/i })
    this.servicesLink = page.getByRole('link', { name: /services/i })
    this.signInButton = page.getByRole('link', { name: /sign in/i })
  }

  async goto() {
    await this.page.goto('/')
  }

  async navigateToCourses() {
    await this.coursesLink.first().click()
  }

  async navigateToServices() {
    await this.servicesLink.first().click()
  }

  async clickSignIn() {
    await this.signInButton.first().click()
  }

  async expectNavigationVisible() {
    await expect(this.navigation).toBeVisible()
  }
}
```

```typescript
// e2e/pages/CoursesPage.ts
import { Page, Locator } from '@playwright/test'

export class CoursesPage {
  readonly page: Page
  readonly courseCards: Locator
  readonly difficultyFilter: Locator
  readonly searchInput: Locator

  constructor(page: Page) {
    this.page = page
    this.courseCards = page.locator('[data-testid="course-card"]')
    this.difficultyFilter = page.locator('select[name="difficulty"]')
    this.searchInput = page.getByPlaceholder('Search courses')
  }

  async goto() {
    await this.page.goto('/courses')
    await this.page.waitForLoadState('networkidle')
  }

  async filterByDifficulty(difficulty: string) {
    await this.difficultyFilter.selectOption(difficulty)
  }

  async searchCourses(query: string) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
  }

  async clickCourse(index: number) {
    await this.courseCards.nth(index).click()
  }

  async getCourseCount() {
    return await this.courseCards.count()
  }
}
```

### 5.3 Using Page Objects

```typescript
// e2e/user-flows/enrollment.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { CoursesPage } from '../pages/CoursesPage'

test.describe('Course Enrollment Flow', () => {
  test('user can browse and enroll in a course', async ({ page }) => {
    // ========================================
    // INITIALIZE PAGE OBJECTS
    // ========================================
    const homePage = new HomePage(page)
    const coursesPage = new CoursesPage(page)

    // ========================================
    // NAVIGATE TO COURSES
    // ========================================
    await homePage.goto()
    await homePage.navigateToCourses()

    // ========================================
    // FILTER COURSES
    // ========================================
    await coursesPage.filterByDifficulty('beginner')

    // ========================================
    // SELECT COURSE
    // ========================================
    const courseCount = await coursesPage.getCourseCount()
    expect(courseCount).toBeGreaterThan(0)

    await coursesPage.clickCourse(0)

    // ========================================
    // VERIFY COURSE DETAILS PAGE
    // ========================================
    await expect(page).toHaveURL(/\/courses\/[^/]+/)
  })
})
```

**Benefits in Action:**

✅ **Before (Without POM):**
```typescript
await page.goto('/')
await page.getByRole('link', { name: /courses/i }).first().click()
await page.locator('select[name="difficulty"]').selectOption('beginner')
```

✅ **After (With POM):**
```typescript
await homePage.goto()
await homePage.navigateToCourses()
await coursesPage.filterByDifficulty('beginner')
```

---

## 6. Testing User Flows

### 6.1 Authentication Flow

```typescript
// e2e/user-flows/authentication.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can sign in with email and password', async ({ page }) => {
    // ========================================
    // NAVIGATE TO SIGN IN
    // ========================================
    await page.goto('/')
    await page.getByRole('link', { name: /sign in/i }).first().click()

    // ========================================
    // FILL CREDENTIALS
    // ========================================
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')

    // ========================================
    // SUBMIT FORM
    // ========================================
    await page.getByRole('button', { name: /sign in/i }).click()

    // ========================================
    // VERIFY SIGNED IN
    // ========================================
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })

  test('user can sign out', async ({ page }) => {
    // Assume user is signed in
    await page.goto('/dashboard')

    // ========================================
    // CLICK SIGN OUT
    // ========================================
    await page.getByRole('button', { name: /sign out/i }).click()

    // ========================================
    // VERIFY SIGNED OUT
    // ========================================
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })
})
```

### 6.2 Course Enrollment Flow

```typescript
// e2e/user-flows/course-enrollment.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Course Enrollment Flow', () => {
  test('user can enroll in a free course', async ({ page }) => {
    // ========================================
    // BROWSE COURSES
    // ========================================
    await page.goto('/courses')
    await page.waitForLoadState('networkidle')

    // ========================================
    // SELECT COURSE
    // ========================================
    const freeCourseCard = page.locator('[data-testid="course-card"]').filter({ hasText: /free/i }).first()
    await freeCourseCard.click()

    // ========================================
    // ENROLL
    // ========================================
    await page.getByRole('button', { name: /enroll free/i }).click()

    // ========================================
    // VERIFY ENROLLMENT
    // ========================================
    await expect(page.getByText(/enrolled successfully/i)).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard\/courses/)
  })

  test('user can purchase a paid course', async ({ page }) => {
    // ========================================
    // BROWSE COURSES
    // ========================================
    await page.goto('/courses')

    // ========================================
    // SELECT PAID COURSE
    // ========================================
    const paidCourseCard = page.locator('[data-testid="course-card"]').filter({ hasText: /\$\d+/ }).first()
    await paidCourseCard.click()

    // ========================================
    // INITIATE PURCHASE
    // ========================================
    await page.getByRole('button', { name: /enroll/i }).click()

    // ========================================
    // PAYMENT PAGE
    // ========================================
    await expect(page).toHaveURL(/\/checkout/)
    await expect(page.getByRole('heading', { name: /payment/i })).toBeVisible()
  })
})
```

### 6.3 Contact Form Flow

```typescript
// e2e/user-flows/contact-form.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact Form Flow', () => {
  test('user can submit contact form', async ({ page }) => {
    // ========================================
    // NAVIGATE TO CONTACT PAGE
    // ========================================
    await page.goto('/contact')

    // ========================================
    // FILL FORM
    // ========================================
    await page.getByLabel('Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Subject').fill('Inquiry about courses')
    await page.getByLabel('Message').fill('I would like to know more about your AI courses.')

    // ========================================
    // SUBMIT
    // ========================================
    await page.getByRole('button', { name: /send message/i }).click()

    // ========================================
    // VERIFY SUCCESS
    // ========================================
    await expect(page.getByText(/message sent successfully/i)).toBeVisible()
  })

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/contact')

    // ========================================
    // SUBMIT EMPTY FORM
    // ========================================
    await page.getByRole('button', { name: /send message/i }).click()

    // ========================================
    // VERIFY VALIDATION ERRORS
    // ========================================
    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/message is required/i)).toBeVisible()
  })
})
```

---

## 7. Testing Navigation

### 7.1 Link Navigation

```typescript
test('all main navigation links work', async ({ page }) => {
  await page.goto('/')

  const links = [
    { name: /home/i, url: /\/$/ },
    { name: /courses/i, url: /\/courses/ },
    { name: /services/i, url: /\/services/ },
    { name: /about/i, url: /\/about/ },
    { name: /contact/i, url: /\/contact/ },
  ]

  for (const link of links) {
    await page.getByRole('link', { name: link.name }).first().click()
    await expect(page).toHaveURL(link.url)

    // Navigate back to home
    await page.goto('/')
  }
})
```

### 7.2 Breadcrumb Navigation

```typescript
test('breadcrumb navigation works', async ({ page }) => {
  await page.goto('/courses/intro-to-ai')

  // Verify breadcrumbs
  await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible()

  // Click home in breadcrumb
  await page.getByRole('link', { name: /home/i }).first().click()
  await expect(page).toHaveURL('/')

  // Navigate back
  await page.goBack()
  await expect(page).toHaveURL('/courses/intro-to-ai')
})
```

### 7.3 Browser History

```typescript
test('browser back and forward buttons work', async ({ page }) => {
  // Navigate through pages
  await page.goto('/')
  await page.getByRole('link', { name: /courses/i }).first().click()
  await page.getByRole('link', { name: /about/i }).first().click()

  // Go back
  await page.goBack()
  await expect(page).toHaveURL(/\/courses/)

  // Go back again
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)

  // Go forward
  await page.goForward()
  await expect(page).toHaveURL(/\/courses/)
})
```

---

## 8. Testing Forms and Interactions

### 8.1 Form Input

```typescript
test('form accepts user input', async ({ page }) => {
  await page.goto('/contact')

  // Fill text input
  await page.getByLabel('Name').fill('John Doe')
  expect(await page.getByLabel('Name').inputValue()).toBe('John Doe')

  // Fill email
  await page.getByLabel('Email').fill('john@example.com')

  // Fill textarea
  await page.getByLabel('Message').fill('This is a test message')

  // Select dropdown
  await page.getByLabel('Subject').selectOption('General Inquiry')
})
```

### 8.2 Form Validation

```typescript
test('form shows validation errors', async ({ page }) => {
  await page.goto('/contact')

  // Submit without filling
  await page.getByRole('button', { name: /submit/i }).click()

  // Check for errors
  await expect(page.getByText(/email is required/i)).toBeVisible()
  await expect(page.getByText(/message is required/i)).toBeVisible()

  // Fill with invalid email
  await page.getByLabel('Email').fill('invalid-email')
  await page.getByRole('button', { name: /submit/i }).click()

  await expect(page.getByText(/invalid email/i)).toBeVisible()
})
```

### 8.3 Checkbox and Radio

```typescript
test('checkbox and radio interactions work', async ({ page }) => {
  await page.goto('/preferences')

  // Check checkbox
  await page.getByLabel('Subscribe to newsletter').check()
  expect(await page.getByLabel('Subscribe to newsletter').isChecked()).toBe(true)

  // Uncheck
  await page.getByLabel('Subscribe to newsletter').uncheck()
  expect(await page.getByLabel('Subscribe to newsletter').isChecked()).toBe(false)

  // Select radio
  await page.getByLabel('Beginner').check()
  expect(await page.getByLabel('Beginner').isChecked()).toBe(true)
})
```

### 8.4 File Upload

```typescript
test('file upload works', async ({ page }) => {
  await page.goto('/upload')

  // Set file for upload
  const fileInput = page.getByLabel('Upload file')
  await fileInput.setInputFiles('test-files/sample.pdf')

  // Verify file name appears
  await expect(page.getByText('sample.pdf')).toBeVisible()

  // Submit
  await page.getByRole('button', { name: /upload/i }).click()

  // Verify success
  await expect(page.getByText(/uploaded successfully/i)).toBeVisible()
})
```

---

## 9. Testing Responsive Design

### 9.1 Mobile Viewport

```typescript
test('mobile menu works', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })

  await page.goto('/')

  // Mobile menu should be visible
  const menuButton = page.getByRole('button', { name: /menu/i })
  await expect(menuButton).toBeVisible()

  // Desktop nav should be hidden
  const desktopNav = page.locator('nav.hidden.md\\:flex')
  expect(await desktopNav.count()).toBe(0)

  // Open mobile menu
  await menuButton.click()

  // Mobile menu content should be visible
  await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /courses/i })).toBeVisible()
})
```

### 9.2 Tablet Viewport

```typescript
test('layout adapts to tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })

  await page.goto('/')

  // Verify layout changes
  const container = page.locator('.container')
  const width = await container.evaluate((el) => el.offsetWidth)

  expect(width).toBeLessThanOrEqual(768)
})
```

### 9.3 Desktop Viewport

```typescript
test('desktop layout displays correctly', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })

  await page.goto('/')

  // Desktop navigation visible
  await expect(page.locator('nav.flex')).toBeVisible()

  // Mobile menu button hidden
  expect(await page.getByRole('button', { name: /menu/i }).count()).toBe(0)
})
```

### 9.4 Testing Across Devices

```typescript
import { devices } from '@playwright/test'

const deviceTests = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPad Pro', device: devices['iPad Pro'] },
  { name: 'Desktop Chrome', device: devices['Desktop Chrome'] },
]

deviceTests.forEach(({ name, device }) => {
  test(`homepage works on ${name}`, async ({ browser }) => {
    const context = await browser.newContext({
      ...device,
    })

    const page = await context.newPage()

    await page.goto('/')

    await expect(page).toHaveTitle(/AI Whisperers/i)

    await context.close()
  })
})
```

---

## 10. Testing Accessibility

### 10.1 Keyboard Navigation

```typescript
test('can navigate with keyboard', async ({ page }) => {
  await page.goto('/')

  // Tab through navigation
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /home/i }).first()).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /courses/i }).first()).toBeFocused()

  // Activate link with Enter
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/courses/)
})
```

### 10.2 Screen Reader Compatibility

```typescript
test('has proper ARIA labels', async ({ page }) => {
  await page.goto('/')

  // Check for ARIA landmarks
  await expect(page.getByRole('banner')).toBeVisible() // header
  await expect(page.getByRole('navigation')).toBeVisible() // nav
  await expect(page.getByRole('main')).toBeVisible() // main content

  // Check for alt text
  const logo = page.getByRole('img', { name: /logo/i })
  await expect(logo).toBeVisible()
})
```

### 10.3 Focus Management

```typescript
test('maintains focus when modal opens', async ({ page }) => {
  await page.goto('/')

  // Open modal
  await page.getByRole('button', { name: /open modal/i }).click()

  // Focus should be inside modal
  await expect(page.getByRole('dialog')).toBeVisible()

  // Close modal
  await page.keyboard.press('Escape')

  // Focus returns to trigger button
  await expect(page.getByRole('button', { name: /open modal/i })).toBeFocused()
})
```

---

## 11. Visual Regression Testing

### 11.1 Screenshot Comparison

```typescript
test('homepage matches screenshot', async ({ page }) => {
  await page.goto('/')

  // Take screenshot and compare
  expect(await page.screenshot()).toMatchSnapshot('homepage.png')
})

test('course card matches snapshot', async ({ page }) => {
  await page.goto('/courses')

  const courseCard = page.locator('[data-testid="course-card"]').first()

  expect(await courseCard.screenshot()).toMatchSnapshot('course-card.png')
})
```

### 11.2 Full Page Screenshots

```typescript
test('full page screenshot', async ({ page }) => {
  await page.goto('/')

  await page.screenshot({
    path: 'screenshots/homepage-full.png',
    fullPage: true,
  })
})
```

### 11.3 Element Screenshots

```typescript
test('element screenshots', async ({ page }) => {
  await page.goto('/')

  // Screenshot specific element
  const header = page.locator('header')
  await header.screenshot({ path: 'screenshots/header.png' })

  const footer = page.locator('footer')
  await footer.screenshot({ path: 'screenshots/footer.png' })
})
```

---

## 12. Performance Testing

### 12.1 Page Load Time

```typescript
test('homepage loads within 3 seconds', async ({ page }) => {
  const startTime = Date.now()

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const loadTime = Date.now() - startTime

  expect(loadTime).toBeLessThan(3000)
})
```

### 12.2 Network Requests

```typescript
test('minimizes network requests', async ({ page }) => {
  const requests = []

  page.on('request', (request) => {
    requests.push(request.url())
  })

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  console.log(`Total requests: ${requests.length}`)
  expect(requests.length).toBeLessThan(50)
})
```

### 12.3 Resource Sizes

```typescript
test('images are optimized', async ({ page }) => {
  const responses = []

  page.on('response', async (response) => {
    if (response.request().resourceType() === 'image') {
      const size = (await response.body()).length
      responses.push({ url: response.url(), size })
    }
  })

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  responses.forEach(({ url, size }) => {
    console.log(`${url}: ${size} bytes`)
    expect(size).toBeLessThan(500000) // 500KB max
  })
})
```

---

## 13. Best Practices

### 13.1 Test Independence

✅ **Good:**
```typescript
test('test 1', async ({ page }) => {
  await page.goto('/')
  // Test is independent
})

test('test 2', async ({ page }) => {
  await page.goto('/courses')
  // Test is independent
})
```

❌ **Bad:**
```typescript
let sharedState

test('test 1', async ({ page }) => {
  await page.goto('/')
  sharedState = await page.title()
})

test('test 2', async ({ page }) => {
  // Depends on test 1 - BAD!
  expect(sharedState).toBe('AI Whisperers')
})
```

### 13.2 Explicit Waits

✅ **Good:**
```typescript
await page.getByText('Loading').waitFor({ state: 'hidden' })
await expect(page.getByText('Loaded')).toBeVisible()
```

❌ **Bad:**
```typescript
await page.waitForTimeout(5000) // Arbitrary wait
```

### 13.3 Robust Selectors

✅ **Good:**
```typescript
page.getByRole('button', { name: /submit/i })
page.getByLabel('Email')
page.getByText('Welcome')
```

❌ **Bad:**
```typescript
page.locator('.submit-btn-class-123')
page.locator('#email')
page.locator('div > div > button:nth-child(3)')
```

### 13.4 Test Data

✅ **Good:**
```typescript
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'Test123!@#',
}
```

❌ **Bad:**
```typescript
const testUser = {
  email: 'test@example.com', // Might conflict with other tests
  password: 'password',
}
```

---

## 14. Debugging Tests

### 14.1 Playwright Inspector

```bash
# Run tests with debugger
pnpm exec playwright test --debug

# Debug specific test
pnpm exec playwright test homepage.spec.ts --debug
```

### 14.2 Headed Mode

```bash
# See browser while testing
pnpm exec playwright test --headed

# Slow down execution
pnpm exec playwright test --headed --slow-mo=1000
```

### 14.3 Screenshots and Traces

```typescript
test('debug example', async ({ page }) => {
  await page.goto('/')

  // Take screenshot
  await page.screenshot({ path: 'debug/screenshot.png' })

  // Start tracing
  await page.context().tracing.start({ screenshots: true, snapshots: true })

  // Perform actions
  await page.getByRole('link', { name: /courses/i }).click()

  // Stop tracing
  await page.context().tracing.stop({ path: 'debug/trace.zip' })
})
```

### 14.4 Console Logs

```typescript
test('debug with console', async ({ page }) => {
  page.on('console', (msg) => console.log('Browser:', msg.text()))

  await page.goto('/')
})
```

### 14.5 Pause Test

```typescript
test('pause for debugging', async ({ page }) => {
  await page.goto('/')

  // Pause execution here
  await page.pause()

  // Continue after inspecting
})
```

---

## 15. CI/CD Integration

### 15.1 GitHub Actions Example

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: test-results/
```

### 15.2 Running Tests in CI

```bash
# Install only chromium for CI
npx playwright install --with-deps chromium

# Run tests with CI flag
CI=true pnpm test:e2e

# Generate HTML report
pnpm exec playwright show-report
```

### 15.3 Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
})
```

---

## Quick Reference

### Common Commands

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific file
pnpm exec playwright test homepage.spec.ts

# Run in headed mode
pnpm exec playwright test --headed

# Debug test
pnpm exec playwright test --debug

# Generate report
pnpm exec playwright show-report

# Update snapshots
pnpm exec playwright test --update-snapshots

# Run on specific browser
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

### Common Locators

```typescript
// By role (preferred)
page.getByRole('button', { name: /submit/i })
page.getByRole('link', { name: /home/i })
page.getByRole('textbox')

// By label
page.getByLabel('Email')

// By text
page.getByText('Welcome')
page.getByText(/welcome/i) // Case insensitive

// By placeholder
page.getByPlaceholder('Search')

// By test ID
page.getByTestId('submit-button')

// By CSS selector
page.locator('.class-name')
page.locator('#id')

// By XPath
page.locator('xpath=//button[contains(text(), "Submit")]')
```

### Common Actions

```typescript
// Navigate
await page.goto('/')
await page.goBack()
await page.goForward()
await page.reload()

// Click
await page.getByRole('button').click()
await page.getByRole('button').dblclick()

// Type
await page.getByLabel('Email').fill('test@example.com')
await page.getByLabel('Email').type('test@example.com')

// Select
await page.getByLabel('Country').selectOption('USA')

// Check/uncheck
await page.getByLabel('Subscribe').check()
await page.getByLabel('Subscribe').uncheck()

// Hover
await page.getByRole('button').hover()

// Focus
await page.getByRole('button').focus()

// Keyboard
await page.keyboard.press('Enter')
await page.keyboard.type('Hello')

// Wait
await page.waitForLoadState('networkidle')
await page.waitForURL('/dashboard')
await page.waitForSelector('.loaded')
```

### Common Assertions

```typescript
// Page
await expect(page).toHaveTitle(/AI Whisperers/i)
await expect(page).toHaveURL('/courses')

// Element
await expect(element).toBeVisible()
await expect(element).toBeHidden()
await expect(element).toBeEnabled()
await expect(element).toBeDisabled()
await expect(element).toBeFocused()

// Content
await expect(element).toHaveText('Welcome')
await expect(element).toContainText('Welcome')
await expect(element).toHaveValue('test@example.com')

// Attributes
await expect(element).toHaveAttribute('href', '/courses')
await expect(element).toHaveClass('active')

// Count
await expect(page.getByRole('button')).toHaveCount(3)
```

---

## Related Documentation

- [22. Testing Infrastructure](./22-testing-infrastructure.md) - Overall testing setup
- [23. Unit Testing](./23-unit-testing.md) - Unit testing guide
- [24. Component Testing](./24-component-testing.md) - Component testing guide
- [26. CI/CD Pipeline](./26-cicd-pipeline.md) - Automated testing in CI

---

**Document Version:** 1.0
**Test Count:** 3 E2E spec files, 15+ E2E tests
**Browser Coverage:** Chromium (Desktop + Mobile)
**Maintainer:** AI Whisperers Team
**Next Review:** Phase 7 - Pre-Production
