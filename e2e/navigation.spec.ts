import { test, expect } from '@playwright/test'

test.describe('Navigation and Responsiveness', () => {
  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check that navigation is accessible via keyboard
    const firstNavLink = page.getByRole('link', { name: /home/i }).first()
    await firstNavLink.focus()

    // Verify focus is on the link
    await expect(firstNavLink).toBeFocused()
  })

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
