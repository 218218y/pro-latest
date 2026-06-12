import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeWhitespace } from './_source_bundle.js';

const read = rel => normalizeWhitespace(fs.readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8'));

const doorAuthoringMeta = read('esm/native/services/canvas_picking_door_authoring_meta.ts');
const doorEditShared = read('esm/native/services/canvas_picking_door_edit_shared.ts');
const doorHingeGroove = read('esm/native/services/canvas_picking_door_hinge_groove_click.ts');
const doorRemove = read('esm/native/services/canvas_picking_door_remove_click.ts');
const doorSplitShared = read('esm/native/services/canvas_picking_door_split_click_shared.ts');
const doorSplitCustom = read('esm/native/services/canvas_picking_door_split_click_custom.ts');
const doorSplitToggle = read('esm/native/services/canvas_picking_door_split_click_toggle.ts');
const doorTrim = read('esm/native/services/canvas_picking_door_trim_click.ts');
const removablePartRemove = read('esm/native/services/canvas_picking_removable_part_remove_click.ts');

test('canvas picking door-authoring writes use one immediate structural meta owner', () => {
  assert.match(
    doorAuthoringMeta,
    /export function createCanvasPickingDoorAuthoringStructuralMeta\(source: string\): ActionMetaLike/
  );
  assert.match(doorAuthoringMeta, /Canvas picking door-authoring structural meta requires a source/);
  assert.match(doorAuthoringMeta, /immediate: true/);
  assert.doesNotMatch(doorAuthoringMeta, /noBuild:/);
  assert.doesNotMatch(doorAuthoringMeta, /noHistory:/);

  const helperImportPattern =
    /import \{ createCanvasPickingDoorAuthoringStructuralMeta \} from '\.\/canvas_picking_door_authoring_meta\.js';/;
  const sourceFiles = [
    doorEditShared,
    doorHingeGroove,
    doorRemove,
    doorSplitShared,
    doorTrim,
    removablePartRemove,
  ];
  for (const source of sourceFiles) {
    assert.match(source, helperImportPattern);
    assert.doesNotMatch(source, /\{\s*source:\s*[^}]*immediate:\s*true\s*\}/);
    assert.doesNotMatch(source, /\{\s*immediate:\s*true\s*,\s*source[^}]*\}/);
  }

  assert.match(doorEditShared, /createCanvasPickingDoorAuthoringStructuralMeta\(source\)/);
  assert.match(
    doorHingeGroove,
    /callDoorsAction\(App, 'setHinge', hingeKey, nextHinge, createCanvasPickingDoorAuthoringStructuralMeta\('hinge:click'\)\)/
  );
  assert.match(
    doorHingeGroove,
    /writeHinge\(App, hingeKey, nextHinge, createCanvasPickingDoorAuthoringStructuralMeta\('hinge:click'\)\)/
  );
  assert.match(
    doorHingeGroove,
    /__wp_historyBatch\(App, createCanvasPickingDoorAuthoringStructuralMeta\('groove:click'\)/
  );
  assert.match(doorRemove, /createCanvasPickingDoorAuthoringStructuralMeta\('removeDoors:smart'\)/);
  assert.match(removablePartRemove, /createCanvasPickingDoorAuthoringStructuralMeta\('removeParts:smart'\)/);
  assert.match(doorTrim, /const meta = createCanvasPickingDoorAuthoringStructuralMeta\('doorTrim:click'\)/);

  assert.match(
    doorSplitShared,
    /runCanvasDoorSplitHistoryBatch\([\s\S]*source: string,[\s\S]*createCanvasPickingDoorAuthoringStructuralMeta\(source\)/
  );
  assert.match(
    doorSplitShared,
    /callDoorsAction\(App, 'setSplit', key, next, createCanvasPickingDoorAuthoringStructuralMeta\(source\)\)/
  );
  assert.match(
    doorSplitShared,
    /callDoorsAction\(App, 'setSplitBottom', key, next, createCanvasPickingDoorAuthoringStructuralMeta\(source\)\)/
  );
  assert.match(
    doorSplitShared,
    /writeMapKey\(App, 'splitDoorsMap', splitPosKey, stored, createCanvasPickingDoorAuthoringStructuralMeta\(source\)\)/
  );
  assert.match(doorSplitCustom, /runCanvasDoorSplitHistoryBatch\(App, 'splitDoors:custom'/);
  assert.match(doorSplitToggle, /runCanvasDoorSplitHistoryBatch\(App, 'splitDoorsBottom:click'/);
  assert.match(doorSplitToggle, /runCanvasDoorSplitHistoryBatch\(App, 'splitDoors:click'/);
  assert.doesNotMatch(doorSplitCustom, /\{\s*source:\s*'splitDoors:custom'[\s\S]{0,40}immediate:\s*true/);
  assert.doesNotMatch(doorSplitToggle, /\{\s*source:\s*'splitDoors/);
});
