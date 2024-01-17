import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { appCfg, TrmrkNotesStorageOption } from "../services/appConfig";
import { TrmrkNotesStorageOptionData } from "../services/appData";
import { getShowAppBar, getShowAppBarToggleBtn, setShowAppBar, getIsCompactMode, setShowAppBarToggleBtn, getIsDarkMode } from "../store/appDataSlice";
import { getAskUser, setAskUser, getOption, setOption } from "../store/storageOptionSlice";
import { getAppTheme, currentAppTheme } from "../services/app-theme/app-theme";
import { getAppModeCssClassName, appModeCssClass, appModeCssClasses, localStorageKeys } from "../services/utils";

import AppSetupPage from "../pages/appSetup/AppSetupPage";
import MainContentContainer from "../components/mainContent/MainContainer";

import TrmrkAppBar from "../components/appBar/TrmrkAppBar";
import AppSetupBar from "../components/appBar/appSetup/AppSetupBar";
import ToggleAppBarButton from "../components/appBar/ToggleAppBarButton";

interface FloatingBarTopOffset {
  headerIsHidden: boolean;
  appBarHeight: number;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

const offset: FloatingBarTopOffset = {
  headerIsHidden: false,
  appBarHeight: 0,
  lastBodyScrollTop: 0,
  lastHeaderTopOffset: 0
}

export default function App({
    notesStorageOption
  }: {
    notesStorageOption: TrmrkNotesStorageOption | null
  }) {
  const showAppBar = useSelector(getShowAppBar);
  const showAppBarToggleBtn = useSelector(getShowAppBarToggleBtn);
  const isCompactMode = useSelector(getIsCompactMode);
  const isDarkMode = useSelector(getIsDarkMode);
  const storageOption = useSelector(getOption);
  const askUser = useSelector(getAskUser);

  const dispatch = useDispatch();
  const appConfig = appCfg.value;

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const appHeaderEl = useRef<HTMLDivElement | null>(null);
  const appBodyEl = useRef<HTMLDivElement | null>(null);

  const onSetAppHeaderEl = (appHeaderElem: HTMLDivElement | null) => {
    appHeaderEl.current = appHeaderElem;
  }

  const onSetAppBodyEl = (appBodyElem: HTMLDivElement) => {
    appBodyEl.current = appBodyElem;
  }

  const onUpdateFloatingBarTopOffset = () => {
    const appBarEl = appHeaderEl.current;
    const appMainEl = appBodyEl.current;

    if (appBarEl && offset.appBarHeight === 0) {
      offset.appBarHeight = appBarEl.clientHeight;
    }
    
    if (appMainEl) {
      const bodyScrollTop = appMainEl.scrollTop;
      const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
      offset.lastBodyScrollTop = bodyScrollTop;

      if (appBarEl) {
        if ((bodyScrollTop ?? 0) >= 0) {
          // on iOs this property can be negative when dragging by the top of the page

          if (offset.headerIsHidden) {
            offset.headerIsHidden = false;
            offset.lastHeaderTopOffset = 0;
            appMainEl.style.top = offset.appBarHeight + "px";
          } else {
            offset.lastHeaderTopOffset = Math.max(-1 * offset.appBarHeight, Math.min(0, offset.lastHeaderTopOffset - bodyScrollTopDiff));
            appBarEl.style.top = offset.lastHeaderTopOffset + "px";

            appMainEl.style.top =
              offset.lastHeaderTopOffset + (offset.appBarHeight ?? 0) + "px";
          }
        }
      } else {
        offset.lastHeaderTopOffset = 0;
        appMainEl.style.top = "0px";
        offset.headerIsHidden = true;
      }
    }
  }

  useEffect(() => {
    if (!storageOption) {
      if (!askUser) {
        if (notesStorageOption) {
          dispatch(setOption(notesStorageOption));
        } else {
          dispatch(setShowAppBar(false));
          dispatch(setShowAppBarToggleBtn(false));
          dispatch(setAskUser(true));
        }
      }
    }
    
    onUpdateFloatingBarTopOffset();
  }, [ appHeaderEl.current, appBodyEl.current, isCompactMode, storageOption, showAppBar, askUser, showAppBarToggleBtn ]);

  const appBarWrapperSx = {width: "100%", height: "5em", position: "absolute", top: "0px" };
  const appSetupBarWrapperSx = {...appBarWrapperSx};

  return (
    <BrowserRouter basename={appConfig.basePath ?? "/" }>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />

          { (!askUser) ? (
            <Box className={[ "trmrk-app", appThemeClassName, appModeCssClass.value ].join(" ")}>

              <ToggleAppBarButton onUpdateFloatingBarTopOffset={onUpdateFloatingBarTopOffset} />

              { showAppBar ? (<Box className="trmrk-app-bar" sx={appBarWrapperSx}>
                  <TrmrkAppBar setAppHeaderEl={onSetAppHeaderEl} />
                </Box>) : null }

              <MainContentContainer onUserScroll={onUpdateFloatingBarTopOffset} setAppBodyEl={onSetAppBodyEl} />

            </Box>) : (
            <Box className={[ "trmrk-app-setup", appThemeClassName, appModeCssClasses.compactMode ].join(" ")}>

              { (showAppBarToggleBtn) ? (
                <ToggleAppBarButton onUpdateFloatingBarTopOffset={onUpdateFloatingBarTopOffset} />) : null }

              { showAppBar ? (<Box className="trmrk-app-setup-bar" sx={appSetupBarWrapperSx}>
                  <AppSetupBar setAppHeaderEl={onSetAppHeaderEl} />
                </Box>) : null }

              <AppSetupPage onUserScroll={onUpdateFloatingBarTopOffset} setAppBodyEl={onSetAppBodyEl} />

            </Box>)}

      </ThemeProvider>
    </BrowserRouter>
  );
}
