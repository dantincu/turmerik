import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
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
  showMoreOptions: boolean;
  keepOpen: boolean;
  isFullViewPortMode: boolean;
  isMoveMode: boolean;
  isResizeMode: boolean;
  minimizeClicked: () => void;
  showMoreOptionsBtnClicked: (showMoreOptions: boolean) => void;
  keepOpenToggled: (keepOpen: boolean) => void;
  isFullViewPortModeToggled: (isFullViewPortMode: boolean) => void;
  isMoveModeToggled: (isMoveMode: boolean) => void;
  isResizeModeToggled: (isResizeMode: boolean) => void;
  closeClicked: () => void;
}

export const isDefaultMode = (
  isFullViewPortMode: boolean,
  isMoveMode: boolean,
  isResizeMode: boolean) => !(isFullViewPortMode || isMoveMode || isResizeMode);

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const [ isFullViewPortMode, setIsFullViewPortMode ] = React.useState(props.isFullViewPortMode);
  const [ isMoveMode, setIsMoveMode ] = React.useState(props.isMoveMode);
  const [ isResizeMode, setIsResizeMode ] = React.useState(props.isResizeMode);

  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.minimizeClicked();
    }
  }, [isFullViewPortMode, isMoveMode, isResizeMode]);

  const showMoreOptionsBtnClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.showMoreOptionsBtnClicked(!props.showMoreOptions);
    }
  }, [props.showMoreOptions, isFullViewPortMode, isMoveMode, isResizeMode]);

  const keepOpenToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.keepOpenToggled(!props.keepOpen);
    }
  }, [props.keepOpen, isFullViewPortMode, isMoveMode, isResizeMode]);

  const isFullViewPortModeToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.isFullViewPortModeToggled(!isFullViewPortMode);
    }
  }, [isFullViewPortMode, isMoveMode, isResizeMode]);

  const isMoveModeToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.isMoveModeToggled(!isMoveMode);
    }
  }, [isFullViewPortMode, isMoveMode, isResizeMode]);

  const isResizeModeToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.isResizeModeToggled(!isResizeMode);
    }
  }, [isFullViewPortMode, isMoveMode, isResizeMode]);

  const closeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0 && isDefaultMode(isFullViewPortMode, isMoveMode, isResizeMode)) {
      props.closeClicked();
    }
  }, [isFullViewPortMode, isMoveMode, isResizeMode]);

  React.useEffect(() => {
    const isFullViewPortModeNewVal = props.isFullViewPortMode;
    const isMoveModeNewVal = props.isMoveMode;
    const isResizeModeNewVal = props.isResizeMode;

    if (isFullViewPortModeNewVal !== isFullViewPortMode) {
      setIsFullViewPortMode(isFullViewPortMode);
    }

    if (isMoveModeNewVal !== isMoveMode) {
      setIsMoveMode(isMoveModeNewVal);
    }

    if (isResizeModeNewVal !== isResizeMode) {
      setIsResizeMode(isResizeModeNewVal);
    }
  }, [
    props.showMoreOptions,
    props.keepOpen,
    props.isFullViewPortMode,
    props.isMoveMode,
    props.isResizeMode,
    isFullViewPortMode,
    isMoveMode,
    isResizeMode,
  ]);

  return (<div className="trmrk-view trmrk-options-view">
    <IconButton className="trmrk-icon-btn"
        onMouseDown={minimizeClicked}
        onTouchEnd={minimizeClicked}>
      <KeyboardDoubleArrowLeftIcon />
    </IconButton>
    <IconButton className={["trmrk-icon-btn", props.showMoreOptions ? "trmrk-is-activated" : ""].join(" ")}
        onMouseDown={showMoreOptionsBtnClicked}
        onTouchEnd={showMoreOptionsBtnClicked}>
      <MoreVertIcon />
    </IconButton>
    { !props.showMoreOptions ? <React.Fragment>
      <IconButton className={["trmrk-icon-btn", isResizeMode ? "trmrk-is-activated" : ""].join(" ")}
          onMouseDown={isResizeModeToggleBtnClick}
          onTouchStart={isResizeModeToggleBtnClick}>
        <MatUIIcon iconName="resize" />
      </IconButton>
      <IconButton className={["trmrk-icon-btn", isMoveMode ? "trmrk-is-activated" : ""].join(" ")}
          onMouseDown={isMoveModeToggleBtnClick}
          onTouchStart={isMoveModeToggleBtnClick}>
        <MatUIIcon iconName="drag_pan" />
      </IconButton>
      <IconButton className={["trmrk-icon-btn", isFullViewPortMode ? "trmrk-is-activated" : ""].join(" ")}
          onMouseDown={isFullViewPortModeToggleBtnClick}
          onTouchStart={isFullViewPortModeToggleBtnClick}>
        <MatUIIcon iconName="expand_content" />
      </IconButton>
    </React.Fragment> : <React.Fragment>
      <IconButton className={["trmrk-icon-btn", props.keepOpen ? "trmrk-is-activated" : ""].join(" ")}
          onMouseDown={keepOpenToggleBtnClick}
          onTouchEnd={keepOpenToggleBtnClick}>
        { props.keepOpen ? <MatUIIcon iconName="keep" /> : <MatUIIcon iconName="keep_off" /> }
      </IconButton>
      <IconButton className="trmrk-icon-btn"
          onMouseDown={closeClicked}
          onTouchEnd={closeClicked}>
        <CloseIcon />
      </IconButton>
    </React.Fragment> }
  </div>);
}
