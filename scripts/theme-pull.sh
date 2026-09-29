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

npx --yes @shopify/cli@4.8.2 theme pull   --store "$STORE"   --theme "$THEME_ID"   --path .   --password "$SHOPIFY_CLI_THEME_TOKEN"

echo "Pulled approved Shopify TEST theme $THEME_ID from $STORE into repository root."
