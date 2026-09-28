# Handoff 02 — wiarygodne zrzuty całych stron

## Problem
Motyw używa własnego kontenera przewijania `.page-wrapper` na desktopie. Standardowe `page.screenshot({ fullPage: true })` potrafiło więc zapisać jedynie wysokość viewportu zamiast pełnej strony. Dodatkowo obrazy PNG na urządzeniach o DPR > 1 mają rozmiar w pikselach fizycznych, a nie CSS.

## Rozwiązanie
`tests/helpers/full-page-screenshot.ts` przełącza stronę wyłącznie na czas wykonywania zrzutu w tryb testowy:
- `html`, `body` i `.page-wrapper` dostają dokumentowy przepływ i widoczny overflow,
- sticky header jest tymczasowo ustawiany jako zwykły element dokumentu,
- po wykonaniu zrzutu testowy styl jest usuwany,
- rozmiar PNG jest przeliczany na CSS px przez `devicePixelRatio`.

Zachowanie sklepu dla użytkownika nie jest zmieniane.

## Pokrycie DoD
`tests/ux/full-page-screenshots.spec.ts` obejmuje:
- stronę główną,
- Klub Amoura,
- kolekcję,
- produkt,
- artykuł.

Test działa w projektach mobile, tablet i desktop. Weryfikuje:
- szerokość screenshotu w CSS px,
- wysokość większą niż jeden viewport dla stron przewijalnych,
- brak sticky header w trybie screenshotowym,
- dla artykułu dodatkowo osobny widok góry i dołu.

## Ostatni potwierdzony wynik
W skonsolidowanym przebiegu QA przed końcowym DoD: **3/3 projekty przeszły** (mobile, tablet, desktop).

Końcowe zamknięcie zadania wymaga zielonego przebiegu `qa:dod` na aktualnym SHA.
