import trmrk from "../../../trmrk";
import { runAppSetup } from "../../appSetup.tsx";
import { AppConfigData } from "../../../trmrk/notes-app-config";

const viteMode = process.env.NODE_ENV!.trim();
const isDev = viteMode!.trim() === "development";

let promArr = [fetch("/config.json")];

if (isDev) {
  promArr.push(fetch("/config.private.json"));
}

promArr = promArr.map((prom) => prom.then((response) => response.json()));

Promise.all(promArr).then((responsesArr) => {
  const appConfig = trmrk.merge({}, responsesArr, null, true);
  console.log("appConfig", appConfig);
  runAppSetup(appConfig as any as AppConfigData, isDev);
});
