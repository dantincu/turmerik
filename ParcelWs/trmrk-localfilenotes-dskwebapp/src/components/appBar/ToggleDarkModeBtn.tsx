import React, { useEffect, useState } from "react";

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { AppBarArgs } from "./AppBarArgs";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn({
  args,
  setAnchorEl
}: {
  args: AppBarArgs,
  setAnchorEl: (anchorEl: HTMLElement | null) => void,
}) {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const switchToDarkMode = !args.appTheme.isDark;
    args.darkModeToggled(switchToDarkMode);
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-theme-mode-menu-item">
      <ColorThemeLabel>{ args.appTheme.isDark ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { args.appTheme.isDark ? <LightModeIcon /> : <DarkModeIcon /> }
    </MenuItem>);
}
