import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveSketchFreeBoxHoverPlacement } from '../esm/native/services/canvas_picking_sketch_free_boxes.ts';

type HoverArgs = Parameters<typeof resolveSketchFreeBoxHoverPlacement>[0];

function makeArgs(overrides: Partial<HoverArgs>): HoverArgs {
  return {
    App: {} as never,
    planeX: 0,
    planeY: -0.95,
    boxH: 0.4,
    widthOverrideM: 0.6,
    depthOverrideM: 0.5,
    wardrobeBox: {
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      width: 2,
      height: 2,
      depth: 0.6,
    },
    wardrobeBackZ: -0.3,
    freeBoxes: [],
    projectWorldPointToLocal: () => null,
    ...overrides,
  };
}

test('free-box hover below the room floor clamps onto the floor when it is outside the wardrobe column', () => {
  const placement = resolveSketchFreeBoxHoverPlacement(makeArgs({ planeX: 1.35 }));

  assert.ok(placement);
  assert.equal(placement.op, 'add');
  assert.ok(Math.abs(placement.previewY - 0.206) <= 1e-9);
});

test('free-box hover near the lower wardrobe interior still snaps when it is not under the base', () => {
  const placement = resolveSketchFreeBoxHoverPlacement(
    makeArgs({
      planeX: 0.1,
      planeY: -0.7,
      boxH: 0.3,
      freeBoxes: [],
    })
  );

  assert.ok(placement);
  assert.equal(placement.op, 'add');
  assert.ok(Math.abs(placement.previewY - 0.156) <= 1e-9);
});

test('free-box hover under the wardrobe column is blocked instead of becoming a swallowed free box', () => {
  const placement = resolveSketchFreeBoxHoverPlacement(makeArgs({ planeX: 0, planeY: -0.95, boxH: 0.4 }));

  assert.equal(placement, null);
});

test('free-box hover under the wardrobe column still allows removing an existing bad free box', () => {
  const placement = resolveSketchFreeBoxHoverPlacement(
    makeArgs({
      planeX: 0,
      planeY: -0.95,
      boxH: 0.4,
      freeBoxes: [
        {
          id: 'bad-under-wardrobe',
          freePlacement: true,
          absX: 0,
          absY: -0.95,
          heightM: 0.4,
          widthM: 0.6,
          depthM: 0.5,
        },
      ],
    })
  );

  assert.ok(placement);
  assert.equal(placement.op, 'remove');
  assert.equal(placement.removeId, 'bad-under-wardrobe');
});
