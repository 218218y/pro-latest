import test from 'node:test';
import assert from 'node:assert/strict';

import type { AppContainer } from '../types';
import { getBuildReactionsServiceMaybe } from '../esm/native/runtime/build_reactions_access.ts';
import {
  consumeCanvasPostBuildHoverRefresh,
  requestCanvasPostBuildHoverRefresh,
} from '../esm/native/runtime/canvas_interaction_flags.ts';
import { installBuildReactionsService } from '../esm/native/services/build_reactions.ts';

test('installBuildReactionsService installs canonical services.buildReactions slot without replacing the slot object', () => {
  const existingSlot = Object.create(null) as Record<string, unknown>;
  existingSlot.keep = 'yes';

  const App: Record<string, unknown> = {
    services: Object.assign(Object.create(null), {
      buildReactions: existingSlot,
    }),
    store: {
      getState: () => ({ ui: { raw: {} } }),
    },
    render: {},
  };

  const service = installBuildReactionsService(App as any);
  const fromAccess = getBuildReactionsServiceMaybe(App);

  assert.equal(service, existingSlot);
  assert.equal(fromAccess, existingSlot);
  assert.equal(service.keep, 'yes');
  assert.equal(service.__esm_v1, true);
  assert.equal(typeof service.afterBuild, 'function');
});

test('installBuildReactionsService keeps the canonical slot stable across repeated installs and heals missing methods', () => {
  const afterBuildCalls: string[] = [];
  const existingSlot = Object.assign(Object.create(null), {
    keep: 'yes',
    afterBuild() {
      afterBuildCalls.push('existing');
    },
  }) as Record<string, unknown>;

  const App: Record<string, unknown> = {
    services: Object.assign(Object.create(null), {
      buildReactions: existingSlot,
    }),
    store: {
      getState: () => ({ ui: { raw: {} } }),
    },
    render: {},
  };

  const firstService = installBuildReactionsService(App as any);
  assert.equal(firstService, existingSlot);
  assert.equal(firstService.afterBuild, existingSlot.afterBuild);
  assert.equal(firstService.__esm_v1, true);

  const secondService = installBuildReactionsService(App as any);
  assert.equal(secondService, existingSlot);
  assert.equal(secondService.afterBuild, firstService.afterBuild);

  secondService.afterBuild?.(true);
  assert.deepEqual(afterBuildCalls, ['existing']);

  const preservedRef = secondService.afterBuild;
  delete (secondService as Record<string, unknown>).afterBuild;
  const healedService = installBuildReactionsService(App as any);
  assert.equal(healedService, existingSlot);
  assert.equal(typeof healedService.afterBuild, 'function');
  assert.equal(healedService.afterBuild, preservedRef);
});

test('installBuildReactionsService restores the canonical afterBuild ref after public slot drift', () => {
  const App: Record<string, unknown> = {
    services: Object.create(null),
    store: {
      getState: () => ({ ui: { raw: {} } }),
    },
    render: {},
  };

  const service = installBuildReactionsService(App as any) as Record<string, unknown>;
  const canonicalAfterBuild = service.afterBuild;
  assert.equal(typeof canonicalAfterBuild, 'function');

  const driftedAfterBuild = () => void 0;
  service.afterBuild = driftedAfterBuild;
  assert.equal(service.afterBuild, driftedAfterBuild);

  const healedService = installBuildReactionsService(App as any) as Record<string, unknown>;
  assert.equal(healedService, service);
  assert.equal(healedService.afterBuild, canonicalAfterBuild);
  assert.notEqual(healedService.afterBuild, driftedAfterBuild);
});

test('build reactions access heals a drifted afterBuild slot back to the canonical ref', () => {
  const App: Record<string, unknown> = {
    services: Object.create(null),
    store: {
      getState: () => ({ ui: { raw: {} } }),
    },
    render: {},
  };

  const service = installBuildReactionsService(App as any) as Record<string, unknown>;
  const canonicalAfterBuild = service.afterBuild;
  assert.equal(typeof canonicalAfterBuild, 'function');

  const driftedAfterBuild = () => void 0;
  service.afterBuild = driftedAfterBuild;
  assert.equal(service.afterBuild, driftedAfterBuild);

  const healedService = getBuildReactionsServiceMaybe(App) as Record<string, unknown>;
  assert.equal(healedService, service);
  assert.equal(healedService.afterBuild, canonicalAfterBuild);
  assert.equal(healedService.__wpAfterBuild, canonicalAfterBuild);
});

test('canonical build reactions refresh a pending canvas hover after the rebuilt scene exists', () => {
  const matrixCalls: string[] = [];
  const hoverCalls: Array<{ x: number; y: number; matrixCalls: string[] }> = [];
  const renderCalls: boolean[] = [];
  const App = {
    services: {
      canvasPicking: {
        handleHoverNDC(x: number, y: number) {
          hoverCalls.push({ x, y, matrixCalls: [...matrixCalls] });
          return true;
        },
      },
      platform: {
        triggerRender(updateShadows?: boolean) {
          renderCalls.push(updateShadows === true);
        },
      },
      sceneView: {
        syncFromStore() {
          return true;
        },
      },
    },
    store: {
      getState: () => ({ ui: { raw: {} } }),
    },
    render: {
      camera: {
        updateWorldMatrix(updateParents: boolean, updateChildren: boolean) {
          matrixCalls.push(`camera:${updateParents}:${updateChildren}`);
        },
      },
      wardrobeGroup: {
        updateWorldMatrix(updateParents: boolean, updateChildren: boolean) {
          matrixCalls.push(`wardrobe:${updateParents}:${updateChildren}`);
        },
      },
    },
  } as unknown as AppContainer;

  requestCanvasPostBuildHoverRefresh(App, 0.25, -0.4, 'test.afterBuild');
  const service = installBuildReactionsService(App);
  service.afterBuild?.(true);

  assert.deepEqual(hoverCalls, [
    {
      x: 0.25,
      y: -0.4,
      matrixCalls: ['camera:true:false', 'wardrobe:true:true'],
    },
  ]);
  assert.deepEqual(renderCalls, [false]);
  assert.equal(consumeCanvasPostBuildHoverRefresh(App), null);
});
