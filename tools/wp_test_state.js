import path from 'node:path';
import { listTestFiles } from './wp_test_shared.js';

function readFlagValue(argv, name) {
  const inlinePrefix = `${name}=`;
  const inline = argv.find(arg => String(arg).startsWith(inlinePrefix));
  if (inline) return inline.slice(inlinePrefix.length);
  const index = argv.findIndex(arg => arg === name);
  if (index < 0) return '';
  return String(argv[index + 1] || '');
}

function parsePositiveIntFlag(argv, name) {
  const raw = readFlagValue(argv, name).trim();
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function parseTestArgs(argv) {
  const forceTsx = argv.includes('--tsx');
  const noBuild = argv.includes('--no-build');
  const serial = argv.includes('--serial');
  const pattern = readFlagValue(argv, '--pattern');
  const batchSize = parsePositiveIntFlag(argv, '--batch-size');
  const jobs = parsePositiveIntFlag(argv, '--jobs');
  return { forceTsx, noBuild, pattern, serial, batchSize, jobs };
}

export function matchesPattern(filePath, pattern) {
  if (!pattern) return true;
  return String(filePath).toLowerCase().includes(String(pattern).toLowerCase());
}

export function selectRunnableTests({ projectRoot, pattern }) {
  const allFiles = listTestFiles(projectRoot).filter(filePath => matchesPattern(filePath, pattern));
  const e2eSegment = `${path.sep}tests${path.sep}e2e${path.sep}`;
  const files = allFiles.filter(filePath => !filePath.includes(e2eSegment));
  return {
    allFiles,
    files,
    skippedE2E: allFiles.length - files.length,
  };
}

export function createTestRunFlags({ forceTsx, noBuild, serial, batchSize, jobs }) {
  const flags = [];
  if (forceTsx) flags.push('forced tsx');
  if (noBuild) flags.push('no-build');
  if (serial) flags.push('serial');
  if (!serial && batchSize) flags.push(`batch-size ${batchSize}`);
  if (!serial && jobs) flags.push(`jobs ${jobs}`);
  return flags;
}

export function createNoTestsMessage({ skippedE2E }) {
  if (skippedE2E) {
    return (
      '[WardrobePro] No runnable unit tests matched (Playwright E2E specs are skipped here).\n' +
      'Run `npm run e2e:smoke` (or `npm run e2e:smoke:headed`) to execute E2E tests.'
    );
  }
  return '[WardrobePro] No tests found.';
}

export function createRunBanner({ files, flags }) {
  return (
    '[WardrobePro] Running ' +
    files.length +
    ' test(s)' +
    (flags.length ? ` (${flags.join(', ')})` : '') +
    '...'
  );
}

export function createSkippedE2ENotice(skippedE2E) {
  if (!skippedE2E) return '';
  return (
    `[WardrobePro] Note: skipped ${skippedE2E} Playwright E2E spec(s) under tests/e2e. ` +
    'Use `npm run e2e:smoke` to run them.'
  );
}
