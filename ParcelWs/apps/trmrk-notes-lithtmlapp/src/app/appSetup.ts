import { Router } from "@vaadin/router";

import { AppConfigData } from "../trmrk/notes-app-config";
import { isDevEnv } from "../trmrk/dev";

import { initApi } from "../trmrk-axios/core";
import { DriveExplorerApi } from "../trmrk-axios/DriveExplorerApi/api";

import {
  defaultAppTitlePropFactory,
  homePageUrlPropFactory,
} from "../trmrk-lithtml/components/AppLayout/core";

import { globalStyles as globalStylesArr } from "./domUtils/css";
import { Components } from "../trmrk-lithtml/components";
import { AppElement } from "./components/AppElement";
import { AppHomePageElement } from "./components/AppHomePage/AppHomePageElement";
import { FolderEntriesListPageElement } from "./components/FolderEntriesListPage/FolderEntriesListPageElement";
import { icons as iconsObj } from "./assets/icons";
import { catchAllNotFound } from "./utilities/routing";

import { apiSvc } from "./services/apiService";
import { driveExplorerApi } from "./services/DriveExplorerApi";

const initRouter = () => {
  var appElem = document.querySelector("#app") as HTMLDivElement;
  appElem.innerText = "";
  const router = new Router(appElem);

  router.setRoutes([
    {
      path: "/",
      redirect: "/app",
    },
    {
      path: "/app/:app*",
      component: "trmrk-app",
    },
    catchAllNotFound("any"),
  ]);
};

export const globalStyles = globalStylesArr;

export const AppComponents = {
  Components,
  AppElement,
  AppHomePageElement,
  FolderEntriesListPageElement,
};

export const runAppSetup = (appConfig: AppConfigData, isDev: boolean) => {
  isDevEnv.value = isDev ?? null;
  homePageUrlPropFactory.observable.value = "/app/home";
  defaultAppTitlePropFactory.observable.value = "Turmerik Notes";

  initApi(apiSvc, appConfig);

  driveExplorerApi.value = new DriveExplorerApi(apiSvc, {
    isLocalFileNotes: appConfig.isLocalFileNotesApp,
    isLocalFilesWinOS: appConfig.isWinOS,
  });

  window.addEventListener("load", () => {
    initRouter();
  });

  console.log("Setup complete", new Date());
};

export const icons = iconsObj;
