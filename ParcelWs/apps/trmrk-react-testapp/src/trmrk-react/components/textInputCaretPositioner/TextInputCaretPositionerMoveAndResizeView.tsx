import React from "react";

import IconButton from "@mui/material/IconButton";

import MatUIIcon from "../icons/MatUIIcon";

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
}

export const ICON_BUTTONS_COUNT = 9;

export default function TextInputCaretPositionerMoveAndResizeView(
  props: TextInputCaretPositionerMoveAndResizeViewProps) {
  React.useEffect(() => {
  }, [props.state]);
  
  return (<div className="trmrk-view trmrk-move-and-resize-view">
    <div className={["trmrk-move-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.Moving ? "trmrk-is-activated" : null].join(" ")}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key} className="trmrk-icon-btn">
        <MatUIIcon iconName="drag_pan" /></IconButton>) }
    </div>
    <div className={["trmrk-side-panel", "trmrk-left-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft ? "trmrk-is-activated" : null].join(" ")}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key} className="trmrk-icon-btn">
        <MatUIIcon iconName="width" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-top-left-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-top-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromTop ? "trmrk-is-activated" : null].join(" ")}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key} className="trmrk-icon-btn">
        <MatUIIcon iconName="height" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-top-right-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-right-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromRight ? "trmrk-is-activated" : null].join(" ")}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key} className="trmrk-icon-btn">
        <MatUIIcon iconName="width" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-bottom-right-panel"].join(" ")}></div>
    <div className={["trmrk-side-panel", "trmrk-bottom-panel",
        props.state === TextInputCaretPositionerMoveAndResizeState.ResizingFromBottom ? "trmrk-is-activated" : null].join(" ")}>
      { Array.from(Array(ICON_BUTTONS_COUNT).keys()).map(key => <IconButton key={key} className="trmrk-icon-btn">
        <MatUIIcon iconName="height" /></IconButton>) }
    </div>
    <div className={["trmrk-corner-panel", "trmrk-bottom-left-panel"].join(" ")}></div>
  </div>);
}
