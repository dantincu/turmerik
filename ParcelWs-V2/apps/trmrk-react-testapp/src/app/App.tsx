import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper  from "@mui/material/Paper";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { TrmrkError } from "trmrk/src/TrmrkError";

import { appDataSelectors, appDataReducers } from "../store/appDataSlice";
import { appBarSelectors, appBarReducers } from "../store/appBarDataSlice";

import "./App.scss";

import HomePage from "../pages/home/HomePage";
import ResizablesDemo from "../pages/resizablesDemo/ResizablesDemo";
import DevModule from "../components/devModule/DevModule";

import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";
import BasicAppModule from "trmrk-react/src/components/basicAppModule/BasicAppModule"

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
          <Route path="/"
            element={
              <BasicAppModule
                className="trmrk-app"
                headerClassName="trmrk-app-header"
                appBar={appBar}
                basePath="/"
                appBarClassName="trmrk-app-module-bar"
                appBarChildren={[
                  <IconButton key={0} className="trmrk-icon-btn" onClick={increaseHeaderHeightBtnClicked}><KeyboardArrowDownIcon /></IconButton>,
                  <IconButton key={1} className="trmrk-icon-btn" onClick={decreaseHeaderHeightBtnClicked}><KeyboardArrowUpIcon /></IconButton>]}
                bodyClassName="trmrk-app-body"
                bodyScrollableY={true}>
                  <Outlet />
              </BasicAppModule> }>

            <Route path="resizables-demo" element={
              <ResizablesDemo refreshBtnRef={refreshBtnRef} />}></Route>
            <Route path="" Component={HomePage}></Route>
          </Route>

          <Route path="/dev/*"
            element={
              <DevModule basePath="/dev" /> } />
        </Routes>

      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
