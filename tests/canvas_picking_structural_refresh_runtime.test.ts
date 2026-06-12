import test from 'node:test';
import assert from 'node:assert/strict';

import {
  requestCanvasPickingCommitStructuralRefresh,
  requestCanvasPickingDebouncedAuthoringRefresh,
  requestCanvasPickingImmediateAuthoringRefresh,
} from '../esm/native/services/canvas_picking_structural_refresh.ts';

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createAppHarness() {
  const calls = {
    builds: [] as Array<{ uiOverride: unknown; meta: Record<string, unknown> }>,
    renders: [] as boolean[],
  };

  const App = {
    services: {
      builder: {
        requestBuild(uiOverride: unknown, meta: Record<string, unknown>) {
          calls.builds.push({ uiOverride: cloneJson(uiOverride), meta: cloneJson(meta) });
          return true;
        },
      },
    },
    platform: {
      triggerRender(updateShadows?: boolean) {
        calls.renders.push(!!updateShadows);
        return true;
      },
    },
  } as any;

  return { App, calls };
}

test('[canvas-picking-structural-refresh] commit profile requests forced immediate build and render follow-through', () => {
  const { App, calls } = createAppHarness();

  requestCanvasPickingCommitStructuralRefresh(App, 'cellDims.apply');

  assert.deepEqual(calls.builds, [
    {
      uiOverride: null,
      meta: { source: 'cellDims.apply', immediate: true, force: true, reason: 'cellDims.apply' },
    },
  ]);
  assert.deepEqual(calls.renders, [false]);
});

test('[canvas-picking-structural-refresh] debounced authoring profile keeps coalesced edits non-forced', () => {
  const { App, calls } = createAppHarness();

  requestCanvasPickingDebouncedAuthoringRefresh(App, 'removeDoors:smart');

  assert.deepEqual(calls.builds, [
    {
      uiOverride: null,
      meta: {
        source: 'removeDoors:smart',
        immediate: false,
        force: false,
        reason: 'removeDoors:smart',
      },
    },
  ]);
  assert.deepEqual(calls.renders, []);
});

test('[canvas-picking-structural-refresh] immediate authoring profile does not force or trigger render follow-through', () => {
  const { App, calls } = createAppHarness();

  requestCanvasPickingImmediateAuthoringRefresh(App, 'groove:click');

  assert.deepEqual(calls.builds, [
    {
      uiOverride: null,
      meta: { source: 'groove:click', immediate: true, force: false, reason: 'groove:click' },
    },
  ]);
  assert.deepEqual(calls.renders, []);
});
