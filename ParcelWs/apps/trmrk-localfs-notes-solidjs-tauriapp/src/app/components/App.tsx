import { ParentComponent } from 'solid-js';
import { ErrorBoundary } from "solid-js"

import { produce } from "solid-js/store";

import { Router, Route } from "@solidjs/router";

import { AppProvider } from "../dataStore/AppContext";

import AppLayout from "../../trmrk-solidjs/components/AppLayout/AppLayout";

import { AppData } from "../dataStore/core";

import { useAppContext } from "../dataStore/AppContext";

import { icons as iconsObj } from "../assets/icons";

import { apiSvc } from "../services/apiService";
import { driveExplorerApi } from "../services/DriveExplorerApi";

import { AppConfigData } from "../../trmrk/notes-app-config";
import { isDevEnv } from "../../trmrk/dev";

import { initApi } from "../../trmrk-axios/core";
import { FsExplorerApi } from "../../trmrk-axios/FsExplorerApi/api";

import NotFoundPage from "../../trmrk-solidjs/components/Error/NotFoundPage";
import ErrorPage from "../../trmrk-solidjs/components/Error/ErrorPage";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../tailwindcss/output.css";
import "../styles/global/style.scss";

import * as bootstrapObj from "bootstrap";

import HomePage from "./Pages/HomePage";

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

  /* setAppBodyPanel2Content(<p>panel 2</p>);
  setAppBodyPanel3Content(<p>panel 3</p>);
  setAppBodyPanel4Content(<p>panel 4</p>);

  const { appData, setAppDataFull, setAppData } = useAppContext();

  const updateDraft = produce((draft: AppData) => {
    draft.appLayout.isCompactMode = false;
    const explorer = draft.appLayout.explorerPanel;
    explorer.isEnabled = true;
    const appBody = draft.appLayout.appBody;
    appBody.splitOrientation = SplitPanelOrientation.Horizontal;
    appBody.firstContainerIsFurtherSplit = true;
    appBody.secondContainerIsFurtherSplit = true;
  });

  setAppDataFull(updateDraft); */

  return (<AppProvider>
    <ErrorBoundary fallback={(err, reset) => <ErrorPage errTitle="Error" errMessage={err.toString()} navBarChildren={
        <button onClick={reset} class="btn btn-primary">Reset</button>
      } />}>
      <Router>
        <Route path="/app" component={AppLayout}>
          <Route path="" component={HomePage} />
          <Route path="*paramName" component={NotFoundPage} />
        </Route>
      </Router>
    </ErrorBoundary>
  </AppProvider>);
};

export default App;

export const icons = iconsObj;
export const bootstrap = bootstrapObj;
