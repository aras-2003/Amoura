# Końcowy przegląd backlogu — stan do weryfikacji przez Astrę

## Wynik

Pakiet #1–#7 ma zapisane kryteria, implementację, focused tests i pełny QA gate.

Dowodem końcowym nie jest historyczny numer runu zapisany na sztywno w dokumentacji. Astra ma użyć:
- aktualnego `main`,
- najnowszego successful `Deploy Shopify TEST Theme`,
- wyłącznie jeśli `head_sha` runu jest równe aktualnemu `main`,
- oraz sprawdzić deploy log pod kątem odrzuconych plików.

## Defect procesu znaleziony przed finalnym review

Wcześniejszy browser-green run nie był wystarczającym dowodem: Shopify odrzucił jeden plik template, mimo że CLI zakończył push zerowym exit code.

Naprawiono zarówno plik, jak i proces:
- Contact eyebrow przeniesiono do prawidłowej sekcji `custom-liquid`,
- Theme Check jest blokującym pre-checkiem,
- push działa z `--strict`,
- stderr jest analizowany pod kątem file rejection,
- JSON musi potwierdzić target theme ID.

To jest teraz część DoD.

## Brak znanych blockerów po spełnieniu finalnego gate

Pakiet jest przygotowany tak, aby końcowy reviewer sprawdził:
- header/search hydration,
- full-page QA,
- responsywność i touch targets,
- formularze i semantykę zapisu,
- spójność PL/EN,
- SEO basics,
- source traceability,
- privacy principles,
- deployment integrity,
- pełny storefront audit z 0 critical, 0 serious i 0 standalone touch-target warnings,
- live Shopify CMS article copy objęte testem language consistency.

## Świadome ograniczenia

1. **Dostarczenie e-maila:** realna wiadomość nie jest wysyłana w QA.
2. **Klub #6:** #3, #8, #10 i #11 wymagają eksperckiego review przed publikacją.
3. **Klub #6:** 4-tygodniowy rytm jest deliverable redakcyjnym, nie wdrożoną rotacją.
4. **Locales:** storefront publikuje wyłącznie PL i EN. Dodanie kolejnego języka wymaga nowego locale payloadu i MatchingTranslations.
5. **Historyczne branche:** pozostają jako historia, ale nie są źródłem automatycznego deployu.

## Rzeczy uporządkowane

- canonical branch = `main`,
- auto-deploy tylko z `main`,
- GitHub Actions v7,
- Node 22,
- Shopify CLI przypięte do wersji,
- strict theme validation/deploy,
- manual snapshot i manual UX workflow bez starych auto-triggerów,
- draft PR #3 i #4 zamknięte jako superseded,
- success artifact zawiera runtime deploy proof, review manifest, raporty + kluczowe full-page screenshots,
- failure artifact zawiera pełną diagnostykę,
- PR template z DoD,
- source traceability,
- Astra evidence matrix i adversarial review prompt.

## Kryterium zastrzeżenia dla Astry

Każde zastrzeżenie powinno zawierać:
1. task,
2. severity,
3. plik / trasę,
4. obserwowalny problem,
5. naruszone kryterium,
6. dowód,
7. minimal fix.

Ogólna sugestia stylistyczna albo rozszerzenie zakresu to enhancement, nie failure istniejącego DoD.
