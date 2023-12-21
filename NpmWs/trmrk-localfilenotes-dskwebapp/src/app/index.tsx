import React from 'react';
import { createRoot } from 'react-dom/client';

import { ApiConfigData } from "trmrk-axios";

import '../styles/index.scss';
import "../assets/favicon.ico"
import "../assets/Icon-32x30-nobg.png"
import { apiSvc } from "../services/settings/api/apiService"; 
import App from './App';

export const createApp = (
  apiConfig: ApiConfigData) => {
  apiSvc.init(apiConfig);

  const container = document.getElementById('app-root')!;
  const root = createRoot(container);
  root.render(<App />);
}

