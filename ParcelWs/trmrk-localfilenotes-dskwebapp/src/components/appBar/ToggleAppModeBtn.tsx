import React, { useEffect, useState } from "react";

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { AppBarArgs } from "./AppBarArgs";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn({
  args,
  setAnchorEl
}: {
  args: AppBarArgs,
  setAnchorEl: (anchorEl: HTMLElement | null) => void,
}) {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const switchToCompactMode = !args.isCompactMode;
    args.appModeToggled(switchToCompactMode);
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-mode-menu-item">
      <ColorThemeLabel>{ args.isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { args.isCompactMode ? <ToggleOnIcon className="trmrk-icon-toggle-on" /> : <ToggleOffIcon className="trmrk-icon-toggle-off" /> }
    </MenuItem>);
}
