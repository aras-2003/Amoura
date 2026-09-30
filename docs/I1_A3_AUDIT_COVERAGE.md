# I1/A3 — audit coverage matrix and known boundaries

Status: prepared for validation on the deployed `main` SHA.

## Coverage matrix

| Area | Current automated coverage | A3 status / action |
| --- | --- | --- |
| Home | crawl audit + screenshots + footer checks | covered |
| Club | crawl audit + screenshots + focused interaction | covered |
| Collection | crawl audit + screenshots + touch/reflow | covered |
| Product | crawl audit + screenshots + touch/reflow | covered |
| Article | crawl audit + screenshots | covered |
| Cart | not explicit in prior 30-route evidence | added to native-scroll coverage; keep in explicit matrix |
| FAQ | not explicit in prior 30-route evidence | added to native-scroll coverage; keep in explicit matrix |
| Search | section/rendering focused suite covers search behavior; crawl discovery may vary | retain focused regression and add explicit empty-query/result-state coverage in next content/state pass if absent |
| Empty states | not proven by prior route-count evidence | gap: cart/search empty-state assertions should be made explicit |
| Product variants | not proven by prior route-count evidence | gap: add when pilot SKU/variant model is finalized |
| Product unavailable state | not proven by prior route-count evidence | gap: add when a real/prototype inventory policy is defined |
| Native page scrolling | full-page screenshot helper changes layout and is not proof | dedicated normal-scroll test added; does not use screenshot helper |
| Touch targets | mobile audit + focused widths | inline-link exception tightened and regression fixture added |
| Accelerated checkout iframe | excluded from axe | boundary documented; host iframe presence/dimensions recorded when present; cross-origin internals remain outside first-party audit |

## Axe boundary

`iframe[id^="jsx-iframe-"]` is excluded from the first-party axe scan because the accelerated-checkout content is cross-origin and not controlled by the theme.

This means a green axe result is **not** a claim that the payment-provider iframe is accessible. A3 records the iframe host when present and keeps the exclusion explicit rather than silently treating it as covered.

## Touch-target exception

The prior helper exempted every `display:inline` anchor. That could suppress a genuinely standalone small link. The A3 rule exempts only an inline anchor that has surrounding running text in its parent. A standalone inline anchor remains subject to the 44px product standard.

## Remaining real gaps

These are not to be hidden by exclusions:

1. explicit empty-cart and empty-search assertions;
2. variant selection once pilot products and variants are fixed;
3. unavailable-product behavior once inventory semantics are fixed;
4. independent/manual accessibility review of third-party payment iframe internals.

The above gaps are functional coverage boundaries, not reasons to claim the current baseline has zero risk.
