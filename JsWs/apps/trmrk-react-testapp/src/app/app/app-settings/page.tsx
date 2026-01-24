"use client";

import React from 'react';
import { useAtom } from 'jotai';

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarContents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

const AppSettingsBar = () => {
  return <h1 className="text-center grow">App Settings</h1>;
}

export default function AppSettingsPage() {
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);
  const [, setTopToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);
  const [, setBottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [, setShowMainPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [, setShowRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);

  React.useEffect(() => {
    const appBarContentsId = appBarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      () => (<AppSettingsBar />));

    setShowAppBar(true);
    setShowTopToolbar(true);
    setShowBottomToolbar(true);
    setShowLeftPanel(false);
    setShowLeftPanelLoader(false);
    setShowMainPanelLoader(false);
    setShowRightPanel(false);
    setShowRightPanelLoader(false);
    
    setAppBarContentsKey(appBarContentsId);
    setTopToolbarContentsKey(null);
    setBottomToolbarContentsKey(null);

    return () => {
      appBarContents.value.unregister(appBarContentsId);
    }
  }, []);

  return <ThemeToggle />;
}

