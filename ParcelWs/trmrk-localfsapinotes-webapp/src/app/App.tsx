import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { AppData } from "../services/appData";
import { getAppTheme } from "../services/app-theme/app-theme";
import { appRoutes } from "../services/routes";
import { getAppThemeCssClassName, getAppModeCssClassName } from "../services/utils";
import { FloatingBarTopOffset, updateFloatingBarTopOffset } from "../services/floatingBarTopOffsetUpdater";

import HomePage from "../pages/home/HomePage";
import FilesHcyPage from "../pages/filesHcy/FilesHcyPage";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import TrmrkAppBar from "../components/appBar/TrmrkAppBar";

export default function App() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);

  const appTheme = getAppTheme({
    isDarkMode: appData.isDarkMode
  });

  const appThemeClassName = getAppThemeCssClassName(appData);
  const appModeClassName = getAppModeCssClassName(appData);
  
  const appHeaderEl = useRef<HTMLDivElement>(null);
  const appBodyEl = useRef<HTMLDivElement>(null);

  const offset: FloatingBarTopOffset = {
    lastBodyScrollTop: 0,
    lastHeaderTopOffset: 0
  }

  const onUpdateFloatingBarTopOffset = () => {
    updateFloatingBarTopOffset(
      offset, appHeaderEl, appBodyEl);
  }

  const onUserScroll = (ev: Event) => {
    onUpdateFloatingBarTopOffset();
  }

  useEffect(() => {
    const bodyEl = appBodyEl.current!;
    offset.lastBodyScrollTop = 0;

    bodyEl.addEventListener("scroll", onUserScroll);
    window.addEventListener("resize", onUserScroll);

    return () => {
      bodyEl.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", onUserScroll);
    };
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
        <Box className={[ "trmrk-app", appThemeClassName, appModeClassName ].join(" ")}>
          <Box className="trmrk-app-bar" ref={appHeaderEl} sx={{
              width: "100%", height: "5em", position: "absolute", top: "0px" }}>
            <TrmrkAppBar />
          </Box>
          <Box className="trmrk-app-main" ref={appBodyEl} sx={{
              width: "100%", overflowY: "scroll", position: "absolute",
              top: "5em", left: "0px", bottom: "0px", right: "0px" }}>
            <Routes>
              <Route path="" element={<Navigate to="/home" />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path={appRoutes.home} Component={HomePage} />
              <Route path={appRoutes.filesRoot} Component={FilesHcyPage} />
              <Route path="*" Component={NotFoundPage} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}
