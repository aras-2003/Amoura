# Handoff 03 — małe cele dotykowe

## Unikalne przyczyny zidentyfikowane przed zmianą

1. Editorial footer miał linki o wysokości 27–30 px na mobile.
2. Linki wewnątrz popovera „Warunki i polityki” miały tylko padding 8 px i brak minimalnej wysokości.
3. Zagnieżdżone pozycje menu drawer mogły dziedziczyć `min-height:auto`.
4. Kontrolki back/close w drawerze nie miały jawnego minimum 44×44 px.
5. Audyt raportował tylko tag i tekst, więc powtarzające się problemy nie dawały się wiarygodnie grupować po komponencie.

Quantity selector już używa wspólnego `--minimum-touch-target`; nie zmieniano go bez dowodu problemu. Nie dodano globalnego `min-height` do wszystkich linków.

## Zmiany

- footer: 44 px minimum tylko na mobile,
- policy popover: linki minimum 44 px,
- menu drawer: item/title minimum 44 px na mobile,
- drawer back/close: minimum 44×44 px,
- audit: raportuje selector problematycznego celu,
- test: 360 / 390 / 768 / 1440 px, brak poziomego scrolla, fokus klawiatury oraz reflow odpowiadający 200% zoom.

## DoD

Zadanie jest **zamknięte dopiero**, gdy:
- dedykowany test jest zielony,
- pełny audit nie zgłasza blockerów,
- w raporcie mobile nie ma ostrzeżeń z poprawianych komponentów,
- nie ma regresji poziomego scrolla ani niewidocznego focusu.

Końcową liczbę ostrzeżeń przed/po należy wpisać po zielonym przebiegu CI.
