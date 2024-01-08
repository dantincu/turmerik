import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import styled from '@emotion/styled';

import AppBar from "@mui/material/AppBar";

import { AppData } from "../../../services/appData";
import { setIsDarkMode } from "../../../store/appDataSlice";
import { localStorageKeys, jsonBool } from "../../../services/utils";

const ColorThemeLabel = styled.span`
  padding-right: 1em
`;

export default function AppSetupBar() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    const switchToDarkMode = !appData.isDarkMode;
    dispatch(setIsDarkMode(switchToDarkMode));
    localStorage.setItem(localStorageKeys.appThemeIsDarkMode, switchToDarkMode ? jsonBool.true : jsonBool.false);
  };

  return (<AppBar sx={{ position: "relative", height: "2.5em" }} className={["trmrk-app-header" ].join(" ")}>
      <Button onClick={handleClick} sx={{ width: "10em", fontSize: "1em", color: "#FFF", textTransform: "none" }}>
        <ColorThemeLabel>{ appData.isDarkMode ? "Dark Mode" : "Light Mode" }</ColorThemeLabel>
        { appData.isDarkMode ? <DarkModeIcon /> :  <LightModeIcon /> }
      </Button>
    </AppBar>);
}
