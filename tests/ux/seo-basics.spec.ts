import { test, expect, type Page } from '@playwright/test';

const CORE_ROUTES = [
  '/',
  '/pages/o-amoura',
  '/pages/klub-amoura',
  '/pages/kolekcje',
  '/blogs/wiedza',
  '/pages/faq',
  '/pages/contact'
];

async function gotoWithRetry(page: Page, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  let response = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (!transient.has(response?.status() ?? 0)) return response;
    await page.waitForTimeout(500 * attempt);
  }

  return response;
}

test('core pages expose stable SEO basics', async ({ page }) => {
  for (const route of CORE_ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);

    const title = (await page.title()).trim();
    expect(title.length, `${route}: empty document title`).toBeGreaterThan(5);

    const h1 = page.locator('h1:visible');
    await expect(h1, `${route}: expected exactly one visible h1`).toHaveCount(1);
    expect((await h1.innerText()).trim().length, `${route}: empty h1`).toBeGreaterThan(2);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical, `${route}: canonical link missing`).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref, `${route}: canonical URL missing`).toBeTruthy();
    expect(new URL(canonicalHref!).origin).toBe(new URL(page.url()).origin);

    const ogTitle = page.locator('meta[property="og:title"]');
    const ogUrl = page.locator('meta[property="og:url"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogTitle).toHaveCount(1);
    await expect(ogUrl).toHaveCount(1);
    await expect(ogDescription).toHaveCount(1);

    expect((await ogTitle.getAttribute('content') ?? '').trim().length, `${route}: empty og:title`).toBeGreaterThan(2);
    expect((await ogDescription.getAttribute('content') ?? '').trim().length, `${route}: empty og:description`).toBeGreaterThan(10);

    const robots = ((await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null)) ?? '').toLowerCase();
    expect(robots, `${route}: core route unexpectedly noindexed`).not.toContain('noindex');
  }
});
