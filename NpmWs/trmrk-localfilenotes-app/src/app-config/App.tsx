import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { ApiConfigData, ApiResponse } from "trmrk-axios";
import { browser as trmrkBrwsr } from "trmrk-browser";

import { queryKeys } from "./utils";
import { AppSettingsData } from "../services/settings/app-settings";
import { apiSvc } from "../services/settings/api/api-service"; 
import { setAppSettings } from '../store/app-settings';
import { setDarkMode } from '../store/app-theme';

import { getAppTheme } from "../services/app-theme/app-theme";
import { AppBarArgs } from "../components/appBar/AppBarArgs";
import LoadingAppBar from "../components/appBar/LoadingAppBar";
import MainAppBar from "../components/appBar/LoadingAppBar";

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
    <Container sx={{ position: "relative" }} maxWidth="xl">{JSON.stringify(args.resp)}</Container>
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
  apiSvc.init(appConfig);

  const [ reduceSearchParams, setReduceSearchParams ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ appSettingsResp, setAppSettingsResp ] = useState({} as ApiResponse<AppSettingsData>);
  const [ isDarkMode, setIsDarkMode ] = useState(false);

  const appTheme = getAppTheme({
    isDarkMode
  });

  const appArgs = {
    appTheme: appTheme,
    resp: appSettingsResp,
    darkModeToggled: switchToDarkMode => {
      const appThemeMode = switchToDarkMode ? "dark" : "light";
      localStorage.setItem(queryKeys.appTheme, appThemeMode);
      
      dispatch(setDarkMode(switchToDarkMode));
      setIsDarkMode(switchToDarkMode);
    }
  } as AppBarArgs;

  const dispatch = useDispatch();

  useEffect(() => {
    if (reduceSearchParams) {
      setReduceSearchParams(false);
      
    } else {
      const [willSetReduceSearchParams, searchParams] = shouldReduceSearchParams(appArgs);
      const dfAppThemeQ = searchParams.get(queryKeys.dfAppTheme);

      if (willSetReduceSearchParams) {
        setReduceSearchParams(true);

        const newUrl = trmrkBrwsr.getRelUri(
          searchParams, q => {}, null, null, true
        );

        window.history.replaceState(null, "", newUrl);
      } else {
        const appThemeMode = localStorage.getItem(
          queryKeys.appTheme) ?? dfAppThemeQ;

        const isDarkModeVal = appThemeMode === "dark";

        if (isDarkMode !== isDarkModeVal) {
          setIsDarkMode(isDarkModeVal);
        }
        
        apiSvc.get<AppSettingsData>("AppSettings").then(resp => {
          setAppSettingsResp(resp);
          setIsLoading(false);

          if (resp.isSuccessStatus) {
            dispatch(setAppSettings(resp.data));
          }
        });
      }
    }
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
