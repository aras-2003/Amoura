# Handoff 04 — zapisy e-mail i zgody

## Final status

**DONE w uzgodnionym zakresie.**

## Mapa przepływów

| Kontekst | Mechanizm | Uczciwie deklarowany efekt |
| --- | --- | --- |
| Klub Amoura | `form 'contact'` | prośba o wiadomość przy otwarciu Klubu; nie newsletter i nie płatne członkostwo |
| Kontakt | `form 'contact'` | wiadomość kontaktowa |
| Newsletter | brak aktywnego formularza w stopce / Klubie | przyszły osobny flow wymaga `form 'customer'` i własnej zgody |

## Stan

- brak konkurującego newslettera w stopce,
- jeden formularz Klubu,
- wymagany e-mail,
- jawny cel zapisu,
- success/error UI.

## Dowód

`tests/ux/email-flows.spec.ts`, run `36565669479`: **2/2 passed**.

Faktyczne dostarczenie wiadomości nie było testowane i pozostaje jawnie poza DoD.
