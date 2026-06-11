import { useApp, useMeta } from '../hooks.js';
import type { SettingsVisualControllerModel } from './use_settings_visual_controller_contracts.js';
import { useSettingsVisualSections } from './use_settings_visual_controller_sections.js';
import { useSettingsVisualState } from './use_settings_visual_controller_state.js';

export type {
  SettingsVisualControllerModel,
  SettingsVisualControllerState,
  SettingsVisualDisplaySectionModel,
  SettingsVisualLightingSectionModel,
  SettingsVisualRoomSectionModel,
} from './use_settings_visual_controller_contracts.js';

export function useSettingsVisualController(): SettingsVisualControllerModel {
  const app = useApp();
  const meta = useMeta();
  const state = useSettingsVisualState();
  return useSettingsVisualSections({ app, meta, state });
}
