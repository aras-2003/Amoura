# Handoff 05 — spójność treści i języków

## Final status

**DONE dla pakietu wdrożeniowego.**

## Słownik marki

| Obszar | PL | EN |
| --- | --- | --- |
| Klub | Klub Amoura | Club Amoura |
| Wiedza | Wiedza Amoura / Artykuły | Amoura Journal / Articles |
| opinie | Opinie | Feedback |
| dosprzedaż | dosprzedaż / powiązane opcje | upsell |
| self-care | troska o siebie / samoopieka | self-care |
| sexual wellness | opis potrzeby / intymnego dobrostanu w copy konsumenckim | sexual wellness |
| pauza | półpauza „–” | en dash „–” |

## Zrealizowany pakiet niespójności

| Obecny / wcześniejszy tekst | Problem | Wdrożony kierunek | Plik / miejsce |
| --- | --- | --- | --- |
| „Feedback” | anglicyzm w polskim interfejsie | „Opinie” | `templates/page.contact.json` |
| „sexual wellness i wellbeing” | dwa angielskie terminy w polskim copy | „zdrowie, dobrostan i intymność” / później bardziej naturalne copy | `templates/page.contact.json` |
| „Od czego zacząć z sexual wellness?” | techniczny termin jako landing-page CTA | pytanie o lepsze zadbanie o intymność | `templates/index.json` |
| „Sensualny self-care” | hybryda PL/EN | „Zmysłowa troska o siebie” | `templates/index.json` |
| „kategorie sexual wellness” | kategoria branżowa zamiast języka potrzeby | „nazwy kategorii ani produktów” | `templates/page.collections.json` |
| „regularny self-care” | zbędny anglicyzm | „codzienny rytuał” | `templates/page.collections.json` |
| „automatyczny upsell” | żargon e-commerce | „automatyczna dosprzedaż” | `templates/product.json` |
| „Club Amoura” / „Amoura Club” | niespójna nazwa EN po hydration | „Club Amoura” | `locales/en.default.json`, `layout/theme.liquid` |
| „Klub” jako label bez marki | niespójna nazwa PL | „Klub Amoura” | `locales/pl.json`, header/footer |
| em dash „—” | niezgodne z przyjętym stylem PL | półpauza „–” | guarded przez test storefrontu |

## Linki i prefiksy językowe

- PL i EN core routes są sprawdzane w `tests/ux/language-consistency.spec.ts`.
- pełny storefront audit traktuje trwałe HTTP >=400 jako blocker, więc martwe linki odkrytych tras nie przechodzą niezauważone,
- nie wykonywano masowych zmian handle ani URL.

## Dowód

`tests/ux/language-consistency.spec.ts` obejmuje PL/EN landing pages, FAQ, Klub labels po hydration i missing translations.

Zielony baseline przed ostatnim rozszerzeniem: run `36565669479`, **2/2 passed**. Bieżący `qa:dod` ponownie waliduje rozszerzoną macierz.

## Domknięta decyzja redakcyjna

Tytuł artykułu `od-czego-zaczac` został ujednolicony do: „Od czego zacząć, gdy chcesz lepiej zadbać o swoją intymność?”. Handle pozostał bez zmian.
