import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import AppBar  from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import { appDataReducers, appDataSelectors } from "../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../store/appBarDataSlice";
import { appBarDataSliceOps } from "../../../../../ParcelWs/apps/trmrk-devtools-webapp/src/store/appBarDataSlice";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);
  const dispatch = useDispatch();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);

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
      <div role="alert">
        <p>Something went wrong:</p>
        <pre className="trmrk-error">{((error as Error).message ?? error).toString()}</pre>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }

  console.log("appTheme.theme", appTheme.theme);

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
        
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
