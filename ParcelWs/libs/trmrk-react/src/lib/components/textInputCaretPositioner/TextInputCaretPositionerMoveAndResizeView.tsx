import React from "react";

import IconButton from "@mui/material/IconButton";

import MatUIIcon from "../icons/MatUIIcon";

import {
  TouchOrMouseCoords,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import { 
  getSingleTouchOrClick } from "../../services/domUtils/touchAndMouseEvents";

export enum TextInputCaretPositionerMoveAndResizeState {
  Pending = 0,
  Moving,
  ResizingFromLeft,
  ResizingFromTop,
  ResizingFromRight,
  ResizingFromBottom
}

export interface TextInputCaretPositionerMoveAndResizeViewProps {
  state: TextInputCaretPositionerMoveAndResizeState;
  moveAndResizeStateChanged: (
    moveAndResizeState: TextInputCaretPositionerMoveAndResizeState,
    ev: React.TouchEvent | React.MouseEvent,
    coords: TouchOrMouseCoords) => void;
}

export const ICON_BUTTONS_COUNT = 9;

export default function TextInputCaretPositionerMoveAndResizeView(
  props: TextInputCaretPositionerMoveAndResizeViewProps) {
  React.useEffect(() => {
  }, [props.state]);

  const movePanelTouchStartOrMouseDown = React.useCallback((ev: React.TouchEvent | React.MouseEvent) => {
    const coords = getSingleTouchOrClick(ev);

    if (coords) {
      props.moveAndResizeStateChanged(TextInputCaretPositionerMoveAndResizeState.Moving, ev, coords);
    }
  }, [props.state]);

  const leftPanelTouchStartOrMouseDown = React.useCallback((ev: React.TouchEvent | React.MouseEvent) => {
    const coords = getSingleTouchOrClick(ev);

    if (coords) {
      props.moveAndResizeStateChanged(TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft, ev, coords);
    }
  }, [props.state]);

  const topPanelTouchStartOrMouseDown = React.useCallback((ev: React.TouchEvent | React.MouseEvent) => {
    const coords = getSingleTouchOrClick(ev);

    if (coords) {
      props.moveAndResizeStateChanged(TextInputCaretPositionerMoveAndResizeState.ResizingFromTop, ev, coords);
    }
  }, [props.state]);

  const rightPanelTouchStartOrMouseDown = React.useCallback((ev: React.TouchEvent | React.MouseEvent) => {
    const coords = getSingleTouchOrClick(ev);

    if (coords) {
      props.moveAndResizeStateChanged(TextInputCaretPositionerMoveAndResizeState.ResizingFromRight, ev, coords);
    }
  }, [props.state]);

  const bottomPanelTouchStartOrMouseDown = React.useCallback((ev: React.TouchEvent | React.MouseEvent) => {
    const coords = getSingleTouchOrClick(ev);

    if (coords) {
      props.moveAndResizeStateChanged(TextInputCaretPositionerMoveAndResizeState.ResizingFromBottom, ev, coords);
    }
  }, [props.state]);
  
  return (<div className="trmrk-view trmrk-move-and-resize-view">
    <div className={["trmrk-move-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.Moving ? "trmrk-is-activated" : null].join(" ")}
          onTouchStart={movePanelTouchStartOrMouseDown}
          onMouseDown={movePanelTouchStartOrMouseDown}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key}
          className="trmrk-icon-btn trmrk-drag-icon-btn">
        <MatUIIcon iconName="drag_pan" className="trmrk-icon trmrk-rot-45deg" /></IconButton>) }
      <IconButton />
    </div>
    <div className={["trmrk-side-panel", "trmrk-left-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft ? "trmrk-is-activated" : null].join(" ")}
          onTouchStart={leftPanelTouchStartOrMouseDown}
          onMouseDown={leftPanelTouchStartOrMouseDown}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key}
          className="trmrk-icon-btn">
        <MatUIIcon iconName="width" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-top-left-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-top-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromTop ? "trmrk-is-activated" : null].join(" ")}
          onTouchStart={topPanelTouchStartOrMouseDown}
          onMouseDown={topPanelTouchStartOrMouseDown}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key}
          className="trmrk-icon-btn">
        <MatUIIcon iconName="height" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-top-right-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-right-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromRight ? "trmrk-is-activated" : null].join(" ")}
          onTouchStart={rightPanelTouchStartOrMouseDown}
          onMouseDown={rightPanelTouchStartOrMouseDown}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key}
          className="trmrk-icon-btn">
        <MatUIIcon iconName="width" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-bottom-right-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-bottom-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromBottom ? "trmrk-is-activated" : null].join(" ")}
          onTouchStart={bottomPanelTouchStartOrMouseDown}
          onMouseDown={bottomPanelTouchStartOrMouseDown}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key}
          className="trmrk-icon-btn">
        <MatUIIcon iconName="height" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-bottom-left-panel"].join(" ")}></div>
  </div>);
}
