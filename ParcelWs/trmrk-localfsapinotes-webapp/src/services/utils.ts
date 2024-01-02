import { AppConfigData } from "trmrk/src/notes-app-config";
import { AppData } from "./appData";
import { updateHtmlDocTitle } from "./htmlDoc/htmlDocTitle";

export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const queryKeys = Object.freeze({});

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
  appIsCompactMode: "appIsCompactMode",
});

export const defaultAppTitle = "Turmerik Notes";

export const updateAppTitle = (
  appConfig: AppConfigData,
  idnf: string | null | undefined,
  idnfIsPath: boolean = true
) => {
  if (idnf && idnfIsPath) {
    idnf = idnf
      .split(appConfig.pathSep)
      .filter((seg) => seg.trim())
      .splice(-1, 1)[0];
  }

  let htmlDocTitle = defaultAppTitle;

  if (idnf) {
    htmlDocTitle = idnf + " - " + htmlDocTitle;
  }

  updateHtmlDocTitle(htmlDocTitle);
};

export const getAppThemeCssClassName = (appData: AppData) => {
  const appThemeClassName = appData.isDarkMode
    ? "trmrk-theme-dark"
    : "trmrk-theme-light";

  return appThemeClassName;
};

export const getRoute = (routeBase: string, idnf: string) => {
  const encodedIdnf = encodeURIComponent(idnf);
  const route = [routeBase, encodedIdnf].join("/");
  return route;
};
