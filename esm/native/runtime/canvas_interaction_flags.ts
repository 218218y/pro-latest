// Canvas interaction runtime flags.
//
// Purpose:
// - Keep pointer/hover behavior coordinated with picking actions without making
//   UI interaction listeners depend on picking-service internals.
// - Flags are one-shot and short-lived so stale action state cannot leak into
//   later unrelated pointer events.

import { asRecord } from './record.js';

const POST_CLICK_HOVER_SUPPRESS_KEY = '__wpSuppressNextCanvasPostClickHoverRefresh';
const POST_BUILD_HOVER_REFRESH_KEY = '__wpPendingCanvasPostBuildHoverRefresh';
const DEFAULT_SUPPRESS_TTL_MS = 1500;
const DEFAULT_POST_BUILD_REFRESH_TTL_MS = 1500;

type SuppressRecord = {
  untilMs?: number;
  reason?: string;
};

export type PendingCanvasPostBuildHoverRefresh = {
  ndcX: number;
  ndcY: number;
  untilMs: number;
  reason: string;
};

function readSuppressRecord(value: unknown): SuppressRecord | null {
  const rec = asRecord<SuppressRecord>(value);
  return rec || null;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readPendingPostBuildHoverRefresh(value: unknown): PendingCanvasPostBuildHoverRefresh | null {
  const rec = asRecord<Record<string, unknown>>(value);
  if (!rec) return null;
  const ndcX = readFiniteNumber(rec.ndcX);
  const ndcY = readFiniteNumber(rec.ndcY);
  const untilMs = readFiniteNumber(rec.untilMs);
  if (ndcX == null || ndcY == null || untilMs == null) return null;
  const reason = typeof rec.reason === 'string' && rec.reason ? rec.reason : 'unknown';
  return { ndcX, ndcY, untilMs, reason };
}

export function requestSuppressNextCanvasPostClickHoverRefresh(
  App: unknown,
  reason = 'unknown',
  ttlMs = DEFAULT_SUPPRESS_TTL_MS
): void {
  const appRec = asRecord<Record<string, unknown>>(App);
  if (!appRec) return;
  const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : DEFAULT_SUPPRESS_TTL_MS;
  appRec[POST_CLICK_HOVER_SUPPRESS_KEY] = {
    untilMs: Date.now() + ttl,
    reason: typeof reason === 'string' && reason ? reason : 'unknown',
  };
}

export function consumeSuppressNextCanvasPostClickHoverRefresh(App: unknown): boolean {
  const appRec = asRecord<Record<string, unknown>>(App);
  if (!appRec) return false;
  const raw = appRec[POST_CLICK_HOVER_SUPPRESS_KEY];
  if (raw == null) return false;
  delete appRec[POST_CLICK_HOVER_SUPPRESS_KEY];

  const rec = readSuppressRecord(raw);
  if (!rec) return false;
  const untilMs = typeof rec.untilMs === 'number' ? rec.untilMs : 0;
  return Number.isFinite(untilMs) && Date.now() <= untilMs;
}

export function requestCanvasPostBuildHoverRefresh(
  App: unknown,
  ndcX: unknown,
  ndcY: unknown,
  reason = 'canvas.postClickHover',
  ttlMs = DEFAULT_POST_BUILD_REFRESH_TTL_MS
): boolean {
  const appRec = asRecord<Record<string, unknown>>(App);
  const x = readFiniteNumber(ndcX);
  const y = readFiniteNumber(ndcY);
  if (!appRec || x == null || y == null) return false;
  const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : DEFAULT_POST_BUILD_REFRESH_TTL_MS;
  appRec[POST_BUILD_HOVER_REFRESH_KEY] = {
    ndcX: x,
    ndcY: y,
    untilMs: Date.now() + ttl,
    reason: typeof reason === 'string' && reason ? reason : 'unknown',
  } satisfies PendingCanvasPostBuildHoverRefresh;
  return true;
}

export function updateCanvasPostBuildHoverRefresh(App: unknown, ndcX: unknown, ndcY: unknown): boolean {
  const appRec = asRecord<Record<string, unknown>>(App);
  const x = readFiniteNumber(ndcX);
  const y = readFiniteNumber(ndcY);
  if (!appRec || x == null || y == null) return false;
  const pending = readPendingPostBuildHoverRefresh(appRec[POST_BUILD_HOVER_REFRESH_KEY]);
  if (!pending || Date.now() > pending.untilMs) {
    delete appRec[POST_BUILD_HOVER_REFRESH_KEY];
    return false;
  }
  appRec[POST_BUILD_HOVER_REFRESH_KEY] = { ...pending, ndcX: x, ndcY: y };
  return true;
}

export function cancelCanvasPostBuildHoverRefresh(App: unknown): void {
  const appRec = asRecord<Record<string, unknown>>(App);
  if (!appRec) return;
  delete appRec[POST_BUILD_HOVER_REFRESH_KEY];
}

export function consumeCanvasPostBuildHoverRefresh(App: unknown): PendingCanvasPostBuildHoverRefresh | null {
  const appRec = asRecord<Record<string, unknown>>(App);
  if (!appRec) return null;
  const pending = readPendingPostBuildHoverRefresh(appRec[POST_BUILD_HOVER_REFRESH_KEY]);
  delete appRec[POST_BUILD_HOVER_REFRESH_KEY];
  if (!pending) return null;
  return Date.now() <= pending.untilMs ? pending : null;
}
