import React from "react";

import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import MatUIIcon from "../icons/MatUIIcon";
import longPress from "../../hooks/useLongPress";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";
import { longPressIntervalMs } from "./TextCaretPositionerPopover";

export interface TextCaretInputPositionerJumpLinesViewProps {
  selectionIsEnabled: boolean,
  selectionIsEnabledToggled: (selectionIsEnabled: boolean) => void;
  nextViewClicked: () => void;
}

export default function TextCaretInputPositionerJumpLinesView(
  props: TextCaretInputPositionerJumpLinesViewProps
) {
  const [ selectionIsEnabled, setSelectionIsEnabled ] = React.useState(props.selectionIsEnabled);

  const selectionIsEnabledToggled = React.useCallback(() => {
    props.selectionIsEnabledToggled(!selectionIsEnabled);
  }, [selectionIsEnabled]);

  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  React.useEffect(() => {
    if (props.selectionIsEnabled !== selectionIsEnabled) {
      setSelectionIsEnabled(props.selectionIsEnabled);
    }

  }, [props.selectionIsEnabled, selectionIsEnabled]);

  return (<div className="trmrk-view trmrk-anchor-left trmrk-jump-lines-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onClick={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><TableRowsIcon /></IconButton>

    <IconButton className={["trmrk-icon-btn", "trmrk-toggle-selection",
          selectionIsEnabled ? "trmrk-selection-is-enabled" : "trmrk-selection-is-disabled"].join(" ")}
        onMouseDown={selectionIsEnabledToggled}
        onTouchEnd={selectionIsEnabledToggled}>
      <MatUIIcon iconName={selectionIsEnabled ? "shift_lock" : "shift"} /></IconButton>
    
  </div>);
}
