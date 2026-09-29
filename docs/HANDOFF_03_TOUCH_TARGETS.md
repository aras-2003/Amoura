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

Pierwszy pass naprawił źródłowe komponenty:
- footer: 44 px minimum na mobile,
- policy popover: linki minimum 44 px,
- menu drawer: item/title minimum 44 px,
- drawer back/close: minimum 44×44,
- audit raportuje selector,
- brak globalnego min-height na wszystkie linki.

Końcowy hardening przed review Astry objął dodatkowo problemy znalezione przez pełny crawl:
- hamburger menu: jawne minimum 44×44,
- logo/home link na mobile: minimum 44 px wysokości,
- quantity input na PDP: minimum 44×44 i szerszy selector,
- samodzielne editorial CTA na home/PDP/article: minimum 44 px,
- Club links i privacy link: minimum 44 px,
- accelerated checkout usunięty z prototypowego PDP, ponieważ zewnętrzny iframe generował niedostępne elementy i nie jest potrzebny do walidacji obecnego konceptu.

Audit 44 px świadomie wyłącza zwykłe linki inline osadzone w bieżącym tekście; nadal obejmuje samodzielne kontrolki i CTA.

## Dowód

`tests/ux/touch-targets.spec.ts`: 360 / 390 / 768 / 1440 px, reflow 200%-equivalent, keyboard focus, brak horizontal overflow.

Focused contract: **5/5 passed** w finalnym `qa:dod`; dowód wybieramy po zgodności `head_sha` runu z aktualnym `main`.


## Redukcja problemów

Pierwotne warningi były silnie zduplikowane między trasami. Końcowy odbiór nie opiera się już na historycznej liczbie warningów, tylko na dwóch warstwach:
1. focused test: macierz 360/390/768/1440 + reflow/focus/overflow,
2. pełny storefront audit: brak findingów `critical` i `serious` na mobile/tablet/desktop.

Dodatkowo standalone touch targets poniżej 44 px pozostają raportowane jako warning i mają być przejrzane w finalnym artifact przed przekazaniem Astrze.
