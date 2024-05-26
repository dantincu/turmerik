import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { getSingleTouchOrClick } from "../../services/domUtils/touchAndMouseEvents";

export interface TextCaretInputPositionerOptionsViewProps {
  minimizeClicked: () => void;
  moveUp: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
  moveDown: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
}

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.minimizeClicked();
    }
  }, []);

  const moveUpClick = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    const coords = getSingleTouchOrClick(ev, 0);

    if (coords) {
      props.moveUp(ev, coords);
    }
  }, []);

  const moveDownClick = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    const coords = getSingleTouchOrClick(ev, 0);

    if (coords) {
      props.moveDown(ev, coords);
    }
  }, []);

  React.useEffect(() => {
  }, []);

  return (<div className="trmrk-view trmrk-anchor-right trmrk-options-view">
    <IconButton disableRipple className="trmrk-icon-btn"
        onMouseDown={minimizeClicked}
        onTouchEnd={minimizeClicked}>
      <KeyboardDoubleArrowRightIcon />
    </IconButton>
    <IconButton disableRipple className="trmrk-icon-btn"
        onMouseUp={moveUpClick}
        onTouchEnd={moveUpClick}>
      <KeyboardDoubleArrowUpIcon />
    </IconButton>
    <IconButton disableRipple className="trmrk-icon-btn"
        onMouseUp={moveDownClick}
        onTouchEnd={moveDownClick}>
      <KeyboardDoubleArrowDownIcon />
    </IconButton>
  </div>);
}