import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import IconButton from "@mui/material/IconButton";

import AppThemeMenu from "./AppThemeMenu";
import { AppBarData, AppPagesData } from "../../services/appData";
import { setAppSettingsMenuIsOpen, setAppThemeMenuIsOpen } from "../../store/appBarDataSlice";
import { getAppThemeCssClassName } from "../../services/utils";

export default function AppSettingsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appBarData = useSelector<{ appBarData: AppBarData }, AppBarData>(state => state.appBarData);
  const appPages = useSelector<{ appPages: AppPagesData }, AppPagesData>(state => state.appPages);
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
    <Menu className={["trmrk-app-settings-menu", getAppThemeCssClassName(appPages)].join(" ")}
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
