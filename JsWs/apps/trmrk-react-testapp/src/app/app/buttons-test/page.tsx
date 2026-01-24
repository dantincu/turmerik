"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import { trmrk3PanelsAppLayoutAtoms } from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import {
  appBarContents,
  topToolbarContents,
  bottomToolbarContents,
  trmrkBasicAppLayoutAtoms
} from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkPopup from "@/src/trmrk-react/components/TrmrkPopup/TrmrkPopup";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";
import { Placement } from '@/src/trmrk-browser/core';
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";
import TrmrkBottomToolBarContents from "@/src/trmrk-react/components/TrmrkBottomToolBarContents/TrmrkBottomToolBarContents";
import TrmrkMultiClickable from "@/src/trmrk-react/components/TrmrkMultiClickable/TrmrkMultiClickable";
import TrmrkLongPressable from "@/src/trmrk-react/components/TrmrkLongPressable/TrmrkLongPressable";

const AppBar = () => {
  return <TrmrkAppBarContents leadingChildren={() => <TrmrkMultiClickable hoc={{
        node: (hoc) => (props) => <TrmrkBtn borderWidth={1} {...props} hoc={hoc}><TrmrkIcon icon="mdi:home" /></TrmrkBtn>
      }}
      args={hostElem => {
      return ({
        hostElem,
        multiClickPointerDown: (e) => console.log("multiClickPointerDown", e),
        multiClickPressAndHold: (e) => console.log("multiClickPressAndHold", e),
        multiClickComplete: () => console.log("multiClickComplete"),
        multiClickEnded: () => console.log("multiClickEnded")
      });
    }}></TrmrkMultiClickable>}><h1>Buttons Test</h1></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents><TrmrkLongPressable hoc={{
      node: (hoc) => (props) => <TrmrkBtn borderWidth={1} {...props} hoc={hoc}><TrmrkIcon icon="mdi:home" /></TrmrkBtn>
    }}
    args={hostElem => ({
      hostElem,
      longPressOrRightClick: (e) => console.log("longPressOrRightClick", e),
      shortPressOrLeftClick: (e) => console.log("shortPressOrLeftClick", e)
    })}></TrmrkLongPressable></TrmrkTopToolBarContents>;
}

const BottomToolbar = () => <TrmrkBottomToolBarContents></TrmrkBottomToolBarContents>;

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

type Action = { type: 'SHOW_MESSAGE'; idx: number };

function messagesReducer(state: UserMessage[], action: Action): UserMessage[] {
  switch (action.type) {
    case 'SHOW_MESSAGE':
      return state.map((msg) =>
        msg.idx === action.idx 
          ? { ...msg, show: msg.show + 1 } 
          : msg
      );
    default:
      return state;
  }
}

const MessageButton = React.memo(({ msg, dispatch }: {
    msg: UserMessage,
    dispatch: React.Dispatch<any>
  }) => (<React.Fragment>
    <TrmrkBtn borderWidth={1} cssClass="my-[1px]" onClick={() => dispatch({ type: 'SHOW_MESSAGE', idx: msg.idx })}><span className="trmrk-text">My Button {msg.idx}</span></TrmrkBtn>
    <TrmrkPopup show={msg.show} msgLevel={msg.idx % 4} autoCloseMillis={ (msg.idx + 1) * 1000 } arrowPlacement={Placement.Top}>{msg.text}</TrmrkPopup>
  </React.Fragment>));

export default function ButtonsTestPage() {
  const [, setShowAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [, setAppBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);
  const [, setTopToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);
  const [, setBottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [, setShowTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [, setShowBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [, setShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [, setShowLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [, setShowMainPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [, setShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [, setShowRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);

  const [messages, dispatch] = React.useReducer(messagesReducer, messagesArr);

  React.useEffect(() => {
    const appBarContentsId = appBarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      () => (<AppBar />));

    const topToolbarContentsId = topToolbarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      () => (<TopToolbar />));

    const bottomToolbarContentsId = bottomToolbarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      () => (<BottomToolbar />));

    setShowAppBar(true);
    setShowTopToolbar(true);
    setShowBottomToolbar(true);
    setShowLeftPanel(false);
    setShowLeftPanelLoader(true);
    setShowMainPanelLoader(false);
    setShowRightPanel(false);
    setShowRightPanelLoader(true);

    setAppBarContentsKey(appBarContentsId);
    setTopToolbarContentsKey(topToolbarContentsId);
    setBottomToolbarContentsKey(bottomToolbarContentsId);

    return () => {
      appBarContents.value.unregister(appBarContentsId);
      topToolbarContents.value.unregister(topToolbarContentsId);
      bottomToolbarContents.value.unregister(bottomToolbarContentsId);
    }
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
    { messages.map(msg => <MessageButton msg={msg} dispatch={dispatch} key={msg.idx}></MessageButton>) }
  </div>;
}
