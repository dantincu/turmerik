import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

import { setAppOptionsMenuIsOpen } from "../../store/appDataSlice";
import { AppData } from "../../services/appData";
import { getAppThemeCssClassName } from "../../services/utils";

export default function VideoViewerAppBarOptionsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appPages = useSelector((state: { appData: AppData }) => state.appData.appPages);
  const appBarData = useSelector((state: { appData: AppData }) => state.appData.appBarData);
  const dispatch = useDispatch();

  const appOptionsMenuOpts = appBarData.appOptionsMenuOpts;

  const handleMenuClose = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  };

  const handleRefreshClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  const handleViewOpenItemsClick = () => {
    dispatch(setAppOptionsMenuIsOpen(false));
  }

  return (
    <Menu className={["trmrk-app-options-menu", getAppThemeCssClassName(appPages)].join(" ")}
      open={appOptionsMenuOpts.isOpen}
      onClose={handleMenuClose}
      anchorEl={menuAnchorEl}>
      <MenuList dense>
        <MenuItem onClick={handleRefreshClick}>Refresh <IconButton sx={{ float: "right" }}>
          <RefreshIcon /></IconButton></MenuItem>
        <MenuItem onClick={handleViewOpenItemsClick}>View Open Items</MenuItem>
      </MenuList>
    </Menu>);
}
