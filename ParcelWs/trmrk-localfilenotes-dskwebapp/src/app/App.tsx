import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { ApiResponse, ApiServiceType } from "trmrk-axios/src/core";
import { TrmrkDBResp } from "trmrk-browser-core/src/indexedDB/core";
import { cachedApiSvc } from "../services/settings/api/apiService"; 

import { AppBarArgs } from "../components/appBar/AppBarArgs";
import LoadingAppBar from "../components/appBar/LoadingAppBar";

import ApiError from "../components/apiError/ApiError";

import { getAppTheme } from "../services/app-theme/app-theme";
import { AppConfigData } from "trmrk/src/notes-app-config"; 
import { AppData, AppPagesData } from "../services/appData";
import { setAppConfig } from "../store/appDataSlice";
import { cacheKeys } from "../services/localForage";

import MainEl from "../components/main/Main";

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
  <MainEl /> : <LoadErrorEl args={args} /> : <LoadingEl args={args} />;

const App = () => {
  const appPages = useSelector<{ appPages: AppPagesData }, AppPagesData>(state => state.appPages);
  const dispatch = useDispatch();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ appSettingsResp, setAppSettingsResp ] = useState(null as ApiResponse<AppConfigData> | null);

  const appTheme = getAppTheme({
    isDarkMode: appPages.isDarkMode
  });

  const appArgs = {
    resp: appSettingsResp,
  } as AppBarArgs;

  useEffect(() => {
    if (!isLoading && !appSettingsResp) {
      cachedApiSvc.req<AppConfigData>({
        apiCall: async (apiSvc: ApiServiceType) => await apiSvc.get<AppConfigData>("AppConfig"),
        localForageGet: async () => {
          const data = await cachedApiSvc.dfCacheDb.appConfig.getItem<AppConfigData>(cacheKeys.appConfig);

          const dbResp: TrmrkDBResp<AppConfigData> = {
            // cacheMatch: false,
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
        setAppSettingsResp(resp);
        setIsLoading(false);

        if (resp.isSuccessStatus) {
          cachedApiSvc.initMainCacheDb(resp.data.clientUserUuid);
          dispatch(setAppConfig(resp.data));
        }
      }, reason => {
        setAppSettingsResp({
          error: reason,
          errTitle: "Error",
          errMessage: `An unhandled error has occurred: ${reason}`
        } as ApiResponse<AppConfigData>);

        setIsLoading(false);
      });
      setIsLoading(true);
    }
  }, []);

  return (
    <ThemeProvider theme={appTheme.theme}>
      <CssBaseline />
      <AppEl args={appArgs} />
    </ThemeProvider>
  );
};

export default App;
