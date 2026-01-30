'use client';

import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import { trmrk3PanelsAppLayoutAtoms, TrmrkAppLayoutPanel } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarContents, topToolbarContents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import { middlePanelContents } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">404</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function NotFound() {
  const [, setAppBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);
  const [, setTopToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);
  const [, setBottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setAllowShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.allowShow);
  const [, setLeftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.contentsKey);
  const [, setAllowShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
  const [, setMiddlePanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.contentsKey);
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
      <div className="flex flex-col items-center justify-center py-2">
        <h2>Not found</h2>
        <p className="text-zinc-500 mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
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
