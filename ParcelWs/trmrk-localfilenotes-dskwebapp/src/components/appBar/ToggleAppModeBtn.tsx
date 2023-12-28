import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { setIsCompactMode, setAppThemeMenuIsOpen, setAppSettingsMenuIsOpen } from "../../store/appDataSlice";
import { AppData, AppPagesData } from "../../services/appData";

import { localStorageKeys, jsonBool } from "../../services/utils";

import './styles.scss';

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn() {
  const appPages = useSelector<{ appData: AppData }, AppPagesData>(state => state.appData.appPages);
  const dispatch = useDispatch();

  const handleClick = () => {
    const switchToCompactMode = !appPages.isCompactMode;
    dispatch(setIsCompactMode(switchToCompactMode));
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appIsCompactMode, switchToCompactMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick} className="trmrk-app-mode-menu-item">
      <ColorThemeLabel>{ appPages.isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { appPages.isCompactMode ? <ToggleOnIcon className="trmrk-icon-toggle-on" /> : <ToggleOffIcon className="trmrk-icon-toggle-off" /> }
    </MenuItem>);
}
