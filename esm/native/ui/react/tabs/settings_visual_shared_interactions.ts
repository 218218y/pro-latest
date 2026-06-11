import type { ActionMetaLike, AppContainer, MetaActionsNamespaceLike } from '../../../../../types';

import { closeInteractiveOnGlobalOff } from '../actions/interactive_actions.js';
import { setRuntimeGlobalClickMode } from '../actions/store_actions.js';

export function syncGlobalClickMode(app: AppContainer, enabled: boolean, meta?: ActionMetaLike): void {
  const nextMeta: ActionMetaLike =
    meta && typeof meta === 'object' ? meta : { source: 'react:settingsVisual:globalClick' };
  try {
    setRuntimeGlobalClickMode(app, !!enabled, nextMeta);
  } catch {
    // ignore
  }
}

export function closeInteractiveStateOnGlobalOff(app: AppContainer): void {
  try {
    closeInteractiveOnGlobalOff(app);
  } catch {
    // ignore
  }
}

export function getImmediateMeta(meta: MetaActionsNamespaceLike, source: string): ActionMetaLike {
  return meta.uiOnlyImmediate(source);
}
