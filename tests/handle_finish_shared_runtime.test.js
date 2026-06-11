import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const palettePath = path.resolve('esm/native/features/metal_finish_palette.ts');
const paletteSrc = fs.readFileSync(palettePath, 'utf8');
const paletteTranspiled = ts.transpileModule(paletteSrc, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: palettePath,
}).outputText;

const paletteSandbox = { module: { exports: {} }, exports: {} };
paletteSandbox.exports = paletteSandbox.module.exports;
vm.runInNewContext(paletteTranspiled, paletteSandbox, { filename: palettePath });

const srcPath = path.resolve('esm/native/features/handle_finish_shared.ts');
const src = fs.readFileSync(srcPath, 'utf8');
const transpiled = ts.transpileModule(src, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: srcPath,
}).outputText;

const sandbox = {
  module: { exports: {} },
  exports: {},
  require: spec => {
    if (spec === './metal_finish_palette.js') return paletteSandbox.module.exports;
    throw new Error(`Unexpected import: ${spec}`);
  },
};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(transpiled, sandbox, { filename: srcPath });

const {
  HANDLE_FINISH_COLORS,
  normalizeHandleFinishColor,
  resolveHandleFinishPalette,
  isHandleFinishCustomColor,
} = sandbox.module.exports;

test('handle finish shared supports pink and custom hex colors canonically', () => {
  assert.deepEqual(Array.from(HANDLE_FINISH_COLORS), ['nickel', 'silver', 'gold', 'black', 'pink']);
  assert.equal(normalizeHandleFinishColor('pink'), 'pink');
  assert.equal(normalizeHandleFinishColor('#F3B6CB'), '#f3b6cb');
  assert.equal(normalizeHandleFinishColor('oops'), 'nickel');
  assert.equal(isHandleFinishCustomColor('#abcdef'), true);
  assert.equal(isHandleFinishCustomColor('gold'), false);
});

test('handle finish shared brightens gold, keeps nickel visible, and preserves custom palette hex', () => {
  const gold = resolveHandleFinishPalette('gold');
  const nickel = resolveHandleFinishPalette('nickel');
  const custom = resolveHandleFinishPalette('#abcdef');
  assert.equal(gold.hex, 0xe5c66b);
  assert.equal(nickel.hex, 0xe5e9ef);
  assert.notEqual(nickel.hex, resolveHandleFinishPalette('silver').hex);
  assert.ok(nickel.roughness < resolveHandleFinishPalette('silver').roughness);
  assert.equal(custom.hex, 0xabcdef);
});
