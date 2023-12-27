import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { setIsCompactMode, setAppThemeMenuIsOpen } from "../../store/appDataSlice";
import { AppData } from "../../services/appData";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn() {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();

  const handleClick = () => {
    const switchToCompactMode = !appData.isCompactMode;
    dispatch(setIsCompactMode(switchToCompactMode));
    dispatch(setAppThemeMenuIsOpen(false));
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-mode-menu-item">
      <ColorThemeLabel>{ appData.isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { appData.isCompactMode ? <ToggleOnIcon className="trmrk-icon-toggle-on" /> : <ToggleOffIcon className="trmrk-icon-toggle-off" /> }
    </MenuItem>);
}
