import React, { useEffect, useState } from "react";

import localforage from "localforage";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";
import { ApiResponse } from "trmrk-axios";
import { TrmrkDBResp } from "trmrk-browser";
import { cachedApiSvc } from "../services/settings/api/apiService"; 

import { AppBarArgs } from "../components/appBar/AppBarArgs";
import LoadingAppBar from "../components/appBar/LoadingAppBar";

import ApiError from "../components/apiError/ApiError";

import { localStorageKeys, jsonBool } from "./utils";
import { getAppTheme } from "../services/app-theme/app-theme";
import { AppConfigData } from "trmrk/src/notes-app-config"; 
import { reducer, AppData } from "./appData";
import { cacheKeys } from "./localForage";

import MainEl from "../components/main/Main";
import { AppDataContext, createAppContext } from "./AppContext";

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
    isDarkMode: localStorage.getItem(localStorageKeys.appThemeIsDarkMode) === jsonBool.true,
    isCompactMode: localStorage.getItem(localStorageKeys.appIsCompactMode) !== jsonBool.false,
    baseLocation: trmrk.url.getBaseLocation(),
    htmlDocTitle: "Turmerik Local File Notes",
    appTitle: "Turmerik Local File Notes",
    appBarOpts: {}
  } as AppData;

  const [ state, dispatch ] = React.useReducer(reducer, initialState);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ appSettingsResp, setAppSettingsResp ] = useState(null as ApiResponse<AppConfigData> | null);

  const appContext = createAppContext(state, dispatch)

  const appTheme = getAppTheme({
    isDarkMode: state.isDarkMode
  });

  const appArgs = {
    appTheme: appTheme,
    isCompactMode: state.isCompactMode,
    resp: appSettingsResp,
    darkModeToggled: (isDarkMode) => {
      appContext.setIsDarkMode(isDarkMode);
    },
    appModeToggled: (isCompactMode) => {
      appContext.setIsCompactMode(isCompactMode);
    },
  } as AppBarArgs;

  useEffect(() => {
    if (!isLoading && !appSettingsResp) {
      cachedApiSvc.req<AppConfigData>({
        apiCall: async apiSvc => await apiSvc.get<AppConfigData>("AppConfig"),
        localForageGet: async () => {
          const data = await cachedApiSvc.dfCacheDb.appConfig.getItem<AppConfigData>(cacheKeys.appConfig);

          const dbResp: TrmrkDBResp<AppConfigData> = {
            cacheMatch: !!data,
            data: data!,
            cacheError: null
          }

          return dbResp;
        },
        localForageSet: async data => {
          await cachedApiSvc.dfCacheDb.appConfig.setItem<AppConfigData>(
            cacheKeys.appConfig, data);

          const dbResp: TrmrkDBResp<AppConfigData> = {
            cacheMatch: typeof data === "object",
            data: data!,
            cacheError: null
          }

          return dbResp;
        }
      }).then(resp => {
        cachedApiSvc.initMainCacheDb(resp.data.clientUserUuid);

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
