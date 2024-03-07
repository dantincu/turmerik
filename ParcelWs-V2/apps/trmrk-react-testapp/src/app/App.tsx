import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper  from "@mui/material/Paper";
import Link  from "@mui/material/Link";
import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import AppModule from "trmrk-react/src/components/appModule/AppModule";

import { appDataSelectors } from "../store/appDataSlice";
import { appBarReducers } from "../store/appBarDataSlice";

import "./App.scss";

import HomePage from "../pages/home/HomePage";
import ResizablesDemo from "../pages/resizablesDemo/ResizablesDemo";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);
  const showAppBar = useSelector(appDataSelectors.getShowAppBar);
  const showAppBarToggleBtn = useSelector(appDataSelectors.getShowAppBarToggleBtn);

  const dispatch = useDispatch();

  const [ settingsMenuIconBtnEl, setSettingsMenuIconBtnEl ] = React.useState<null | HTMLElement>(null);
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

  useEffect(() => {
  }, [ ]);

  if (error) {
    return (
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />

        <Paper className={["trmrk-app-error", appThemeClassName].join(" ")}>
          <h2>Something went wrong:</h2>
          <pre>{((error as Error).message ?? error).toString()}</pre>
          { /* <Button onClick={resetError}>Try again</Button> */ }
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
        <AppModule
          className={["trmrk-app"].join(" ")}
          headerClassName="trmrk-app-header"
          headerContent={<AppBar className="trmrk-app-bar">
            <Link href="/"><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
          </AppBar>}
          afterHeaderClassName="trmrk-app-header-toggle trmrk-icon-btn"
          afterHeaderContent={ showAppBarToggleBtn ? <IconButton>
            { showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }</IconButton> : null }
          bodyClassName="trmrk-app-body"
          showHeader={showAppBar}
          pinHeader={!isCompactMode}
          isDarkMode={isDarkMode}
          isCompactMode={isCompactMode}
          lastRefreshTmStmp={lastRefreshTmStmp}
          scrollableX={true}
          scrollableY={isCompactMode}
          bodyContent={
        <Routes>
          <Route path="/resizables-demo" Component={ResizablesDemo}></Route>
          <Route path="/" Component={HomePage}></Route>
        </Routes>} />
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
