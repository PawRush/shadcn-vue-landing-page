import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Shadcn/);
  });

  test('should have visible content on the page', async ({ page }) => {
    await page.goto('/');

    // Check if body has content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('should have navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible({ timeout: 10000 });
  });
});
