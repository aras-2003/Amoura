#!/usr/bin/env bash
set -euo pipefail

EXPECTED_STORE="jksgiq-r4.myshopify.com"
EXPECTED_THEME_ID="207539044694"

STORE="${SHOPIFY_STORE:-$EXPECTED_STORE}"
THEME_ID="${SHOPIFY_THEME_ID:-$EXPECTED_THEME_ID}"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "::error::SHOPIFY_CLI_THEME_TOKEN is required."
  exit 1
fi

if [[ "$STORE" != "$EXPECTED_STORE" ]]; then
  echo "::error::Refusing pull: expected store $EXPECTED_STORE, got $STORE."
  exit 1
fi

if [[ "$THEME_ID" != "$EXPECTED_THEME_ID" ]]; then
  echo "::error::Refusing pull: expected theme $EXPECTED_THEME_ID, got $THEME_ID."
  exit 1
fi

npx --yes @shopify/cli@4.8.2 theme pull \
  --store "$STORE" \
  --theme "$THEME_ID" \
  --path . \
  --password "$SHOPIFY_CLI_THEME_TOKEN"

# Amoura supports only PL + EN. Shopify's source theme may contain many stock
# storefront/theme-editor translations; prune them after every snapshot pull so
# they cannot re-enter the repository or Theme Check.
for locale_file in locales/*.json; do
  [[ -e "$locale_file" ]] || continue
  case "$locale_file" in
    locales/en.default.json|locales/en.default.schema.json|locales/pl.json|locales/pl.schema.json)
      ;;
    *)
      rm -f "$locale_file"
      ;;
  esac
done

echo "Pulled approved Shopify TEST theme $THEME_ID from $STORE and retained only PL/EN locale files."
