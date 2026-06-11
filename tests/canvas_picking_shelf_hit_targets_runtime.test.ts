import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveShelfBoardPick,
  resolveShelfPickVerticalToleranceM,
  resolveShelfSelectorPickToleranceM,
} from '../esm/native/services/canvas_picking_shelf_hit_targets.ts';

test('shelf board picking prefers the existing shelf board over the selector-plane hit', () => {
  const pick = resolveShelfBoardPick({
    intersects: [
      { object: { userData: { isModuleSelector: true, moduleIndex: 0 } }, point: { y: 1.0 } },
      { object: { userData: { partId: 'all_shelves' } }, point: { y: 0.84 } },
    ],
    selectorHitY: 1.0,
    bottomY: 0,
    topY: 2.4,
    divisions: 6,
    boardToleranceM: 0.05,
    selectorHitToleranceM: 0.03,
  });

  assert.equal(pick?.source, 'board');
  assert.equal(pick?.shelfIndex, 2);
  assert.equal(pick?.hitY, 0.84);
  assert.ok(pick && Math.abs(pick.shelfY - 0.8) < 1e-9);
});

test('shelf board picking ignores shelf pins and brace seams before using selector-plane hit', () => {
  const pick = resolveShelfBoardPick({
    intersects: [
      { object: { userData: { partId: 'all_shelves', __kind: 'shelf_pin' } }, point: { y: 0.8 } },
      { object: { userData: { partId: 'all_shelves', __kind: 'brace_seam' } }, point: { y: 0.8 } },
    ],
    selectorHitY: 1.2,
    bottomY: 0,
    topY: 2.4,
    divisions: 6,
    boardToleranceM: 0.05,
    selectorHitToleranceM: 0.03,
  });

  assert.equal(pick?.source, 'selector-hit');
  assert.equal(pick?.shelfIndex, 3);
  assert.equal(pick?.hitY, 1.2);
  assert.ok(pick && Math.abs(pick.shelfY - 1.2) < 1e-9);
});

test('shelf board picking shared vertical tolerance matches the paint-hover shelf halo', () => {
  assert.equal(resolveShelfPickVerticalToleranceM(0.4, 0.18), 0.072);
  assert.equal(resolveShelfPickVerticalToleranceM(0.01, 0.18), 0.035);
  assert.equal(resolveShelfPickVerticalToleranceM(1, 0.18), 0.075);
  assert.equal(resolveShelfSelectorPickToleranceM(0.4), 0.12);
});

test('shelf board picking accepts a near selector-plane hover before the shelf is widened to brace depth', () => {
  const pick = resolveShelfBoardPick({
    intersects: [{ object: { userData: { isModuleSelector: true, moduleIndex: 0 } }, point: { y: 0.86 } }],
    selectorHitY: 0.86,
    bottomY: 0,
    topY: 2.4,
    divisions: 6,
    boardToleranceM: resolveShelfPickVerticalToleranceM(0.017, 2.75),
    selectorHitToleranceM: resolveShelfSelectorPickToleranceM(0.4),
  });

  assert.equal(pick?.source, 'selector-hit');
  assert.equal(pick?.shelfIndex, 2);
  assert.ok(pick && Math.abs(pick.shelfY - 0.8) < 1e-9);
});

test('shelf board picking keeps brace hover and click selector tolerances aligned', () => {
  const pick = resolveShelfBoardPick({
    intersects: [
      { object: { userData: { isModuleSelector: true, moduleIndex: 'corner:1' } }, point: { y: 0.91 } },
    ],
    selectorHitY: 0.91,
    bottomY: 0,
    topY: 2.4,
    divisions: 6,
    boardToleranceM: resolveShelfPickVerticalToleranceM(0.017, 2.75),
    selectorHitToleranceM: resolveShelfSelectorPickToleranceM(0.4),
  });

  assert.equal(pick?.source, 'selector-hit');
  assert.equal(pick?.shelfIndex, 2);
  assert.ok(pick && Math.abs(pick.shelfY - 0.8) < 1e-9);
});
