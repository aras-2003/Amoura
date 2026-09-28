import { test, expect } from '@playwright/test';

test('email flows have one clear purpose per context', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('footer form input[type="email"]')).toHaveCount(0);

  await page.goto('/pages/klub-amoura', { waitUntil: 'domcontentloaded' });
  const clubForm = page.locator('.ac-signup form');
  await expect(clubForm).toHaveCount(1);
  await expect(clubForm.locator('input[type="email"][required]')).toHaveCount(1);
  await expect(clubForm.locator('input[name="contact[body]"]')).toHaveValue(/opening notification only/i);
  await expect(clubForm).toContainText(/newsletter|newslettera/i);

  await page.goto('/pages/contact', { waitUntil: 'domcontentloaded' });
  const contactForm = page.locator('.contact-form form');
  await expect(contactForm).toHaveCount(1);
  await expect(contactForm.locator('input[type="email"][required]')).toHaveCount(1);
});
