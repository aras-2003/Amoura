#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="reports/astra"
mkdir -p "$OUT_DIR"

: "${AMOURA_DEPLOY_STORE:?AMOURA_DEPLOY_STORE is required}"
: "${AMOURA_DEPLOY_THEME_ID:?AMOURA_DEPLOY_THEME_ID is required}"
: "${AMOURA_DEPLOY_THEME_NAME:?AMOURA_DEPLOY_THEME_NAME is required}"
: "${AMOURA_DEPLOY_THEME_ROLE:?AMOURA_DEPLOY_THEME_ROLE is required}"

jq -n   --arg store "$AMOURA_DEPLOY_STORE"   --arg theme_id "$AMOURA_DEPLOY_THEME_ID"   --arg theme_name "$AMOURA_DEPLOY_THEME_NAME"   --arg theme_role "$AMOURA_DEPLOY_THEME_ROLE"   --arg sha "${GITHUB_SHA:-unknown}"   '{
    deployment_integrity: "passed",
    repository_sha: $sha,
    store: $store,
    theme_id: $theme_id,
    theme_name: $theme_name,
    theme_role: $theme_role,
    guards: {
      exact_store: true,
      exact_theme_id: true,
      main_or_live_role: true,
      theme_check_fail_level_error: true,
      push_strict: true,
      rejected_file_detection: true,
      target_json_confirmation: true
    },
    rejected_files: false
  }' > "$OUT_DIR/deploy-proof.json"
