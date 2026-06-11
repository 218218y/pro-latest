import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ensureToastContainerMaybe,
  getById,
  getHeaderLogoImageMaybe,
  getQsa,
  getQs,
  getReactMountRootMaybe,
  getViewerContainerMaybe,
  hasDom,
} from '../esm/native/runtime/dom_access.ts';

type Elem = {
  nodeType: number;
  tagName: string;
  id?: string;
  className?: string;
  parentElement?: Elem | null;
  parentNode?: Elem | null;
  complete?: boolean;
  naturalWidth?: number;
  naturalHeight?: number;
  children: Elem[];
  appendChild: (child: Elem) => void;
};

function makeElement(tag: string, id?: string): Elem {
  const children: Elem[] = [];
  return {
    nodeType: 1,
    tagName: tag.toUpperCase(),
    id,
    className: '',
    parentElement: null,
    parentNode: null,
    children,
    appendChild(child: Elem) {
      child.parentElement = this;
      child.parentNode = this;
      children.push(child);
    },
  };
}

test('dom_access reads canonical DOM surfaces and creates the toast host on demand', () => {
  const viewer = makeElement('div', 'viewer-container');
  const mount = makeElement('div', 'react-root');
  const logo = {
    ...makeElement('img'),
    complete: true,
    naturalWidth: 120,
    naturalHeight: 60,
  };
  const body = makeElement('body');
  const html = makeElement('html');
  const elements = new Map<string, Elem>([
    ['viewer-container', viewer],
    ['react-root', mount],
  ]);

  const doc = {
    body,
    documentElement: html,
    getElementById(id: string) {
      return elements.get(id) || null;
    },
    querySelector(selector: string) {
      if (selector === '[data-wp-logo="1"]' || selector === '.header-logo') return logo;
      return null;
    },
    querySelectorAll(selector: string) {
      if (selector === '.viewer-node') return [viewer, mount];
      return [];
    },
    createElement(tag: string) {
      return makeElement(tag);
    },
  };

  const App = { deps: { browser: { document: doc } } };

  assert.equal(hasDom(App), true);
  assert.equal(getById(App, 'viewer-container'), viewer);
  assert.equal(getViewerContainerMaybe(App), viewer);
  assert.equal(getReactMountRootMaybe(App, ' react-root '), mount);
  assert.equal(getQs(App)('[data-wp-logo="1"]'), logo);
  assert.deepEqual(getQsa(App)('.viewer-node'), [viewer, mount]);
  assert.equal(getHeaderLogoImageMaybe(App), logo);

  const toast = ensureToastContainerMaybe(App);
  assert.ok(toast);
  assert.equal(toast?.id, 'toastContainer');
  assert.equal(viewer.children.includes(toast as Elem), true);
  assert.equal((toast as Elem).parentElement, viewer);
  assert.match((toast as Elem).className || '', /toast-container--viewer/);
  assert.equal(body.children.includes(toast as Elem), false);
});

test('dom_access can pin the shared toast host to the document body for full-screen overlays', () => {
  const viewer = makeElement('div', 'viewer-container');
  const body = makeElement('body');
  const html = makeElement('html');
  const elements = new Map<string, Elem>([['viewer-container', viewer]]);

  const doc = {
    body,
    documentElement: html,
    getElementById(id: string) {
      return elements.get(id) || null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement(tag: string) {
      const el = makeElement(tag);
      if (tag === 'div') elements.set('toastContainer', el);
      return el;
    },
  };

  const App = { deps: { browser: { document: doc } } };

  const toast = ensureToastContainerMaybe(App, { preferBody: true });
  assert.ok(toast);
  assert.equal(toast?.id, 'toastContainer');
  assert.equal((toast as Elem).parentElement, body);
  assert.equal(body.children.includes(toast as Elem), true);
  assert.equal(viewer.children.includes(toast as Elem), false);
  assert.match((toast as Elem).className || '', /toast-container--body/);
  assert.doesNotMatch((toast as Elem).className || '', /toast-container--viewer/);
});
