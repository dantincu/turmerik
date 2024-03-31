import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';
import IconButton from "@mui/material/IconButton";

import AppearenceMenu from "./AppearenceMenu";
import { AppDataSliceOps } from "../../../store/appDataSlice";
import { AppBarDataSliceOps } from "../../../store/appBarDataSlice";
import { currentAppTheme } from "../../../app-theme/core";

export default function AppSettingsMenu({
    children,
    appDataSliceOps,
    appBarDataSliceOps,
    menuAnchorEl,
    appearenceOtherMenuItems
  }: {
    children?: React.ReactNode | null | undefined,
    appDataSliceOps: AppDataSliceOps,
    appBarDataSliceOps: AppBarDataSliceOps,
    menuAnchorEl: HTMLElement,
    appearenceOtherMenuItems?: React.ReactNode | null | undefined
  }) {
  const appSettingsMenuIsOpen = useSelector(appBarDataSliceOps.selectors.getAppSettingsMenuIsOpen);
  const dispatch = useDispatch();

  const [ appearenceMenuIconBtnEl, setAppearenceMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);

  const handleSettingsMenuClose = () => {
    dispatch(appBarDataSliceOps.actions.setAppSettingsMenuIsOpen(false));
  };

  const handleAppearenceClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppearenceMenuIconBtnEl(event.currentTarget);
    dispatch(appBarDataSliceOps.actions.setAppearenceMenuIsOpen(true));
  };

  return (<>
    <Menu className={["trmrk-app-settings-menu", currentAppTheme.value.cssClassName].join(" ")}
      open={appSettingsMenuIsOpen}
      onClose={handleSettingsMenuClose}
      anchorEl={menuAnchorEl}>
      <MenuList dense>
        { children }
        <MenuItem onClick={handleAppearenceClick}>Appearence
          <IconButton><ArrowRightIcon /></IconButton>
        </MenuItem>
      </MenuList>
    </Menu>
    <AppearenceMenu
      appDataSliceOps={appDataSliceOps}
      appBarDataSlice={appBarDataSliceOps}
      menuAnchorEl={appearenceMenuIconBtnEl!}
      otherMenuItems={appearenceOtherMenuItems} />
  </>);
}
