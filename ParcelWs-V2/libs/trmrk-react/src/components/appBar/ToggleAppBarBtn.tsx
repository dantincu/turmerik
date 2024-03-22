import React from "react";

import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export interface ToggleAppBarBtnProps {
  showAppBar: boolean;
  appBarToggled: (showAppBar: boolean) => void;
}

export default function ToggleAppBarBtn(
  props: ToggleAppBarBtnProps
) {
  const handleClick = () => {
    props.appBarToggled(!props.showAppBar);
  }

  return (<IconButton onClick={handleClick} sx={{
      position: "fixed", top: "0px", right: "0px", zIndex: 1101 }}
      className={ [ "trmrk-icon-btn trmrk-ftb-bar-toggle-icon", props.showAppBar ?
        "trmrk-ftb-bar-toggle-hide-icon" : "trmrk-ftb-bar-toggle-show-icon" ].join(" ") }>
      { props.showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>);
}
