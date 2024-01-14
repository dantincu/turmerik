import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { AppData } from "../../services/appData";
import { setShowAppBar } from "../../store/appDataSlice";
import { FloatingBarTopOffset } from "../../services/htmlDoc/floatingBarTopOffsetUpdater";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export default function ToggleAppBarButton({
    offset,
    onUpdateFloatingBarTopOffset
  }: {
    offset: FloatingBarTopOffset,
    onUpdateFloatingBarTopOffset: () => void
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();
    
  const onOnAppBarToggled = () => {
    const showAppBar = !appData.showAppBar;
    dispatch(setShowAppBar(showAppBar));

    offset.showHeader = showAppBar;
    onUpdateFloatingBarTopOffset();
  }

  return (<IconButton onClick={onOnAppBarToggled} sx={{
      position: "fixed", top: "0px", right: "0px", zIndex: 1101 }}
      className={ [ "trmrk-icon-btn-main trmrk-app-bar-toggle-icon", appData.showAppBar ?
        "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" ].join(" ") }>
      { appData.showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>);
}
