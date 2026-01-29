"use client";

import React from 'react';
import { useAtom } from 'jotai';

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarContents, topToolbarContents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import { middlePanelContents } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppSettingsBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">App Settings</h1></TrmrkAppBarContents>;
}

const AppSettingsTopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function AppSettingsPage() {
  const [, setAppBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);
  const [, setTopToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);
  const [, setBottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setAllowShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.allowShowLeftPanel);
  const [, setLeftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelContentsKey);
  const [, setShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
  const [, setAllowShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.allowShowMiddlePanel);
  const [, setMiddlePanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanelContentsKey);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [, setAllowShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.allowShowRightPanel);
  const [, setRightPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelContentsKey);

  React.useEffect(() => {
    const appBarContentsId = appBarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <AppSettingsBar />);

    const topToolbarContentsId = topToolbarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <AppSettingsTopToolbar />);

    const middlePanelContentsId = middlePanelContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <ThemeToggle />
    );

    setShowBottomToolbar(false);
    setShowLeftPanel(false);
    setAllowShowLeftPanel(false);
    setShowMiddlePanel(true);
    setAllowShowMiddlePanel(true);
    setShowRightPanel(false);
    setAllowShowRightPanel(false);
    
    setAppBarContentsKey(appBarContentsId);
    setTopToolbarContentsKey(topToolbarContentsId);
    setBottomToolbarContentsKey(null);
    setLeftPanelContentsKey(null);
    setMiddlePanelContentsKey(middlePanelContentsId);
    setRightPanelContentsKey(null);

    return () => {
      appBarContents.value.unregister(appBarContentsId);
      topToolbarContents.value.unregister(topToolbarContentsId);
      middlePanelContents.value.unregister(middlePanelContentsId);
    }
  }, []);

  return null;
}

