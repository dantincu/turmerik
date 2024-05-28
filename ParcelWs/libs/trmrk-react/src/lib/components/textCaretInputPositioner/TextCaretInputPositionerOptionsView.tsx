import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { getSingleTouchOrClick } from "../../services/domUtils/touchAndMouseEvents";

import { normalizeJumpSpeedsArr } from "./TextCaretPositionerPopover";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";

export const POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS = 200;
export const positionerMoveBtnLongPressIntervalMs = 300;

export interface TextCaretInputPositionerOptionsViewProps {
  positionerJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  showMoreOptions: boolean;
  keepOpen: boolean;
  minimizeClicked: () => void;
  showMoreOptionsBtnClicked: (showMoreOptions: boolean) => void;
  keepOpenToggled: (keepOpen: boolean) => void;
  closeClicked: () => void;
  moving: (rowsCount: number) => ValueOrAnyOrVoid<boolean>;
  moveBtnLongPressStarted: () => void;
  moveBtnAfterLongPressStarted: () => void;
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
    requiredButton: 0,
    longPressIntervalMs: positionerMoveBtnLongPressIntervalMs,
    afterLongPressIntervalMs: POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS,
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
    requiredButton: 0,
    longPressIntervalMs: positionerMoveBtnLongPressIntervalMs,
    afterLongPressIntervalMs: POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS,
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
    requiredButton: 0,
    longPressIntervalMs: positionerMoveBtnLongPressIntervalMs,
    afterLongPressIntervalMs: POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS,
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
    requiredButton: 0,
    longPressIntervalMs: positionerMoveBtnLongPressIntervalMs,
    afterLongPressIntervalMs: POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS,
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

  const showMoreOptionsBtnClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.showMoreOptionsBtnClicked(!props.showMoreOptions);
    }
  }, [props.showMoreOptions]);

  const keepOpenToggled = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.keepOpenToggled(!props.keepOpen);
    }
  }, [props.keepOpen]);

  const closeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.closeClicked();
    }
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
    props.showMoreOptions,
    props.keepOpen,
    positionerJumpSpeedsArr,
    moveUpX3BtnElem,
    moveUpX1BtnElem,
    moveDownX1BtnElem,
    moveDownX3BtnElem
  ]);

  return (<div className="trmrk-view trmrk-options-view">
    <div className="trmrk-anchor-left">
      <IconButton className="trmrk-icon-btn"
          onMouseDown={showMoreOptionsBtnClicked}
          onTouchEnd={showMoreOptionsBtnClicked}>
        <MoreVertIcon />
      </IconButton>
    </div>
    <div className="trmrk-anchor-right">
      <IconButton className="trmrk-icon-btn"
          onMouseDown={minimizeClicked}
          onTouchEnd={minimizeClicked}>
        <KeyboardDoubleArrowRightIcon />
      </IconButton>
      { !props.showMoreOptions ? <React.Fragment>
        <IconButton className="trmrk-icon-btn trmrk-move-up-x3-btn" ref={el => moveUpX3BtnElemRef.current = el}>
          <KeyboardDoubleArrowUpIcon className="trmrk-keyboard-double-arrow-up-icon" />
          <KeyboardDoubleArrowUpIcon className="trmrk-keyboard-double-arrow-up-icon" />
        </IconButton>
        <IconButton className="trmrk-icon-btn" ref={el => moveUpX1BtnElemRef.current = el}>
          <KeyboardDoubleArrowUpIcon />
        </IconButton>
        <IconButton className="trmrk-icon-btn" ref={el => moveDownX1BtnElemRef.current = el}>
          <KeyboardDoubleArrowDownIcon />
        </IconButton>
        <IconButton className="trmrk-icon-btn trmrk-move-down-x3-btn" ref={el => moveDownX3BtnElemRef.current = el}>
          <KeyboardDoubleArrowDownIcon className="trmrk-keyboard-double-arrow-down-icon" />
          <KeyboardDoubleArrowDownIcon className="trmrk-keyboard-double-arrow-down-icon" />
        </IconButton>
        <IconButton className="trmrk-icon-btn">
          <MatUIIcon iconName="expand_content" />
        </IconButton>
      </React.Fragment> : <React.Fragment>
        <IconButton className="trmrk-icon-btn"
            onMouseDown={keepOpenToggled}
            onTouchEnd={keepOpenToggled}>
          { props.keepOpen ? <MatUIIcon iconName="keep" /> : <MatUIIcon iconName="keep_off" /> }
        </IconButton>
        <IconButton className="trmrk-icon-btn"
            onMouseDown={closeClicked}
            onTouchEnd={closeClicked}>
          <CloseIcon />
        </IconButton>
      </React.Fragment> }
    </div>
  </div>);
}
