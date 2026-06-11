const fs = require('fs');
const path = require('path');
const assert = require('assert');

const viewStatePath = path.join(
  __dirname,
  '..',
  'esm',
  'native',
  'ui',
  'react',
  'tabs',
  'interior_tab_view_state_runtime.ts'
);
const viewState = fs.readFileSync(viewStatePath, 'utf8');

assert.match(
  viewState,
  /const usesManualDivisionControls =\s*isManualLayoutMode && \(!isSketchToolActive \|\| isSketchDivisionToolActive\);/,
  'Only canonical sketch division tools may reuse the generic manual-layout chooser while sketch tools such as add-box stay separate.'
);

assert.match(
  viewState,
  /const activeManualToolForUi = usesManualDivisionControls \? manualTool : manualUiTool;/,
  'Unrelated sketch tools must keep the generic manual-layout UI selection, while sketch division tools project their canonical shelf\/rod\/storage choice.'
);
