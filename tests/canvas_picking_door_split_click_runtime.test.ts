import test from 'node:test';
import assert from 'node:assert/strict';

import { handleCanvasDoorSplitClick } from '../esm/native/services/canvas_picking_door_split_click.ts';
import { tryHandleSplitDoorHover } from '../esm/native/services/canvas_picking_door_split_hover_flow.ts';
import {
  readCanvasDoorSplitBounds,
  resolveCanvasDoorSplitBaseKey,
} from '../esm/native/services/canvas_picking_door_split_click_shared.ts';

type DoorActionCall = {
  type: 'setSplit' | 'setSplitBottom' | 'setKey';
  mapName?: string;
  key: string;
  next: unknown;
  source?: unknown;
};

function createDoorGroup(partId: string, y: number, height: number) {
  return {
    group: {
      userData: { partId, __doorHeight: height },
      position: { y },
    },
  };
}

function createSplitClickApp(args: {
  splitVariant?: string;
  doorsArray: unknown[];
  maps?: Record<string, Record<string, unknown>>;
}) {
  const calls: DoorActionCall[] = [];
  const historyMeta: unknown[] = [];
  const toasts: Array<{ message: string; type?: string }> = [];
  const maps: Record<string, Record<string, unknown>> = {
    splitDoorsMap: {},
    splitDoorsBottomMap: {},
    ...(args.maps || {}),
  };
  const state = {
    ui: {},
    config: {},
    runtime: {},
    mode: { opts: { splitVariant: args.splitVariant || '' } },
    meta: { version: 0, updatedAt: 0, dirty: false },
  };

  const App = {
    store: {
      getState() {
        return state;
      },
    },
    render: {
      doorsArray: args.doorsArray,
      wardrobeGroup: {},
    },
    maps: {
      getMap(name: string) {
        return maps[name] || null;
      },
      setKey(mapName: string, key: string, next: unknown, meta?: { source?: unknown }) {
        if (!maps[mapName]) maps[mapName] = {};
        maps[mapName][key] = next;
        calls.push({ type: 'setKey', mapName, key, next, source: meta?.source });
      },
    },
    services: {
      uiFeedback: {
        toast(message: string, type?: string) {
          toasts.push({ message, type });
        },
      },
    },
    actions: {
      doors: {
        setSplit(key: string, next: boolean, meta?: { source?: unknown }) {
          maps.splitDoorsMap[key] = next;
          calls.push({ type: 'setSplit', key, next, source: meta?.source });
        },
        setSplitBottom(key: string, next: boolean, meta?: { source?: unknown }) {
          maps.splitDoorsBottomMap[key] = next;
          calls.push({ type: 'setSplitBottom', key, next, source: meta?.source });
        },
      },
      history: {
        batch<T>(fn: () => T, meta?: unknown): T {
          historyMeta.push(meta);
          return fn();
        },
      },
    },
  };

  return { App: App as never, calls, historyMeta, maps, toasts };
}

test('split click base normalization uses canonical lower/corner door family ids', () => {
  const { App } = createSplitClickApp({ doorsArray: [] });

  assert.equal(resolveCanvasDoorSplitBaseKey(App, 'd4_top'), 'd4');
  assert.equal(resolveCanvasDoorSplitBaseKey(App, 'corner_door_2_mid'), 'corner_door_2');
  assert.equal(resolveCanvasDoorSplitBaseKey(App, 'lower_d4_bot'), 'lower_d4');
  assert.equal(resolveCanvasDoorSplitBaseKey(App, 'lower_corner_door_2_top'), 'lower_corner_door_2');
  assert.equal(
    resolveCanvasDoorSplitBaseKey(App, 'lower_corner_pent_door_3_bot'),
    'lower_corner_pent_door_3'
  );
});

test('lower split door clicks resolve bottom split action using full-family bounds', () => {
  const { App, calls, historyMeta, maps } = createSplitClickApp({
    doorsArray: [createDoorGroup('lower_d4_bot', 0.5, 1), createDoorGroup('lower_d4_top', 1.5, 1)],
  });

  assert.deepEqual(readCanvasDoorSplitBounds(App, 'lower_d4'), { minY: 0, maxY: 2 });

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'lower_d4_bot',
    foundModuleStack: 'bottom',
    doorHitY: 0.5,
  });

  assert.equal(handled, true);
  assert.deepEqual(calls, [
    {
      type: 'setSplitBottom',
      key: 'splitb_lower_d4',
      next: true,
      source: 'splitDoorsBottom:click',
    },
  ]);
  assert.equal(maps.splitDoorsBottomMap.splitb_lower_d4, true);
  assert.deepEqual(historyMeta, [{ source: 'splitDoorsBottom:click', immediate: true }]);
});

test('lower corner custom split commits canonical split position against full-family bounds', () => {
  const { App, calls, maps } = createSplitClickApp({
    splitVariant: 'custom',
    doorsArray: [
      createDoorGroup('lower_corner_door_2_bot', 1, 2),
      createDoorGroup('lower_corner_door_2_top', 3, 2),
    ],
  });

  assert.deepEqual(readCanvasDoorSplitBounds(App, 'lower_corner_door_2'), { minY: 0, maxY: 4 });

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'lower_corner_door_2_top',
    foundModuleStack: 'top',
    doorHitY: 2.5,
    ndcX: 0.12,
    ndcY: -0.18,
  });

  assert.equal(handled, true);
  assert.deepEqual(
    calls.map(call => [call.type, call.mapName || '', call.key, call.next, call.source]),
    [
      ['setSplitBottom', '', 'splitb_lower_corner_door_2', false, 'splitDoors:custom'],
      ['setSplit', '', 'split_lower_corner_door_2', true, 'splitDoors:custom'],
      ['setKey', 'splitDoorsMap', 'splitpos_lower_corner_door_2', [0.625], 'splitDoors:custom'],
    ]
  );
  assert.deepEqual(maps.splitDoorsMap.splitpos_lower_corner_door_2, [0.625]);
});

test('custom split click projects pointer onto the visible cut-marker plane instead of using a stale lower raycast point', () => {
  class Vec3 {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0
    ) {}
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    clone() {
      return new Vec3(this.x, this.y, this.z);
    }
    sub(other: { x: number; y: number; z: number }) {
      this.x -= other.x;
      this.y -= other.y;
      this.z -= other.z;
      return this;
    }
    multiplyScalar(n: number) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
      return this;
    }
    add(other: { x: number; y: number; z: number }) {
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
      return this;
    }
  }

  const group = {
    userData: { partId: 'd1_full', __doorHeight: 4, __handleZSign: 1 },
    position: { y: 2 },
    worldToLocal(v: Vec3) {
      return v;
    },
    localToWorld(v: Vec3) {
      return v;
    },
  } as any;
  const { App, maps } = createSplitClickApp({
    splitVariant: 'custom',
    doorsArray: [{ group }],
  });
  (App as any).deps = { THREE: { Vector3: Vec3, Box3: class {} } };
  (App as any).render.camera = {};

  const raycaster = {
    ray: { origin: { x: 0, y: 2.5, z: 1 }, direction: { x: 0, y: 0, z: -1 } },
    setFromCamera() {},
    intersectObjects() {
      return [];
    },
  } as any;
  const mouse = { x: 0, y: 0 };

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'd1_full',
    foundModuleStack: 'top',
    doorHitY: 1,
    ndcX: 0,
    ndcY: 0,
    raycaster,
    mouse,
    camera: (App as any).render.camera,
    doorHitGroup: group,
  });

  assert.equal(handled, true);
  assert.deepEqual(maps.splitDoorsMap.splitpos_d1, [0.625]);
});

test('custom split click blocks too-close add attempts instead of committing a no-op cut', () => {
  const { App, calls, maps, toasts } = createSplitClickApp({
    splitVariant: 'custom',
    doorsArray: [createDoorGroup('d1_bot', 1, 2), createDoorGroup('d1_top', 3, 2)],
    maps: { splitDoorsMap: { split_d1: true, splitpos_d1: [0.625] } },
  });

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'd1_top',
    foundModuleStack: 'top',
    doorHitY: 2.59,
    ndcX: 0,
    ndcY: 0,
  });

  assert.equal(handled, true);
  assert.deepEqual(calls, []);
  assert.equal(maps.splitDoorsMap.split_d1, true);
  assert.deepEqual(maps.splitDoorsMap.splitpos_d1, [0.625]);
  assert.deepEqual(toasts, [
    {
      message: 'אי אפשר לחתוך דלת במרחק קטן מדי מחיתוך קיים או מקצה הדלת.',
      type: 'error',
    },
  ]);
});

test('custom split click removes an existing cut by screen-space line proximity even when raycast y is stale', () => {
  class Vec3 {
    constructor(
      public x = 0,
      public y = 0,
      public z = 0
    ) {}
    clone() {
      return new Vec3(this.x, this.y, this.z);
    }
    sub(other: { x: number; y: number; z: number }) {
      this.x -= other.x;
      this.y -= other.y;
      this.z -= other.z;
      return this;
    }
    multiplyScalar(n: number) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
      return this;
    }
    add(other: { x: number; y: number; z: number }) {
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
      return this;
    }
    project() {
      this.x = this.x / 2;
      this.y = this.y / 10;
      return this;
    }
  }

  const group = {
    userData: {
      partId: 'd1_top',
      __doorHeight: 2,
      __doorWidth: 0.5,
      __doorMeshOffsetX: 0,
      __handleZSign: 1,
    },
    position: { y: 3 },
    worldToLocal(v: Vec3) {
      v.y -= this.position.y;
      return v;
    },
    localToWorld(v: Vec3) {
      v.y += this.position.y;
      return v;
    },
    getWorldPosition(v: Vec3) {
      v.y = this.position.y;
      return v;
    },
  } as any;
  const { App, maps } = createSplitClickApp({
    splitVariant: 'custom',
    doorsArray: [createDoorGroup('d1_bot', 1, 2), { group }],
    maps: { splitDoorsMap: { split_d1: true, splitpos_d1: [0.625] } },
  });
  (App as any).deps = { THREE: { Vector3: Vec3, Box3: class {} } };
  (App as any).render.camera = {};

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'd1_top',
    foundModuleStack: 'top',
    doorHitY: 1,
    ndcX: 0,
    ndcY: 0.25,
    raycaster: {
      ray: { origin: { x: 0, y: 1, z: 1 }, direction: { x: 0, y: 0, z: -1 } },
      setFromCamera() {},
    } as any,
    mouse: { x: 0, y: 0 },
    camera: (App as any).render.camera,
    doorHitGroup: group,
  });

  assert.equal(handled, true);
  assert.equal(maps.splitDoorsMap.split_d1, false);
  assert.equal(maps.splitDoorsMap.splitpos_d1, null);
});

test('custom split hover shows a blocked marker when construction policy would reject a nearby cut', () => {
  class Vec3 {
    x = 0;
    y = 0;
    z = 0;
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    copy(other: { x: number; y: number; z: number }) {
      this.x = other.x;
      this.y = other.y;
      this.z = other.z;
      return this;
    }
  }
  class Quat {
    copy() {
      return this;
    }
  }

  const wardrobeGroup = {
    worldToLocal(v: Vec3) {
      return v;
    },
  };
  const group = {
    userData: {
      partId: 'd1_top',
      __doorHeight: 2,
      __doorWidth: 0.5,
      __hingeLeft: true,
    },
    material: {},
    position: { y: 3 },
    parent: wardrobeGroup,
    getWorldPosition(v: Vec3) {
      v.set(0, 3, 0);
    },
    localToWorld(v: Vec3) {
      v.y += this.position.y;
      return v;
    },
    getWorldQuaternion() {
      return undefined;
    },
  } as any;
  const App = {
    deps: { THREE: { Vector3: Vec3, Quaternion: Quat } },
    render: {
      renderer: {},
      camera: {},
      wardrobeGroup,
      doorsArray: [{ group }],
    },
    store: {
      getState() {
        return { ui: {}, config: {}, runtime: {}, mode: {}, meta: {} };
      },
    },
  } as any;
  const runtime: Record<string, unknown> = {};
  const marker = {
    visible: true,
    material: null as unknown,
    userData: { __matRemove: 'remove', __matAdd: 'add' },
    position: { copy() {} },
    quaternion: { copy() {} },
    scale: { set() {} },
  };

  const handled = tryHandleSplitDoorHover({
    App,
    ndcX: 0,
    ndcY: 0,
    raycaster: {} as any,
    mouse: {} as any,
    marker: null,
    cutMarker: marker as any,
    splitVariant: 'custom',
    normalizeDoorBaseKey() {
      return 'd1';
    },
    readSplitHoverDoorBounds() {
      return { minY: 0, maxY: 4 };
    },
    getCanvasPickingRuntime() {
      return runtime as any;
    },
    readSplitPosList() {
      return [0.625];
    },
    getRegularSplitPreviewLineY() {
      return null;
    },
    reportPickingIssue() {
      return undefined;
    },
    getViewportRoots() {
      return { camera: {}, wardrobeGroup, scene: null, renderer: {} };
    },
    getSplitHoverRaycastRoots() {
      return [group];
    },
    raycastReuse() {
      return [{ object: group, point: { x: 0, y: 2.59, z: 0 } }];
    },
    isViewportRoot(_App: unknown, node: unknown) {
      return node === wardrobeGroup;
    },
    str(_App: unknown, value: unknown) {
      return String(value || '');
    },
    isDoorLikePartId(partId: string) {
      return /^d\d+/.test(partId);
    },
  });

  assert.equal(handled, true);
  assert.equal(marker.visible, true);
  assert.equal(marker.material, 'remove');
});

test('custom split click blocks edge-clamped add attempts instead of auto-moving the cut inward', () => {
  const { App, calls, maps, toasts } = createSplitClickApp({
    splitVariant: 'custom',
    doorsArray: [createDoorGroup('d1_bot', 1, 2), createDoorGroup('d1_top', 3, 2)],
  });

  const handled = handleCanvasDoorSplitClick({
    App,
    effectiveDoorId: 'd1_top',
    foundModuleStack: 'top',
    doorHitY: 3.96,
    ndcX: 0,
    ndcY: 0,
  });

  assert.equal(handled, true);
  assert.deepEqual(calls, []);
  assert.equal(maps.splitDoorsMap.split_d1, undefined);
  assert.equal(maps.splitDoorsMap.splitpos_d1, undefined);
  assert.deepEqual(toasts, [
    {
      message: 'אי אפשר לחתוך דלת במרחק קטן מדי מחיתוך קיים או מקצה הדלת.',
      type: 'error',
    },
  ]);
});

test('custom split hover does not use a remembered post-click fallback when the fresh raycast misses', () => {
  class Vec3 {
    x = 0;
    y = 0;
    z = 0;
    set(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    copy(other: { x: number; y: number; z: number }) {
      this.x = other.x;
      this.y = other.y;
      this.z = other.z;
      return this;
    }
  }
  class Quat {
    copy() {
      return this;
    }
  }

  const group = {
    userData: {
      partId: 'd1_top',
      __doorHeight: 2,
      __doorWidth: 0.5,
      __hingeLeft: true,
    },
    position: { y: 2 },
    parent: {},
    getWorldPosition(v: Vec3) {
      v.set(0, 2, 0);
    },
    localToWorld(v: Vec3) {
      return v;
    },
    getWorldQuaternion() {
      return undefined;
    },
  } as any;
  const wardrobeGroup = {
    worldToLocal(v: Vec3) {
      return v;
    },
  };
  const App = {
    deps: { THREE: { Vector3: Vec3, Quaternion: Quat } },
    render: {
      renderer: {},
      camera: {},
      wardrobeGroup,
      doorsArray: [{ group }],
    },
    store: {
      getState() {
        return { ui: {}, config: {}, runtime: {}, mode: {}, meta: {} };
      },
    },
  } as any;
  const runtime: Record<string, unknown> = {};
  const marker = {
    visible: false,
    material: null as unknown,
    userData: { __matRemove: 'remove', __matAdd: 'add' },
    position: { copy() {} },
    quaternion: { copy() {} },
    scale: { set() {} },
  };
  const handled = tryHandleSplitDoorHover({
    App,
    ndcX: 0.12,
    ndcY: -0.18,
    raycaster: {} as any,
    mouse: {} as any,
    marker: null,
    cutMarker: marker as any,
    splitVariant: 'custom',
    normalizeDoorBaseKey() {
      return 'd1';
    },
    readSplitHoverDoorBounds() {
      return { minY: 0, maxY: 4 };
    },
    getCanvasPickingRuntime() {
      return runtime as any;
    },
    readSplitPosList() {
      return [0.625];
    },
    getRegularSplitPreviewLineY() {
      return null;
    },
    reportPickingIssue() {
      return undefined;
    },
    getViewportRoots() {
      return { camera: {}, wardrobeGroup, scene: null, renderer: {} };
    },
    getSplitHoverRaycastRoots() {
      return [];
    },
    raycastReuse() {
      return [];
    },
    isViewportRoot() {
      return false;
    },
    str(_App: unknown, value: unknown) {
      return String(value || '');
    },
    isDoorLikePartId(partId: string) {
      return /^d\d+/.test(partId);
    },
  });

  assert.equal(handled, false);
  assert.equal(marker.visible, false);
});
