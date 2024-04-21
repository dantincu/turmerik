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

  return (<IconButton onClick={handleClick}
      className={ [ "trmrk-icon-btn trmrk-app-bar-toggle-icon", props.showAppBar ?
        "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon",
        props.togglesHeader ? "trmrk-toggles-header" : "trmrk-toggles-footer" ].join(" ") }>
      { (props.showAppBar === props.togglesHeader) ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>);
}
