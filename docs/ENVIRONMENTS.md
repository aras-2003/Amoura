# Amoura environment and deployment policy

Status: I1/A2 baseline, 30.09.2026.

## Environment map

| Layer | Identifier | Role | Allowed use |
| --- | --- | --- | --- |
| Git integration | `main` | canonical integration branch | merge reviewed work; source for deployment-capable workflow |
| PR branches | scoped feature/fix/docs branches | isolated source review | repository-safe checks only; no Shopify deployment |
| Shopify store | `jksgiq-r4.myshopify.com` | current prototype storefront | rendered QA and controlled prototype review |
| Shopify theme | `207539044694` / `Amoura — TEST` | Shopify reports `live` in latest deploy evidence | current shared QA target after merge; not an isolated PR target |

## Important distinction

The string `TEST` in the theme name is a project naming convention. It does **not** establish Shopify publication state.

Latest deployment evidence reports `theme_role=live` for theme `207539044694`. Therefore:

- do not describe this theme as proven unpublished or staging;
- do not deploy PR branches to it;
- do not interpret its role as proof that Amoura is commercially launched;
- treat it as a shared technical target until the owner approves a separate non-live theme.

## Change flow

1. Create a scoped branch.
2. Open a PR to `main`.
3. Run `pr-quality-gate`.
4. Review the change.
5. Merge to `main`.
6. Deployment-capable workflow may update the configured current theme.
7. Run focused tests and consolidated rendered QA where the task changes storefront behavior.
8. Preserve evidence tied to the deployed SHA.

## Approval boundaries

Explicit owner approval is required before:

- changing store or theme ID used by deployment automation;
- publishing/unpublishing a Shopify theme;
- deleting a theme;
- deploying a PR branch to Shopify;
- modifying another store/theme;
- enabling real payments, real customer communications, paid campaigns or other external commercial actions.

Routine code, tests and documentation changes may proceed through the branch/PR process without additional approval if they stay inside the above boundaries.

## Current unresolved owner decision

The owner must either:

1. approve `207539044694` as the temporary shared technical QA target despite its Shopify role `live`; or
2. provide/approve a separate non-live theme ID and then update automation before use.

Tracked as #19 U2.

## Local work safety

A previously noted local working copy on `feature/amoura-daily-club` contains uncommitted changes. Repository automation and remote changes must not overwrite, reset or claim ownership of those local changes.
