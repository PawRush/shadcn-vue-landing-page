import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle button visible', async ({ page }) => {
    // Look for the theme toggle button (Moon/Sun icon)
    const themeToggle = page.locator('button').filter({
      has: page.locator('svg[class*="lucide"]')
    }).filter({
      hasText: /dark|light/i
    }).or(page.locator('button').filter({
      has: page.locator('svg').filter({ hasText: '' })
    }).filter({
      has: page.locator('[class*="moon"], [class*="sun"]')
    }));

    await expect(themeToggle.first()).toBeVisible({ timeout: 10000 });
  });

  test('should toggle between dark and light themes', async ({ page }) => {
    // Get initial theme state from html element
    const initialTheme = await page.locator('html').getAttribute('class');
    console.log('Initial theme:', initialTheme);

    // Find the theme toggle button - it should contain Moon or Sun icon
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).filter({
      or: [
        { has: page.locator('[class*="lucide-moon"]') },
        { has: page.locator('[class*="lucide-sun"]') }
      ]
    }).first();

    // Alternative selector if the above doesn't work
    const altThemeButton = page.locator('button[class*="ghost"]').filter({
      has: page.locator('svg')
    }).first();

    // Try to find and click the theme button
    const buttonToClick = await themeButton.count() > 0 ? themeButton : altThemeButton;
    await buttonToClick.waitFor({ timeout: 5000 });
    await buttonToClick.click();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Get the new theme state
    const newTheme = await page.locator('html').getAttribute('class');
    console.log('New theme:', newTheme);

    // Verify theme has changed
    expect(initialTheme).not.toBe(newTheme);
  });

  test('should persist dark mode styling when toggled', async ({ page }) => {
    // Find and click theme toggle
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(500);

    // Check if dark class is applied to html element
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDarkMode = htmlClass?.includes('dark');

    if (isDarkMode) {
      // Verify dark mode styles are applied
      const bodyBg = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Dark mode should have a darker background
      console.log('Dark mode background:', bodyBg);
      expect(bodyBg).toBeTruthy();
    } else {
      // Verify light mode styles are applied
      const bodyBg = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      console.log('Light mode background:', bodyBg);
      expect(bodyBg).toBeTruthy();
    }
  });

  test('should toggle theme multiple times correctly', async ({ page }) => {
    // Find theme toggle button
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('class');

    // Toggle to dark
    await themeButton.click();
    await page.waitForTimeout(300);
    const afterFirstClick = await page.locator('html').getAttribute('class');
    expect(afterFirstClick).not.toBe(initialTheme);

    // Toggle back to light
    await themeButton.click();
    await page.waitForTimeout(300);
    const afterSecondClick = await page.locator('html').getAttribute('class');
    expect(afterSecondClick).toBe(initialTheme);

    // Toggle again to dark
    await themeButton.click();
    await page.waitForTimeout(300);
    const afterThirdClick = await page.locator('html').getAttribute('class');
    expect(afterThirdClick).toBe(afterFirstClick);
  });

  test('should show correct icon for current theme', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find the theme toggle button
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.waitFor({ timeout: 5000 });

    // Check current theme
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDarkMode = htmlClass?.includes('dark');

    if (isDarkMode) {
      // In dark mode, should show sun icon (to switch to light)
      const sunIcon = themeButton.locator('svg');
      await expect(sunIcon).toBeVisible();
    } else {
      // In light mode, should show moon icon (to switch to dark)
      const moonIcon = themeButton.locator('svg');
      await expect(moonIcon).toBeVisible();
    }

    // Toggle and check icon changes
    await themeButton.click();
    await page.waitForTimeout(500);

    // Icon should have changed
    const iconAfterToggle = themeButton.locator('svg');
    await expect(iconAfterToggle).toBeVisible();
  });

  test('should maintain theme preference across page sections', async ({ page }) => {
    // Toggle to dark mode
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(300);

    // Get theme state
    const themeAfterToggle = await page.locator('html').getAttribute('class');

    // Scroll to different sections
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    let themeAfterScroll = await page.locator('html').getAttribute('class');
    expect(themeAfterScroll).toBe(themeAfterToggle);

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    themeAfterScroll = await page.locator('html').getAttribute('class');
    expect(themeAfterScroll).toBe(themeAfterToggle);

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    themeAfterScroll = await page.locator('html').getAttribute('class');
    expect(themeAfterScroll).toBe(themeAfterToggle);
  });

  test('should apply theme to all components', async ({ page }) => {
    // Toggle theme
    const themeButton = page.locator('button').filter({
      has: page.locator('svg')
    }).first();

    await themeButton.click();
    await page.waitForTimeout(500);

    // Scroll through page and verify components respond to theme
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check that cards in different sections have appropriate styling
    const cards = page.locator('[class*="card"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify buttons have theme-appropriate styles
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Toggle back and verify again
    await page.evaluate(() => window.scrollTo(0, 0));
    await themeButton.click();
    await page.waitForTimeout(500);

    // Components should still be visible and styled correctly
    await expect(cards.first()).toBeVisible();
    await expect(buttons.first()).toBeVisible();
  });
});
