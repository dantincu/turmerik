import { v4 as uuidv4 } from "uuid";

import { AppData } from "./appData";

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

export const localForageKeys = Object.freeze({});

export const getLocalForageDbNameNewPfx = (
  uuidStr?: string | null | undefined
) => {
  uuidStr ??= uuidv4().replaceAll("-", "");
  const newPfx = `localFsApiNotes/${uuidStr}/`;

  return newPfx;
};

export const defaultAppTitle = "Turmerik Notes";

export const getAppThemeCssClassName = (appData: AppData) => {
  const appThemeClassName = appData.isDarkMode
    ? "trmrk-theme-dark"
    : "trmrk-theme-light";

  return appThemeClassName;
};

export const getAppModeCssClassName = (appData: AppData) => {
  const appModeClassName = appData.isCompactMode
    ? "trmrk-mode-compact"
    : "trmrk-mode-full";

  return appModeClassName;
};

export const getRoute = (routeBase: string, idnf: string) => {
  const encodedIdnf = encodeURIComponent(idnf);
  const route = [routeBase, encodedIdnf].join("/");
  return route;
};
