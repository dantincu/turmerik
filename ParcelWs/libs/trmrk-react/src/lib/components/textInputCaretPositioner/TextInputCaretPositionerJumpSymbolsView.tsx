import React from "react";

import IconButton from "@mui/material/IconButton";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs, startIntervalMs } from "./TextInputCaretPositionerPopover";

export interface TextInputCaretPositionerJumpSymbolsViewProps {
  selectionIsActivated: boolean,
  selectionIsActivatedToggled: (selectionIsActivated: boolean) => void;
  nextViewClicked: () => void;
  jumpPrevCharX3TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevCharX3TouchStartOrMouseDownDelayed: () => void; 
  jumpPrevCharX3ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharX3LongPressStarted: () => void;
  jumpPrevCharX3LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharX2TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevCharX2TouchStartOrMouseDownDelayed: () => void; 
  jumpPrevCharX2ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharX2LongPressStarted: () => void;
  jumpPrevCharX2LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharX1TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevCharX1TouchStartOrMouseDownDelayed: () => void; 
  jumpPrevCharX1ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharX1LongPressStarted: () => void;
  jumpPrevCharX1LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX1TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextCharX1TouchStartOrMouseDownDelayed: () => void; 
  jumpNextCharX1ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX1LongPressStarted: () => void;
  jumpNextCharX1LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX2TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextCharX2TouchStartOrMouseDownDelayed: () => void; 
  jumpNextCharX2ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX2LongPressStarted: () => void;
  jumpNextCharX2LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX3TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextCharX3TouchStartOrMouseDownDelayed: () => void; 
  jumpNextCharX3ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharX3LongPressStarted: () => void;
  jumpNextCharX3LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
}

export default function TextInputCaretPositionerJumpSymbolsView(
  props: TextInputCaretPositionerJumpSymbolsViewProps
) {
  const jumpPrevCharX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevCharX2BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevCharX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextCharX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextCharX2BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextCharX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  
  const [ jumpPrevCharX3BtnElem, setJumpPrevCharX3BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevCharX3BtnElemRef.current);
  const [ jumpPrevCharX2BtnElem, setJumpPrevCharX2BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevCharX2BtnElemRef.current);
  const [ jumpPrevCharX1BtnElem, setJumpPrevCharX1BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevCharX1BtnElemRef.current);
  const [ jumpNextCharX1BtnElem, setJumpNextCharX1BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextCharX1BtnElemRef.current);
  const [ jumpNextCharX2BtnElem, setJumpNextCharX2BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextCharX2BtnElemRef.current);
  const [ jumpNextCharX3BtnElem, setJumpNextCharX3BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextCharX3BtnElemRef.current);

  const [ selectionIsActivated, setselectionIsActivated ] = React.useState(props.selectionIsActivated);

  const jumpPrevCharX3LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevCharX3TouchStartOrMouseDown,
    startIntervalEnded: props.jumpPrevCharX3TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpPrevCharX3ShortPressed,
    longPressStarted: props.jumpPrevCharX3LongPressStarted,
    longPressEnded: props.jumpPrevCharX3LongPressEnded
  });

  const jumpPrevCharX2LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevCharX2TouchStartOrMouseDown,
    startIntervalEnded: props.jumpPrevCharX2TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpPrevCharX2ShortPressed,
    longPressStarted: props.jumpPrevCharX2LongPressStarted,
    longPressEnded: props.jumpPrevCharX2LongPressEnded
  });

  const jumpPrevCharX1LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevCharX1TouchStartOrMouseDown,
    startIntervalEnded: props.jumpPrevCharX1TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpPrevCharX1ShortPressed,
    longPressStarted: props.jumpPrevCharX1LongPressStarted,
    longPressEnded: props.jumpPrevCharX1LongPressEnded
  });

  const jumpNextCharX1LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextCharX1TouchStartOrMouseDown,
    startIntervalEnded: props.jumpNextCharX1TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpNextCharX1ShortPressed,
    longPressStarted: props.jumpNextCharX1LongPressStarted,
    longPressEnded: props.jumpNextCharX1LongPressEnded
  });

  const jumpNextCharX2LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextCharX2TouchStartOrMouseDown,
    startIntervalEnded: props.jumpNextCharX2TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpNextCharX2ShortPressed,
    longPressStarted: props.jumpNextCharX2LongPressStarted,
    longPressEnded: props.jumpNextCharX2LongPressEnded
  });

  const jumpNextCharX3LongPress = longPress({
    requiredButton: 0,
    startIntervalMs,
    longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextCharX3TouchStartOrMouseDown,
    startIntervalEnded: props.jumpNextCharX3TouchStartOrMouseDownDelayed,
    shortPressed: props.jumpNextCharX3ShortPressed,
    longPressStarted: props.jumpNextCharX3LongPressStarted,
    longPressEnded: props.jumpNextCharX3LongPressEnded
  });

  const selectionIsActivatedToggled = React.useCallback(() => {
    props.selectionIsActivatedToggled(!selectionIsActivated);
  }, [selectionIsActivated]);
  
  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  React.useEffect(() => {
    const jumpPrevCharX3BtnElemVal = jumpPrevCharX3BtnElemRef.current;
    const jumpPrevCharX2BtnElemVal = jumpPrevCharX2BtnElemRef.current;
    const jumpPrevCharX1BtnElemVal = jumpPrevCharX1BtnElemRef.current;
    const jumpNextCharX1BtnElemVal = jumpNextCharX1BtnElemRef.current;
    const jumpNextCharX2BtnElemVal = jumpNextCharX2BtnElemRef.current;
    const jumpNextCharX3BtnElemVal = jumpNextCharX3BtnElemRef.current;

    if (jumpPrevCharX3BtnElemVal !== jumpPrevCharX3BtnElem) {
      setJumpPrevCharX3BtnElem(jumpPrevCharX3BtnElemVal);
    }

    if (jumpPrevCharX2BtnElemVal !== jumpPrevCharX2BtnElem) {
      setJumpPrevCharX2BtnElem(jumpPrevCharX2BtnElemVal);
    }

    if (jumpPrevCharX1BtnElemVal !== jumpPrevCharX1BtnElem) {
      setJumpPrevCharX1BtnElem(jumpPrevCharX1BtnElemVal);
    }

    if (jumpNextCharX1BtnElemVal !== jumpNextCharX1BtnElem) {
      setJumpNextCharX1BtnElem(jumpNextCharX1BtnElemVal);
    }

    if (jumpNextCharX2BtnElemVal !== jumpNextCharX2BtnElem) {
      setJumpNextCharX2BtnElem(jumpNextCharX2BtnElemVal);
    }

    if (jumpNextCharX3BtnElemVal !== jumpNextCharX3BtnElem) {
      setJumpNextCharX3BtnElem(jumpNextCharX3BtnElemVal);
    }
    
    if (props.selectionIsActivated !== selectionIsActivated) {
      setselectionIsActivated(props.selectionIsActivated);
    }

    if (jumpPrevCharX3BtnElem) {
      jumpPrevCharX3LongPress.registerAll(jumpPrevCharX3BtnElem);
    }

    if (jumpPrevCharX2BtnElem) {
      jumpPrevCharX2LongPress.registerAll(jumpPrevCharX2BtnElem);
    }

    if (jumpPrevCharX1BtnElem) {
      jumpPrevCharX1LongPress.registerAll(jumpPrevCharX1BtnElem);
    }

    if (jumpNextCharX1BtnElem) {
      jumpNextCharX1LongPress.registerAll(jumpNextCharX1BtnElem);
    }

    if (jumpNextCharX2BtnElem) {
      jumpNextCharX2LongPress.registerAll(jumpNextCharX2BtnElem);
    }

    if (jumpNextCharX3BtnElem) {
      jumpNextCharX3LongPress.registerAll(jumpNextCharX3BtnElem);
    }
    
    return () => {
      if (jumpPrevCharX3BtnElem) {
        jumpPrevCharX3LongPress.unregisterAll(jumpPrevCharX3BtnElem);
      }

      if (jumpPrevCharX2BtnElem) {
        jumpPrevCharX2LongPress.unregisterAll(jumpPrevCharX2BtnElem);
      }

      if (jumpPrevCharX1BtnElem) {
        jumpPrevCharX1LongPress.unregisterAll(jumpPrevCharX1BtnElem);
      }

      if (jumpNextCharX1BtnElem) {
        jumpNextCharX1LongPress.unregisterAll(jumpNextCharX1BtnElem);
      }

      if (jumpNextCharX2BtnElem) {
        jumpNextCharX2LongPress.unregisterAll(jumpNextCharX2BtnElem);
      }

      if (jumpNextCharX3BtnElem) {
        jumpNextCharX3LongPress.unregisterAll(jumpNextCharX3BtnElem);
      }
    };
  }, [
    props.selectionIsActivated,
    selectionIsActivated,
    jumpPrevCharX3BtnElem,
    jumpPrevCharX2BtnElem,
    jumpPrevCharX1BtnElem,
    jumpNextCharX1BtnElem,
    jumpNextCharX2BtnElem,
    jumpNextCharX3BtnElem]);

  return (<div className="trmrk-view trmrk-jump-symbols-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onClick={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><ViewColumnIcon /></IconButton>
      
    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-x3-btn" ref={el => jumpPrevCharX3BtnElemRef.current = el}>
      <ArrowLeftIcon className="trmrk-arrow-left-icon" />
      <ArrowLeftIcon className="trmrk-arrow-left-icon" />
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-x2-btn" ref={el => jumpPrevCharX2BtnElemRef.current = el}>
      <ArrowLeftIcon className="trmrk-arrow-left-icon" />
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-x1-btn" ref={el => jumpPrevCharX1BtnElemRef.current = el}>
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className={["trmrk-icon-btn", "trmrk-toggle-selection",
          selectionIsActivated ? "trmrk-is-activated" : "trmrk-is-disactivated"].join(" ")}
        onMouseDown={selectionIsActivatedToggled}
        onTouchEnd={selectionIsActivatedToggled}>
      <MatUIIcon iconName={selectionIsActivated ? "shift_lock" : "shift"} /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-x1-btn" ref={el => jumpNextCharX1BtnElemRef.current = el}>
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-x2-btn" ref={el => jumpNextCharX2BtnElemRef.current = el}>
      <ArrowRightIcon className="trmrk-arrow-right-icon" />
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-x3-btn" ref={el => jumpNextCharX3BtnElemRef.current = el}>
      <ArrowRightIcon className="trmrk-arrow-right-icon" />
      <ArrowRightIcon className="trmrk-arrow-right-icon" />
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>
  </div>);
}
