import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSketchExtrasArgs } from '../esm/native/builder/interior_pipeline_shared.ts';

test('sketch extras pipeline forwards folded-clothes content renderer', () => {
  const addFoldedClothes = () => null;
  const args = buildSketchExtrasArgs(
    {
      App: {} as any,
      showContentsEnabled: true,
      addFoldedClothes,
      effectiveBottomY: 0,
      effectiveTopY: 2.4,
    },
    {
      sketchExtras: { shelves: [{ id: 's1', yNorm: 0.5 }] },
    }
  );

  assert.equal(args.showContentsEnabled, true);
  assert.equal(args.addFoldedClothes, addFoldedClothes);
});
