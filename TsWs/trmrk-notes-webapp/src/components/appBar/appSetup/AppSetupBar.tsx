import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';

import AppBar from "@mui/material/AppBar";

import { AppData, AppBarData } from "../../../services/appData";
import { currentAppTheme } from "../../../services/app-theme/app-theme";
import { setAppSettingsMenuIsOpen } from "../../../store/appBarDataSlice";

import ToggleDarkModeBtn from "../topBar/ToggleDarkModeBtn";

export default function AppSetupBar({
  setAppHeaderEl
  }: {
    setAppHeaderEl: (appHeaderElem: HTMLDivElement) => void;
  }) {
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const dispatch = useDispatch();

  const menuAnchorEl = useRef<HTMLButtonElement | null>(null);
  const appHeaderEl = useRef<HTMLDivElement>(null);
  
  const handleSettingsBtnClick = () => {
    dispatch(setAppSettingsMenuIsOpen(true));
  };

  const handleAppThemeMenuClose = () => {
    dispatch(setAppSettingsMenuIsOpen(false));
  }

  useEffect(() => {
    setAppHeaderEl(appHeaderEl.current!);
  }, [] );

  return (<AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-setup-header" ].join(" ")} ref={appHeaderEl}>
      <Button onClick={handleSettingsBtnClick} className="trmrk-main-icon-btn" ref={menuAnchorEl}>
        <MenuIcon />
      </Button>
      <Menu className={["trmrk-app-theme-menu", currentAppTheme.value.cssClassName].join(" ")}
        open={appBar.appSettingsMenuOpts.isOpen}
        onClose={handleAppThemeMenuClose}
        anchorEl={menuAnchorEl.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
        <MenuList dense>
          <ToggleDarkModeBtn />
        </MenuList>
      </Menu>
    </AppBar>);
}
