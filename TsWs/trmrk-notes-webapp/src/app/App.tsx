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
import { getAppTheme, currentAppTheme } from "../services/app-theme/app-theme";
import { getAppModeCssClassName, appModeCssClass, appModeCssClasses } from "../services/utils";
import { FloatingBarTopOffset, updateFloatingBarTopOffset } from "../services/htmlDoc/floatingBarTopOffsetUpdater";

import AppSetupPage from "../pages/appSetup/AppSetupPage";
import MainContentContainer from "../components/mainContent/MainContainer";

import TrmrkAppBar from "../components/appBar/TrmrkAppBar";
import AppSetupBar from "../components/appBar/appSetup/AppSetupBar";

const offset: FloatingBarTopOffset = {
  showHeader: null,
  headerIsHidden: false,
  appBarHeight: null,
  lastBodyScrollTop: 0,
  lastHeaderTopOffset: 0
}

export default function App() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

  const showAppEl = appData.hasFilesRootLocation && appData.hasNotesRootLocation;

  const [ isCompactMode, setIsCompactMode ] = useState(appData.isCompactMode);

  const appTheme = getAppTheme({
    isDarkMode: appData.isDarkMode
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(appData);

  const appHeaderEl = useRef<HTMLDivElement | null>(null);
  const appBodyEl = useRef<HTMLDivElement | null>(null);

  const onSetAppHeaderEl = (appHeaderElem: HTMLDivElement) => {
    appHeaderEl.current = appHeaderElem;
    setAppBarHeight(appHeaderElem.clientHeight);
  }

  const onSetAppBodyEl = (appBodyElem: HTMLDivElement) => {
    appBodyEl.current = appBodyElem;
  }

  const onUpdateFloatingBarTopOffset = () => {
      updateFloatingBarTopOffset(
        offset, appHeaderEl?.current, appBodyEl?.current);
  }

  const onOnAppBarToggled = () => {
    const showAppBar = !appData.showAppBar;
    dispatch(setShowAppBar(showAppBar));

    offset.showHeader = showAppBar;
    onUpdateFloatingBarTopOffset();
  }

  useEffect(() => {
    offset.showHeader = (appData.isCompactMode != isCompactMode) ? true : null;

    if (offset.showHeader) {
      onUpdateFloatingBarTopOffset();
      setIsCompactMode(appData.isCompactMode);
    }
  }, [ appHeaderEl, appBodyEl, appData, isCompactMode ]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
          { showAppEl ? (<Box className={[ "trmrk-app", appThemeClassName, appModeCssClass.value ].join(" ")}>
            <IconButton onClick={onOnAppBarToggled} sx={{
              position: "fixed", top: "0px", right: "0px", zIndex: 1101 }}
              className={ appData.showAppBar ? "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" }>
              { appData.showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
            </IconButton>
            { appData.showAppBar ? <Box className={["trmrk-app-bar"].join(" ")} sx={{
                width: "100%", height: "5em", position: "absolute", top: "0px" }}>
              <TrmrkAppBar setAppHeaderEl={onSetAppHeaderEl} />
            </Box> : null }
            <MainContentContainer onUserScroll={onUpdateFloatingBarTopOffset} setAppBodyEl={onSetAppBodyEl} />
          </Box>) : <Box className={[ "trmrk-app-setup", appThemeClassName, appModeCssClasses.compactMode ].join(" ")}>
            <AppSetupBar />
            <AppSetupPage />
          </Box>
        } 
      </ThemeProvider>
    </BrowserRouter>
  );
}
