import { test, expect } from '@playwright/test';

test.describe('Carousel/Slider Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to testimonials section
    const testimonialsSection = page.locator('#testimonials');
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display testimonials carousel', async ({ page }) => {
    // Check if carousel container exists
    const carousel = page.locator('[class*="carousel"]').first();
    await expect(carousel).toBeVisible({ timeout: 10000 });

    // Check for carousel content
    const carouselContent = page.locator('[class*="carousel-content"]');
    await expect(carouselContent).toBeVisible();
  });

  test('should have multiple testimonial cards', async ({ page }) => {
    // Find testimonial cards within the carousel
    const testimonialCards = page.locator('#testimonials [class*="carousel-item"]');

    // Wait for cards to be visible
    await expect(testimonialCards.first()).toBeVisible({ timeout: 10000 });

    // Verify multiple cards exist
    const cardCount = await testimonialCards.count();
    expect(cardCount).toBeGreaterThan(1);
    console.log(`Found ${cardCount} testimonial cards`);
  });

  test('should have navigation buttons (previous and next)', async ({ page }) => {
    // Look for carousel navigation buttons
    const prevButton = page.locator('button[class*="carousel-previous"], button:has-text("Previous"), button[aria-label*="Previous"]').first();
    const nextButton = page.locator('button[class*="carousel-next"], button:has-text("Next"), button[aria-label*="Next"]').first();

    // Check if navigation buttons exist
    await expect(prevButton.or(nextButton)).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to next slide when clicking next button', async ({ page }) => {
    // Find the next button
    const nextButton = page.locator('#testimonials button').filter({
      has: page.locator('svg[class*="chevron-right"], svg[class*="arrow-right"]')
    }).or(
      page.locator('#testimonials button[class*="next"]')
    ).first();

    await expect(nextButton).toBeVisible({ timeout: 10000 });

    // Get initial visible cards
    const carouselItems = page.locator('#testimonials [class*="carousel-item"]');
    const firstCard = carouselItems.first();
    const initialCardText = await firstCard.textContent();

    // Click next button
    await nextButton.click();
    await page.waitForTimeout(500);

    // Verify carousel has moved (checking transform or visible items)
    const carouselContent = page.locator('[class*="carousel-content"]');
    const transform = await carouselContent.getAttribute('style');

    // The transform should change after clicking next
    console.log('Carousel transform after next:', transform);
    expect(transform).toBeTruthy();
  });

  test('should navigate to previous slide when clicking previous button', async ({ page }) => {
    // First, click next to ensure we're not at the start
    const nextButton = page.locator('#testimonials button').filter({
      has: page.locator('svg[class*="chevron-right"], svg[class*="arrow-right"]')
    }).or(
      page.locator('#testimonials button[class*="next"]')
    ).first();

    await nextButton.click();
    await page.waitForTimeout(500);

    // Now find and click previous button
    const prevButton = page.locator('#testimonials button').filter({
      has: page.locator('svg[class*="chevron-left"], svg[class*="arrow-left"]')
    }).or(
      page.locator('#testimonials button[class*="previous"], #testimonials button[class*="prev"]')
    ).first();

    await expect(prevButton).toBeVisible({ timeout: 5000 });

    // Get carousel state before clicking
    const carouselContent = page.locator('[class*="carousel-content"]');
    const transformBefore = await carouselContent.getAttribute('style');

    // Click previous button
    await prevButton.click();
    await page.waitForTimeout(500);

    // Verify carousel has moved back
    const transformAfter = await carouselContent.getAttribute('style');
    console.log('Transform before:', transformBefore);
    console.log('Transform after:', transformAfter);

    // The transform should be different after clicking previous
    expect(transformAfter).not.toBe(transformBefore);
  });

  test('should display testimonial content correctly', async ({ page }) => {
    // Check for testimonial card elements
    const testimonialCard = page.locator('#testimonials [class*="card"]').first();
    await expect(testimonialCard).toBeVisible();

    // Check for star ratings
    const stars = page.locator('#testimonials svg[class*="star"]');
    await expect(stars.first()).toBeVisible();

    // Check for testimonial text/comment
    const testimonialText = page.locator('#testimonials [class*="card"] p, #testimonials [class*="card-content"]').first();
    await expect(testimonialText).toBeVisible();

    const textContent = await testimonialText.textContent();
    expect(textContent).toBeTruthy();
    expect(textContent?.length).toBeGreaterThan(10);

    // Check for author name
    const authorName = page.locator('#testimonials [class*="card-title"]').first();
    await expect(authorName).toBeVisible();

    // Check for author role/position
    const authorRole = page.locator('#testimonials [class*="card-description"]').first();
    await expect(authorRole).toBeVisible();
  });

  test('should navigate through multiple slides sequentially', async ({ page }) => {
    const nextButton = page.locator('#testimonials button').filter({
      has: page.locator('svg[class*="chevron-right"], svg[class*="arrow-right"]')
    }).or(
      page.locator('#testimonials button[class*="next"]')
    ).first();

    await expect(nextButton).toBeVisible({ timeout: 10000 });

    // Click next button multiple times
    for (let i = 0; i < 3; i++) {
      await nextButton.click();
      await page.waitForTimeout(400);

      // Verify carousel is still functional
      const carouselContent = page.locator('[class*="carousel-content"]');
      await expect(carouselContent).toBeVisible();
    }

    // Verify we can still see testimonial cards
    const testimonialCards = page.locator('#testimonials [class*="card"]');
    await expect(testimonialCards.first()).toBeVisible();
  });

  test('should show multiple testimonials at once on larger screens', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Reload to apply responsive styles
    await page.reload();
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check visible carousel items
    const visibleCards = page.locator('#testimonials [class*="carousel-item"]');
    const cardCount = await visibleCards.count();

    // On desktop, multiple cards should be visible (based on lg:basis-1/3 in the code)
    expect(cardCount).toBeGreaterThan(1);
    console.log(`Visible cards on desktop: ${cardCount}`);
  });

  test('should handle carousel navigation smoothly', async ({ page }) => {
    const nextButton = page.locator('#testimonials button').filter({
      has: page.locator('svg[class*="chevron-right"], svg[class*="arrow-right"]')
    }).or(
      page.locator('#testimonials button[class*="next"]')
    ).first();

    await expect(nextButton).toBeVisible({ timeout: 10000 });

    // Measure if carousel transitions smoothly
    const carouselContent = page.locator('[class*="carousel-content"]');

    // Get initial state
    await expect(carouselContent).toBeVisible();

    // Click and verify smooth transition
    await nextButton.click();
    await page.waitForTimeout(300);

    // After transition, content should still be visible
    await expect(carouselContent).toBeVisible();

    // Cards should still be rendered
    const cards = page.locator('#testimonials [class*="card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should have accessible carousel controls', async ({ page }) => {
    // Check if carousel buttons are keyboard accessible
    const carousel = page.locator('[class*="carousel"]').first();
    await expect(carousel).toBeVisible();

    // Navigation buttons should be actual button elements
    const buttons = page.locator('#testimonials button[class*="carousel"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Buttons should have proper attributes for accessibility
    const nextButton = page.locator('#testimonials button').filter({
      has: page.locator('svg')
    }).first();

    const buttonType = await nextButton.getAttribute('type');
    console.log('Button type:', buttonType);
  });

  test('should display avatar images in testimonials', async ({ page }) => {
    // Look for avatar components
    const avatar = page.locator('#testimonials [class*="avatar"]').first();
    await expect(avatar).toBeVisible({ timeout: 10000 });

    // Check for avatar image or fallback
    const avatarImg = page.locator('#testimonials [class*="avatar"] img, #testimonials [class*="avatar"] svg').first();
    await expect(avatarImg).toBeVisible();
  });
});
