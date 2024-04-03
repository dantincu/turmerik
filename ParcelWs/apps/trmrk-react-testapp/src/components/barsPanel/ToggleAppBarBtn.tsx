import React from "react";

import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export interface ToggleAppBarBtnProps {
  showAppBar: boolean;
  appBarToggled: (showAppBar: boolean) => void;
  togglesHeader: boolean | null;
}

export default function ToggleAppBarBtn(
  props: ToggleAppBarBtnProps
) {
  const handleClick = () => {
    props.appBarToggled(!props.showAppBar);
  }

  let btnProps: { top?: string, bottom?: string } = {};

  switch (props.togglesHeader) {
    case true:
      btnProps.top = "0px";
      break;
    case false:
      btnProps.bottom = "0px";
      break;
  }

  return (<IconButton onClick={handleClick} sx={{
      ...btnProps,
      position: "fixed", right: "0px", color: "white", zIndex: 1101 }}
      className={ [ "trmrk-icon-btn trmrk-app-bar-toggle-icon", props.showAppBar ?
        "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" ].join(" ") }>
      { (props.showAppBar === props.togglesHeader) ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>);
}
