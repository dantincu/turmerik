import { Router } from "@vaadin/router";

import {
  defaultAppTitlePropFactory,
  homePageUrlPropFactory,
} from "../trmrk-lithtml/components/AppLayout/core";

import { globalStyles as globalStylesArr } from "./domUtils/css";
import { Components } from "../trmrk-lithtml/components";
import { AppElement } from "./components/AppElement";
import { AppHomePageElement } from "./components/AppHomePage/AppHomePageElement";
import { icons as iconsObj } from "./assets/icons";
import { catchAllNotFound } from "./utilities/routing";

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
};

export const runAppSetup = () => {
  homePageUrlPropFactory.observable.value = "/app/home";
  defaultAppTitlePropFactory.observable.value = "Turmerik Notes";

  window.addEventListener("load", () => {
    initRouter();
  });

  console.log("Setup complete", new Date());
};

export const icons = iconsObj;
