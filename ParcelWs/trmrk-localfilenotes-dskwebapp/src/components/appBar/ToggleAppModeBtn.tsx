import React, { useEffect, useState } from "react";

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { AppDataContext, AppBarDataContext } from "../../app/AppContext";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn() {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const switchToCompactMode = !appData.isCompactMode;
    appData.setIsCompactMode(switchToCompactMode);

    appBarData.setAppThemeMenuIsOpen(false);
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-mode-menu-item">
      <ColorThemeLabel>{ appData.isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { appData.isCompactMode ? <ToggleOnIcon className="trmrk-icon-toggle-on" /> : <ToggleOffIcon className="trmrk-icon-toggle-off" /> }
    </MenuItem>);
}
