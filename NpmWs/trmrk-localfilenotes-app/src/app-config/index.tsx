import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from '../store/store';

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

  root.render(
    <Provider store={store}>
      <App envName={envName} appConfig={appConfig} />
    </Provider>);
}

