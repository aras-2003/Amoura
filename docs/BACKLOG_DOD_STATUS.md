# Backlog Definition of Done — status

Last verified: 2026-09-28  
Branch: `stabilize/backlog-dod`  
Verified SHA: `eaade223100a025ba11aa5af5b0e15bd32f2dbca`  
GitHub Actions run: `36488768357`  
Result: **SUCCESS**

## Closed items

### #1 Section rendering / header hydration — CLOSED
Evidence:
- section rendering diagnostics: **9/9 passed**
- mobile / tablet / desktop
- header contract, rapid navigation and predictive-search reset stress covered

### #2 Full-page screenshots — CLOSED
Evidence:
- dedicated screenshot suite: **3/3 passed**
- mobile / tablet / desktop
- home, Klub, collection, product and article covered inside each project
- CSS-pixel normalization and non-sticky header during full-page capture verified

### #3 Touch targets / responsive reflow — CLOSED
Evidence:
- responsive touch suite: **5/5 passed**
- 360 / 390 / 768 / 1440 px
- 200% desktop zoom-equivalent reflow
- horizontal overflow and keyboard focus checks included

### #4 Email flows / consent semantics — CLOSED
Evidence:
- email-flow suite: **2/2 passed**
- Club notification flow separated from newsletter semantics
- contact form required e-mail validation verified
- success/error states present
- delivery of a real e-mail was intentionally **not tested** and remains outside this DoD

### #5 Language consistency — CLOSED
Evidence:
- PL/EN language suite: **2/2 passed**
- Klub Amoura / Club Amoura labels stable after hydration
- missing-translation regressions guarded
- Polish anti-anglicism checks and em-dash regression check included

## Final storefront audit

- mobile: passed
- tablet: passed
- desktop: passed
- total: **3/3 passed**
- audit completed after all focused gates on the same SHA

Artifact:
- GitHub Actions artifact ID: `11000532035`
- contains reports and Playwright test results

## Definition of Done rule going forward

A backlog item is not considered closed merely because code was committed or deployed. It is closed only when:
1. its focused acceptance test passes,
2. the consolidated `npm run qa:dod` gate reaches it successfully,
3. the full storefront audit passes on the same SHA,
4. known limitations are documented.

## Remaining backlog

- #6 Klub Amoura content rhythm — editorial draft in progress on `content/club-4-week-rhythm`
- final constrained review after #6 decisions
