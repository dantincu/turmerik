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

  return <div className="flex flex-wrap">
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]" onClick={e => console.log("onClick", e)}><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]">
      <span className="trmrk-icon-wrapper"><Icon icon="mdi:home" /></span>
      <span className="trmrk-text">My Button</span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]">
      <span className="trmrk-text">My Button</span>
      <span className="trmrk-icon-wrapper"><Icon icon="mdi:home" /></span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
  </div>;
}
