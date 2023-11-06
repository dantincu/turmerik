import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { ApiConfigData, ApiResponse } from "trmrk-axios";
import { browser as trmrkBrwsr } from "trmrk-browser-core";

import { queryKeys } from "./utils";
import { AppConfigData } from "../services/settings/app-config";
import { cachedApiSvc } from "../services/settings/api/api-service"; 
import { setAppConfig } from '../store/app-config';
import { setDarkMode } from '../store/app-theme';

import { getAppTheme, AppTheme } from "../services/app-theme/app-theme";
import { AppBarArgs } from "../components/appBar/AppBarArgs";
import LoadingAppBar from "../components/appBar/LoadingAppBar";
import MainAppBar from "../components/appBar/MainAppBar";

import ApiError from "../components/apiError/ApiError";

interface AppEffectsArgs {
  appArgs: AppBarArgs,
  reduceSearchParams: boolean,
  setReduceSearchParams: React.Dispatch<React.SetStateAction<boolean>>,
  isDarkMode: boolean,
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
  setAppSettingsResp: React.Dispatch<React.SetStateAction<ApiResponse<AppConfigData>>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  disaptchSetAppSettings: (data: AppConfigData) => void
}

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
}) => {
  const appSettings = args.resp.data;

  return (<Paper className="trmrk-app">
    <MainAppBar args={args} />
    <Container sx={{ position: "relative" }} maxWidth="xl">{JSON.stringify(args.resp.data)}</Container>
  </Paper>);
}

const getAppArgs = (
  appTheme: AppTheme,
  appSettingsResp: ApiResponse<AppConfigData>,
  setDarkMode: (swToDarkMode: boolean) => void,
  setIsDarkMode: (swToDarkMode: boolean) => void) => ({
  appTheme: appTheme,
  resp: appSettingsResp,
  darkModeToggled: switchToDarkMode => {
    const appThemeMode = switchToDarkMode ? "dark" : "light";
    localStorage.setItem(queryKeys.appTheme, appThemeMode);
    
    setDarkMode(switchToDarkMode);
    setIsDarkMode(switchToDarkMode);
  }
} as AppBarArgs);

const runAppEffects = (
  args: AppEffectsArgs) => {
  if (args.reduceSearchParams) {
    args.setReduceSearchParams(false);

  } else {
    const [willSetReduceSearchParams, searchParams] = shouldReduceSearchParams(args.appArgs);

    if (willSetReduceSearchParams) {
      args.setReduceSearchParams(true);

      const newUrl = trmrkBrwsr.getRelUri(
        searchParams, q => {}, null, null, true
      );

      window.history.replaceState(null, "", newUrl);
    } else {
      const appThemeMode = localStorage.getItem(queryKeys.appTheme);
      const isDarkModeVal = appThemeMode === "dark";

      if (args.isDarkMode !== isDarkModeVal) {
        args.setIsDarkMode(isDarkModeVal);
      }
      
      cachedApiSvc.apiSvc.get<AppConfigData>("AppSettings").then(resp => {
        args.setAppSettingsResp(resp);
        args.setIsLoading(false);

        if (resp.isSuccessStatus) {
          args.disaptchSetAppSettings(resp.data);
        }
      });
    }
  }
}

const shouldReduceSearchParams = (appArgs: AppBarArgs): [boolean, URLSearchParams] => {
  const searchParams = new URLSearchParams(window.location.search);

  const appThemeQ = searchParams.get(queryKeys.appTheme);
  const clearAppThemeQ = searchParams.get(queryKeys.clearAppTheme);

  let willSetReduceSearchParams = false;

  if (typeof clearAppThemeQ === "string") {
    searchParams.delete(queryKeys.clearAppTheme);

    localStorage.removeItem(queryKeys.appTheme);
    willSetReduceSearchParams = true;
  }

  if (appThemeQ) {
    searchParams.delete(queryKeys.appTheme);

    const appThemeMode = appThemeQ === "light" ? "light" : "dark";
    localStorage.setItem(queryKeys.appTheme, appThemeMode);
    appArgs.darkModeToggled(appThemeQ === "dark");

    willSetReduceSearchParams = true;
  }

  return [willSetReduceSearchParams, searchParams];
}

export default function App({
  envName,
  appConfig
}: {
  envName: "dev" | "prod",
  appConfig: ApiConfigData
}) {
  cachedApiSvc.init({
    data: appConfig,
    dbName: "trmrkNotesDB",
    dbVersion: 1,
    onIdxedDBSuccess: (ev, db) => {
      trmrkBrwsr.indexedDB.getOrCreateDbStore();
      if (db.objectStoreNames.length === 0) {

      }
    }
  });

  const [ reduceSearchParams, setReduceSearchParams ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ appSettingsResp, setAppSettingsResp ] = useState({} as ApiResponse<AppConfigData>);
  const [ isDarkMode, setIsDarkMode ] = useState(false);

  const appTheme = getAppTheme({
    isDarkMode
  });

  const appArgs = getAppArgs(
    appTheme,
    appSettingsResp,
    swToDarkMode => dispatch(setDarkMode(swToDarkMode)),
    swToDarkMode => setIsDarkMode(swToDarkMode)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    runAppEffects({
      appArgs,
      reduceSearchParams,
      setReduceSearchParams,
      isDarkMode,
      setIsDarkMode,
      setAppSettingsResp,
      setIsLoading,
      disaptchSetAppSettings: value => dispatch(setAppConfig(value))
    });
  }, [reduceSearchParams, isDarkMode]);

  return (
    <ThemeProvider theme={appTheme.theme}>
      <CssBaseline />

      {
        isLoading ? <LoadingEl args={appArgs} /> : appSettingsResp.isSuccessStatus ?
        <AppEl  args={appArgs} /> :
        <LoadErrorEl args={appArgs} />
      }
    </ThemeProvider>
  );
}
