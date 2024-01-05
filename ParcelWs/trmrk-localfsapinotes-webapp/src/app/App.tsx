import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { AppData } from "../services/appData";
import { setAppBarHeight, setShowAppBar } from "../store/appDataSlice";
import { getAppTheme } from "../services/app-theme/app-theme";
import { getAppThemeCssClassName, getAppModeCssClassName } from "../services/utils";
import { FloatingBarTopOffset, updateFloatingBarTopOffset } from "../services/floatingBarTopOffsetUpdater";

import AppLoadingPage from "../pages/appLoading/AppLoadingPage";
import MainContent from "../components/mainContent/MainContent";

import TrmrkAppBar from "../components/appBar/TrmrkAppBar";
import AppLoadingBar from "../components/appBar/AppLoadingBar";

export default function App() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const appTheme = getAppTheme({
    isDarkMode: appData.isDarkMode
  });

  const appThemeClassName = getAppThemeCssClassName(appData);
  const appModeClassName = getAppModeCssClassName(appData);

  const appHeaderEl = useRef<HTMLDivElement | null>(null);
  const appBodyEl = useRef<HTMLDivElement | null>(null);

  const onSetAppHeaderEl = (appHeaderElem: HTMLDivElement) => {
    appHeaderEl.current = appHeaderElem;
    setAppBarHeight(appHeaderElem.clientHeight);
  }

  const onSetAppBodyEl = (appBodyElem: HTMLDivElement) => {
    appBodyEl.current = appBodyElem;
  }

  const offset: FloatingBarTopOffset = {
    showHeader: null,
    lastBodyScrollTop: 0,
    lastHeaderTopOffset: 0
  }

  const onUpdateFloatingBarTopOffset = () => {
      updateFloatingBarTopOffset(
        offset, appHeaderEl?.current, appBodyEl?.current, appData.appBarHeight);
  }

  const onOnAppBarToggled = () => {
    const showAppBar = !appData.showAppBar;
    dispatch(setShowAppBar(showAppBar));

    offset.showHeader = showAppBar;
    onUpdateFloatingBarTopOffset();
  }

  const onAppBodyUserScroll = () => {
    onUpdateFloatingBarTopOffset();
  }

  useEffect(() => {
    onUpdateFloatingBarTopOffset();
  }, [ appHeaderEl, appBodyEl, appData ]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
          { appData.hasFsApiRootDirHandle ? (<Box className={[ "trmrk-app", appThemeClassName, appModeClassName ].join(" ")}>
            <IconButton onClick={onOnAppBarToggled} sx={{
              position: "fixed", top: "0px", left: "0px", zIndex: 1101 }}
              className={ appData.showAppBar ? "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" }>
              { appData.showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
            </IconButton>
            { appData.showAppBar ? <Box className="trmrk-app-bar" sx={{
                width: "100%", height: "5em", position: "absolute", top: "0px" }}>
              <TrmrkAppBar setAppHeaderEl={onSetAppHeaderEl} />
            </Box> : null }
            <MainContent onUserScroll={onAppBodyUserScroll} setAppBodyEl={onSetAppBodyEl} />
          </Box>) : <Box className={[ "trmrk-app-loading", appThemeClassName ].join(" ")}>
            <AppLoadingBar />
            <AppLoadingPage />
          </Box>
        } 
      </ThemeProvider>
    </BrowserRouter>
  );
}
