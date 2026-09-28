import type { Page } from '@playwright/test';
import fs from 'node:fs';

const SCREENSHOT_STYLE = `
  html.amoura-screenshot-mode,
  html.amoura-screenshot-mode body {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    scroll-behavior: auto !important;
  }

  html.amoura-screenshot-mode .page-wrapper {
    height: auto !important;
    min-height: 100vh !important;
    overflow: visible !important;
    scroll-behavior: auto !important;
  }

  html.amoura-screenshot-mode .header-section {
    position: relative !important;
    top: auto !important;
  }
`;

export function pngDimensions(buffer: Buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('Expected a PNG screenshot');
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

export async function captureFullPageScreenshot(
  page: Page,
  path: string,
  options: { prepareMedia?: boolean } = {}
) {
  const style = await page.addStyleTag({ content: SCREENSHOT_STYLE });

  try {
    await page.evaluate(() => {
      document.documentElement.classList.add('amoura-screenshot-mode');
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper instanceof HTMLElement) wrapper.scrollTo({ top: 0, behavior: 'instant' });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    await page.evaluate(async (prepareMedia) => {
      await document.fonts.ready;

      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      if (prepareMedia) {
        const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const step = Math.max(window.innerHeight * 0.8, 500);

        // Walk the document once so native lazy-loaded images enter the loading
        // threshold before the dedicated full-page capture.
        for (let y = 0; y < pageHeight; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await wait(20);
        }
        window.scrollTo({ top: pageHeight, behavior: 'instant' });
        await wait(50);

        const pending = [...document.images].filter(img => !img.complete);
        if (pending.length > 0) {
          await Promise.race([
            Promise.all(pending.map(img => new Promise<void>(resolve => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }))),
            wait(3000),
          ]);
        }
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper instanceof HTMLElement) wrapper.scrollTo({ top: 0, behavior: 'instant' });
    }, options.prepareMedia !== false);

    await page.waitForTimeout(50);

    const layout = await page.evaluate(() => {
      const wrapper = document.querySelector('.page-wrapper');
      const header = document.querySelector('.header-section');
      return {
        wrapperHeight: wrapper?.scrollHeight ?? 0,
        documentHeight: document.documentElement.scrollHeight,
        headerPosition: header ? getComputedStyle(header).position : null,
        devicePixelRatio: window.devicePixelRatio || 1
      };
    });

    const buffer = await page.screenshot({
      fullPage: true,
      animations: 'disabled'
    });

    fs.writeFileSync(path, buffer);

    const dimensions = pngDimensions(buffer);

    return {
      ...dimensions,
      cssWidth: dimensions.width / layout.devicePixelRatio,
      cssHeight: dimensions.height / layout.devicePixelRatio,
      ...layout
    };
  } finally {
    await page.evaluate(() => document.documentElement.classList.remove('amoura-screenshot-mode'));
    await style.evaluate((node) => node.remove()).catch(() => {});
  }
}
