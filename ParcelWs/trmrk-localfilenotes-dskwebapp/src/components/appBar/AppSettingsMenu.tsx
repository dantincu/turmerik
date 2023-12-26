import React from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import ToggleAppModeBtn from "./ToggleAppModeBtn";
import IconButton from "@mui/material/IconButton";

import { AppDataContext, getAppThemeCssClassName, AppBarDataContext } from "../../app/AppContext";
import AppThemeMenu from "./AppThemeMenu";

export default function AppSettingsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);

  const [ appThemeMenuIconBtnEl, setAppThemeMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);

  const handleSettingsMenuClose = () => {
    appBarData.setAppSettingsMenuIsOpen(false);
  };

  const handleAppThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppThemeMenuIconBtnEl(event.currentTarget);
    appBarData.setAppThemeMenuIsOpen(true);
  };

  return (<>
    <Menu className={["trmrk-app-settings-menu", getAppThemeCssClassName(appData)].join(" ")}
      open={appBarData.appSettingsMenuOpts.isOpen}
      onClose={handleSettingsMenuClose}
      anchorEl={menuAnchorEl}>
      <MenuList dense>
        <MenuItem onClick={handleAppThemeClick}>App Theme <IconButton sx={{ float: "right" }}>
          <ArrowRightIcon /></IconButton></MenuItem>
      </MenuList>
    </Menu>
    <AppThemeMenu menuAnchorEl={appThemeMenuIconBtnEl!} />
  </>);
}
