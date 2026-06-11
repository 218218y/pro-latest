import type { ReactElement } from 'react';

import type { TabId } from '../../../../../types';

import { LazyErrorBoundary } from '../components/index.js';
import { DesignTabView } from './DesignTab.view.js';
import { SettingsTab } from './SettingsTab.js';
import { InteriorTabView } from './InteriorTab.view.js';
import { SketchTabView } from './SketchTab.view.js';

type DeferredSidebarTabsProps = {
  app: unknown;
  activeTab: TabId;
  canRenderDesign: boolean;
  canRenderInterior: boolean;
  canRenderSettings: boolean;
  canRenderSketch: boolean;
  settingsMounted: boolean;
  sketchMounted: boolean;
};

export function DeferredSidebarTabs(props: DeferredSidebarTabsProps): ReactElement {
  const {
    app,
    activeTab,
    canRenderDesign,
    canRenderInterior,
    canRenderSettings,
    canRenderSketch,
    settingsMounted,
    sketchMounted,
  } = props;

  return (
    <>
      {canRenderDesign ? <DesignTabView active={activeTab === 'design'} /> : null}
      {canRenderInterior ? <InteriorTabView active={activeTab === 'interior'} /> : null}
      {canRenderSketch && sketchMounted ? (
        <LazyErrorBoundary label="טאב סקיצה" app={app}>
          <SketchTabView active={activeTab === 'sketch'} />
        </LazyErrorBoundary>
      ) : null}
      {canRenderSettings && settingsMounted ? (
        <LazyErrorBoundary label="טאב הגדרות" app={app}>
          <SettingsTab active={activeTab === 'settings'} />
        </LazyErrorBoundary>
      ) : null}
    </>
  );
}
