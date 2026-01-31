'use client';

import React from 'react';
import { useAtom } from 'jotai';

import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import {
  trmrk3PanelsAppLayoutAtoms,
  useAllowShowPanelAtoms,
  usePanelContentsKeyAtoms,
  initLayout,
  cleanupLayout
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import { useShowToolbars, useToolbarContentKeys } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import TrmrkLink from "@/src/trmrk-react/components/TrmrkLink/TrmrkLink";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">Turmerik Notes</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function Landing() {
  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const panelContentKeyAtoms = usePanelContentsKeyAtoms();
  const showToolbarAtoms = useShowToolbars();
  const toolbarContentKeyAtoms = useToolbarContentKeys();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  React.useEffect(() => {
    const layoutInitResult = initLayout({
      allowShowPanelAtoms,
      panelContentKeyAtoms,
      showToolbarAtoms,
      toolbarContentKeyAtoms,
      appBar: {
        contents: <AppBar />,
      },
      topToolbar: {
        contents: <TopToolbar />,
      },
      middlePanel: {
        contents: <><h2>Welcome to Turmerik Notes app</h2><TrmrkLink href="/app">app</TrmrkLink></>
      },
      setFocusedPanel
    });

    return () => {
      cleanupLayout(layoutInitResult);
    }
  }, []);

  return null;
}
