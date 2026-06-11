import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { StructureCellDimsControls } from '../esm/native/ui/react/tabs/structure_tab_dimensions_section_cell_dims.js';
import {
  STRUCTURE_CELL_DIMS_RESET_DEPTH_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_HEIGHT_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_WIDTH_BUTTON_TEST_ID,
} from '../esm/native/ui/react/tabs/structure_tab_dimensions_section_contracts.js';

const renderCellDimsControls = (overrides: Record<string, unknown> = {}) => {
  const noop = () => {};
  return renderToStaticMarkup(
    React.createElement(StructureCellDimsControls, {
      isSliding: false,
      cellDimsEditActive: true,
      hasAnyCellDimsOverrides: true,
      defaultCellWidth: 40,
      width: 160,
      height: 240,
      depth: 55,
      cellDimsWidth: 80,
      cellDimsHeight: '',
      cellDimsDepth: 50,
      onSetRaw: noop,
      onResetAllCellDimsOverrides: noop,
      onEnterCellDimsMode: noop,
      onExitCellDimsMode: noop,
      onClearCellDimsWidth: noop,
      onClearCellDimsHeight: noop,
      onClearCellDimsDepth: noop,
      ...overrides,
    })
  );
};

test('[structure-cell-dims] per-dimension reset buttons stay compact, icon-only, and inline with inputs', () => {
  const html = renderCellDimsControls();
  const resetButtons = html.match(/<button[^>]*wp-r-cell-dims-reset-dim-btn[^>]*>[\s\S]*?<\/button>/g) || [];
  const css = readFileSync(new URL('../css/react_styles.css', import.meta.url), 'utf8');
  const baseResetRuleIndex = css.indexOf('#reactSidebarRoot .wp-r-groove-reset-btn {');
  const compactCellRuleIndex = css.indexOf(
    '#reactSidebarRoot .wp-r-groove-reset-btn.wp-r-cell-dims-reset-dim-btn {'
  );

  assert.equal(resetButtons.length, 3);
  assert.match(html, /wp-r-cell-dims-row/);
  assert.match(html, new RegExp(`data-testid="${STRUCTURE_CELL_DIMS_RESET_WIDTH_BUTTON_TEST_ID}"`));
  assert.match(html, new RegExp(`data-testid="${STRUCTURE_CELL_DIMS_RESET_HEIGHT_BUTTON_TEST_ID}"`));
  assert.match(html, new RegExp(`data-testid="${STRUCTURE_CELL_DIMS_RESET_DEPTH_BUTTON_TEST_ID}"`));
  assert.match(html, /aria-label="איפוס רוחב התא"/);
  assert.match(html, /aria-label="איפוס גובה התא"/);
  assert.match(html, /aria-label="איפוס עומק התא"/);
  assert.ok(
    resetButtons.every(button =>
      /^<button[^>]*><i class="fas fa-undo-alt" aria-hidden="true"><\/i><\/button>$/.test(button)
    )
  );
  assert.ok(resetButtons.some(button => /disabled=""/.test(button)));
  assert.ok(baseResetRuleIndex >= 0, 'expected the shared reset-button rule to exist');
  assert.ok(
    compactCellRuleIndex > baseResetRuleIndex,
    'cell-dims compact override must come after the shared reset rule'
  );
  assert.match(
    css,
    /#reactSidebarRoot \.wp-r-groove-reset-btn\.wp-r-cell-dims-reset-dim-btn \{[\s\S]*?max-width:\s*var\(--wp-r-input-h\)/
  );
});

test('[structure-cell-dims] empty dimension drafts stay visually blank instead of showing guessed numbers', () => {
  const html = renderCellDimsControls({
    defaultCellWidth: 70,
    height: 230,
    depth: 62,
    cellDimsWidth: '',
    cellDimsHeight: '',
    cellDimsDepth: '',
  });

  assert.equal((html.match(/placeholder=""/g) || []).length, 3);
  assert.doesNotMatch(html, /placeholder="(?:ברירת מחדל|70|230|62)"/);
});
