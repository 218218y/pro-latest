import type { AppContainer } from '../../../types';

import { requestBuilderStructuralRefresh } from '../runtime/builder_service_access.js';

type DoorAuthoringRefreshProfile = {
  immediate: boolean;
  force: boolean;
  triggerRender: boolean;
  updateShadows: boolean;
};

const DEBOUNCED_AUTHORING_REFRESH: DoorAuthoringRefreshProfile = {
  immediate: false,
  force: false,
  triggerRender: false,
  updateShadows: false,
};

const IMMEDIATE_AUTHORING_REFRESH: DoorAuthoringRefreshProfile = {
  immediate: true,
  force: false,
  triggerRender: false,
  updateShadows: false,
};

function requestDoorAuthoringRefresh(
  App: AppContainer,
  source: string,
  profile: DoorAuthoringRefreshProfile
): void {
  requestBuilderStructuralRefresh(App, {
    source,
    immediate: profile.immediate,
    force: profile.force,
    triggerRender: profile.triggerRender,
    updateShadows: profile.updateShadows,
  });
}

export function requestDoorAuthoringBurstRefresh(App: AppContainer, source: string): void {
  requestDoorAuthoringRefresh(App, source, DEBOUNCED_AUTHORING_REFRESH);
}

export function requestDoorAuthoringImmediateRefresh(App: AppContainer, source: string): void {
  requestDoorAuthoringRefresh(App, source, IMMEDIATE_AUTHORING_REFRESH);
}
