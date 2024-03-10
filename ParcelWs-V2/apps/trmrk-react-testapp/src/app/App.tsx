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
import { AppPanelHeaderData, AppPanelHeaderOffset } from "trmrk-react/src/components/appPanel/AppPanel";

import { appDataSelectors, appDataReducers } from "../store/appDataSlice";
import { appBarSelectors, appBarReducers } from "../store/appBarDataSlice";

import "./App.scss";

import HomePage from "../pages/home/HomePage";
import ResizablesDemo from "../pages/resizablesDemo/ResizablesDemo";
import DevModule from "../components/devModule/DevModule";

import ToggleAppBarBtn from "trmrk-react/src/components/appBar/ToggleAppBarBtn";
import SettingsMenu from "../components/settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../components/settingsMenu/AppearenceSettingsMenu";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const [ appBarRowsCount, setAppBarRowsCount ] = React.useState(0);
  const [ appHeaderHeight, setAppHeaderHeight ] = React.useState<number | null>(null);

  const appBarRowHeightPx = 40;
  const refreshBtnRef = React.createRef<HTMLButtonElement>();
  const headerRef = React.useRef<HTMLDivElement>();
  const bodyRef = React.useRef<HTMLDivElement>();

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);
  const showAppBar = useSelector(appDataSelectors.getShowAppBar);
  const showAppBarToggleBtn = useSelector(appDataSelectors.getShowAppBarToggleBtn);

  const appSettingsMenuIsOpen = useSelector(appBarSelectors.getAppSettingsMenuIsOpen);
  const appearenceMenuIsOpen = useSelector(appBarSelectors.getAppearenceMenuIsOpen);

  const dispatch = useDispatch();

  const [ settingsMenuIconBtnEl, setSettingsMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);
  const [ appearenceMenuIconBtnEl, setAppearenceMenuIconBtnEl ] = React.useState<null | HTMLButtonElement>(null);
  const [ lastRefreshTmStmp, setLastRefreshTmStmp ] = React.useState(new Date());

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(appBarReducers.setAppSettingsMenuIsOpen(true));
  };

  const appearenceMenuBtnRefAvailable = (btnRef: HTMLButtonElement | null) => {
    setAppearenceMenuIconBtnEl(btnRef);
  }

  const handleSettingsMenuClosed = () => {
    dispatch(appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(appBarReducers.setAppearenceMenuIsOpen(false));
  }

  const handleAppearenceMenuClosed = () => {
    dispatch(appBarReducers.setAppearenceMenuIsOpen(false));
  }

  const appearenceMenuOpen = () => {
    dispatch(appBarReducers.setAppearenceMenuIsOpen(true));
  }

  const handleCompactModeToggled = (isCompactMode: boolean) => {
    dispatch(appDataReducers.setIsCompactMode(isCompactMode));
    dispatch(appBarReducers.setAppSettingsMenuIsOpen(false));
      dispatch(appBarReducers.setAppearenceMenuIsOpen(false));
  }

  const handleDarkModeToggled = (isDarkMode: boolean) => {
    dispatch(appDataReducers.setIsDarkMode(isDarkMode));
    dispatch(appBarReducers.setAppSettingsMenuIsOpen(false));
      dispatch(appBarReducers.setAppearenceMenuIsOpen(false));
  }

  const appBarToggled = (showAppBar: boolean) => {
    dispatch(appDataReducers.setShowAppBar(showAppBar));
  }

  const appHeaderScrolling = (data: AppPanelHeaderData, offset: AppPanelHeaderOffset) => {
    headerRef.current = data.headerEl;
    bodyRef.current = data.bodyEl;

    if (appBarRowsCount === 0) {
      const newAppBarRowsCount = Math.round(data.headerHeight / appBarRowHeightPx);
      setAppBarRowsCount(newAppBarRowsCount);
    }

    if (appHeaderHeight === null) {
      // console.log("data.headerHeight", data.headerHeight);
      setAppHeaderHeight(data.headerHeight);
    }
  }

  const updateHeaderHeight = (newAppBarRowsCount: number) => {
    const headerEl = headerRef.current!;
    const bodyEl = bodyRef.current!;

    const newHeaderHeight = newAppBarRowsCount * appBarRowHeightPx;

    headerEl.style.height = `${newHeaderHeight}px`;
    bodyEl.style.top = `${newHeaderHeight}px`;
    headerEl.style.top = "0px";

    setAppBarRowsCount(newAppBarRowsCount);
    setAppHeaderHeight(newHeaderHeight);
    // console.log("newHeaderHeight", newHeaderHeight);
  }

  const increaseHeaderHeightBtnClicked = () => {
    updateHeaderHeight(appBarRowsCount + 1);
  }

  const decreaseHeaderHeightBtnClicked = () => {
    if (appBarRowsCount > 1) {
      updateHeaderHeight(appBarRowsCount - 1);
    }
  }

  const refreshCurrentPage = () => {
    window.location.reload();
  }

  useEffect(() => {
  }, [
    appTheme,
    refreshBtnRef,
    appBarRowsCount,
    lastRefreshTmStmp,
    appHeaderHeight,
    showAppBar,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    appearenceMenuIconBtnEl ]);

  if (error) {
    return (
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />

        <Paper className={["trmrk-app-error", appThemeClassName].join(" ")}>
          <h2>Something went wrong:</h2>
          <pre>{((error as Error).message ?? error).toString()}</pre>
          { (error as TrmrkError).showPageRefreshOption !== false ? <Button onClick={refreshCurrentPage}>Try reloading the page</Button> : null }
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={
            <AppModule
              className={["trmrk-app"].join(" ")}
              headerClassName="trmrk-app-header"
              headerContent={<AppBar className="trmrk-app-module-bar">
                <IconButton onClick={handleSettingsClick} className="trmrk-icon-btn"><MenuIcon /></IconButton>
                <Link to="/"><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
                <IconButton className="trmrk-icon-btn" onClick={increaseHeaderHeightBtnClicked}><KeyboardArrowDownIcon /></IconButton>
                <IconButton className="trmrk-icon-btn" onClick={decreaseHeaderHeightBtnClicked}><KeyboardArrowUpIcon /></IconButton>
                <SettingsMenu
                  appTheme={appTheme}
                  appearenceMenuBtnRefAvailable={appearenceMenuBtnRefAvailable}
                  showMenu={appSettingsMenuIsOpen}
                  menuAnchorEl={settingsMenuIconBtnEl!}
                  menuClosed={handleSettingsMenuClosed}
                  appearenceMenuOpen={appearenceMenuOpen}>
                </SettingsMenu>
                <AppearenceSettingsMenu
                  appTheme={appTheme}
                  showMenu={appearenceMenuIsOpen}
                  isCompactMode={isCompactMode}
                  isDarkMode={isDarkMode}
                  compactModeToggled={handleCompactModeToggled}
                  darkModeToggled={handleDarkModeToggled}
                  menuClosed={handleSettingsMenuClosed}
                  appearenceMenuClosed={handleAppearenceMenuClosed}
                  menuAnchorEl={appearenceMenuIconBtnEl!}>
                </AppearenceSettingsMenu>
              </AppBar>}
              afterHeaderClassName="trmrk-app-module-header-toggle trmrk-icon-btn"
              afterHeaderContent={ showAppBarToggleBtn ? <ToggleAppBarBtn showAppBar={showAppBar} appBarToggled={appBarToggled} /> : null }
              bodyClassName="trmrk-app-body"
              showHeader={showAppBar}
              headerHeight={appHeaderHeight}
              pinHeader={!isCompactMode}
              isDarkMode={isDarkMode}
              isCompactMode={isCompactMode}
              lastRefreshTmStmp={lastRefreshTmStmp}
              scrollableX={true}
              scrollableY={isCompactMode}
              scrolling={appHeaderScrolling}
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
