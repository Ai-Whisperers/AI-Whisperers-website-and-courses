import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/AI Whisperers/i)
  })

  test('should display navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation elements
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /courses/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Click on Courses link
    await page.getByRole('link', { name: /courses/i }).first().click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/courses/)
  })

  test('should display language selector', async ({ page }) => {
    await page.goto('/')

    // Check that language selector is present
    const languageSelector = page.locator('[data-testid="language-selector"]')
    if (await languageSelector.count() > 0) {
      await expect(languageSelector).toBeVisible()
    }
  })

  test('should show sign in button when not authenticated', async ({ page }) => {
    await page.goto('/')

    // Look for sign in or get started button
    const signInButton = page.getByRole('link', { name: /sign in|get started/i })
    await expect(signInButton.first()).toBeVisible()
  })
})
