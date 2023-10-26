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

export default function App({
  envName,
  appConfig
}: {
  envName: "dev" | "prod",
  appConfig: ApiConfigData
}) {
  apiSvc.init(appConfig);

  const [ redirectToAppTheme, setRedirectToAppTheme ] = useState(false);
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
    if (redirectToAppTheme) {
      setRedirectToAppTheme(false);
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      const dfAppThemeQ = searchParams.get(queryKeys.dfAppTheme);
      const appThemeQ = searchParams.get(queryKeys.appTheme);
      const clearAppThemeQ = searchParams.get(queryKeys.clearAppTheme);

      if (appThemeQ) {
        const appThemeMode = appThemeQ === "light" ? "light" : "dark";
        localStorage.setItem(queryKeys.appTheme, appThemeMode);

        appArgs.darkModeToggled(appThemeQ === "dark");

        const newUrl = trmrkBrwsr.getRelUri(
          searchParams, q => q.delete(queryKeys.appTheme), null, null, true
        );

        window.history.replaceState(null, "", newUrl);
        setRedirectToAppTheme(true);
      } else {
        if (typeof clearAppThemeQ === "string") {
          localStorage.removeItem(queryKeys.appTheme);
        }

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
  }, [redirectToAppTheme, isDarkMode]);

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
