import {
  INTERIOR_FITTINGS_DIMENSIONS,
  MATERIAL_DIMENSIONS,
  SKETCH_BOX_DIMENSIONS,
} from '../../shared/wardrobe_dimension_tokens_shared.js';
import { SHELF_GROUP_PART_ID, markShelfBoardUserData } from '../features/shelf_part_identity.js';
import type { RenderSketchBoxStaticContentsArgs } from './render_interior_sketch_boxes_contents_parts_types.js';
import type { SketchShelfExtra } from './render_interior_sketch_shared.js';

import { asMesh, asRecordArray } from './render_interior_sketch_shared.js';
import {
  normalizeSketchShelfVariant,
  resolveSketchBoxSegmentForContent,
} from './render_interior_sketch_layout.js';
import { resolveSketchBoxShelfMaterial } from './render_interior_sketch_boxes_contents_parts_materials.js';

export function renderSketchBoxContentShelves(args: RenderSketchBoxStaticContentsArgs): void {
  const { shell, boxDividers, yFromBoxNorm } = args;
  const {
    createBoard,
    woodThick,
    currentShelfMat,
    currentBraceShelfMat,
    getPartMaterial,
    getPartColorValue,
    THREE,
    glassMat,
    addBraceDarkSeams,
    addShelfPins,
    isFn,
  } = args.args;
  const { box, boxPid, geometry, regularDepth } = shell;

  const boxShelves = asRecordArray<SketchShelfExtra>(box.shelves);

  function shelfHeightForVariant(variant: ReturnType<typeof normalizeSketchShelfVariant>): number {
    if (variant === 'glass') return MATERIAL_DIMENSIONS.glassShelf.thicknessM;
    if (variant === 'double' || !variant) return Math.max(woodThick, woodThick * 2);
    return woodThick;
  }

  function resolveNextShelfBottomY(currentY: number): number {
    let topLimitY = shell.innerTopY;
    for (let j = 0; j < boxShelves.length; j++) {
      const nextShelf = boxShelves[j] || null;
      if (!nextShelf) continue;
      const nextVariant = normalizeSketchShelfVariant(nextShelf.variant);
      const nextShelfH = shelfHeightForVariant(nextVariant);
      const nextY = yFromBoxNorm(nextShelf.yNorm, nextShelfH / 2);
      if (
        nextY == null ||
        !(nextY > currentY + INTERIOR_FITTINGS_DIMENSIONS.shelves.contentsHeightClearanceM)
      ) {
        continue;
      }
      const nextBottomY = nextY - nextShelfH / 2;
      if (nextBottomY < topLimitY) topLimitY = nextBottomY;
    }
    return topLimitY;
  }

  function resolveShelfContentsMaxHeight(shelfY: number, shelfH: number): number {
    const shelfTopY = shelfY + shelfH / 2;
    return Math.max(
      0,
      resolveNextShelfBottomY(shelfY) -
        shelfTopY -
        INTERIOR_FITTINGS_DIMENSIONS.shelves.contentsHeightClearanceM
    );
  }

  for (let si = 0; si < boxShelves.length; si++) {
    const shelf = boxShelves[si] || null;
    if (!shelf) continue;
    const variant = normalizeSketchShelfVariant(shelf.variant);
    const isBrace = variant === 'brace';
    const isGlass = variant === 'glass';
    const isDouble = variant === 'double' || !variant;
    const shelfH = shelfHeightForVariant(variant);
    const shelfY = yFromBoxNorm(shelf.yNorm, shelfH / 2);
    if (shelfY == null) continue;
    const shelfSegment = resolveSketchBoxSegmentForContent({
      dividers: boxDividers,
      boxCenterX: geometry.centerX,
      innerW: geometry.innerW,
      woodThick,
      xNorm: shelf.xNorm,
    });
    let shelfDepth = isBrace ? geometry.innerD : regularDepth;
    const depthRaw = shelf.depthM;
    const depthM = typeof depthRaw === 'number' ? depthRaw : depthRaw != null ? Number(depthRaw) : NaN;
    if (Number.isFinite(depthM) && depthM > 0)
      shelfDepth = Math.min(geometry.innerD, Math.max(woodThick, depthM));
    const shelfPid = `${boxPid}_shelf_${String(shelf.id ?? si)}`;
    const shelfMat = resolveSketchBoxShelfMaterial({
      getPartMaterial,
      getPartColorValue,
      isFn,
      partId: shelfPid,
      isGlass,
      glassMat,
      currentShelfMat: isBrace ? currentBraceShelfMat || currentShelfMat : currentShelfMat,
    });
    const shelfInnerW = shelfSegment ? shelfSegment.width : geometry.innerW;
    const shelfCenterX = shelfSegment ? shelfSegment.centerX : geometry.centerX;
    const previewDims = SKETCH_BOX_DIMENSIONS.preview;
    const shelfW = Math.max(
      previewDims.shelfMinWidthM,
      shelfInnerW - (isBrace ? previewDims.shelfBraceClearanceM : previewDims.shelfRegularClearanceM)
    );
    const shelfZ = geometry.innerBackZ + shelfDepth / 2;
    const mesh = asMesh(
      createBoard(shelfW, shelfH, shelfDepth, shelfCenterX, shelfY, shelfZ, shelfMat, shelfPid)
    );
    if (mesh && typeof mesh === 'object') {
      mesh.userData = mesh.userData || {};
      markShelfBoardUserData(mesh.userData, {
        groupPartId: SHELF_GROUP_PART_ID,
        shelfIndex: si + 1,
        variant,
        isBrace,
      });
    }
    if (isBrace) {
      const boxLeftFaceX = shelfSegment ? shelfSegment.leftX : geometry.centerX - geometry.innerW / 2;
      const boxRightFaceX = shelfSegment ? shelfSegment.rightX : geometry.centerX + geometry.innerW / 2;
      addBraceDarkSeams(shelfY, shelfZ, shelfDepth, true, THREE, boxLeftFaceX, boxRightFaceX);
    }
    if (isGlass && mesh && typeof mesh === 'object') {
      mesh.userData = mesh.userData || {};
      mesh.userData.__keepMaterial = true;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 2;
    }
    addShelfPins(
      shelfCenterX,
      shelfY,
      shelfZ,
      shelfW,
      shelfH,
      shelfDepth,
      !isBrace && (isDouble || isGlass || variant === 'regular')
    );

    if (args.args.input.showContentsEnabled === true && isFn(args.args.input.addFoldedClothes)) {
      const contentsWidth = shelfW - INTERIOR_FITTINGS_DIMENSIONS.shelves.contentsWidthClearanceM;
      const maxHeight = resolveShelfContentsMaxHeight(shelfY, shelfH);
      if (contentsWidth > 0 && maxHeight > 0) {
        args.args.input.addFoldedClothes(
          shelfCenterX,
          shelfY + shelfH / 2,
          shelfZ,
          contentsWidth,
          args.args.group,
          maxHeight,
          shelfDepth
        );
      }
    }
  }
}
