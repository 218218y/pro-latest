import type { ReactElement } from 'react';

import { InlineNotice, ModeToggleButton } from '../components/index.js';
import { OptionalDimField } from './structure_tab_controls.js';
import {
  DEFAULT_HEIGHT,
  HINGED_DEFAULT_DEPTH,
  HINGED_DEFAULT_PER_DOOR_WIDTH,
} from '../../../services/api.js';
import { readStructureDimensionBounds } from './structure_tab_dimension_constraints.js';
import {
  STRUCTURE_CELL_DIMS_HEX_MODE_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_MODE_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_DEPTH_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_HEX_DOOR_WIDTH_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_HEX_PROTRUSION_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_HEIGHT_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_RESET_WIDTH_BUTTON_TEST_ID,
  STRUCTURE_CELL_DIMS_SECTION_TEST_ID,
  type StructureDimensionsContentProps,
} from './structure_tab_dimensions_section_contracts.js';
import {
  HEX_CELL_DEFAULT_PROTRUSION_CM,
  resolveDefaultHexDoorWidthCm,
} from '../../../features/hex_cell/index.js';

const STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT = '';
const STRUCTURE_CELL_DIMS_DEFAULT_WIDTH_STEP_BASE = HINGED_DEFAULT_PER_DOOR_WIDTH * 2;

function CellDimResetButton(props: {
  title: string;
  disabled: boolean;
  onClick: () => void;
  testId: string;
}): ReactElement {
  return (
    <button
      type="button"
      className="btn btn-light btn-inline wp-r-groove-reset-btn wp-r-cell-dims-reset-dim-btn"
      disabled={props.disabled}
      title={props.title}
      aria-label={props.title}
      onClick={props.onClick}
      data-testid={props.testId}
    >
      <i className="fas fa-undo-alt" aria-hidden="true" />
    </button>
  );
}

export function StructureCellDimsControls(props: {
  isSliding: StructureDimensionsContentProps['isSliding'];
  cellDimsEditActive: StructureDimensionsContentProps['cellDimsEditActive'];
  hasAnyCellDimsOverrides: StructureDimensionsContentProps['hasAnyCellDimsOverrides'];
  defaultCellWidth: StructureDimensionsContentProps['defaultCellWidth'];
  width: StructureDimensionsContentProps['width'];
  cellDimsWidth: StructureDimensionsContentProps['cellDimsWidth'];
  cellDimsHeight: StructureDimensionsContentProps['cellDimsHeight'];
  cellDimsDepth: StructureDimensionsContentProps['cellDimsDepth'];
  cellDimsHexMode: StructureDimensionsContentProps['cellDimsHexMode'];
  cellDimsHexProtrusion: StructureDimensionsContentProps['cellDimsHexProtrusion'];
  cellDimsHexDoorWidth: StructureDimensionsContentProps['cellDimsHexDoorWidth'];
  height: StructureDimensionsContentProps['height'];
  depth: StructureDimensionsContentProps['depth'];
  onSetRaw: StructureDimensionsContentProps['onSetRaw'];
  onResetAllCellDimsOverrides: StructureDimensionsContentProps['onResetAllCellDimsOverrides'];
  onEnterCellDimsMode: StructureDimensionsContentProps['onEnterCellDimsMode'];
  onExitCellDimsMode: StructureDimensionsContentProps['onExitCellDimsMode'];
  onEnterHexCellDimsMode: StructureDimensionsContentProps['onEnterHexCellDimsMode'];
  onExitHexCellDimsMode: StructureDimensionsContentProps['onExitHexCellDimsMode'];
  onClearCellDimsWidth: StructureDimensionsContentProps['onClearCellDimsWidth'];
  onClearCellDimsHeight: StructureDimensionsContentProps['onClearCellDimsHeight'];
  onClearCellDimsDepth: StructureDimensionsContentProps['onClearCellDimsDepth'];
  onClearCellDimsHexProtrusion: StructureDimensionsContentProps['onClearCellDimsHexProtrusion'];
  onClearCellDimsHexDoorWidth: StructureDimensionsContentProps['onClearCellDimsHexDoorWidth'];
}): ReactElement | null {
  if (props.isSliding) return null;

  const defaultHexDoorWidth = resolveDefaultHexDoorWidthCm(props.defaultCellWidth);

  return (
    <div className="wp-field" data-testid={STRUCTURE_CELL_DIMS_SECTION_TEST_ID}>
      <ModeToggleButton
        active={props.cellDimsEditActive}
        onClick={() => {
          if (props.cellDimsEditActive) props.onExitCellDimsMode();
          else props.onEnterCellDimsMode();
        }}
        className="wp-r-mode-btn"
        data-testid={STRUCTURE_CELL_DIMS_MODE_BUTTON_TEST_ID}
      >
        מידות מיוחדות לפי תא
      </ModeToggleButton>

      {props.cellDimsEditActive ? (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              marginBottom: 10,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="wp-r-link-btn"
              disabled={!props.hasAnyCellDimsOverrides}
              onClick={props.onResetAllCellDimsOverrides}
              data-testid={STRUCTURE_CELL_DIMS_RESET_BUTTON_TEST_ID}
              title="ביטול כל המידות המיוחדות וחזרה למידות הכלליות"
            >
              חזרה למידות שוות לכל התאים
            </button>
          </div>
          <div className="wp-r-cell-dims-row">
            <div className="wp-r-dims-width">
              <OptionalDimField
                label={'רוחב תא (ס"מ)'}
                activeId="cellDimsWidth"
                value={props.cellDimsWidth}
                placeholder={STRUCTURE_CELL_DIMS_DEFAULT_WIDTH_STEP_BASE}
                placeholderText={STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT}
                onCommit={value => {
                  if (value == null) {
                    props.onClearCellDimsWidth();
                    return;
                  }
                  props.onSetRaw('cellDimsWidth', value);
                }}
                inputAddon={
                  <CellDimResetButton
                    title="איפוס רוחב התא"
                    disabled={props.cellDimsWidth === ''}
                    onClick={props.onClearCellDimsWidth}
                    testId={STRUCTURE_CELL_DIMS_RESET_WIDTH_BUTTON_TEST_ID}
                  />
                }
                step={5}
                buttonsStep={5}
                bounds={readStructureDimensionBounds({ key: 'cellDimsWidth' })}
              />
            </div>
            <div className="wp-r-dims-height">
              <OptionalDimField
                label={'גובה תא (ס"מ)'}
                activeId="cellDimsHeight"
                value={props.cellDimsHeight}
                placeholder={DEFAULT_HEIGHT}
                placeholderText={STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT}
                onCommit={value => {
                  if (value == null) {
                    props.onClearCellDimsHeight();
                    return;
                  }
                  props.onSetRaw('cellDimsHeight', value);
                }}
                inputAddon={
                  <CellDimResetButton
                    title="איפוס גובה התא"
                    disabled={props.cellDimsHeight === ''}
                    onClick={props.onClearCellDimsHeight}
                    testId={STRUCTURE_CELL_DIMS_RESET_HEIGHT_BUTTON_TEST_ID}
                  />
                }
                step={5}
                buttonsStep={5}
                bounds={readStructureDimensionBounds({ key: 'cellDimsHeight' })}
              />
            </div>
            <div className="wp-r-dims-depth">
              <OptionalDimField
                label={'עומק תא (ס"מ)'}
                activeId="cellDimsDepth"
                value={props.cellDimsDepth}
                placeholder={HINGED_DEFAULT_DEPTH}
                placeholderText={STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT}
                onCommit={value => {
                  if (value == null) {
                    props.onClearCellDimsDepth();
                    return;
                  }
                  props.onSetRaw('cellDimsDepth', value);
                }}
                inputAddon={
                  <CellDimResetButton
                    title="איפוס עומק התא"
                    disabled={props.cellDimsDepth === ''}
                    onClick={props.onClearCellDimsDepth}
                    testId={STRUCTURE_CELL_DIMS_RESET_DEPTH_BUTTON_TEST_ID}
                  />
                }
                step={5}
                buttonsStep={5}
                bounds={readStructureDimensionBounds({ key: 'cellDimsDepth' })}
              />
            </div>
          </div>

          <div className="wp-r-cell-dims-hex-toolbar">
            <ModeToggleButton
              active={props.cellDimsHexMode}
              onClick={() => {
                if (props.cellDimsHexMode) props.onExitHexCellDimsMode();
                else props.onEnterHexCellDimsMode();
              }}
              className="wp-r-mode-btn wp-r-hex-cell-mode-btn"
              data-testid={STRUCTURE_CELL_DIMS_HEX_MODE_BUTTON_TEST_ID}
            >
              תא משושה
            </ModeToggleButton>
          </div>

          {props.cellDimsHexMode ? (
            <div className="wp-r-cell-dims-row wp-r-cell-dims-hex-row">
              <div className="wp-r-dims-depth">
                <OptionalDimField
                  label={'בליטה ישרה תא משושה '}
                  activeId="cellDimsHexProtrusion"
                  value={props.cellDimsHexProtrusion}
                  placeholder={HEX_CELL_DEFAULT_PROTRUSION_CM}
                  placeholderText={STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT}
                  onCommit={value => {
                    if (value == null) {
                      props.onClearCellDimsHexProtrusion();
                      return;
                    }
                    props.onSetRaw('cellDimsHexProtrusion', value);
                  }}
                  inputAddon={
                    <CellDimResetButton
                      title="איפוס בליטה ישרה תא משושה"
                      disabled={props.cellDimsHexProtrusion === ''}
                      onClick={props.onClearCellDimsHexProtrusion}
                      testId={STRUCTURE_CELL_DIMS_RESET_HEX_PROTRUSION_BUTTON_TEST_ID}
                    />
                  }
                  step={1}
                  buttonsStep={1}
                  bounds={readStructureDimensionBounds({ key: 'cellDimsHexProtrusion' })}
                />
              </div>
              <div className="wp-r-dims-width">
                <OptionalDimField
                  label={'רוחב דלת תא משושה '}
                  activeId="cellDimsHexDoorWidth"
                  value={props.cellDimsHexDoorWidth}
                  placeholder={defaultHexDoorWidth}
                  placeholderText={STRUCTURE_CELL_DIMS_PLACEHOLDER_TEXT}
                  onCommit={value => {
                    if (value == null) {
                      props.onClearCellDimsHexDoorWidth();
                      return;
                    }
                    props.onSetRaw('cellDimsHexDoorWidth', value);
                  }}
                  inputAddon={
                    <CellDimResetButton
                      title="איפוס רוחב דלת תא משושה"
                      disabled={props.cellDimsHexDoorWidth === ''}
                      onClick={props.onClearCellDimsHexDoorWidth}
                      testId={STRUCTURE_CELL_DIMS_RESET_HEX_DOOR_WIDTH_BUTTON_TEST_ID}
                    />
                  }
                  step={5}
                  buttonsStep={5}
                  bounds={readStructureDimensionBounds({ key: 'cellDimsHexDoorWidth' })}
                />
              </div>
            </div>
          ) : null}

          <InlineNotice>
            הקלד מידות ואז לחץ על תא בארון כדי להחיל. כפתור תא משושה מפעיל בחירת תא לצורה משושה. שדה ריק = לא
            נוגעים במימד הזה.
          </InlineNotice>
        </div>
      ) : null}
    </div>
  );
}
