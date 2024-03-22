import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper  from "@mui/material/Paper";

import Button from "@mui/material/Button";

import { TrmrkError } from "trmrk/src/TrmrkError";

import { appDataSelectors } from "../store/appDataSlice";

import DevModule from "../modules/devModule/DevModule";

import AppModule from "../modules/appModule/AppModule";
import NotFound from "../pages/notFound/NotFound";

import {  getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode,
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const refreshCurrentPage = () => {
    window.location.reload();
  }

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
          <Route path="/app/*" element={ <AppModule basePath="/app" rootPath="/" /> } />
          <Route path="/dev/*" element={ <DevModule basePath="/dev" rootPath="/" /> } />
          <Route path="/" element={ <Navigate to="/app" /> } />
          <Route path="*" element={ <NotFound /> } />
        </Routes>

      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
