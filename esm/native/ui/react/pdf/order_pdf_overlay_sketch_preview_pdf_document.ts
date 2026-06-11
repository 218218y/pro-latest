import type { PdfJsDocumentLike, PdfJsLoadingTaskLike } from './order_pdf_overlay_contracts.js';
import { loadPdfDocumentCtor } from './order_pdf_overlay_pdf_lib.js';
import { collectTrailingNonFormPageIndexes } from './order_pdf_overlay_pdf_import_shared.js';
import { resolveOrderPdfSketchImageTailPageMap } from './order_pdf_overlay_sketch_image_slots_runtime.js';

export type OrderPdfSketchPreviewPageMap = Partial<Record<'renderSketch' | 'openClosed', number>>;

export async function collectOrderPdfSketchPreviewTailPageMap(
  pdfBytes: Uint8Array
): Promise<OrderPdfSketchPreviewPageMap> {
  try {
    const PDFDocument = await loadPdfDocumentCtor();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const tailIndexes = await collectTrailingNonFormPageIndexes(pdfDoc);
    return resolveOrderPdfSketchImageTailPageMap(tailIndexes);
  } catch {
    return {};
  }
}

export async function loadOrderPdfSketchPreviewPdfJsDocument(args: {
  ensurePdfJs: () => Promise<{
    getDocument: (opts: { data: Uint8Array; disableWorker?: boolean }) => PdfJsLoadingTaskLike;
  }>;
  pdfBytes: Uint8Array;
}): Promise<{ task: PdfJsLoadingTaskLike; pdfDoc: PdfJsDocumentLike }> {
  const pdfjs = await args.ensurePdfJs();
  let task = pdfjs.getDocument({ data: args.pdfBytes.slice(), disableWorker: false });
  try {
    return { task, pdfDoc: await task.promise };
  } catch {
    try {
      if (typeof task.destroy === 'function') task.destroy();
    } catch {
      // ignore worker cleanup failure and fall back to no-worker mode
    }
    task = pdfjs.getDocument({ data: args.pdfBytes.slice(), disableWorker: true });
    return { task, pdfDoc: await task.promise };
  }
}

export function destroyOrderPdfSketchPreviewPdfJsSession(args: {
  pdfDoc: PdfJsDocumentLike;
  task: PdfJsLoadingTaskLike;
}): void {
  let taskDestroyed = false;
  try {
    if (typeof args.task.destroy === 'function') {
      args.task.destroy();
      taskDestroyed = true;
    }
  } catch {
    // best effort cleanup
  }
  try {
    // pdfjs-dist 5.x: when no task cleanup hook exists, release through the
    // document-owned hook if present. pdfjs-dist 6 owns cleanup on the task.
    if (!taskDestroyed && typeof args.pdfDoc.destroy === 'function') args.pdfDoc.destroy();
  } catch {
    // best effort cleanup
  }
}
