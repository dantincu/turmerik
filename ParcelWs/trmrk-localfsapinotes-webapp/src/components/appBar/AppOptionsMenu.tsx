import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

import { AppBarData, AppData } from "../../services/appData";
import { setAppOptionsMenuIsOpen } from "../../store/appBarDataSlice";
import { getAppThemeCssClassName } from "../../services/utils";

export default function AppOptionsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBarData = useSelector((state: { appBarData: AppBarData }) => state.appBarData);
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const handleAppOptionsMenuClose = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  };

  const handleRefreshClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  const handleViewOpenItemsClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  return (<Menu className={["trmrk-app-theme-menu", getAppThemeCssClassName(appData)].join(" ")}
        open={appBarData.appOptionsMenuOpts.isOpen}
        onClose={handleAppOptionsMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <MenuItem onClick={handleRefreshClick}>Refresh <IconButton sx={{ float: "right" }}>
          <RefreshIcon /></IconButton></MenuItem>
        <MenuItem onClick={handleViewOpenItemsClick}>View Open Items</MenuItem>
      </MenuList>
    </Menu>);
};
