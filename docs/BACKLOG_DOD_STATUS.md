# Backlog Definition of Done — status

Last verified storefront baseline: 2026-09-29  
Branch: `main`  
Verified SHA: `a068c9eca747478552f1852d135ee70fb0d598ef`  
GitHub Actions run: `36565669479`  
Artifact: `11032276126`  
Result: **SUCCESS**

## Closed items

### #1 Section rendering / header hydration — CLOSED
- **9/9 passed**
- mobile / tablet / desktop
- contract, rapid navigation and predictive-search reset stress covered

### #2 Full-page screenshots — CLOSED
- **3/3 passed**
- mobile / tablet / desktop
- home, Klub, collection, product and article
- CSS-pixel normalization and non-sticky header during capture

### #3 Touch targets / responsive reflow — CLOSED
- **5/5 passed**
- 360 / 390 / 768 / 1440 px
- 200% zoom-equivalent reflow
- horizontal overflow and visible keyboard focus checked

### #4 Email flows / consent semantics — CLOSED
- **2/2 passed**
- Club notification separated from newsletter semantics
- contact email required
- success/error states present
- actual e-mail delivery intentionally not tested

### #5 Language consistency — CLOSED
- **2/2 passed**
- Klub Amoura / Club Amoura stable after hydration
- no missing-translation regressions
- Polish anti-anglicism and em-dash guards

### #6 Klub content rhythm — CLOSED AS EDITORIAL DELIVERABLE
- 12 proposals
- 4 weeks × 2/5/10 min
- existing Shopify articles only
- no automatic publication
- #3, #8, #10 and #11 require expert review before publication

### #7 SEO basics — CLOSED
- **7/7 passed**
- one visible H1, title, canonical, OG metadata and no accidental noindex on core routes

## Final storefront audit

- mobile: passed
- tablet: passed
- desktop: passed
- **3/3 passed**

## Rule going forward

A code task is not DONE because it was committed or deployed. It is DONE only when its focused acceptance test, consolidated `qa:dod` gate and full storefront audit pass on the same SHA, with limitations documented.
