import type { ActionMetaLike, DrawerVisualEntryLike, ModuleConfigLike, UnknownRecord } from '../../../types';
import {
  collectDrawerVisualIdentityAliases,
  drawerVisualMatchesId,
  readDrawerVisualPrimaryId,
  readDrawerVisualUserData,
} from '../runtime/drawer_visual_identity.js';

export type ModuleKey = number | 'corner' | `corner:${number}`;

export type PatchConfigForKeyFn = (
  mk: ModuleKey | 'corner' | null,
  patchFn: (cfg: ModuleConfigLike) => void,
  meta: ActionMetaLike
) => unknown;

export type InternalGridInfoLike = UnknownRecord & {
  effectiveBottomY?: number;
  effectiveTopY?: number;
  gridDivisions?: number;
  startY?: number;
  woodThick?: number;
};

export type DrawerVisualLike = DrawerVisualEntryLike & {
  isInternal?: boolean;
};

export function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function asRecord(value: unknown): UnknownRecord | null {
  return isRecord(value) ? value : null;
}

export function asInternalGridInfo(value: unknown): InternalGridInfoLike | null {
  return asRecord(value);
}

export function readDrawerUserData(drawer: DrawerVisualEntryLike | null | undefined): UnknownRecord | null {
  return readDrawerVisualUserData(drawer);
}

export function hasPartId(drawer: DrawerVisualEntryLike | null | undefined, partId: string | null): boolean {
  return drawerVisualMatchesId(drawer, partId);
}

export function readDrawerId(drawer: DrawerVisualEntryLike | null | undefined): string | null {
  return readDrawerVisualPrimaryId(drawer);
}

export function readDrawerIdentityAliases(drawer: DrawerVisualEntryLike | null | undefined): string[] {
  return collectDrawerVisualIdentityAliases(drawer);
}

export function readDrawerIsInternal(
  drawer: DrawerVisualLike | DrawerVisualEntryLike | null | undefined
): boolean | null {
  const drawerRecord = asRecord(drawer);
  if (typeof drawerRecord?.isInternal === 'boolean') return drawerRecord.isInternal;
  return null;
}
