import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import appDataStore from "../../store/appDataStore";

import "../../styles/index-any.scss"
import App from '../../app/App';

const container = document.getElementById('app-root')!;
const root = createRoot(container);

root.render(
  <Provider store={appDataStore}>
    <App />
  </Provider>);
