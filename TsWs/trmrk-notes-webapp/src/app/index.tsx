import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import appDataStore from "../store/appDataStore";

import App from './App';

import { appCfg, AppConfig } from "../services/appConfig";

import devAppConfig from "./env/dev/app-config.json";
import prodAppConfig from "./env/dev/app-config.json";

export const createApp = () => {
  let appConfig: AppConfig;

  if (process.env.NODE_ENV === 'development') {
    appConfig = devAppConfig as AppConfig;
  } else {
    appConfig = prodAppConfig as AppConfig
  }

  appConfig.apiIsLocalFiles = !!appConfig.apiHost && (
    appConfig.apiIsLocalFilesUnix || appConfig.apiIsLocalFilesWin);

  appCfg.value = appConfig;

  const container = document.getElementById('app-root')!;
  const root = createRoot(container);

  root.render(
    <Provider store={appDataStore}>
      <App />
    </Provider>);
}
