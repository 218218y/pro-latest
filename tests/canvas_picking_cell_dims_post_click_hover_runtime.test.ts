import test from 'node:test';
import assert from 'node:assert/strict';

import {
  rememberCellDimsPostClickHoverTarget,
  resolveCellDimsPostClickHoverTarget,
} from '../esm/native/services/canvas_picking_cell_dims_post_click_hover.ts';
import { tryHandleCellDimsHoverPreview } from '../esm/native/services/canvas_picking_hover_preview_modes_cell_dims.ts';

function createSelector(moduleIndex: unknown, stack: 'top' | 'bottom') {
  return {
    userData: {
      isModuleSelector: true,
      moduleIndex,
      __wpStack: stack,
    },
    children: [],
  } as any;
}

function createAppHarness(selector = createSelector(1, 'top')) {
  const state = {
    ui: {
      raw: {
        width: 160,
        height: 220,
        depth: 55,
        cellDimsWidth: 90,
      },
    },
    config: {
      modulesConfiguration: [{ doors: 1 }, { doors: 1, specialDims: { baseWidthCm: 80, widthCm: 90 } }],
      stackSplitLowerModulesConfiguration: [{ doors: 1 }, { doors: 1 }],
    },
    runtime: {},
    mode: {},
    meta: {},
  } as any;

  const App = {
    store: {
      getState() {
        return state;
      },
    },
    render: {
      wardrobeGroup: {
        children: [selector],
      },
    },
    services: {
      runtimeCache: {
        internalGridMap: {
          '1': {
            effectiveBottomY: 0,
            effectiveTopY: 2.2,
            innerW: 0.78,
            internalCenterX: 0,
            internalDepth: 0.55,
            internalZ: 0.275,
            woodThick: 0.018,
          },
        },
        internalGridMapSplitBottom: {
          '1': {
            effectiveBottomY: 0,
            effectiveTopY: 0.8,
            innerW: 0.78,
            internalCenterX: 0,
            internalDepth: 0.55,
            internalZ: 0.275,
            woodThick: 0.018,
          },
        },
      },
    },
  } as any;

  const measureObjectLocalBox = (_App: unknown, obj: unknown) => {
    if (obj !== selector) return null;
    return {
      centerX: 0,
      centerY: 1.1,
      centerZ: 0.275,
      width: 0.78,
      height: 2.2,
      depth: 0.55,
    };
  };

  return { App, selector, state, measureObjectLocalBox };
}

test('cell-dims post-click hover remembers the clicked selector identity after geometry rebuild', () => {
  const { App, selector, measureObjectLocalBox } = createAppHarness();

  rememberCellDimsPostClickHoverTarget({ App, moduleKey: 1, isBottom: false, ndcX: 0.12, ndcY: -0.18 });
  const target = resolveCellDimsPostClickHoverTarget({
    App,
    ndcX: 0.12,
    ndcY: -0.18,
    measureObjectLocalBox,
  });

  assert.ok(target);
  assert.equal(target.hitModuleKey, 1);
  assert.equal(target.isBottom, false);
  assert.equal(target.hitSelectorObj, selector);
});

test('cell-dims post-click hover identity is ignored once the pointer moved away', () => {
  const { App, measureObjectLocalBox } = createAppHarness();

  rememberCellDimsPostClickHoverTarget({ App, moduleKey: 1, isBottom: false, ndcX: 0.12, ndcY: -0.18 });
  const target = resolveCellDimsPostClickHoverTarget({
    App,
    ndcX: 0.4,
    ndcY: -0.18,
    measureObjectLocalBox,
  });

  assert.equal(target, null);
});

test('cell-dims hover preview uses the remembered post-click target before a fresh raycast', () => {
  const { App, selector, measureObjectLocalBox } = createAppHarness();
  const previews: any[] = [];
  let raycastFallbackCalls = 0;

  rememberCellDimsPostClickHoverTarget({ App, moduleKey: 1, isBottom: false, ndcX: 0.12, ndcY: -0.18 });

  const handled = tryHandleCellDimsHoverPreview({
    App,
    ndcX: 0.12,
    ndcY: -0.18,
    raycaster: {} as any,
    mouse: {} as any,
    isCellDimsMode: true,
    previewRo: {
      setSketchPlacementPreview(args: unknown) {
        previews.push(args);
      },
    },
    resolveInteriorHoverTarget() {
      raycastFallbackCalls += 1;
      return null;
    },
    readCellDimsDraft() {
      return { applyW: 90, applyH: null, applyD: null };
    },
    measureObjectLocalBox,
    estimateVisibleModuleFrontZ() {
      return 0;
    },
    getCellDimsHoverOp(_App, target) {
      assert.equal(target.hitModuleKey, 1);
      return 'remove';
    },
  });

  assert.equal(handled, true);
  assert.equal(raycastFallbackCalls, 0);
  assert.equal(previews.length, 1);
  assert.equal(previews[0].anchor, selector);
  assert.equal(previews[0].op, 'remove');
});
