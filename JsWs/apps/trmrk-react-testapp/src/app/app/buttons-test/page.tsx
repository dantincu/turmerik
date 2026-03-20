"use client";

import React from 'react';
import { useAtom, atom } from 'jotai';

import './page.scss';

import {
  trmrk3PanelsAppLayoutAtoms,
  useShowPanelAtoms,
  useShowPanelLoaderAtoms,
  init3PanelsAppLayout,
  cleanup3PanelsAppLayout,
  use3PanelsAppLayoutAtoms
} from "@/src/trmrk-react/components/Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

import { useAppUserMessage } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkMessagePopover from "@/src/trmrk-react/components/TrmrkMessagePopover/TrmrkMessagePopover";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";
import TrmrkScrollBar, { TrmrkScrollBarProps, TrmrkScrollbarThumbPosition } from "@/src/trmrk-react/components/TrmrkScrollBar/TrmrkScrollBar";
import { Placement } from '@/src/trmrk-browser/core';
import TrmrkAppBarContents from "@/src/trmrk-react/components/TrmrkAppBarContents/TrmrkAppBarContents";
import TrmrkTopToolBarContents from "@/src/trmrk-react/components/TrmrkTopToolBarContents/TrmrkTopToolBarContents";
import TrmrkMultiClickable from "@/src/trmrk-react/components/TrmrkMultiClickable/TrmrkMultiClickable";
import TrmrkLongPressable from "@/src/trmrk-react/components/TrmrkLongPressable/TrmrkLongPressable";
import { UserMessageLevel, actWithVal } from '@/src/trmrk/core';
import TrmrkAppModal from "@/src/trmrk-react/components/TrmrkAppModal/TrmrkAppModal";
import TrmrkPopover from "@/src/trmrk-react/components/TrmrkAppModal/TrmrkPopover";
import { defaultTrmrkAppModalService, TrmrkAppModalPropsCoreWithData } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkAppModalService";
import { defaultTrmrkPopoverService, TrmrkPopoverPropsCoreWithData } from "@/src/trmrk-react/components/TrmrkBasicAppLayout/TrmrkPopoverService";
import { TouchOrMouseCoords } from '@/src/trmrk-browser/domUtils/touchAndMouseEvents';

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
  const [itemsCountAtom] = React.useState(() => atom(Number.MAX_SAFE_INTEGER));

  const [skipItems] = React.useState(() => {
    return atom(Math.round(Math.round(Number.MAX_SAFE_INTEGER / 200) * 100))
  });

  return <TrmrkTopToolBarContents
    showGoToParentBtn={true}
    showPrimaryCustomActionBtn={true}
    showSecondaryCustomActionBtn={true}
    showUndoBtn={true}
    showRedoBtn={true}
    showEditBtn={true}
    showEditDoneBtn={true}
    showSaveBtn={true}
    showListPager={true}
    listPagerItemsCountAtom={itemsCountAtom}
    listPagerSkipItemsAtom={skipItems}
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

const LeftPanelContentsScrollBar = React.memo(({
  position,
  cssClass,
  isHorizontal,
  onThumbDrag,
  onThumbDragEnd,
  onThumbDragStart,
}: TrmrkScrollBarProps) => <TrmrkScrollBar
    position={position}
    cssClass={cssClass}
    isHorizontal={isHorizontal}
    onThumbDrag={onThumbDrag}
    onThumbDragEnd={onThumbDragEnd}
    onThumbDragStart={onThumbDragStart} />);

const LeftPanelContents = () => {
  const [position] = React.useState(() => atom({
    px: 0,
    ratio: 0.5,
    trackLengthPx: 0
  } as TrmrkScrollbarThumbPosition));

  const [text, setText] = React.useState("");
  const [positionVal, setPositionVal] = useAtom(position);

  const onDragStart = React.useCallback((event: TouchOrMouseCoords) => {
    setText(JSON.stringify({
      ...event,
      evt: null
    }, null, "  "));
  }, []);

  const onDrag = React.useCallback((event: TrmrkScrollbarThumbPosition) => {
    setText(JSON.stringify(event, null, "  "));
  }, []);

  const onDragEnd = React.useCallback((event: TrmrkScrollbarThumbPosition) => {
    setText(JSON.stringify(event, null, "  "));
    setPositionVal(event);
  }, []);

  return <div className="flex">
    <LeftPanelContentsScrollBar isHorizontal={false} position={position} cssClass="trmrk-buttons-test-page-scroll-bar"
      onThumbDrag={onDrag} onThumbDragEnd={onDragEnd} onThumbDragStart={onDragStart} />
    <pre><code>{text}</code></pre></div>;
}

const MiddlePanelContents = () => {
  const [messages, dispatch] = React.useReducer(messagesReducer, messagesArr);
  const appUserMessageAtoms = useAppUserMessage();

  const showAppUserMessageBtnClicked = React.useCallback(() => {
    appUserMessageAtoms.show.set((appUserMessageAtoms.show.value ?? 0) + 1);
    appUserMessageAtoms.level.set(Math.floor(Math.random() * 4));
    appUserMessageAtoms.content.set(<><span className="font-bold">App User Message {appUserMessageAtoms.show.value}<br />asdfasdfasf</span></>);
    appUserMessageAtoms.autoCloseMillis.set(0);
  }, [appUserMessageAtoms.show.value]);

  const myModalBackColors = Array.from({length: 10}).map(
    () => `rgba(${Array.from({ length: 3 }).map(() => Math.floor(Math.random() * 256).toString()).join(",")},0.25)`);

  const myModalIdRef = React.useRef(0);
  const myPopoverIdRef = React.useRef(0);

  const MyPopover = (props: TrmrkPopoverPropsCoreWithData) => {
    const id = myPopoverIdRef.current++;
    const backgroundColor = myModalBackColors[id % 10];
    return <TrmrkPopover {...props} showBar={true}><div style={{backgroundColor}}>
        <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-primary" onClick={showPopoverBtnClicked}>
          <span className="trmrk-text">My Button {id}</span></TrmrkBtn>
        asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
        asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf</div></TrmrkPopover>
  }

  const myPopoverBtnElRef = React.useRef<HTMLElement>(null);

  const showPopoverBtnClicked = React.useCallback(() => {
    defaultTrmrkPopoverService.value.openPopover({
      props: {
        popoverTitle: atom("asdfasdf")
      },
      popover: MyPopover,
      anchorElAtom: atom(myPopoverBtnElRef.current),
      sameWidthAsAnchorEl: false
    });
  }, []);

  const MyModal = (props: TrmrkAppModalPropsCoreWithData) => {
    const id = myModalIdRef.current++;
    const backgroundColor = myModalBackColors[id % 10];

    return <TrmrkAppModal {...props} showTopToolbar={true} >
      <div style={{backgroundColor}}>
        <TrmrkBtn borderWidth={2} className="my-[1px] trmrk-btn-filled-primary" onClick={openModal}><span className="trmrk-text">My Button {id}</span></TrmrkBtn>
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
        </div>
      </TrmrkAppModal>;
  }

  const openModal = React.useCallback(() => {
    defaultTrmrkAppModalService.value.openModal({
      props: {
        modalTitle: atom("asdfasdf")
      },
      modal: MyModal
    }, {});
  }, []);

  return <div className="flex flex-wrap">
    <p>asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf
      asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf </p>
    <TrmrkBtn borderWidth={1} className="my-[1px]" onClick={e => console.log("onClick", e)}><span className="trmrk-text">My Button 123</span></TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px]" onClick={showAppUserMessageBtnClicked}>
      <span className="trmrk-icon-wrapper"><TrmrkIcon icon="mdi:home" /></span>
      <span className="trmrk-text">My Button</span>
    </TrmrkBtn>
    <TrmrkBtn borderWidth={1} className="my-[1px]" onClick={showPopoverBtnClicked} ref={(el) => {
      myPopoverBtnElRef.current = el;
      actWithVal(defaultTrmrkPopoverService.value, svc => svc.store.set(svc.currentPopoverAnchorEl, el));
    }}>
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
  const trmrk3PanelsLayoutAtoms = use3PanelsAppLayoutAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const [, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [, setIsMultiPanelMode] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

  React.useEffect(() => {
    const layoutInitResult = init3PanelsAppLayout({
      ...trmrk3PanelsLayoutAtoms,
      appBar: {
        contents: <AppBar />,
      },
      topToolbar: {
        contents: <TopToolbar />,
      },
      leftPanel: {
        allowShow: true,
        showLoader: true,
        contents: <LeftPanelContents />
      },
      middlePanel: {
        contents: <MiddlePanelContents />,
        showLoader: true
      },
      rightPanel: {
        allowShow: true,
        showLoader: true
      },
      setFocusedPanel,
    });

    showPanelAtoms.leftPanel.set(true);
    showPanelAtoms.middlePanel.set(true);
    showPanelAtoms.rightPanel.set(true);
    setIsMultiPanelMode(true);

    return () => {
      cleanup3PanelsAppLayout(layoutInitResult);
    }
  }, []);

  return null;
}
