import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { setAppSettingsMenuIsOpen } from "../../store/appBarDataSlice";
import { setIsCompactMode } from "../../store/appDataSlice";
import { AppData } from "../../services/appData";

import { localStorageKeys, jsonBool } from "../../services/utils";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const handleClick = () => {
    const switchToCompactMode = !appData.isCompactMode;
    dispatch(setIsCompactMode(switchToCompactMode));
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appIsCompactMode, switchToCompactMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ appData.isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { appData.isCompactMode ? <ToggleOnIcon /> : <ToggleOffIcon /> }
    </MenuItem>);
}
