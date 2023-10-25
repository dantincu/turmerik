import React, { useEffect, useState } from "react";

import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { AppBarArgs } from "./AppBarArgs";

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
    args.darModeToggled(switchToDarkMode);
  };

  return (
    <MenuItem onClick={handleClick}>
      { args.appTheme.isDark ? <LightModeIcon /> : <DarkModeIcon /> }
    </MenuItem>);
}
