import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { setAppSettingsMenuIsOpen } from "../../../store/appBarDataSlice";
import { getIsCompactMode, setIsCompactMode } from "../../../store/appDataSlice";

import { localStorageKeys, jsonBool, getAppModeCssClassName, appModeCssClass } from "../../../services/utils";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn() {
  const isCompactMode = useSelector(getIsCompactMode);
  const dispatch = useDispatch();

  const handleClick = () => {
    const switchToCompactMode = !isCompactMode;
    dispatch(setIsCompactMode(switchToCompactMode));
    appModeCssClass.value = getAppModeCssClassName(isCompactMode);
    dispatch(setAppSettingsMenuIsOpen(false));
    localStorage.setItem(localStorageKeys.appIsCompactMode, switchToCompactMode ? jsonBool.true : jsonBool.false);
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { isCompactMode ? <ToggleOnIcon /> : <ToggleOffIcon /> }
    </MenuItem>);
}
