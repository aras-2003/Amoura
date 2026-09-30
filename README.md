# Amoura

Concept-stage Shopify sexual-wellness commerce experience.

This repository is used for two things:

1. **Shopify theme source** — the current Amoura theme lives in Shopify's standard theme folders at repository root.
2. **Automated storefront QA** — Playwright crawls the password-protected Shopify storefront at mobile, tablet and desktop sizes and generates screenshots plus UX/accessibility findings.

## Current Shopify QA target

- Store: `jksgiq-r4.myshopify.com`
- Theme name: `Amoura — TEST`
- Theme ID: `207539044694`
- Shopify-reported role in the latest deploy evidence: `live`
- Project use: controlled prototype / QA target, **not evidence of commercial launch**

The theme name contains `TEST`, but that name does not prove that the theme is unpublished or isolated. Until a separate non-live theme is explicitly approved, treat this target as shared and potentially user-visible inside the configured storefront context.

See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md) for the environment and deployment policy.

## Automated UX audit

Repository secrets used by automation:

- `SHOPIFY_STOREFRONT_PASSWORD` — storefront password used by Playwright to unlock the storefront.
- `SHOPIFY_CLI_THEME_TOKEN` — Theme Access app password or Admin API token used only by workflows or scripts that intentionally access the theme.

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

To pull the configured theme into the current branch:

```bash
SHOPIFY_CLI_THEME_TOKEN=... ./scripts/theme-pull.sh
```

Never commit credentials.

## Working model

- significant work: scoped branch + PR;
- PR validation: `pr-quality-gate`, with no Shopify deployment and no theme credentials;
- merge target: `main`;
- deployment-capable workflow: only after merge to `main` or explicit manual dispatch;
- rendered QA: current Shopify QA target listed above;
- review: focused tests + consolidated QA + screenshots/evidence where relevant;
- do not publish, delete, or modify any other store/theme without explicit approval.

A task that depends on rendered storefront behavior is not DONE solely because a PR check is green. It requires the relevant rendered QA on the deployed SHA.

See `AGENTS.md` and `docs/ENVIRONMENTS.md` for project rules.
