import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import '../styles/index.scss';
import appDataStore from "../store/appDataStore";

import { ApiConfigData } from "trmrk-axios/src/core";
import { cachedApiSvc } from "../services/settings/api/apiService"; 
import App from './App';

const appConfigData: ApiConfigData = {
  apiHost: process.env.API_HOST!,
  apiRelUriBase: process.env.API_REL_URI_BASE!,
  clientVersion: parseFloat(process.env.CLIENT_VERSION!)
}

const createApp = (
  apiConfig: ApiConfigData) => {
  cachedApiSvc.init({
    data: apiConfig,
  });

  const container = document.getElementById('app-root')!;
  const root = createRoot(container);

  root.render(
    <Provider store={appDataStore}>
      <App />
    </Provider>);
}

createApp(appConfigData);
