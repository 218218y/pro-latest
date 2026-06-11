import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HEX_CELL_DEFAULT_DOOR_WIDTH_RATIO,
  moduleHasDrawerContent,
  resolveDefaultHexDoorWidthCm,
  resolveHexCellDraftConfig,
  shouldBlockDrawerBuildInHexCell,
  shouldBlockHexCellApplyOverDrawers,
} from '../esm/native/features/hex_cell/index.ts';

test('hex-cell drawer constraints detect regular and sketch drawers', () => {
  assert.equal(moduleHasDrawerContent({ extDrawersCount: 2 }), true);
  assert.equal(moduleHasDrawerContent({ hasShoeDrawer: true }), true);
  assert.equal(moduleHasDrawerContent({ sketchExtras: { drawers: [{ id: 'd1' }] } }), true);
  assert.equal(moduleHasDrawerContent({ sketchExtras: { extDrawers: [{ id: 'e1' }] } }), true);
  assert.equal(
    moduleHasDrawerContent({ sketchExtras: { boxes: [{ id: 'box-1', extDrawers: [{ id: 'be1' }] }] } }),
    true
  );
  assert.equal(moduleHasDrawerContent({ sketchExtras: { shelves: [{ id: 's1' }] } }), false);
});

test('hex-cell drawer constraints block both illegal directions', () => {
  assert.equal(shouldBlockDrawerBuildInHexCell({ hexCell: { enabled: true } }), true);
  assert.equal(shouldBlockDrawerBuildInHexCell({ hexCell: { enabled: false } }), false);
  assert.equal(shouldBlockHexCellApplyOverDrawers({ extDrawersCount: 1 }), true);
  assert.equal(shouldBlockHexCellApplyOverDrawers({ sketchExtras: { drawers: [{ id: 'd1' }] } }), true);
  assert.equal(shouldBlockHexCellApplyOverDrawers({ layout: 'shelves' }), false);
});

test('hex-cell default door width follows the central ratio when no manual width is set', () => {
  assert.equal(HEX_CELL_DEFAULT_DOOR_WIDTH_RATIO, 0.75);
  assert.equal(resolveDefaultHexDoorWidthCm(80), 60);
  assert.equal(resolveDefaultHexDoorWidthCm(100), 75);
  assert.equal(resolveDefaultHexDoorWidthCm(60), 45);
  assert.equal(resolveHexCellDraftConfig({ moduleWidthCm: 80 }).doorWidthCm, 60);
});
