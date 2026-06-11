import type { ResolveSketchBoxGeometryFn } from './canvas_picking_sketch_box_overlap_contracts.js';
import type { VerticalOccupancyRange } from './canvas_picking_manual_layout_sketch_vertical_stack.js';
import { collectOverlaps } from './canvas_picking_sketch_box_overlap_geometry.js';
import { resolveModuleBoxes } from './canvas_picking_sketch_box_overlap_resolved_boxes.js';

export function isSketchModuleBoxPlacementBlocked(args: {
  boxes: unknown[];
  centerX: number;
  centerY: number;
  boxW: number;
  boxH: number;
  bottomY: number;
  spanH: number;
  innerW: number;
  internalCenterX: number;
  internalDepth: number;
  internalZ: number;
  woodThick: number;
  resolveSketchBoxGeometry: ResolveSketchBoxGeometryFn;
  ignoreBoxId?: unknown;
  blockers?: VerticalOccupancyRange[] | null;
}): boolean {
  const resolved = resolveModuleBoxes(args);
  const blockers = Array.isArray(args.blockers) ? args.blockers : [];
  for (let i = 0; i < blockers.length; i += 1) {
    const blocker = blockers[i];
    if (!blocker) continue;
    const minY = Math.min(Number(blocker.minY), Number(blocker.maxY));
    const maxY = Math.max(Number(blocker.minY), Number(blocker.maxY));
    if (!Number.isFinite(minY) || !Number.isFinite(maxY) || !(maxY > minY)) continue;
    const gap =
      typeof blocker.collisionGapM === 'number' && Number.isFinite(blocker.collisionGapM)
        ? Math.max(0, blocker.collisionGapM)
        : 0;
    const minYG = minY - gap;
    const maxYG = maxY + gap;
    resolved.push({
      id: `blocker:${blocker.id != null && blocker.id !== '' ? String(blocker.id) : i}`,
      box: { id: `blocker:${blocker.id != null && blocker.id !== '' ? String(blocker.id) : i}` },
      centerX: Number(args.centerX),
      centerY: (minYG + maxYG) / 2,
      boxW: Number(args.boxW),
      boxH: maxYG - minYG,
      widthM: null,
      depthM: null,
      xNorm: null,
    });
  }
  if (!resolved.length) return false;
  return (
    collectOverlaps({
      centerX: Number(args.centerX),
      centerY: Number(args.centerY),
      boxW: Number(args.boxW),
      boxH: Number(args.boxH),
      boxes: resolved,
      gap: 0,
    }).length > 0
  );
}
