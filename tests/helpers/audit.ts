import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export async function stripShopifyPreviewChrome(page: Page) {
  await page.evaluate(() => {
    document.querySelector('#PBarNextFrameWrapper')?.remove();
    document.querySelector('#PBarNextFrame')?.remove();
  }).catch(() => {});
}

export type AuditFinding = {
  route: string;
  viewport: string;
  severity: 'critical' | 'serious' | 'warning';
  code: string;
  detail: string;
};

export async function auditPage(page: Page, route: string, viewport: string): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];
  await stripShopifyPreviewChrome(page);

  const metrics = await page.evaluate(() => {
    const visible = (el: Element) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };

    const overflowers = [...document.querySelectorAll('body *')]
      .filter(visible)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: (el as HTMLElement).className || '', left: r.left, right: r.right };
      })
      .filter((x) => x.left < -2 || x.right > window.innerWidth + 2)
      .slice(0, 10);

    const brokenImages = [...document.images]
      .filter((img) => visible(img) && img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
      .slice(0, 10);

    const headings = [...document.querySelectorAll('h1,h2,h3')]
      .filter(visible)
      .map((h) => ({ level: Number(h.tagName[1]), text: (h.textContent || '').trim().slice(0, 120) }));

    const emptyLargeSections = [...document.querySelectorAll('section, .shopify-section')]
      .filter(visible)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const media = el.querySelector('img,video,svg');
        return { height: r.height, textLength: text.length, hasMedia: !!media, cls: (el as HTMLElement).className };
      })
      .filter((x) => x.height > window.innerHeight * 0.7 && x.textLength < 35 && !x.hasMedia)
      .slice(0, 8);

    const touchTargets = [...document.querySelectorAll('a,button,input,select,summary')]
      .filter(visible)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : '';
        const classes = [...(el as HTMLElement).classList].slice(0, 3).map((c) => `.${c}`).join('');
        return {
          w: r.width,
          h: r.height,
          text: (el.textContent || '').trim().slice(0, 80),
          tag: el.tagName,
          display: style.display,
          selector: `${el.tagName.toLowerCase()}${id}${classes}`
        };
      })
      // WCAG allows an exception for links embedded inline in running text.
      // Keep the stricter 44px product standard for standalone controls/CTAs.
      .filter((x) => !(x.tag === 'A' && x.display === 'inline'))
      .filter((x) => x.w < 44 || x.h < 44)
      .slice(0, 20);

    return {
      bodyScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      overflowers,
      brokenImages,
      headings,
      emptyLargeSections,
      touchTargets
    };
  });

  if (metrics.bodyScrollWidth > metrics.viewportWidth + 2) {
    findings.push({
      route, viewport, severity: 'critical', code: 'horizontal-overflow',
      detail: `scrollWidth=${metrics.bodyScrollWidth}, viewport=${metrics.viewportWidth}; ${JSON.stringify(metrics.overflowers)}`
    });
  }

  for (const src of metrics.brokenImages) {
    findings.push({ route, viewport, severity: 'serious', code: 'broken-image', detail: src });
  }

  if (!metrics.headings.some((h) => h.level === 1)) {
    findings.push({ route, viewport, severity: 'warning', code: 'missing-h1', detail: 'No visible H1 found.' });
  }

  for (const section of metrics.emptyLargeSections) {
    findings.push({
      route, viewport, severity: 'serious', code: 'empty-large-section',
      detail: `height=${Math.round(section.height)}px class=${String(section.cls).slice(0, 140)}`
    });
  }

  if (viewport === 'mobile') {
    for (const target of metrics.touchTargets) {
      findings.push({
        route, viewport, severity: 'warning', code: 'small-touch-target',
        detail: `${target.selector} ${Math.round(target.w)}x${Math.round(target.h)} "${target.text}"`
      });
    }
  }

  const axe = await new AxeBuilder({ page })
    .exclude('#PBarNextFrameWrapper')
    .exclude('#PBarNextFrame')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  for (const violation of axe.violations.filter((v) => ['critical', 'serious'].includes(v.impact || ''))) {
    findings.push({
      route,
      viewport,
      severity: violation.impact === 'critical' ? 'critical' : 'serious',
      code: `axe:${violation.id}`,
      detail: `${violation.help} (${violation.nodes.length} nodes): ${violation.nodes.map((node) => node.target.join(' > ')).slice(0, 5).join(' | ')}`
    });
  }

  return findings;
}
