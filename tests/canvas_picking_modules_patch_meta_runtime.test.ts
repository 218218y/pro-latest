import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  createCanvasPickingModulesMotionPatchMeta,
  createCanvasPickingModulesStructuralPatchMeta,
} from '../esm/native/services/canvas_picking_modules_patch_meta.ts';

test('[canvas-picking/modules-patch-meta] structural patches are immediate build-visible writes', () => {
  const meta = createCanvasPickingModulesStructuralPatchMeta(' manualSketchBoxFree ');

  assert.deepEqual(meta, {
    source: 'manualSketchBoxFree',
    immediate: true,
  });
  assert.equal('noBuild' in meta, false);
  assert.equal('noHistory' in meta, false);
});

test('[canvas-picking/modules-patch-meta] motion patches persist runtime open state without rebuild/history', () => {
  assert.deepEqual(createCanvasPickingModulesMotionPatchMeta('sketchBoxDoorToggle'), {
    source: 'sketchBoxDoorToggle',
    immediate: false,
    noBuild: true,
    noHistory: true,
  });
});

test('[canvas-picking/modules-patch-meta] patch sources fail fast when missing', () => {
  assert.throws(
    () => createCanvasPickingModulesStructuralPatchMeta('   '),
    /Canvas picking modules structural patch requires a source/
  );
  assert.throws(
    () => createCanvasPickingModulesMotionPatchMeta(''),
    /Canvas picking modules motion patch requires a source/
  );
});
