import { ParentComponent } from 'solid-js';
import { ErrorBoundary } from "solid-js"

import { Router, Route } from "@solidjs/router";

import { AppProvider } from "../dataStore/AppContext";

import AppLayout from "./AppLayout";

import { icons as iconsObj } from "../assets/icons";

import { apiSvc } from "../services/apiService";
import { driveExplorerApi } from "../services/DriveExplorerApi";

import { AppConfigData } from "../../trmrk/notes-app-config";
import { isDevEnv } from "../../trmrk/dev";

import { initApi } from "../../trmrk-axios/core";
import { FsExplorerApi } from "../../trmrk-axios/FsExplorerApi/api";

import ErrorPage from "../../trmrk-solidjs/components/Error/ErrorPage";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../tailwindcss/output.css";
import "../styles/global/style.scss";

import * as bootstrapObj from "bootstrap";

export interface AppProps {
  appConfig: AppConfigData;
  isDev: boolean;
}

const App: ParentComponent<AppProps> = (props) => {
  isDevEnv.value = props.isDev ?? null;
  initApi(apiSvc, props.appConfig);

  driveExplorerApi.value = new FsExplorerApi(apiSvc, {
    isLocalFileNotes: props.appConfig.isLocalFileNotesApp,
    isLocalFilesWinOS: props.appConfig.isWinOS,
    relPath: "files",
  });

  return (<AppProvider>
    <ErrorBoundary fallback={(err, reset) => <ErrorPage errTitle="Error" errMessage={err.toString()} navBarChildren={
        <button onClick={reset} class="btn btn-primary">Reset</button>
      } />}>
      <Router>
        <Route path="/app" component={AppLayout}>
        </Route>
        <Route path="/app/*paramName" component={AppLayout}>
        </Route>
      </Router>
    </ErrorBoundary>
  </AppProvider>);
};

export default App;

export const icons = iconsObj;
export const bootstrap = bootstrapObj;
