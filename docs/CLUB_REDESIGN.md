# Amoura Club — review candidate

## Implemented

A reusable Shopify section replaces the Club page and homepage invitation. The editorial photograph was generated in Runway (task 50acbe6f-efde-4fda-9bd4-adcfdcc3a41a) and compressed to a 72 KB WebP stored with the theme. Merchants can replace it with the section image picker.

The page connects a short optional ritual, real articles from the selected Shopify blog, and an opening-notification contact form. Rituals use native details/summary controls: no JavaScript dependency, account, persisted preferences or interaction analytics. Polish and English copy is in locale files. Planned club benefits are explicitly labeled as future initiatives.

The contact form uses Shopify's existing contact workflow, with labels, native email validation, server error rendering and success feedback. It requests an opening notification; it does not create membership, automate a newsletter, or promise an existing event schedule.

## Validation

- Shopify theme validator: all five changed Liquid/JSON files passed using bundled fallback schemas (network-enabled validation was not approved).
- Local Liquid rendering and Chrome checks at 390, 768 and 1440 px: no overflow, missing images or runtime errors; one H1; accordion expansion and invalid email rejection passed.
- Desktop and mobile screenshots visually reviewed after animations completed.
- Local preview substitutes the contact form and header. It does not validate Shopify server submission, captcha, existing theme CSS, or live blog data. The journal only renders when the chosen blog contains articles.

## Before accepting

Deploy the branch to an explicitly approved unpublished TEST theme, inspect real Shopify rendering in both languages, verify the blog selection and contact-form response, and run the repository storefront audit against that exact deployed revision. The existing push-triggered audit checks a fixed TEST theme and cannot by itself prove this branch has been deployed.

## Files for review

`design/club-preview.html` and `design/home-invitation.html` are local demos. Their form deliberately does not submit. Figma contains raster desktop/mobile review boards, not an editable component library. Existing commerce and checkout remain outside this patch.

## Editorial follow-through

Three evergreen rituals are an initial useful experience, not a daily publishing service. A sustainable return habit still needs a named editorial owner, a realistic publishing cadence and confirmed formats for the Club. Avoid claiming daily content or access to experts before those operations exist.
