import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { stripShopifyPreviewChrome } from '../helpers/audit';
import { captureFullPageScreenshot } from '../helpers/full-page-screenshot';

const ROUTES = [
  ['home', '/'],
  ['club', '/pages/klub-amoura'],
  ['collection', '/collections/menopause-comfort-pleasure'],
  ['product', '/products/soft-ritual-massager'],
  ['article', '/blogs/wiedza/od-czego-zaczac']
] as const;

async function gotoWithRetry(page: Page, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (!transient.has(response?.status() ?? 0)) return response;
    await page.waitForTimeout(400 * attempt);
  }
  return null;
}

async function closeCookiesIfVisible(page: Page) {
  const rejectCookies = page.getByRole('button', { name: /^(Odrzuć|Reject|Reject all)$/i });
  if (await rejectCookies.isVisible().catch(() => false)) {
    await rejectCookies.click();
    await rejectCookies.waitFor({ state: 'hidden' });
  }
}

test('full-page screenshots include the complete storefront', async ({ page }, testInfo) => {
  const dir = path.join('reports', 'screenshots', testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });

  for (const [name, route] of ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);

    await page.waitForTimeout(500);
    await stripShopifyPreviewChrome(page);
    await closeCookiesIfVisible(page);

    const shot = await captureFullPageScreenshot(page, path.join(dir, `${name}-full.png`));
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(Math.round(shot.cssWidth)).toBe(viewport!.width);
    expect(shot.cssHeight, `${route} should extend beyond one viewport`).toBeGreaterThan(viewport!.height + 200);
    expect(shot.headerPosition).not.toBe('sticky');

    if (name === 'article') {
      await page.screenshot({ path: path.join(dir, 'article-top.png'), animations: 'disabled' });
      await page.evaluate(() => {
        const wrapper = document.querySelector('.page-wrapper');
        if (wrapper instanceof HTMLElement && getComputedStyle(wrapper).overflowY === 'auto') {
          wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'instant' });
        } else {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        }
      });
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(dir, 'article-bottom.png'), animations: 'disabled' });
    }
  }
});
