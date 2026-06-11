type RectLike = {
  top: number;
  bottom: number;
};

type ScrollHostLike = {
  scrollTop: number;
  scrollTo?: (options: ScrollToOptions) => void;
  getBoundingClientRect: () => RectLike;
};

type RevealTargetLike = {
  getBoundingClientRect: () => RectLike;
};

export const ORDER_PDF_SKETCH_PREVIEW_REVEAL_TOP_MARGIN_PX = 18;
export const ORDER_PDF_SKETCH_PREVIEW_REVEAL_MIN_VISIBLE_PX = 220;
export const ORDER_PDF_SKETCH_PREVIEW_REVEAL_VISIBLE_RATIO = 0.34;

function readFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function computeOrderPdfSketchPreviewRevealScrollTop(args: {
  hostScrollTop: number;
  hostRect: RectLike;
  targetRect: RectLike;
  topMarginPx?: number;
  minVisiblePx?: number;
  visibleRatio?: number;
}): number | null {
  const hostScrollTop = readFiniteNumber(args.hostScrollTop);
  const hostTop = readFiniteNumber(args.hostRect?.top);
  const hostBottom = readFiniteNumber(args.hostRect?.bottom);
  const targetTop = readFiniteNumber(args.targetRect?.top);
  if (hostScrollTop === null || hostTop === null || hostBottom === null || targetTop === null) return null;

  const hostHeight = Math.max(0, hostBottom - hostTop);
  if (!hostHeight) return null;

  const topMarginPx = Math.max(0, args.topMarginPx ?? ORDER_PDF_SKETCH_PREVIEW_REVEAL_TOP_MARGIN_PX);
  const minVisiblePx = Math.max(0, args.minVisiblePx ?? ORDER_PDF_SKETCH_PREVIEW_REVEAL_MIN_VISIBLE_PX);
  const visibleRatio = Math.max(
    0,
    Math.min(1, args.visibleRatio ?? ORDER_PDF_SKETCH_PREVIEW_REVEAL_VISIBLE_RATIO)
  );
  const revealHeight = Math.min(hostHeight - topMarginPx, Math.max(minVisiblePx, hostHeight * visibleRatio));
  const safeTop = hostTop + topMarginPx;
  const safeBottom = hostBottom - Math.max(0, revealHeight);

  if (targetTop > safeBottom) return Math.max(0, hostScrollTop + targetTop - safeBottom);
  if (targetTop < safeTop) return Math.max(0, hostScrollTop + targetTop - safeTop);
  return null;
}

export function revealOrderPdfSketchPreviewInStage(args: {
  host: ScrollHostLike | null | undefined;
  target: RevealTargetLike | null | undefined;
  behavior?: ScrollBehavior;
}): boolean {
  const { host, target, behavior } = args;
  if (!host || !target) return false;

  try {
    const nextTop = computeOrderPdfSketchPreviewRevealScrollTop({
      hostScrollTop: host.scrollTop,
      hostRect: host.getBoundingClientRect(),
      targetRect: target.getBoundingClientRect(),
    });
    if (nextTop === null) return true;

    if (typeof host.scrollTo === 'function') {
      host.scrollTo({ top: nextTop, behavior: behavior ?? 'smooth' });
    } else {
      host.scrollTop = nextTop;
    }
    return true;
  } catch {
    return false;
  }
}
