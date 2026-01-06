import { test, expect } from '@playwright/test';

test.describe('Carousel/Slider Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display testimonials section', async ({ page }) => {
    const testimonials = page.locator('#testimonials');
    await testimonials.scrollIntoViewIfNeeded();
    await expect(testimonials).toBeVisible();
  });

  test('should have testimonial cards', async ({ page }) => {
    const testimonials = page.locator('#testimonials');
    await testimonials.scrollIntoViewIfNeeded();
    
    const cards = testimonials.locator('[class*="card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('should have navigation buttons', async ({ page }) => {
    const testimonials = page.locator('#testimonials');
    await testimonials.scrollIntoViewIfNeeded();
    
    const buttons = testimonials.locator('button');
    expect(await buttons.count()).toBeGreaterThan(0);
  });
});
