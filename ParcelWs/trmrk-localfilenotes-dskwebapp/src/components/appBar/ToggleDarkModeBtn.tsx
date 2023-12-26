import React, { useEffect, useState } from "react";

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { AppDataContext, AppBarDataContext } from "../../app/AppContext";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn() {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const switchToDarkMode = !appData.isDarkMode;
    appData.setIsDarkMode(switchToDarkMode);

    if (appBarData.setAppThemeMenuIsOpen) {
      appBarData.setAppThemeMenuIsOpen(false);
    }
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-theme-mode-menu-item">
      <ColorThemeLabel>{ appData.isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { appData.isDarkMode ? <LightModeIcon /> : <DarkModeIcon /> }
    </MenuItem>);
}
