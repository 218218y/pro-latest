import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clampDoorHandleLocalCenterYToFit,
  resolveDoorHandleVerticalFit,
  resolveExternalDrawerFitFromBody,
} from '../esm/shared/wardrobe_construction_validation_shared.ts';

test('external drawer fit rejects three regular drawers in a 60cm cabinet body', () => {
  const fit = resolveExternalDrawerFitFromBody({
    startY: 0,
    cabinetBodyHeight: 0.6,
    woodThick: 0.018,
    hasShoe: false,
    regCount: 3,
  });

  assert.equal(fit.fitsRequested, false);
  assert.equal(fit.maxRegularDrawers, 2);
  assert.equal(fit.regCount, 2);
  assert.equal(fit.drawerHeightTotal, 0.44);
});

test('external drawer fit accepts two regular drawers in a 60cm cabinet body', () => {
  const fit = resolveExternalDrawerFitFromBody({
    startY: 0,
    cabinetBodyHeight: 0.6,
    woodThick: 0.018,
    hasShoe: false,
    regCount: 2,
  });

  assert.equal(fit.fitsRequested, true);
  assert.equal(fit.maxRegularDrawers, 2);
  assert.equal(fit.regCount, 2);
});

test('door handle fit uses the actual handle footprint for standard, short edge, and long edge handles', () => {
  assert.equal(
    resolveDoorHandleVerticalFit({
      handleType: 'standard',
      doorHeightM: 0.12,
      localCenterYM: 0,
    }).fits,
    false
  );
  assert.equal(
    resolveDoorHandleVerticalFit({
      handleType: 'edge',
      edgeHandleVariant: 'long',
      doorHeightM: 0.3,
      localCenterYM: 0,
    }).fits,
    false
  );

  const clampedShort = clampDoorHandleLocalCenterYToFit({
    handleType: 'edge',
    edgeHandleVariant: 'short',
    doorHeightM: 0.3,
    localCenterYM: 0.2,
  });

  assert.ok(clampedShort != null);
  assert.ok(Math.abs(clampedShort - 0.05) < 1e-12);
});
