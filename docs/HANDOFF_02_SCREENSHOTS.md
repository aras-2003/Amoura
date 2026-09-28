# Handoff 02 — wiarygodne zrzuty całych stron

## Przyczyna

Na desktopie realnym kontenerem przewijania jest `.page-wrapper`, podczas gdy dokument używa ograniczonego overflow. Samo `page.screenshot({ fullPage: true })` nie gwarantowało więc objęcia całej zawartości. Na urządzeniu mobilnym dodatkowo PNG jest zapisywany w pikselach urządzenia, więc surowy wymiar obrazu nie może być porównywany 1:1 z szerokością CSS viewportu.

## Rozwiązanie

`tests/helpers/full-page-screenshot.ts`:
- na czas zrzutu przełącza dokument i `.page-wrapper` na normalny document flow,
- ustawia header jako niesticky wyłącznie na czas zrzutu,
- resetuje scroll do góry,
- zapisuje pełny PNG,
- normalizuje wymiar PNG przez `devicePixelRatio`,
- usuwa tymczasowe style po zrzucie.

Nie zmienia to zachowania sklepu dla użytkownika.

## DoD

Dedykowany test obejmuje:
- home,
- Klub Amoura,
- kolekcję,
- produkt,
- artykuł,
- projekty Playwright mobile / tablet / desktop,
- kontrolę pełnej wysokości w CSS px,
- kontrolę, że header nie jest sticky w pełnym zrzucie,
- osobne zrzuty góry i dołu artykułu.

Status zadania jest **zamknięty dopiero po zielonym przebiegu CI na branchu stabilizacyjnym**.
