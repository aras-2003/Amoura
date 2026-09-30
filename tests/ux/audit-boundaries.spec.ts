import { test, expect, type Page } from '@playwright/test';
import { stripShopifyPreviewChrome } from '../helpers/audit';

const ROUTES = [
  '/',
  '/pages/klub-amoura',
  '/collections/menopause-comfort-pleasure',
  '/products/soft-ritual-massager',
  '/blogs/wiedza/od-czego-zaczac',
  '/cart',
  '/pages/faq'
];

async function gotoWithRetry(page: Page, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (!transient.has(response?.status() ?? 0)) return response;
    await page.waitForTimeout(400 * attempt);
  }
  return null;
}

test('representative pages scroll normally without screenshot helpers', async ({ page }) => {
  for (const route of ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    await stripShopifyPreviewChrome(page);

    const start = await page.evaluate(() => ({
      y: window.scrollY,
      h: document.documentElement.scrollHeight,
      vh: window.innerHeight
    }));

    expect(start.y, `${route} should begin near top`).toBeLessThanOrEqual(5);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(100);

    const end = await page.evaluate(() => ({
      y: window.scrollY,
      max: Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    }));

    if (start.h > start.vh + 20) {
      expect(end.y, `${route} should reach document bottom through native scrolling`).toBeGreaterThan(0);
      expect(Math.abs(end.max - end.y), `${route} should scroll to bottom`).toBeLessThanOrEqual(8);
    }
  }
});

test('accelerated-checkout iframe boundary is explicit and host remains inspectable', async ({ page }, testInfo) => {
  const response = await gotoWithRetry(page, '/products/soft-ritual-massager');
  expect(response?.status() ?? 0).toBeLessThan(400);
  await stripShopifyPreviewChrome(page);

  const frames = page.locator('iframe[id^="jsx-iframe-"]');
  const count = await frames.count();

  await testInfo.attach('accelerated-checkout-boundary', {
    body: Buffer.from(JSON.stringify({
      route: '/products/soft-ritual-massager',
      selector: 'iframe[id^="jsx-iframe-"]',
      count,
      note: 'Cross-origin iframe internals are excluded from axe. Host presence is recorded; payment-provider internals require separate provider/manual accessibility review.'
    }, null, 2)),
    contentType: 'application/json'
  });

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      await expect(frames.nth(i)).toBeVisible();
      const box = await frames.nth(i).boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(0);
      expect(box?.height ?? 0).toBeGreaterThan(0);
    }
  }
});
