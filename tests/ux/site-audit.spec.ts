import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { discoverRoutes } from '../helpers/routes';
import { auditPage, stripShopifyPreviewChrome, type AuditFinding } from '../helpers/audit';
import { captureFullPageScreenshot } from '../helpers/full-page-screenshot';

test('crawl and audit the rendered Amoura storefront', async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  const reportDir = path.join('reports', 'ux', project);
  const screenshotDir = path.join(reportDir, 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const routes = await discoverRoutes(page);
  const findings: AuditFinding[] = [];

  for (const route of routes) {
    pageErrors.length = 0;

    let responseStatus: number | null = null;
    try {
      const transientStatuses = new Set([429, 502, 503, 504]);
      for (let attempt = 1; attempt <= 3; attempt++) {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        responseStatus = response?.status() ?? null;
        if (!transientStatuses.has(responseStatus ?? 0)) break;
        await page.waitForTimeout(400 * attempt);
      }
    } catch (error) {
      findings.push({
        route, viewport: project, severity: 'critical', code: 'navigation-failed',
        detail: error instanceof Error ? error.message : String(error)
      });
      continue;
    }

    await page.waitForTimeout(650);
    await stripShopifyPreviewChrome(page);
    const rejectCookies = page.getByRole('button', { name: /^(Odrzuć|Reject|Reject all)$/i });
    if (await rejectCookies.isVisible().catch(() => false)) {
      await rejectCookies.click();
      await rejectCookies.waitFor({ state: 'hidden' });
    }
    if (route === '/' || route === '/pages/klub-amoura') {
      const footer = page.locator('.footer-content--editorial');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer.locator('input[type="email"]')).toHaveCount(0);
      await expect(footer.locator('a')).toHaveCount(8);
      if (project === 'mobile') {
        const sizes = await footer.locator('a').evaluateAll(links => links.map(link => link.getBoundingClientRect().height));
        expect(sizes.every(height => height >= 44)).toBe(true);
      }
      await footer.screenshot({ path: path.join(screenshotDir, route === '/' ? 'footer-home.png' : 'footer-club.png') });
    }
    if (route === '/pages/klub-amoura' && responseStatus === 200) {
      await expect(page.locator('.ac h1')).toContainText('Dobrze być');
      await expect(page.locator('.ac-ritual-card')).toHaveCount(3);
      await page.locator('.ac-ritual-card summary').nth(1).click();
      await expect(page.locator('.ac-ritual-card').nth(1)).toHaveAttribute('open', '');
      await page.locator('.ac-ritual-card summary').nth(1).click();
      await expect(page.locator('.ac-signup input[type="email"]')).toHaveAttribute('required', '');
    }

    if (responseStatus && responseStatus >= 400) {
      findings.push({
        route, viewport: project, severity: [429, 502, 503, 504].includes(responseStatus) ? 'warning' : 'critical', code: 'http-status',
        detail: String(responseStatus)
      });
      continue;
    }

    for (const message of pageErrors) {
      findings.push({ route, viewport: project, severity: 'serious', code: 'pageerror', detail: message });
    }

    findings.push(...await auditPage(page, route, project));

    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '');
    const shot = await captureFullPageScreenshot(page, path.join(screenshotDir, `${slug}.png`), { prepareMedia: false });
    const viewport = page.viewportSize();
    if (viewport && Math.max(shot.wrapperHeight, shot.documentHeight) > viewport.height + 200) {
      expect(shot.cssHeight, `Expected a full-page screenshot for ${route}`).toBeGreaterThan(viewport.height + 200);
    }
    expect(shot.headerPosition).not.toBe('sticky');
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseURL: testInfo.project.use.baseURL,
    project,
    routes,
    summary: {
      routes: routes.length,
      critical: findings.filter((f) => f.severity === 'critical').length,
      serious: findings.filter((f) => f.severity === 'serious').length,
      warnings: findings.filter((f) => f.severity === 'warning').length
    },
    findings
  };

  const reportPath = path.join(reportDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  await testInfo.attach('ux-audit-report', { path: reportPath, contentType: 'application/json' });

  const blockers = findings.filter((f) => f.severity === 'critical');
  expect(blockers, JSON.stringify(blockers, null, 2)).toEqual([]);
});
