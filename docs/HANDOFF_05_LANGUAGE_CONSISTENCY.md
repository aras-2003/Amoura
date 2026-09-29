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

## Wdrożone

- usunięte oczywiste anglicyzmy z PL,
- `Klub Amoura / Club Amoura` stabilne także po header hydration,
- brak missing translations w kluczowych trasach,
- guard przeciw em dash w polskim storefront copy.

## Dowód

`tests/ux/language-consistency.spec.ts`, run `36565669479`: **2/2 passed**.

Publiczny tytuł jednego artykułu Shopify z terminem „sexual wellness” pozostaje świadomą decyzją redakcyjną marki, nie błędem motywu.
