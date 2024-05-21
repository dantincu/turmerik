import React from "react";

import IconButton from "@mui/material/IconButton";
import TableRowsIcon from "@mui/icons-material/TableRows";

export interface TextCaretInputPositionerJumpLinesViewProps {
  nextViewClicked: () => void;
}

export default function TextCaretInputPositionerJumpLinesView(
  props: TextCaretInputPositionerJumpLinesViewProps
) {
  const onNextViewIconBtnClick = () => {
    props.nextViewClicked();
  }

  return (<div className="trmrk-view trmrk-jump-lines-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onClick={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><TableRowsIcon /></IconButton></div>);
}
