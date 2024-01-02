import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import '../styles/index.scss';
import appDataStore from "../store/appDataStore";

import App from './App';

const container = document.getElementById('app-root')!;
const root = createRoot(container);

root.render(
  <Provider store={appDataStore}>
    <App />
  </Provider>);

