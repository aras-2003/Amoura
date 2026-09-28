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

export async function captureFullPageScreenshot(page: Page, path: string) {
  const style = await page.addStyleTag({ content: SCREENSHOT_STYLE });

  try {
    await page.evaluate(() => {
      document.documentElement.classList.add('amoura-screenshot-mode');
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper instanceof HTMLElement) wrapper.scrollTo({ top: 0, behavior: 'instant' });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    await page.waitForTimeout(50);

    const layout = await page.evaluate(() => {
      const wrapper = document.querySelector('.page-wrapper');
      const header = document.querySelector('.header-section');
      return {
        wrapperHeight: wrapper?.scrollHeight ?? 0,
        documentHeight: document.documentElement.scrollHeight,
        headerPosition: header ? getComputedStyle(header).position : null
      };
    });

    const buffer = await page.screenshot({
      fullPage: true,
      animations: 'disabled'
    });

    fs.writeFileSync(path, buffer);

    return {
      ...pngDimensions(buffer),
      ...layout
    };
  } finally {
    await page.evaluate(() => document.documentElement.classList.remove('amoura-screenshot-mode'));
    await style.evaluate((node) => node.remove()).catch(() => {});
  }
}
