import { lazy } from "solid-js";
import { render } from "solid-js/web";

import { AppConfigData } from "../trmrk/notes-app-config";

const App = lazy(() => import("./components/App"));

export const runAppSetup = (appConfig: AppConfigData, isDev: boolean) => {
  const root = document.getElementById("root");
  const rootLoading = document.getElementById("rootLoading");

  const path = window.location.pathname.split('/').find(p => p.length);

  switch (path) {
    case "app":
      render(() => <App appConfig={appConfig} isDev={isDev} />, root!);
      break;
    case "note":
      render(() => <div>NOT FOUND</div>, root!);
      break;
    default:
      render(() => <div>NOT FOUND</div>, root!);
      break;
  }

  rootLoading!.remove();
};
