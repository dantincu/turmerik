import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import trmrk from "trmrk";
import { currentAppTheme, getAppTheme } from "../../app-theme/core";
import { localStorageKeys } from "../../utils";

import { AppDataSliceOps } from "../../store/appDataSlice";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleDarkModeBtn({
    appDataSliceOps,
    clicked
  }: {
    appDataSliceOps: AppDataSliceOps,
    clicked?: (() => void) | null | undefined
  }) {
  const isDarkMode = useSelector(appDataSliceOps.selectors.getIsDarkMode);
  const dispatch = useDispatch();
  
  const onClick = clicked ?? (() => {});

  const handleClick = () => {
    const switchToDarkMode = !isDarkMode;

    currentAppTheme.value = getAppTheme({
      isDarkMode: switchToDarkMode
    });

    dispatch(appDataSliceOps.actions.setIsDarkMode(switchToDarkMode));
    localStorage.setItem(localStorageKeys.appThemeIsDarkMode, switchToDarkMode ? trmrk.jsonBool.true : trmrk.jsonBool.false);
    onClick();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
      { isDarkMode ? <DarkModeIcon /> :  <LightModeIcon /> }
    </MenuItem>);
}
