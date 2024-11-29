import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import { AppContext, createAppData } from "./dataStore/core";

import { AppConfigData } from "../trmrk/notes-app-config";
import { isDevEnv } from "../trmrk/dev";

import { initApi } from "../trmrk-axios/core";
import { FsExplorerApi } from "../trmrk-axios/FsExplorerApi/api";

import { icons as iconsObj } from "./assets/icons";

import { apiSvc } from "./services/apiService";
import { driveExplorerApi } from "./services/DriveExplorerApi";

import App from "./components/App";
import NotFoundPage from "../trmrk-solidjs/components/Error/NotFoundPage";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./tailwindcss/output.css";
import "./styles/global/style.scss";

import * as bootstrapObj from "bootstrap";

export const runAppSetup = (appConfig: AppConfigData, isDev: boolean) => {
  isDevEnv.value = isDev ?? null;
  initApi(apiSvc, appConfig);

  driveExplorerApi.value = new FsExplorerApi(apiSvc, {
    isLocalFileNotes: appConfig.isLocalFileNotesApp,
    isLocalFilesWinOS: appConfig.isWinOS,
    relPath: "files",
  });
    
  const root = document.getElementById("root");
  const rootLoading = document.getElementById("rootLoading");

  const appData = createAppData();

  render(() => <AppContext.Provider value={appData}>
    <Router root={App}>
      <Route path="*paramName" component={NotFoundPage} />
    </Router>
  </AppContext.Provider>, root!);
  rootLoading!.remove();
};

export const icons = iconsObj;
export const bootstrap = bootstrapObj;
