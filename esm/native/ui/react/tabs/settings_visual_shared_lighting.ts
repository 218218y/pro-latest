import type {
  LightingScalarKey,
  LightPresetName,
  LightPresetValue,
} from './settings_visual_shared_contracts.js';
import { VIEWPORT_NORMAL_LIGHTING_PRESET } from '../../../../shared/visual_lighting_tokens.js';

export const LIGHT_PRESETS: Record<LightPresetName, LightPresetValue> = {
  default: { ...VIEWPORT_NORMAL_LIGHTING_PRESET },
  natural: { amb: 0.9, dir: 1.75, x: 8, y: 10, z: 12 },
  evening: { amb: 0.46, dir: 1.08, x: -10, y: 5, z: 10 },
  front: { amb: 0.8, dir: 1.78, x: 0, y: 2, z: 10 },
};

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getLightBounds(key: LightingScalarKey): { min: number; max: number; step?: number } {
  switch (key) {
    case 'lightAmb':
      return { min: 0, max: 2, step: 0.05 };
    case 'lightDir':
      return { min: 0, max: 3, step: 0.1 };
    case 'lightX':
      return { min: -20, max: 20, step: 1 };
    case 'lightY':
      return { min: 0, max: 30, step: 1 };
    case 'lightZ':
      return { min: -10, max: 30, step: 1 };
    default:
      return { min: 0, max: 1 };
  }
}
