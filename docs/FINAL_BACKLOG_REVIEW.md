# Końcowy przegląd backlogu — stan do weryfikacji przez Astrę

## Wynik

Pakiet #1–#7 ma komplet kryteriów, implementacji i automatycznych dowodów. Ostatni w pełni zielony baseline to run `36565669479` na SHA `a068c9ec`.

Nie znaleziono blockerów dla:
- header/search hydration,
- full-page QA,
- responsywności i touch targets,
- formularzy i semantyki zapisu,
- bazowej spójności PL/EN,
- podstaw SEO,
- pełnego storefront auditu.

## Świadome ograniczenia, nie ukryte braki

1. **Dostarczenie e-maila:** nie wykonano realnego wysłania testowej wiadomości. Zadanie #4 sprawdza formularz, walidację, semantykę i UI.
2. **Klub #6:** 4/12 propozycji (#3, #8, #10, #11) wymaga eksperckiego review przed publikacją. Draft nie jest opublikowany.
3. **Historyczne branche:** pozostają w repo jako historia, ale nie mogą automatycznie deployować. Canonical branch to `main`.

## Rzeczy uporządkowane

- GitHub Actions v7.
- Shopify CLI przypięte do konkretnej wersji.
- auto-deploy ograniczony do `main`.
- draft PR #3 i #4 zamknięte jako superseded.
- lekkie artefakty QA przy success, pełne diagnostyki przy failure.
- PR template z DoD.
- SEO smoke w skonsolidowanym gate.

## Kryterium zastrzeżenia dla Astry

Każde zastrzeżenie powinno zawierać:
1. konkretne zadanie,
2. plik / trasę,
3. obserwowalny problem,
4. naruszone kryterium,
5. dowód,
6. minimalną poprawkę.

Ogólna sugestia stylistyczna albo rozszerzenie zakresu to enhancement, nie failure istniejącego DoD.
