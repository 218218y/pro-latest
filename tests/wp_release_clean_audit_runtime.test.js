import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  collectReleaseCleanIssues,
  formatReleaseCleanIssues,
  parseReleaseCleanAuditArgs,
} from '../tools/wp_release_clean_audit.mjs';

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'wp-release-clean-'));
}

test('release clean audit accepts a minimal production release directory', () => {
  const root = tempDir();
  const releaseDir = path.join(root, 'dist', 'release');
  fs.mkdirSync(path.join(releaseDir, 'libs'), { recursive: true });
  fs.writeFileSync(path.join(releaseDir, 'index.html'), '<script type="module"></script>\n', 'utf8');
  fs.writeFileSync(path.join(releaseDir, 'wardrobepro.bundle.js'), 'export {};\n', 'utf8');
  fs.writeFileSync(path.join(releaseDir, 'libs', 'three.vendor.js'), 'export const THREE = {};\n', 'utf8');

  assert.deepEqual(collectReleaseCleanIssues({ root, dirs: ['dist/release'] }), []);
});

test('release clean audit catches test folders, test files, and test-only text references', () => {
  const root = tempDir();
  const releaseDir = path.join(root, 'dist', 'release');
  fs.mkdirSync(path.join(releaseDir, 'tests', 'e2e'), { recursive: true });
  fs.writeFileSync(path.join(releaseDir, 'tests', 'e2e', 'smoke.spec.ts'), 'import "@playwright/test";\n');
  fs.writeFileSync(
    path.join(releaseDir, 'wardrobepro.bundle.js'),
    'console.log("__WP_TEST_CLIPBOARD_WRITES__");\n',
    'utf8'
  );

  const issues = collectReleaseCleanIssues({ root, dirs: ['dist/release'] });
  const report = formatReleaseCleanIssues(issues);

  assert.match(report, /forbidden-dir: tests/);
  assert.match(report, /forbidden-text: wardrobepro\.bundle\.js/);
  assert.match(report, /__WP_TEST_/);
});

test('release clean audit reports missing release directories and parses multiple dirs', () => {
  const root = tempDir();
  const parsed = parseReleaseCleanAuditArgs(['--dirs', 'dist/release,dist/site2/release']);

  assert.deepEqual(parsed.dirs, ['dist/release', 'dist/site2/release']);
  const issues = collectReleaseCleanIssues({ root, dirs: parsed.dirs });

  assert.equal(issues.length, 2);
  assert.deepEqual(
    issues.map(issue => issue.type),
    ['missing-dir', 'missing-dir']
  );
});
