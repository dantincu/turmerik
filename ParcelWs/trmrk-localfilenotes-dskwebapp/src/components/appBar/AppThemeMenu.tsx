import React from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import ToggleAppModeBtn from "./ToggleAppModeBtn";
import IconButton from "@mui/material/IconButton";

import { AppDataContext, getAppThemeCssClassName, AppBarDataContext } from "../../app/AppContext";


export default function AppThemeMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);

  const handleAppThemeMenuClose = () => {
    appBarData.setAppThemeMenuIsOpen(false);
  };

  return (<Menu className={["trmrk-app-theme-menu", getAppThemeCssClassName(appData)].join(" ")}
        open={appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen}
        onClose={handleAppThemeMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <ToggleAppModeBtn />
        <ToggleDarkModeBtn />
      </MenuList>
    </Menu>);
};
