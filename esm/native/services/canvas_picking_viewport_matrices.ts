import type { AppContainer, UnknownRecord } from '../../../types';
import { getCamera, getScene, getWardrobeGroup } from '../runtime/render_access.js';

type MatrixNodeLike = UnknownRecord & {
  updateWorldMatrix?: (updateParents?: boolean, updateChildren?: boolean) => unknown;
  updateMatrixWorld?: (force?: boolean) => unknown;
};

function asMatrixNode(value: unknown): MatrixNodeLike | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as MatrixNodeLike) : null;
}

function syncMatrixNode(value: unknown, updateChildren: boolean): boolean {
  const node = asMatrixNode(value);
  if (!node) return false;

  try {
    if (typeof node.updateWorldMatrix === 'function') {
      node.updateWorldMatrix(true, updateChildren);
      return true;
    }
    if (typeof node.updateMatrixWorld === 'function') {
      node.updateMatrixWorld(true);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function syncCanvasPickingViewportMatrices(App: AppContainer): boolean {
  let synced = false;

  synced = syncMatrixNode(getCamera(App), false) || synced;

  const wardrobeGroup = getWardrobeGroup(App);
  if (wardrobeGroup) {
    synced = syncMatrixNode(wardrobeGroup, true) || synced;
  } else {
    synced = syncMatrixNode(getScene(App), true) || synced;
  }

  return synced;
}
