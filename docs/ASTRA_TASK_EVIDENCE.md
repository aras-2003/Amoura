# ASTRA TASK EVIDENCE — Amoura

Purpose: give an independent reviewer a criterion-by-criterion map from the written tasks to the current `main` implementation. This document does not replace the focused tests or the live storefront.

## Review rules

- Canonical branch: `main`.
- Approved TEST target: `jksgiq-r4.myshopify.com`, theme `207539044694`.
- A green browser test is not sufficient if Shopify rejected a theme file during upload.
- Deployment is considered valid only when `scripts/theme-push.sh` completes strict validation and reports no rejected files.
- Known limitations must remain visible; do not reinterpret them as implemented capabilities.

## 1 — Section rendering / header hydration

### Acceptance criteria from task
- identify the actual failure mode rather than suppressing console errors;
- validate section-response contract;
- cover rapid navigation / stale responses;
- preserve header menu, search and cart behavior;
- exercise mobile, tablet and desktop;
- no arbitrary sleep-based runtime patch.

### Implementation / evidence
- `assets/section-renderer.js`
- `assets/predictive-search.js`
- `tests/ux/section-rendering.spec.ts`
- `docs/HANDOFF_01_DIAGNOSIS.md`

The focused suite covers:
- section response contract,
- rapid navigation,
- predictive-search reset stress,
- real internal storefront navigation,
- header menu and cart controls,
across all three Playwright projects.

## 2 — Reliable full-page screenshots

### Acceptance criteria from task
- identify the actual scroll container;
- capture from page start to footer;
- no duplicated sticky header in the middle of capture;
- mobile and desktop support;
- size sanity check;
- no storefront behavior change for normal visitors.

### Implementation / evidence
- `tests/helpers/full-page-screenshot.ts`
- `tests/ux/full-page-screenshots.spec.ts`
- `tests/ux/site-audit.spec.ts`
- `docs/HANDOFF_02_SCREENSHOTS.md`

The helper temporarily converts the custom scroll container to normal document flow only during screenshot capture and normalizes PNG dimensions by device-pixel ratio.

## 3 — Touch targets / responsive reflow

### Acceptance criteria from task
- fix component causes, not all links globally;
- cover 360 / 390 / 768 / 1440 px;
- check 200% desktop reflow equivalent;
- keyboard focus remains visible;
- no horizontal overflow.

### Implementation / evidence
- `sections/footer.liquid`
- `blocks/footer-policy-list.liquid`
- `snippets/header-drawer.liquid`
- `tests/helpers/audit.ts`
- `tests/ux/touch-targets.spec.ts`
- `docs/HANDOFF_03_TOUCH_TARGETS.md`

The documented causes are footer links, policy links, drawer items and drawer back/close controls. Quantity selector was intentionally not changed without evidence.

## 4 — Email flows / consent semantics

### Acceptance criteria from task
- map page → form → purpose → mechanism;
- distinguish Club opening notification, contact and possible newsletter;
- required-field behavior;
- privacy wording;
- success/error states;
- do not pretend a contact form is newsletter membership;
- do not send real test data without explicit instruction.

### Implementation / evidence
- `sections/amoura-club.liquid`
- `blocks/contact-form.liquid`
- `tests/ux/email-flows.spec.ts`
- `docs/HANDOFF_04_EMAIL_FLOWS.md`

Known limitation: actual e-mail delivery is not tested. The Club form is explicitly a contact-based opening notification, not newsletter or paid membership.

## 5 — PL/EN consistency and copy hygiene

### Acceptance criteria from task
- stable Klub Amoura / Club Amoura naming;
- no missing translations on core PL/EN routes;
- reduce obvious Polish anglicisms;
- preserve handles unless intentionally changed;
- distinguish obvious corrections from owner decisions.

### Implementation / evidence
- `layout/theme.liquid`
- `locales/pl.json`
- `locales/en.default.json`
- selected `templates/*.json`
- `tests/ux/language-consistency.spec.ts`
- `docs/HANDOFF_05_LANGUAGE_CONSISTENCY.md`

The language guard covers both PL and EN core routes and the hydration-sensitive Club label.

## 6 — Four-week Club content rhythm

### Acceptance criteria from task
- inventory existing content first;
- 12 proposals;
- 4 weeks × 2/5/10 minutes;
- link only to existing articles;
- no purchase required;
- no diagnosis / therapy / unsupported health promise;
- mark expert-review items;
- do not publish automatically.

### Deliverable / evidence
- `docs/HANDOFF_06_CLUB_CONTENT_RHYTHM.md`

Status: DONE as an editorial deliverable, not as published functionality.

Expert review required before publication for proposals #3, #8, #10 and #11.

## 7 — SEO basics

This is an additional hardening item introduced after the original six tasks.

### Acceptance contract
For core PL and EN routes:
- successful server response;
- meaningful title;
- exactly one semantic H1 in server HTML;
- canonical URL;
- OG title/url/description;
- no accidental noindex.

### Implementation / evidence
- `snippets/meta-tags.liquid`
- `tests/ux/seo-basics.spec.ts`

SEO checks intentionally validate server HTML rather than depending on browser hydration timing.

## Deployment integrity — cross-cutting gate

A previous apparently green run exposed a Shopify CLI behavior where an individual invalid theme file could be rejected while the command still exited successfully. That made a green browser audit insufficient as deployment proof.

Current safeguards in `scripts/theme-push.sh`:
- exact store guard;
- exact theme ID guard;
- MAIN/LIVE role guard;
- Shopify Theme Check at error severity;
- `theme push --strict`;
- capture of CLI stderr;
- explicit failure on rendered Shopify error panels / known rejection messages;
- JSON confirmation that the returned theme ID matches the intended target.

This cross-cutting gate must pass before any run can be used as Astra evidence.

## Final storefront audit

`tests/ux/site-audit.spec.ts` is the broad regression pass after all focused suites. It covers the discovered storefront routes on mobile, tablet and desktop, including runtime errors, HTTP failures, accessibility findings and screenshots.

## Files Astra should compare for contradictions

1. `AGENTS.md`
2. `docs/PRODUCT.md`
3. `docs/BRAND_PRINCIPLES.md`
4. `docs/UX_PRINCIPLES.md`
5. `docs/PRIVACY_PRINCIPLES.md`
6. `docs/MODEL_HANDOFFS.md`
7. `docs/HANDOFF_01_DIAGNOSIS.md` through `HANDOFF_06_CLUB_CONTENT_RHYTHM.md`
8. `docs/BACKLOG_DOD_STATUS.md`
9. `docs/FINAL_BACKLOG_REVIEW.md`
10. `docs/ASTRA_REVIEW_PACKET.md`
11. focused tests under `tests/ux/`
12. current `main` diff / commit history

Astra should treat any documentation↔code mismatch, false-positive test, rejected Shopify theme file, hidden prototype limitation or unsupported claim as a genuine issue.
