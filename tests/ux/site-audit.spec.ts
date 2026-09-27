import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { discoverRoutes } from '../helpers/routes';
import { auditPage, stripShopifyPreviewChrome, type AuditFinding } from '../helpers/audit';

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
      for (let attempt = 1; attempt <= 3; attempt++) {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        responseStatus = response?.status() ?? null;
        if (responseStatus !== 429) break;
        await page.waitForTimeout(1200 * attempt);
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

    if (responseStatus && responseStatus >= 400) {
      findings.push({
        route, viewport: project, severity: responseStatus === 429 ? 'warning' : 'critical', code: 'http-status',
        detail: String(responseStatus)
      });
      continue;
    }

    for (const message of pageErrors) {
      findings.push({ route, viewport: project, severity: 'serious', code: 'pageerror', detail: message });
    }

    findings.push(...await auditPage(page, route, project));

    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '');
    await page.screenshot({
      path: path.join(screenshotDir, `${slug}.png`),
      fullPage: true,
      animations: 'disabled'
    });
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
