import test from 'node:test';
import assert from 'node:assert/strict';

import { getMaterial } from '../esm/native/builder/materials_factory.ts';
import { ensureRenderCacheMaps, ensureRenderMetaMaps } from '../esm/native/runtime/render_access.ts';

type AnyRecord = Record<string, unknown>;

function makeStore(runtime: AnyRecord) {
  return {
    getState() {
      return { runtime };
    },
    subscribe() {
      return () => undefined;
    },
  };
}

function makeThreeStub() {
  class MeshBasicMaterial {
    userData: AnyRecord = {};
    constructor(public opts: AnyRecord) {}
  }

  class MeshStandardMaterial {
    userData: AnyRecord = {};
    constructor(public opts: AnyRecord) {}
  }

  return {
    MeshBasicMaterial,
    MeshStandardMaterial,
    Texture: class {},
    CanvasTexture: class {},
    RepeatWrapping: 'repeat',
  };
}

test('materials_factory uses canonical render cache/meta seams without materializing compat refs on App', () => {
  const App: AnyRecord = {
    deps: { THREE: makeThreeStub() },
    store: makeStore({ sketchMode: true }),
  };

  const material = getMaterial(App, '#ffffff', 'front');
  assert.ok(material);

  const renderCache = ensureRenderCacheMaps(App);
  const renderMeta = ensureRenderMetaMaps(App);
  assert.equal(renderCache.materialCache instanceof Map, true);
  assert.equal(renderMeta.material instanceof Map, true);
  assert.equal(renderCache.materialCache.has('sketch_white'), true);
  assert.equal(renderMeta.material.has('sketch_white'), true);

  assert.equal('__wpRenderCache' in App, false);
  assert.equal('__wpRenderMeta' in App, false);
  assert.equal('__wpRenderMaterials' in App, false);
});

test('materials_factory keeps front color albedo canonical instead of applying display compensation', () => {
  const App: AnyRecord = {
    deps: { THREE: makeThreeStub() },
    store: makeStore({ sketchMode: false }),
  };

  const material = getMaterial(App, '#336699', 'front') as AnyRecord;
  assert.equal((material.opts as AnyRecord).color, '#336699');
});
