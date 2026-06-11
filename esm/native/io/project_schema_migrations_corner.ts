import type { ProjectDataLike } from '../../../types/index.js';

import { asObject, asObjectRecord } from './project_payload_shared.js';
import type { EnsureTogglesRecordFn } from './project_schema_migrations_shared.js';

export function normalizeCornerConfigurationShape(data: ProjectDataLike): void {
  if (!data.cornerConfiguration || typeof data.cornerConfiguration !== 'object') {
    data.cornerConfiguration = {};
  }

  try {
    const cornerConfiguration = asObject(data.cornerConfiguration);
    if (
      !cornerConfiguration ||
      typeof cornerConfiguration !== 'object' ||
      Array.isArray(cornerConfiguration)
    ) {
      data.cornerConfiguration = {};
      return;
    }

    if (
      typeof cornerConfiguration.modulesConfiguration !== 'undefined' &&
      !Array.isArray(cornerConfiguration.modulesConfiguration)
    ) {
      cornerConfiguration.modulesConfiguration = [];
    }

    if (typeof cornerConfiguration.stackSplitLower !== 'undefined') {
      if (
        !cornerConfiguration.stackSplitLower ||
        typeof cornerConfiguration.stackSplitLower !== 'object' ||
        Array.isArray(cornerConfiguration.stackSplitLower)
      ) {
        cornerConfiguration.stackSplitLower = {};
      }
      const lower = asObjectRecord(cornerConfiguration.stackSplitLower);
      if (
        lower &&
        typeof lower.modulesConfiguration !== 'undefined' &&
        !Array.isArray(lower.modulesConfiguration)
      ) {
        lower.modulesConfiguration = [];
      }
      cornerConfiguration.stackSplitLower = lower || {};
    }

    data.cornerConfiguration = cornerConfiguration;
  } catch {}
}

export function inferInternalDrawersToggle(
  _data: ProjectDataLike,
  _ensureTogglesRecord: EnsureTogglesRecordFn
): void {
  // No automatic toggle inference on project load; the active sketch-drawer flow is explicit.
}
