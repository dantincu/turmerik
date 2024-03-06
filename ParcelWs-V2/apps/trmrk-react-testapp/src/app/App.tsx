import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Button  from "@mui/material/Button";
import Paper  from "@mui/material/Paper";
import AppBar  from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import { appDataReducers, appDataSelectors } from "../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../store/appBarDataSlice";
import { appBarDataSliceOps } from "../../../../../ParcelWs/apps/trmrk-devtools-webapp/src/store/appBarDataSlice";

import AppModule from "trmrk-react/src/components/appModule/AppModule";
import "./App.scss";

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

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
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

  const handleRefreshClick = () => {
    setLastRefreshTmStmp(new Date());
  }

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
          headerContent={<AppBar className="trmrk-app-bar"></AppBar>}
          afterHeaderClassName="trmrk-app-header-toggle"
          afterHeaderContent={ showAppBarToggleBtn ? <IconButton>
            { showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }</IconButton> : null }
          bodyContent={
            <Paper className="trmrk-app-main-content">
              <Button sx={{ position: "fixed" }} onClick={handleRefreshClick}>Refresh</Button>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </Paper> }
          showHeader={showAppBar}
          alwaysShowHeader={!isCompactMode}
          isDarkMode={isDarkMode}
          lastRefreshTmStmp={lastRefreshTmStmp} />
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
