import { getDrawersArray } from '../runtime/render_access.js';
import {
  type AppLike,
  type CaptureLocalOpenOptions,
  type DrawerId,
  type CloseDrawerOptions,
  ensureDoorsRuntimeDefaults,
  isGlobalClickMode,
  reportDoorsRuntimeNonFatal,
  touchDoorsRuntimeRender,
  vecCopy,
} from './doors_runtime_shared.js';
import { applyAllDoors, applySnapshot, captureSnapshot } from './doors_runtime_lifecycle_shared.js';

export function closeAllLocal(App: AppLike): void {
  if (!App || typeof App !== 'object') return;
  applyAllDoors(App, false);
  touchDoorsRuntimeRender(App);
}

function drawerMatchesCloseId(App: AppLike, drawer: Record<string, unknown>, sid: string): boolean {
  let drawerId = '';
  try {
    if (drawer.id !== undefined && drawer.id !== null) drawerId = String(drawer.id);
    else if (drawer.drawerId !== undefined && drawer.drawerId !== null) drawerId = String(drawer.drawerId);
    else if (drawer.dividerKey !== undefined && drawer.dividerKey !== null)
      drawerId = String(drawer.dividerKey);
  } catch (_) {
    reportDoorsRuntimeNonFatal(App, 'closeDrawerById.readId', _);
  }

  if (drawerId && drawerId === sid) return true;

  try {
    const group = drawer.group as { userData?: Record<string, unknown> } | null | undefined;
    const partId = group && group.userData ? group.userData.partId : null;
    if (partId !== undefined && partId !== null && String(partId) === sid) return true;
  } catch (_) {
    reportDoorsRuntimeNonFatal(App, 'closeDrawerById.readPartId', _);
  }

  return false;
}

export function closeDrawerById(App: AppLike, id: DrawerId, opts?: CloseDrawerOptions): void {
  if (!App || typeof App !== 'object') return;
  if (id === null || typeof id === 'undefined') return;

  const sid = String(id);
  const snap = !(opts && typeof opts === 'object' && opts.snap === false);
  const arr = getDrawersArray(App);

  for (let i = 0; i < arr.length; i++) {
    const drawer = arr[i];
    if (!drawer || !drawerMatchesCloseId(App, drawer as Record<string, unknown>, sid)) continue;

    drawer.isOpen = false;
    if (!snap) continue;

    try {
      if (drawer.group?.position && drawer.closed) vecCopy(drawer.group.position, drawer.closed);
    } catch (_) {
      reportDoorsRuntimeNonFatal(App, 'closeDrawerById.snapClosed', _);
    }
  }

  touchDoorsRuntimeRender(App);
}

export function captureLocalOpenStateBeforeBuild(App: AppLike, opts?: CaptureLocalOpenOptions): void {
  if (!App || typeof App !== 'object') return;
  const safeOpts = opts && typeof opts === 'object' ? opts : {};
  const includeDrawers = typeof safeOpts.includeDrawers === 'boolean' ? safeOpts.includeDrawers : true;

  if (isGlobalClickMode(App)) return;

  const runtime = ensureDoorsRuntimeDefaults(App);
  runtime.localOpenSnapshot = captureSnapshot(App, includeDrawers);
}

export function applyLocalOpenStateAfterBuild(App: AppLike): void {
  if (!App || typeof App !== 'object') return;
  if (isGlobalClickMode(App)) return;

  const runtime = ensureDoorsRuntimeDefaults(App);
  const snapshot = runtime.localOpenSnapshot;
  if (!snapshot) return;

  applySnapshot(App, snapshot);
  runtime.localOpenSnapshot = null;
  touchDoorsRuntimeRender(App);
}
