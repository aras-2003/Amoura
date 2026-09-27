#!/usr/bin/env bash
set -euo pipefail

STORE="${SHOPIFY_STORE:-jksgiq-r4.myshopify.com}"
THEME_ID="${SHOPIFY_THEME_ID:-207539044694}"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "SHOPIFY_CLI_THEME_TOKEN is required."
  exit 1
fi

npx --yes @shopify/cli@latest theme push   --store "$STORE"   --theme "$THEME_ID"   --path .   --password "$SHOPIFY_CLI_THEME_TOKEN"

echo "Pushed repository theme to unpublished TEST theme $THEME_ID on $STORE."
