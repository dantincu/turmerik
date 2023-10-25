import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

import { ApiConfigData, ApiResponse } from "trmrk-axios";
import { AppSettings, AppSettingsData } from "../services/settings/app-settings";
import { apiSvc } from "../services/settings/api/api-service"; 
import { getAppSettings, setAppSettings } from '../store/app-settings';
import { getDarkMode, setDarkMode } from '../store/app-theme';

import { getAppTheme } from "../services/app-theme/app-theme";

const LoadingEl = () => {
  return (<Paper className="trmrk-app-loading">Loading...</Paper>);
}

const LoadErrorEl = ({
  resp
}: {
  resp: ApiResponse<AppSettingsData>
}) => {
  return (<Paper className="trmrk-app-error">{JSON.stringify(resp)}</Paper>);
}

const AppEl = () => {
  const appSettings = useSelector(getAppSettings);
  return (<Paper className="trmrk-app">{JSON.stringify(appSettings)}</Paper>);
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

  const appMode = useSelector(getDarkMode);
  const appTheme = getAppTheme(appMode);

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
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      { isLoading ? <LoadingEl /> : appSettingsResp.isSuccessStatus ? <AppEl></AppEl> : <LoadErrorEl resp={appSettingsResp} /> }
    </ThemeProvider>
  );
}
