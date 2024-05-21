import React from "react";

import IconButton from "@mui/material/IconButton";
import GridOnIcon from "@mui/icons-material/GridOn";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export interface TextCaretInputPositionerDefaultViewProps {
  nextViewClicked: () => void;
}

export default function TextCaretInputPositionerDefaultView(
  props: TextCaretInputPositionerDefaultViewProps
) {
  const onNextViewIconBtnClick = () => {
    props.nextViewClicked();
  }

  return (<div className="trmrk-view trmrk-default-view">
    <IconButton className="trmrk-icon-btn trmrk-next-view-icon-btn"
      onMouseDown={onNextViewIconBtnClick}
      onTouchEnd={onNextViewIconBtnClick}><GridOnIcon /></IconButton>
    
    <IconButton className="trmrk-icon-btn trmrk-jump-prev-line-btn">
      <ArrowDropUpIcon className="trmrk-arrow-drop-up-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-word-btn">
      <SkipPreviousIcon className="trmrk-skip-previous-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-prev-char-btn">
      <ArrowLeftIcon className="trmrk-arrow-left-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-char-btn">
      <ArrowRightIcon className="trmrk-arrow-right-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-word-btn">
      <SkipNextIcon className="trmrk-skip-next-icon" /></IconButton>

    <IconButton className="trmrk-icon-btn trmrk-jump-next-line-btn">
      <ArrowDropDownIcon className="trmrk-arrow-drop-down-icon" /></IconButton>
  </div>);
}
