"use client";

import React from 'react';
import { useAtom } from 'jotai';

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import {
  trmrk3PanelsAppLayoutAtoms,
  TrmrkAppLayoutPanel,
  useAllowShowPanelAtoms,
  useContentsKeyPanelAtoms
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import { appBarContents, topToolbarContents, useShowToolbars, useToolbarContentKeys } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import { middlePanelContents } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">App Settings</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function AppSettingsPage() {
  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const contentsKeyPanelAtoms = useContentsKeyPanelAtoms();
  const showToolbarsAtoms = useShowToolbars();
  const toolbarContentKeysAtoms = useToolbarContentKeys();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  React.useEffect(() => {
    const appBarContentsId = appBarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <AppBar />);

    const topToolbarContentsId = topToolbarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <TopToolbar />);

    const middlePanelContentsId = middlePanelContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <ThemeToggle />
    );

    showToolbarsAtoms.bottomToolbar.set(false);
    allowShowPanelAtoms.leftPanel.set(false);
    allowShowPanelAtoms.middlePanel.set(true);
    allowShowPanelAtoms.rightPanel.set(false);
    setFocusedPanel(TrmrkAppLayoutPanel.Middle);
    
    toolbarContentKeysAtoms.appBar.set(appBarContentsId);
    toolbarContentKeysAtoms.topToolbar.set(topToolbarContentsId);
    toolbarContentKeysAtoms.bottomToolbar.set(null);
    contentsKeyPanelAtoms.leftPanel.set(null);
    contentsKeyPanelAtoms.middlePanel.set(middlePanelContentsId);
    contentsKeyPanelAtoms.rightPanel.set(null);

    return () => {
      appBarContents.value.unregister(appBarContentsId);
      topToolbarContents.value.unregister(topToolbarContentsId);
      middlePanelContents.value.unregister(middlePanelContentsId);
    }
  }, []);

  return null;
}

