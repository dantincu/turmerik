import { render } from "solid-js/web";

import { AppConfigData } from "../trmrk/notes-app-config";
import { isDevEnv } from "../trmrk/dev";

import { initApi } from "../trmrk-axios/core";
import { FsExplorerApi } from "../trmrk-axios/FsExplorerApi/api";

import { icons as iconsObj } from "./assets/icons";

import { apiSvc } from "./services/apiService";
import { driveExplorerApi } from "./services/DriveExplorerApi";

import App from "./components/App";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./tailwindcss/output.css";
import "./styles/global/style.scss";

const root = document.getElementById("root");
render(() => <App />, root!);

export const runAppSetup = (appConfig: AppConfigData, isDev: boolean) => {
  isDevEnv.value = isDev ?? null;

  initApi(apiSvc, appConfig);

  driveExplorerApi.value = new FsExplorerApi(apiSvc, {
    isLocalFileNotes: appConfig.isLocalFileNotesApp,
    isLocalFilesWinOS: appConfig.isWinOS,
    relPath: "files",
  });
};

export const icons = iconsObj;
