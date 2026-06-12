import type { ActionMetaLike } from '../../../types';

function normalizeCanvasPickingModulesPatchSource(source: string, profile: string): string {
  const normalized = String(source || '').trim();
  if (!normalized) {
    throw new Error(`[WardrobePro] Canvas picking modules ${profile} patch requires a source.`);
  }
  return normalized;
}

export function createCanvasPickingModulesStructuralPatchMeta(source: string): ActionMetaLike {
  return {
    source: normalizeCanvasPickingModulesPatchSource(source, 'structural'),
    immediate: true,
  };
}

export function createCanvasPickingModulesMotionPatchMeta(source: string): ActionMetaLike {
  return {
    source: normalizeCanvasPickingModulesPatchSource(source, 'motion'),
    immediate: false,
    noBuild: true,
    noHistory: true,
  };
}
