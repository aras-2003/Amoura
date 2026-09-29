# ASTRA REVIEW PACKET — Amoura

## Cel

Niezależnie i krytycznie zweryfikować, czy zadania #1–#7 zostały wykonane zgodnie z ich zapisanymi kryteriami, czy TEST storefront odpowiada aktualnemu `main`, oraz czy testy nie dają fałszywie zielonego wyniku.

## Źródło prawdy

- repo: `aras-2003/Amoura`
- canonical branch: `main`
- TEST storefront: `jksgiq-r4.myshopify.com`
- approved theme: `207539044694`
- published storefront locales: `pl` (primary) + `en`
- strategic source traceability: `docs/SOURCE_TRACEABILITY.md`
- criterion-by-criterion evidence map: `docs/ASTRA_TASK_EVIDENCE.md`

## Ważna korekta jakościowa

Nie traktuj runu `36585623940` jako ostatecznego dowodu deployment integrity.

Browser QA było wtedy zielone, ale analiza logu wykazała, że Shopify odrzucił `templates/page.contact.json` z powodu niedozwolonego atrybutu w ustawieniu rich text, a CLI mimo tego zakończył push kodem 0. Ten false positive został potraktowany jako realny defect procesu.

Po wykryciu problemu:
- poprawiono Contact eyebrow jako osobną sekcję `custom-liquid`,
- włączono Theme Check przed deployem,
- `theme push` używa `--strict`,
- stderr Shopify jest analizowany pod kątem odrzuconych plików,
- wynik JSON musi potwierdzić właściwy theme ID,
- strict Theme Check ujawnił nieużywane storefront locales bez kluczy Amoura,
- Shopify Admin GraphQL potwierdził, że opublikowane są wyłącznie PL i EN,
- nieopublikowane storefront locale JSON zostały usunięte; schema locale files pozostawiono.

**Deployment integrity jest osobnym kryterium akceptacji i ma być zweryfikowane w finalnym runie, nie tylko przez browser audit.**

## Zadania i oczekiwany dowód

| # | Zadanie | Wynik | Focused evidence |
| --- | --- | --- | --- |
| 1 | Section rendering / header hydration | kontrakt odpowiedzi, race handling, real internal navigation, header menu/cart | 15 testów: 5 scenariuszy × mobile/tablet/desktop |
| 2 | Full-page screenshots | pełny capture mimo custom scroll container + DPR + non-sticky capture header | 3 projekty Playwright |
| 3 | Touch targets / reflow | komponentowe 44px fixes, focus, overflow, 200% reflow equivalent | 5 testów |
| 4 | Email flows | notification ≠ newsletter ≠ contact; required e-mail; success/error states | 2 testy |
| 5 | PL/EN consistency | Klub/Club hydration, missing translations, copy hygiene, core routes | 2 testy |
| 6 | Klub content rhythm | 12 rytuałów, 4 tygodnie × 2/5/10 min, real articles, expert flags | dokument + redakcyjny DoD |
| 7 | SEO basics | server HTML: title, one H1, canonical, OG, no accidental noindex | 14 tras PL/EN |
| QA | Full storefront audit | crawl + runtime/accessibility/screenshots | mobile/tablet/desktop |
| Cross-cutting | Review readiness | docs↔code consistency, deploy contract, supported locales | `tests/ux/review-readiness.spec.ts` |

## Deployment integrity

Astra ma sprawdzić `scripts/theme-push.sh` oraz log finalnego runu.

Wymagane:
1. exact store guard,
2. exact theme ID guard,
3. MAIN/LIVE role guard,
4. `theme check --fail-level error`,
5. `theme push --strict`,
6. failure przy Shopify error panel / rejected file,
7. JSON confirmation właściwego theme ID,
8. brak odrzuconych plików w finalnym logu.

Jeśli którykolwiek z tych punktów nie jest spełniony, zielony browser audit nie wystarcza do akceptacji.

## Pliki do review

### Zasady i produkt
- `AGENTS.md`
- `docs/PRODUCT.md`
- `docs/BRAND_PRINCIPLES.md`
- `docs/UX_PRINCIPLES.md`
- `docs/PRIVACY_PRINCIPLES.md`
- `docs/SOURCE_TRACEABILITY.md`

### Zadania i dowody
- `docs/MODEL_HANDOFFS.md`
- `docs/ASTRA_TASK_EVIDENCE.md`
- `docs/HANDOFF_01_DIAGNOSIS.md`
- `docs/HANDOFF_02_SCREENSHOTS.md`
- `docs/HANDOFF_03_TOUCH_TARGETS.md`
- `docs/HANDOFF_04_EMAIL_FLOWS.md`
- `docs/HANDOFF_05_LANGUAGE_CONSISTENCY.md`
- `docs/HANDOFF_06_CLUB_CONTENT_RHYTHM.md`
- `docs/BACKLOG_DOD_STATUS.md`
- `docs/FINAL_BACKLOG_REVIEW.md`
- `docs/REPO_HYGIENE.md`

### Implementacja / QA
- `scripts/theme-push.sh`
- `assets/section-renderer.js`
- `assets/predictive-search.js`
- `sections/amoura-club.liquid`
- `templates/page.contact.json`
- `tests/helpers/full-page-screenshot.ts`
- wszystkie focused suites w `tests/ux/`
- `.github/workflows/deploy-test-theme.yml`

## Materiał wizualny dla review

Success artifact finalnego runu powinien zawierać:
- JSON reports z pełnego storefront auditu,
- full-page screenshots dla home,
- Club,
- collection,
- product,
- article,
na mobile / tablet / desktop.

Failure artifact zawiera pełne `reports/` i `test-results/`.

## Known limitations

- nie testujemy realnego dostarczenia e-maila i nie tworzymy testowych danych użytkowniczki,
- Club #3/#8/#10/#11 wymagają review eksperckiego przed publikacją,
- czterotygodniowy rytm Klubu jest deliverable redakcyjnym, nie opublikowaną funkcją,
- historyczne branche nadal istnieją, ale nie są źródłem auto-deployu,
- obecnie wspierane/publikowane storefront locales to tylko PL i EN; dodanie kolejnego języka wymaga nowego locale payloadu i MatchingTranslations,
- schema locale files mogą istnieć dla języka theme editora i nie oznaczają opublikowanego storefront locale.

## Instrukcja dla Astry

Dla każdego zastrzeżenia podaj:
1. task,
2. severity: blocker / major / minor,
3. plik lub route,
4. obserwowalny problem,
5. naruszone kryterium,
6. dowód,
7. minimal fix.

Szczególnie szukaj:
- false positives w testach,
- partial deploy,
- dokumentacja↔kod↔storefront contradictions,
- accessibility regressions,
- PL/EN hydration problems,
- martwych tras,
- obietnic niepopartych mechanizmem,
- unsupported health/expert/compliance claims,
- naruszeń privacy principles.

Nowe pomysły spoza spisanego zakresu oznacz jako enhancement, nie failure.

## Final evidence

Finalny numer workflow runu, SHA i artifact należy odczytać z najnowszego **successful** `Deploy Shopify TEST Theme` po wdrożeniu strict deployment gate. Nie używaj starszego zielonego runu, jeśli log zawiera rejected theme file.
