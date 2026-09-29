# ASTRA REVIEW PACKET — Amoura

## Cel

Niezależnie zweryfikować, czy zadania #1–#7 zostały wykonane zgodnie z ich kryteriami, bez ukrytych regresji, problemów dostępności, niespójności strategii lub nieprawdziwych obietnic.

## Źródło prawdy

- repo: `aras-2003/Amoura`
- branch: `main`
- TEST storefront: `jksgiq-r4.myshopify.com`
- theme: `207539044694`
- ostatni zielony baseline: `a068c9eca747478552f1852d135ee70fb0d598ef`
- workflow run: `36565669479`
- QA artifact: `11032276126`

## Zadania i rezultaty

| # | Zadanie | Rezultat | Dowód |
| --- | --- | --- | --- |
| 1 | Section rendering / header hydration | walidowany kontrakt + ograniczenie race predictive search | 9/9 |
| 2 | Full-page screenshots | poprawny capture mimo custom scroll-containera | 3/3 |
| 3 | Touch targets / reflow | komponentowe poprawki + focus/overflow/reflow | 5/5 |
| 4 | Email flows | rozdzielone notification/contact/newsletter semantics | 2/2 |
| 5 | PL/EN consistency | stabilne Klub/Club + language guards | 2/2 |
| 6 | Klub content rhythm | 12 rytuałów, 4 tygodnie, 2/5/10 min | dokument + DoD |
| 7 | SEO basics | H1/title/canonical/OG/noindex guard | 7/7 |
| QA | Full storefront | mobile/tablet/desktop | 3/3 |

## Pliki do review

- `docs/MODEL_HANDOFFS.md`
- `docs/HANDOFF_01_DIAGNOSIS.md` … `HANDOFF_06_CLUB_CONTENT_RHYTHM.md`
- `docs/BACKLOG_DOD_STATUS.md`
- `docs/FINAL_BACKLOG_REVIEW.md`
- `docs/REPO_HYGIENE.md`
- focused tests w `tests/ux/`
- aktualny diff `main`

## Known limitations

- nie testowano realnego dostarczenia e-maila,
- Club #3/#8/#10/#11 wymagają review eksperckiego przed publikacją,
- 4-tygodniowy rytm nie został opublikowany,
- historyczne branche nadal istnieją, ale nie deployują,
- jeden tytuł artykułu Shopify zawiera „sexual wellness” — decyzja redakcyjna marki.

## Instrukcja dla Astry

Dla każdego zastrzeżenia podaj:
1. numer zadania,
2. severity: blocker / major / minor,
3. plik lub trasę,
4. obserwowalny problem,
5. naruszone kryterium,
6. dowód,
7. minimal fix.

Nie traktuj rozszerzenia zakresu jako failure. Nie akceptuj natomiast false positive w testach, sprzeczności dokumentacja↔kod, pozornej dostępności ani obietnicy, której system nie realizuje.
