#!/usr/bin/env bash
set -euo pipefail

STORE="${SHOPIFY_STORE:-jksgiq-r4.myshopify.com}"
REQUESTED_THEME_ID="${SHOPIFY_THEME_ID:-}"
THEME_NAME="${SHOPIFY_THEME_NAME:-Amoura — TEST QA}"

if [[ -z "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  echo "SHOPIFY_CLI_THEME_TOKEN is required."
  exit 1
fi

CLI=(npx --yes @shopify/cli@latest theme)
AUTH=(--store "$STORE" --password "$SHOPIFY_CLI_THEME_TOKEN")

echo "Resolving an unpublished QA theme on $STORE..."
THEMES_JSON="$("${CLI[@]}" list "${AUTH[@]}" --json)"

themes_filter='if type == "array" then .[] elif type == "object" and has("themes") then .themes[] else empty end'

theme_role_for_id() {
  local id="$1"
  jq -r --arg id "$id" "$themes_filter | select((.id|tostring) == \$id) | (.role // \"\") | ascii_downcase" <<<"$THEMES_JSON" | head -n1
}

find_unpublished_by_name() {
  jq -r --arg name "$THEME_NAME" "$themes_filter | select(.name == \$name and ((.role // \"\") | ascii_downcase) == \"unpublished\") | .id" <<<"$THEMES_JSON" | head -n1
}

THEME_ID=""
if [[ -n "$REQUESTED_THEME_ID" ]]; then
  ROLE="$(theme_role_for_id "$REQUESTED_THEME_ID")"
  if [[ "$ROLE" == "unpublished" ]]; then
    THEME_ID="$REQUESTED_THEME_ID"
  elif [[ "$ROLE" == "main" ]]; then
    echo "::warning::Configured theme $REQUESTED_THEME_ID is live (MAIN); refusing to overwrite it."
  elif [[ -n "$ROLE" ]]; then
    echo "::warning::Configured theme $REQUESTED_THEME_ID has role '$ROLE'; it will not be used for QA writes."
  else
    echo "::warning::Configured theme $REQUESTED_THEME_ID was not found; resolving an unpublished QA theme."
  fi
fi

if [[ -z "$THEME_ID" ]]; then
  THEME_ID="$(find_unpublished_by_name)"
fi

if [[ -n "$THEME_ID" ]]; then
  echo "Pushing to unpublished QA theme $THEME_ID ($THEME_NAME)."
  PUSH_JSON="$("${CLI[@]}" push "${AUTH[@]}" --theme "$THEME_ID" --path . --json)"
else
  echo "No unpublished '$THEME_NAME' theme exists. Creating a new unpublished QA theme."
  PUSH_JSON="$("${CLI[@]}" push "${AUTH[@]}" --unpublished --theme "$THEME_NAME" --path . --json)"
  THEME_ID="$(jq -r '.theme.id // empty' <<<"$PUSH_JSON")"
fi

if [[ -z "$THEME_ID" ]]; then
  echo "::error::Shopify CLI did not return a QA theme id."
  echo "$PUSH_JSON"
  exit 1
fi

PREVIEW_URL="$(jq -r '.theme.preview_url // empty' <<<"$PUSH_JSON")"
ROLE="$(jq -r '(.theme.role // "") | ascii_downcase' <<<"$PUSH_JSON")"

if [[ -n "$ROLE" && "$ROLE" != "unpublished" ]]; then
  echo "::error::Refusing to continue: pushed theme role is '$ROLE', expected 'unpublished'."
  exit 1
fi

echo "QA theme ready: $THEME_ID"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "theme_id=$THEME_ID" >> "$GITHUB_OUTPUT"
  echo "preview_url=$PREVIEW_URL" >> "$GITHUB_OUTPUT"
fi
