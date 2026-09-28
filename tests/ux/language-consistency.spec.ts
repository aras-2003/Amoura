import { test, expect, type Page } from '@playwright/test';

const POLISH_ROUTES = [
  '/',
  '/pages/o-amoura',
  '/pages/klub-amoura',
  '/pages/kolekcje',
  '/blogs/wiedza',
  '/pages/contact'
];

const ENGLISH_ROUTES = [
  '/en',
  '/en/pages/o-amoura',
  '/en/pages/klub-amoura',
  '/en/pages/collections',
  '/en/blogs/journal',
  '/en/pages/contact'
];

async function gotoWithRetry(page: Page, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  let lastStatus = 0;

  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    lastStatus = response?.status() ?? 0;
    if (!transient.has(lastStatus)) return lastStatus;
    await page.waitForTimeout(300 * attempt);
  }

  return lastStatus;
}

test('Polish storefront avoids known language regressions', async ({ page }) => {
  for (const route of POLISH_ROUTES) {
    const status = await gotoWithRetry(page, route);
    expect(status, route).toBeLessThan(400);
    await page.waitForTimeout(150);

    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    expect(text, `${route}: Club Amoura should be localized`).not.toContain('Club Amoura');
    expect(text, `${route}: Journal should not appear in Polish navigation/copy`).not.toMatch(/\bAmoura Journal\b/);
    expect(text, `${route}: Feedback anglicism`).not.toMatch(/\bFeedback\b/);
    expect(text, `${route}: upsell anglicism`).not.toMatch(/\bupsell\b/i);
    expect(text, `${route}: em dash regression`).not.toContain('—');
  }
});

test('key Polish and English localized routes are live and labels stay localized', async ({ page }) => {
  for (const route of POLISH_ROUTES) {
    const status = await gotoWithRetry(page, route);
    expect(status, `dead Polish route: ${route}`).toBeLessThan(400);
  }

  for (const route of ENGLISH_ROUTES) {
    const status = await gotoWithRetry(page, route);
    expect(status, `dead English route: ${route}`).toBeLessThan(400);
  }

  await gotoWithRetry(page, '/pages/klub-amoura');
  await page.waitForTimeout(250);
  await expect(page.locator('body')).toContainText('Klub Amoura');
  await expect(page.locator('body')).not.toContainText('Club Amoura');

  await gotoWithRetry(page, '/en/pages/klub-amoura');
  await page.waitForTimeout(250);
  await expect(page.locator('body')).toContainText('Club Amoura');
});
