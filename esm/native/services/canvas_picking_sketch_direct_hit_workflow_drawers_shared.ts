import type { SketchConfigLike } from './canvas_picking_sketch_direct_hit_workflow_contracts.js';
import {
  ensureArray,
  ensureSketchExtras,
  readRecordString,
} from './canvas_picking_sketch_direct_hit_workflow_records.js';
import { asRecord } from '../runtime/record.js';

export function removeSketchDrawerById(cfg: SketchConfigLike, drawerId: string): void {
  const extra = ensureSketchExtras(cfg);
  const list = ensureArray(extra, 'drawers');
  const idx = list.findIndex(item => readRecordString(item, 'id') === drawerId);
  if (idx >= 0) list.splice(idx, 1);
}

export function removeSketchExternalDrawerById(
  cfg: SketchConfigLike,
  drawerId: string,
  boxId?: string
): void {
  const extra = ensureSketchExtras(cfg);
  const topLevel = ensureArray(extra, 'extDrawers');
  const topIdx = topLevel.findIndex(item => readRecordString(item, 'id') === drawerId);
  if (topIdx >= 0) {
    topLevel.splice(topIdx, 1);
    return;
  }

  const boxes = ensureArray(extra, 'boxes');
  const candidateBoxes = boxId ? boxes.filter(box => readRecordString(box, 'id') === boxId) : boxes;
  for (let i = 0; i < candidateBoxes.length; i++) {
    const box = asRecord(candidateBoxes[i]);
    if (!box) continue;
    const list = ensureArray(box, 'extDrawers');
    const idx = list.findIndex(item => readRecordString(item, 'id') === drawerId);
    if (idx >= 0) {
      list.splice(idx, 1);
      return;
    }
  }
}
