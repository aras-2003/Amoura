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
- lekkie raporty przy success,
- pełne diagnostyki przy failure.

## Branch deletion

Dostępny connector GitHub nie udostępnia operacji delete branch. Branche historyczne są zdezaktywowane operacyjnie, a nie fikcyjnie oznaczone jako usunięte.
