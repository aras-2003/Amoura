# Repository hygiene

Updated: 2026-09-29

## Canonical state

- `main` — jedyny canonical branch.
- automatic TEST-theme deploy source: wyłącznie `main`.
- zweryfikowany technical/content baseline oraz dokumentacja #1–#7 są na `main`.

## Historical branches

Historyczne branche pozostają wyłącznie jako ślad prac i nie są źródłem deployu:
- `feature/playwright-ux-audit`
- `feature/amoura-daily-club`
- `feature/project-instructions-2026-09-22`
- `fix/header-section-rendering-diagnostics`
- `fix/reliable-full-page-screenshots`
- `fix/mobile-touch-targets`
- `fix/email-signup-flows`
- `fix/content-language-consistency`
- `qa/backlog-dod`
- `refactor/about-amoura-story`
- `stabilize/backlog-dod`
- `maintenance/ci-repo-hygiene`
- `review/final-backlog-review`
- `content/club-4-week-rhythm`

Ich istotna zawartość została skonsolidowana do `main`.

## Pull requests

Draft PR #3 i #4 są zamknięte jako superseded i nie powinny być mergowane.

## Deployment guardrails

`scripts/theme-push.sh` twardo weryfikuje:
- store: `jksgiq-r4.myshopify.com`
- theme ID: `207539044694`
- role: MAIN/LIVE

## CI

- GitHub Actions v7,
- Node 22,
- Shopify CLI przypięte do wersji,
- `npm run qa:dod` jako centralny gate,
- strict Theme Check + strict push + rejected-file detection before accepting deploy,
- raporty JSON i kluczowe full-page screenshots przy success,
- pełne diagnostyki przy failure.

## Branch deletion

Dostępny connector GitHub nie udostępnia operacji delete branch. Branche historyczne są zdezaktywowane operacyjnie, a nie fikcyjnie oznaczone jako usunięte.


## Supported locales

Current Shopify storefront state was verified through Admin GraphQL:
- `pl` — primary, published,
- `en` — published.

Amoura intentionally keeps only four locale files:
- `locales/pl.json`
- `locales/pl.schema.json`
- `locales/en.default.json`
- `locales/en.default.schema.json`

The extra Shopify stock locale payloads and theme-editor schema translations are not used by this project and are removed from the repository. `scripts/theme-pull.sh` prunes every snapshot back to the four approved PL/EN files, so a future manual Shopify snapshot cannot silently reintroduce Arabic or other unused locales.

Before publishing another storefront language or supporting another theme-editor language, explicitly add/restore its locale files and make them pass Theme Check.

## Manual workflows

- `bootstrap-theme.yml` is manual-only and main-only; it can snapshot the approved TEST theme back into the repository when explicitly requested.
- `ux-audit.yml` is manual-only and main-only.
- normal deployment and DoD validation happen only through `deploy-test-theme.yml` from `main`.
