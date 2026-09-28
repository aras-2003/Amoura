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

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page, label: string) {
  const horizontalOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth + 2
  );
  expect(horizontalOverflow, `horizontal overflow: ${label}`).toBe(false);
}

async function assertKeyboardFocusVisible(page: import('@playwright/test').Page, label: string) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
  let focus: { tag: string; visible: boolean } | null = null;

  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    focus = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const outlineVisible =
        style.outlineStyle !== 'none' &&
        style.outlineStyle !== 'hidden' &&
        parseFloat(style.outlineWidth || '0') > 0;
      const shadowVisible = style.boxShadow !== 'none';
      return { tag: el.tagName, visible: outlineVisible || shadowVisible };
    });
    if (focus) break;
  }

  expect(focus, `keyboard focus target missing: ${label}`).not.toBeNull();
  expect(focus?.visible, `focus indicator not visible: ${label}`).toBe(true);
}

for (const viewport of WIDTHS) {
  test(`touch targets stay usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ROUTES) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      expect(response?.status() ?? 0, route).toBeLessThan(400);
      await page.waitForTimeout(350);
      await stripShopifyPreviewChrome(page);

      await assertNoHorizontalOverflow(page, `${route} @ ${viewport.width}px`);
      await assertKeyboardFocusVisible(page, `${route} @ ${viewport.width}px`);

      const findings = await auditPage(page, route, viewport.width <= 390 ? 'mobile' : 'responsive');
      const touchFindings = findings.filter((finding) => finding.code === 'small-touch-target');

      if (viewport.width <= 390) {
        const componentFindings = touchFindings.filter((finding) =>
          /footer-content--editorial|policy-list|menu-drawer|quantity|filters|close/i.test(finding.detail)
        );
        expect(
          componentFindings,
          `small component targets on ${route}: ${JSON.stringify(componentFindings)}`
        ).toEqual([]);
      }
    }
  });
}

test('layout remains usable at a 200% zoom equivalent', async ({ page }) => {
  // Browser zoom to 200% halves the effective CSS viewport. 720px is the
  // reflow-equivalent of a 1440px desktop viewport at 200% zoom.
  await page.setViewportSize({ width: 720, height: 800 });

  for (const route of ROUTES) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    expect(response?.status() ?? 0, route).toBeLessThan(400);
    await page.waitForTimeout(300);
    await stripShopifyPreviewChrome(page);
    await assertNoHorizontalOverflow(page, `${route} @ 200% zoom equivalent`);
    await assertKeyboardFocusVisible(page, `${route} @ 200% zoom equivalent`);
  }
});
