import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('authoritative review docs describe the current main-based state', async () => {
  const model = read('docs/MODEL_HANDOFFS.md');
  const agents = read('AGENTS.md');
  const backlog = read('docs/BACKLOG_DOD_STATUS.md');
  const finalReview = read('docs/FINAL_BACKLOG_REVIEW.md');
  const hygiene = read('docs/REPO_HYGIENE.md');
  const packet = read('docs/ASTRA_REVIEW_PACKET.md');

  expect(model).toContain('Źródło wykonawcze: `main`');
  expect(agents).toContain('## Git and current execution mode');
  expect(agents).toContain('`main` is the canonical working branch');
  expect(model).not.toContain('feature/amoura-daily-club');
  expect(backlog).toContain('Branch: `main`');
  expect(backlog).toContain('#7 SEO basics — CLOSED');
  expect(backlog).toContain('**3/3 focused checks**\n- PL/EN core routes');
  expect(finalReview).toContain('0 critical, 0 serious i 0 standalone touch-target warnings');
  expect(backlog).not.toContain('Branch: `stabilize/backlog-dod`');
  expect(finalReview).not.toContain('actions/checkout@v4');
  expect(hygiene).toContain('`main` — jedyny canonical branch');
  expect(hygiene).toContain('skonsolidowana do `main`');

  for (let task = 1; task <= 7; task++) {
    expect(packet, `review packet should cover task #${task}`).toContain(`| ${task} |`);
  }
  expect(packet).toContain('Known limitations');
  expect(packet).toContain('docs/PRIVACY_PRINCIPLES.md');
  expect(packet).toContain('docs/ASTRA_TASK_EVIDENCE.md');
  expect(packet).toContain('docs/SOURCE_TRACEABILITY.md');
  expect(packet).toContain('Deployment integrity');
  expect(packet).toContain('`theme push` używa `--strict`');
  expect(packet).toContain('Deployment integrity jest osobnym kryterium akceptacji');
  expect(packet).not.toContain('Od czego naprawdę zacząć z sexual wellness?');
});

test('individual handoffs expose final status without stale blockers', async () => {
  const docs = [
    read('docs/HANDOFF_01_DIAGNOSIS.md'),
    read('docs/HANDOFF_02_SCREENSHOTS.md'),
    read('docs/HANDOFF_03_TOUCH_TARGETS.md'),
    read('docs/HANDOFF_04_EMAIL_FLOWS.md'),
    read('docs/HANDOFF_05_LANGUAGE_CONSISTENCY.md'),
  ];
  for (const doc of docs) expect(doc).toMatch(/DONE/);
  expect(docs[0]).not.toContain('Aktualny TEST Shopify jest niedostępny');
  expect(docs[2]).toContain('Końcowy hardening przed review Astry');
  expect(docs[4]).toContain('Zrealizowany pakiet niespójności');
  expect(docs[4]).toContain('Plik / miejsce');
  const h6 = read('docs/HANDOFF_06_CLUB_CONTENT_RHYTHM.md');
  expect(h6).toContain('DONE jako deliverable redakcyjny');
  expect(h6).not.toContain('Od czego naprawdę zacząć z sexual wellness?');
  expect((h6.match(/\*\*Tekst ćwiczenia:\*\*/g) ?? []).length).toBe(12);
  expect((h6.match(/\*\*CTA:\*\*/g) ?? []).length).toBe(12);
  expect((h6.match(/\*\*Weryfikacja ekspercka:\*\*/g) ?? []).length).toBe(12);
});


test('deployment and locale review contract is current', async () => {
  const push = read('scripts/theme-push.sh');
  expect(push).toContain('--strict');
  expect(push).toContain('EXPECTED_THEME_ID');
  expect(push).toContain('EXPECTED_STORE');
  expect(push).toContain('rejected theme files');

  const contactRaw = read('templates/page.contact.json');
  const contact = JSON.parse(contactRaw.slice(contactRaw.indexOf('{')));
  expect(contact.sections.main.blocks.title.settings.text).toBe('<h1>Porozmawiajmy</h1>');
  expect(contact.sections.contact_eyebrow.type).toBe('custom-liquid');

  const pull = read('scripts/theme-pull.sh');
  expect(pull).toContain('en.default.schema.json');
  expect(pull).toContain('pl.schema.json');
  expect(pull).toContain('retained only PL/EN locale files');

  const localeFiles = fs.readdirSync('locales')
    .filter((name) => name.endsWith('.json'))
    .sort();
  expect(localeFiles).toEqual([
    'en.default.json',
    'en.default.schema.json',
    'pl.json',
    'pl.schema.json',
  ]);
});


test('stale historical baseline IDs are absent from acceptance docs', async () => {
  const acceptanceDocs = [
    read('docs/BACKLOG_DOD_STATUS.md'),
    read('docs/FINAL_BACKLOG_REVIEW.md'),
    read('docs/HANDOFF_01_DIAGNOSIS.md'),
    read('docs/HANDOFF_02_SCREENSHOTS.md'),
    read('docs/HANDOFF_03_TOUCH_TARGETS.md'),
    read('docs/HANDOFF_04_EMAIL_FLOWS.md'),
    read('docs/HANDOFF_05_LANGUAGE_CONSISTENCY.md'),
  ].join('\n');

  expect(acceptanceDocs).not.toContain('36565669479');
  expect(acceptanceDocs).not.toContain('a068c9eca747478552f1852d135ee70fb0d598ef');
  expect(acceptanceDocs).toContain('head_sha');
});


test('Astra runtime evidence is generated only after deploy and DoD success', async () => {
  const workflow = read('.github/workflows/deploy-test-theme.yml');
  const push = read('scripts/theme-push.sh');
  const deployProof = read('scripts/write-deploy-proof.sh');
  const evidence = read('scripts/build-astra-evidence.sh');
  const packet = read('docs/ASTRA_REVIEW_PACKET.md');
  const prompt = read('docs/ASTRA_REVIEW_PROMPT.md');

  expect(push).toContain('bash scripts/write-deploy-proof.sh');
  expect(deployProof).toContain('deployment_integrity: "passed"');
  expect(deployProof).toContain('rejected_files: false');
  expect(evidence).toContain('reports/astra/deploy-proof.json');
  expect(evidence).toContain('review-manifest.json');
  expect(evidence).toContain('GITHUB_RUN_ID');
  expect(evidence).toContain('GITHUB_SHA');
  expect(evidence).toContain("printf -- '- Repository: `%-s`\\n'".replace('%-', '%'));

  const qaIndex = workflow.indexOf('Verify backlog Definition of Done');
  const evidenceIndex = workflow.indexOf('Build Astra review evidence');
  const uploadIndex = workflow.indexOf('Upload lightweight QA reports');
  expect(qaIndex).toBeGreaterThan(-1);
  expect(evidenceIndex).toBeGreaterThan(qaIndex);
  expect(uploadIndex).toBeGreaterThan(evidenceIndex);
  expect(workflow).toContain('reports/astra/**');

  expect(packet).toContain('reports/astra/deploy-proof.json');
  expect(packet).toContain('reports/astra/review-manifest.json');
  expect(prompt).toContain('reports/astra/deploy-proof.json');
  expect(prompt).toContain('artifact');
});


test('serious accessibility findings remain blocking for Astra readiness', async () => {
  const audit = read('tests/ux/site-audit.spec.ts');
  const helper = read('tests/helpers/audit.ts');
  const packet = read('docs/ASTRA_REVIEW_PACKET.md');
  const evidence = read('docs/ASTRA_TASK_EVIDENCE.md');

  expect(audit).toContain("f.severity === 'critical'");
  expect(audit).toContain("f.severity === 'serious'");
  expect(audit).toContain("f.code === 'small-touch-target'");
  expect(helper).toContain(".filter((x) => x.w < 44 || x.h < 44)");
  expect(helper).toContain("x.tag === 'A' && x.display === 'inline'");
  expect(packet).toContain('0 critical + 0 serious + 0 standalone touch warnings');
  expect(evidence).toContain('zero standalone `small-touch-target` warnings');
  expect(evidence).not.toContain('warning-level standalone touch targets remain visible');
});
