# Końcowy przegląd backlogu — Amoura

Data: 2026-09-28  
Baza: `stabilize/backlog-dod`  
Zweryfikowany SHA: `eaade223100a025ba11aa5af5b0e15bd32f2dbca`  
Zielony run: `36488768357`

## Wynik

Zadania #1–#5 spełniają obecny Definition of Done na tym samym SHA:
- section rendering: 9/9
- full-page screenshots: 3/3
- responsive touch/reflow: 5/5
- email flows: 2/2
- language consistency: 2/2
- pełny storefront audit: 3/3

## Konkretne pozostałe problemy / decyzje

### 1. Jeden publiczny tytuł artykułu nadal używa „sexual wellness”
**Źródło:** Shopify, artykuł `/blogs/wiedza/od-czego-zaczac`  
**Obecny tytuł:** „Od czego naprawdę zacząć z sexual wellness?”

Na homepage copy zostało już naturalizowane do polskiego, ale właściwy tytuł artykułu nadal pozostaje anglojęzyczny. To jest niespójność redakcyjna, nie błąd techniczny.

**Rekomendacja do decyzji marki:**  
zmienić tytuł na polski, np. „Od czego zacząć, gdy chcesz lepiej zadbać o swoją intymność?” albo świadomie pozostawić „sexual wellness” jako termin kategorii. Handle może zostać bez zmian.

### 2. Zadanie #6 jest gotowym draftem, ale 4/12 treści wymagają eksperckiego review
**Branch:** `content/club-4-week-rhythm`  
**Dokument:** `docs/HANDOFF_06_CLUB_CONTENT_RHYTHM.md`

Do przeglądu przed publikacją:
- #3 „Co dziś znaczy komfort?”
- #8 „Pytanie bez poprawiania odpowiedzi”
- #10 „Skala komfortu”
- #11 „Co działa, co nie działa”

Powód: dotykają dyskomfortu, zmian wraz z wiekiem albo komunikacji/intymności w obszarze, który może zostać odebrany jako porada zdrowotna/psychologiczna.

### 3. CI ma nieblokujące ostrzeżenia o runtime GitHub Actions
Zielony run raportuje ostrzeżenia:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/upload-artifact@v4`

są uruchamiane na wymuszonym Node 24, bo ich Node 20 jest zdeprecjonowany.

To nie psuje DoD, ale warto zaktualizować akcje do wersji wspierających aktualny runtime przy najbliższym maintenance pass.

### 4. Stare branche diagnostyczne pozostały po zakończonych zadaniach
M.in.:
- `fix/reliable-full-page-screenshots`
- `fix/mobile-touch-targets`
- `fix/email-signup-flows`
- `fix/content-language-consistency`

Nie usuwam ich automatycznie. Po decyzji o sposobie integracji można je zamknąć/usunąć.

### 5. Brak testu realnego dostarczenia e-maila jest świadomym ograniczeniem
DoD #4 potwierdza:
- poprawność formularzy,
- rozdzielenie semantyki,
- walidację pól,
- success/error UI.

Nie potwierdza faktycznego dostarczenia wiadomości, ponieważ test nie wysyła danych użytkownika. To jest zgodne z przyjętym zakresem.

## Brak znalezionych blockerów

W obecnym zweryfikowanym stanie nie ma blockerów dla:
- header/search hydration,
- full-page QA,
- kluczowej responsywności,
- celów dotykowych,
- głównych przepływów formularzy,
- bazowej spójności PL/EN.

## Co dalej

Najbardziej wartościowa kolejność:
1. decyzja o publicznym użyciu terminu „sexual wellness” po polsku,
2. eksperckie review 4 pozycji z rytmu Klubu,
3. publikacja/implementacja rotacji treści Klubu dopiero po zatwierdzeniu,
4. maintenance CI i porządek branchy.

Nie mergować ani nie publikować nowych treści Klubu bez osobnej decyzji.
