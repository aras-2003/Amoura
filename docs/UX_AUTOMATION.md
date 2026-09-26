# Automated UX QA

## Purpose

This repository contains a browser-based QA harness for the real Shopify-rendered Amoura storefront.

It does not replace Shopify. Shopify remains the runtime and commerce platform. Playwright behaves like a user: it opens the unpublished TEST theme, unlocks the password wall, crawls relevant storefront routes and inspects the rendered result.

## Target

Default TEST preview:

`https://jksgiq-r4.myshopify.com/?preview_theme_id=207539044694`

Override with `AMOURA_BASE_URL`.

## Required secret

GitHub Actions requires one repository secret:

`SHOPIFY_STOREFRONT_PASSWORD`

Never commit the storefront password to the repository.

## What the audit does

For mobile (390×844), tablet (768×1024) and desktop (1440×1000), it:

- authenticates once against the Shopify storefront password wall;
- starts from known high-value Amoura routes;
- discovers additional internal product, collection, page and editorial routes;
- captures full-page screenshots;
- detects horizontal overflow;
- detects broken images;
- flags unusually large empty sections;
- checks for a visible H1;
- checks small touch targets on mobile;
- runs critical/serious WCAG A/AA checks with axe;
- records browser runtime errors;
- writes JSON reports per viewport.

Default route cap: 30. Override with `MAX_AUDIT_ROUTES`.

## Commands

```bash
npm install
npx playwright install chromium

npm run audit
npm run audit:mobile
npm run audit:tablet
npm run audit:desktop
```

## Visual regression

A curated visual suite exists separately:

```bash
npm run visual:update
npm run visual
```

Do not treat generated baselines as approved design merely because they were generated. Create/update baselines only after the rendered state has been reviewed and accepted.

## Reports

Generated locally under:

```text
reports/
  ux/
    mobile/
    tablet/
    desktop/
  html/
  playwright-report.json
```

GitHub Actions uploads the complete `reports/` folder as a workflow artifact.

## Recommended operating model

1. Implement changes on a feature branch.
2. Run the automated UX audit against the Shopify TEST theme.
3. Review screenshots and JSON findings.
4. Fix issues in Shopify/theme code.
5. Re-run the audit.
6. Merge only after explicit approval.

## Theme source synchronization

The repository can also become the source repository for the Shopify theme. Keep theme code in Shopify's standard folders at repository root or in a dedicated theme directory if the chosen Shopify GitHub integration supports that layout.

The QA harness is isolated from theme deployment with `.shopifyignore`.

Before connecting a branch directly to a Shopify theme, perform a one-time pull of the current TEST theme so repository history starts from the real current implementation rather than an outdated skeleton.
