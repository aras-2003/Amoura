# Shopify content state — Astra review

Verified: 2026-09-29 via Shopify Admin GraphQL.

The article bodies live in Shopify CMS, not in this Git repository. Their rendered state is therefore validated in the workflow by `tests/ux/language-consistency.spec.ts` and the full storefront audit.

## Published Polish knowledge articles

| Handle | Current title | Notes |
| --- | --- | --- |
| `od-czego-zaczac` | Od czego zacząć, gdy chcesz lepiej zadbać o swoją intymność? | consumer-facing title naturalized; handle retained |
| `bliskosc-po-35` | Bliskość po 35.: własne tempo, inne potrzeby | health-related caveats remain educational |
| `sensualny-self-care-15-minut` | Piętnaście minut tylko dla siebie | public body cleaned from “self-care”; legacy handle intentionally retained |
| `jak-rozmawiac-o-potrzebach` | Powiedzieć, czego się chce | communication / boundaries article |
| `jak-wybrac-pierwszy-produkt-intymny` | Pierwszy produkt intymny: co naprawdę ma znaczenie | product-selection education |
| `komfort-intymny-po-40` | Komfort po 40.: co może pomóc, kiedy warto skonsultować | “self-care” heading cleaned; includes explicit consultation boundary |
| `przyjemnosc-bez-celu` | Nie wszystko potrzebuje finału | educational |
| `rytual-bliskosci-we-dwoje` | Dwadzieścia minut bliskości. Bez scenariusza. | consent / no-obligation framing |

## Deliberate URL policy

Existing handles are not renamed merely to remove English fragments from legacy URLs. User-facing titles and body copy are cleaned independently. A handle migration would require an explicit redirect / SEO decision and is outside the copy-hygiene task.

## Review contract

Astra should treat:
- the live rendered article body as the content truth,
- this file as an inventory / intent record,
- the Git workflow as proof that the live routes were checked in the same QA run.

If the live CMS changes after the reviewed workflow run, the evidence artifact is stale and a new main workflow run is required before acceptance.
