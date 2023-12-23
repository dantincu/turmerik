import React from 'react';
import { createRoot } from 'react-dom/client';

import { ApiConfigData } from "trmrk-axios/src/core";

import '../styles/index.scss';
import { cachedApiSvc } from "../services/settings/api/apiService"; 
import App from './App';

export const createApp = (
  apiConfig: ApiConfigData) => {
  cachedApiSvc.init({
    data: apiConfig,
  });

  const container = document.getElementById('app-root')!;
  const root = createRoot(container);
  root.render(<App />);
}

