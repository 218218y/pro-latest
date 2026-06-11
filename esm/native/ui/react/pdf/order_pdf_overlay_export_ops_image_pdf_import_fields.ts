import type { OrderPdfDraft } from './order_pdf_overlay_contracts.js';
import {
  getOrderPdfFieldReadNames,
  ORDER_PDF_DETAILS_CONTINUATION_FIELD_NAMES,
} from '../../pdf/order_pdf_document_fields_runtime.js';
import type { OrderPdfFieldKey } from '../../pdf/order_pdf_field_specs_runtime.js';
import {
  buildOrderPdfDetailsText,
  coerceOrderPdfText,
} from './order_pdf_overlay_export_ops_image_pdf_support.js';

type PdfLibHiddenTextFieldLike = {
  setText?: (text: string) => unknown;
};

type PdfLibHiddenFormLike = {
  createTextField?: (name: string) => unknown;
  getTextField?: (name: string) => unknown;
};

type PdfLibDocumentWithFormLike = {
  getForm?: () => unknown;
};

function readImportFieldName(key: OrderPdfFieldKey): string {
  const names = getOrderPdfFieldReadNames(key);
  return String(names[1] || names[0] || '');
}

function asHiddenTextField(value: unknown): PdfLibHiddenTextFieldLike | null {
  return value && typeof value === 'object' && typeof Reflect.get(value, 'setText') === 'function'
    ? (value as PdfLibHiddenTextFieldLike)
    : null;
}

function asHiddenForm(value: unknown): PdfLibHiddenFormLike | null {
  return value && typeof value === 'object' ? (value as PdfLibHiddenFormLike) : null;
}

function getOrCreateHiddenTextField(
  form: PdfLibHiddenFormLike,
  name: string
): PdfLibHiddenTextFieldLike | null {
  if (!name) return null;
  try {
    const existing =
      typeof form.getTextField === 'function' ? asHiddenTextField(form.getTextField(name)) : null;
    if (existing) return existing;
  } catch {
    // Field does not exist yet; create it below.
  }

  try {
    return typeof form.createTextField === 'function' ? asHiddenTextField(form.createTextField(name)) : null;
  } catch {
    return null;
  }
}

function setHiddenImportField(form: PdfLibHiddenFormLike, name: string, value: unknown): void {
  const field = getOrCreateHiddenTextField(form, name);
  if (!field || typeof field.setText !== 'function') return;
  field.setText(coerceOrderPdfText(value));
}

export function writeOrderPdfImagePdfHiddenImportFields(args: {
  outDoc: PdfLibDocumentWithFormLike;
  draft: OrderPdfDraft;
}): void {
  try {
    const form = asHiddenForm(typeof args.outDoc.getForm === 'function' ? args.outDoc.getForm() : null);
    if (!form) return;

    setHiddenImportField(form, readImportFieldName('orderNumber'), args.draft.orderNumber);
    setHiddenImportField(form, readImportFieldName('orderDate'), args.draft.orderDate);
    setHiddenImportField(form, readImportFieldName('projectName'), args.draft.projectName);
    setHiddenImportField(form, readImportFieldName('deliveryAddress'), args.draft.deliveryAddress);
    setHiddenImportField(form, readImportFieldName('phone'), args.draft.phone);
    setHiddenImportField(form, readImportFieldName('mobile'), args.draft.mobile);
    setHiddenImportField(form, readImportFieldName('details'), buildOrderPdfDetailsText(args.draft));
    setHiddenImportField(form, ORDER_PDF_DETAILS_CONTINUATION_FIELD_NAMES[0] || '', '');
    setHiddenImportField(form, readImportFieldName('notes'), args.draft.notes);
  } catch {
    // Image export must never fail just because metadata-style import fields could not be written.
  }
}
