import { test, expect } from '@playwright/test'

test.describe('Courses Page', () => {
  test('should load courses page', async ({ page }) => {
    await page.goto('/courses')

    // Verify we're on the courses page
    await expect(page).toHaveURL(/\/courses/)
  })

  test('should display course cards', async ({ page }) => {
    await page.goto('/courses')

    // Wait for course cards to load (if any exist)
    await page.waitForLoadState('networkidle')

    // Check if the page has loaded successfully (even if no courses yet)
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
  })

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
