import type { NonSplitPreviewRouteArgs } from './canvas_picking_hover_flow_nonsplit_contracts.js';
import { tryHandleCanvasNonSplitDoorPreviewRoute } from './canvas_picking_hover_flow_nonsplit_preview_door.js';
import { tryHandleCanvasNonSplitInteriorPreviewRoutes } from './canvas_picking_hover_flow_nonsplit_preview_interior.js';
import { tryHandleCanvasNonSplitPaintPreviewRoute } from './canvas_picking_hover_flow_nonsplit_preview_paint.js';

export function tryHandleCanvasNonSplitPreviewRoutes(args: NonSplitPreviewRouteArgs): boolean {
  if (tryHandleCanvasNonSplitPaintPreviewRoute(args.hoverArgs)) {
    if (args.hoverArgs.doorMarker) args.hoverArgs.doorMarker.visible = false;
    return true;
  }

  if (tryHandleCanvasNonSplitDoorPreviewRoute(args)) {
    return true;
  }

  return tryHandleCanvasNonSplitInteriorPreviewRoutes(args.hoverArgs);
}
