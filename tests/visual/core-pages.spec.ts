import { test, expect } from '@playwright/test';
import { CORE_ROUTES } from '../helpers/routes';

const VISUAL_ROUTES = CORE_ROUTES.filter((route) =>
  route === '/' ||
  route.includes('/collections/renaissance') ||
  route.includes('/products/soft-ritual-massager') ||
  route === '/blogs/wiedza' ||
  route.includes('/pages/o-amoura')
);

for (const route of VISUAL_ROUTES) {
  test(`visual baseline: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01
    });
  });
}
