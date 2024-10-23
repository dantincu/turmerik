import { Router } from "@vaadin/router";

import { AppConfigData } from "../trmrk/notes-app-config";
import { isDevEnv } from "../trmrk/dev";

import { initApi } from "../trmrk-axios/core";
import { FsExplorerApi } from "../trmrk-axios/FsExplorerApi/api";

import {
  defaultAppTitlePropFactory,
  homePageUrlPropFactory,
} from "../trmrk-lithtml/components/AppLayout/core";

import { globalStyles as globalStylesArr } from "./domUtils/css";
import { CoreComponents } from "../trmrk-lithtml/components";
import { Components } from "./components";
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

  // console.log("Setup complete", new Date());
};

export const globalStyles = globalStylesArr;

export const AppComponents = {
  CoreComponents,
  Components,
};

export const runAppSetup = (appConfig: AppConfigData, isDev: boolean) => {
  isDevEnv.value = isDev ?? null;
  homePageUrlPropFactory.observable.value = "/app/home";
  defaultAppTitlePropFactory.observable.value = "Turmerik Notes";

  initApi(apiSvc, appConfig);

  driveExplorerApi.value = new FsExplorerApi(apiSvc, {
    isLocalFileNotes: appConfig.isLocalFileNotesApp,
    isLocalFilesWinOS: appConfig.isWinOS,
    relPath: "files",
  });

  (function () {
    initRouter();
  })();
};

export const icons = iconsObj;
