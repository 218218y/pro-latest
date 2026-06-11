import type { AppContainer } from '../../../types';

import { consumeCanvasPostBuildHoverRefresh } from '../runtime/canvas_interaction_flags.js';
import { getCanvasPickingHoverHandler } from '../runtime/canvas_picking_access.js';
import { runPlatformRenderFollowThrough } from '../runtime/platform_access.js';
import { reportBuildReactionsSoftError } from './build_reactions_shared.js';
import { syncCanvasPickingViewportMatrices } from './canvas_picking_viewport_matrices.js';

export function refreshPendingCanvasPostBuildHover(App: AppContainer): boolean {
  const pending = consumeCanvasPostBuildHoverRefresh(App);
  if (!pending) return false;

  try {
    const hover = getCanvasPickingHoverHandler(App);
    if (!hover) return false;
    syncCanvasPickingViewportMatrices(App);
    hover(pending.ndcX, pending.ndcY);
    runPlatformRenderFollowThrough(App, { updateShadows: false, ensureRenderLoop: false });
    return true;
  } catch (error) {
    reportBuildReactionsSoftError(App, 'refreshPendingCanvasPostBuildHover', error);
    return false;
  }
}
