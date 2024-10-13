import { runAppSetup } from "../../appSetup";
import { Router } from "@vaadin/router";

runAppSetup();

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
      redirect: "/app/home",
    },
    {
      path: "/app/home",
      component: "trmrk-app",
      action: () =>
        import(
          "../../components/AppElement"
        ) as unknown as Promise<HTMLElement>,
    },
  ]);
};

window.addEventListener("load", () => {
  initRouter();
});
