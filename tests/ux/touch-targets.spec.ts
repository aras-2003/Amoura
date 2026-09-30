import { test, expect, type Page } from '@playwright/test';
import { auditPage, stripShopifyPreviewChrome } from '../helpers/audit';

const ROUTES = [
  '/',
  '/pages/klub-amoura',
  '/collections/menopause-comfort-pleasure',
  '/products/soft-ritual-massager'
];

const WIDTHS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 }
];

async function gotoWithRetry(page: Page, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  let response = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    if (!transient.has(response?.status() ?? 0)) return response;
    await page.waitForTimeout(400 * attempt);
  }

  return response;
}

async function componentTargetOverlaps(page: Page) {
  return await page.evaluate(() => {
    const selector = [
      '.footer-content--editorial a',
      '.policy-list-trigger',
      '.menu-drawer a',
      '.menu-drawer button',
      '.quantity-selector button',
      '.facets button',
      '.facets summary',
      '.close-button'
    ].join(',');

    const nodes = [...document.querySelectorAll(selector)].filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    });

    const overlaps: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (a.contains(b) || b.contains(a)) continue;
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        const w = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
        const h = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
        if (w > 2 && h > 2) {
          overlaps.push(`${a.tagName.toLowerCase()}.${(a as HTMLElement).className} <> ${b.tagName.toLowerCase()}.${(b as HTMLElement).className}`);
        }
      }
    }
    return overlaps.slice(0, 10);
  });
}

for (const viewport of WIDTHS) {
  test(`touch targets stay usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ROUTES) {
      const response = await gotoWithRetry(page, route);
      expect(response?.status() ?? 0, route).toBeLessThan(400);
      await page.waitForTimeout(350);
      await stripShopifyPreviewChrome(page);

      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(horizontalOverflow, `horizontal overflow on ${route}`).toBe(false);

      const findings = await auditPage(page, route, viewport.width <= 390 ? 'mobile' : 'responsive');
      const touchFindings = findings.filter((f) => f.code === 'small-touch-target');

      if (viewport.width <= 390) {
        const componentFindings = touchFindings.filter((f) =>
          /footer-content--editorial|policy-list|menu-drawer|quantity|filters|close/i.test(f.detail)
        );
        expect(componentFindings, `small component targets on ${route}: ${JSON.stringify(componentFindings)}`).toEqual([]);

        const overlaps = await componentTargetOverlaps(page);
        expect(overlaps, `overlapping component targets on ${route}: ${JSON.stringify(overlaps)}`).toEqual([]);

        let focusVisible = false;
        for (let i = 0; i < 12; i++) {
          await page.keyboard.press('Tab');
          focusVisible = await page.evaluate(() => {
            const active = document.activeElement;
            return active instanceof HTMLElement && active.matches(':focus-visible');
          });
          if (focusVisible) break;
        }
        expect(focusVisible, `no visible keyboard focus found on ${route}`).toBe(true);
      }
    }
  });
}

test('key pages reflow at a 200% desktop zoom equivalent', async ({ page }) => {
  // Desktop browser zoom reduces the layout viewport in CSS pixels. A 1440px
  // window at 200% zoom is therefore represented by a 720px CSS viewport.
  // CSS `zoom: 2` is intentionally not used here because it scales the
  // document after layout and creates artificial horizontal overflow.
  await page.setViewportSize({ width: 720, height: 500 });

  for (const route of ROUTES) {
    const response = await gotoWithRetry(page, route);
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    await stripShopifyPreviewChrome(page);
    await page.waitForTimeout(150);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(overflow, `horizontal overflow at 200% desktop zoom equivalent on ${route}`).toBe(false);

    const overlaps = await componentTargetOverlaps(page);
    expect(overlaps, `overlapping targets at 200% desktop zoom equivalent on ${route}: ${JSON.stringify(overlaps)}`).toEqual([]);
  }
});


test('inline-link exception applies only to links embedded in running text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent(`
    <main>
      <p>Read the <a id="embedded" href="#">privacy policy</a> before continuing.</p>
      <div><a id="standalone" href="#">Standalone link</a></div>
    </main>
  `);

  await page.addStyleTag({ content: `
    #embedded, #standalone {
      display: inline;
      font-size: 12px;
      line-height: 16px;
    }
  ` });

  const findings = await auditPage(page, '/fixture-inline-links', 'mobile');
  const touch = findings.filter((f) => f.code === 'small-touch-target');

  expect(touch.some((f) => f.detail.includes('#embedded'))).toBe(false);
  expect(touch.some((f) => f.detail.includes('#standalone'))).toBe(true);
});
