import type { ActionMetaLike } from '../../../types';

function normalizeCanvasPickingDoorAuthoringSource(source: string): string {
  const normalized = String(source || '').trim();
  if (!normalized) {
    throw new Error('[WardrobePro] Canvas picking door-authoring structural meta requires a source.');
  }
  return normalized;
}

export function createCanvasPickingDoorAuthoringStructuralMeta(source: string): ActionMetaLike {
  return {
    source: normalizeCanvasPickingDoorAuthoringSource(source),
    immediate: true,
  };
}
