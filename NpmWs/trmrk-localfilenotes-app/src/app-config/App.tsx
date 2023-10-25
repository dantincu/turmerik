import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

import { ApiConfigData, ApiResponse } from "trmrk-axios";
import { AppSettings, AppSettingsData } from "../services/settings/app-settings";
import { apiSvc } from "../services/settings/api/api-service"; 
import { getAppSettings, setAppSettings } from '../store/app-settings';
import { getDarkMode, setDarkMode } from '../store/app-theme';

import { getAppTheme, AppTheme } from "../services/app-theme/app-theme";
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

  const [ isLoading, setIsLoading ] = useState(true);
  const [ appSettingsResp, setAppSettingsResp ] = useState({} as ApiResponse<AppSettingsData>);
  const [ isDarkMode, setIsDarkMode ] = useState(false);

  const appTheme = getAppTheme({
    isDarkMode
  });

  const appArgs = {
    appTheme: appTheme,
    resp: appSettingsResp,
    darModeToggled: switchToDarkMode => {
      dispatch(setDarkMode(switchToDarkMode));
      setIsDarkMode(switchToDarkMode);
    }
  } as AppBarArgs;

  const dispatch = useDispatch();

  useEffect(() => {
    apiSvc.get<AppSettingsData>("AppSettings").then(resp => {
      setAppSettingsResp(resp);
      setIsLoading(false);

      if (resp.isSuccessStatus) {
        dispatch(setAppSettings(resp.data));
      }
    });
  }, []);

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
