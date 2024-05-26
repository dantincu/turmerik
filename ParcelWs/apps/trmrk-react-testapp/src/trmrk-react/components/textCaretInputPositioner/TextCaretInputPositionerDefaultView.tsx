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
  jumpNextWordTouchStartOrMouseDown: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => ValueOrAnyOrVoid<boolean>;
  jumpNextWordShortPressed: (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void;
  jumpNextWordLongPressStarted: () => void;
  jumpNextWordLongPressEnded: (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => void;
}

export default function TextCaretInputPositionerDefaultView(
  props: TextCaretInputPositionerDefaultViewProps
) {
  const jumpPrevWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const jumpNextWordBtnElemRef = React.useRef<HTMLButtonElement | null>(null);

  const [ jumpPrevWordBtnElem, setJumpPrevWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpPrevWordBtnElemRef.current);
  const [ jumpNextWordBtnElem, setJumpNextWordBtnElem ] = React.useState<HTMLButtonElement | null>(jumpNextWordBtnElemRef.current);

  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(props.inputIsMultiline);

  const jumpPrevWordLongPress = longPress({
    btnElem: jumpPrevWordBtnElem,
    longPressIntervalMs: longPressIntervalMs,
    touchStartOrMouseDown: props.jumpPrevWordTouchStartOrMouseDown,
    shortPressed: props.jumpPrevWordShortPressed,
    longPressStarted: props.jumpPrevWordLongPressStarted,
    longPressEnded: props.jumpPrevWordLongPressEnded
  });

  const jumpNextWordLongPress = longPress({
    btnElem: jumpNextWordBtnElem,
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
    const jumpNextWordBtnElemVal = jumpNextWordBtnElemRef.current;

    if (jumpPrevWordBtnElemVal !== jumpPrevWordBtnElem) {
      setJumpPrevWordBtnElem(jumpPrevWordBtnElemVal);
    }

    if (jumpNextWordBtnElemVal !== jumpNextWordBtnElem) {
      setJumpNextWordBtnElem(jumpNextWordBtnElemVal);
    }

    if (props.inputIsMultiline !== inputIsMultiline) {
      setInputIsMultiline(props.inputIsMultiline);
    }

    return () => {
      jumpPrevWordLongPress.clearAll();
      jumpNextWordLongPress.clearAll();
    }
  }, [props.inputIsMultiline,
    inputIsMultiline,
    jumpPrevWordBtnElemRef,
    jumpNextWordBtnElemRef,
    jumpPrevWordBtnElem,
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

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-btn">
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-btn">
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-word-btn" ref={el => jumpNextWordBtnElemRef.current = el}>
      <SkipNextIcon className="trmrk-skip-next-icon" /></IconButton>

    { inputIsMultiline ? <IconButton className="trmrk-icon-btn trmrk-jump-next-line-btn">
      <ArrowDropDownIcon className="trmrk-arrow-drop-down-icon" /></IconButton> : null }
  </div>);
}
