# Repository hygiene

Updated: 2026-09-28

## Active branches

- `main` — canonical branch and the only automatic deploy source for the TEST theme.
- `main` includes the verified technical baseline, CI maintenance, repository hygiene and current Klub content draft/review docs.

## Historical branches — no longer allowed to auto-deploy

These branches are retained only as history and should not be used as deploy sources:

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

Relevant changes from these branches were consolidated into `stabilize/backlog-dod`.

## Pull requests

Draft PRs #3 and #4 were closed as superseded. They must not be merged after consolidation.

## Deployment rule

Automatic pushes to the approved MAIN TEST theme are restricted to:
- `main`

The deployment script additionally hard-checks:
- store: `jksgiq-r4.myshopify.com`
- theme ID: `207539044694`
- role: MAIN/LIVE

This is intentional because the user explicitly approved direct work on the TEST theme even though it is the store's MAIN theme.

## CI maintenance

GitHub Actions runtime dependencies were moved from the deprecated Node-20 generation:
- `actions/checkout@v7`
- `actions/setup-node@v7`
- `actions/upload-artifact@v7`

Node for project tests remains pinned to 22.

## Branch deletion

Historical branches are safe to remove after a final manual check. The connected GitHub action set available in this chat does not expose branch deletion, so they are intentionally left in place rather than pretending they were deleted.
