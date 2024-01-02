import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import IconButton from "@mui/material/IconButton";

import AppThemeMenu from "./AppThemeMenu";
import { AppBarData, AppData } from "../../services/appData";
import { setAppSettingsMenuIsOpen, setAppThemeMenuIsOpen } from "../../store/appBarDataSlice";
import { getAppThemeCssClassName } from "../../services/utils";

export default function AppSettingsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBarData = useSelector((state: { appBarData: AppBarData }) => state.appBarData);
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

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
