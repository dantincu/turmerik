import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import "../../../trmrk-react/styles/all.scss";
import "../../../trmrk-react/styles/themes.scss";
import "../../../trmrk-react/styles/devModule/all.scss";

import "../../styles/index-any.scss"

import { AppConfigData } from "../../../../trmrk/notes-app-config";
import { appConfig } from '../../../services/appConfig';

import appConfigData from "../../env/any/app-config.json";
appConfig.register(appConfigData as unknown as AppConfigData);

import appDataStore from "../../../store/appDataStore";
import App from '../../../App';

import { createAppThemesMap } from "../../../../trmrk-react/app-theme/core";

createAppThemesMap({}, {});

const container = document.getElementById('app-root')!;
const root = createRoot(container);

root.render(
  <Provider store={appDataStore}>
    <App />
  </Provider>);
