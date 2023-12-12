import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import "../assets/favicon.ico"
import "../assets/Icon-32x30-nobg.png"
import App from './App';
import { ApiConfigData } from "trmrk-axios"; 

export const createApp = (
  envName: "dev" | "prod",
  appConfig: ApiConfigData) => {
  const container = document.getElementById('app-root')!;
  const root = createRoot(container);

  root.render(<App envName={envName} appConfig={appConfig} />);
}

