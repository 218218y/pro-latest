// Canvas picking paint target eligibility.
//
// Some rendered meshes carry a partId so picking can identify them, but their
// material is intentionally not driven by individualColors.  Treating those
// meshes as paint targets creates a false hover/click state: the map toggles,
// the hover turns red, but the visible part does not change. Keep those guards
// centralized so hover and click stay in lock-step.

export function isCornerBackPanelPaintPartId(partId: string | null | undefined): boolean {
  const id = typeof partId === 'string' ? partId.trim() : '';
  if (!id) return false;
  const base = id.startsWith('lower_') ? id.slice('lower_'.length) : id;
  return (
    base === 'corner_pent_back_side' ||
    base === 'corner_pent_back_back' ||
    base === 'corner_wing_back' ||
    base === 'corner_wing_back_blind' ||
    /^corner_wing_back_c\d+$/.test(base)
  );
}

export function isNonPaintableCanvasPaintPartId(partId: string | null | undefined): boolean {
  return isCornerBackPanelPaintPartId(partId);
}
