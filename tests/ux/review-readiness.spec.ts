import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('authoritative review docs describe the current main-based state', async () => {
  const model = read('docs/MODEL_HANDOFFS.md');
  const backlog = read('docs/BACKLOG_DOD_STATUS.md');
  const finalReview = read('docs/FINAL_BACKLOG_REVIEW.md');
  const hygiene = read('docs/REPO_HYGIENE.md');
  const packet = read('docs/ASTRA_REVIEW_PACKET.md');

  expect(model).toContain('Źródło wykonawcze: `main`');
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
  expect(packet).toContain('workflow run: `36565669479`');
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
  expect((h6.match(/\*\*Tekst ćwiczenia:\*\*/g) ?? []).length).toBe(12);
  expect((h6.match(/\*\*CTA:\*\*/g) ?? []).length).toBe(12);
  expect((h6.match(/\*\*Weryfikacja ekspercka:\*\*/g) ?? []).length).toBe(12);
});
