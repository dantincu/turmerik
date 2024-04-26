import React from "react";

import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

export interface TrmrkEditableTextLineMagnifierProps {
  text: string;
}

export default function TrmrkEditableTextLineMagnifier(
  props: TrmrkEditableTextLineMagnifierProps
) {
  return (<div className="trmrk-text-magnifier trmrk-editable-text-magnifier">
    <div className="trmrk-action-controls">
      <IconButton className="trmrk-icon-btn"><CancelIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><DoneIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><ContentCopyIcon /></IconButton>
    </div>
    <div className="trmrk-action-controls">
      <IconButton className="trmrk-icon-btn"><KeyboardDoubleArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardArrowRightIcon /></IconButton>
      <IconButton className="trmrk-icon-btn"><KeyboardDoubleArrowRightIcon /></IconButton>
    </div>
    <div className="trmrk-main-content">
      <Input value={props.text} fullWidth className="trmrk-textbox" />
    </div>
  </div>);
}
