import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import IconButton from "@mui/material/IconButton";

import AppearenceMenu from "./AppearenceMenu";
import { AppBarData, AppData } from "../../../services/appData";
import { getAppSettingsMenuIsOpen, setAppSettingsMenuIsOpen, setAppearenceMenuIsOpen } from "../../../store/appBarDataSlice";
import { currentAppTheme } from "../../../services/app-theme/app-theme";

export default function AppSettingsMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appSettingsMenuIsOpen = useSelector(getAppSettingsMenuIsOpen);
  const dispatch = useDispatch();

  const [ appearenceMenuIconBtnEl, setAppearenceMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);

  const handleSettingsMenuClose = () => {
    dispatch(setAppSettingsMenuIsOpen(false));
  };

  const handleAppearenceClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppearenceMenuIconBtnEl(event.currentTarget);
    dispatch(setAppearenceMenuIsOpen(true));
  };

  return (<>
    <Menu className={["trmrk-app-settings-menu", currentAppTheme.value.cssClassName].join(" ")}
      open={appSettingsMenuIsOpen}
      onClose={handleSettingsMenuClose}
      anchorEl={menuAnchorEl}>
      <MenuList dense>
        <MenuItem onClick={handleAppearenceClick}>Appearence
          <IconButton><ArrowRightIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
    <AppearenceMenu menuAnchorEl={appearenceMenuIconBtnEl!} />
  </>);
}
