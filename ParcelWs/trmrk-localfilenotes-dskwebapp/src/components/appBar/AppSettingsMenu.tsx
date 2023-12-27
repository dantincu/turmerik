import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import IconButton from "@mui/material/IconButton";

import AppThemeMenu from "./AppThemeMenu";
import { getAppTheme } from "../../services/app-theme/app-theme";
import { AppData } from "../../services/appData";
import { setAppSettingsMenuIsOpen, setAppThemeMenuIsOpen } from "../../store/appDataSlice";
import { getAppThemeCssClassName } from "../../services/utils";

export default function AppSettingsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();

  const appBarData = appData.appBarData;
  const appBarOpts = appBarData.appBarOpts;

  const appTheme = getAppTheme({
    isDarkMode: appData.isDarkMode
  });

  const [ appThemeMenuIconBtnEl, setAppThemeMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);

  const handleSettingsMenuClose = () => {
    dispatch(setAppSettingsMenuIsOpen(false));
  };

  const handleAppThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppThemeMenuIconBtnEl(event.currentTarget);
    dispatch(setAppThemeMenuIsOpen(true));
  };

  return (<>
    <Menu className={["trmrk-app-settings-menu", getAppThemeCssClassName(appData)].join(" ")}
      open={appBarData.appSettingsMenuOpts.isOpen}
      onClose={handleSettingsMenuClose}
      anchorEl={menuAnchorEl}>
      <MenuList dense>
        <MenuItem onClick={handleAppThemeClick}>App Theme
          <IconButton><ArrowRightIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
    <AppThemeMenu menuAnchorEl={appThemeMenuIconBtnEl!} />
  </>);
}
