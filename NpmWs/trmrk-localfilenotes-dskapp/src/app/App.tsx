import React, { useEffect, useState } from "react";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { ApiResponse } from "trmrk-axios";
import { apiSvc } from "../services/settings/api/api-service"; 

import { AppBarArgs } from "../components/appBar/AppBarArgs";
import LoadingAppBar from "../components/appBar/LoadingAppBar";

import ApiError from "../components/apiError/ApiError";

import { localStorageKeys, jsonBool, getJsonBool } from "./utils";
import { getAppTheme } from "../services/app-theme/app-theme";
import { AppConfigData } from "trmrk/src/notes-app-config"; 
import { reducer, actions, AppData } from "./app-data";

import MainEl from "../components/main/Main";
import { AppDataContext } from "./AppContext";

const LoadingEl = ({
  args
}: {
  args: AppBarArgs
}) => {
  return (<Paper className="trmrk-app-loading">
    <LoadingAppBar args={args} />
    <Container sx={{ position: "relative" }} maxWidth="xl"><h1>Loading...</h1></Container>
  </Paper>);
}

const LoadErrorEl = ({
  args
}: {
  args: AppBarArgs
}) => {
  return (<Paper className="trmrk-app-error">
    <LoadingAppBar args={args} />
    <Container sx={{ position: "relative" }} maxWidth="xl"><ApiError apiResp={args.resp} /></Container>
  </Paper>);
}

const AppEl = ({
  args
}: {
  args: AppBarArgs
}) => args.resp ? args.resp.isSuccessStatus ?
  <MainEl args={args} /> : <LoadErrorEl args={args} /> : <LoadingEl args={args} />;

const App = () => {
  const initialState = {
    isDarkMode: localStorage.getItem(localStorageKeys.appThemeIsDarkMode) === jsonBool.true
  } as AppData;

  const [ state, dispatch ] = React.useReducer(reducer, initialState);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ appSettingsResp, setAppSettingsResp ] = useState(null as ApiResponse<AppConfigData> | null);

  const appContext = {
    ...state,
    setIsDarkMode: (isDarkMode: boolean) => {
      localStorage.setItem(localStorageKeys.appThemeIsDarkMode, getJsonBool(isDarkMode));
      dispatch({ type: actions.SET_IS_DARK_MODE, payload: isDarkMode });
    },
    setAppConfig: (appConfig: AppConfigData) => {
      dispatch({ type: actions.SET_APP_CONFIG, payload: appConfig });
    }
  };

  const appTheme = getAppTheme({
    isDarkMode: state.isDarkMode
  });

  const appArgs = {
    appTheme: appTheme,
    darkModeToggled: (isDarkMode) => {
      appContext.setIsDarkMode(isDarkMode);
    },
    resp: appSettingsResp
  } as AppBarArgs;

  useEffect(() => {
    if (!isLoading && !appSettingsResp) {
      apiSvc.get<AppConfigData>("AppConfig").then(resp => {
        setAppSettingsResp(resp);
        setIsLoading(false);

        if (resp.isSuccessStatus) {
          appContext.setAppConfig(resp.data);
        }
      });
      setIsLoading(true);
    }
  }, []);

  return (
    <AppDataContext.Provider value={appContext}>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />
        <AppEl args={appArgs} />
      </ThemeProvider>
    </AppDataContext.Provider>
  );
};

export default App;
