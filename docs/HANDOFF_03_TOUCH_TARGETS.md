# Handoff 03 — cele dotykowe

## Unikalne przyczyny
Przed zmianą ostrzeżenia skupiały się wokół kilku wspólnych komponentów, a nie dziesiątek niezależnych błędów:

1. Editorial footer na mobile miał linki o wysokości około 30 px.
2. Linki w popoverze „Warunki i polityki” miały padding, ale bez gwarantowanej wysokości celu dotykowego.
3. Zagnieżdżone elementy mobilnego drawer menu mogły spaść do wysokości wynikającej tylko z tekstu; przyciski back/close również nie miały niezależnej gwarancji 44 px.
4. Audyt podawał tekst elementu, ale nie selector, przez co grupowanie powtarzalnych problemów było słabe.

## Zmiany
- mobile footer links: minimum 44 px,
- policy links: minimum 44 px,
- mobile menu / title / back / close: minimum 44 px,
- raport audytu zawiera selector elementu,
- brak globalnego `min-height` na wszystkie linki.

## Pokrycie DoD
`tests/ux/touch-targets.spec.ts` sprawdza:
- 360×800,
- 390×844,
- 768×1024,
- 1440×1000,
- brak poziomego overflow,
- brak małych celów w kluczowych komponentach,
- brak nakładania celów,
- możliwość uzyskania widocznego focusu klawiaturą,
- odpowiednik 200% browser zoom przez viewport 720 CSS px dla okna 1440 px.

Nie używamy `CSS zoom: 2`, ponieważ skaluje dokument po layoutcie i generuje sztuczne overflow, które nie odpowiada reflow przeglądarki przy realnym zoomie.

## Ostatni potwierdzony wynik
Podstawowe szerokości 360/390/768/1440 przeszły. Test 200% został poprawiony na model reflow i oczekuje końcowego zielonego przebiegu `qa:dod`.
