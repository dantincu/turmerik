import { runAppSetup } from "../../appSetup";
import { Router } from "@vaadin/router";

runAppSetup();

import { AppHomePageElement as AppHomePageElem } from "../../components/AppHomePageElement";

export const AppHomePageElement = AppHomePageElem;

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
      ],
    },
    {
      path: "/:any?",
      component: "trmrk-not-found-page",
    },
  ]);
};

window.addEventListener("load", () => {
  initRouter();
});
