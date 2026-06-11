import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearNotesTypingPersist,
  prepareDeletedDraftNotes,
  scheduleNotesTypingPersist,
} from '../esm/native/ui/react/notes/notes_overlay_editor_workflow_persistence_runtime.js';

import {
  buildNotesHistoryCommitMeta,
  commitOverlayNotesRuntime,
  isNotesOverlayCommitSuppressed,
} from '../esm/native/ui/react/notes/notes_overlay_editor_notes_runtime.js';

type TimerEntry = {
  id: number;
  fn: () => void;
  cleared: boolean;
};

function createTimerApp() {
  let nextId = 1;
  const entries: TimerEntry[] = [];
  const cleared: Array<number | undefined> = [];
  const App: any = {
    deps: {
      browser: {
        setTimeout(fn: () => void) {
          const id = nextId++;
          entries.push({ id, fn, cleared: false });
          return id;
        },
        clearTimeout(id?: number) {
          cleared.push(id);
          const entry = entries.find(item => item.id === id);
          if (entry) entry.cleared = true;
        },
      },
    },
  };

  return {
    App,
    entries,
    cleared,
    run(id: number) {
      const entry = entries.find(item => item.id === id);
      assert.ok(entry, `missing timer ${id}`);
      entry.fn();
    },
  };
}

test('notes typing input does not create delayed history commits before editor exit', () => {
  const timers = createTimerApp();
  const typingCommitTimerRef = { current: null as number | null };
  const typingCommitTokenRef = { current: 0 };
  const draftNotesRef = { current: [{ text: 'draft-1' }] as Array<{ text: string }> };
  const commits: Array<{ source: string; next: Array<{ text: string }> }> = [];

  scheduleNotesTypingPersist({
    App: timers.App,
    editMode: true,
    activeIndex: 0,
    typingCommitTimerRef,
    typingCommitTokenRef,
    draftNotesRef,
    captureEditorsIntoNotes(base) {
      return [...base, { text: 'should-not-commit' }];
    },
    commitNotes(next, source) {
      commits.push({ source, next: next as Array<{ text: string }> });
    },
    source: 'react:notes:typing',
  });

  assert.equal(typingCommitTimerRef.current, null);
  assert.equal(typingCommitTokenRef.current, 1);
  assert.deepEqual(timers.entries, []);
  assert.deepEqual(commits, []);
  assert.deepEqual(draftNotesRef.current, [{ text: 'draft-1' }]);
});

test('notes typing input cancels an older pending typing timer without scheduling a replacement', () => {
  const timers = createTimerApp();
  const typingCommitTimerRef = { current: 7 as number | null };
  const typingCommitTokenRef = { current: 4 };
  const draftNotesRef = { current: [{ text: 'draft-1' }] as Array<{ text: string }> };
  const commits: string[] = [];

  scheduleNotesTypingPersist({
    App: timers.App,
    editMode: true,
    activeIndex: 0,
    typingCommitTimerRef,
    typingCommitTokenRef,
    draftNotesRef,
    captureEditorsIntoNotes(base) {
      return [...base, { text: 'should-not-commit' }];
    },
    commitNotes(_next, source) {
      commits.push(source);
    },
    source: 'react:notes:typing',
  });

  assert.equal(typingCommitTimerRef.current, null);
  assert.equal(typingCommitTokenRef.current, 5);
  assert.deepEqual(timers.cleared, [7]);
  assert.deepEqual(timers.entries, []);
  assert.deepEqual(commits, []);
});

test('notes typing persist clear uses browser timers and suppresses late callbacks after cancel', () => {
  const timers = createTimerApp();
  const typingCommitTimerRef = { current: 1 as number | null };
  const typingCommitTokenRef = { current: 0 };

  clearNotesTypingPersist(timers.App, typingCommitTimerRef, typingCommitTokenRef);

  assert.equal(typingCommitTimerRef.current, null);
  assert.equal(typingCommitTokenRef.current, 1);
  assert.deepEqual(timers.cleared, [1]);
});

test('prepareDeletedDraftNotes captures live editor changes before deleting the targeted note', () => {
  const draft = [{ text: 'stale-first' }, { text: 'remove-me' }, { text: 'stale-third' }] as Array<{
    text: string;
  }>;

  const out = prepareDeletedDraftNotes({
    draftNotes: draft as any,
    index: 1,
    captureEditorsIntoNotes(base) {
      return [{ ...base[0], text: 'live-first' }, base[1], { ...base[2], text: 'live-third' }] as Array<{
        text: string;
      }>;
    },
  });

  assert.equal(out.deleted, true);
  assert.deepEqual(out.next, [{ text: 'live-first' }, { text: 'live-third' }]);
});

test('prepareDeletedDraftNotes stays a no-op when the requested delete index is out of range', () => {
  const draft = [{ text: 'keep-me' }] as Array<{ text: string }>;

  const out = prepareDeletedDraftNotes({
    draftNotes: draft as any,
    index: 9,
    captureEditorsIntoNotes(base) {
      return base;
    },
  });

  assert.equal(out.deleted, false);
  assert.equal(out.next, draft);
});

function createNotesCommitApp(savedNotes: unknown[]) {
  let currentSavedNotes = savedNotes;
  const calls: Array<{ next: unknown; meta: Record<string, unknown> | undefined }> = [];
  const App: any = {
    store: {
      getState() {
        return {
          config: { savedNotes: currentSavedNotes },
          runtime: {},
          ui: {},
          mode: {},
          meta: {},
        };
      },
    },
    actions: {
      config: {
        setSavedNotes(next: unknown, meta?: Record<string, unknown>) {
          calls.push({ next, meta });
          currentSavedNotes = Array.isArray(next) ? next : [];
        },
      },
    },
  };

  return { App, calls };
}

test('notes overlay commit skips semantic no-op clones so blur and exit do not overwrite history intent', () => {
  const saved = [
    {
      id: 'n1',
      text: 'already saved',
      style: { left: '0px', top: '0px', width: '100px', height: '80px' },
    },
  ];
  const { App, calls } = createNotesCommitApp(saved);

  commitOverlayNotesRuntime(
    App,
    App,
    [
      {
        id: 'n1',
        text: 'already saved',
        style: { top: '0px', left: '0px', height: '80px', width: '100px' },
      },
    ] as any,
    'react:notes:exitDrawMode'
  );

  assert.deepEqual(calls, []);
});

test('notes overlay commit ignores a fresh empty draft note so blank rectangles do not enter history', () => {
  const { App, calls } = createNotesCommitApp([]);

  commitOverlayNotesRuntime(
    App,
    App,
    [
      {
        id: 'empty-draft',
        text: '',
        style: { left: '10px', top: '20px', width: '100px', height: '80px' },
      },
    ] as any,
    'react:notes:outsideClick'
  );

  assert.deepEqual(calls, []);
});

test('notes overlay commit coalesces the first text save of a fresh empty note', () => {
  const { App, calls } = createNotesCommitApp([
    { id: 'n1', text: '', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
  ]);

  commitOverlayNotesRuntime(
    App,
    App,
    [
      { id: 'n1', text: 'first text', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
    ] as any,
    'react:notes:textBlur'
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.meta?.coalesceKey, 'notes:id:n1');
  assert.equal(calls[0]?.meta?.coalesceAcrossIdle, true);
});

function createNotesHistoryMetaApp(savedNotes: unknown[], restoring = false) {
  return {
    store: {
      getState() {
        return {
          config: { savedNotes },
          runtime: { restoring },
          ui: {},
          mode: {},
          meta: {},
        };
      },
    },
  } as any;
}

test('notes history meta keeps later text exits independent while create keeps its own identity', () => {
  const app = createNotesHistoryMetaApp([
    { id: 'n1', text: 'first', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
  ]);

  const firstEdit = buildNotesHistoryCommitMeta({
    App: app,
    source: 'react:notes:textBlur',
    next: [
      { id: 'n1', text: 'first edited', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
    ] as any,
  });

  const secondNoteCreate = buildNotesHistoryCommitMeta({
    App: app,
    source: 'react:notes:create',
    next: [
      { id: 'n1', text: 'first', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
      { id: 'n2', text: '', style: { left: '20px', top: '20px', width: '100px', height: '80px' } },
    ] as any,
  });

  assert.equal(firstEdit.coalesceKey, undefined);
  assert.equal(secondNoteCreate.coalesceKey, 'notes:id:n2');
  assert.notEqual(firstEdit.coalesceKey, secondNoteCreate.coalesceKey);
  assert.equal(firstEdit.coalesceMs, undefined);
  assert.equal(secondNoteCreate.coalesceMs, 1200);
});

test('notes history meta does not coalesce delete, and suppresses overlay commits during project restore', () => {
  const app = createNotesHistoryMetaApp(
    [{ id: 'n1', text: 'first', style: { left: '0px', top: '0px', width: '100px', height: '80px' } }],
    true
  );

  const deleteMeta = buildNotesHistoryCommitMeta({
    App: app,
    source: 'react:notes:delete',
    next: [] as any,
  });

  assert.equal(deleteMeta.source, 'react:notes:delete');
  assert.equal(deleteMeta.immediate, true);
  assert.equal(deleteMeta.coalesceKey, undefined);
  assert.equal(deleteMeta.coalesceMs, undefined);
  assert.equal(isNotesOverlayCommitSuppressed(app), true);
  assert.equal(isNotesOverlayCommitSuppressed(createNotesHistoryMetaApp([], false)), false);
});

test('notes first text after a fresh empty note coalesces with create even after idle time', () => {
  const app = createNotesHistoryMetaApp([
    { id: 'n1', text: '', style: { left: '0px', top: '0px', width: '100px', height: '80px' } },
  ]);

  const firstText = buildNotesHistoryCommitMeta({
    App: app,
    source: 'react:notes:textBlur',
    next: [
      {
        id: 'n1',
        text: '<p>first text</p>',
        style: { left: '0px', top: '0px', width: '100px', height: '80px' },
      },
    ] as any,
  });

  assert.equal(firstText.coalesceKey, 'notes:id:n1');
  assert.equal(firstText.coalesceAcrossIdle, true);
});

test('notes overlay suppresses commits while history undo/redo is applying project state', () => {
  const app = createNotesHistoryMetaApp([], false) as any;
  app.services = {
    history: {
      system: {
        __isApplyingState: true,
        isPaused: true,
      },
    },
  };

  assert.equal(isNotesOverlayCommitSuppressed(app), true);

  app.services.history.system.__isApplyingState = false;
  app.services.history.system.__resumeAfterRestoreToken = 3;
  assert.equal(isNotesOverlayCommitSuppressed(app), true);
});
