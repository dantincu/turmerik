import React from "react";

import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ArrowLeftIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightIcon from "@mui/icons-material/ArrowDropDown";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs } from "./TextCaretPositionerPopover";

export interface TextCaretInputPositionerJumpLinesViewProps {
  selectionIsActivated: boolean,
  selectionIsActivatedToggled: (selectionIsActivated: boolean) => void;
  nextViewClicked: () => void;
  jumpPrevLineX3TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevLineX3ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineX3LongPressStarted: () => void;
  jumpPrevLineX3LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineX2TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevLineX2ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineX2LongPressStarted: () => void;
  jumpPrevLineX2LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineX1TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevLineX1ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineX1LongPressStarted: () => void;
  jumpPrevLineX1LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX1TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextLineX1ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX1LongPressStarted: () => void;
  jumpNextLineX1LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX2TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextLineX2ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX2LongPressStarted: () => void;
  jumpNextLineX2LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX3TouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextLineX3ShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineX3LongPressStarted: () => void;
  jumpNextLineX3LongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
}

export default function TextCaretInputPositionerJumpLinesView(
  props: TextCaretInputPositionerJumpLinesViewProps
) {
  const jumpPrevLineX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevLineX2BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevLineX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextLineX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextLineX2BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextLineX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  
  const [ jumpPrevLineX3BtnElem, setJumpPrevLineX3BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevLineX3BtnElemRef.current);
  const [ jumpPrevLineX2BtnElem, setJumpPrevLineX2BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevLineX2BtnElemRef.current);
  const [ jumpPrevLineX1BtnElem, setJumpPrevLineX1BtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevLineX1BtnElemRef.current);
  const [ jumpNextLineX1BtnElem, setJumpNextLineX1BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextLineX1BtnElemRef.current);
  const [ jumpNextLineX2BtnElem, setJumpNextLineX2BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextLineX2BtnElemRef.current);
  const [ jumpNextLineX3BtnElem, setJumpNextLineX3BtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextLineX3BtnElemRef.current);

  const [ selectionIsActivated, setSelectionIsActivated ] = React.useState(props.selectionIsActivated);

  const jumpPrevLineX3LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevLineX3TouchStartOrMouseDown,
    shortPressed: props.jumpPrevLineX3ShortPressed,
    longPressStarted: props.jumpPrevLineX3LongPressStarted,
    longPressEnded: props.jumpPrevLineX3LongPressEnded
  });

  const jumpPrevLineX2LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevLineX2TouchStartOrMouseDown,
    shortPressed: props.jumpPrevLineX2ShortPressed,
    longPressStarted: props.jumpPrevLineX2LongPressStarted,
    longPressEnded: props.jumpPrevLineX2LongPressEnded
  });

  const jumpPrevLineX1LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevLineX1TouchStartOrMouseDown,
    shortPressed: props.jumpPrevLineX1ShortPressed,
    longPressStarted: props.jumpPrevLineX1LongPressStarted,
    longPressEnded: props.jumpPrevLineX1LongPressEnded
  });

  const jumpNextLineX1LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextLineX1TouchStartOrMouseDown,
    shortPressed: props.jumpNextLineX1ShortPressed,
    longPressStarted: props.jumpNextLineX1LongPressStarted,
    longPressEnded: props.jumpNextLineX1LongPressEnded
  });

  const jumpNextLineX2LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextLineX2TouchStartOrMouseDown,
    shortPressed: props.jumpNextLineX2ShortPressed,
    longPressStarted: props.jumpNextLineX2LongPressStarted,
    longPressEnded: props.jumpNextLineX2LongPressEnded
  });

  const jumpNextLineX3LongPress = longPress({
    requiredButton: 0,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextLineX3TouchStartOrMouseDown,
    shortPressed: props.jumpNextLineX3ShortPressed,
    longPressStarted: props.jumpNextLineX3LongPressStarted,
    longPressEnded: props.jumpNextLineX3LongPressEnded
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
    const jumpPrevLineX3BtnElemVal = jumpPrevLineX3BtnElemRef.current;
    const jumpPrevLineX2BtnElemVal = jumpPrevLineX2BtnElemRef.current;
    const jumpPrevLineX1BtnElemVal = jumpPrevLineX1BtnElemRef.current;
    const jumpNextLineX1BtnElemVal = jumpNextLineX1BtnElemRef.current;
    const jumpNextLineX2BtnElemVal = jumpNextLineX2BtnElemRef.current;
    const jumpNextLineX3BtnElemVal = jumpNextLineX3BtnElemRef.current;

    if (jumpPrevLineX3BtnElemVal !== jumpPrevLineX3BtnElem) {
      setJumpPrevLineX3BtnElem(jumpPrevLineX3BtnElemVal);
    }

    if (jumpPrevLineX2BtnElemVal !== jumpPrevLineX2BtnElem) {
      setJumpPrevLineX2BtnElem(jumpPrevLineX2BtnElemVal);
    }

    if (jumpPrevLineX1BtnElemVal !== jumpPrevLineX1BtnElem) {
      setJumpPrevLineX1BtnElem(jumpPrevLineX1BtnElemVal);
    }

    if (jumpNextLineX1BtnElemVal !== jumpNextLineX1BtnElem) {
      setJumpNextLineX1BtnElem(jumpNextLineX1BtnElemVal);
    }

    if (jumpNextLineX2BtnElemVal !== jumpNextLineX2BtnElem) {
      setJumpNextLineX2BtnElem(jumpNextLineX2BtnElemVal);
    }

    if (jumpNextLineX3BtnElemVal !== jumpNextLineX3BtnElem) {
      setJumpNextLineX3BtnElem(jumpNextLineX3BtnElemVal);
    }
    
    if (props.selectionIsActivated !== selectionIsActivated) {
      setSelectionIsActivated(props.selectionIsActivated);
    }

    if (jumpPrevLineX3BtnElem) {
      jumpPrevLineX3LongPress.registerAll(jumpPrevLineX3BtnElem);
    }

    if (jumpPrevLineX2BtnElem) {
      jumpPrevLineX2LongPress.registerAll(jumpPrevLineX2BtnElem);
    }

    if (jumpPrevLineX1BtnElem) {
      jumpPrevLineX1LongPress.registerAll(jumpPrevLineX1BtnElem);
    }

    if (jumpNextLineX1BtnElem) {
      jumpNextLineX1LongPress.registerAll(jumpNextLineX1BtnElem);
    }

    if (jumpNextLineX2BtnElem) {
      jumpNextLineX2LongPress.registerAll(jumpNextLineX2BtnElem);
    }

    if (jumpNextLineX3BtnElem) {
      jumpNextLineX3LongPress.registerAll(jumpNextLineX3BtnElem);
    }
    
    return () => {
      if (jumpPrevLineX3BtnElem) {
        jumpPrevLineX3LongPress.unregisterAll(jumpPrevLineX3BtnElem);
      }

      if (jumpPrevLineX2BtnElem) {
        jumpPrevLineX2LongPress.unregisterAll(jumpPrevLineX2BtnElem);
      }

      if (jumpPrevLineX1BtnElem) {
        jumpPrevLineX1LongPress.unregisterAll(jumpPrevLineX1BtnElem);
      }

      if (jumpNextLineX1BtnElem) {
        jumpNextLineX1LongPress.unregisterAll(jumpNextLineX1BtnElem);
      }

      if (jumpNextLineX2BtnElem) {
        jumpNextLineX2LongPress.unregisterAll(jumpNextLineX2BtnElem);
      }

      if (jumpNextLineX3BtnElem) {
        jumpNextLineX3LongPress.unregisterAll(jumpNextLineX3BtnElem);
      }
    };
  }, [
    props.selectionIsActivated,
    selectionIsActivated,
    jumpPrevLineX3BtnElem,
    jumpPrevLineX2BtnElem,
    jumpPrevLineX1BtnElem,
    jumpNextLineX1BtnElem,
    jumpNextLineX2BtnElem,
    jumpNextLineX3BtnElem]);

  return (<div className="trmrk-view trmrk-jump-lines-view">
    <div className="trmrk-anchor-left">
      <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
        onClick={onNextViewIconBtnClick}
        onTouchEnd={onNextViewIconBtnClick}><TableRowsIcon /></IconButton>
        
      <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-x3-btn" ref={el => jumpPrevLineX3BtnElemRef.current = el}>
        <ArrowLeftIcon className="trmrk-arrow-up-icon" />
        <ArrowLeftIcon className="trmrk-arrow-up-icon" />
        <ArrowLeftIcon className="trmrk-arrow-up-icon" /></IconButton>

      <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-x2-btn" ref={el => jumpPrevLineX2BtnElemRef.current = el}>
        <ArrowLeftIcon className="trmrk-arrow-up-icon" />
        <ArrowLeftIcon className="trmrk-arrow-up-icon" /></IconButton>

      <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-x1-btn" ref={el => jumpPrevLineX1BtnElemRef.current = el}>
        <ArrowLeftIcon className="trmrk-arrow-up-icon" /></IconButton>

      <IconButton className={["trmrk-icon-btn", "trmrk-toggle-selection",
            selectionIsActivated ? "trmrk-selection-is-enabled" : "trmrk-selection-is-disabled"].join(" ")}
          onMouseDown={selectionIsActivatedToggled}
          onTouchEnd={selectionIsActivatedToggled}>
        <MatUIIcon iconName={selectionIsActivated ? "shift_lock" : "shift"} /></IconButton>

      <IconButton className="trmrk-icon-btn trmrk-jump-next-line-x1-btn" ref={el => jumpNextLineX1BtnElemRef.current = el}>
        <ArrowRightIcon className="trmrk-arrow-down-icon" /></IconButton>

      <IconButton className="trmrk-icon-btn trmrk-jump-next-line-x2-btn" ref={el => jumpNextLineX2BtnElemRef.current = el}>
        <ArrowRightIcon className="trmrk-arrow-down-icon" />
        <ArrowRightIcon className="trmrk-arrow-down-icon" /></IconButton>

      <IconButton className="trmrk-icon-btn trmrk-jump-next-line-x3-btn" ref={el => jumpNextLineX3BtnElemRef.current = el}>
        <ArrowRightIcon className="trmrk-arrow-down-icon" />
        <ArrowRightIcon className="trmrk-arrow-down-icon" />
        <ArrowRightIcon className="trmrk-arrow-down-icon" /></IconButton>
    </div>
  </div>);
}
