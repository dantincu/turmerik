import { Router } from "@vaadin/router";

import {
  defaultAppTitlePropFactory,
  homePageUrlPropFactory,
} from "../trmrk-lithtml/components/AppLayout/core";

import { globalStyles as globalStylesArr } from "./domUtils/css";
import { Components } from "../trmrk-lithtml/components";
import { AppHomePageElement as AppHomePageElem } from "./components/AppHomePage/AppHomePageElement";

const initRouter = () => {
  var appElem = document.querySelector("#app") as HTMLDivElement;
  appElem.innerText = "";
  const router = new Router(appElem);

  const catchAllNotFound = () => ({
    path: "/:any?",
    action: () => {
      const retElem = document.createElement("trmrk-not-found-page");
      retElem.setAttribute("showHomePageBtn", "");

      return retElem;
    },
  });

  router.setRoutes([
    {
      path: "/",
      redirect: "/app",
    },
    {
      path: "/app",
      children: [
        {
          path: "/",
          redirect: "/app/home",
        },
        {
          path: "/home",
          component: "trmrk-app-home-page",
        },
        catchAllNotFound(),
      ],
    },
    catchAllNotFound(),
  ]);
};

export const globalStyles = globalStylesArr;

export const AppComponents = {
  Components,
};

export const AppHomePageElement = AppHomePageElem;

export const runAppSetup = () => {
  homePageUrlPropFactory.observable.value = "/app";
  defaultAppTitlePropFactory.observable.value = "Turmerik Notes";

  window.addEventListener("load", () => {
    initRouter();
  });

  console.log("Setup complete", new Date());
};
