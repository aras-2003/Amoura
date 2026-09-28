import { test, expect } from '@playwright/test';
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

for (const viewport of WIDTHS) {
  test(`touch targets stay usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ROUTES) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
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
      }
    }
  });
}
