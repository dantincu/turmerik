"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";

import {
  trmrk3PanelsAppLayoutAtoms,
  useShowPanelAtoms,
  init3PanelsAppLayout,
  cleanup3PanelsAppLayout,
  use3PanelsAppLayoutAtoms
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

const AppBar = () => {
  return <TrmrkAppBarContents><h1 className="text-center grow">App Settings</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function AppSettingsPage() {
  const trmrk3PanelsLayoutAtoms = use3PanelsAppLayoutAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [, setIsResizingPanels] = useAtom(trmrk3PanelsAppLayoutAtoms.isResizingPanels);
  const [, setIsMultiPanelMode] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

  React.useEffect(() => {
    const layoutInitResult = init3PanelsAppLayout({
      ...trmrk3PanelsLayoutAtoms,
      appBar: {
        contents: AppBar
      },
      topToolbar: {
        contents: TopToolbar
      },
      leftPanel: {
        allowShow: true,
      },
      middlePanel: {
        contents: ThemeToggle
      },
      rightPanel: {
        allowShow: true,
      },
      setFocusedPanel
    });

    showPanelAtoms.leftPanel.set(true);
    showPanelAtoms.middlePanel.set(true);
    showPanelAtoms.rightPanel.set(true);
    setIsResizingPanels(true);
    setIsMultiPanelMode(true);

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}

