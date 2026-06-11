import type { OrderPdfDraft } from './order_pdf_overlay_contracts.js';
import type { RasterPageLayout } from './order_pdf_overlay_export_ops_image_pdf_layout.js';
import type { OrderPdfOverlayReportNonFatal } from './order_pdf_overlay_export_ops_image_pdf_support.js';
import {
  compositeOrderPdfSketchStrokesOntoBase,
  listOrderPdfSketchStrokes,
  listOrderPdfSketchTextBoxes,
} from '../../export/export_order_pdf_sketch_annotations.js';

type RasterTextBoxKey = keyof RasterPageLayout['boxes'];

const RASTER_TEXT_BOX_KEYS = Object.freeze([
  'orderNo',
  'date',
  'name',
  'address',
  'phone',
  'mobile',
  'details',
  'notes',
] as const satisfies readonly RasterTextBoxKey[]);

function clipToRasterTextBoxes(args: { ctx: CanvasRenderingContext2D; layout: RasterPageLayout }): void {
  const { ctx, layout } = args;
  ctx.beginPath();
  for (const key of RASTER_TEXT_BOX_KEYS) {
    const box = layout.boxes[key];
    if (!box || !Number.isFinite(box.w) || !Number.isFinite(box.h) || box.w <= 0 || box.h <= 0) {
      continue;
    }
    ctx.rect(box.x, box.y, box.w, box.h);
  }
  ctx.clip();
}

export function repaintOrderPdfPageAnnotationsInsideRasterTextBoxes(args: {
  doc: Document;
  ctx: CanvasRenderingContext2D;
  draft: OrderPdfDraft;
  layout: RasterPageLayout;
  canvasWidth: number;
  canvasHeight: number;
  report: OrderPdfOverlayReportNonFatal;
}): boolean {
  const { doc, ctx, draft, layout, canvasWidth, canvasHeight, report } = args;
  const strokes = listOrderPdfSketchStrokes(draft, 'orderPdfPage1');
  const textBoxes = listOrderPdfSketchTextBoxes(draft, 'orderPdfPage1');
  if (!strokes.length && !textBoxes.length) return false;

  try {
    ctx.save();
    try {
      clipToRasterTextBoxes({ ctx, layout });
      return compositeOrderPdfSketchStrokesOntoBase({
        targetCtx: ctx,
        createLayerCanvas: (width, height) => {
          const canvas = doc.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          return canvas;
        },
        canvasWidth,
        canvasHeight,
        strokes,
        textBoxes,
      });
    } finally {
      ctx.restore();
    }
  } catch (err) {
    report('orderPdfOverlay.rasterizeInteractivePdf.repaintPageAnnotations', err);
    return false;
  }
}
