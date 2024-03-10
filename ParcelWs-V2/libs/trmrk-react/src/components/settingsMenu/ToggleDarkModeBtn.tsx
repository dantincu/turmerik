import React from "react";

import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export interface ToggleDarkModeBtnProps {
  isDarkMode: boolean;
  darkModeToggled: (isDarkMode: boolean) => void;
}

export default function ToggleDarkModeBtn(
  props: ToggleDarkModeBtnProps
) {
  const handleClick = () => {
      props.darkModeToggled(!props.isDarkMode);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon className="trmrk-icon-btn">{ props.isDarkMode ? <DarkModeIcon /> :  <LightModeIcon /> }</ListItemIcon>
      <ListItemText>{ props.isDarkMode ? "Dark Mode" : "Light Mode" }</ListItemText>
    </MenuItem>);
}
