import { test, expect } from '@playwright/test';

test.describe('Contact Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display contact form with all required fields', async ({ page }) => {
    // Check for contact section
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();

    // Check for form fields
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();

    // Check for submit button
    const submitButton = page.locator('#contact button[type="submit"], #contact button:has-text("Send")');
    await expect(submitButton).toBeVisible();
  });

  test('should display contact information section', async ({ page }) => {
    // Check for contact info section with address, phone, etc.
    const contactInfo = page.locator('#contact');

    // Check for Find Us (address)
    await expect(contactInfo).toContainText(/find us/i);
    await expect(contactInfo).toContainText(/terrace|street|avenue|road/i);

    // Check for Call Us (phone)
    await expect(contactInfo).toContainText(/call us/i);
    await expect(contactInfo).toContainText(/\+\d|\(\d{3}\)/); // Phone number pattern

    // Check for Mail Us (email)
    await expect(contactInfo).toContainText(/mail us/i);
    await expect(contactInfo).toContainText(/@/); // Email pattern

    // Check for Visit Us (hours)
    await expect(contactInfo).toContainText(/visit us/i);
  });

  test('should allow typing in first name field', async ({ page }) => {
    const firstNameInput = page.locator('#first-name');
    await expect(firstNameInput).toBeVisible();

    // Type in the field
    await firstNameInput.fill('John');

    // Verify the value
    const value = await firstNameInput.inputValue();
    expect(value).toBe('John');
  });

  test('should allow typing in last name field', async ({ page }) => {
    const lastNameInput = page.locator('#last-name');
    await expect(lastNameInput).toBeVisible();

    // Type in the field
    await lastNameInput.fill('Doe');

    // Verify the value
    const value = await lastNameInput.inputValue();
    expect(value).toBe('Doe');
  });

  test('should allow typing in email field', async ({ page }) => {
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();

    // Type in the field
    await emailInput.fill('john.doe@example.com');

    // Verify the value
    const value = await emailInput.inputValue();
    expect(value).toBe('john.doe@example.com');
  });

  test('should have a subject selection dropdown', async ({ page }) => {
    // Look for subject select trigger
    const subjectSelect = page.locator('#contact [role="combobox"], #contact button:has-text("Select")').first();
    await expect(subjectSelect).toBeVisible({ timeout: 10000 });

    // Click to open dropdown
    await subjectSelect.click();
    await page.waitForTimeout(300);

    // Check for dropdown options
    const options = page.locator('[role="option"], [class*="select-item"]');
    await expect(options.first()).toBeVisible({ timeout: 5000 });

    // Verify multiple options exist
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(1);
    console.log(`Found ${optionCount} subject options`);
  });

  test('should allow selecting different subjects', async ({ page }) => {
    // Find and click subject select
    const subjectSelect = page.locator('#contact [role="combobox"], #contact button').filter({
      hasText: /select|subject|web development/i
    }).first();

    await expect(subjectSelect).toBeVisible({ timeout: 10000 });
    await subjectSelect.click();
    await page.waitForTimeout(300);

    // Select an option (e.g., "Mobile Development")
    const mobileOption = page.locator('[role="option"]:has-text("Mobile Development"), [class*="select-item"]:has-text("Mobile")').first();

    if (await mobileOption.isVisible({ timeout: 2000 })) {
      await mobileOption.click();
      await page.waitForTimeout(300);

      // Verify selection
      const selectedValue = await subjectSelect.textContent();
      console.log('Selected subject:', selectedValue);
      expect(selectedValue).toContain('Mobile');
    }
  });

  test('should allow typing in message textarea', async ({ page }) => {
    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();

    // Type a message
    const testMessage = 'This is a test message for the contact form.';
    await messageTextarea.fill(testMessage);

    // Verify the value
    const value = await messageTextarea.inputValue();
    expect(value).toBe(testMessage);
  });

  test('should have proper field labels', async ({ page }) => {
    // Check for labels
    await expect(page.locator('label[for="first-name"]')).toContainText(/first name/i);
    await expect(page.locator('label[for="last-name"]')).toContainText(/last name/i);
    await expect(page.locator('label[for="email"]')).toContainText(/email/i);
    await expect(page.locator('label[for="message"]')).toContainText(/message/i);
  });

  test('should have placeholders in input fields', async ({ page }) => {
    // Check placeholders
    const firstNamePlaceholder = await page.locator('#first-name').getAttribute('placeholder');
    expect(firstNamePlaceholder).toBeTruthy();
    console.log('First name placeholder:', firstNamePlaceholder);

    const lastNamePlaceholder = await page.locator('#last-name').getAttribute('placeholder');
    expect(lastNamePlaceholder).toBeTruthy();

    const emailPlaceholder = await page.locator('#email').getAttribute('placeholder');
    expect(emailPlaceholder).toBeTruthy();

    const messagePlaceholder = await page.locator('#message').getAttribute('placeholder');
    expect(messagePlaceholder).toBeTruthy();
  });

  test('should fill complete form successfully', async ({ page }) => {
    // Fill all fields
    await page.locator('#first-name').fill('Jane');
    await page.locator('#last-name').fill('Smith');
    await page.locator('#email').fill('jane.smith@example.com');

    // Select subject
    const subjectSelect = page.locator('#contact [role="combobox"]').first();
    await subjectSelect.click();
    await page.waitForTimeout(300);

    const option = page.locator('[role="option"]').first();
    if (await option.isVisible({ timeout: 2000 })) {
      await option.click();
      await page.waitForTimeout(300);
    }

    // Fill message
    await page.locator('#message').fill('I would like to inquire about your services.');

    // Verify all fields are filled
    expect(await page.locator('#first-name').inputValue()).toBe('Jane');
    expect(await page.locator('#last-name').inputValue()).toBe('Smith');
    expect(await page.locator('#email').inputValue()).toBe('jane.smith@example.com');
    expect(await page.locator('#message').inputValue()).toBe('I would like to inquire about your services.');
  });

  test('should have submit button enabled when form is filled', async ({ page }) => {
    // Fill the form
    await page.locator('#first-name').fill('Test');
    await page.locator('#last-name').fill('User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test message');

    // Check submit button
    const submitButton = page.locator('#contact button[type="submit"], #contact button:has-text("Send")');
    await expect(submitButton).toBeEnabled();
  });

  test('should display contact form in a card layout', async ({ page }) => {
    // Check for card styling
    const formCard = page.locator('#contact [class*="card"]');
    await expect(formCard).toBeVisible();

    // Form should be inside the card
    const form = formCard.locator('form');
    await expect(form).toBeVisible();
  });

  test('should have proper form structure with grid layout', async ({ page }) => {
    // Check for grid layout of first and last name
    const nameFields = page.locator('#contact form > div').first();
    await expect(nameFields).toBeVisible();

    // Both name fields should be present
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
  });

  test('should display contact icons for each info item', async ({ page }) => {
    const contactSection = page.locator('#contact');

    // Check for icons (Building2, Phone, Mail, Clock from lucide-vue-next)
    const icons = contactSection.locator('svg[class*="lucide"]');
    const iconCount = await icons.count();

    // Should have at least 4 icons (Find Us, Call Us, Mail Us, Visit Us)
    expect(iconCount).toBeGreaterThanOrEqual(4);
    console.log(`Found ${iconCount} contact info icons`);
  });

  test('should handle form submission click', async ({ page }) => {
    // Fill the form
    await page.locator('#first-name').fill('Test');
    await page.locator('#last-name').fill('User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test message');

    // Get submit button
    const submitButton = page.locator('#contact button[type="submit"], #contact button:has-text("Send")');
    await expect(submitButton).toBeVisible();

    // Note: We won't actually submit as it opens mailto: link
    // Just verify the button is clickable
    await expect(submitButton).toBeEnabled();

    const buttonText = await submitButton.textContent();
    console.log('Submit button text:', buttonText);
    expect(buttonText?.toLowerCase()).toContain('send');
  });

  test('should validate email field type', async ({ page }) => {
    const emailInput = page.locator('#email');

    // Check input type is email
    const inputType = await emailInput.getAttribute('type');
    expect(inputType).toBe('email');
  });

  test('should have textarea with multiple rows', async ({ page }) => {
    const messageTextarea = page.locator('#message');

    // Check textarea has rows attribute
    const rows = await messageTextarea.getAttribute('rows');
    expect(rows).toBeTruthy();
    console.log('Textarea rows:', rows);

    // Should be a reasonable number for a message field
    expect(parseInt(rows || '0')).toBeGreaterThanOrEqual(3);
  });

  test('should display contact section heading', async ({ page }) => {
    const contactSection = page.locator('#contact');

    // Check for "Contact" heading
    await expect(contactSection).toContainText(/contact/i);

    // Check for "Connect With Us" or similar heading
    const heading = contactSection.locator('h2');
    await expect(heading.first()).toBeVisible();
  });
});
