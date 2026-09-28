import { test, expect, type Page } from '@playwright/test';

const PL_ROUTES = [
  '/',
  '/pages/o-amoura',
  '/pages/klub-amoura',
  '/pages/kolekcje',
  '/blogs/wiedza',
  '/pages/contact'
];

const EN_ROUTES = [
  '/en/',
  '/en/pages/o-amoura',
  '/en/pages/klub-amoura',
  '/en/pages/collections',
  '/en/blogs/journal',
  '/en/pages/contact'
];

async function gotoWithRetry(page: Page, route: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (response?.status() !== 429) return response;
    await page.waitForTimeout(900 * attempt);
  }
  return null;
}

test('Polish storefront avoids known language regressions', async ({ page }) => {
  for (const route of PL_ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    await page.waitForTimeout(150);
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    expect(text, `${route}: Club Amoura should be localized`).not.toContain('Club Amoura');
    expect(text, `${route}: Journal should not appear in Polish navigation/copy`).not.toMatch(/\bAmoura Journal\b/);
    expect(text, `${route}: Feedback anglicism`).not.toMatch(/\bFeedback\b/);
    expect(text, `${route}: upsell anglicism`).not.toMatch(/\bupsell\b/i);
    expect(text, `${route}: em dash regression`).not.toContain('—');
    expect(text, `${route}: missing translation`).not.toMatch(/translation missing/i);
  }
});

test('English storefront keeps English brand labels and live core routes', async ({ page }) => {
  for (const route of EN_ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    await page.waitForTimeout(150);
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    expect(text, `${route}: missing translation`).not.toMatch(/translation missing/i);
    expect(text, `${route}: Polish Club label leaked into EN`).not.toContain('Klub Amoura');
  }

  await gotoWithRetry(page, '/en/pages/klub-amoura');
  await expect(page.locator('header')).toContainText('Club Amoura');
});
