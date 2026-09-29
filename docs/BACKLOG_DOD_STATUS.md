# Backlog Definition of Done — status

Branch: `main`  
Status source: latest successful `Deploy Shopify TEST Theme` run whose `head_sha` equals the current `main`.

Do not use a browser-only green run as proof if the deploy log contains a rejected Shopify theme file.

## Closed items

### #1 Section rendering / header hydration — CLOSED
- **15/15 focused checks**
- 5 scenarios × mobile / tablet / desktop
- section-response contract
- rapid navigation
- predictive-search reset stress
- real internal navigation
- header menu and cart usability

### #2 Full-page screenshots — CLOSED
- **3/3 Playwright projects**
- mobile / tablet / desktop
- home, Klub, collection, product and article inside each project
- CSS-pixel normalization and non-sticky header during capture

### #3 Touch targets / responsive reflow — CLOSED
- **5/5 focused checks**
- 360 / 390 / 768 / 1440 px
- 200% zoom-equivalent reflow
- horizontal overflow and visible keyboard focus checked

### #4 Email flows / consent semantics — CLOSED
- **2/2 focused checks**
- Club notification separated from newsletter semantics
- contact e-mail required
- success/error states present
- actual e-mail delivery intentionally not tested

### #5 Language consistency — CLOSED
- **3/3 focused checks**
- PL/EN core routes
- Klub Amoura / Club Amoura stable after hydration
- no missing-translation regressions
- Polish copy-hygiene guards on core routes and all 8 published PL knowledge articles
- published storefront locales intentionally limited to PL + EN

### #6 Klub content rhythm — CLOSED AS EDITORIAL DELIVERABLE
- 12 proposals
- 4 weeks × 2/5/10 min
- existing Shopify articles only
- no automatic publication
- #3, #8, #10 and #11 require expert review before publication

### #7 SEO basics — CLOSED
- **14/14 core routes**
- PL + EN
- server HTML title
- exactly one semantic H1
- canonical
- OG metadata
- no accidental noindex

### Cross-cutting review readiness
- source/documentation consistency
- strict deployment contract
- approved target guards
- supported locale contract
- Astra evidence-pack presence

## Deployment integrity

The deployment gate now requires:
1. exact store and theme ID,
2. MAIN/LIVE role,
3. Theme Check at error severity,
4. `theme push --strict`,
5. rejection detection from Shopify stderr,
6. returned JSON confirming the intended theme ID.

A run with an individual rejected theme file is not valid DoD evidence even if browser tests later pass.

## Final storefront audit

The final broad audit must pass:
- mobile,
- tablet,
- desktop,
- **3/3 projects**,
- **0 critical findings**,
- **0 serious findings**,
- **0 standalone touch-target warnings** below the 44 px product standard,

after all focused suites in the same workflow run. Inline links embedded in running text use the WCAG inline-text exception and are intentionally not treated as standalone controls.

## Success evidence artifact

A successful final run retains:
- UX report JSON,
- key full-page screenshots for home,
- Club,
- collection,
- product,
- article,
across mobile / tablet / desktop.

## Rule going forward

A code task is DONE only when:
1. its focused acceptance test passes,
2. strict deploy completes without rejected files,
3. consolidated `qa:dod` passes,
4. full storefront audit passes in the same run,
5. limitations are documented.

For the final Astra review, use the current `main` commit and the latest successful workflow run with exactly the same `head_sha`.
