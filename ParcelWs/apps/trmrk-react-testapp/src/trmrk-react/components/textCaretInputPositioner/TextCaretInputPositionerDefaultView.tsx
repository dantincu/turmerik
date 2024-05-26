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

import longPress from "../../hooks/longPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs } from "./TextCaretPositionerPopover";

export interface TextCaretInputPositionerDefaultViewProps {
  inputIsMultiline: boolean,
  nextViewClicked: () => void;
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
}

export default function TextCaretInputPositionerDefaultView(
  props: TextCaretInputPositionerDefaultViewProps
) {
  const jumpPrevWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpPrevCharBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextCharBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);

  const [ jumpPrevWordBtnElem, setJumpPrevWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevWordBtnElemRef.current);
  const [ jumpPrevCharBtnElem, setJumpPrevCharBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevCharBtnElemRef.current);
  const [ jumpNextCharBtnElem, setJumpNextCharBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextCharBtnElemRef.current);
  const [ jumpNextWordBtnElem, setJumpNextWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextWordBtnElemRef.current);

  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(props.inputIsMultiline);

  const jumpPrevWordLongPress = longPress({
    // btnElem: jumpPrevWordBtnElem,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevWordTouchStartOrMouseDown,
    shortPressed: props.jumpPrevWordShortPressed,
    longPressStarted: props.jumpPrevWordLongPressStarted,
    longPressEnded: props.jumpPrevWordLongPressEnded
  });

  const jumpPrevCharLongPress = longPress({
    // btnElem: jumpPrevCharBtnElem,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevCharTouchStartOrMouseDown,
    shortPressed: props.jumpPrevCharShortPressed,
    longPressStarted: props.jumpPrevCharLongPressStarted,
    longPressEnded: props.jumpPrevCharLongPressEnded
  });

  const jumpNextCharLongPress = longPress({
    // btnElem: jumpNextCharBtnElem,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextCharTouchStartOrMouseDown,
    shortPressed: props.jumpNextCharShortPressed,
    longPressStarted: props.jumpNextCharLongPressStarted,
    longPressEnded: props.jumpNextCharLongPressEnded
  });

  const jumpNextWordLongPress = longPress({
    // btnElem: jumpNextWordBtnElem,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpNextWordTouchStartOrMouseDown,
    shortPressed: props.jumpNextWordShortPressed,
    longPressStarted: props.jumpNextWordLongPressStarted,
    longPressEnded: props.jumpNextWordLongPressEnded
  });

  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  React.useEffect(() => {
    const jumpPrevWordBtnElemVal = jumpPrevWordBtnElemRef.current;
    const jumpPrevCharBtnElemVal = jumpPrevCharBtnElemRef.current;
    const jumpNextCharBtnElemVal = jumpNextCharBtnElemRef.current;
    const jumpNextWordBtnElemVal = jumpNextWordBtnElemRef.current;

    let registerEvents = true;

    if (jumpPrevWordBtnElemVal !== jumpPrevWordBtnElem) {
      registerEvents = false;
      setJumpPrevWordBtnElem(jumpPrevWordBtnElemVal);
    }

    if (jumpPrevCharBtnElemVal !== jumpPrevCharBtnElem) {
      registerEvents = false;
      setJumpPrevCharBtnElem(jumpPrevCharBtnElemVal);
    }

    if (jumpNextWordBtnElemVal !== jumpNextWordBtnElem) {
      registerEvents = false;
      setJumpNextWordBtnElem(jumpNextWordBtnElemVal);
    }

    if (jumpNextCharBtnElemVal !== jumpNextCharBtnElem) {
      registerEvents = false;
      setJumpNextCharBtnElem(jumpNextCharBtnElemVal);
    }

    if (props.inputIsMultiline !== inputIsMultiline) {
      registerEvents = false;
      setInputIsMultiline(props.inputIsMultiline);
    }

    registerEvents = registerEvents && [jumpPrevWordBtnElem, jumpPrevCharBtnElem, jumpNextWordBtnElem, jumpNextCharBtnElem].map(
      elem => !!elem
    ).reduce((a, b) => a && b);

    // console.log("registerEvents", registerEvents, jumpPrevWordBtnElem, jumpPrevCharBtnElem, jumpNextWordBtnElem, jumpNextCharBtnElem);

    if (registerEvents) {
      jumpPrevWordLongPress.registerAll(jumpPrevWordBtnElem!);
      jumpPrevCharLongPress.registerAll(jumpPrevCharBtnElem!);
      jumpNextCharLongPress.registerAll(jumpNextCharBtnElem!);
      jumpNextWordLongPress.registerAll(jumpNextWordBtnElem!);
    }

    return () => {
      if (registerEvents) {
        jumpPrevWordLongPress.unregisterAll();
        jumpPrevCharLongPress.unregisterAll();
        jumpNextCharLongPress.unregisterAll();
        jumpNextWordLongPress.unregisterAll();
    }
    }
  }, [props.inputIsMultiline,
    inputIsMultiline,
    jumpPrevWordBtnElemRef,
    jumpPrevCharBtnElemRef,
    jumpNextCharBtnElemRef,
    jumpNextWordBtnElemRef,
    jumpPrevWordBtnElem,
    jumpPrevCharBtnElem,
    jumpNextCharBtnElem,
    jumpNextWordBtnElem
  ]);

  return (<div className="trmrk-view trmrk-anchor-left trmrk-default-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onMouseDown={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><GridOnIcon /></IconButton>
    
    { inputIsMultiline ? <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-btn">
      <ArrowDropUpIcon className="trmrk-arrow-drop-up-icon" /></IconButton> : null }

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-word-btn" ref={el => jumpPrevWordBtnElemRef.current = el}>
      <SkipPreviousIcon className="trmrk-skip-previous-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-btn" ref={el => jumpPrevCharBtnElemRef.current = el}>
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-btn" ref={el => jumpNextCharBtnElemRef.current = el}>
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-word-btn" ref={el => jumpNextWordBtnElemRef.current = el}>
      <SkipNextIcon className="trmrk-skip-next-icon" /></IconButton>

    { inputIsMultiline ? <IconButton className="trmrk-icon-btn trmrk-jump-next-line-btn">
      <ArrowDropDownIcon className="trmrk-arrow-drop-down-icon" /></IconButton> : null }
  </div>);
}
