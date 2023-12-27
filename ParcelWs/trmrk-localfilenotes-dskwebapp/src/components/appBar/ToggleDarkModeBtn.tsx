import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { setIsDarkMode, setAppThemeMenuIsOpen } from "../../store/appDataSlice";
import { AppData } from "../../services/appData";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn() {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    const switchToDarkMode = !appData.isDarkMode;
    dispatch(setIsDarkMode(switchToDarkMode));
    dispatch(setAppThemeMenuIsOpen(false));
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-theme-mode-menu-item">
      <ColorThemeLabel>{ appData.isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { appData.isDarkMode ? <LightModeIcon /> : <DarkModeIcon /> }
    </MenuItem>);
}
