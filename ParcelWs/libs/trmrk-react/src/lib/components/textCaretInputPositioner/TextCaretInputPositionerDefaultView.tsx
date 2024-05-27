import React from "react";

import IconButton from "@mui/material/IconButton";
import GridOnIcon from "@mui/icons-material/GridOn";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs } from "./TextCaretPositionerPopover";

export interface TextCaretInputPositionerDefaultViewProps {
  inputIsMultiline: boolean,
  nextViewClicked: () => void;
  jumpPrevLineTouchStartOrMouseDown?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>) | null | undefined;
  jumpPrevLineShortPressed?: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevLineLongPressStarted?: (() => void) | null | undefined;
  jumpPrevLineLongPressEnded?: ((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void) | null | undefined;
  jumpPrevWordTouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevWordShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevWordLongPressStarted: () => void;
  jumpPrevWordLongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharTouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpPrevCharShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpPrevCharLongPressStarted: () => void;
  jumpPrevCharLongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharTouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextCharShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextCharLongPressStarted: () => void;
  jumpNextCharLongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextWordTouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextWordShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextWordLongPressStarted: () => void;
  jumpNextWordLongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineTouchStartOrMouseDown?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>) | null | undefined;
  jumpNextLineShortPressed?: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextLineLongPressStarted?: (() => void) | null | undefined;
  jumpNextLineLongPressEnded?: ((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void) | null | undefined;
}

export default function TextCaretInputPositionerDefaultView(
  props: TextCaretInputPositionerDefaultViewProps
) {
  const jumpPrevLineBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevCharBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextCharBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextLineBtnElemRef = React.useRef<HTMLButtonElement | null>(null);

  const [ jumpPrevLineBtnElem, setJumpPrevLineBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevLineBtnElemRef.current);
  const [ jumpPrevWordBtnElem, setJumpPrevWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevWordBtnElemRef.current);
  const [ jumpPrevCharBtnElem, setJumpPrevCharBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevCharBtnElemRef.current);
  const [ jumpNextCharBtnElem, setJumpNextCharBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextCharBtnElemRef.current);
  const [ jumpNextWordBtnElem, setJumpNextWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextWordBtnElemRef.current);
  const [ jumpNextLineBtnElem, setJumpNextLineBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextLineBtnElemRef.current);

  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(props.inputIsMultiline);

  const jumpPrevLineLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevLineTouchStartOrMouseDown,
    shortPressed: props.jumpPrevLineShortPressed,
    longPressStarted: props.jumpPrevLineLongPressStarted,
    longPressEnded: props.jumpPrevLineLongPressEnded
  });

  const jumpPrevWordLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevWordTouchStartOrMouseDown,
    shortPressed: props.jumpPrevWordShortPressed,
    longPressStarted: props.jumpPrevWordLongPressStarted,
    longPressEnded: props.jumpPrevWordLongPressEnded
  });

  const jumpPrevCharLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevCharTouchStartOrMouseDown,
    shortPressed: props.jumpPrevCharShortPressed,
    longPressStarted: props.jumpPrevCharLongPressStarted,
    longPressEnded: props.jumpPrevCharLongPressEnded
  });

  const jumpNextCharLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextCharTouchStartOrMouseDown,
    shortPressed: props.jumpNextCharShortPressed,
    longPressStarted: props.jumpNextCharLongPressStarted,
    longPressEnded: props.jumpNextCharLongPressEnded
  });

  const jumpNextWordLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextWordTouchStartOrMouseDown,
    shortPressed: props.jumpNextWordShortPressed,
    longPressStarted: props.jumpNextWordLongPressStarted,
    longPressEnded: props.jumpNextWordLongPressEnded
  });

  const jumpNextLineLongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextLineTouchStartOrMouseDown,
    shortPressed: props.jumpNextLineShortPressed,
    longPressStarted: props.jumpNextLineLongPressStarted,
    longPressEnded: props.jumpNextLineLongPressEnded
  });

  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  React.useEffect(() => {
    const jumpPrevLineBtnElemVal = jumpPrevLineBtnElemRef.current;
    const jumpPrevWordBtnElemVal = jumpPrevWordBtnElemRef.current;
    const jumpPrevCharBtnElemVal = jumpPrevCharBtnElemRef.current;
    const jumpNextCharBtnElemVal = jumpNextCharBtnElemRef.current;
    const jumpNextWordBtnElemVal = jumpNextWordBtnElemRef.current;
    const jumpNextLineBtnElemVal = jumpNextLineBtnElemRef.current;

    if (jumpPrevLineBtnElemVal !== jumpPrevLineBtnElem) {
      setJumpPrevLineBtnElem(jumpPrevLineBtnElemVal);
    }

    if (jumpPrevWordBtnElemVal !== jumpPrevWordBtnElem) {
      setJumpPrevWordBtnElem(jumpPrevWordBtnElemVal);
    }

    if (jumpPrevCharBtnElemVal !== jumpPrevCharBtnElem) {
      setJumpPrevCharBtnElem(jumpPrevCharBtnElemVal);
    }

    if (jumpNextWordBtnElemVal !== jumpNextWordBtnElem) {
      setJumpNextWordBtnElem(jumpNextWordBtnElemVal);
    }

    if (jumpNextCharBtnElemVal !== jumpNextCharBtnElem) {
      setJumpNextCharBtnElem(jumpNextCharBtnElemVal);
    }

    if (jumpNextLineBtnElemVal !== jumpNextLineBtnElem) {
      setJumpNextLineBtnElem(jumpNextLineBtnElemVal);
    }

    if (props.inputIsMultiline !== inputIsMultiline) {
      setInputIsMultiline(props.inputIsMultiline);
    }

    if (jumpPrevLineBtnElem) {
      jumpPrevLineLongPress.registerAll(jumpPrevLineBtnElem);
    }

    if (jumpPrevWordBtnElem) {
      jumpPrevWordLongPress.registerAll(jumpPrevWordBtnElem);
    }

    if (jumpPrevCharBtnElem) {
      jumpPrevCharLongPress.registerAll(jumpPrevCharBtnElem);
    }

    if (jumpNextCharBtnElem) {
      jumpNextCharLongPress.registerAll(jumpNextCharBtnElem);
    }

    if (jumpNextWordBtnElem) {
      jumpNextWordLongPress.registerAll(jumpNextWordBtnElem);
    }

    if (jumpNextLineBtnElem) {
      jumpNextLineLongPress.registerAll(jumpNextLineBtnElem);
    }
    
    return () => {
      if (jumpPrevLineBtnElem) {
        jumpPrevLineLongPress.unregisterAll(jumpPrevLineBtnElem);
      }

      if (jumpPrevWordBtnElem) {
        jumpPrevWordLongPress.unregisterAll(jumpPrevWordBtnElem);
      }

      if (jumpPrevCharBtnElem) {
        jumpPrevCharLongPress.unregisterAll(jumpPrevCharBtnElem);
      }

      if (jumpNextCharBtnElem) {
        jumpNextCharLongPress.unregisterAll(jumpNextCharBtnElem);
      }

      if (jumpNextWordBtnElem) {
        jumpNextWordLongPress.unregisterAll(jumpNextWordBtnElem);
      }

      if (jumpNextLineBtnElem) {
        jumpNextLineLongPress.unregisterAll(jumpNextLineBtnElem);
      }
    };
  }, [props.inputIsMultiline,
    inputIsMultiline,
    jumpPrevLineBtnElem,
    jumpPrevWordBtnElem,
    jumpPrevCharBtnElem,
    jumpNextCharBtnElem,
    jumpNextWordBtnElem,
    jumpNextLineBtnElem
  ]);

  return (<div className="trmrk-view trmrk-anchor-left trmrk-default-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onMouseDown={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><GridOnIcon /></IconButton>
    
    { inputIsMultiline ? <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-btn" ref={el => jumpPrevLineBtnElemRef.current = el}>
      <ArrowDropUpIcon className="trmrk-arrow-drop-up-icon" /></IconButton> : null }

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-word-btn" ref={el => jumpPrevWordBtnElemRef.current = el}>
      <SkipPreviousIcon className="trmrk-skip-previous-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-btn" ref={el => jumpPrevCharBtnElemRef.current = el}>
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-btn" ref={el => jumpNextCharBtnElemRef.current = el}>
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-word-btn" ref={el => jumpNextWordBtnElemRef.current = el}>
      <SkipNextIcon className="trmrk-skip-next-icon" /></IconButton>

    { inputIsMultiline ? <IconButton className="trmrk-icon-btn trmrk-jump-next-line-btn" ref={el => jumpNextLineBtnElemRef.current = el}>
      <ArrowDropDownIcon className="trmrk-arrow-drop-down-icon" /></IconButton> : null }
  </div>);
}
