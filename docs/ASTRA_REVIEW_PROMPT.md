# Prompt do finalnego review w Astrze

Pracujesz jako niezależny, adversarial reviewer repozytorium `aras-2003/Amoura`.

## Zakres i źródło prawdy

1. Użyj wyłącznie aktualnego `main`.
2. Zacznij od:
   - `docs/ASTRA_REVIEW_PACKET.md`,
   - `docs/ASTRA_TASK_EVIDENCE.md`,
   - `docs/MODEL_HANDOFFS.md`.
3. Następnie porównaj je z:
   - `AGENTS.md`,
   - `docs/PRODUCT.md`,
   - `docs/BRAND_PRINCIPLES.md`,
   - `docs/UX_PRINCIPLES.md`,
   - `docs/PRIVACY_PRINCIPLES.md`,
   - handoffami 01–06,
   - focused tests w `tests/ux/`,
   - aktualnym storefrontem TEST.
4. Zweryfikuj zadania #1–#7 wyłącznie wobec ich własnych kryteriów odbioru. Nową sugestię spoza zakresu oznacz jako enhancement, nie failure.

## Najważniejsza zasada dowodowa

Nie uznawaj samego zielonego browser auditu za dowód wdrożenia.

Sprawdź także log deployu. Shopify CLI potrafi odrzucić pojedynczy plik motywu przy zerowym exit code. Aktualny pakiet ma temu przeciwdziałać przez Theme Check, `theme push --strict`, analizę stderr i weryfikację JSON target theme. Jeśli w logu aktualnego dowodowego runu występuje odrzucony plik, error panel Shopify albo brak jednoznacznego potwierdzenia target theme, traktuj cały run jako nieważny dowód DoD.

## Czego szukać szczególnie

- false positives w testach;
- dokumentacja↔kod↔storefront contradictions;
- partial deploy / rejected theme files;
- regresje responsive, keyboard, focus i touch targets;
- niespójności PL/EN po hydration;
- martwe lub nieistniejące trasy;
- nieuczciwe semantycznie formularze lub zgody;
- niepoparte mechanizmem obietnice;
- unsupported health / expert / compliance claims;
- różnice między „deliverable redakcyjny” a opublikowaną funkcjonalnością;
- źródła danych wrażliwych, tracking i metadata exposure niezgodne z privacy principles.

## Format każdego problemu

Podaj:
1. task,
2. severity: blocker / major / minor,
3. plik lub route,
4. obserwowalny problem,
5. naruszone kryterium,
6. dowód,
7. minimal fix.

Nie zgłaszaj ogólnego „można ulepszyć design” jako failure bez wskazania naruszonego wymagania.

## Wynik końcowy

Zwróć:
- blockers,
- majors,
- minors,
- enhancements,
- werdykt DoD osobno dla #1–#7,
- werdykt **deployment integrity**,
- listę ograniczeń, które są prawidłowo jawne i nie powinny blokować akceptacji.

Jawne ograniczenia z review packetu nie są błędami, chyba że kod, UI lub copy im przeczy.
