import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { getSingleTouchOrClick } from "../../services/domUtils/touchAndMouseEvents";

import { normalizeJumpSpeedsArr } from "./TextInputCaretPositionerPopover";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";

export const POSITIONER_MOVE_BTN_LONG_PRESS_DELAY_MS = 200;
export const positionerMoveBtnLongPressIntervalMs = 300;

export interface TextInputCaretPositionerOptionsViewProps {
  showMoreOptions: boolean;
  keepOpen: boolean;
  isFullViewPortMode: boolean;
  isMoveAndResizeMode: boolean;
  minimizeClicked: () => void;
  showMoreOptionsBtnClicked: (showMoreOptions: boolean) => void;
  keepOpenToggled: (keepOpen: boolean) => void;
  isFullViewPortModeToggled: (isFullViewPortMode: boolean) => void;
  isMoveAndResizeModeToggled: (isMoveAndResizeMode: boolean) => void;
  closeClicked: () => void;
}

export default function TextInputCaretPositionerOptionsView(
  props: TextInputCaretPositionerOptionsViewProps
) {
  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.minimizeClicked();
    }
  }, [props.isFullViewPortMode]);

  const showMoreOptionsBtnClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.showMoreOptionsBtnClicked(!props.showMoreOptions);
    }
  }, [props.showMoreOptions, props.isFullViewPortMode]);

  const keepOpenToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.keepOpenToggled(!props.keepOpen);
    }
  }, [props.keepOpen, props.isFullViewPortMode]);

  const isFullViewPortModeToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.isFullViewPortModeToggled(!props.isFullViewPortMode);
    }
  }, [props.isFullViewPortMode]);

  const isMoveAndResizeModeToggleBtnClick = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.isMoveAndResizeModeToggled(!props.isMoveAndResizeMode);
    }
  }, [props.isFullViewPortMode]);

  const closeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.closeClicked();
    }
  }, [props.isFullViewPortMode]);

  React.useEffect(() => {
  }, [
    props.showMoreOptions,
    props.keepOpen,
    props.isFullViewPortMode,
    props.isMoveAndResizeMode,
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
      <IconButton className={["trmrk-icon-btn", props.isMoveAndResizeMode ? "trmrk-is-activated" : ""].join(" ")}
          onMouseDown={isMoveAndResizeModeToggleBtnClick}
          onTouchStart={isMoveAndResizeModeToggleBtnClick}>
        <MatUIIcon iconName="drag_pan" />
      </IconButton>
      <IconButton className={["trmrk-icon-btn", props.isFullViewPortMode ? "trmrk-is-activated" : ""].join(" ")}
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