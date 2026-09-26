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

  const passwordField = page.locator('input[type="password"], input[name="password"], #Password').first();
  if (await passwordField.isVisible().catch(() => false)) {
    const password = process.env.SHOPIFY_STOREFRONT_PASSWORD;
    if (!password) {
      throw new Error(
        'Storefront password wall detected. Add SHOPIFY_STOREFRONT_PASSWORD as a GitHub Actions repository secret.'
      );
    }

    await passwordField.fill(password);
    const submit = page.getByRole('button', { name: /submit|prześlij|enter|wejdź/i }).first();
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
    } else {
      await passwordField.press('Enter');
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const stillLocked = await page.locator('input[type="password"], input[name="password"], #Password')
      .first()
      .isVisible()
      .catch(() => false);

    if (stillLocked) {
      throw new Error('Shopify storefront password was rejected or the password page did not unlock.');
    }
  }

  await context.storageState({ path: '.auth/shopify.json' });
  await browser.close();
}
