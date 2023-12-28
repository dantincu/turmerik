import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { setIsDarkMode, setAppThemeMenuIsOpen, setAppSettingsMenuIsOpen } from "../../store/appDataSlice";
import { AppData } from "../../services/appData";

import { localStorageKeys, jsonBool } from "../../services/utils";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn() {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    const switchToDarkMode = !appData.appPages.isDarkMode;
    dispatch(setIsDarkMode(switchToDarkMode));
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appThemeIsDarkMode, switchToDarkMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-theme-mode-menu-item">
      <ColorThemeLabel>{ appData.appPages.isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { appData.appPages.isDarkMode ? <LightModeIcon /> : <DarkModeIcon /> }
    </MenuItem>);
}
