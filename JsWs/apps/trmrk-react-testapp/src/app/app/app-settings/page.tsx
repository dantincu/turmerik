"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import ThemeToggle from '@/src/code/components/ThemeToggle';

import { appBarComponents, appLayoutAtoms } from "@/src/trmrk-react/components/TrmrkAppLayout/TrmrkAppLayoutService";

import AppSettingsBar, { AppSettingsBarTypeName } from './AppSettingsBar';

appBarComponents.map[AppSettingsBarTypeName] = () => (<AppSettingsBar />);

export default function AppSettingsPage() {
  const [, setShowAppBar] = useAtom(appLayoutAtoms.showAppBar);
  const [, setShowTopToolbar] = useAtom(appLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(appLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(appLayoutAtoms.showLeftPanel);
  const [, setShowRightPanel] = useAtom(appLayoutAtoms.showRightPanel);

  React.useEffect(() => {
    setShowAppBar(true);
    setShowTopToolbar(false);
    setShowBottomToolbar(false);
    setShowLeftPanel(false);
    setShowRightPanel(false);
  }, []);

  return <ThemeToggle />;
}

