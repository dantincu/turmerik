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
  moveStarted: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => boolean | any | null | undefined | void;
  moving: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => boolean | any | null | undefined | void;
  moveEnded: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => boolean | any | null | undefined | void;
  moveUp: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
  moveDown: (e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
}

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const debugLogSpanElRef = React.useRef<HTMLSpanElement | null>(null);
  const [ isMoving, setIsMoving ] = React.useState(false);

  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.minimizeClicked();
    }
  }, []);

  const dragIconMouseDownOrTouchStart = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    const coords = getSingleTouchOrClick(ev, 0);

    if (coords && props.moveStarted(ev, coords) !== false) {
      setIsMoving(true);
    }
  }, [isMoving]);

  const dragIconMouseUpOrTouchEnd = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    if (isMoving) {
      const coords = getSingleTouchOrClick(ev, 0);

      if (!coords || props.moveEnded(ev, coords) !== false) {
        setIsMoving(false);
      }
    }
  }, [isMoving]);

  const dragIconMouseOrTouchMove = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    if (isMoving) {
      const coords = getSingleTouchOrClick(ev, 0);

      if (!coords || props.moving(ev, coords) === false) {
        setIsMoving(false);
      }
    }
  }, [isMoving]);

  const moveUpClick = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    debugLogSpanElRef.current!.innerText = "moveUpClick";
    const coords = getSingleTouchOrClick(ev, 0);

    if (coords) {
      props.moveUp(ev, coords);
    }
  }, [debugLogSpanElRef]);

  const moveDownClick = React.useCallback((ev: React.MouseEvent | React.TouchEvent) => {
    debugLogSpanElRef.current!.innerText = "moveDownClick";
    const coords = getSingleTouchOrClick(ev, 0);

    if (coords) {
      props.moveDown(ev, coords);
    }
  }, [debugLogSpanElRef]);

  React.useEffect(() => {
  }, [isMoving, debugLogSpanElRef]);

  return (<div className="trmrk-view trmrk-anchor-right trmrk-options-view">
    <span ref={el => debugLogSpanElRef.current = el}>l</span>
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
    <IconButton onMouseDown={dragIconMouseDownOrTouchStart} className="trmrk-icon-btn"
        onTouchStart={dragIconMouseDownOrTouchStart}
        onMouseUp={dragIconMouseUpOrTouchEnd}
        onTouchEnd={dragIconMouseUpOrTouchEnd}
        onMouseMove={dragIconMouseOrTouchMove}
        onTouchMove={dragIconMouseOrTouchMove}>
      <DragHandleIcon />
    </IconButton>
  </div>);
}
