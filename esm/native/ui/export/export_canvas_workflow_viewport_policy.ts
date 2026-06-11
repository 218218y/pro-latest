import type { AppContainer } from '../../../../types';
import type { NotesExportTransformLike } from './export_canvas_engine.js';
import { getUi } from '../store_access.js';
import { attachNotesSourceRect, readCanvasImageSourceRect } from './export_canvas_workflow_notes_rect.js';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function readBoolean(value: unknown, key: string): boolean | null {
  if (!isRecord(value)) return null;
  const direct = value[key];
  if (typeof direct === 'boolean') return direct;

  const raw = value.raw;
  if (isRecord(raw) && typeof raw[key] === 'boolean') return raw[key];
  return null;
}

const PRESERVE_LIVE_VIEWPORT_FLAG_KEYS = [
  'isChestMode',
  'chestMode',
  'cornerMode',
  'isCornerMode',
  'cornerConnectorEnabled',
] as const;

function readExportUiSnapshots(App: AppContainer): UnknownRecord[] {
  const out: UnknownRecord[] = [];

  try {
    const ui = getUi(App);
    if (isRecord(ui)) out.push(ui);
  } catch {
    // Fall through to test/dev harness shapes below.
  }

  if (isRecord(App)) {
    const appUi = App.ui;
    if (isRecord(appUi)) out.push(appUi);

    const state = App.state;
    if (isRecord(state) && isRecord(state.ui)) out.push(state.ui);
  }

  return out;
}

function hasEnabledPreserveLiveViewportFlag(ui: UnknownRecord): boolean {
  return PRESERVE_LIVE_VIEWPORT_FLAG_KEYS.some(key => readBoolean(ui, key) === true);
}

export function shouldPreserveLiveViewportForSketchImageExport(App: AppContainer): boolean {
  return readExportUiSnapshots(App).some(ui => hasEnabledPreserveLiveViewportFlag(ui));
}

export function createLiveViewportNotesTransform(
  rendererSource: CanvasImageSource | null | undefined
): NotesExportTransformLike {
  return attachNotesSourceRect(
    {
      sx: 1,
      sy: 1,
      dx: 0,
      dy: 0,
    },
    readCanvasImageSourceRect(rendererSource)
  );
}
