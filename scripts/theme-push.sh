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

echo "Validating theme before deploy."
"${CLI[@]}" check --path . --fail-level error

echo "Deploying directly to MAIN test theme '$THEME_NAME' ($THEME_ID) on $STORE."
PUSH_STDOUT="$(mktemp)"
PUSH_STDERR="$(mktemp)"
trap 'rm -f "$PUSH_STDOUT" "$PUSH_STDERR"' EXIT

set +e
"${CLI[@]}" push "${AUTH[@]}" --theme "$THEME_ID" --allow-live --strict --path . --json >"$PUSH_STDOUT" 2>"$PUSH_STDERR"
PUSH_STATUS=$?
set -e

cat "$PUSH_STDERR" >&2

if [[ $PUSH_STATUS -ne 0 ]]; then
  echo "::error::Shopify theme push exited with status $PUSH_STATUS."
  exit "$PUSH_STATUS"
fi

# Shopify CLI can finish with exit code 0 even when an individual theme file
# is rejected by remote schema validation. Treat any rendered CLI error panel
# or known rejection wording as a failed deploy.
if grep -Eqi '╭─ error|Setting .+ is invalid|failed to (upload|push)|theme push.*error' "$PUSH_STDERR"; then
  echo "::error::Shopify reported one or more rejected theme files."
  exit 1
fi

if ! jq -e '.theme.id and (.theme.id|tostring) == "'"$THEME_ID"'"' "$PUSH_STDOUT" >/dev/null 2>&1; then
  echo "::error::Theme push did not return the expected target theme confirmation."
  cat "$PUSH_STDOUT"
  exit 1
fi

cp "$PUSH_STDOUT" /tmp/shopify-theme-push.json

AMOURA_DEPLOY_STORE="$STORE" \
AMOURA_DEPLOY_THEME_ID="$THEME_ID" \
AMOURA_DEPLOY_THEME_NAME="$THEME_NAME" \
AMOURA_DEPLOY_THEME_ROLE="$THEME_ROLE" \
bash scripts/write-deploy-proof.sh

echo "MAIN test theme updated without rejected files: $THEME_ID"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "theme_id=$THEME_ID" >> "$GITHUB_OUTPUT"
fi
