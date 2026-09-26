# Amoura

Concept-stage Shopify sexual-wellness commerce experience.

This repository is used for two things:

1. **Shopify theme source** — after the current TEST theme is pulled into the standard Shopify theme folders at repository root.
2. **Automated storefront QA** — Playwright crawls the real password-protected Shopify TEST preview at mobile, tablet and desktop sizes and generates screenshots plus UX/accessibility findings.

## Current Shopify TEST target

- Store: `jksgiq-r4.myshopify.com`
- Theme: `Amoura — TEST`
- Theme ID: `207539044694`
- State: unpublished / staging

## Automated UX audit

One-time setup in GitHub repository secrets:

- `SHOPIFY_STOREFRONT_PASSWORD` — storefront password used only by Playwright to unlock preview.
- `SHOPIFY_CLI_THEME_TOKEN` — Theme Access app password or Admin API token, only if using the theme-pull bootstrap workflow.

Run locally:

```bash
npm install
npx playwright install chromium
npm run audit
```

The audit runs at:

- 390×844 mobile
- 768×1024 tablet
- 1440×1000 desktop

It discovers storefront pages, captures full-page screenshots and reports horizontal overflow, broken images, large empty sections, missing H1s, small mobile tap targets, serious accessibility findings and runtime errors.

See [docs/UX_AUTOMATION.md](docs/UX_AUTOMATION.md).

## Theme bootstrap

The repository is intentionally prepared so Shopify's standard theme folders can live at repository root while QA tooling remains alongside them. Shopify ignores non-theme folders.

To pull the current TEST theme into this branch:

```bash
SHOPIFY_CLI_THEME_TOKEN=... ./scripts/theme-pull.sh
```

Never commit credentials.

## Working model

- significant work: feature branch
- rendered QA: Shopify TEST preview
- review: Playwright screenshots + JSON report
- merge/deploy: only after explicit approval

See `AGENTS.md` for project rules.
