import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

import { AppBarData, AppData } from "../../../services/appData";
import { setAppOptionsMenuIsOpen, setShowTabsNavArrows } from "../../../store/appBarDataSlice";
import { currentAppTheme } from "../../../services/app-theme/app-theme";

export default function AppOptionsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const handleAppOptionsMenuClose = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  };

  const handleRefreshClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  const handleToggleShowTabsNavigationArrowsClick = () => {
    dispatch(setShowTabsNavArrows(!appBar.showTabsNavArrows));
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  const handleViewOpenTabsClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  return (<Menu className={["trmrk-app-theme-menu", currentAppTheme.value.cssClassName].join(" ")}
        open={appBar.appOptionsMenuOpts.isOpen}
        onClose={handleAppOptionsMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <MenuItem onClick={handleRefreshClick}>Refresh <IconButton sx={{ float: "right" }}>
          <RefreshIcon /></IconButton></MenuItem>
        <MenuItem onClick={handleToggleShowTabsNavigationArrowsClick}>
          { appBar.showTabsNavArrows ? "Hide" : "Show" } Tabs Navigation Arrows</MenuItem>
        <MenuItem onClick={handleViewOpenTabsClick}>View Open Tabs</MenuItem>
      </MenuList>
    </Menu>);
};
