# Backlog DoD — status integracyjny

Gałąź integracyjna: `qa/backlog-dod`

Zadanie uznajemy za zamknięte dopiero, gdy jego testy oraz pełny audit przejdą na tym samym SHA wdrożonym na MAIN TEST theme `207539044694`.

| # | Zadanie | Dowód / test | Status przed końcowym gate |
| --- | --- | --- | --- |
| 1 | Section rendering / header | `tests/ux/section-rendering.spec.ts` | 15/15 pass na ostatnim przebiegu; obejmuje transient 503, search stress, internal nav i history |
| 2 | Full-page screenshots | `tests/ux/full-page-screenshots.spec.ts` | 3/3 projekty pass |
| 3 | Touch targets | `tests/ux/touch-targets.spec.ts` | 360/390/768/1440 pass; finalny test 200% reflow do potwierdzenia |
| 4 | Email / zgody | `tests/ux/email-flows.spec.ts`, `docs/HANDOFF_04_EMAIL_FLOWS.md` | pass po dodaniu rzeczywistego `required` do contact email; dostarczenie wiadomości nieweryfikowane |
| 5 | Język | `tests/ux/language-consistency.spec.ts`, `docs/HANDOFF_05_LANGUAGE_CONSISTENCY.md` | pass w ostatnim przebiegu |

## Gate
`npm run qa:dod` uruchamia sekwencyjnie:
1. section rendering,
2. full-page screenshots,
3. touch targets,
4. email flows,
5. language consistency,
6. pełny audit storefrontu.

Artefakty obejmują `reports/` i `test-results/`.

## Zasada końcowa
Nie oznaczamy zadania jako Done na podstawie osobnego zielonego testu, jeśli pełny skonsolidowany gate na tym samym SHA nie jest zielony.
