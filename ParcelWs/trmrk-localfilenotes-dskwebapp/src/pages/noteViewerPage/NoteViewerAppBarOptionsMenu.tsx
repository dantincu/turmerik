import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

import { setAppOptionsMenuIsOpen } from "../../store/appBarDataSlice";
import { AppBarData, AppPagesData } from "../../services/appData";
import { getAppThemeCssClassName } from "../../services/utils";

export default function NoteViewerAppBarOptionsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const dispatch = useDispatch();

  const appOptionsMenuOpts = appBar.appOptionsMenuOpts;

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
