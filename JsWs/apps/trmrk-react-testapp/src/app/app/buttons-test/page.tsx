"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { appBarComponents, topToolbarComponents, trmrkBasicAppLayoutAtoms } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkPopup from "@/src/trmrk-react/components/TrmrkPopup/TrmrkPopup";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";
import { Placement } from '@/src/trmrk-browser/core';
import { appOverlappingContents } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import ButtonsTestAppBar, { ButtonsTestAppBarTypeName } from './ButtonsTestAppBar';
import ButtonsTestTopToolbar, { ButtonsTestTopToolbarTypeName } from './ButtonsTestTopToolbar';

appBarComponents.map[ButtonsTestAppBarTypeName] = () => (<ButtonsTestAppBar />);
topToolbarComponents.map[ButtonsTestTopToolbarTypeName] = () => (<ButtonsTestTopToolbar />);

const messagesArr: UserMessage[] = Array.from({ length: 100 }).map((_, i) => ({
  idx: i,
  show: 0,
  text: `asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf
      asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf`}));

interface UserMessage {
  idx: number;
  show: number;
  text: string;
}

export default function ButtonsTestPage() {
  const componentIdRef = React.useRef(defaultComponentIdService.value.getNextId());
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);
  const [, setTopToolbarComponentKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarComponentKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [, setShowMainPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [, setShowRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);

  const [ messages, setMessages ] = React.useState(messagesArr.map(message => ({...message})));

  const showMessage = (msg: UserMessage) => {
    const messagesArr = messages.map(message => message.idx === msg.idx ? ({
      ...message,
      show: msg.show + 1
    }) : message);

    setMessages(messagesArr);
  }

  React.useEffect(() => {
    setShowAppBar(true);
    setAppBarComponentKey(ButtonsTestAppBarTypeName);
    setTopToolbarComponentKey(ButtonsTestTopToolbarTypeName);
    setShowTopToolbar(true);
    setShowBottomToolbar(true);
    // setShowLeftPanel(true);
    setShowLeftPanelLoader(true);
    // setShowMainPanelLoader(true);
    // setShowRightPanel(true);
    setShowRightPanelLoader(true);

    appOverlappingContents.value.register(componentIdRef.current, () => <div className="absolute bottom-[0px]">asdfasdfasdf</div>);
  }, []);

  return <div className="flex flex-wrap">
    <p>asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf
      asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf </p>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]" onClick={e => console.log("onClick", e)}><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]">
      <span className="trmrk-icon-wrapper"><TrmrkIcon icon="mdi:home" /></span>
      <span className="trmrk-text">My Button</span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]">
      <span className="trmrk-text">My Button</span>
      <span className="trmrk-icon-wrapper"><TrmrkIcon icon="mdi:home" /></span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} cssClass="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    { messages.map(msg => <React.Fragment key={msg.idx + 1}>
      <TrmrkBtn borderWidth={1} cssClass="my-[1px]" onClick={() => showMessage(msg)}><span className="trmrk-text">My Button {msg.idx}</span></TrmrkBtn>
      <TrmrkPopup show={msg.show} msgLevel={msg.idx % 5} autoCloseMillis={ (msg.idx + 1) * 1000 } arrowPlacement={Placement.Top}>{msg.text}</TrmrkPopup>
    </React.Fragment>) }
  </div>;
}
