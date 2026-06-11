// Shared UI tab identifiers used by the React UI and (optionally) the store.
// Keep this as a small, stable union so new tabs are an explicit, reviewed change.

export type TabId = 'structure' | 'design' | 'interior' | 'sketch' | 'settings';

export const TAB_IDS: readonly TabId[] = ['structure', 'design', 'interior', 'sketch', 'settings'];

const TAB_ID_SET = new Set<string>(TAB_IDS);

export function isTabId(v: unknown): v is TabId {
  return typeof v === 'string' && TAB_ID_SET.has(v);
}
