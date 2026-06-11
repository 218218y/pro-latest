import type { AppContainer, CameraLike, ControlsLike, Object3DLike, RendererLike } from '../../../../types';
import type {
  ExportCanvasWorkflowDeps,
  ExportFrontNotesTransformCapture,
} from './export_canvas_workflow_contracts.js';
import {
  attachNotesSourceRectMaybe,
  readCanvasImageSourceRect,
} from './export_canvas_workflow_notes_rect.js';

export function captureFrontNotesTransform(
  App: AppContainer,
  deps: Pick<
    ExportCanvasWorkflowDeps,
    | 'get$'
    | '_snapCameraToFrontPreset'
    | '_guard'
    | '_renderSceneForExport'
    | '_cloneRefTargetLike'
    | '_computeNotesRefZ'
    | '_planePointFromRefTarget'
    | '_captureExportRefPoints'
    | '_captureCameraPvInfo'
    | '_getRendererCanvasSource'
    | 'autoZoomCamera'
    | 'scaleViewportCameraDistance'
    | '_buildNotesExportTransform'
  >,
  input: {
    camera: CameraLike;
    controls: ControlsLike;
    renderer: RendererLike;
    scene: Object3DLike;
    width: number;
    height: number;
  }
): ExportFrontNotesTransformCapture {
  const $ = deps.get$(App);
  const container = $('viewer-container');
  const containerRect = container ? container.getBoundingClientRect() : null;
  const rendererSourceRect = readCanvasImageSourceRect(deps._getRendererCanvasSource(input.renderer));
  const captureRect = rendererSourceRect || containerRect;

  // Regular wardrobe exports are intentionally normalized to the front preset
  // before measuring the notes baseline. If the user leaves the live viewport
  // angled (side/top/back), using that live camera as the pre-zoom side makes
  // the plane remap skew the text. The export image itself is front + auto-zoom,
  // so the notes transform must be front-baseline -> front-auto-zoom as well.
  deps._snapCameraToFrontPreset(App);
  deps._guard(App, 'export.prerenderFrontBaselineForNotes', () => {
    deps._renderSceneForExport(App, input.renderer, input.scene, input.camera);
  });

  const refTarget = deps._cloneRefTargetLike(input.controls.target);
  const planeZ = deps._computeNotesRefZ(App, input.camera, refTarget);
  const planePoint = deps._planePointFromRefTarget(refTarget, planeZ);
  const planeNormal = { x: 0, y: 0, z: 1 };

  const preRef = captureRect
    ? deps._captureExportRefPoints(App, captureRect, input.width, input.height, refTarget)
    : null;
  const prePv = deps._captureCameraPvInfo(App, input.camera);

  deps.autoZoomCamera(App);
  deps.scaleViewportCameraDistance(App, 1.05);

  const postPv = deps._captureCameraPvInfo(App, input.camera);
  const postRef = captureRect
    ? deps._captureExportRefPoints(App, captureRect, input.width, input.height, refTarget)
    : null;

  const notesTransform =
    deps._buildNotesExportTransform({
      preRef,
      postRef,
      prePvInv: prePv.pvInv,
      postPv: postPv.pv,
      preCamPos: prePv.camPos,
      planePoint,
      planeNormal,
    }) || null;

  return {
    preRef,
    postRef,
    notesTransform: attachNotesSourceRectMaybe(notesTransform, rendererSourceRect),
  };
}
