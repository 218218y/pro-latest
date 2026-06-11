import { SKETCH_BOX_DIMENSIONS } from '../../shared/wardrobe_dimension_tokens_shared.js';
import { asNumberOrNull } from './canvas_picking_sketch_free_box_contracts.js';

export function clampSketchFreeBoxCenterY(args: {
  centerY: number;
  boxH: number;
  wardrobeCenterY: number;
  wardrobeHeight: number;
  pad?: number;
}): number {
  const centerY = Number(args.centerY);
  const boxH = Number(args.boxH);
  const wardrobeCenterY = Number(args.wardrobeCenterY);
  const wardrobeHeight = Number(args.wardrobeHeight);
  const pad = asNumberOrNull(args.pad) ?? 0;
  if (!Number.isFinite(centerY) || !Number.isFinite(boxH) || !(boxH > 0)) return centerY;
  if (!Number.isFinite(wardrobeCenterY) || !Number.isFinite(wardrobeHeight) || !(wardrobeHeight > 0)) {
    return centerY;
  }

  const halfH = boxH / 2;
  const floorY = wardrobeCenterY - wardrobeHeight / 2;
  const ceilingY = wardrobeCenterY + wardrobeHeight / 2;
  const lo = floorY + pad + halfH;
  const hi = ceilingY - pad - halfH;
  if (!(hi > lo)) return Math.max(floorY + pad, Math.min(ceilingY - pad, centerY));
  return Math.max(lo, Math.min(hi, centerY));
}

export function getSketchFreePlacementVerticalSlack(wardrobeHeight: number): number {
  const height = Number(wardrobeHeight);
  const dims = SKETCH_BOX_DIMENSIONS.freePlacement;
  if (!Number.isFinite(height) || !(height > 0)) return dims.verticalSlackDefaultM;
  return Math.max(
    dims.verticalSlackMinM,
    Math.min(dims.verticalSlackMaxM, height * dims.verticalSlackHeightRatio)
  );
}

export function getSketchFreePlacementRoomFloorY(): number {
  return SKETCH_BOX_DIMENSIONS.freePlacement.roomFloorY;
}

export function clampSketchFreeBoxCenterYToWorkspace(args: {
  centerY: number;
  boxH: number;
  wardrobeCenterY: number;
  wardrobeHeight: number;
  pad?: number;
}): number {
  const centerY = Number(args.centerY);
  const boxH = Number(args.boxH);
  const wardrobeCenterY = Number(args.wardrobeCenterY);
  const wardrobeHeight = Number(args.wardrobeHeight);
  const pad = asNumberOrNull(args.pad) ?? 0;
  if (!Number.isFinite(centerY) || !Number.isFinite(boxH) || !(boxH > 0)) return centerY;
  if (!Number.isFinite(wardrobeCenterY) || !Number.isFinite(wardrobeHeight) || !(wardrobeHeight > 0)) {
    return centerY;
  }

  const halfH = boxH / 2;
  const roomFloorY = getSketchFreePlacementRoomFloorY();
  const wardrobeFloorY = wardrobeCenterY - wardrobeHeight / 2;
  const ceilingY = wardrobeCenterY + wardrobeHeight / 2;
  const slack = getSketchFreePlacementVerticalSlack(wardrobeHeight);
  const lo = Math.max(roomFloorY + pad + halfH, wardrobeFloorY - slack + pad + halfH);
  const hi = ceilingY + slack - pad - halfH;
  if (!(hi > lo)) return Math.max(lo, centerY);
  return Math.max(lo, Math.min(hi, centerY));
}

export function isSketchFreeBoxUnderWardrobeColumn(args: {
  planeX: number;
  planeY: number;
  boxH: number;
  wardrobeBox: { centerX: number; centerY: number; width: number; height: number };
}): boolean {
  const planeX = Number(args.planeX);
  const planeY = Number(args.planeY);
  const boxH = Number(args.boxH);
  const wardrobeBox = args.wardrobeBox;
  const wardrobeCenterX = Number(wardrobeBox?.centerX);
  const wardrobeCenterY = Number(wardrobeBox?.centerY);
  const wardrobeWidth = Number(wardrobeBox?.width);
  const wardrobeHeight = Number(wardrobeBox?.height);
  if (
    !Number.isFinite(planeX) ||
    !Number.isFinite(planeY) ||
    !Number.isFinite(boxH) ||
    !(boxH > 0) ||
    !Number.isFinite(wardrobeCenterX) ||
    !Number.isFinite(wardrobeCenterY) ||
    !Number.isFinite(wardrobeWidth) ||
    !(wardrobeWidth > 0) ||
    !Number.isFinite(wardrobeHeight) ||
    !(wardrobeHeight > 0)
  ) {
    return false;
  }

  const wardrobeMinX = wardrobeCenterX - wardrobeWidth / 2;
  const wardrobeMaxX = wardrobeCenterX + wardrobeWidth / 2;
  const wardrobeFloorY = wardrobeCenterY - wardrobeHeight / 2;
  return planeX >= wardrobeMinX && planeX <= wardrobeMaxX && planeY <= wardrobeFloorY + boxH / 2 + 1e-6;
}

export function isWithinSketchFreePlacementBounds(args: {
  planeX: number;
  planeY: number;
  wardrobeBox: { centerX: number; centerY: number; width: number; height: number };
  previewW: number;
  previewH: number;
}): boolean {
  const planeX = Number(args.planeX);
  const planeY = Number(args.planeY);
  const previewW = Number(args.previewW);
  const previewH = Number(args.previewH);
  const wardrobeBox = args.wardrobeBox;
  const centerY = Number(wardrobeBox.centerY);
  const height = Number(wardrobeBox.height);
  if (
    !Number.isFinite(planeX) ||
    !Number.isFinite(planeY) ||
    !Number.isFinite(previewW) ||
    !(previewW > 0) ||
    !Number.isFinite(previewH) ||
    !(previewH > 0) ||
    !Number.isFinite(centerY) ||
    !Number.isFinite(height) ||
    !(height > 0)
  ) {
    return false;
  }
  const halfH = previewH / 2;
  const roomFloorY = getSketchFreePlacementRoomFloorY();
  const ceilingY = centerY + height / 2;
  const slack = getSketchFreePlacementVerticalSlack(height);
  return planeY >= roomFloorY - slack - halfH && planeY <= ceilingY + slack + halfH;
}
