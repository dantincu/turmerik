import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftOutlined';
import ToggleDarkModeBtn from "trmrk-react/src/components/appBar/ToggleDarkModeBtn";
import ToggleAppModeBtn from "trmrk-react/src/components/appBar/ToggleAppModeBtn";
import IconButton from "@mui/material/IconButton";

import { getAppearenceMenuIsOpen, setAppSettingsMenuIsOpen, setAppearenceMenuIsOpen } from "../../../store/appBarDataSlice";
import { currentAppTheme } from "../../../services/app-theme/app-theme";

export default function AppearenceMenu({
    menuAnchorEl
  }: {
    menuAnchorEl: HTMLElement
  }) {
  const appearenceMenuIsOpen = useSelector(getAppearenceMenuIsOpen);
  const dispatch = useDispatch();

  const handleAppThemeMenuClose = () => {
    dispatch(setAppSettingsMenuIsOpen(false));
  };

  const handleCloseAppThemeMenuClick = () => {
    dispatch(setAppearenceMenuIsOpen(false));
  }

  return (<Menu className={["trmrk-appearence-menu", currentAppTheme.value.cssClassName].join(" ")}
        open={appearenceMenuIsOpen}
        onClose={handleAppThemeMenuClose}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorPosition={ { top: 0, left: 100 } }>
      <MenuList dense>
        <IconButton sx={{ float: "left" }} onClick={handleCloseAppThemeMenuClick}><ArrowLeftIcon /></IconButton>
        <ToggleAppModeBtn />
        <ToggleDarkModeBtn />
      </MenuList>
    </Menu>);
};
