import trmrk from "../../../trmrk";
import { runAppSetup } from "../../appSetup";
import { AppConfigData } from "../../../trmrk/notes-app-config";

const isDev = process.env.NODE_ENV!.trim() === "dev";

let promArr = [fetch("/config.json")];

if (isDev) {
  promArr.push(fetch("/config.private.json"));
}

promArr = promArr.map((prom) => prom.then((response) => response.json()));

Promise.all(promArr).then((responsesArr) => {
  const appConfig = trmrk.merge({}, responsesArr, null, true);
  // console.log("appConfig", appConfig);
  runAppSetup(appConfig as any as AppConfigData, isDev);
});
