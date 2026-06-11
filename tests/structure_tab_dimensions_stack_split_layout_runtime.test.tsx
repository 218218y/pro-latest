import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { StructureStackSplitControls } from '../esm/native/ui/react/tabs/structure_tab_dimensions_section_stack_split.js';

const renderStackSplitControls = () => {
  const noop = () => {};
  return renderToStaticMarkup(
    React.createElement(StructureStackSplitControls, {
      isSliding: false,
      stackSplitEnabled: true,
      stackSplitDecorativeSeparatorEnabled: false,
      stackSplitLowerHeight: 100,
      stackSplitLowerDepth: 55,
      stackSplitLowerWidth: 160,
      stackSplitLowerDoors: 2,
      stackSplitLowerDepthManual: false,
      stackSplitLowerWidthManual: false,
      stackSplitLowerDoorsManual: false,
      height: 240,
      onSetRaw: noop,
      onToggleStackSplit: noop,
      onToggleStackSplitDecorativeSeparator: noop,
      renderStackLinkBadge: (_field: string, isManual: boolean) =>
        React.createElement(
          'button',
          {
            type: 'button',
            className: isManual
              ? 'wp-r-mini-link-toggle wp-r-mini-link-toggle--manual'
              : 'wp-r-mini-link-toggle wp-r-mini-link-toggle--auto',
          },
          React.createElement('i', {
            className: isManual ? 'fas fa-unlink' : 'fas fa-link',
            'aria-hidden': true,
          }),
          React.createElement('span', null, isManual ? 'ידני' : 'אוטומטי')
        ),
    })
  );
};

test('[structure-stack-split] lower cabinet fields use a compact row layout for auto/manual badges', () => {
  const html = renderStackSplitControls();
  const css = readFileSync(new URL('../css/react_styles.css', import.meta.url), 'utf8');

  assert.equal((html.match(/wp-r-stack-split-dims-row/g) || []).length, 2);
  assert.match(html, /wp-r-mini-link-toggle--auto/);
  assert.match(css, /#reactSidebarRoot \.wp-r-stack-split-dims-row \{[\s\S]*?gap:\s*8px/);
  assert.match(
    css,
    /#reactSidebarRoot \.wp-r-stack-split-dims-row \.wp-r-input-row--with-addon \{[\s\S]*?--wp-r-link-badge-width:\s*72px/
  );
  assert.match(
    css,
    /#reactSidebarRoot \.wp-r-stack-split-dims-row \.wp-r-mini-link-toggle \{[\s\S]*?font-size:\s*0\.68rem/
  );
});
