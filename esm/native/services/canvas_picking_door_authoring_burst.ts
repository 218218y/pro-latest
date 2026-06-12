import type { AppContainer } from '../../../types';

import {
  requestCanvasPickingDebouncedAuthoringRefresh,
  requestCanvasPickingImmediateAuthoringRefresh,
} from './canvas_picking_structural_refresh.js';

export function requestDoorAuthoringBurstRefresh(App: AppContainer, source: string): void {
  requestCanvasPickingDebouncedAuthoringRefresh(App, source);
}

export function requestDoorAuthoringImmediateRefresh(App: AppContainer, source: string): void {
  requestCanvasPickingImmediateAuthoringRefresh(App, source);
}
