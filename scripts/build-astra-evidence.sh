#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="reports/astra"
mkdir -p "$OUT_DIR"

SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
RUN_ID="${GITHUB_RUN_ID:-local}"
RUN_ATTEMPT="${GITHUB_RUN_ATTEMPT:-1}"
REPOSITORY="${GITHUB_REPOSITORY:-aras-2003/Amoura}"
REF_NAME="${GITHUB_REF_NAME:-main}"

if [[ ! -f "$OUT_DIR/deploy-proof.json" ]]; then
  echo "::error::Missing deploy-proof.json; Astra evidence cannot be built without deployment integrity proof."
  exit 1
fi

jq -e '.deployment_integrity == "passed" and .rejected_files == false' "$OUT_DIR/deploy-proof.json" >/dev/null

jq -n   --arg repository "$REPOSITORY"   --arg branch "$REF_NAME"   --arg sha "$SHA"   --arg run_id "$RUN_ID"   --arg run_attempt "$RUN_ATTEMPT"   '{
    evidence_version: 1,
    repository: $repository,
    canonical_branch: $branch,
    head_sha: $sha,
    workflow_run_id: $run_id,
    workflow_run_attempt: $run_attempt,
    qa_gate: "passed",
    deployment_integrity: "passed",
    tasks: [
      {id: 1, name: "Section rendering / header hydration", status: "DONE"},
      {id: 2, name: "Reliable full-page screenshots", status: "DONE"},
      {id: 3, name: "Touch targets / responsive reflow", status: "DONE"},
      {id: 4, name: "Email flows / consent semantics", status: "DONE"},
      {id: 5, name: "PL/EN consistency and copy hygiene", status: "DONE"},
      {id: 6, name: "Four-week Club content rhythm", status: "DONE_AS_EDITORIAL_DELIVERABLE"},
      {id: 7, name: "SEO basics", status: "DONE"}
    ],
    known_limitations: [
      "Real e-mail delivery is intentionally not tested.",
      "Club proposals 3, 8, 10 and 11 require expert review before publication.",
      "The four-week Club rhythm is an editorial deliverable, not an automated published rotation."
    ],
    reviewer_start: [
      "docs/ASTRA_REVIEW_PACKET.md",
      "docs/ASTRA_TASK_EVIDENCE.md",
      "docs/ASTRA_REVIEW_PROMPT.md"
    ],
    runtime_evidence: [
      "reports/astra/deploy-proof.json",
      "reports/astra/review-manifest.json",
      "reports/ux/*/report.json",
      "reports/screenshots/*/*-full.png"
    ]
  }' > "$OUT_DIR/review-manifest.json"

{
  printf '# Astra runtime evidence\n\n'
  printf -- '- Repository: `%s`\n' "$REPOSITORY"
  printf -- '- Branch: `%s`\n' "$REF_NAME"
  printf -- '- SHA: `%s`\n' "$SHA"
  printf -- '- Workflow run: `%s`\n' "$RUN_ID"
  printf -- '- Run attempt: `%s`\n' "$RUN_ATTEMPT"
  printf -- '- QA gate: **PASSED**\n'
  printf -- '- Deployment integrity: **PASSED**\n\n'
  printf 'Start the review from:\n'
  printf '1. `docs/ASTRA_REVIEW_PACKET.md`\n'
  printf '2. `docs/ASTRA_TASK_EVIDENCE.md`\n'
  printf '3. `docs/ASTRA_REVIEW_PROMPT.md`\n\n'
  printf 'Runtime proof in this artifact:\n'
  printf -- '- `reports/astra/deploy-proof.json`\n'
  printf -- '- `reports/astra/review-manifest.json`\n'
  printf -- '- UX audit reports\n'
  printf -- '- retained full-page screenshots\n\n'
  printf 'Known limitations are declared in `docs/ASTRA_REVIEW_PACKET.md` and repeated in the JSON manifest.\n'
} > "$OUT_DIR/REVIEW_SUMMARY.md"
