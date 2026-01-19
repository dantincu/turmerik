"use client";

import React from 'react';
import { useAtom } from 'jotai';
import { Icon } from "@iconify/react";

import './page.scss';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarComponents, topToolbarComponents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";

import ButtonsTestAppBar, { ButtonsTestAppBarTypeName } from './ButtonsTestAppBar';
import ButtonsTestTopToolbar, { ButtonsTestTopToolbarTypeName } from './ButtonsTestTopToolbar';

appBarComponents.map[ButtonsTestAppBarTypeName] = () => (<ButtonsTestAppBar />);
topToolbarComponents.map[ButtonsTestTopToolbarTypeName] = () => (<ButtonsTestTopToolbar />);

export default function ButtonsTestPage() {
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);
  const [, setTopToolbarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarComponentKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);

  React.useEffect(() => {
    setShowAppBar(true);
    setAppBarComponentKey(ButtonsTestAppBarTypeName);
    setTopToolbarComponentKey(ButtonsTestTopToolbarTypeName);
    setShowTopToolbar(true);
    setShowBottomToolbar(true);
    setShowLeftPanel(true);
    setShowRightPanel(true);
  }, []);

  return <>
  </>;
}
