import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper  from "@mui/material/Paper";

import AppBar  from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";
import { TrmrkError } from "trmrk/src/TrmrkError";

import AppModule from "trmrk-react/src/components/appModule/AppModule";

import { appDataSelectors, appDataReducers } from "../store/appDataSlice";
import { appBarSelectors, appBarReducers } from "../store/appBarDataSlice";

import "./App.scss";

import HomePage from "../pages/home/HomePage";
import ResizablesDemo from "../pages/resizablesDemo/ResizablesDemo";
import DevModule from "../components/devModule/DevModule";

import ToggleAppBarBtn from "trmrk-react/src/components/appBar/ToggleAppBarBtn";
import SettingsMenu from "../components/settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../components/settingsMenu/AppearenceSettingsMenu";

import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const appBar = useAppBar({
    appBarReducers: appBarReducers,
    appBarSelectors: appBarSelectors,
    appDataReducers: appDataReducers,
    appDataSelectors: appDataSelectors,
    appBarRowsCount: 2
  });
  
  const refreshBtnRef = React.createRef<HTMLButtonElement>();

  const updateHeaderHeight = (newAppBarRowsCount: number) => {
    const headerEl = appBar.headerRef.current!;
    const bodyEl = appBar.bodyRef.current!;

    const newHeaderHeight = newAppBarRowsCount * appBar.appBarRowHeightPx.current;

    headerEl.style.height = `${newHeaderHeight}px`;
    bodyEl.style.top = `${newHeaderHeight}px`;
    headerEl.style.top = "0px";

    appBar.setAppBarRowsCount(newAppBarRowsCount);
    appBar.setAppHeaderHeight(newHeaderHeight);
  }

  const increaseHeaderHeightBtnClicked = () => {
    updateHeaderHeight(appBar.appBarRowsCount + 1);
  }

  const decreaseHeaderHeightBtnClicked = () => {
    if (appBar.appBarRowsCount > 1) {
      updateHeaderHeight(appBar.appBarRowsCount - 1);
    }
  }

  const refreshCurrentPage = () => {
    window.location.reload();
  }

  useEffect(() => {
  }, [
    appBar.appTheme,
    refreshBtnRef,
    appBar.appBarRowsCount,
    appBar.lastRefreshTmStmp,
    appBar.appHeaderHeight,
    appBar.showAppBar,
    appBar.appSettingsMenuIsOpen,
    appBar.appearenceMenuIsOpen,
    appBar.appearenceMenuIconBtnEl,
    appBar.appBarRowHeightPx ]);

  if (error) {
    return (
      <ThemeProvider theme={appBar.appTheme.theme}>
        <CssBaseline />

        <Paper className={["trmrk-app-error", appBar.appThemeClassName].join(" ")}>
          <h2>Something went wrong:</h2>
          <pre>{((error as Error).message ?? error).toString()}</pre>
          { (error as TrmrkError).showPageRefreshOption !== false ? <Button onClick={refreshCurrentPage}>Try reloading the page</Button> : null }
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={appBar.appTheme.theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={
            <AppModule
              className={["trmrk-app"].join(" ")}
              headerClassName="trmrk-app-header"
              headerContent={<AppBar className="trmrk-app-module-bar">
                <IconButton onClick={appBar.handleSettingsClick} className="trmrk-icon-btn"><MenuIcon /></IconButton>
                <Link to="/"><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
                <IconButton className="trmrk-icon-btn" onClick={increaseHeaderHeightBtnClicked}><KeyboardArrowDownIcon /></IconButton>
                <IconButton className="trmrk-icon-btn" onClick={decreaseHeaderHeightBtnClicked}><KeyboardArrowUpIcon /></IconButton>
                <SettingsMenu
                  appTheme={appBar.appTheme}
                  appearenceMenuBtnRefAvailable={appBar.appearenceMenuBtnRefAvailable}
                  showMenu={appBar.appSettingsMenuIsOpen}
                  menuAnchorEl={appBar.settingsMenuIconBtnEl!}
                  menuClosed={appBar.handleSettingsMenuClosed}
                  appearenceMenuOpen={appBar.appearenceMenuOpen}>
                </SettingsMenu>
                <AppearenceSettingsMenu
                  appTheme={appBar.appTheme}
                  showMenu={appBar.appearenceMenuIsOpen}
                  isCompactMode={appBar.isCompactMode}
                  isDarkMode={appBar.isDarkMode}
                  compactModeToggled={appBar.handleCompactModeToggled}
                  darkModeToggled={appBar.handleDarkModeToggled}
                  menuClosed={appBar.handleSettingsMenuClosed}
                  appearenceMenuClosed={appBar.handleAppearenceMenuClosed}
                  menuAnchorEl={appBar.appearenceMenuIconBtnEl!}>
                </AppearenceSettingsMenu>
              </AppBar>}
              afterHeaderClassName="trmrk-app-module-header-toggle trmrk-icon-btn"
              afterHeaderContent={ appBar.showAppBarToggleBtn ? <ToggleAppBarBtn showAppBar={appBar.showAppBar} appBarToggled={appBar.appBarToggled} /> : null }
              bodyClassName="trmrk-app-body"
              showHeader={appBar.showAppBar}
              headerHeight={appBar.appHeaderHeight}
              pinHeader={!appBar.isCompactMode}
              isDarkMode={appBar.isDarkMode}
              isCompactMode={appBar.isCompactMode}
              lastRefreshTmStmp={appBar.lastRefreshTmStmp}
              scrollableX={true}
              scrollableY={appBar.isCompactMode}
              scrolling={appBar.appHeaderScrolling}
              bodyContent={<Outlet />} />
          }>
            <Route path="resizables-demo" element={
              <ResizablesDemo refreshBtnRef={refreshBtnRef} />}></Route>
            <Route path="" Component={HomePage}></Route>
          </Route>
          <Route path="/dev/*" element={
            <DevModule basePath="/dev" />
          } />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
