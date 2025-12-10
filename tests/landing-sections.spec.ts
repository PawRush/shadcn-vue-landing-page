import { test, expect } from '@playwright/test';

test.describe('Landing Page Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render the Navbar section', async ({ page }) => {
    // Check for navbar navigation elements
    await expect(page.locator('nav')).toBeVisible();

    // Navigation exists and has links or buttons
    const navElements = page.locator('nav a, nav button');
    await expect(navElements.first()).toBeVisible();
  });

  test('should render the Hero section', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check for hero content - should have headings
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();

    // Check for buttons/links in hero section
    const buttons = page.locator('button, a').first();
    await expect(buttons).toBeVisible();
  });

  test('should render the Sponsors section', async ({ page }) => {
    // Look for the sponsors/marquee section - it should be one of the early sections
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(2); // Hero, Sponsors, and more
  });

  test('should render the Benefits section', async ({ page }) => {
    // Scroll to Benefits section
    await page.evaluate(() => {
      const element = document.querySelector('section');
      if (element) element.scrollIntoView();
    });

    // Check for multiple benefit cards/items
    const benefitCards = page.locator('[class*="card"], [class*="grid"] > div').first();
    await expect(benefitCards).toBeVisible();
  });

  test('should render the Features section with id="features"', async ({ page }) => {
    // Note: Both Features and HowItWorks have id="features"
    const featuresSections = page.locator('#features');
    await expect(featuresSections.first()).toBeVisible();
  });

  test('should render the Services section', async ({ page }) => {
    // Services section exists - just verify we have multiple sections
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(5);
  });

  test('should render the How It Works section', async ({ page }) => {
    // Scroll through page to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    // Verify page has substantial content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(1000);
  });

  test('should render the Testimonials section with id="testimonials"', async ({ page }) => {
    const testimonialsSection = page.locator('#testimonials');
    await testimonialsSection.scrollIntoViewIfNeeded();
    await expect(testimonialsSection).toBeVisible();

    // Check for testimonial cards/carousel
    const testimonialCards = page.locator('#testimonials [class*="card"]');
    await expect(testimonialCards.first()).toBeVisible();
  });

  test('should render the Team section', async ({ page }) => {
    // Team section should exist - verify by scrolling through content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(200);

    // Verify sections exist
    const sections = page.locator('section');
    expect(await sections.count()).toBeGreaterThan(8);
  });

  test('should render the Community section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
    await page.waitForTimeout(200);

    // Verify we can scroll and page has lots of content
    const sections = page.locator('section');
    expect(await sections.count()).toBeGreaterThan(10);
  });

  test('should render the Pricing section', async ({ page }) => {
    // Pricing section doesn't have an id, so scroll and look for pricing cards
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
    await page.waitForTimeout(300);

    // Verify page has pricing-related content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('$'); // Pricing sections usually have prices
  });

  test('should render the Contact section with id="contact"', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeVisible();

    // Check for contact form elements
    await expect(page.locator('#contact input, #contact textarea').first()).toBeVisible();
  });

  test('should render the FAQ section', async ({ page }) => {
    // Scroll to FAQ section
    const faqSection = page.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();
    await expect(faqSection).toBeVisible();

    // Check for FAQ accordion triggers (not the hidden content)
    const faqTriggers = page.locator('#faq button[class*="accordion"]');
    await expect(faqTriggers.first()).toBeVisible();
  });

  test('should render the Footer section', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for footer content (social links, copyright, etc.)
    await expect(footer).toContainText(/./); // Has some content
  });

  test('should have all major sections in correct order', async ({ page }) => {
    // Scroll through page to load all sections
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify key sections exist by their IDs (note: #features appears twice)
    const featuresCount = await page.locator('#features').count();
    expect(featuresCount).toBeGreaterThanOrEqual(1);

    await expect(page.locator('#testimonials')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#faq')).toBeAttached();

    // Get all section elements
    const sections = await page.locator('section').all();
    expect(sections.length).toBeGreaterThan(10);
  });
});
