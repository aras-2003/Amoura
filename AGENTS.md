# AGENTS.md

## Purpose

Amoura is a conceptual sexual-wellness brand and e-commerce experience.

Treat the project as a concept/prototype unless current project documentation explicitly states otherwise. Do not represent Amoura as an operating company, existing commercial brand or established business.

## Sources of truth

Priority:
1. `AGENTS.md`
2. `docs/PRODUCT.md`
3. `docs/BRAND_PRINCIPLES.md`
4. `docs/UX_PRINCIPLES.md`
5. `docs/PRIVACY_PRINCIPLES.md`
6. `docs/ENVIRONMENTS.md`
7. current repository implementation

## Product standard

Amoura is not only a shop. The product may combine commerce, curated products, education, guidance, community and events.

The core experience should feel:
- sophisticated,
- discreet,
- credible,
- warm,
- premium,
- respectful,
- easy to understand.

Avoid vulgarity, infantilization, pornographic aesthetics, stereotypical sex-shop design and clinical coldness.

## Audience

Design primarily for mature women, including women 45+.

Prioritize:
- legibility,
- strong contrast,
- generous interaction targets,
- predictable navigation,
- low cognitive load,
- reassuring product explanations,
- discreet communication.

## Business realism

Distinguish clearly between:
- implemented functionality,
- mock behavior,
- prototype behavior,
- production-ready integration.

Never present simulated payments, inventory, logistics, CRM, consent or recommendation behavior as production-ready.

## Content

Do not make unsupported medical, therapeutic or health claims.

Educational content must remain respectful and evidence-aware. Do not invent experts, endorsements, studies or product effects.

## Privacy

Treat privacy and discretion as product features.

Avoid collecting unnecessary sensitive data. Do not unnecessarily expose sexual-wellness behavior in URLs, logs, analytics, metadata or account interfaces.

## Design

Prefer editorial luxury, restrained femininity, modern typography, warm hierarchy, strong photography and refined motion.

Avoid:
- cliché pink/purple sex-shop aesthetics,
- neon,
- excessive gradients,
- provocative imagery as the main design device,
- visual stereotypes about age or sexuality.

## Engineering

Keep architecture proportional to the current project stage.

Avoid enterprise-scale infrastructure for unvalidated hypotheses. Prefer modular, replaceable components and realistic end-to-end flows.

## Validation

For user-facing changes:
- run the application,
- test mobile and desktop,
- inspect the real rendered result,
- validate navigation and product discovery,
- check accessibility basics,
- inspect console/runtime errors,
- clearly identify mocked flows.

## Git and current execution mode

Default execution model is branch/PR-first.

Current rules:
- `main` is the canonical integration branch;
- significant changes should be made on scoped branches and reviewed through PR;
- `pr-quality-gate` is the pre-merge repository-safe check and must not deploy to Shopify;
- deployment-capable automation may run only after merge to `main` or by explicit manual dispatch;
- current Shopify QA target is store `jksgiq-r4.myshopify.com`, theme `207539044694`;
- latest deployment evidence reports that theme's Shopify role as `live`, despite the theme name `Amoura — TEST`;
- therefore the current target must not be described as proven unpublished/staging or treated as an isolated PR environment;
- no PR branch may deploy to the shared current target;
- no other theme/store may be published, deleted or modified without explicit approval;
- rendered-storefront tasks are not DONE until their focused tests and consolidated QA pass on the same deployed SHA where applicable.

The environment map and approval boundaries are defined in `docs/ENVIRONMENTS.md`.

If a separate non-live Shopify theme is approved later, update the environment map before using it in automation.
