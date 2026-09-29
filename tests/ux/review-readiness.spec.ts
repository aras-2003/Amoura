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
  expect(packet).toContain('strict deployment gate');
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
  expect(docs[2]).toContain('4 unikalnych źródeł komponentowych');
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

  const pull = read('scripts/theme-pull.sh');
  expect(pull).toContain('en.default.schema.json');
  expect(pull).toContain('pl.schema.json');
  expect(pull).toContain('retained only PL/EN locale files');

  const contactRaw = read('templates/page.contact.json');
  const contact = JSON.parse(contactRaw.slice(contactRaw.indexOf('{')));
  expect(contact.sections.main.blocks.title.settings.text).toBe('<h1>Porozmawiajmy</h1>');
  expect(contact.sections.contact_eyebrow.type).toBe('custom-liquid');

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
