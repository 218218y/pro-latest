import test from 'node:test';
import assert from 'node:assert/strict';

import { appendHingedDoorOpsForModule } from '../esm/native/builder/hinged_doors_module_ops.ts';

test('hinged door module ops keep writing into the caller accumulator array', () => {
  const opsList: unknown[] = [];

  const nextDoorId = appendHingedDoorOpsForModule({
    cfg: { wardrobeType: 'hinged' },
    moduleIndex: 0,
    modulesLength: 2,
    moduleDoors: 2,
    modWidth: 0.8,
    currentX: -0.4,
    globalDoorCounter: 1,
    drawerHeightTotal: 0,
    effectiveBottomY: 0.018,
    startY: 0,
    woodThick: 0.018,
    cabinetBodyHeight: 2.4,
    D: 0.55,
    moduleDoorFrontZ: 0.275,
    splitLineY: 1.4,
    splitDoors: false,
    opsList,
    hingedDoorPivotMap: {
      1: { pivotX: -0.4, meshOffsetX: 0.2, isLeftHinge: true, doorWidth: 0.4 },
      2: { pivotX: 0.4, meshOffsetX: -0.2, isLeftHinge: false, doorWidth: 0.4 },
    },
    globalHandleAbsY: 1.05,
    config: {},
    moduleCfgList: [],
    isGroovesEnabled: false,
    removeDoorsEnabled: false,
  });

  assert.equal(nextDoorId, 3);
  assert.equal(opsList.length, 2);
  assert.equal((opsList[0] as { partId?: string }).partId, 'd1_full');

  assert.equal((opsList[1] as { partId?: string }).partId, 'd2_full');
});

test('hinged door module ops orchestrator keeps mixed full/split routes and drawer shadow routing canonical', () => {
  const shadowCalls: unknown[] = [];
  const App = {
    services: {
      builder: {
        renderOps: {
          createDrawerShadowPlane(args: unknown) {
            shadowCalls.push(args);
          },
        },
      },
    },
  } as any;
  const opsList: any[] = [];

  const nextDoorId = appendHingedDoorOpsForModule({
    App,
    cfg: {
      wardrobeType: 'hinged',
      splitDoorsMap: { split_d2: true },
      isMultiColorMode: false,
    },
    moduleIndex: 0,
    modulesLength: 1,
    moduleDoors: 2,
    modWidth: 1,
    currentX: 0,
    globalDoorCounter: 1,
    drawerHeightTotal: 0.3,
    effectiveBottomY: 0.018,
    startY: 0,
    woodThick: 0.018,
    cabinetBodyHeight: 2.4,
    D: 0.55,
    moduleDoorFrontZ: 0.275,
    splitLineY: 1.35,
    splitDoors: true,
    opsList,
    shadowMat: { kind: 'shadow' },
    externalW: 1,
    externalCenterX: 0.5,
    globalHandleAbsY: 1.05,
    config: {},
    moduleCfgList: [],
    isGroovesEnabled: false,
    removeDoorsEnabled: false,
    isDoorSplit: (map: Record<string, unknown> | null | undefined, doorId: number) =>
      !!map?.[`split_d${doorId}`],
  });

  assert.equal(nextDoorId, 3);
  assert.equal(shadowCalls.length, 1);
  assert.deepEqual(
    opsList.map(entry => entry.partId),
    ['d1_full', 'd2_top', 'd2_bot']
  );
});

test('hinged door module ops place inset doors inside the carcass frame in Y and Z', () => {
  const opsList: any[] = [];

  const nextDoorId = appendHingedDoorOpsForModule({
    cfg: { wardrobeType: 'hinged', doorMountMode: 'inset' },
    moduleIndex: 0,
    modulesLength: 1,
    moduleDoors: 1,
    modWidth: 0.928,
    currentX: -0.464,
    globalDoorCounter: 1,
    drawerHeightTotal: 0,
    effectiveBottomY: 0.036,
    startY: 0,
    woodThick: 0.036,
    cabinetBodyHeight: 2.4,
    D: 0.6,
    moduleDoorFrontZ: 0.3,
    splitLineY: 1.35,
    splitDoors: false,
    opsList,
    hingedDoorPivotMap: {
      1: { pivotX: -0.461, meshOffsetX: 0.461, isLeftHinge: true, doorWidth: 0.922 },
    },
    globalHandleAbsY: 1.05,
    config: {},
    moduleCfgList: [],
    isGroovesEnabled: false,
    removeDoorsEnabled: false,
  });

  assert.equal(nextDoorId, 2);
  assert.equal(opsList.length, 1);
  assert.ok(Math.abs(opsList[0].z - 0.288) < 1e-9);
  assert.ok(Math.abs(opsList[0].height - 2.322) < 1e-9);
  assert.ok(Math.abs(opsList[0].y - 1.2) < 1e-9);
});
