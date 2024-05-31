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
  minimizeClicked: () => void;
  showMoreOptionsBtnClicked: (showMoreOptions: boolean) => void;
  keepOpenToggled: (keepOpen: boolean) => void;
  closeClicked: () => void;
}

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
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
  }, [
    props.showMoreOptions,
    props.keepOpen,
  ]);

  return (<div className="trmrk-view trmrk-options-view">
    <IconButton className="trmrk-icon-btn"
        onMouseDown={minimizeClicked}
        onTouchEnd={minimizeClicked}>
      <KeyboardDoubleArrowLeftIcon />
    </IconButton>
    <IconButton className="trmrk-icon-btn"
        onMouseDown={showMoreOptionsBtnClicked}
        onTouchEnd={showMoreOptionsBtnClicked}>
      <MoreVertIcon />
    </IconButton>
    { !props.showMoreOptions ? <React.Fragment>
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
  </div>);
}
