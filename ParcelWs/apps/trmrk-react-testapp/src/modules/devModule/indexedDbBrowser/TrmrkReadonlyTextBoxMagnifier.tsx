import React from "react";

import IconButton from "@mui/material/IconButton";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import MatUIIcon from "trmrk-react/src/components/icons/MatUIIcon";

export interface TrmrkReadonlyTextBoxMagnifierProps {
  text: string;
}

export default function TrmrkReadonlyTextBoxMagnifier(
  props: TrmrkReadonlyTextBoxMagnifierProps
) {
  return (<div className="trmrk-textbox-magnifier trmrk-readonly-textbox-magnifier">
    <div className="trmrk-action-controls">
      <IconButton className="trmrk-icon-btn"><CancelIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><MatUIIcon iconName="line_start" /></IconButton>
      <IconButton className="trmrk-icon-btn"><MatUIIcon iconName="line_end" /></IconButton>
      <IconButton className="trmrk-icon-btn"><ClearIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><ContentCopyIcon /></IconButton>
    </div>
    <div className="trmrk-action-controls">
      <IconButton className="trmrk-icon-btn"><KeyboardDoubleArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardArrowRightIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardDoubleArrowRightIcon /></IconButton>
    </div>
    <div className="trmrk-main-content trmrk-scrollableX">
      <div className="trmrk-text">{props.text}</div>
    </div>
  </div>);
}
