# Handoff 02 — wiarygodne zrzuty całych stron

## Final status

**DONE.**

## Przyczyna

Na desktopie realnym kontenerem przewijania jest `.page-wrapper`, a dokument ma ograniczony overflow. Samo `page.screenshot({ fullPage: true })` nie gwarantowało całej strony. PNG na urządzeniach high-DPR ma też fizyczne piksele inne niż CSS px.

## Rozwiązanie

`tests/helpers/full-page-screenshot.ts`:
- przełącza dokument i `.page-wrapper` na normalny flow tylko na czas capture,
- ustawia header jako non-sticky tylko na czas capture,
- resetuje scroll,
- normalizuje wymiary przez `devicePixelRatio`,
- przywraca stan po zrzucie.

## Dowód

`tests/ux/full-page-screenshots.spec.ts`: home, Klub, kolekcja, produkt, artykuł na mobile / tablet / desktop.

Run `36565669479`: **3/3 passed**.
