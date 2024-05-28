import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { getSingleTouchOrClick } from "../../services/domUtils/touchAndMouseEvents";

import { normalizeJumpSpeedsArr } from "./TextCaretPositionerPopover";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs } from "./TextCaretPositionerPopover";

export const MOVE_LONG_PRESS_DELAY_MS = 200;

export interface TextCaretInputPositionerOptionsViewProps {
  positionerJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  moving: (rowsCount: number) => ValueOrAnyOrVoid<boolean>;
  moveBtnLongPressStarted: () => void;
  moveBtnAfterLongPressStarted: () => void;
  minimizeClicked: () => void;
  isFullViewScrollModeActivated: (() => void);
}

export const defaultPositionerJumpSpeedsArr = Object.freeze([3, 7, 21]);

export const normalizePositionerJumpSpeedsArr = (
  jumpSpeedsArr: number[] | readonly number[] | null | undefined) => normalizeJumpSpeedsArr(
    jumpSpeedsArr, [...defaultPositionerJumpSpeedsArr]
  );

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const moveUpX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const moveUpX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const moveDownX1BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  const moveDownX3BtnElemRef = React.useRef<HTMLButtonElement | null>(null);
  
  const [ moveUpX3BtnElem, setMoveUpX3BtnElem ] = React.useState<HTMLButtonElement | null>(moveUpX3BtnElemRef.current);
  const [ moveUpX1BtnElem, setMoveUpX1BtnElem ] = React.useState<HTMLButtonElement | null>(moveUpX1BtnElemRef.current);
  const [ moveDownX1BtnElem, setMoveDownX1BtnElem ] = React.useState<HTMLButtonElement | null>(moveDownX1BtnElemRef.current);
  const [ moveDownX3BtnElem, setMoveDownX3BtnElem ] = React.useState<HTMLButtonElement | null>(moveDownX3BtnElemRef.current);

  const [ positionerJumpSpeedsArr, setPositionerJumpSpeedsArr ] = React.useState(
    normalizePositionerJumpSpeedsArr(props.positionerJumpSpeedsArr));

  const moveUpX3LongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    afterLongPressIntervalMs: MOVE_LONG_PRESS_DELAY_MS,
    shortPressed: (ev, coords) => {
      props.moving(-1 * positionerJumpSpeedsArr[0]);
    },
    longPressStarted: props.moveBtnLongPressStarted,
    afterLongPressStarted: props.moveBtnAfterLongPressStarted,
    longPressEnded: (ev, coords) => {
      props.moving(-1 * positionerJumpSpeedsArr[2]);
    },
  });

  const moveUpX1LongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    afterLongPressIntervalMs: MOVE_LONG_PRESS_DELAY_MS,
    shortPressed: (ev, coords) => {
      props.moving(-1);
    },
    longPressStarted: props.moveBtnLongPressStarted,
    afterLongPressStarted: props.moveBtnAfterLongPressStarted,
    longPressEnded: (ev, coords) => {
      props.moving(-1 * positionerJumpSpeedsArr[1]);
    },
  });

  const moveDownX1LongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    afterLongPressIntervalMs: MOVE_LONG_PRESS_DELAY_MS,
    shortPressed: (ev, coords) => {
      props.moving(1);
    },
    longPressStarted: props.moveBtnLongPressStarted,
    afterLongPressStarted: props.moveBtnAfterLongPressStarted,
    longPressEnded: (ev, coords) => {
      props.moving(positionerJumpSpeedsArr[1]);
    },
  });

  const moveDownX3LongPress = longPress({
    longPressIntervalMs: longPressIntervalMs,
    afterLongPressIntervalMs: MOVE_LONG_PRESS_DELAY_MS,
    shortPressed: (ev, coords) => {
      props.moving(positionerJumpSpeedsArr[0]);
    },
    longPressStarted: props.moveBtnLongPressStarted,
    afterLongPressStarted: props.moveBtnAfterLongPressStarted,
    longPressEnded: (ev, coords) => {
      props.moving(positionerJumpSpeedsArr[2]);
    },
  });

  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.minimizeClicked();
    }
  }, []);

  const isFullViewScrollModeActivated = React.useCallback(() => {
    props.isFullViewScrollModeActivated();
  }, []);

  React.useEffect(() => {
    const moveUpX3BtnElemVal = moveUpX3BtnElemRef.current;
    const moveUpX1BtnElemVal = moveUpX1BtnElemRef.current;
    const moveDownX1BtnElemVal = moveDownX1BtnElemRef.current;
    const moveDownX3BtnElemVal = moveDownX3BtnElemRef.current;

    if (moveUpX3BtnElemVal !== moveUpX3BtnElem) {
      setMoveUpX3BtnElem(moveUpX3BtnElemVal);
    }

    if (moveUpX1BtnElemVal !== moveUpX1BtnElem) {
      setMoveUpX1BtnElem(moveUpX1BtnElemVal);
    }

    if (moveDownX1BtnElemVal !== moveDownX1BtnElem) {
      setMoveDownX1BtnElem(moveDownX1BtnElemVal);
    }

    if (moveDownX3BtnElemVal !== moveDownX3BtnElem) {
      setMoveDownX3BtnElem(moveDownX3BtnElemVal);
    }

    if (moveUpX3BtnElem) {
      moveUpX3LongPress.registerAll(moveUpX3BtnElem);
    }

    if (moveUpX1BtnElem) {
      moveUpX1LongPress.registerAll(moveUpX1BtnElem);
    }

    if (moveDownX1BtnElem) {
      moveDownX1LongPress.registerAll(moveDownX1BtnElem);
    }

    if (moveDownX3BtnElem) {
      moveDownX3LongPress.registerAll(moveDownX3BtnElem);
    }

    return () => {
      if (moveUpX3BtnElem) {
        moveUpX3LongPress.unregisterAll(moveUpX3BtnElem);
      }

      if (moveUpX1BtnElem) {
        moveUpX1LongPress.unregisterAll(moveUpX1BtnElem);
      }

      if (moveDownX1BtnElem) {
        moveDownX1LongPress.unregisterAll(moveDownX1BtnElem);
      }

      if (moveDownX3BtnElem) {
        moveDownX3LongPress.unregisterAll(moveDownX3BtnElem);
      }
    }
  }, [
    props.positionerJumpSpeedsArr,
    positionerJumpSpeedsArr,
    moveUpX3BtnElem,
    moveUpX1BtnElem,
    moveDownX1BtnElem,
    moveDownX3BtnElem
  ]);

  return (<div className="trmrk-view trmrk-options-view">
    <div className="trmrk-anchor-right">
      <IconButton className="trmrk-icon-btn"
          onMouseDown={minimizeClicked}
          onTouchEnd={minimizeClicked}>
        <KeyboardDoubleArrowRightIcon />
      </IconButton>
      <IconButton className="trmrk-icon-btn" ref={el => moveUpX3BtnElemRef.current = el}>
        <KeyboardDoubleArrowUpIcon />
      </IconButton>
      <IconButton className="trmrk-icon-btn" ref={el => moveUpX1BtnElemRef.current = el}>
        <KeyboardDoubleArrowUpIcon />
      </IconButton>
      <IconButton className="trmrk-icon-btn" ref={el => moveDownX1BtnElemRef.current = el}>
        <KeyboardDoubleArrowDownIcon />
      </IconButton>
      <IconButton className="trmrk-icon-btn" ref={el => moveDownX3BtnElemRef.current = el}>
        <KeyboardDoubleArrowDownIcon />
      </IconButton>
      <IconButton className="trmrk-icon-btn"
          onMouseDown={isFullViewScrollModeActivated}
          onTouchEnd={isFullViewScrollModeActivated}>
        <DragIndicatorIcon />
      </IconButton>
    </div>
  </div>);
}
