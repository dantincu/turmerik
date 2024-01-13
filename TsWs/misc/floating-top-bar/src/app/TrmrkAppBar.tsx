import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled';

import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { AppData, AppBarData } from "../services/appData";
import { setShowAppBar, setIsCompactMode } from "../store/appDataSlice";
import { setAppOptionsMenuIsOpen } from "../store/appBarDataSlice";

export default function TrmrkAppBar({
    appHeaderEl
  }: {
    appHeaderEl: React.MutableRefObject<HTMLDivElement | null>
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const dispatch = useDispatch();
  const [ optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);

  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppOptionsMenuIsOpen(true));
  };

  const handleAppOptionsMenuClose = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  };

  const handleToggleAppModeClick = () => {
    const switchToCompactMode = !appData.isCompactMode;
    dispatch(setIsCompactMode(switchToCompactMode));
    dispatch(setAppOptionsMenuIsOpen(false));
  };

  const AppModeLabel = styled.span`
    padding-right: 1em
  `;

  return (<AppBar sx={{ position: "relative", height: "5em" }} className={["trmrk-app-header" ].join(" ")} ref={appHeaderEl}>
    <Box className="trmrk-top-bar" sx={{ marginRight: "2.5em" }}>
      <IconButton sx={{ float: "right", color: "white" }} className="trmrk-icon-btn-main"
        onClick={handleOptionsClick}>
        <MoreVertIcon /></IconButton>
    </Box>
    <Menu className={["trmrk-app-theme-menu"].join(" ")}
        open={appBar.appOptionsMenuOpts.isOpen}
        onClose={handleAppOptionsMenuClose}
        anchorEl={optionsMenuIconBtnEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <MenuItem onClick={handleToggleAppModeClick}>
          <AppModeLabel>{ appData.isCompactMode ? "Compact Mode" : "Full Mode" }</AppModeLabel>
          { appData.isCompactMode ? <ToggleOnIcon /> : <ToggleOffIcon /> }
        </MenuItem>
      </MenuList>
    </Menu>
  </AppBar>);
}
