import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs';

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL as string | undefined;
  if (!baseURL) throw new Error('AMOURA_BASE_URL is not configured.');

  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const passwordPage = page.locator('[data-testid="password-footer"], .password-footer').first();
  if (await passwordPage.isVisible().catch(() => false)) {
    const password = process.env.SHOPIFY_STOREFRONT_PASSWORD;
    if (!password) {
      throw new Error(
        'Storefront password wall detected. Add SHOPIFY_STOREFRONT_PASSWORD as a GitHub Actions repository secret.'
      );
    }

    const openPassword = page.locator('.password-footer__button').first();
    if (await openPassword.isVisible().catch(() => false)) {
      await openPassword.click();
    }

    const passwordField = page.locator('input[type="password"][name="password"], #Password').first();
    await passwordField.waitFor({ state: 'visible', timeout: 10_000 });
    await passwordField.fill(password);

    const submit = page.locator('.password-dialog__submit-button, button[type="submit"]').filter({ hasText: /submit|prześlij|enter|wejdź|wyślij/i }).first();
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
    } else {
      await passwordField.press('Enter');
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const stillLocked = await page.locator('[data-testid="password-footer"], .password-footer')
      .first()
      .isVisible()
      .catch(() => false);

    if (stillLocked) {
      throw new Error('Shopify storefront password was rejected or the password page did not unlock.');
    }
  }

  // Preserve both storefront authentication and the preview-theme session.
  await context.storageState({ path: '.auth/shopify.json' });
  await browser.close();
}
