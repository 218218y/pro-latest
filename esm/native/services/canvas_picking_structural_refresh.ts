import type { AppContainer } from '../../../types';

import { requestBuilderStructuralRefresh } from '../runtime/builder_service_access.js';

export type CanvasPickingStructuralRefreshProfile = {
  immediate: boolean;
  force: boolean;
  triggerRender: boolean;
  updateShadows: boolean;
};

export const CANVAS_PICKING_COMMIT_REFRESH_PROFILE: CanvasPickingStructuralRefreshProfile = {
  immediate: true,
  force: true,
  triggerRender: true,
  updateShadows: false,
};

export const CANVAS_PICKING_DEBOUNCED_AUTHORING_REFRESH_PROFILE: CanvasPickingStructuralRefreshProfile = {
  immediate: false,
  force: false,
  triggerRender: false,
  updateShadows: false,
};

export const CANVAS_PICKING_IMMEDIATE_AUTHORING_REFRESH_PROFILE: CanvasPickingStructuralRefreshProfile = {
  immediate: true,
  force: false,
  triggerRender: false,
  updateShadows: false,
};

export function requestCanvasPickingStructuralRefresh(
  App: AppContainer,
  source: string,
  profile: CanvasPickingStructuralRefreshProfile
): void {
  requestBuilderStructuralRefresh(App, {
    source,
    immediate: profile.immediate,
    force: profile.force,
    triggerRender: profile.triggerRender,
    updateShadows: profile.updateShadows,
  });
}

export function requestCanvasPickingCommitStructuralRefresh(App: AppContainer, source: string): void {
  requestCanvasPickingStructuralRefresh(App, source, CANVAS_PICKING_COMMIT_REFRESH_PROFILE);
}

export function requestCanvasPickingDebouncedAuthoringRefresh(App: AppContainer, source: string): void {
  requestCanvasPickingStructuralRefresh(App, source, CANVAS_PICKING_DEBOUNCED_AUTHORING_REFRESH_PROFILE);
}

export function requestCanvasPickingImmediateAuthoringRefresh(App: AppContainer, source: string): void {
  requestCanvasPickingStructuralRefresh(App, source, CANVAS_PICKING_IMMEDIATE_AUTHORING_REFRESH_PROFILE);
}
