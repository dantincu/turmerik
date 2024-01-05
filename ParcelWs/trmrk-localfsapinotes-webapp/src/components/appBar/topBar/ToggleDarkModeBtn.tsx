import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { setAppSettingsMenuIsOpen } from "../../../store/appBarDataSlice";
import { setIsDarkMode } from "../../../store/appDataSlice";
import { AppData } from "../../../services/appData";

import { localStorageKeys, jsonBool } from "../../../services/utils";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    const switchToDarkMode = !appData.isDarkMode;
    dispatch(setIsDarkMode(switchToDarkMode));
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appThemeIsDarkMode, switchToDarkMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ appData.isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { appData.isDarkMode ? <DarkModeIcon /> :  <LightModeIcon /> }
    </MenuItem>);
}
