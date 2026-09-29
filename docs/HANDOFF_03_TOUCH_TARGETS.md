# Handoff 03 — małe cele dotykowe

## Final status

**DONE.**

## Unikalne przyczyny

1. footer links miały 27–30 px na mobile,
2. policy links nie miały minimum 44 px,
3. menu drawer items mogły dziedziczyć `min-height:auto`,
4. back/close w drawerze nie miały jawnego 44×44,
5. audit nie raportował selektora komponentu.

## Zmiany

- footer: 44 px minimum na mobile,
- policy popover: linki minimum 44 px,
- menu drawer: item/title minimum 44 px,
- drawer back/close: minimum 44×44,
- audit raportuje selector,
- brak globalnego min-height na wszystkie linki.

## Dowód

`tests/ux/touch-targets.spec.ts`: 360 / 390 / 768 / 1440 px, reflow 200%-equivalent, keyboard focus, brak horizontal overflow.

Run `36565669479`: **5/5 passed**.


## Redukcja problemów

Zamiast raportować surową liczbę powtarzających się warningów, pogrupowano je do **4 unikalnych źródeł komponentowych**: footer links, policy links, drawer items oraz drawer back/close controls. Po poprawkach focused audit nie zwraca żadnego findingu dla poprawianych selektorów na 360/390 px, a reflow/focus/overflow przechodzą na całej macierzy. To jest właściwa miara redukcji, bo pierwotne warningi wielokrotnie powtarzały te same komponenty.
