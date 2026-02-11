"use client";

import React from 'react';
import { useAtom } from 'jotai';

import './page.scss';

import {
  trmrk3PanelsAppLayoutAtoms,
  useAllowShowPanelAtoms,
  useShowPanelAtoms,
  usePanelContentsKeyAtoms,
  init3PanelsAppLayout,
  cleanup3PanelsAppLayout
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import {
  useShowToolbars,
  useToolbarContentKeys,
  useToolbarOverridingContentKeys,
  useAppUserMessage,
} from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkMessagePopover from "@/src/trmrk-react/components/TrmrkMessagePopover/TrmrkMessagePopover";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";
import { Placement } from '@/src/trmrk-browser/core';
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";
import TrmrkMultiClickable from "@/src/trmrk-react/components/TrmrkMultiClickable/TrmrkMultiClickable";
import TrmrkLongPressable from "@/src/trmrk-react/components/TrmrkLongPressable/TrmrkLongPressable";
import { UserMessageLevel } from '@/src/trmrk/core';
import TrmrkAppModal from "@/src/trmrk-react/components/TrmrkAppModal/TrmrkAppModal";
import { defaultTrmrkAppModalService } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkAppModalService";

const AppBar = () => {
  return <TrmrkAppBarContents leadingChildren={() => <TrmrkMultiClickable hoc={{
        node: (props, ref) => <TrmrkBtn {...props} ref={ref as React.Ref<HTMLButtonElement>}><TrmrkIcon icon="mdi:dice" /></TrmrkBtn>,
        props: {}
      }}
      args={hostElem => {
      return ({
        hostElem: hostElem as HTMLElement,
        multiClickPointerDown: (e) => console.log("multiClickPointerDown", e),
        multiClickPressAndHold: (e) => console.log("multiClickPressAndHold", e),
        multiClickComplete: () => console.log("multiClickComplete"),
        multiClickEnded: () => console.log("multiClickEnded")
      });
    }}></TrmrkMultiClickable>}><span className="leading-[40px] text-[15px] font-bold">Buttons Test</span></TrmrkAppBarContents>;
}

const TopToolbar = () => {
  return <TrmrkTopToolBarContents
    showGoToParentBtn={true}
    showPrimaryCustomActionBtn={true}
    showSecondaryCustomActionBtn={true}
    showUndoBtn={true}
    showRedoBtn={true}
    showEditBtn={true}
    showEditDoneBtn={true}
    showSaveBtn={true}
    showSearchBtn={true}
    searchBtnIsOn={true}
    showFilterBtn={true}
    filterBtnIsOn={true}
    showSortBtn={true}
    sortBtnIsOn={true}
    showRefreshBtn={true}
    showClearCacheBtn={true}
    showOptionsBtn={true}><TrmrkLongPressable hoc={{
      node: (props, ref) => <TrmrkBtn {...props} ref={ref as React.Ref<HTMLButtonElement>}><TrmrkIcon icon="mdi:dice" /></TrmrkBtn>,
      props: {}
    }}
    args={hostElem => ({
        hostElem: hostElem as HTMLElement,
      longPressOrRightClick: (e) => console.log("longPressOrRightClick", e),
      shortPressOrLeftClick: (e) => console.log("shortPressOrLeftClick", e)
    })}></TrmrkLongPressable></TrmrkTopToolBarContents>;
}

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
    <TrmrkBtn borderWidth={msg.idx % 3} className="my-[1px]" onClick={() => dispatch({ type: 'SHOW_MESSAGE', idx: msg.idx })}><span className="trmrk-text flex flex-col">
      <span>My Button {msg.idx}</span><span>asdfasdf</span></span></TrmrkBtn>
    <TrmrkMessagePopover show={msg.show} msgLevel={msg.idx % 5} autoCloseMillis={ (msg.idx + 1) * 1000 } arrowPlacement={Placement.Top}>
      {msg.text}</TrmrkMessagePopover>
  </React.Fragment>));

const MiddlePanelContents = () => {
  const [messages, dispatch] = React.useReducer(messagesReducer, messagesArr);
  const appUserMessageAtoms = useAppUserMessage();

  const showAppUserMessageBtnClicked = () => {
    appUserMessageAtoms.show.set((appUserMessageAtoms.show.value ?? 0) + 1);
    appUserMessageAtoms.level.set(Math.floor(Math.random() * 4));
    appUserMessageAtoms.content.set(<><span className="font-bold">App User Message {appUserMessageAtoms.show.value}<br />asdfasdfasf</span></>);
    appUserMessageAtoms.autoCloseMillis.set(0);
  }

  const openModal = React.useCallback(() => {
    defaultTrmrkAppModalService.value.openModal({
      modal: modalId => <TrmrkAppModal modalId={modalId} showTopToolbar={true} topBarContents={<h2>asdasdf</h2>}>
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
      </TrmrkAppModal>
    });
  }, []);

  return <div className="flex flex-wrap">
    <p>asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf
      asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf </p>
    <TrmrkBtn borderWidth={1} className="my-[1px]" onClick={e => console.log("onClick", e)}><span className="trmrk-text">My Button 123</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px]" onClick={showAppUserMessageBtnClicked}>
      <span className="trmrk-icon-wrapper"><TrmrkIcon icon="mdi:home" /></span>
      <span className="trmrk-text">My Button</span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px]">
      <span className="trmrk-text">My Button</span>
      <span className="trmrk-icon-wrapper"><TrmrkIcon icon="mdi:home" /></span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">1</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-primary" onClick={openModal}><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-warn"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-system"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-warn"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px] trmrk-btn-filled-system"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-primary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-secondary"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-accept"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-reject"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-warn"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px] trmrk-btn-filled-system"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={0} className="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkBtn borderWidth={2} className="my-[1px]"><span className="trmrk-text">My Button</span></TrmrkBtn>
    <TrmrkMessagePopover show={1} msgLevel={UserMessageLevel.Success} autoCloseMillis={2000} arrowPlacement={Placement.Top}>asdfasdf</TrmrkMessagePopover>
    { messages.map(msg => <MessageButton msg={msg} dispatch={dispatch} key={msg.idx}></MessageButton>) }
  </div>;
};

export default function ButtonsTestPage() {
  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const panelContentKeyAtoms = usePanelContentsKeyAtoms();
  const showToolbarAtoms = useShowToolbars();
  const toolbarContentKeyAtoms = useToolbarContentKeys();
  const overridingToolbarContentKeyAtoms = useToolbarOverridingContentKeys();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [, setIsMultiPanelMode] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);
  const appUserMessageAtoms = useAppUserMessage();

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
      leftPanel: {
        allowShow: true
      },
      middlePanel: {
        contents: <MiddlePanelContents />
      },
      rightPanel: {
        allowShow: true
      },
      setFocusedPanel,
    });

    showPanelAtoms.leftPanel.set(false);
    showPanelAtoms.middlePanel.set(false);
    showPanelAtoms.rightPanel.set(false);
    setIsMultiPanelMode(false);

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}
