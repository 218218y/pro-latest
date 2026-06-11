import test from 'node:test';
import assert from 'node:assert/strict';

import { handleCanvasDoorGrooveClick } from '../esm/native/services/canvas_picking_door_hinge_groove_click.ts';
import {
  requestDoorAuthoringBurstRefresh,
  requestDoorAuthoringImmediateRefresh,
} from '../esm/native/services/canvas_picking_door_authoring_burst.ts';

type BuildRequest = {
  uiOverride: unknown;
  meta: Record<string, unknown>;
};

function createApp() {
  const buildRequests: BuildRequest[] = [];
  const state: Record<string, any> = {
    config: {
      groovesMap: {},
      grooveLinesCountMap: {},
    },
    runtime: {},
    ui: {
      raw: {
        width: 100,
        doors: 2,
      },
    },
    mode: {},
  };

  const App: any = {
    store: {
      getState() {
        return state;
      },
      setRuntime(patch: Record<string, unknown>) {
        state.runtime = { ...state.runtime, ...patch };
      },
      patch(patch: Record<string, any>) {
        for (const [key, value] of Object.entries(patch || {})) {
          state[key] = { ...(state[key] || {}), ...(value || {}) };
        }
      },
    },
    maps: {
      getMap(mapName: string) {
        return state.config[mapName] || {};
      },
      setKey(mapName: string, key: string, value: unknown) {
        const map = (state.config[mapName] ||= {});
        if (value == null) delete map[key];
        else map[key] = value;
      },
    },
    actions: {
      config: {
        setMap(mapName: string, nextMap: Record<string, unknown>) {
          state.config[mapName] = { ...(nextMap || {}) };
        },
      },
      history: {
        batch(_meta: unknown, fn: () => unknown) {
          return fn();
        },
      },
    },
    render: {
      doorsArray: [],
      drawersArray: [],
    },
    services: {
      builder: {
        __scheduler: { __esm_v1: true },
        requestBuild(uiOverride: unknown, meta: Record<string, unknown>) {
          buildRequests.push({ uiOverride, meta: { ...(meta || {}) } });
          return true;
        },
      },
    },
  };

  return { App, state, buildRequests };
}

test('door authoring burst refresh stays debounced for coalesced structural edits', () => {
  const { App, buildRequests } = createApp();

  requestDoorAuthoringBurstRefresh(App, 'removeDoors:smart');

  assert.equal(buildRequests.length, 1);
  assert.equal(buildRequests[0].meta.source, 'removeDoors:smart');
  assert.equal(buildRequests[0].meta.immediate, false);
  assert.equal(buildRequests[0].meta.force, false);
});

test('door authoring immediate refresh runs before the post-click hover refresh frame', () => {
  const { App, buildRequests } = createApp();

  requestDoorAuthoringImmediateRefresh(App, 'groove:click');

  assert.equal(buildRequests.length, 1);
  assert.equal(buildRequests[0].meta.source, 'groove:click');
  assert.equal(buildRequests[0].meta.immediate, true);
  assert.equal(buildRequests[0].meta.force, false);
});

test('regular door groove click toggles the groove and requests an immediate rebuild for stable remove hover', () => {
  const { App, state, buildRequests } = createApp();

  const handled = handleCanvasDoorGrooveClick({
    App,
    effectiveDoorId: 'd1_left',
    foundPartId: null,
    activeStack: 'top',
    foundModuleStack: 'top',
    doorHitObject: {
      userData: {
        partId: 'd1_left',
        __doorWidth: 0.45,
      },
    },
  });

  assert.equal(handled, true);
  assert.equal(state.config.groovesMap.groove_d1_left, true);
  assert.equal(typeof state.config.grooveLinesCountMap.d1_left, 'number');
  assert.equal(buildRequests.length, 1);
  assert.equal(buildRequests[0].meta.source, 'groove:click');
  assert.equal(buildRequests[0].meta.immediate, true);
  assert.equal(buildRequests[0].meta.force, false);
});
