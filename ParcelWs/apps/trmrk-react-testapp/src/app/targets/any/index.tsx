import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import appDataStore from "../../store/appDataStore";

import "../../../trmrk-react/styles/all.scss";
import "../../../trmrk-react/styles/themes.scss";
import "../../../trmrk-react/styles/devModule/all.scss";

import "../../styles/index-any.scss"

import App from '../../App';

import { createAppThemesMap } from "../../../trmrk-react/app-theme/core";

createAppThemesMap({}, {});

const container = document.getElementById('app-root')!;
const root = createRoot(container);

root.render(
  <Provider store={appDataStore}>
    <App />
  </Provider>);
