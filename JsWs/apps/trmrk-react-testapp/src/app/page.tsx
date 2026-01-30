'use client';

import React from 'react';
import { useAtom } from 'jotai';

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import { trmrk3PanelsAppLayoutAtoms, TrmrkAppLayoutPanel } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarContents, topToolbarContents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import { middlePanelContents } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">Turmerik Notes</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents showHomeBtn={false}></TrmrkTopToolBarContents>;
}

export default function Landing() {
  const [, setAppBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);
  const [, setTopToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);
  const [, setBottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
  const [, setAllowShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.allowShow);
  const [, setLeftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.contentsKey);
  const [, setShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
  const [, setAllowShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
  const [, setMiddlePanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.contentsKey);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
  const [, setAllowShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow);
  const [, setRightPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.contentsKey);
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
      <h2>Welcome to Turmerik Notes app</h2>
    );

    setShowBottomToolbar(false);
    setAllowShowLeftPanel(false);
    setAllowShowMiddlePanel(true);
    setAllowShowRightPanel(false);
    setFocusedPanel(TrmrkAppLayoutPanel.Middle);
    
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
