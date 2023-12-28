import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftOutlined';
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import ToggleAppModeBtn from "./ToggleAppModeBtn";
import IconButton from "@mui/material/IconButton";

import { AppBarData, AppPagesData } from "../../services/appData";
import { setAppSettingsMenuIsOpen, setAppThemeMenuIsOpen } from "../../store/appBarDataSlice";
import { getAppThemeCssClassName } from "../../services/utils";

export default function AppThemeMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBarData = useSelector<{ appBarData: AppBarData }, AppBarData>(state => state.appBarData);
  const appPages = useSelector<{ appPages: AppPagesData }, AppPagesData>(state => state.appPages);
  const dispatch = useDispatch();

  const handleAppThemeMenuClose = () => {
    dispatch(setAppSettingsMenuIsOpen(false));
  };

  const handleCloseAppThemeMenuClick = () => {
    dispatch(setAppThemeMenuIsOpen(false));
  }

  return (<Menu className={["trmrk-app-theme-menu", getAppThemeCssClassName(appPages)].join(" ")}
        open={appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen}
        onClose={handleAppThemeMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <IconButton sx={{ float: "left" }} onClick={handleCloseAppThemeMenuClick}><ArrowLeftIcon /></IconButton><ToggleAppModeBtn />
        <ToggleDarkModeBtn />
      </MenuList>
    </Menu>);
};
