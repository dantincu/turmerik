import React from "react";

import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";

export interface TextCaretInputPositionerJumpLinesViewProps {
  nextViewClicked: () => void;
}

export default function TextCaretInputPositionerJumpLinesView(
  props: TextCaretInputPositionerJumpLinesViewProps
) {
  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  return (<div className="trmrk-view trmrk-anchor-left trmrk-jump-lines-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onClick={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><TableRowsIcon /></IconButton></div>);
}
