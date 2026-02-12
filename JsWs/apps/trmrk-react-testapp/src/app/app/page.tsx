'use client';

import React from 'react';
import { useAtom } from 'jotai';

import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import {
  trmrk3PanelsAppLayoutAtoms,
  useAllowShowPanelAtoms,
  usePanelContentsKeyAtoms,
  init3PanelsAppLayout,
  cleanup3PanelsAppLayout
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import {
  useShowToolbars,
  useToolbarContentKeys,
  useToolbarOverridingContentKeys,
  useAppUserMessage
} from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">Turmerik Notes</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function Home() {
  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const panelContentKeyAtoms = usePanelContentsKeyAtoms();
  const showToolbarAtoms = useShowToolbars();
  const toolbarContentKeyAtoms = useToolbarContentKeys();
  const overridingToolbarContentKeyAtoms = useToolbarOverridingContentKeys();
  const appUserMessageAtoms = useAppUserMessage();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  React.useEffect(() => {
    const layoutInitResult = init3PanelsAppLayout({
      allowShowPanelAtoms,
      panelContentKeyAtoms,
      showToolbarAtoms,
      toolbarContentKeyAtoms,
      overridingToolbarContentKeyAtoms,
      appUserMessageAtoms,
      appBar: {
        contents: <AppBar />,
      },
      topToolbar: {
        contents: <TopToolbar />,
      },
      middlePanel: {
        contents: <h2>Home</h2>
      },
      setFocusedPanel
    });

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}
