/**
 * Shared visual-lighting calibration for the room/cabinet viewport.
 *
 * These values are intentionally kept in normal display-light units: no PI
 * multiplier and no old-light scale compensation. The regular viewport mode and
 * the default advanced-lighting preset both read from this file, so tuning the
 * baseline brightness stays predictable instead of splitting into two different
 * lighting worlds.
 */
export const VIEWPORT_NORMAL_EXPOSURE = 1.4;

export const VIEWPORT_NORMAL_LIGHTING_PRESET = {
  amb: 1.2,
  dir: 1.45,
  x: 5,
  y: 8,
  z: 8,
} as const;

export const VIEWPORT_SKETCH_AMBIENT_INTENSITY = 0.95;
