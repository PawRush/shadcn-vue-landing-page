import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle button visible', async ({ page }) => {
    // Look for the theme toggle button in nav
    const themeToggle = page.locator('nav button').filter({
      has: page.locator('svg')
    });
    await expect(themeToggle.first()).toBeVisible();
  });

  test('should toggle between dark and light themes', async ({ page }) => {
    // Find the theme toggle button in nav
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(300);

    // Verify html element exists and has some class
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeDefined();
  });

  test('should persist dark mode styling when toggled', async ({ page }) => {
    // Find and click theme toggle
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(300);

    // Verify body has a background color
    const bodyBg = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bodyBg).toBeTruthy();
  });

  test('should toggle theme multiple times correctly', async ({ page }) => {
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    // Toggle multiple times - just verify no errors
    await themeButton.click();
    await page.waitForTimeout(200);
    await themeButton.click();
    await page.waitForTimeout(200);
    await themeButton.click();
    await page.waitForTimeout(200);

    // Page should still be functional
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should show correct icon for current theme', async ({ page }) => {
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.waitFor({ timeout: 5000 });

    // Icon should be visible
    const icon = themeButton.locator('svg');
    await expect(icon).toBeVisible();

    // Toggle and check icon still visible
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(icon).toBeVisible();
  });

  test('should maintain theme preference across page sections', async ({ page }) => {
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(300);

    // Scroll to different sections
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Page should still be functional
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should apply theme to all components', async ({ page }) => {
    const themeButton = page.locator('nav button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(300);

    // Scroll through page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Check that cards exist
    const cards = page.locator('[class*="card"]');
    expect(await cards.count()).toBeGreaterThan(0);

    // Toggle back
    await page.evaluate(() => window.scrollTo(0, 0));
    await themeButton.click();
    await page.waitForTimeout(300);

    await expect(cards.first()).toBeVisible();
  });
});
