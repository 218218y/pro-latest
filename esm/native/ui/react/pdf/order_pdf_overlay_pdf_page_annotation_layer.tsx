import { useCallback, useMemo, useRef } from 'react';
import type { MutableRefObject, ReactElement } from 'react';

import type {
  OrderPdfDraft,
  OrderPdfSketchAnnotationPageKey,
  OrderPdfSketchStroke,
  OrderPdfSketchTextBox,
  OrderPdfSketchPreviewEntry,
} from './order_pdf_overlay_contracts.js';
import type { OrderPdfOverlayLayout } from './order_pdf_overlay_layout.js';
import { OrderPdfSketchShapeToolbar } from './order_pdf_overlay_sketch_shape_toolbar.js';
import { OrderPdfSketchToolbar } from './order_pdf_overlay_sketch_toolbar.js';
import { useObservedOrderPdfDrawingRect } from './order_pdf_overlay_sketch_panel_measurement_hooks.js';
import { useCanvasRedraw } from './order_pdf_overlay_sketch_panel_canvas_hooks.js';
import { OrderPdfSketchNoteBox } from './order_pdf_overlay_sketch_note_box.js';
import { useOrderPdfSketchCardTextLayer } from './order_pdf_overlay_sketch_card_text_layer_hooks.js';
import { useOrderPdfSketchCardDrawingHooks } from './order_pdf_overlay_sketch_card_drawing_hooks.js';
import {
  resolveOrderPdfSketchCardCanvasToolClassName,
  resolveOrderPdfSketchCardStageWidth,
} from './order_pdf_overlay_sketch_card_runtime.js';
import { useOrderPdfSketchPanelViewHooks } from './order_pdf_overlay_sketch_panel_view_hooks.js';

const ORDER_PDF_PAGE_ANNOTATION_KEY = 'orderPdfPage1' satisfies OrderPdfSketchAnnotationPageKey;

export type OrderPdfOverlayPdfPageAnnotationLayerProps = {
  open: boolean;
  layout: OrderPdfOverlayLayout;
  draft: OrderPdfDraft | null;
  pageRef: MutableRefObject<HTMLDivElement | null>;
  onAppendStroke: (key: OrderPdfSketchAnnotationPageKey, stroke: OrderPdfSketchStroke) => void;
  onUpsertTextBox: (key: OrderPdfSketchAnnotationPageKey, textBox: OrderPdfSketchTextBox) => void;
  onDeleteTextBox: (key: OrderPdfSketchAnnotationPageKey, id: string) => void;
  onUndo: (key: OrderPdfSketchAnnotationPageKey) => void;
  onRedo: (
    key: OrderPdfSketchAnnotationPageKey,
    annotation: OrderPdfSketchStroke | OrderPdfSketchTextBox
  ) => void;
  onClear: (key: OrderPdfSketchAnnotationPageKey) => void;
};

export function OrderPdfOverlayPdfPageAnnotationLayer(
  props: OrderPdfOverlayPdfPageAnnotationLayerProps
): ReactElement {
  const {
    open,
    layout,
    draft,
    pageRef,
    onAppendStroke,
    onUpsertTextBox,
    onDeleteTextBox,
    onUndo,
    onRedo,
    onClear,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingStrokeRef = useRef<OrderPdfSketchStroke | null>(null);

  const entries = useMemo<OrderPdfSketchPreviewEntry[]>(
    () => [
      {
        key: ORDER_PDF_PAGE_ANNOTATION_KEY,
        label: 'עמוד PDF ראשי',
        url: '',
        width: layout.size.w,
        height: layout.size.h,
        pageIndex: 0,
      },
    ],
    [layout.size.h, layout.size.w]
  );

  const {
    tool,
    freehandTool,
    color,
    width,
    drawPaletteOpen,
    widthPaletteOpen,
    colorPaletteOpen,
    colorControlDisabled,
    widthControlDisabled,
    strokesByKey,
    textBoxesByKey,
    activeHasStrokes,
    activeHasRedo,
    toolbarPlacement,
    shapeToolbarPlacement,
    setTool,
    setActiveKey,
    handleEnterTextMode,
    handleExitTextMode,
    handleAppendStroke,
    handleUpsertTextBox,
    handleDeleteTextBox,
    handleActivateDrawTool,
    handleToggleWidthPalette,
    handleToggleColorPalette,
    handleSelectFreehandTool,
    handleSelectWidth,
    handleSelectColor,
    handleUndoActive,
    handleRedoActive,
    handleClearActive,
    toolbarRef,
    shapeToolbarRef,
    drawTriggerRef,
    widthTriggerRef,
    colorTriggerRef,
    drawPaletteRef,
    widthPaletteRef,
    colorPaletteRef,
    drawConfigRef,
  } = useOrderPdfSketchPanelViewHooks({
    open,
    entries,
    draft,
    onAppendStroke,
    onUpsertTextBox,
    onDeleteTextBox,
    onUndo,
    onRedo,
    onClear,
  });

  const strokes = strokesByKey[ORDER_PDF_PAGE_ANNOTATION_KEY] || [];
  const textBoxes = textBoxesByKey[ORDER_PDF_PAGE_ANNOTATION_KEY] || [];
  const activeTool = open ? tool : 'pen';
  const stageWidth = resolveOrderPdfSketchCardStageWidth({
    hostWidth: pageRef.current?.getBoundingClientRect?.().width,
    entryWidth: layout.size.w * layout.cssScale,
  });

  const {
    rect: hostRect,
    rectRef: hostRectRef,
    refreshRectNow: refreshHostRect,
  } = useObservedOrderPdfDrawingRect({
    elementRef: pageRef,
    observeScroll: true,
    publish: 'size',
  });
  const redraw = useCanvasRedraw({
    canvasRef,
    hostRef: pageRef,
    hostRect,
    refreshHostRect,
    strokes,
    textBoxes: [],
    pendingStrokeRef,
  });
  const getHostRect = useCallback(
    (mode: 'cached' | 'fresh' = 'cached') =>
      mode === 'fresh' ? refreshHostRect() : hostRectRef.current || refreshHostRect(),
    [hostRectRef, refreshHostRect]
  );

  const textLayer = useOrderPdfSketchCardTextLayer({
    entryKey: ORDER_PDF_PAGE_ANNOTATION_KEY,
    hostRef: pageRef,
    tool: activeTool,
    textBoxes,
    getHostRect,
    onSelect: setActiveKey,
    onUpsertTextBox: handleUpsertTextBox,
    onDeleteTextBox: handleDeleteTextBox,
    onEnterTextMode: handleEnterTextMode,
    onExitTextMode: handleExitTextMode,
  });

  const drawing = useOrderPdfSketchCardDrawingHooks({
    entryKey: ORDER_PDF_PAGE_ANNOTATION_KEY,
    drawConfigRef,
    getHostRect,
    committedStrokeCount: strokes.length,
    pendingStrokeRef,
    redraw,
    textLayer,
    onCommitStroke: handleAppendStroke,
    onSelect: setActiveKey,
  });

  const canvasToolClassName = resolveOrderPdfSketchCardCanvasToolClassName(activeTool);

  return (
    <>
      <div
        className={`wp-pdf-page-annotation-layer${open ? ' is-editing' : ''}`}
        dir="rtl"
        aria-hidden={!open}
      >
        <canvas
          ref={canvasRef}
          className={`wp-pdf-sketch-card-canvas wp-pdf-page-annotation-canvas${canvasToolClassName}`}
          onPointerDown={open ? drawing.handlePointerDown : undefined}
          onPointerMove={open ? drawing.handlePointerMove : undefined}
          onPointerUp={open ? drawing.handlePointerFinish : undefined}
          onPointerCancel={open ? drawing.handlePointerFinish : undefined}
        />
        <div className={`wp-pdf-sketch-card-text-layer${open && tool === 'text' ? ' is-text-mode' : ''}`}>
          {textLayer.renderedTextBoxes.map(textBox => (
            <OrderPdfSketchNoteBox
              key={textBox.id}
              textBox={textBox}
              active={open && textLayer.activeTextBoxId === textBox.id}
              textMode={open && tool === 'text'}
              stageWidth={stageWidth}
              registerEditorRef={textLayer.registerEditorRef}
              onActivate={textLayer.activateTextBox}
              onCommit={textLayer.commitTextBoxById}
              onBoxPointerDown={textLayer.handleBoxPointerDown}
              onHandlePointerDown={textLayer.handleResizeHandlePointerDown}
              colorPaletteOpen={
                open && textLayer.activeTextBoxId === textBox.id && textLayer.colorPaletteOpen
              }
              sizePaletteOpen={open && textLayer.activeTextBoxId === textBox.id && textLayer.sizePaletteOpen}
              onToggleBold={() => textLayer.handleApplyActiveTextBoxPatch({ bold: !textBox.bold })}
              onToggleColorPalette={textLayer.toggleColorPalette}
              onToggleSizePalette={textLayer.toggleSizePalette}
              onSelectColor={color => textLayer.handleApplyActiveTextBoxPatch({ color })}
              onSelectFontSize={fontSize => textLayer.handleApplyActiveTextBoxPatch({ fontSize })}
              onDelete={() => textLayer.deleteTextBox(textBox.id)}
            />
          ))}
          {open && textLayer.createRectStyle ? (
            <div className="annotation-box creating" style={textLayer.createRectStyle} aria-hidden="true" />
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="wp-pdf-page-annotation-tools" dir="rtl">
          <OrderPdfSketchShapeToolbar
            tool={tool}
            toolbarPlacement={shapeToolbarPlacement}
            toolbarRef={shapeToolbarRef}
            onSetTool={setTool}
          />
          <OrderPdfSketchToolbar
            busy={false}
            tool={tool}
            freehandTool={freehandTool}
            color={color}
            width={width}
            drawPaletteOpen={drawPaletteOpen}
            widthPaletteOpen={widthPaletteOpen}
            colorPaletteOpen={colorPaletteOpen}
            colorControlDisabled={colorControlDisabled}
            widthControlDisabled={widthControlDisabled}
            activeHasStrokes={activeHasStrokes}
            activeHasRedo={activeHasRedo}
            toolbarPlacement={toolbarPlacement}
            toolbarRef={toolbarRef}
            drawTriggerRef={drawTriggerRef}
            widthTriggerRef={widthTriggerRef}
            colorTriggerRef={colorTriggerRef}
            drawPaletteRef={drawPaletteRef}
            widthPaletteRef={widthPaletteRef}
            colorPaletteRef={colorPaletteRef}
            onSetTool={setTool}
            onActivateDrawTool={handleActivateDrawTool}
            onToggleWidthPalette={handleToggleWidthPalette}
            onToggleColorPalette={handleToggleColorPalette}
            onSelectFreehandTool={handleSelectFreehandTool}
            onSelectWidth={handleSelectWidth}
            onSelectColor={handleSelectColor}
            onRefresh={redraw}
            onUndo={handleUndoActive}
            onRedo={handleRedoActive}
            onClear={handleClearActive}
          />
        </div>
      ) : null}
    </>
  );
}
