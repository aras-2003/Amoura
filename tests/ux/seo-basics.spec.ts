import { test, expect, type APIRequestContext } from '@playwright/test';

const CORE_ROUTES = [
  '/',
  '/pages/o-amoura',
  '/pages/klub-amoura',
  '/pages/kolekcje',
  '/blogs/wiedza',
  '/pages/faq',
  '/pages/contact',
  '/en/',
  '/en/pages/o-amoura',
  '/en/pages/klub-amoura',
  '/en/pages/collections',
  '/en/blogs/journal',
  '/en/pages/faq',
  '/en/pages/contact'
];

function attribute(tag: string, name: string) {
  const escaped = name.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`${escaped}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? '';
}

function findTag(html: string, tagName: string, attributeName: string, attributeValue: string) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  return tags.find((tag) =>
    attribute(tag, attributeName).toLowerCase() === attributeValue.toLowerCase()
  );
}

async function getWithRetry(request: APIRequestContext, route: string) {
  const transient = new Set([429, 502, 503, 504]);
  let response = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await request.get(route, { timeout: 15_000 });
    if (!transient.has(response.status())) return response;
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
  }

  return response;
}

for (const route of CORE_ROUTES) {
  test(`SEO basics are stable on ${route}`, async ({ request }) => {
    test.setTimeout(30_000);

    const response = await getWithRetry(request, route);
    expect(response, `${route}: no HTTP response`).not.toBeNull();
    expect(response!.status(), route).toBeLessThan(400);

    const html = await response!.text();

    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
    expect(title.length, `${route}: empty document title`).toBeGreaterThan(5);

    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    expect(h1Count, `${route}: expected exactly one server-rendered h1`).toBe(1);

    const canonicalTag = findTag(html, 'link', 'rel', 'canonical');
    expect(canonicalTag, `${route}: canonical link missing`).toBeTruthy();
    const canonicalHref = attribute(canonicalTag ?? '', 'href');
    expect(canonicalHref, `${route}: canonical URL missing`).toBeTruthy();

    const canonicalURL = new URL(canonicalHref);
    expect(canonicalURL.protocol, `${route}: canonical must use HTTPS`).toBe('https:');
    expect(
      canonicalURL.searchParams.has('preview_theme_id'),
      `${route}: canonical must not expose theme preview parameters`
    ).toBe(false);

    const ogTitleTag = findTag(html, 'meta', 'property', 'og:title');
    const ogUrlTag = findTag(html, 'meta', 'property', 'og:url');
    const ogDescriptionTag = findTag(html, 'meta', 'property', 'og:description');

    expect(ogTitleTag, `${route}: og:title missing`).toBeTruthy();
    expect(ogUrlTag, `${route}: og:url missing`).toBeTruthy();
    expect(ogDescriptionTag, `${route}: og:description missing`).toBeTruthy();

    expect(
      attribute(ogTitleTag ?? '', 'content').trim().length,
      `${route}: empty og:title`
    ).toBeGreaterThan(2);

    expect(
      attribute(ogDescriptionTag ?? '', 'content').trim().length,
      `${route}: empty og:description`
    ).toBeGreaterThan(10);

    const ogUrl = new URL(attribute(ogUrlTag ?? '', 'content'));
    expect(ogUrl.protocol, `${route}: og:url must use HTTPS`).toBe('https:');
    expect(ogUrl.searchParams.has('preview_theme_id'), `${route}: og:url must not expose preview params`).toBe(false);
    expect(
      ogUrl.pathname.replace(/\/$/, ''),
      `${route}: og:url and canonical path should match`
    ).toBe(canonicalURL.pathname.replace(/\/$/, ''));

    const robotsTag = findTag(html, 'meta', 'name', 'robots');
    const robots = attribute(robotsTag ?? '', 'content').toLowerCase();
    expect(robots, `${route}: core route unexpectedly noindexed`).not.toContain('noindex');
  });
}
