import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { AppDataSliceOps } from "../../store/appDataSlice";

export default function ToggleAppBarButton({
    appDataSliceOps,
    onToggled
  }: {
    appDataSliceOps: AppDataSliceOps,
    onToggled: () => void
  }) {
  const showAppBar = useSelector(appDataSliceOps.selectors.getShowAppBar);
  const dispatch = useDispatch();
    
  const onOnAppBarToggled = () => {
    dispatch(appDataSliceOps.actions.setShowAppBar(!showAppBar));
    onToggled();
  }

  return (<IconButton onClick={onOnAppBarToggled} sx={{
      position: "fixed", top: "0px", right: "0px", zIndex: 1101 }}
      className={ [ "trmrk-icon-btn-main trmrk-app-bar-toggle-icon", showAppBar ?
        "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" ].join(" ") }>
      { showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>);
}
