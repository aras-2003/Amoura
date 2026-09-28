import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test('email flows have one clear purpose per context', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('footer form input[type="email"]')).toHaveCount(0);

  await page.goto('/pages/klub-amoura', { waitUntil: 'domcontentloaded' });
  const clubForm = page.locator('.ac-signup form');
  const clubEmail = clubForm.locator('input[type="email"][required]');
  const clubSubmit = clubForm.locator('button[type="submit"]');

  await expect(clubForm).toHaveCount(1);
  await expect(clubEmail).toHaveCount(1);
  await expect(clubEmail).toHaveAttribute('autocomplete', 'email');
  await expect(clubEmail).toHaveAttribute('aria-describedby', /ac-privacy-/);
  await expect(clubForm.locator('input[name="contact[body]"]')).toHaveValue(/opening notification only/i);
  await expect(clubForm).toContainText(/newsletter|newslettera/i);
  await expect(clubForm.getByRole('link', { name: /Polityka prywatności|Privacy policy/i })).toHaveAttribute('href', /privacy|polity/i);

  // Native required-email validation must stop an empty submit without creating data.
  await clubSubmit.click();
  await expect(clubEmail).toBeFocused();
  expect(await clubEmail.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);

  await page.goto('/pages/contact', { waitUntil: 'domcontentloaded' });
  const contactForm = page.locator('.contact-form form');
  const contactEmail = contactForm.locator('input[type="email"][required]');
  await expect(contactForm).toHaveCount(1);
  await expect(contactEmail).toHaveCount(1);
  await expect(contactEmail).toHaveAttribute('autocomplete', 'email');
});

test('Club form source contains explicit success and error states', async () => {
  const source = fs.readFileSync('sections/amoura-club.liquid', 'utf8');
  expect(source).toContain('role="status"');
  expect(source).toContain('role="alert"');
  expect(source).toContain("'amoura_club.success' | t");
  expect(source).toContain("'amoura_club.error' | t");
});
