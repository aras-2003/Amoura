# Amoura — zadania i kryteria odbioru

## Aktualny kontekst wykonawczy

Źródło wykonawcze: `main`.

Repo: `aras-2003/Amoura`  
Sklep TEST: `jksgiq-r4.myshopify.com`  
Motyw: `207539044694`  
Automatyczny deploy: wyłącznie z `main`.

Amoura ma spokojny, redakcyjny charakter: ciepłe jasne tła, burgund / neutralny śliwkowy, czytelna typografia, odbiorczynie dojrzałe. Nie wymyślamy ekspertów, efektów zdrowotnych, benefitów członkostwa ani działających integracji. Zachowujemy natywne mechanizmy Shopify i jawnie oddzielamy prototyp od obietnic operacyjnych.

## Status pakietu

| # | Zadanie | Status | Główny dowód |
| --- | --- | --- | --- |
| 1 | Section rendering / header hydration | DONE | `tests/ux/section-rendering.spec.ts` |
| 2 | Wiarygodne full-page screenshots | DONE | `tests/ux/full-page-screenshots.spec.ts` |
| 3 | Touch targets / responsive reflow | DONE | `tests/ux/touch-targets.spec.ts` |
| 4 | Email flows / consent semantics | DONE | `tests/ux/email-flows.spec.ts` |
| 5 | Spójność PL/EN i copy hygiene | DONE | `tests/ux/language-consistency.spec.ts` |
| 6 | 4-tygodniowy rytm treści Klubu | DONE jako deliverable redakcyjny, nieopublikowany | `docs/HANDOFF_06_CLUB_CONTENT_RHYTHM.md` |
| 7 | SEO smoke / core metadata | DONE | `tests/ux/seo-basics.spec.ts` |

## Definition of Done

Zadanie techniczne uznajemy za zamknięte wyłącznie wtedy, gdy:
1. ma skupiony test odbiorowy,
2. test przechodzi w `npm run qa:dod`,
3. pełny storefront audit przechodzi na tym samym SHA,
4. ograniczenia i rzeczy nieweryfikowane są zapisane w dokumentacji.

Zadanie redakcyjne #6 ma osobny DoD: komplet 12 propozycji, realne istniejące artykuły, brak obietnic zdrowotnych, oznaczone pozycje do review eksperckiego i brak automatycznej publikacji.

## 1. Section rendering / header hydration

**Cel:** usunąć źródło komunikatów „header section missing” / „No empty section markup found” bez wyciszania błędów.

**Wdrożone:** walidacja odpowiedzi Section Rendering, brak traktowania błędnej odpowiedzi jako poprawnego HTML, obsługa abort signal i ograniczenie wyścigu predictive search.

**Odbiór:** kontrakt sekcji, szybka nawigacja i reset predictive search na mobile / tablet / desktop.

## 2. Wiarygodne zrzuty całych stron

**Cel:** full-page screenshot ma obejmować realną całą stronę mimo customowego scroll-containera.

**Wdrożone:** tryb screenshotowy przełącza `.page-wrapper` na document flow, normalizuje DPR i tymczasowo wyłącza sticky header tylko podczas capture.

## 3. Małe cele dotykowe

**Cel:** usunąć małe cele dotykowe w problematycznych komponentach bez globalnego hacka.

**Wdrożone:** footer, policy links, drawer items i drawer controls; testy 360 / 390 / 768 / 1440 oraz reflow odpowiadający 200% zoom, fokus klawiatury i brak poziomego scrolla.

## 4. Zapisy e-mail i zgody

**Cel:** jednoznacznie rozdzielić powiadomienie Klubu, formularz kontaktowy i potencjalny newsletter.

**Wdrożone:** Klub korzysta z `form 'contact'` i nie udaje newslettera ani członkostwa. Stopka nie ma konkurującego newslettera. Faktyczne dostarczenie maila pozostaje świadomie nieweryfikowane.

## 5. Spójność treści i języków

**Cel:** stabilne `Klub Amoura / Club Amoura`, spójna nazwa Wiedzy, brak oczywistych anglicyzmów w PL i brak missing translations.

**Wdrożone:** słownik marki, poprawki copy, stabilizacja labela po hydration oraz test PL/EN.

## 6. Rytm treści Klubu

**Cel:** przygotować 4 tygodnie treści dających powód do powrotu bez presji zakupowej.

**Wynik:** 12 rytuałów, po 3 na tydzień (2/5/10 min), każdy spięty z istniejącym artykułem. Pozycje 3, 8, 10 i 11 wymagają review eksperckiego przed publikacją. Publikacja nie jest częścią zadania.

## 7. SEO basics

**Cel:** zabezpieczyć podstawy SEO dla kluczowych tras.

**Odbiór:** sensowny title, dokładnie jeden widoczny H1, canonical, OG title/url/description i brak przypadkowego noindex.

## Końcowy przegląd dla Astry

Astra powinna otrzymać:
- `docs/ASTRA_REVIEW_PACKET.md`,
- ten dokument,
- handoffy 01–06,
- `docs/BACKLOG_DOD_STATUS.md`,
- raporty z zielonego workflow,
- diff bieżącego `main`.

Recenzja ma wskazywać wyłącznie konkretne problemy z plikiem, dowodem i wpływem. Rozszerzenie zakresu to enhancement, nie failure istniejącego zadania.
