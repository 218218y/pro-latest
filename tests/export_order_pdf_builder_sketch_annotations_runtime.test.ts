import test from 'node:test';
import assert from 'node:assert/strict';

import { captureOrderPdfCompositeImages } from '../esm/native/ui/export/export_order_pdf_builder_layout.ts';
import { buildOrderPdfDocumentResult } from '../esm/native/ui/export/export_order_pdf_builder_document.ts';
import type { OrderPdfDraftLike } from '../types/build.ts';

test('captureOrderPdfCompositeImages applies sketch annotations after base composite capture', async () => {
  const draft: OrderPdfDraftLike = {
    includeRenderSketch: true,
    includeOpenClosed: true,
    sketchAnnotations: {
      renderSketch: {
        strokes: [
          {
            tool: 'pen',
            color: '#2563eb',
            width: 2,
            points: [{ x: 0.2, y: 0.3 }],
          },
        ],
      },
    },
  };
  const resolvedDraft = {
    projectName: 'alpha',
    orderNumber: '',
    orderDate: '',
    deliveryAddress: '',
    phone: '',
    mobile: '',
    notes: '',
    orderDetails: '',
    includeRenderSketch: true,
    includeOpenClosed: true,
  };

  const seenKeys: Array<'renderSketch' | 'openClosed'> = [];
  const result = await captureOrderPdfCompositeImages(
    {} as never,
    draft,
    resolvedDraft,
    { _exportReportThrottled: () => undefined } as never,
    {
      async applySketchAnnotationsToCompositePngBytes({ key, pngBytes }) {
        seenKeys.push(key);
        return pngBytes ? Uint8Array.from([...pngBytes, key === 'renderSketch' ? 9 : 8]) : null;
      },
      async captureCompositeRenderSketchPngBytes() {
        return Uint8Array.from([1, 2, 3]);
      },
      async captureCompositeOpenClosedPngBytes() {
        return Uint8Array.from([4, 5, 6]);
      },
    }
  );

  assert.deepEqual(seenKeys, ['renderSketch', 'openClosed']);
  assert.deepEqual(Array.from(result.renderSketch || []), [1, 2, 3, 9]);
  assert.deepEqual(Array.from(result.openClosed || []), [4, 5, 6, 8]);
});

test('buildOrderPdfDocumentResult embeds the primary PDF page annotation layer at high raster density', async () => {
  const captureCalls: Array<{ width: number; height: number; key: string }> = [];
  const drawCalls: Array<{ width: number; height: number }> = [];
  const embeddedBytes: number[][] = [];
  const pageWidth = 595;
  const pageHeight = 842;

  const result = await buildOrderPdfDocumentResult({
    App: {} as never,
    deps: { _exportReportThrottled: () => undefined } as never,
    textOps: {
      wrapTextToWidth: (text: string) => (text ? text.split('\n') : []),
    } as never,
    runtime: {
      pageWidth,
      pageHeight,
      font: {} as never,
      TextAlignment: { Left: 'left', Right: 'right' },
      pdfDoc: {
        async embedPng(bytes: Uint8Array) {
          embeddedBytes.push(Array.from(bytes));
          return { width: 1, height: 1 };
        },
        async save() {
          return Uint8Array.from([1, 2, 3, 4]);
        },
      },
      firstPage: {
        drawImage(_img: unknown, opts: { width: number; height: number }) {
          drawCalls.push({ width: opts.width, height: opts.height });
        },
      },
    } as never,
    fieldOps: {
      setFieldText: () => undefined,
      addOverflowDetailsPage: async () => undefined,
      addCompositeImagesPage: async () => undefined,
    },
    draft: {
      projectName: 'alpha',
      sketchAnnotations: {
        orderPdfPage1: {
          strokes: [
            {
              tool: 'pen',
              color: '#2563eb',
              width: 2,
              points: [{ x: 0.2, y: 0.3 }],
            },
          ],
        },
      },
    } as never,
    resolvedDraft: {
      projectName: 'alpha',
      orderNumber: '42',
      orderDate: '',
      deliveryAddress: '',
      phone: '',
      mobile: '',
      notes: '',
      orderDetails: '',
      includeRenderSketch: false,
      includeOpenClosed: false,
    },
    compositeImageSlotBytes: {},
    captureOps: {
      async renderSketchAnnotationLayerPngBytes(args: { width: number; height: number; key: string }) {
        captureCalls.push({ width: args.width, height: args.height, key: args.key });
        return Uint8Array.from([9, 8, 7]);
      },
    },
    buildOrderPdfFileName: () => 'order.pdf',
  });

  assert.ok(result);
  assert.deepEqual(captureCalls, [{ key: 'orderPdfPage1', width: pageWidth * 3, height: pageHeight * 3 }]);
  assert.deepEqual(embeddedBytes, [[9, 8, 7]]);
  assert.deepEqual(drawCalls, [{ width: pageWidth, height: pageHeight }]);
});
