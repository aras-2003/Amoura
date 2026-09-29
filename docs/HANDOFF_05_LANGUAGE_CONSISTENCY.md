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

`tests/ux/language-consistency.spec.ts` obejmuje PL/EN landing pages, FAQ, Klub labels po hydration, missing translations oraz wszystkie 8 opublikowanych polskich artykułów Wiedzy.

Focused language contract składa się z **3 testów**: PL core routes, EN core routes oraz 8 live PL knowledge articles. Finalny wynik należy odczytać z runu o `head_sha` równym aktualnemu `main`.

## Supported locales

Shopify Admin potwierdza obecnie dwa opublikowane storefront locales: `pl` (primary) i `en`. Dlatego strict Theme Check jest utrzymywany tylko dla tych dwóch storefront locale payloadów; schema locale files pozostają dla theme editora.

## Domknięta decyzja redakcyjna

Tytuł artykułu `od-czego-zaczac` został ujednolicony do: „Od czego zacząć, gdy chcesz lepiej zadbać o swoją intymność?”. Handle pozostał bez zmian.

Dodatkowo live CMS copy w artykułach `sensualny-self-care-15-minut` i `komfort-intymny-po-40` zostało oczyszczone z konsumenckiego użycia „self-care”. Legacy handle pozostaje bez zmian, aby nie wykonywać nieuzasadnionej migracji URL. Stan CMS dokumentuje `docs/SHOPIFY_CONTENT_STATE.md`.
