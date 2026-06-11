import type { ReactElement } from 'react';

import { cx, type InteriorTabViewProps } from './interior_tab_helpers.js';
import { useApp } from '../hooks.js';
import { TabPanel } from '../components/index.js';
import { InteriorLayoutSketchToolsPanel } from './interior_layout_sketch_controls.js';
import { createInteriorLayoutSectionProps } from './interior_layout_section_props.js';
import { useInteriorTabViewState } from './use_interior_tab_view_state.js';
import { useInteriorTabWorkflows } from './use_interior_tab_workflows.js';

export function SketchTabView(props: InteriorTabViewProps): ReactElement {
  return <SketchTabInner active={props.active} />;
}

function SketchTabInner(props: { active: boolean }): ReactElement {
  const app = useApp();
  const state = useInteriorTabViewState(app);
  const workflows = useInteriorTabWorkflows(app, state);

  return (
    <TabPanel tabId="sketch" active={props.active}>
      <div className="wp-react-inner">
        <div className="control-section">
          <span className="section-title">סקיצה</span>
          <div
            className={cx(
              'wp-tool-card',
              'wp-tool-card--layout',
              (state.isSketchToolActive || state.isDoorTrimMode) && 'is-active'
            )}
          >
            <div className="wp-header-row wp-mb-10">
              <div>
                <strong>כלי חלוקה לפי סקיצה</strong>
              </div>
            </div>
            <div className="wp-sketch-row">
              <InteriorLayoutSketchToolsPanel {...createInteriorLayoutSectionProps(state, workflows)} />
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}
