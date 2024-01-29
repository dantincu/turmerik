import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import trmrk from "trmrk";

import { localStorageKeys, appModeCssClass, getAppModeCssClassName } from "../../utils";

import { AppDataSliceOps } from "../../store/appDataSlice";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function ToggleAppModeBtn({
    appDataSliceOps,
    clicked,
  }: {
    appDataSliceOps: AppDataSliceOps,
    clicked?: (() => void) | null | undefined
  }) {
  const isCompactMode = useSelector(appDataSliceOps.selectors.getIsCompactMode);
  const dispatch = useDispatch();

  const onClick = clicked ?? (() => {});

  const handleClick = () => {
    const switchToCompactMode = !isCompactMode;
    dispatch(appDataSliceOps.actions.setIsCompactMode(switchToCompactMode));
    appModeCssClass.value = getAppModeCssClassName(isCompactMode);
    localStorage.setItem(localStorageKeys.appIsCompactMode, switchToCompactMode ? trmrk.jsonBool.true : trmrk.jsonBool.false);
    onClick();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ColorThemeLabel>{ isCompactMode ? "Compact Mode" : "Full Mode" }</ColorThemeLabel>
      { isCompactMode ? <ToggleOnIcon /> : <ToggleOffIcon /> }
    </MenuItem>);
}
