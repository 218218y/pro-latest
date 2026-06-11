import test from 'node:test';
import assert from 'node:assert/strict';

import { computeInteriorCustomOps } from '../esm/native/builder/core_storage_compute.js';

test('computeInteriorCustomOps prefers exact preset-backed rodOps over rounded grid rods', () => {
  const ops = computeInteriorCustomOps(
    {
      shelves: [true, false, false, false, true],
      rods: [false, true, false, false, true, false],
      rodOps: [
        {
          gridIndex: 2,
          yFactor: 2.3,
          enableHangingClothes: true,
          enableSingleHanger: true,
          limitFactor: 1.3,
          limitAdd: 0,
        },
        {
          gridIndex: 5,
          yFactor: 4.8,
          enableHangingClothes: true,
          enableSingleHanger: true,
          limitFactor: 2.5,
          limitAdd: 0,
        },
      ],
      storage: false,
      shelfVariants: [],
    },
    6
  );

  assert.deepEqual(
    ops.rods.map(rod => ({
      gridIndex: rod.gridIndex,
      yFactor: rod.yFactor,
      limitFactor: rod.limitFactor,
      limitAdd: rod.limitAdd,
    })),
    [
      { gridIndex: 2, yFactor: 2.3, limitFactor: 1.3, limitAdd: 0 },
      { gridIndex: 5, yFactor: 4.8, limitFactor: 2.5, limitAdd: 0 },
    ]
  );
});

test('computeInteriorPresetOps keeps split upper rod shelf clearance equal to regular hanging', async () => {
  const { computeInteriorPresetOps } = await import('../esm/native/features/interior_layout_presets/ops.ts');
  const hanging = computeInteriorPresetOps('hanging_top2');
  const split = computeInteriorPresetOps('hanging_split');

  const hangingRod = hanging.rods[0];
  const splitLowerRod = split.rods.reduce((lowest, rod) => (rod.yFactor < lowest.yFactor ? rod : lowest));
  const splitUpperRod = split.rods.reduce((highest, rod) => (rod.yFactor > highest.yFactor ? rod : highest));

  const nearestShelfAbove = (shelves: number[], yFactor: number): number =>
    shelves.filter(row => row > yFactor).sort((a, b) => a - b)[0];
  const clearance = (shelfRow: number, yFactor: number): number => Number((shelfRow - yFactor).toFixed(3));

  const hangingClearance = clearance(
    nearestShelfAbove(hanging.shelves, hangingRod.yFactor),
    hangingRod.yFactor
  );
  const splitUpperClearance = clearance(
    nearestShelfAbove(split.shelves, splitUpperRod.yFactor),
    splitUpperRod.yFactor
  );

  assert.equal(splitUpperClearance, hangingClearance);
  assert.equal(
    Number(splitUpperRod.limitFactor?.toFixed(3)),
    Number((splitUpperRod.yFactor - splitLowerRod.yFactor).toFixed(3))
  );
});

test('computeInteriorPresetOps aligns storage rod height with the regular hanging preset', async () => {
  const { computeInteriorPresetOps } = await import('../esm/native/features/interior_layout_presets/ops.ts');
  const hanging = computeInteriorPresetOps('hanging_top2');
  const storage = computeInteriorPresetOps('storage_shelf');
  assert.equal(storage.rods[0].yFactor, hanging.rods[0].yFactor);
  assert.equal(storage.rods[0].limitFactor, storage.rods[0].yFactor);
});
