import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import appDataStore from "../store/appDataStore";

import App from './App';

import { appCfg, AppConfig } from "../services/appConfig";
import { normalizeStorageOption, normalizeStorageOptionsArr } from "../services/storageOptions";
import { localStorageKeys } from "../services/utils";

import devAppConfig from "./env/dev/app-config.json";
import prodAppConfig from "./env/prod/app-config.json";

export const createApp = () => {
  let appConfig: AppConfig;

  if (process.env.NODE_ENV === 'development') {
    appConfig = devAppConfig as AppConfig;
  } else {
    appConfig = prodAppConfig as AppConfig
  }

  if (appConfig.storageOptions) {
    appConfig.storageOptions = normalizeStorageOptionsArr(appConfig.storageOptions)!;
  }

  if (appConfig.singleStorageOption) {
    appConfig.singleStorageOption = normalizeStorageOption(appConfig.singleStorageOption);
  }

  appCfg.value = appConfig;

  const notesStorageOption = appConfig.singleStorageOption ?? normalizeStorageOption(
    localStorage.getItem(localStorageKeys.storageOption), false
  );

  const container = document.getElementById('app-root')!;
  const root = createRoot(container);

  root.render(
    <Provider store={appDataStore}>
      <App notesStorageOption={notesStorageOption} />
    </Provider>);
}
