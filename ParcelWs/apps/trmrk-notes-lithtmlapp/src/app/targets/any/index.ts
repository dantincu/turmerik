import { runAppSetup } from "../../appSetup";

import { AppConfigData } from "../../../trmrk/notes-app-config";
const isDev = process.env.NODE_ENV!.trim() === "dev";

fetch("/config.json").then((response) => {
  response.json().then((appConfig) => {
    runAppSetup(appConfig as AppConfigData, isDev);
  });
});
