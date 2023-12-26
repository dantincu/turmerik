import React from 'react';
import { createRoot } from 'react-dom/client';

import { ApiConfigData } from "trmrk-axios/src/core";

import '../styles/index.scss';
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
  root.render(<App />);
}

createApp(appConfigData);
