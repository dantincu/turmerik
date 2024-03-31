import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftOutlined';
import IconButton from "@mui/material/IconButton";

import ToggleDarkModeBtn from "../ToggleDarkModeBtn";
import ToggleAppModeBtn from "../ToggleAppModeBtn";
import { AppDataSliceOps } from "../../../store/appDataSlice";
import { AppBarDataSliceOps } from "../../../store/appBarDataSlice";
import { currentAppTheme } from "../../../app-theme/core";

export default function AppearenceMenu({
    appDataSliceOps,
    appBarDataSlice,
    menuAnchorEl,
    otherMenuItems
  }: {
    appDataSliceOps: AppDataSliceOps,
    appBarDataSlice: AppBarDataSliceOps,
    menuAnchorEl: HTMLElement,
    otherMenuItems?: React.ReactNode | null | undefined
  }) {
  const appearenceMenuIsOpen = useSelector(appBarDataSlice.selectors.getAppearenceMenuIsOpen);
  const dispatch = useDispatch();

  const handleAppThemeMenuClose = () => {
    dispatch(appBarDataSlice.actions.setAppSettingsMenuIsOpen(false));
  };

  const handleCloseAppThemeMenuClick = () => {
    dispatch(appBarDataSlice.actions.setAppearenceMenuIsOpen(false));
  }

  return (<Menu className={["trmrk-appearence-menu", currentAppTheme.value.cssClassName].join(" ")}
        open={appearenceMenuIsOpen}
        onClose={handleAppThemeMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <IconButton sx={{ float: "left" }} onClick={handleCloseAppThemeMenuClick}><ArrowLeftIcon /></IconButton>
        <ToggleAppModeBtn appDataSliceOps={appDataSliceOps} />
        <ToggleDarkModeBtn appDataSliceOps={appDataSliceOps} />
        { otherMenuItems }
      </MenuList>
    </Menu>);
};
