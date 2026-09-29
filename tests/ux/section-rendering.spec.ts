import { test, expect, type Page } from '@playwright/test';

const TARGET_ROUTES = [
  '/collections/menopause-comfort-pleasure',
  '/products/soft-ritual-massager',
  '/products/perennial-touch-kit',
];

type SectionProbe = {
  route: string;
  requestUrl: string;
  sectionId: string;
  status: number;
  contentType: string;
  length: number;
  hasExpectedWrapper: boolean;
};

async function unlockCookiesIfNeeded(page: Page) {
  const rejectCookies = page.getByRole('button', { name: /^(Odrzuć|Reject|Reject all)$/i });
  if (await rejectCookies.isVisible().catch(() => false)) {
    await rejectCookies.click();
    await rejectCookies.waitFor({ state: 'hidden' });
  }
}

async function probeHeaderSection(page: Page, route: string): Promise<SectionProbe> {
  await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await unlockCookiesIfNeeded(page);

  const wrapperId = await page.locator('#header-group .shopify-section').first().getAttribute('id');
  expect(wrapperId, `header section wrapper missing on ${route}`).toBeTruthy();

  const sectionId = wrapperId!.replace(/^shopify-section-/, '');
  const requestUrl = new URL(route, page.url());
  requestUrl.searchParams.set('section_id', sectionId);

  const result = await page.evaluate(async ({ url, sectionId }) => {
    const response = await fetch(url, { credentials: 'same-origin' });
    const text = await response.text();
    return {
      status: response.status,
      contentType: response.headers.get('content-type') || '',
      length: text.length,
      hasExpectedWrapper: text.includes(`id="shopify-section-${sectionId}"`),
    };
  }, { url: requestUrl.toString(), sectionId });

  return { route, requestUrl: requestUrl.toString(), sectionId, ...result };
}

test.describe('section rendering diagnostics', () => {
  test('header section rendering contract is valid on targeted routes', async ({ page }, testInfo) => {
    const probes: SectionProbe[] = [];

    for (const route of TARGET_ROUTES) {
      probes.push(await probeHeaderSection(page, route));
    }

    await testInfo.attach('section-rendering-probes', {
      body: Buffer.from(JSON.stringify(probes, null, 2)),
      contentType: 'application/json',
    });

    for (const probe of probes) {
      expect(probe.status, `${probe.requestUrl} returned HTTP ${probe.status}`).toBe(200);
      expect(probe.contentType, `${probe.requestUrl} returned unexpected content type`).toContain('text/html');
      expect(probe.length, `${probe.requestUrl} returned an empty response`).toBeGreaterThan(100);
      expect(
        probe.hasExpectedWrapper,
        `${probe.requestUrl} did not contain #shopify-section-${probe.sectionId}`
      ).toBe(true);
    }
  });

  test('rapid navigation does not surface section-rendering errors', async ({ page }, testInfo) => {
    const errors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    await page.goto(TARGET_ROUTES[0], { waitUntil: 'domcontentloaded' });
    await unlockCookiesIfNeeded(page);

    for (let cycle = 0; cycle < 3; cycle++) {
      for (const route of TARGET_ROUTES.slice(1)) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
      }
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.goForward({ waitUntil: 'domcontentloaded' });
    }

    const relevant = [...errors, ...consoleErrors].filter(message =>
      /section .*not found|No empty section markup found|header section missing/i.test(message)
    );

    await testInfo.attach('section-rendering-errors', {
      body: Buffer.from(JSON.stringify({ errors, consoleErrors, relevant }, null, 2)),
      contentType: 'application/json',
    });

    expect(relevant, JSON.stringify(relevant, null, 2)).toEqual([]);
  });

  test('predictive search reset stress does not surface section-rendering errors', async ({ page }, testInfo) => {
    const errors: string[] = [];
    const sectionResponses: Array<{ url: string; status: number; contentType: string }> = [];

    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', response => {
      if (response.url().includes('section_id=')) {
        sectionResponses.push({
          url: response.url(),
          status: response.status(),
          contentType: response.headers()['content-type'] || '',
        });
      }
    });

    await page.goto(TARGET_ROUTES[0], { waitUntil: 'domcontentloaded' });
    await unlockCookiesIfNeeded(page);

    for (let cycle = 0; cycle < 8; cycle++) {
      const searchButton = page.locator('search-button button[aria-haspopup="dialog"]:visible').first();
      await expect(searchButton).toBeVisible({ timeout: 5_000 });
      await searchButton.click();

      const input = page.locator('#search-modal dialog[open] predictive-search-component input[type="search"]').first();
      await expect(input).toBeVisible({ timeout: 5_000 });

      await input.fill('soft');
      await input.fill('soft ritual');
      await input.fill('');
      await input.fill('perennial');
      await input.fill('');
      await page.keyboard.press('Escape');
    }

    await page.waitForTimeout(750);

    const relevantErrors = errors.filter(message =>
      /section .*not found|No empty section markup found|header section missing/i.test(message)
    );
    const badResponses = sectionResponses.filter(
      response => response.status !== 200 || !response.contentType.includes('text/html')
    );

    await testInfo.attach('predictive-search-section-responses', {
      body: Buffer.from(JSON.stringify({ sectionResponses, badResponses, errors, relevantErrors }, null, 2)),
      contentType: 'application/json',
    });

    expect(relevantErrors, JSON.stringify(relevantErrors, null, 2)).toEqual([]);
    expect(badResponses, JSON.stringify(badResponses, null, 2)).toEqual([]);
  });


  test('header menu and cart controls remain usable', async ({ page }) => {
    await page.goto(TARGET_ROUTES[0], { waitUntil: 'domcontentloaded' });
    await unlockCookiesIfNeeded(page);

    const cartTrigger = page.locator('[data-testid="cart-drawer-trigger"]:visible').first();
    if (await cartTrigger.count()) {
      await expect(cartTrigger).toBeVisible();
      await cartTrigger.click();
      const cartDialog = page.locator('#cart-drawer dialog, dialog#cart-drawer').first();
      await expect(cartDialog).toBeVisible({ timeout: 5_000 });
      await page.keyboard.press('Escape');
      await expect(cartDialog).not.toBeVisible({ timeout: 5_000 });
    } else {
      const cartLink = page.locator('a[data-testid="cart-icon"], a[aria-label*="cart" i]:visible').first();
      await expect(cartLink).toBeVisible();
    }

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 990) {
      const menuSummary = page.locator('#Details-menu-drawer-container > summary:visible').first();
      await expect(menuSummary).toBeVisible();
      await menuSummary.click();
      await expect(page.locator('#Details-menu-drawer-container')).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
    } else {
      await expect(page.locator('#header-group header-menu:visible').first()).toBeVisible();
    }
  });

});
