import { guardVoid, MODES } from '../runtime/api.js';
import { getDrawersArray } from '../runtime/render_access.js';
import { consumeDrawerRebuildIntent, getDrawerService } from '../runtime/doors_access.js';
import { runPlatformWakeupFollowThrough } from '../runtime/platform_access.js';
import { getTools } from '../runtime/service_access.js';
import { readModeStateFromApp } from '../runtime/root_state_access.js';
import { drawerVisualMatchesId, readDrawerVisualPrimaryId } from '../runtime/drawer_visual_identity.js';

import type {
  AppContainer,
  DrawerVisualEntryLike,
  DrawersOpenIdLike,
  ModeStateLike,
  Vec3Like,
} from '../../../types/index.js';
import { asRecord } from './bootstrap_shared.js';

function readDividerModeKey(): string {
  const modes = asRecord(MODES);
  const divider = modes && modes.DIVIDER;
  return typeof divider === 'string' && divider ? divider : 'divider';
}

function asOpenVector(value: unknown): Vec3Like | null {
  const rec = asRecord(value);
  if (!rec) return null;
  return typeof rec.x === 'number' && typeof rec.y === 'number' && typeof rec.z === 'number'
    ? { x: rec.x, y: rec.y, z: rec.z }
    : null;
}

function asDrawerVisualEntry(value: unknown): DrawerVisualEntryLike | null {
  const rec = asRecord(value);
  const open = asOpenVector(rec?.open);
  const closed = asOpenVector(rec?.closed);
  return rec && open && closed ? (value as DrawerVisualEntryLike) : null;
}

function isDividerModeActive(App: AppContainer): boolean {
  const modeState: ModeStateLike = readModeStateFromApp(App);
  const primaryMode = typeof modeState.primary === 'string' ? modeState.primary : null;
  return (primaryMode || '') === String(readDividerModeKey());
}

function readForcedDrawerOpenId(App: AppContainer): DrawersOpenIdLike {
  const tools = getTools(App);
  if (typeof tools.getDrawersOpenId !== 'function') return null;
  const id = tools.getDrawersOpenId();
  return typeof id === 'string' || typeof id === 'number' ? id : null;
}

function sameDrawerId(left: DrawersOpenIdLike, right: DrawersOpenIdLike): boolean {
  if (left == null || right == null) return false;
  return String(left) === String(right);
}

function drawerMatchesId(drawer: DrawerVisualEntryLike | null | undefined, id: DrawersOpenIdLike): boolean {
  return drawerVisualMatchesId(drawer, id);
}

function readDrawerEntryId(drawer: DrawerVisualEntryLike | null | undefined): DrawersOpenIdLike {
  const id = readDrawerVisualPrimaryId(drawer);
  return id == null ? null : id;
}

function setForcedDrawerOpenId(
  App: AppContainer,
  targetId: DrawersOpenIdLike,
  nextOpenId: DrawersOpenIdLike
): void {
  const base = { where: 'builder/bootstrap.__rebuildDrawerMeta' };

  guardVoid(App, { ...base, op: 'tools.setDrawersOpenId', drawerId: targetId, failFast: true }, () => {
    const tools = getTools(App);
    if (typeof tools.setDrawersOpenId === 'function') tools.setDrawersOpenId(nextOpenId);
  });
}

function closeDrawerEntry(
  _App: AppContainer,
  drawer: DrawerVisualEntryLike,
  _drawerId: DrawersOpenIdLike
): void {
  drawer.isOpen = false;
}

function closeOtherDrawers(
  App: AppContainer,
  drawers: DrawerVisualEntryLike[],
  targetId: DrawersOpenIdLike
): void {
  for (const drawer of drawers) {
    if (!drawer) continue;
    const drawerId = readDrawerEntryId(drawer);
    if (drawerMatchesId(drawer, targetId)) continue;
    closeDrawerEntry(App, drawer, drawerId);
  }
}

function wakeupDrawerFollowThrough(App: AppContainer, targetId: DrawersOpenIdLike): void {
  const base = { where: 'builder/bootstrap.__rebuildDrawerMeta' };

  guardVoid(App, { ...base, op: 'platform.wakeupFollowThrough', drawerId: targetId, failFast: true }, () => {
    runPlatformWakeupFollowThrough(App);
  });
}

export function runRebuildDrawerMeta(App: AppContainer): void {
  const base = { where: 'builder/bootstrap.__rebuildDrawerMeta' };

  guardVoid(App, { ...base, op: 'drawer.rebuildMeta', failFast: true }, () => {
    const drawerSvc = getDrawerService(App);
    if (drawerSvc && typeof drawerSvc.rebuildMeta === 'function') drawerSvc.rebuildMeta();
  });

  const rawTargetId = consumeDrawerRebuildIntent(App);
  const targetId: DrawersOpenIdLike =
    typeof rawTargetId === 'string' || typeof rawTargetId === 'number' ? rawTargetId : null;
  if (targetId == null) return;

  const drawers = getDrawersArray(App);
  if (!Array.isArray(drawers)) return;
  const drawerEntries = drawers.map(asDrawerVisualEntry).filter((x): x is DrawerVisualEntryLike => !!x);
  const drawer = drawerEntries.find(x => drawerMatchesId(x, targetId));
  const forcedOpenId = readForcedDrawerOpenId(App);
  const keepDrawerForcedOpen = !!drawer && isDividerModeActive(App) && drawerMatchesId(drawer, forcedOpenId);
  if (!drawer) {
    if (sameDrawerId(forcedOpenId, targetId)) setForcedDrawerOpenId(App, targetId, null);
    return;
  }

  if (!keepDrawerForcedOpen) {
    if (sameDrawerId(forcedOpenId, targetId)) setForcedDrawerOpenId(App, targetId, null);
    closeDrawerEntry(App, drawer, targetId);
    wakeupDrawerFollowThrough(App, targetId);
    return;
  }

  closeOtherDrawers(App, drawerEntries, targetId);
  setForcedDrawerOpenId(App, targetId, targetId);
  drawer.isOpen = true;
  wakeupDrawerFollowThrough(App, targetId);
}
