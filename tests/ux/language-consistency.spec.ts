import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/pages/o-amoura',
  '/pages/klub-amoura',
  '/pages/kolekcje',
  '/blogs/wiedza',
  '/pages/contact'
];

test('Polish storefront avoids known language regressions', async ({ page }) => {
  for (const route of ROUTES) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    expect(text, `${route}: Club Amoura should be localized`).not.toContain('Club Amoura');
    expect(text, `${route}: Journal should not appear in Polish navigation/copy`).not.toMatch(/\bAmoura Journal\b/);
    expect(text, `${route}: Feedback anglicism`).not.toMatch(/\bFeedback\b/);
    expect(text, `${route}: upsell anglicism`).not.toMatch(/\bupsell\b/i);
    expect(text, `${route}: em dash regression`).not.toContain('—');
  }
});
