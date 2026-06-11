import { moduleHasHexCell } from '../features/hex_cell/index.js';
import { moduleHasAnyActiveSpecialDims } from '../features/special_dims/index.js';

export function moduleRequiresCustomBoundaryGeometry(cfgMod: unknown, heightOffsetCm: number): boolean {
  return moduleHasAnyActiveSpecialDims(cfgMod, heightOffsetCm) || moduleHasHexCell(cfgMod);
}
