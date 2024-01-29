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
import { trmrk_react } from "trmrk-react";
const trmrkReactComponents = trmrk_react.components;

// const AppModuleCore = trmrkReactComponents.appModule.AppModuleCore;
// const DevTools = trmrkReactComponents.devTools.DevTools;
import AppModuleCore from "./AppModuleCore";
import DevTools from "./DevTools";
const AppSettingsMenu = trmrkReactComponents.appBar.appSettingsMenu.AppSettingsMenu;

import { appDataSliceOps } from "../store/appDataSlice";
import { appBarDataSliceOps } from "../store/appBarDataSlice";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const isCompactMode = useSelector(appDataSliceOps.selectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSliceOps.selectors.getIsDarkMode);
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
    dispatch(appDataSliceOps.actions.setAppSettingsMenuIsOpen(true));
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
        <AppModuleCore
          appDataSliceOps={appDataSliceOps}
          className={["trmrk-app-module", appThemeClassName, appModeCssClass.value].join(" ")}
          headerClassName="trmrk-app-bar"
          bodyClassName="trmrk-app-page"
          headerChildren={
            <AppBar sx={{ position: "relative", height: "100%", width: "100%" }}>
              <Box className="trmrk-top-bar" sx={{ marginRight: "2.5em" }}><IconButton sx={{ float: "left" }} className="trmrk-icon-btn-main trmrk-settings-btn"
                onClick={handleSettingsClick}>
                <MenuIcon /></IconButton>Turmerik Dev Tools</Box>
            </AppBar> }
          bodyChildren={<DevTools />} />
          
          <AppSettingsMenu
            menuAnchorEl={settingsMenuIconBtnEl!}
            appDataSliceOps={appDataSliceOps}
            appBarDataSliceOps={appBarDataSliceOps}></AppSettingsMenu>
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
