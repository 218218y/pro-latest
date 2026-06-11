import { DRAWER_DIMENSIONS } from '../../shared/wardrobe_dimension_tokens_shared.js';
import type { RenderSketchBoxContentsArgs } from './render_interior_sketch_boxes_shared.js';
import type {
  SketchDrawerExtra,
  SketchExternalDrawerExtra,
  SketchInternalDrawerOp,
} from './render_interior_sketch_shared.js';

import { asRecordArray } from './render_interior_sketch_shared.js';
import { asRecord as readRecord } from '../runtime/record.js';
import {
  DEFAULT_SKETCH_INTERNAL_DRAWER_HEIGHT_M,
  readSketchDrawerHeightMFromItem,
  resolveSketchInternalDrawerMetrics,
  sketchStackFitsAvailableHeight,
} from '../features/sketch_drawer_sizing.js';
import { resolveSketchStackCenterYFromNormalizedItem } from '../features/sketch_stack_positioning.js';
import { hasSketchDrawerDivider } from './render_interior_sketch_drawer_dividers.js';
import {
  buildSketchExternalDrawerCollisionRanges,
  sketchStackRangeOverlaps,
} from './render_interior_sketch_stack_collision.js';

export function renderSketchBoxDrawerContents(args: RenderSketchBoxContentsArgs): void {
  const { shell, resolveBoxDrawerSpan } = args;
  const {
    App,
    input,
    group,
    woodThick,
    moduleIndex,
    THREE,
    isFn,
    renderOpsHandleCatch,
    applyInternalDrawersOps,
    getPartMaterial,
  } = args.args;
  const { box, boxPid, centerY, height, halfH, boxMat, geometry, innerBottomY, innerTopY } = shell;
  const boxDrawers = asRecordArray<SketchDrawerExtra>(box.drawers);
  const boxExtDrawers = asRecordArray<SketchExternalDrawerExtra>(box.extDrawers);
  const drawerDims = DRAWER_DIMENSIONS.sketch;
  if (!boxDrawers.length) return;

  try {
    const createInternalDrawerBox = input.createInternalDrawerBox;
    const addOutlines = input.addOutlines;
    const showContentsEnabled = !!input.showContentsEnabled;
    const addFoldedClothes = input.addFoldedClothes;

    if (!(isFn(createInternalDrawerBox) && THREE)) return;

    const drawerOps: SketchInternalDrawerOp[] = [];
    const moduleKeyForUd: string | number = input.moduleKey != null ? String(input.moduleKey) : moduleIndex;
    const availableStackHeightM = Math.max(0, innerTopY - innerBottomY);
    const externalBlockers = buildSketchExternalDrawerCollisionRanges({
      extDrawers: boxExtDrawers,
      bottomY: centerY - halfH,
      topY: centerY + halfH,
      totalHeight: height,
      pad: woodThick,
    });

    for (let drawerIndex = 0; drawerIndex < boxDrawers.length; drawerIndex++) {
      const drawer = boxDrawers[drawerIndex] || null;
      if (!drawer) continue;
      const metrics = resolveSketchInternalDrawerMetrics({
        drawerHeightM: readSketchDrawerHeightMFromItem(drawer, DEFAULT_SKETCH_INTERNAL_DRAWER_HEIGHT_M),
      });
      const singleDrawerH = metrics.drawerH;
      const drawerGap = metrics.drawerGap;
      const stackH = metrics.stackH;
      if (!sketchStackFitsAvailableHeight(stackH, availableStackHeightM)) continue;
      const clampBaseY = (y: number) => {
        const lo = innerBottomY;
        const hi = innerTopY - stackH;
        return Math.max(lo, Math.min(hi, y));
      };
      const centerY0 = resolveSketchStackCenterYFromNormalizedItem({
        item: drawer,
        bottomY: centerY - halfH,
        topY: centerY + halfH,
        totalHeight: height,
        stackH,
        pad: woodThick,
      });
      const baseY0: number | null = centerY0 == null ? null : centerY0 - stackH / 2;
      if (baseY0 == null) continue;
      const baseY = clampBaseY(baseY0);
      if (
        sketchStackRangeOverlaps(
          {
            id: drawer.id != null ? String(drawer.id) : String(drawerIndex),
            minY: baseY,
            maxY: baseY + stackH,
          },
          externalBlockers
        )
      ) {
        continue;
      }
      const drawerIdRaw = drawer.id;
      const drawerId = drawerIdRaw != null ? String(drawerIdRaw) : String(drawerIndex);
      const stackPartId = `${boxPid}_int_drawers_${drawerId}`;
      const spanSource = readRecord(drawer);
      if (!spanSource) continue;
      const span = resolveBoxDrawerSpan(spanSource);
      const width = Math.max(drawerDims.internalWidthMinM, span.innerW - drawerDims.internalWidthClearanceM);
      const depth = Math.max(
        drawerDims.internalDepthMinM,
        geometry.innerD - drawerDims.internalDepthClearanceM
      );
      const drawerBottomLift = Math.min(
        drawerDims.internalBottomLiftMaxM,
        woodThick * drawerDims.internalBottomLiftWoodRatio
      );
      for (let stackIndex = 0; stackIndex < 2; stackIndex++) {
        const drawerSlot = stackIndex === 0 ? 'lower' : 'upper';
        const partId = `${stackPartId}_${drawerSlot}`;
        const hasDivider = hasSketchDrawerDivider({ App, input, partId });
        const yFinal =
          stackIndex === 0
            ? baseY + singleDrawerH / 2 + drawerBottomLift
            : baseY + singleDrawerH + drawerGap + singleDrawerH / 2;
        drawerOps.push({
          kind: 'internal_drawer',
          partId,
          drawerIndex: stackIndex,
          moduleIndex: moduleKeyForUd,
          slotIndex: 0,
          width,
          height: singleDrawerH,
          depth,
          x: span.innerCenterX,
          y: yFinal,
          z: geometry.innerBackZ + geometry.innerD / 2,
          openZ: geometry.innerBackZ + geometry.innerD / 2 + drawerDims.internalOpenOffsetZM,
          hasDivider,
          dividerKey: partId,
        });
      }
    }

    if (!drawerOps.length) return;
    applyInternalDrawersOps({
      App,
      THREE,
      ops: drawerOps,
      wardrobeGroup: group,
      createInternalDrawerBox,
      addOutlines,
      getPartMaterial,
      bodyMat: boxMat,
      showContentsEnabled,
      addFoldedClothes,
    });
  } catch (err) {
    renderOpsHandleCatch(App, 'applyInteriorSketchExtras.boxDrawers', err, undefined, {
      failFast: false,
      throttleMs: 5000,
    });
  }
}
