import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { setAppSettingsMenuIsOpen } from "../../../store/appBarDataSlice";
import { setIsDarkMode, getIsDarkMode } from "../../../store/appDataSlice";
import { AppData } from "../../../services/appData";

import { getShowAppBar, setShowAppBar } from "../../../store/appDataSlice";
import { getAppTheme, currentAppTheme } from "../../../services/app-theme/app-theme";
import { localStorageKeys, jsonBool } from "../../../services/utils";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn() {
  const isDarkMode = useSelector(getIsDarkMode);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    const switchToDarkMode = !isDarkMode;

    currentAppTheme.value = getAppTheme({
      isDarkMode: switchToDarkMode
    });

    dispatch(setIsDarkMode(switchToDarkMode));
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appThemeIsDarkMode, switchToDarkMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { isDarkMode ? <DarkModeIcon /> :  <LightModeIcon /> }
    </MenuItem>);
}
