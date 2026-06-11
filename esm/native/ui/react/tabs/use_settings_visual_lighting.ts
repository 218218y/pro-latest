import { useMemo } from 'react';

import type { AppContainer, MetaActionsNamespaceLike } from '../../../../../types';

import type {
  LightPresetName,
  LightingScalarKey,
  RoomDesignRuntimeLike,
} from './settings_visual_shared_contracts.js';
import { createSettingsVisualLightingController } from './settings_visual_lighting_controller_runtime.js';

export type SettingsVisualLightingModel = {
  setLightingControl: (on: boolean) => void;
  setLightValue: (key: LightingScalarKey, value: number) => void;
  applyLightPreset: (name: LightPresetName) => void;
};

type UseSettingsVisualLightingArgs = {
  app: AppContainer;
  meta: MetaActionsNamespaceLike;
  roomDesignRuntime: RoomDesignRuntimeLike | null;
  defaultWall: string;
};

export function useSettingsVisualLighting(args: UseSettingsVisualLightingArgs): SettingsVisualLightingModel {
  const { app, meta, roomDesignRuntime, defaultWall } = args;

  const lightingController = useMemo(
    () => createSettingsVisualLightingController({ app, meta, roomDesignRuntime, defaultWall }),
    [app, meta, roomDesignRuntime, defaultWall]
  );

  return useMemo(
    () => ({
      setLightingControl: lightingController.setLightingControl,
      setLightValue: lightingController.setLightValue,
      applyLightPreset: lightingController.applyLightPreset,
    }),
    [
      lightingController.setLightingControl,
      lightingController.setLightValue,
      lightingController.applyLightPreset,
    ]
  );
}
