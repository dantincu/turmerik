import React from "react";

import IconButton from "@mui/material/IconButton";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export interface TextCaretInputPositionerJumpSymbolsViewProps {
  nextViewClicked: () => void;
}

export default function TextCaretInputPositionerJumpSymbolsView(
  props: TextCaretInputPositionerJumpSymbolsViewProps
) {
  const onNextViewIconBtnClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.nextViewClicked();
    }
  }

  return (<div className="trmrk-view trmrk-anchor-left trmrk-jump-symbols-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onClick={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><ViewColumnIcon /></IconButton></div>);
}
