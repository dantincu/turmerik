"use client";

import React from 'react';
import { useAtom } from 'jotai';
import { Icon } from "@iconify/react";

import './page.scss';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarComponents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

import ButtonsTestAppBar, { ButtonsTestAppBarTypeName } from './ButtonsTestAppBar';

appBarComponents.map[ButtonsTestAppBarTypeName] = () => (<ButtonsTestAppBar />);

export default function ButtonsTestPage() {
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);

  React.useEffect(() => {
    setShowAppBar(true);
    setAppBarComponentKey(ButtonsTestAppBarTypeName);
    setShowTopToolbar(true);
    setShowBottomToolbar(true);
    setShowLeftPanel(true);
    setShowRightPanel(true);
  }, []);

  return <div>
    <button className="btn btn-primary m-2">Primary Button</button>
    <Icon icon="mdi-light:home" />
  </div>;
}
