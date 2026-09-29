# Source traceability — Amoura prototype

Purpose: make it easy for Astra to distinguish source-derived product direction from implementation choices and later hardening work.

## Primary attached sources

1. `Projekt doradczy - iPad.pdf`
2. `Sexual_wellness_29-06-2026.pdf`
3. `Sexual_wellness_krótsza_wersja_29-06-2026.pdf`

These are product / strategy sources, not proof that Amoura is already an operating business.

## Source-derived direction used in the storefront

| Direction | Source support | How it appears in repo |
| --- | --- | --- |
| Mature women as the core audience | `Projekt doradczy - iPad.pdf`, target-segment research around p. 51 identifies women 35+ and the synthesis around p. 129 names mature women / 35–65 as the strongest opportunity; `Sexual_wellness_29-06-2026.pdf` frames mature women as the core opportunity | `AGENTS.md`, `docs/PRODUCT.md`, readability/touch/reflow work |
| Community → education → products | `Sexual_wellness_29-06-2026.pdf` explicitly describes the three pillars and the sequence in which trust/education precede purchase | About, Club, Knowledge, curated collection structure |
| “Sales is an effect, not the starting point” | `Sexual_wellness_29-06-2026.pdf`: trust → education → products; purchase readiness follows reduction of shame and improved language/confidence | no product CTA inside the Club rituals; editorial content before commerce |
| Club as belonging / safe space | `Sexual_wellness_29-06-2026.pdf` describes community, belonging and a safe space as a growth/retention engine | Klub Amoura positioning and four-week content rhythm |
| Education as a barrier-reduction mechanism | both long source documents emphasize education, expert context and trust | Wiedza Amoura, article flows, expert-review flags |
| Curated rather than catalogue-first commerce | source materials describe curated products and collections rather than undifferentiated catalogue scale | four collection entry points, curated product context |
| Four collection directions | `Sexual_wellness_krótsza_wersja_29-06-2026.pdf`: Renaissance, Midlife Premium Intimacy, Perennial Rituals, Menopause Comfort & Pleasure | `templates/page.collections.json` and matching Shopify collections |
| Discretion and trust | `Projekt doradczy - iPad.pdf` repeatedly identifies discretion, anonymity in sensitive research contexts and trust as important in the category | privacy principles, restrained copy, dedicated form semantics |
| Polish market as first validation context | `Projekt doradczy - iPad.pdf`, market-target section around p. 85, sets Poland as the first market and CEE as a later expansion direction | PL is primary Shopify locale; EN is the only additional published locale |

## Implementation choices that are NOT claims from the source documents

The following are engineering/product choices made for this prototype and should not be presented as findings from the PDFs:
- exact Shopify theme architecture,
- direct-main CI workflow,
- Playwright acceptance suites,
- 44 px component fixes,
- screenshot implementation,
- Section Rendering race fix,
- exact four-week ritual wording,
- SEO smoke checks,
- exact color hex values,
- exact e-mail form implementation.

## Claims deliberately treated with caution

The source materials contain market-size, growth, spending and CAC/LTV statements. This storefront work does **not** use those figures as validated public claims.

Likewise, source references to expert collaboration describe the intended model. The current prototype must not imply that named or contracted experts already exist unless separately verified.

## Prototype honesty

Current repo policy therefore distinguishes:
- **strategy direction** — supported by the attached source documents,
- **prototype implementation** — present in code and TEST storefront,
- **future operating model** — not yet implemented,
- **health/expert statements** — require appropriate verification before publication where marked.

Astra should flag any place where the storefront collapses these categories and presents a future or strategic assumption as an existing operational fact.
