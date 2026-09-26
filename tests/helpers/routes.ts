import type { Page } from '@playwright/test';

export const CORE_ROUTES = [
  '/',
  '/collections/renaissance',
  '/collections/midlife-premium-intimacy',
  '/collections/perennial-rituals',
  '/collections/menopause-comfort-pleasure',
  '/products/soft-ritual-massager',
  '/blogs/wiedza',
  '/blogs/wiedza/od-czego-zaczac',
  '/blogs/wiedza/bliskosc-po-35',
  '/pages/o-amoura',
  '/pages/klub-amoura'
];

const ALLOWED_PREFIXES = [
  '/collections/',
  '/products/',
  '/blogs/',
  '/pages/'
];

const BLOCKED_PARTS = [
  '/cart',
  '/checkout',
  '/account',
  '/search',
  '/policies/',
  '/challenge'
];

export function normalizeRoute(href: string, origin: string): string | null {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) return null;
    if (BLOCKED_PARTS.some((part) => url.pathname.startsWith(part))) return null;
    if (url.pathname !== '/' && !ALLOWED_PREFIXES.some((p) => url.pathname.startsWith(p))) return null;
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return null;
  }
}

export async function discoverRoutes(page: Page, maxRoutes = Number(process.env.MAX_AUDIT_ROUTES || 30)) {
  const origin = new URL(page.context().pages()[0]?.url() || 'https://jksgiq-r4.myshopify.com').origin;
  const queue = [...CORE_ROUTES];
  const seen = new Set<string>();

  while (queue.length && seen.size < maxRoutes) {
    const route = queue.shift()!;
    if (seen.has(route)) continue;
    seen.add(route);

    try {
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(250);
      const links = await page.locator('a[href]').evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLAnchorElement).href)
      );

      for (const href of links) {
        const normalized = normalizeRoute(href, origin);
        if (normalized && !seen.has(normalized) && !queue.includes(normalized)) queue.push(normalized);
        if (seen.size + queue.length >= maxRoutes * 2) break;
      }
    } catch {
      // Route-level failures are captured by the audit itself.
    }
  }

  return [...seen];
}
