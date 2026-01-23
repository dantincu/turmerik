"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarComponents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

import AppSettingsBar, { AppSettingsBarTypeName } from './AppSettingsBar';

appBarComponents.map[AppSettingsBarTypeName] = () => (<AppSettingsBar />);

export default function AppSettingsPage() {
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowMainPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);

  React.useEffect(() => {
    setShowAppBar(true);
    setAppBarComponentKey(AppSettingsBarTypeName);
    setShowTopToolbar(false);
    setShowBottomToolbar(false);
    setShowLeftPanel(false);
    setShowMainPanelLoader(true);
    setShowRightPanel(false);
  }, []);

  return <ThemeToggle />;
}

