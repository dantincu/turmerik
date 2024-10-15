import { runAppSetup } from "../../appSetup";
import { Router, Route } from "@vaadin/router";

runAppSetup();

import { AppHomePageElement as AppHomePageElem } from "../../components/AppHomePageElement";

export const AppHomePageElement = AppHomePageElem;

const initRouter = () => {
  var appElem = document.querySelector("#app") as HTMLDivElement;
  appElem.innerText = "";
  const router = new Router(appElem);

  const catchAllNotFound = () => ({
    path: "/:any?",
    // component: "trmrk-not-found-page",
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

window.addEventListener("load", () => {
  initRouter();
});
