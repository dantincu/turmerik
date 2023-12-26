import React, { useEffect, useState } from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

import { AppDataContext, AppBarDataContext, getAppThemeCssClassName } from "../../app/AppContext";

export default function TextFileEditorAppBarOptionsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);
  const appOptionsMenuOpts = appBarData.appOptionsMenuOpts;

  const handleMenuClose = () => {
    appBarData.setAppOptionsMenuIsOpen(false);
  };

  const handleRefreshClick = () => {
    appBarData.setAppOptionsMenuIsOpen(false);
  }

  const handleViewOpenItemsClick = () => {
    appBarData.setAppOptionsMenuIsOpen(false);
  }

  return (
    <Menu className={["trmrk-app-options-menu", getAppThemeCssClassName(appData)].join(" ")}
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
