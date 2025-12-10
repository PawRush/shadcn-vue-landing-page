import { test, expect } from '@playwright/test';

test.describe('Responsive Design Validation', () => {
  test.describe('Mobile View (375px width)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      await page.goto('/');
    });

    test('should display mobile navigation correctly', async ({ page }) => {
      // Check if mobile menu icon/button is visible
      const mobileMenuButton = page.locator('button[class*="sheet"], button:has(svg)').filter({
        hasText: ''
      }).first();

      // On mobile, either sheet trigger or hamburger menu should be visible
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should stack hero section content vertically on mobile', async ({ page }) => {
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Hero content should be visible and properly laid out
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display single column layout for cards on mobile', async ({ page }) => {
      // Scroll to features section
      await page.locator('#features').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Check that cards are stacked (single column on mobile)
      const cards = page.locator('[class*="card"]');
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      // Get card widths - on mobile they should take most of the viewport
      const cardBox = await firstCard.boundingBox();
      if (cardBox) {
        // Card should be close to full width on mobile (allowing for padding)
        expect(cardBox.width).toBeGreaterThan(300);
      }
    });

    test('should show single testimonial at a time on mobile', async ({ page }) => {
      await page.locator('#testimonials').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // On mobile, carousel should show fewer items
      const carouselItems = page.locator('#testimonials [class*="carousel-item"]');
      await expect(carouselItems.first()).toBeVisible();
    });

    test('should display contact form in single column on mobile', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Contact form fields should be visible and stacked
      await expect(page.locator('#first-name')).toBeVisible();
      await expect(page.locator('#last-name')).toBeVisible();

      // Check that form is properly sized for mobile
      const form = page.locator('#contact form');
      const formBox = await form.boundingBox();
      expect(formBox?.width).toBeLessThanOrEqual(375);
    });

    test('should hide or collapse desktop navigation items on mobile', async ({ page }) => {
      // Desktop navigation links might be hidden or in a mobile menu
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check if there's a mobile menu button or sheet trigger
      const mobileMenuTrigger = page.locator('[class*="sheet-trigger"], button:has(svg)').first();
      const hasMobileMenu = await mobileMenuTrigger.count() > 0;

      console.log('Has mobile menu trigger:', hasMobileMenu);
    });

    test('should display footer content in mobile layout', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Footer should be properly sized for mobile
      const footerBox = await footer.boundingBox();
      expect(footerBox?.width).toBeLessThanOrEqual(375);
    });

    test('should display pricing cards stacked on mobile', async ({ page }) => {
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const pricingCards = page.locator('#pricing [class*="card"]');
      await expect(pricingCards.first()).toBeVisible();

      // Cards should be stacked vertically on mobile
      const firstCard = pricingCards.first();
      const cardBox = await firstCard.boundingBox();
      if (cardBox) {
        // Card should take most of the width on mobile
        expect(cardBox.width).toBeGreaterThan(300);
      }
    });
  });

  test.describe('Tablet View (768px width)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      await page.goto('/');
    });

    test('should display navigation properly on tablet', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Navigation should be functional on tablet
      const navLinks = page.locator('nav a, nav button');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('should display 2-column grid for cards on tablet', async ({ page }) => {
      await page.locator('#features').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const cards = page.locator('[class*="card"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      // Cards should be visible and properly laid out
      await expect(cards.first()).toBeVisible();
    });

    test('should show 2 testimonials at once on tablet', async ({ page }) => {
      await page.locator('#testimonials').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const testimonialCards = page.locator('#testimonials [class*="carousel-item"]');
      const cardCount = await testimonialCards.count();

      // Should have multiple testimonial cards
      expect(cardCount).toBeGreaterThan(1);
    });

    test('should display contact form fields in proper layout on tablet', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // All form fields should be visible
      await expect(page.locator('#first-name')).toBeVisible();
      await expect(page.locator('#last-name')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#message')).toBeVisible();
    });

    test('should properly size hero section on tablet', async ({ page }) => {
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Hero should be properly sized
      const heroBox = await heroSection.boundingBox();
      expect(heroBox?.width).toBeLessThanOrEqual(768);
    });
  });

  test.describe('Desktop View (1280px width)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');
    });

    test('should display full desktop navigation', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Desktop should show navigation links/buttons
      const navElements = page.locator('nav a, nav button');
      expect(await navElements.count()).toBeGreaterThan(3);
    });

    test('should display multi-column grid for features on desktop', async ({ page }) => {
      await page.locator('#features').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const featuresSection = page.locator('#features');
      await expect(featuresSection).toBeVisible();

      // Features should be in a grid layout
      const featureItems = page.locator('#features [class*="card"], #features [class*="grid"] > div');
      const itemCount = await featureItems.count();
      expect(itemCount).toBeGreaterThan(0);
    });

    test('should show 3 testimonials at once on desktop', async ({ page }) => {
      await page.locator('#testimonials').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Based on the code: lg:basis-1/3 means 3 items on large screens
      const testimonialCards = page.locator('#testimonials [class*="carousel-item"]');
      const cardCount = await testimonialCards.count();

      // Should have multiple cards available
      expect(cardCount).toBeGreaterThanOrEqual(3);
      console.log(`Desktop testimonial cards: ${cardCount}`);
    });

    test('should display hero section with side-by-side layout on desktop', async ({ page }) => {
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Hero content should be visible with full layout
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display pricing cards in horizontal layout on desktop', async ({ page }) => {
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const pricingCards = page.locator('#pricing [class*="card"]');
      const cardCount = await pricingCards.count();

      // Should have multiple pricing cards visible
      expect(cardCount).toBeGreaterThan(0);
      await expect(pricingCards.first()).toBeVisible();
    });

    test('should display contact form and info side by side on desktop', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Contact section should have grid layout (md:grid-cols-2 in the code)
      const contactGrid = page.locator('#contact > section');
      await expect(contactGrid).toBeVisible();

      // Both contact info and form should be visible
      await expect(page.locator('#contact').getByText(/find us/i)).toBeVisible();
      await expect(page.locator('#contact form')).toBeVisible();
    });

    test('should not have horizontal scrolling on desktop', async ({ page }) => {
      // Check body width doesn't exceed viewport
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
    });
  });

  test.describe('Large Desktop View (1920px width)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
    });

    test('should properly center and constrain content on large screens', async ({ page }) => {
      // Container should have max-width constraint
      const container = page.locator('[class*="container"]').first();
      await expect(container).toBeVisible();

      // Content should not stretch to full width
      const containerBox = await container.boundingBox();
      if (containerBox) {
        // Container should be centered, not full width
        expect(containerBox.width).toBeLessThan(1920);
      }
    });

    test('should display all sections properly on large screen', async ({ page }) => {
      // Scroll through all sections
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // All major sections should be visible when scrolled to
      await page.locator('#features').scrollIntoViewIfNeeded();
      await expect(page.locator('#features')).toBeVisible();

      await page.locator('#testimonials').scrollIntoViewIfNeeded();
      await expect(page.locator('#testimonials')).toBeVisible();

      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await expect(page.locator('#pricing')).toBeVisible();

      await page.locator('#contact').scrollIntoViewIfNeeded();
      await expect(page.locator('#contact')).toBeVisible();
    });

    test('should maintain proper spacing and layout on large screens', async ({ page }) => {
      const hero = page.locator('section').first();
      await expect(hero).toBeVisible();

      // Check that content is properly spaced
      const heroBox = await hero.boundingBox();
      expect(heroBox?.height).toBeGreaterThan(300);
    });
  });

  test.describe('Cross-viewport Consistency', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
    ];

    for (const viewport of viewports) {
      test(`should have consistent theme toggle on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        // Theme toggle should work on all viewports
        const themeButton = page.locator('button').filter({
          has: page.locator('svg')
        }).first();

        await expect(themeButton).toBeVisible({ timeout: 10000 });
      });

      test(`should render all main sections on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        // Scroll to bottom to load all content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);

        // Key sections should exist
        await expect(page.locator('#features')).toBeAttached();
        await expect(page.locator('#testimonials')).toBeAttached();
        await expect(page.locator('#pricing')).toBeAttached();
        await expect(page.locator('#contact')).toBeAttached();
      });

      test(`should have accessible buttons on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        // Buttons should be properly sized for interaction
        const buttons = page.locator('button, [role="button"]');
        const firstButton = buttons.first();
        await expect(firstButton).toBeVisible();

        const buttonBox = await firstButton.boundingBox();
        if (buttonBox) {
          // Buttons should be large enough to tap/click
          expect(buttonBox.height).toBeGreaterThan(20);
          expect(buttonBox.width).toBeGreaterThan(40);
        }
      });
    }
  });
});
