#!/usr/bin/env bash
set -euo pipefail

EXPECTED_STORE="jksgiq-r4.myshopify.com"
EXPECTED_THEME_ID="207539044694"

STORE="${SHOPIFY_STORE:-$EXPECTED_STORE}"
THEME_ID="${SHOPIFY_THEME_ID:-$EXPECTED_THEME_ID}"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "SHOPIFY_CLI_THEME_TOKEN is required."
  exit 1
fi

if [[ "$STORE" != "$EXPECTED_STORE" ]]; then
  echo "::error::Refusing deploy: expected store $EXPECTED_STORE, got $STORE."
  exit 1
fi

if [[ "$THEME_ID" != "$EXPECTED_THEME_ID" ]]; then
  echo "::error::Refusing deploy: expected theme $EXPECTED_THEME_ID, got $THEME_ID."
  exit 1
fi

CLI=(npx --yes @shopify/cli@4.8.2 theme)
AUTH=(--store "$STORE" --password "$SHOPIFY_CLI_THEME_TOKEN")

THEMES_JSON="$("${CLI[@]}" list "${AUTH[@]}" --json)"
themes_filter='if type == "array" then .[] elif type == "object" and has("themes") then .themes[] else empty end'

THEME_NAME="$(jq -r --arg id "$THEME_ID" "$themes_filter | select((.id|tostring) == \$id) | (.name // \"\")" <<<"$THEMES_JSON" | head -n1)"
THEME_ROLE="$(jq -r --arg id "$THEME_ID" "$themes_filter | select((.id|tostring) == \$id) | ((.role // \"\") | ascii_downcase)" <<<"$THEMES_JSON" | head -n1)"

if [[ -z "$THEME_NAME" ]]; then
  echo "::error::Theme $THEME_ID was not found on $STORE."
  exit 1
fi

if [[ "$THEME_ROLE" != "main" && "$THEME_ROLE" != "live" ]]; then
  echo "::error::Refusing deploy: theme $THEME_ID is '$THEME_ROLE', expected MAIN/LIVE."
  exit 1
fi

echo "Deploying directly to MAIN test theme '$THEME_NAME' ($THEME_ID) on $STORE."
"${CLI[@]}" push "${AUTH[@]}" --theme "$THEME_ID" --allow-live --path . --json >/tmp/shopify-theme-push.json

echo "MAIN test theme updated: $THEME_ID"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "theme_id=$THEME_ID" >> "$GITHUB_OUTPUT"
fi
