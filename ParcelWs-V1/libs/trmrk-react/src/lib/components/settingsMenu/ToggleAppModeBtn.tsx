import React from "react";

import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

export interface ToggleAppModeBtnProps {
  isCompactMode: boolean;
  compactModeToggled: (isCompactMode: boolean) => void;
}

export default function ToggleAppModeBtn(
  props: ToggleAppModeBtnProps
) {
  const handleClick = () => {
    props.compactModeToggled(!props.isCompactMode);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon className="trmrk-icon-btn">{ props.isCompactMode ? <ToggleOnIcon /> : <ToggleOffIcon /> }</ListItemIcon>
      <ListItemText>{ props.isCompactMode ? "Compact Mode" : "Full Mode" }</ListItemText>
    </MenuItem>);
}
