"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import ThemeToggle from '@/src/trmrk-notes-reactlib/components/ThemeToggle/ThemeToggle';
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
  return <TrmrkAppBarContents><h1>App Settings</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents></TrmrkTopToolBarContents>;
}

export default function AppSettingsPageCore() {
  const trmrk3PanelsLayoutAtoms = use3PanelsAppLayoutAtoms();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  React.useEffect(() => {
    const layoutInitResult = init3PanelsAppLayout({
      ...trmrk3PanelsLayoutAtoms,
      appBar: {
        contents: AppBar
      },
      topToolbar: {
        contents: TopToolbar
      },
      middlePanel: {
        contents: ThemeToggle,
      },
      setFocusedPanel
    });

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}

